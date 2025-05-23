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
const config_1 = require("../../config");
exports.Create = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validators_1.employeeValidator.safeParse(req.body);
    if (!result.success) {
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(result.error),
        });
    }
    const employee = yield services_1.EmployeeService.createEmployee(result.data);
    console.log("employee", employee);
    return (0, response_util_1.SuccessResponse)(reply, "Employee created successfully", employee, types_1.statusCode.Created);
}));
exports.GetAll = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchQuery = req.query.searchQuery || "";
    const gender = req.query.gender || "";
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const hireDateFrom = req.query.hireDateFrom || "";
    const hireDateTo = req.query.hireDateTo || "";
    const skip = (page - 1) * limit;
    const where = {};
    // Optional filters
    if (searchQuery) {
        where.OR = [
            { firstName: { contains: searchQuery } },
            { lastName: { contains: searchQuery } },
            { email: { contains: searchQuery } },
            { userName: { contains: searchQuery } },
        ];
    }
    if (gender)
        where.gender = gender;
    if (typeof isActive === "boolean")
        where.isActive = isActive;
    if (hireDateFrom || hireDateTo) {
        where.hireDate = {};
        if (hireDateFrom)
            where.hireDate.gte = new Date(hireDateFrom);
        if (hireDateTo)
            where.hireDate.lte = new Date(hireDateTo);
    }
    const [employees, totalEmployee] = yield config_1.prisma.$transaction([
        config_1.prisma.employee.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                employeeRole: true,
                accessStores: true,
            },
        }),
        config_1.prisma.employee.count({ where }),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "Employees fetched successfully", {
        employees,
        currentPage: page,
        totalPages: Math.ceil(totalEmployee / limit),
        totalEmployee,
        count: employees.length,
    }, types_1.statusCode.OK);
}));
exports.GetById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const employee = yield services_1.EmployeeService.getById(id);
    if (!employee)
        throw new response_util_1.ErrorResponse("Employee not found", types_1.statusCode.Not_Found);
    return (0, response_util_1.SuccessResponse)(reply, "Employee fetched successfully", employee, types_1.statusCode.OK);
}));
exports.Update = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(request.params.id);
    if (!id || isNaN(id))
        throw new response_util_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const validData = validators_1.employeeValidator.partial().safeParse(request.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const employee = yield services_1.EmployeeService.updateEmployee(id, validData.data);
    if (!employee || employee.id !== id)
        throw new response_util_1.ErrorResponse("Employee not found", types_1.statusCode.Not_Found);
    return (0, response_util_1.SuccessResponse)(reply, "Employee updated successfully", employee, types_1.statusCode.OK);
}));
