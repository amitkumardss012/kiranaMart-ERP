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
exports.Update = exports.GetById = exports.GetAll = exports.Create = void 0;
const services_1 = require("../services");
const types_1 = require("../types/types");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
const employeeRole_validator_1 = require("../validators/employeeRole.validator");
exports.Create = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const parsed = employeeRole_validator_1.employeeRoleValidator.safeParse(request.body);
    if (!parsed.success) {
        const errors = (0, validators_1.zodError)(parsed.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors,
        });
    }
    // Create employee role using the service
    const newRole = yield services_1.EmployeeRoleService.createEmployeeRole(parsed.data);
    return (0, response_util_1.SuccessResponse)(reply, "Employee role created successfully", newRole, types_1.statusCode.Created);
}));
exports.GetAll = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield services_1.EmployeeRoleService.getAllEmployeeRoles();
    return (0, response_util_1.SuccessResponse)(reply, "Employee roles fetched successfully", roles);
}));
exports.GetById = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const role = yield services_1.EmployeeRoleService.getEmployeeRoleById(id);
    return (0, response_util_1.SuccessResponse)(reply, "Employee role fetched successfully", role);
}));
exports.Update = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const validData = employeeRole_validator_1.employeeRoleValidator.partial().safeParse(request.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const updatedRole = yield services_1.EmployeeRoleService.updateEmployeeRole(id, validData.data);
    return (0, response_util_1.SuccessResponse)(reply, "Employee role updated successfully", updatedRole);
}));
