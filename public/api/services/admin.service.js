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
const config_1 = require("../../config");
class AdminService {
    static createAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield config_1.prisma.admin.create({
                data
            });
            return admin;
        });
    }
    static getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield config_1.prisma.admin.findUnique({
                where: {
                    email
                }
            });
            return admin;
        });
    }
    static updateAdmin(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield config_1.prisma.admin.update({
                where: {
                    id
                },
                data
            });
            return admin;
        });
    }
    static getAllAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield config_1.prisma.admin.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            });
            return admins;
        });
    }
    static getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield config_1.prisma.admin.findUnique({
                where: {
                    id
                }
            });
            return admin;
        });
    }
}
exports.default = AdminService;
