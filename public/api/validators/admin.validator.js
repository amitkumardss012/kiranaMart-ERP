"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidator = void 0;
const zod_1 = require("zod");
const adminValidator = zod_1.z
    .object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    })
        .nonempty("Name is required")
        .min(4, "Name must be at least 4 characters")
        .max(20, "Name must be at most 20 characters")
        .trim(),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .nonempty("Email is required")
        .email("Invalid email format")
        .trim(),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .trim(),
    role: zod_1.z
        .enum(["ADMIN", "SUPER_ADMIN"], {
        invalid_type_error: "Role must be either 'ADMIN' or 'SUPER_ADMIN'",
    })
        .default("ADMIN")
        .optional(),
    longitude: zod_1.z
        .number({
        invalid_type_error: "Longitude must be a number",
    })
        .optional(),
    latitude: zod_1.z
        .number({
        invalid_type_error: "Latitude must be a number",
    })
        .optional(),
})
    .strict();
exports.adminValidator = adminValidator;
