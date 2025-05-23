"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubCategory = exports.getSubCategoryById = exports.getAllSubCategory = exports.createSubCategory = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const types_1 = require("../types/types");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
const config_1 = require("../../config");
const subCategroy_validator_1 = require("../validators/subCategroy.validator");
// Upload directory for subcategory images
const subCategoryUploadDir = path_1.default.resolve(process.cwd(), "upload", "subcategory");
exports.createSubCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validData = subCategroy_validator_1.SubCategoryValidator.safeParse(req.body);
    if (!validData.success) {
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(validData.error),
        });
    }
    const data = validData.data;
    // Ensure upload directory exists
    try {
        yield promises_1.default.mkdir(subCategoryUploadDir, { recursive: true });
    }
    catch (error) {
        throw new response_util_1.ErrorResponse("Failed to create upload directory", types_1.statusCode.Internal_Server_Error);
    }
    let imagePath = null;
    if (data.image) {
        const base64Prefix = /^data:image\/([a-z]+);base64,/;
        const match = data.image.match(base64Prefix);
        if (!match) {
            throw new response_util_1.ErrorResponse("Invalid base64 image format", types_1.statusCode.Bad_Request);
        }
        const extension = match[1];
        if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
            throw new response_util_1.ErrorResponse("Only JPEG, PNG, and GIF are allowed", types_1.statusCode.Bad_Request);
        }
        const base64Data = data.image.replace(base64Prefix, "");
        let imageBuffer;
        try {
            imageBuffer = Buffer.from(base64Data, "base64");
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Invalid base64 data", types_1.statusCode.Bad_Request);
        }
        const fileName = `${Date.now()}-subcategory.${extension}`;
        const filePath = path_1.default.join(subCategoryUploadDir, fileName);
        try {
            yield promises_1.default.writeFile(filePath, imageBuffer);
            imagePath = `upload/subcategory/${fileName}`;
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Failed to save image", types_1.statusCode.Internal_Server_Error);
        }
    }
    const subCategory = yield config_1.prisma.subCategory.create({
        data: {
            name: data.name,
            description: data.description,
            image: imagePath !== null && imagePath !== void 0 ? imagePath : undefined,
            categoryId: data.categoryId,
            isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
        },
    });
    return (0, response_util_1.SuccessResponse)(reply, "SubCategory created successfully", subCategory);
}));
exports.getAllSubCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const searchQuery = req.query.searchQuery || "";
    const skip = (page - 1) * limit;
    const where = {};
    if (searchQuery) {
        where.name = {
            contains: searchQuery,
        };
    }
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    const [subCategories, totalSubCategories] = yield Promise.all([
        config_1.prisma.subCategory.findMany({
            where,
            skip,
            take: limit,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        config_1.prisma.subCategory.count({ where }),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "SubCategories fetched successfully", {
        subCategories,
        currentPage: page,
        totalPages: Math.ceil(totalSubCategories / limit),
        totalSubCategories,
        count: subCategories.length,
    });
}));
exports.getSubCategoryById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    }
    const subCategory = yield config_1.prisma.subCategory.findUnique({
        where: { id },
        include: {
            category: true,
        },
    });
    if (!subCategory) {
        throw new response_util_1.ErrorResponse("SubCategory not found", types_1.statusCode.Not_Found);
    }
    return (0, response_util_1.SuccessResponse)(reply, "SubCategory fetched successfully", subCategory);
}));
exports.updateSubCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    }
    const validData = subCategroy_validator_1.SubCategoryValidator.safeParse(req.body);
    if (!validData.success) {
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(validData.error),
        });
    }
    const existing = yield config_1.prisma.subCategory.findUnique({ where: { id } });
    if (!existing) {
        throw new response_util_1.ErrorResponse("SubCategory not found", types_1.statusCode.Not_Found);
    }
    // Ensure upload directory exists
    yield promises_1.default.mkdir(subCategoryUploadDir, { recursive: true });
    // Image handling
    let imagePath = existing.image;
    if (validData.data.image && validData.data.image.startsWith("data:image/")) {
        const base64Prefix = /^data:image\/([a-z]+);base64,/;
        const match = validData.data.image.match(base64Prefix);
        if (!match) {
            throw new response_util_1.ErrorResponse("Invalid base64 image format", types_1.statusCode.Bad_Request);
        }
        const extension = match[1];
        if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
            throw new response_util_1.ErrorResponse("Unsupported image type", types_1.statusCode.Bad_Request);
        }
        const base64Data = validData.data.image.replace(base64Prefix, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `${Date.now()}-subcategory.${extension}`;
        const filePath = path_1.default.join(subCategoryUploadDir, fileName);
        yield promises_1.default.writeFile(filePath, buffer);
        imagePath = `upload/subcategory/${fileName}`;
        // Optional: Delete old image if needed
        if (existing.image && existing.image !== imagePath) {
            const oldImagePath = path_1.default.resolve(process.cwd(), existing.image);
            yield promises_1.default.unlink(oldImagePath).catch(() => { });
        }
    }
    const updatedSubCategory = yield config_1.prisma.subCategory.update({
        where: { id },
        data: Object.assign(Object.assign({}, validData.data), { image: imagePath }),
    });
    return (0, response_util_1.SuccessResponse)(reply, "SubCategory updated successfully", updatedSubCategory);
}));
