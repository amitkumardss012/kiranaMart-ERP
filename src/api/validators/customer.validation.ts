import { z } from "zod";

export const customerValidator = z.object({
  name: z.string().optional(),
  phone: z
    .string({required_error: "phone is required"})
    .regex(/^\d{10}$/, "Phone number must be 10 digits").nonempty("Phone number is required"),
  isActive: z.boolean().optional(),
});

export type CustomerType = z.infer<typeof customerValidator>;