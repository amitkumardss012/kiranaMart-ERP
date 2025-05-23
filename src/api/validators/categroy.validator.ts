import { z } from "zod";

const categoryValidator = z.object({
  name: z
    .string({ required_error: "name is required" })
    .nonempty("name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z
    .string()
    .optional()
});

type CategoryType = z.infer<typeof categoryValidator>;

export { categoryValidator, CategoryType };