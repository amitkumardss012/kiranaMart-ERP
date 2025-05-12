import { z } from "zod";

const employeeRoleValidator = z.object({
    roleName: z.string({ required_error: "Role name is required" }).nonempty("Role name cannot be empty"),
    permissions: z
        .array(z.string().nonempty("Permission name cannot be empty"))
        .min(1, "At least one permission is required"),
});


type EmployeeRoleType = z.infer<typeof employeeRoleValidator>;

export { employeeRoleValidator, EmployeeRoleType };