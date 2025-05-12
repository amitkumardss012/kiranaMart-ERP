"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_routes_1 = __importDefault(require("./admin.routes"));
const store_routes_1 = __importDefault(require("./store.routes"));
const employeeRole_routes_1 = __importDefault(require("./employeeRole.routes"));
const index = (app) => {
    app.register(admin_routes_1.default, { prefix: "/admin" });
    app.register(store_routes_1.default, { prefix: "/store" });
    app.register(employeeRole_routes_1.default, { prefix: "/employee-role" });
};
exports.default = index;
