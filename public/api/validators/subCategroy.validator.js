"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryValidator = void 0;
const zod_1 = require("zod");
const SubCategoryValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "name is required" })
        .nonempty("name is required"),
    description: zod_1.z.string({ required_error: "description is required" }).optional(),
    categoryId: zod_1.z.number({ required_error: "categoryId is required" }),
    isActive: zod_1.z.boolean().optional(),
    image: zod_1.z
        .string()
        .optional()
});
exports.SubCategoryValidator = SubCategoryValidator;
