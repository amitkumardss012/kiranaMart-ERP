"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidator = void 0;
const zod_1 = require("zod");
// Enum validations
const unitEnum = zod_1.z.enum(["PIECE", "KG", "GRAM", "LITER", "ML", "METER"], {
    required_error: "Unit is required",
    invalid_type_error: "Unit must be one of the allowed types",
});
exports.ProductValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Product name is required" })
        .min(2, "Product name must be at least 2 characters long"),
    description: zod_1.z
        .string()
        .max(1000, "Description can be at most 1000 characters")
        .optional(),
    sku: zod_1.z
        .string()
        .max(100, "SKU must not exceed 100 characters")
        .optional(),
    brand: zod_1.z
        .string()
        .max(100, "Brand name must not exceed 100 characters")
        .optional(),
    barcode: zod_1.z
        .string()
        .max(100, "Barcode must not exceed 100 characters")
        .optional(),
    sellingPrice: zod_1.z
        .number({ required_error: "Selling price is required" })
        .positive("Selling price must be greater than 0"),
    costPrice: zod_1.z
        .number({ required_error: "Cost price is required" })
        .positive("Cost price must be greater than 0"),
    unit: unitEnum.default("PIECE"),
    hasOffer: zod_1.z.boolean().optional(),
    manufactureDate: zod_1.z
        .string()
        .datetime("Manufacture date must be a valid ISO datetime string")
        .optional(),
    expiryDate: zod_1.z
        .string()
        .datetime("Expiry date must be a valid ISO datetime string")
        .optional(),
    selfLife: zod_1.z
        .number()
        .int("Shelf life must be an integer")
        .positive("Shelf life must be a positive number")
        .optional(),
    image: zod_1.z
        .string()
        .optional(),
    isActive: zod_1.z.boolean().optional(),
    categoryId: zod_1.z
        .number()
        .int("Category ID must be an integer")
        .positive("Category ID must be a positive number")
        .optional(),
    subCategoryId: zod_1.z
        .number()
        .int("Sub-category ID must be an integer")
        .positive("Sub-category ID must be a positive number")
        .optional(),
    discountId: zod_1.z
        .number()
        .int("Discount ID must be an integer")
        .positive("Discount ID must be a positive number")
        .optional(),
});
