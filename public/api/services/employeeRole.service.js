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
class EmployeeRoleService {
    static createEmployeeRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roleName, permissions } = data;
            // Use a transaction to ensure atomicity
            const newRole = yield config_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Check if role name already exists
                const existingRole = yield tx.employeeRole.findFirst({
                    where: { roleName: roleName.trim() },
                });
                if (existingRole) {
                    throw new utils_1.ErrorResponse("Role name already exists", types_1.statusCode.Conflict);
                }
                // Fetch permission records
                const permissionRecords = yield tx.permission.findMany({
                    where: { name: { in: permissions } },
                });
                // Check if all requested permissions exist
                const missingPermissions = permissions.filter((perm) => !permissionRecords.some((record) => record.name === perm));
                if (missingPermissions.length > 0) {
                    throw new utils_1.ErrorResponse(`Permissions not found: ${missingPermissions.join(", ")}`, types_1.statusCode.Bad_Request);
                }
                // Create the employee role with permissions
                return tx.employeeRole.create({
                    data: {
                        roleName: roleName.trim(),
                        permission: {
                            connect: permissionRecords.map((perm) => ({ id: perm.id })),
                        },
                    },
                    include: {
                        permission: true,
                    },
                });
            }));
            return newRole;
        });
    }
    static getAllEmployeeRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRoles = yield config_1.prisma.employeeRole.findMany({
                include: {
                    permission: true,
                },
            });
            return employeeRoles;
        });
    }
    static getEmployeeRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRole = yield config_1.prisma.employeeRole.findUnique({
                where: {
                    id,
                },
                include: {
                    permission: true,
                },
            });
            return employeeRole;
        });
    }
}
exports.default = EmployeeRoleService;
