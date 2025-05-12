import { ZodError } from "zod";
import { adminValidator, AdminType } from "./admin.validator"
import { employeeRoleValidator, EmployeeRoleType } from "./employeeRole.validator";
import {employeeValidator, EmployeeType} from "./employee.validator"



export{zodError, adminValidator, AdminType, employeeRoleValidator, EmployeeRoleType, employeeValidator, EmployeeType}

const zodError = (error: ZodError) => {
    const errors: Record<string, string> = {};

    for (const issue of error.errors) {
        const path = issue.path?.[0];
        if (path && !errors[path]) {
            errors[path] = issue.message; 
        }
    }

    return errors;
};

