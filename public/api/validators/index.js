"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoleValidator = exports.adminValidator = exports.zodError = void 0;
const admin_validator_1 = require("./admin.validator");
Object.defineProperty(exports, "adminValidator", { enumerable: true, get: function () { return admin_validator_1.adminValidator; } });
const employeeRole_validator_1 = require("./employeeRole.validator");
Object.defineProperty(exports, "employeeRoleValidator", { enumerable: true, get: function () { return employeeRole_validator_1.employeeRoleValidator; } });
const zodError = (error) => {
    var _a;
    const errors = {};
    for (const issue of error.errors) {
        const path = (_a = issue.path) === null || _a === void 0 ? void 0 : _a[0];
        if (path && !errors[path]) {
            errors[path] = issue.message;
        }
    }
    return errors;
};
exports.zodError = zodError;
