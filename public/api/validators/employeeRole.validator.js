"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoleValidator = void 0;
const zod_1 = require("zod");
const employeeRoleValidator = zod_1.z.object({
    roleName: zod_1.z.string({ required_error: "Role name is required" }).nonempty("Role name cannot be empty"),
    permissions: zod_1.z
        .array(zod_1.z.string().nonempty("Permission name cannot be empty"))
        .min(1, "At least one permission is required"),
});
exports.employeeRoleValidator = employeeRoleValidator;
