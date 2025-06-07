import { z } from "zod";

export const paymentStatusEnum = z.enum(["PAID", "UNPAID"]);
export const paymentModeEnum = z.enum(["CASH", "CARD", "UPI", "OTHER"]);


export const companyPurchaseValidator = z.object({
  invoiceNumber: z
    .string({ required_error: "Invoice number is required" })
    .min(1, "Invoice number cannot be empty"),

  supplierName: z
    .string({ required_error: "Supplier name is required" })
    .min(2, "Supplier name must be at least 2 characters long"),

  purchaseDate: z
    .string({ required_error: "Purchase date is required" })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Purchase date must be a valid date",
    }),

  receivedDate: z
    .string()
    .optional(),

  productName: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name cannot be empty"),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .positive("Quantity must be a positive number"),

  unitPrice: z
    .number({ required_error: "Unit price is required" })
    .nonnegative("Unit price must be zero or positive"),

  taxAmount: z
    .number()
    .nonnegative("Tax amount must be zero or positive")
    .optional(),

  discountAmount: z
    .number()
    .nonnegative("Discount amount must be zero or positive")
    .optional(),

  paymentStatus: paymentStatusEnum.optional(), // Defaults handled by Prisma

  paymentMethod: paymentModeEnum.optional(), // Defaults handled by Prisma

  remarks: z
    .string()
    .max(500, "Remarks cannot be more than 500 characters")
    .optional(),

  storeId: z
    .number({ required_error: "Store ID is required" })
    .int("Store ID must be an integer")
    .positive("Store ID must be a positive number"),
});
