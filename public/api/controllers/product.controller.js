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
exports.getProductByBarCode = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.listProduct = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const types_1 = require("../types/types");
const validators_1 = require("../validators");
const validators_2 = require("../validators");
const productUploadDir = path_1.default.resolve(process.cwd(), "upload", "product");
exports.listProduct = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate product data
    const validData = validators_1.ProductValidator.safeParse(req.body);
    if (!validData.success) {
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_2.zodError)(validData.error),
        });
    }
    if (validData.data.sku) {
        const existingSku = yield config_1.prisma.product.findUnique({
            where: { sku: validData.data.sku },
        });
        if (existingSku) {
            throw new response_util_1.ErrorResponse("SKU already exists", types_1.statusCode.Bad_Request);
        }
    }
    // Check if barcode already exists
    if (validData.data.barcode) {
        const existingBarcode = yield config_1.prisma.product.findUnique({
            where: { barcode: validData.data.barcode },
        });
        if (existingBarcode) {
            throw new response_util_1.ErrorResponse("Barcode already exists", types_1.statusCode.Bad_Request);
        }
    }
    const data = validData.data;
    let imagePath = null;
    // Handle image if provided
    if (data.image) {
        const base64Regex = /^data:image\/([a-z]+);base64,/;
        const match = data.image.match(base64Regex);
        if (!match) {
            throw new response_util_1.ErrorResponse("Invalid base64 image format", types_1.statusCode.Bad_Request);
        }
        const extension = match[1];
        if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
            throw new response_util_1.ErrorResponse("Only JPEG, PNG, and GIF formats are supported", types_1.statusCode.Bad_Request);
        }
        const base64Data = data.image.replace(base64Regex, "");
        let imageBuffer;
        try {
            imageBuffer = Buffer.from(base64Data, "base64");
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Failed to decode base64 image", types_1.statusCode.Bad_Request);
        }
        // Ensure upload directory exists
        try {
            yield promises_1.default.mkdir(productUploadDir, { recursive: true });
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Failed to create upload directory", types_1.statusCode.Internal_Server_Error);
        }
        // Generate unique filename and save
        const fileName = `${Date.now()}-product.${extension}`;
        const filePath = path_1.default.join(productUploadDir, fileName);
        try {
            yield promises_1.default.writeFile(filePath, imageBuffer);
            imagePath = `upload/product/${fileName}`;
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Failed to save image to server", types_1.statusCode.Internal_Server_Error);
        }
    }
    const createdProduct = yield config_1.prisma.product.create({
        data: Object.assign(Object.assign({}, data), { image: imagePath }),
    });
    return (0, response_util_1.SuccessResponse)(reply, "Product created successfully", createdProduct);
}));
exports.getAllProducts = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const subCategoryId = req.query.subCategoryId ? Number(req.query.subCategoryId) : undefined;
    const discountId = req.query.discountId ? Number(req.query.discountId) : undefined;
    const searchQuery = req.query.searchQuery || "";
    // Build where clause
    const where = {};
    if (searchQuery) {
        where.OR = [
            { name: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { brand: { contains: searchQuery } },
        ];
    }
    if (isActive !== undefined)
        where.isActive = isActive;
    if (categoryId)
        where.categoryId = categoryId;
    if (subCategoryId)
        where.subCategoryId = subCategoryId;
    if (discountId)
        where.discountId = discountId;
    // Fetch data from DB
    const [products, totalProducts] = yield Promise.all([
        config_1.prisma.product.findMany({
            where,
            skip,
            take: limit,
            include: {
                category: true,
                subCategory: true,
                discount: true,
            },
        }),
        config_1.prisma.product.count({ where }),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "Products fetched successfully", {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        count: products.length,
    });
}));
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    // Validate ID
    if (!id || isNaN(id)) {
        throw new response_util_1.ErrorResponse("Invalid product ID", types_1.statusCode.Bad_Request);
    }
    // Fetch product with related data
    const product = yield config_1.prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            subCategory: true,
            discount: true,
        },
    });
    if (!product) {
        throw new response_util_1.ErrorResponse("Product not found", types_1.statusCode.Not_Found);
    }
    return (0, response_util_1.SuccessResponse)(reply, "Product fetched successfully", product);
}));
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        throw new response_util_1.ErrorResponse("Invalid product ID", types_1.statusCode.Bad_Request);
    }
    const validData = validators_1.ProductValidator.partial().safeParse(req.body);
    if (!validData.success) {
        const zodErr = (0, validators_2.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const existingProduct = yield config_1.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new response_util_1.ErrorResponse("Product not found", types_1.statusCode.Not_Found);
    }
    // Handle image update
    let imagePath = existingProduct.image;
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
        }
        catch (error) {
            throw new response_util_1.ErrorResponse("Invalid base64 data", types_1.statusCode.Bad_Request);
        }
        const fileName = `${Date.now()}-product.${extension}`;
        const filePath = path_1.default.join(productUploadDir, fileName);
        // Ensure directory exists
        yield promises_1.default.mkdir(productUploadDir, { recursive: true });
        try {
            yield promises_1.default.writeFile(filePath, imageBuffer);
            imagePath = `upload/product/${fileName}`;
            // Delete old image
            if (existingProduct.image) {
                const oldFilePath = path_1.default.resolve(process.cwd(), existingProduct.image);
                yield promises_1.default.unlink(oldFilePath).catch((err) => {
                    console.warn(`Failed to delete old image: ${oldFilePath}`, err);
                });
            }
        }
        catch (err) {
            throw new response_util_1.ErrorResponse("Failed to save image", types_1.statusCode.Internal_Server_Error);
        }
    }
    // Update the product in DB
    const updatedProduct = yield config_1.prisma.product.update({
        where: { id },
        data: Object.assign(Object.assign({}, validData.data), { image: imagePath }),
    });
    return (0, response_util_1.SuccessResponse)(reply, "Product updated successfully", updatedProduct);
}));
exports.getProductByBarCode = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { barcode } = req.params;
    if (!barcode || typeof barcode !== "string") {
        throw new response_util_1.ErrorResponse("Invalid or missing barcode", types_1.statusCode.Bad_Request);
    }
    const product = yield config_1.prisma.product.findUnique({
        where: {
            barcode,
        },
        include: {
            category: true,
            subCategory: true,
            discount: true,
        },
    });
    if (!product) {
        throw new response_util_1.ErrorResponse("Product not found with given barcode", types_1.statusCode.Not_Found);
    }
    return (0, response_util_1.SuccessResponse)(reply, "Product fetched successfully", product);
}));
