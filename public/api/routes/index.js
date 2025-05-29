"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_routes_1 = __importDefault(require("./admin.routes"));
const categroy_routes_1 = __importDefault(require("./categroy.routes"));
const employee_routes_1 = __importDefault(require("./employee.routes"));
const employeeRole_routes_1 = __importDefault(require("./employeeRole.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const store_routes_1 = __importDefault(require("./store.routes"));
const subCategroy_routes_1 = __importDefault(require("./subCategroy.routes"));
const discount_routes_1 = __importDefault(require("./discount.routes"));
const customerPurchase_routes_1 = __importDefault(require("./customerPurchase.routes"));
const customer_routes_1 = __importDefault(require("./customer.routes"));
const index = (app) => {
    app.register(admin_routes_1.default, { prefix: "/admin" });
    app.register(store_routes_1.default, { prefix: "/store" });
    app.register(employeeRole_routes_1.default, { prefix: "/employee-role" });
    app.register(employee_routes_1.default, { prefix: "/employee" });
    app.register(product_routes_1.default, { prefix: "/product" });
    app.register(categroy_routes_1.default, { prefix: "/category" });
    app.register(subCategroy_routes_1.default, { prefix: "/sub-category" });
    app.register(discount_routes_1.default, { prefix: "/discount" });
    app.register(customer_routes_1.default, { prefix: "/customer" });
    app.register(customerPurchase_routes_1.default, { prefix: "/customer-purchase" });
};
exports.default = index;
