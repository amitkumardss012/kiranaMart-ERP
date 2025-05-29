"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerValidator = void 0;
const zod_1 = require("zod");
exports.customerValidator = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z
        .string({ required_error: "phone is required" })
        .regex(/^\d{10}$/, "Phone number must be 10 digits").nonempty("Phone number is required"),
    isActive: zod_1.z.boolean().optional(),
});
