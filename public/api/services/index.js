"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = exports.CustomerPurchaseService = exports.CategoryService = exports.EmployeeService = exports.EmployeeRoleService = exports.StoreService = void 0;
const store_service_1 = __importDefault(require("./store.service"));
exports.StoreService = store_service_1.default;
const employeeRole_service_1 = __importDefault(require("./employeeRole.service"));
exports.EmployeeRoleService = employeeRole_service_1.default;
const employee_service_1 = __importDefault(require("./employee.service"));
exports.EmployeeService = employee_service_1.default;
const categroy_service_1 = require("./categroy.service");
Object.defineProperty(exports, "CategoryService", { enumerable: true, get: function () { return categroy_service_1.CategoryService; } });
const customerPurchase_service_1 = __importDefault(require("./customerPurchase.service"));
exports.CustomerPurchaseService = customerPurchase_service_1.default;
const customer_service_1 = __importDefault(require("./customer.service"));
exports.CustomerService = customer_service_1.default;
