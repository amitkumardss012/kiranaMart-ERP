import { z } from "zod";

// Enum validations
const unitEnum = z.enum(["PIECE", "KG", "GRAM", "LITER", "ML", "METER"], {
  required_error: "Unit is required",
  invalid_type_error: "Unit must be one of the allowed types",
});


export const ProductValidator = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(2, "Product name must be at least 2 characters long"),
    
  description: z
    .string()
    .max(1000, "Description can be at most 1000 characters")
    .optional(),

  sku: z
    .string()
    .max(100, "SKU must not exceed 100 characters")
    .optional(),

  brand: z
    .string()
    .max(100, "Brand name must not exceed 100 characters")
    .optional(),

  barcode: z
    .string()
    .max(100, "Barcode must not exceed 100 characters")
    .optional(),

  sellingPrice: z
    .number({ required_error: "Selling price is required" })
    .positive("Selling price must be greater than 0"),

  costPrice: z
    .number({ required_error: "Cost price is required" })
    .positive("Cost price must be greater than 0"),

  unit: unitEnum.default("PIECE"),

  hasOffer: z.boolean().optional(),

  manufactureDate: z
    .string()
    .datetime("Manufacture date must be a valid ISO datetime string")
    .optional(),

  expiryDate: z
    .string()
    .datetime("Expiry date must be a valid ISO datetime string")
    .optional(),

  selfLife: z
    .number()
    .int("Shelf life must be an integer")
    .positive("Shelf life must be a positive number")
    .optional(),

  image: z
    .string()
    .optional(),

  isActive: z.boolean().optional(),

  categoryId: z
    .number()
    .optional(),

  // subCategoryId: z
  //   .number()
  //   .optional(),

  discountId: z
    .number()
    .optional(),
});


export type ProductType = z.infer<typeof ProductValidator>;