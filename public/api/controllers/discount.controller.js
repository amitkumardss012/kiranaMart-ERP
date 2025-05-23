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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiscount = exports.getDiscountById = exports.getAllDiscounts = exports.createDiscount = void 0;
const config_1 = require("../../config");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const discount_validator_1 = require("../validators/discount.validator");
const validators_1 = require("../validators");
const types_1 = require("../types/types");
exports.createDiscount = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = discount_validator_1.discountValidator.safeParse(req.body);
    if (!parsed.success) {
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(parsed.error),
        });
    }
    const data = parsed.data;
    // Step 2: Logical validations
    const now = new Date();
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start >= end) {
        throw new response_util_1.ErrorResponse("End date must be later than start date.", types_1.statusCode.Bad_Request);
    }
    if (start < now) {
        throw new response_util_1.ErrorResponse("Start date cannot be in the past.", types_1.statusCode.Bad_Request);
    }
    if (data.discountType === "BOGO" && (!data.buyQty || !data.getQty)) {
        throw new response_util_1.ErrorResponse("BOGO discount must have buyQty and getQty", types_1.statusCode.Bad_Request);
    }
    if (data.discountType === "BOGO") {
        if (data.value) {
            throw new response_util_1.ErrorResponse("BOGO discount cannot have a value", types_1.statusCode.Bad_Request);
        }
    }
    const discount = yield config_1.prisma.discount.create({
        data
    });
    return (0, response_util_1.SuccessResponse)(reply, "Discount created successfully", discount);
}));
exports.getAllDiscounts = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const discountType = req.query.discountType || "";
    const searchQuery = req.query.searchQuery || "";
    if (discountType) {
        if (!["FLAT", "PERCENTAGE", "BOGO"].includes(discountType)) {
            throw new response_util_1.ErrorResponse("Invalid discount type", types_1.statusCode.Bad_Request);
        }
    }
    if (page < 1 || limit < 1) {
        throw new response_util_1.ErrorResponse("Page and limit must be positive integers", types_1.statusCode.Bad_Request);
    }
    const skip = (page - 1) * limit;
    const where = {};
    if (searchQuery) {
        where.title = {
            contains: searchQuery,
        };
    }
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    // if (["FLAT", "PERCENTAGE", "BOGO"].includes(req.query.discountType || "")) {
    //     where.discountType = req.query.discountType;
    // }
    if (discountType) {
        where.discountType = discountType;
    }
    const [discounts, totalDiscounts] = yield Promise.all([
        config_1.prisma.discount.findMany({
            skip,
            take: limit,
            where,
        }),
        config_1.prisma.discount.count({ where }),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "Discounts fetched successfully", {
        discounts,
        currentPage: page,
        totalPages: Math.ceil(totalDiscounts / limit),
        totalDiscounts,
        count: discounts.length,
    });
}));
exports.getDiscountById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const discount = yield config_1.prisma.discount.findUnique({ where: { id } });
    if (!discount || discount.id !== id)
        throw new response_util_1.ErrorResponse("Discount not found", types_1.statusCode.Not_Found);
    return (0, response_util_1.SuccessResponse)(reply, "Discount fetched successfully", discount);
}));
exports.updateDiscount = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const validData = discount_validator_1.baseDiscountSchema.partial().safeParse(req.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation failed",
            errors: zodErr,
        });
    }
    const existing = yield config_1.prisma.discount.findUnique({ where: { id } });
    if (!existing || existing.id !== id) {
        throw new response_util_1.ErrorResponse("Discount not found", types_1.statusCode.Not_Found);
    }
    const discount = yield config_1.prisma.discount.update({
        where: { id },
        data: req.body,
    });
    return (0, response_util_1.SuccessResponse)(reply, "Discount updated successfully", discount);
}));
