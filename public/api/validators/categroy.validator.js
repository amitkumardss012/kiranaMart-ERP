"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidator = void 0;
const zod_1 = require("zod");
const categoryValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "name is required" })
        .nonempty("name is required"),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    image: zod_1.z
        .string()
        .optional()
});
exports.categoryValidator = categoryValidator;
