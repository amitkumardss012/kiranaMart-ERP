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
const types_1 = require("../types/types");
const utils_1 = require("../utils");
class EmployeeService {
    static createEmployee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const employe = yield config_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const existing = yield tx.employee.findFirst({
                    where: {
                        OR: [
                            { email: data.email },
                            { userName: data.userName },
                            { aadharNumber: data.aadharNumber },
                            { panNumber: data.panNumber },
                        ],
                    },
                });
                if (existing) {
                    throw new utils_1.ErrorResponse("Duplicate email, username, Aadhar or PAN", types_1.statusCode.Conflict);
                }
                const storeCount = yield tx.store.count({
                    where: { id: { in: data.accessStores } },
                });
                if (storeCount !== data.accessStores.length) {
                    throw new utils_1.ErrorResponse("One or more access stores do not exist", types_1.statusCode.Bad_Request);
                }
                const roleExists = yield tx.employeeRole.findUnique({
                    where: { id: data.employeeRoleId },
                });
                if (!roleExists) {
                    throw new utils_1.ErrorResponse("Invalid employee role ID", types_1.statusCode.Bad_Request);
                }
                return yield tx.employee.create({
                    data: Object.assign(Object.assign({}, data), { accessStores: {
                            connect: data.accessStores.map((id) => ({ id })),
                        } }),
                });
            }));
            return employe;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield config_1.prisma.employee.findUnique({
                where: { id },
                include: {
                    employeeRole: true,
                    accessStores: true,
                },
            });
            return employee;
        });
    }
    static updateEmployee(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield config_1.prisma.employee.update({
                where: {
                    id,
                },
                data: Object.assign(Object.assign({}, data), { accessStores: data.accessStores
                        ? {
                            set: data.accessStores.map((storeId) => ({ id: storeId })),
                        }
                        : undefined }),
                include: {
                    employeeRole: true,
                    accessStores: true,
                },
            });
            return employee;
        });
    }
}
exports.default = EmployeeService;
