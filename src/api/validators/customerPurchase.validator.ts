import { z } from "zod";

export const purchaseStatusEnum = z.enum([
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
]);
export const paymentMethodEnum = z.enum([
  "CASH",
  "CARD",
  "UPI",
  "WALLET",
  "OTHER",
]);

const purchaseItemSchema = z.object({
  productId: z
    .number({ required_error: "product id is required" })
    .int()
    .positive("Product ID must be a positive integer"),
  quantity: z
    .number({ required_error: "quantity is required" })
    .int()
    .positive("Quantity must be a positive integer"),
  unitPrice: z
    .number({ required_error: "unit price is required" })
    .nonnegative("Unit price must be a non-negative number"),
  discount: z.number().min(0).max(100).optional(), // percentage
  finalPrice: z
    .number({ required_error: "finalPrice is required" })
    .nonnegative("Final price must be non-negative")
    .refine(
      (item: any) => {
        if (item.discount != null) {
          const calculatedFinal =
            item.unitPrice - (item.unitPrice * item.discount) / 100;
          return Math.abs(item.finalPrice - calculatedFinal) < 0.01;
        }
        return true;
      },
      {
        message: "Final price does not match unit price and discount",
        path: ["finalPrice"],
      }
    ),
});

export const customerPurchaseValidator = z.object({
  customerId: z.number().int().optional(),
  totalAmount: z.number().positive("Total amount must be a positive number"),
  purchaseStatus: purchaseStatusEnum.optional(), // defaults handled by Prisma
  paymentMethod: paymentMethodEnum,
  transactionId: z.string().optional(),
  paymentDate: z.date().optional(),
  taxAmount: z.number().nonnegative("Tax must be non-negative").optional(),
  discountAmount: z
    .number()
    .nonnegative("Discount must be non-negative")
    .optional(),

  purchaseItems: z
    .array(purchaseItemSchema)
    .min(1, "At least one purchase item is required")
    .max(50, "You can purchase up to 50 items at a time"),
});
