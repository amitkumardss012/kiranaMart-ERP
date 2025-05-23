import { z } from "zod";

const SubCategoryValidator = z.object({
  name: z
    .string({ required_error: "name is required" })
    .nonempty("name is required"),
    description: z.string({ required_error: "description is required" }).optional(),
    categoryId: z.number({ required_error: "categoryId is required" }),
  isActive: z.boolean().optional(),
  image: z
    .string()
    .optional()
});

type subCategoryType = z.infer<typeof SubCategoryValidator>;

export { SubCategoryValidator, subCategoryType };