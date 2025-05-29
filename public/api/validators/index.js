"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerValidator = exports.ProductValidator = exports.discountValidator = exports.categoryValidator = exports.employeeValidator = exports.employeeRoleValidator = exports.adminValidator = exports.zodError = void 0;
const admin_validator_1 = require("./admin.validator");
Object.defineProperty(exports, "adminValidator", { enumerable: true, get: function () { return admin_validator_1.adminValidator; } });
const employeeRole_validator_1 = require("./employeeRole.validator");
Object.defineProperty(exports, "employeeRoleValidator", { enumerable: true, get: function () { return employeeRole_validator_1.employeeRoleValidator; } });
const employee_validator_1 = require("./employee.validator");
Object.defineProperty(exports, "employeeValidator", { enumerable: true, get: function () { return employee_validator_1.employeeValidator; } });
const categroy_validator_1 = require("./categroy.validator");
Object.defineProperty(exports, "categoryValidator", { enumerable: true, get: function () { return categroy_validator_1.categoryValidator; } });
const discount_validator_1 = require("./discount.validator");
Object.defineProperty(exports, "discountValidator", { enumerable: true, get: function () { return discount_validator_1.discountValidator; } });
const product_validator_1 = require("./product.validator");
Object.defineProperty(exports, "ProductValidator", { enumerable: true, get: function () { return product_validator_1.ProductValidator; } });
const customer_validation_1 = require("./customer.validation");
Object.defineProperty(exports, "customerValidator", { enumerable: true, get: function () { return customer_validation_1.customerValidator; } });
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
