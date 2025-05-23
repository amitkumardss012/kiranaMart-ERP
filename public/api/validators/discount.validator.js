"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountValidator = exports.baseDiscountSchema = void 0;
const zod_1 = require("zod");
exports.baseDiscountSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is required" }).nonempty("Title is required"),
    description: zod_1.z.string().optional(),
    discountType: zod_1.z.enum(["PERCENTAGE", "FLAT", "BOGO"], {
        required_error: "Discount type is required",
    }),
    value: zod_1.z.number().optional(),
    buyQty: zod_1.z.number().optional(),
    getQty: zod_1.z.number().optional(),
    startDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" }),
    endDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
    isActive: zod_1.z.boolean().optional(),
});
// Extend base schema with conditional fields based on `discountType`
exports.discountValidator = exports.baseDiscountSchema.superRefine((data, ctx) => {
    if (data.discountType === "PERCENTAGE" || data.discountType === "FLAT") {
        if (typeof data.value !== "number") {
            ctx.addIssue({
                path: ["value"],
                code: zod_1.z.ZodIssueCode.custom,
                message: "Value is required for FLAT or PERCENTAGE discounts",
            });
        }
    }
    if (data.discountType === "BOGO") {
        const bogoData = data;
        if (typeof bogoData.buyQty !== "number" || typeof bogoData.getQty !== "number") {
            ctx.addIssue({
                path: ["buyQty/getQty"],
                code: zod_1.z.ZodIssueCode.custom,
                message: "BOGO discounts require buyQty and getQty as numbers",
            });
        }
    }
});
