"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerPurchaseValidator = exports.paymentMethodEnum = exports.purchaseStatusEnum = void 0;
const zod_1 = require("zod");
exports.purchaseStatusEnum = zod_1.z.enum([
    "PENDING",
    "COMPLETED",
    "CANCELLED",
    "RETURNED",
]);
exports.paymentMethodEnum = zod_1.z.enum([
    "CASH",
    "CARD",
    "UPI",
    "WALLET",
    "OTHER",
]);
const purchaseItemSchema = zod_1.z.object({
    productId: zod_1.z
        .number({ required_error: "product id is required" })
        .int()
        .positive("Product ID must be a positive integer"),
    quantity: zod_1.z
        .number({ required_error: "quantity is required" })
        .int()
        .positive("Quantity must be a positive integer"),
    unitPrice: zod_1.z
        .number({ required_error: "unit price is required" })
        .nonnegative("Unit price must be a non-negative number"),
    discount: zod_1.z.number().min(0).max(100).optional(), // percentage
    finalPrice: zod_1.z
        .number({ required_error: "finalPrice is required" })
        .nonnegative("Final price must be non-negative")
        .refine((item) => {
        if (item.discount != null) {
            const calculatedFinal = item.unitPrice - (item.unitPrice * item.discount) / 100;
            return Math.abs(item.finalPrice - calculatedFinal) < 0.01;
        }
        return true;
    }, {
        message: "Final price does not match unit price and discount",
        path: ["finalPrice"],
    }),
});
exports.customerPurchaseValidator = zod_1.z.object({
    customerId: zod_1.z.number().int().optional(),
    totalAmount: zod_1.z.number().positive("Total amount must be a positive number"),
    purchaseStatus: exports.purchaseStatusEnum.optional(), // defaults handled by Prisma
    paymentMethod: exports.paymentMethodEnum,
    transactionId: zod_1.z.string().optional(),
    paymentDate: zod_1.z.date().optional(),
    taxAmount: zod_1.z.number().nonnegative("Tax must be non-negative").optional(),
    discountAmount: zod_1.z
        .number()
        .nonnegative("Discount must be non-negative")
        .optional(),
    purchaseItems: zod_1.z
        .array(purchaseItemSchema)
        .min(1, "At least one purchase item is required")
        .max(50, "You can purchase up to 50 items at a time"),
});
