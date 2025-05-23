"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const config_1 = require("../../config");
class CategoryService {
    static createCategory(data, imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield config_1.prisma.category.create({
                data: Object.assign(Object.assign({}, data), { image: imagePath })
            });
            return category;
        });
    }
    static getAllCategories(page, limit, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield config_1.prisma.category.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    subCategory: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return categories;
        });
    }
    static getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield config_1.prisma.category.findUnique({
                where: {
                    id
                },
                include: {
                    subCategory: true
                }
            });
            return category;
        });
    }
    static updateCategory(id, data, imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield config_1.prisma.category.update({
                where: {
                    id
                },
                data: Object.assign(Object.assign({}, data), { image: imagePath })
            });
            return category;
        });
    }
}
exports.CategoryService = CategoryService;
