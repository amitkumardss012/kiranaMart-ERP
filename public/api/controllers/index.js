"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = exports.SubCategoryController = exports.CatSubController = exports.ProductController = exports.EmployeeController = exports.EmployeeRoleController = exports.StoreController = exports.AdminController = void 0;
const AdminController = __importStar(require("./admin.controller"));
exports.AdminController = AdminController;
const StoreController = __importStar(require("./store.controller"));
exports.StoreController = StoreController;
const EmployeeRoleController = __importStar(require("./employeeRole.controller"));
exports.EmployeeRoleController = EmployeeRoleController;
const EmployeeController = __importStar(require("./employe.controller"));
exports.EmployeeController = EmployeeController;
const ProductController = __importStar(require("./product.controller"));
exports.ProductController = ProductController;
const CatSubController = __importStar(require("./category.controller"));
exports.CatSubController = CatSubController;
const SubCategoryController = __importStar(require("./subCategory.controller"));
exports.SubCategoryController = SubCategoryController;
const DiscountController = __importStar(require("./discount.controller"));
exports.DiscountController = DiscountController;
