import { z } from "zod";

const adminValidator = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .nonempty("Name is required")
      .min(4, "Name must be at least 4 characters")
      .max(20, "Name must be at most 20 characters")
      .trim(),

    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .nonempty("Email is required")
      .email("Invalid email format")
      .trim(),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters")
      .trim(),

    role: z
      .enum(["ADMIN", "SUPER_ADMIN"], {
        invalid_type_error: "Role must be either 'ADMIN' or 'SUPER_ADMIN'",
      })
      .default("ADMIN")
      .optional(),

    longitude: z
      .number({
        invalid_type_error: "Longitude must be a number",
      })
      .optional(),

    latitude: z
      .number({
        invalid_type_error: "Latitude must be a number",
      })
      .optional(),
  })
  .strict();

type AdminType = z.infer<typeof adminValidator>;

export { adminValidator, AdminType };
