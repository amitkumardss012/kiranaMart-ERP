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
exports.updateCategory = exports.getCategoryById = exports.getAllCategory = exports.createCategory = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const services_1 = require("../services");
const types_1 = require("../types/types");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
const categroy_validator_1 = require("../validators/categroy.validator");
const config_1 = require("../../config");
// Resolve upload directory relative to project root for reliability
const categoryUploadDir = path_1.default.resolve(process.cwd(), "upload", "category");
exports.createCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body with Zod
    const validData = categroy_validator_1.categoryValidator.safeParse(req.body);
    if (!validData.success) {
        console.log("Validation error:", validData.error); // Debug validation
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(validData.error),
        });
    }
    // Ensure upload directory exists
    try {
        yield promises_1.default.mkdir(categoryUploadDir, { recursive: true });
        console.log(`Upload directory ensured: ${categoryUploadDir}`); // Debug path
    }
    catch (error) {
        console.error("Failed to create upload directory:", error);
        throw new response_util_1.ErrorResponse("Failed to create upload directory", types_1.statusCode.Internal_Server_Error);
    }
    // Extract and process base64 image
    let imagePath = null;
    if (validData.data.image) {
        // Validate and extract base64 data
        const base64Prefix = /^data:image\/([a-z]+);base64,/;
        const match = validData.data.image.match(base64Prefix);
        if (!match) {
            throw new response_util_1.ErrorResponse("Invalid base64 image format", types_1.statusCode.Bad_Request);
        }
        // Get image extension from MIME type
        const extension = match[1];
        if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
            throw new response_util_1.ErrorResponse("Invalid image type. Only JPEG, PNG, and GIF are allowed.", types_1.statusCode.Bad_Request);
        }
        // Strip the data URL prefix and decode base64
        const base64Data = validData.data.image.replace(base64Prefix, "");
        let imageBuffer;
        try {
            imageBuffer = Buffer.from(base64Data, "base64");
            console.log(`Base64 decoded, buffer size: ${imageBuffer.length} bytes`); // Debug buffer
        }
        catch (error) {
            console.error("Base64 decoding error:", error);
            throw new response_util_1.ErrorResponse("Invalid base64 data", types_1.statusCode.Bad_Request);
        }
        // Generate unique filename
        const fileName = `${Date.now()}-image.${extension}`;
        const filePath = path_1.default.join(categoryUploadDir, fileName);
        // Save the image to the filesystem
        try {
            yield promises_1.default.writeFile(filePath, imageBuffer);
            console.log(`Image saved to: ${filePath}`); // Debug file write
            imagePath = `upload/category/${fileName}`;
        }
        catch (error) {
            console.error("Failed to save image:", error);
            throw new response_util_1.ErrorResponse("Failed to save image to filesystem", types_1.statusCode.Internal_Server_Error);
        }
    }
    const category = yield services_1.CategoryService.createCategory(validData.data, imagePath);
    return (0, response_util_1.SuccessResponse)(reply, "Category created successfully", category);
}));
exports.getAllCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const searchQuery = req.query.searchQuery || "";
    const where = {};
    if (searchQuery) {
        where.name = {
            contains: searchQuery,
        };
    }
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    const [categories, totalCategories] = yield Promise.all([
        services_1.CategoryService.getAllCategories(page, limit, where),
        config_1.prisma.category.count(),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "Categories fetched successfully", {
        categories,
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories,
        count: categories.length,
    });
}));
exports.getCategoryById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const category = yield services_1.CategoryService.getCategoryById(id);
    if (!category || category.id !== id)
        throw new response_util_1.ErrorResponse("Category not found", types_1.statusCode.Not_Found);
    return (0, response_util_1.SuccessResponse)(reply, "Category fetched successfully", category);
}));
exports.updateCategory = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
        return new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const validData = categroy_validator_1.categoryValidator.partial().safeParse(req.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const existingCategory = yield services_1.CategoryService.getCategoryById(id);
    if (!existingCategory) {
        throw new response_util_1.ErrorResponse("Category not found", types_1.statusCode.Not_Found);
    }
    let imagePath = existingCategory.image;
    if (validData.data.image) {
        const base64Prefix = /^data:image\/([a-z]+);base64,/;
        const match = validData.data.image.match(base64Prefix);
        if (!match) {
            throw new response_util_1.ErrorResponse("Invalid base64 image format", types_1.statusCode.Bad_Request);
        }
        const extension = match[1];
        if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
            throw new response_util_1.ErrorResponse("Invalid image type. Only JPEG, PNG, and GIF are allowed.", types_1.statusCode.Bad_Request);
        }
        const base64Data = validData.data.image.replace(base64Prefix, "");
        let imageBuffer;
        try {
            imageBuffer = Buffer.from(base64Data, "base64");
            console.log(`Base64 decoded, buffer size: ${imageBuffer.length} bytes`);
        }
        catch (error) {
            console.error("Base64 decoding error:", error);
            throw new response_util_1.ErrorResponse("Invalid base64 data", types_1.statusCode.Bad_Request);
        }
        const fileName = `${Date.now()}-image.${extension}`;
        const filePath = path_1.default.join(categoryUploadDir, fileName);
        try {
            yield promises_1.default.writeFile(filePath, imageBuffer);
            console.log(`Image saved to: ${filePath}`);
            imagePath = `upload/category/${fileName}`;
            // Delete old image if it exists
            if (existingCategory.image) {
                const oldFilePath = path_1.default.join(process.cwd(), existingCategory.image);
                yield promises_1.default.unlink(oldFilePath).catch((error) => {
                    console.warn(`Failed to delete old image ${oldFilePath}:`, error);
                });
            }
        }
        catch (error) {
            console.error("Failed to save image:", error);
            throw new response_util_1.ErrorResponse("Failed to save image", types_1.statusCode.Internal_Server_Error);
        }
    }
    // Update category
    const category = yield services_1.CategoryService.updateCategory(id, validData.data, imagePath);
    return (0, response_util_1.SuccessResponse)(reply, "Category updated successfully", category);
}));
