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
exports.OrderProduct = void 0;
const config_1 = require("../../config");
const asyncHandler_1 = require("../utils/asyncHandler");
const customerPurchase_validator_1 = require("../validators/customerPurchase.validator");
const types_1 = require("../types/types");
const validators_1 = require("../validators");
const utils_1 = require("../utils");
const response_util_1 = require("../utils/response.util");
exports.OrderProduct = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    const phone = body === null || body === void 0 ? void 0 : body.phone;
    if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Phone number is required and must be a valid string.",
        });
    }
    // Validate body using Zod (excluding phone from schema)
    const parsed = customerPurchase_validator_1.customerPurchaseValidator.safeParse(body);
    if (!parsed.success) {
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: (0, validators_1.zodError)(parsed.error),
        });
    }
    const data = parsed.data;
    let customer = yield config_1.prisma.customer.findUnique({
        where: {
            phone: phone,
        },
    });
    if (!customer) {
        customer = yield config_1.prisma.customer.create({
            data: {
                name: body.name || "",
                phone: body.phone || "",
            },
        });
    }
    // Step 3: Validate Products
    const productIds = data.purchaseItems.map((item) => item.productId);
    const products = yield config_1.prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
        const existingIds = new Set(products.map((p) => p.id));
        const missing = productIds.filter((id) => !existingIds.has(id));
        throw new utils_1.ErrorResponse(`Invalid or inactive product IDs: ${missing.join(", ")}`, types_1.statusCode.Bad_Request);
    }
    // Step 4: Validate Final Price Calculation
    for (const item of data.purchaseItems) {
        const calculated = item.unitPrice - (item.unitPrice * ((_a = item.discount) !== null && _a !== void 0 ? _a : 0)) / 100;
        const expectedFinalPrice = parseFloat(calculated.toFixed(2));
        if (Math.abs(expectedFinalPrice - item.finalPrice) > 0.01) {
            throw new utils_1.ErrorResponse(`Final price mismatch for productId ${item.productId}. Expected: ${expectedFinalPrice}, Received: ${item.finalPrice}`, 400);
        }
    }
    // Step 5: Create Purchase
    const purchase = yield config_1.prisma.customerPurchase.create({
        data: {
            customerId: customer.id,
            totalAmount: data.totalAmount,
            paymentMethod: data.paymentMethod,
            purchaseStatus: (_b = data.purchaseStatus) !== null && _b !== void 0 ? _b : "COMPLETED",
            transactionId: data.transactionId,
            taxAmount: data.taxAmount,
            discountAmount: data.discountAmount,
            purchasedAt: new Date(),
            customerPurchaseItem: {
                create: data.purchaseItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                    finalPrice: item.finalPrice,
                })),
            },
        },
        include: {
            customerPurchaseItem: true,
            customer: true,
        },
    });
    return (0, response_util_1.SuccessResponse)(reply, "Purchase created successfully", purchase);
}));
