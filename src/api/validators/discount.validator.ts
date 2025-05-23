import { z } from "zod";


export const baseDiscountSchema = z.object({
  title: z.string({ required_error: "Title is required" }).nonempty("Title is required"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FLAT", "BOGO"], {
    required_error: "Discount type is required",
  }),
  value: z.number().optional(),
  buyQty: z.number().optional(),
  getQty: z.number().optional(),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid start date" }
  ),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid end date" }
  ),
  isActive: z.boolean().optional(),
});

// Extend base schema with conditional fields based on `discountType`
export const discountValidator = baseDiscountSchema.superRefine((data, ctx) => {
  if (data.discountType === "PERCENTAGE" || data.discountType === "FLAT") {
    if (typeof (data as any).value !== "number") {
      ctx.addIssue({
        path: ["value"],
        code: z.ZodIssueCode.custom,
        message: "Value is required for FLAT or PERCENTAGE discounts",
      });
    }
  }

  if (data.discountType === "BOGO") {
    const bogoData = data as any;
    if (typeof bogoData.buyQty !== "number" || typeof bogoData.getQty !== "number") {
      ctx.addIssue({
        path: ["buyQty/getQty"],
        code: z.ZodIssueCode.custom,
        message: "BOGO discounts require buyQty and getQty as numbers",
      });
    }
  }
});


export type DiscountType = z.infer<typeof discountValidator>;
