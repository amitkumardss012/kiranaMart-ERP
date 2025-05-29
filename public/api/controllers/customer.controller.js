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
exports.updateCustomer = exports.getCustomerById = exports.getAllCustomer = exports.createCustomer = void 0;
const config_1 = require("../../config");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
const types_1 = require("../types/types");
exports.createCustomer = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = validators_1.customerValidator.safeParse(req.body);
    if (!parsed.success) {
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(parsed.error),
        });
    }
    const { phone, name, isActive } = parsed.data;
    // Check if customer already exists
    const existingCustomer = yield config_1.prisma.customer.findUnique({
        where: { phone },
    });
    if (existingCustomer) {
        throw new response_util_1.ErrorResponse("Customer with this phone already exists", 409);
    }
    const customer = yield config_1.prisma.customer.create({
        data: {
            phone,
            name,
            isActive,
        },
    });
    return (0, response_util_1.SuccessResponse)(reply, "Customer created successfully", customer);
}));
exports.getAllCustomer = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const phone = req.query.phone || "";
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const skip = (page - 1) * limit;
    const where = {};
    if (phone) {
        where.phone = {
            contains: phone,
        };
    }
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    const [customers, totalCustomers] = yield config_1.prisma.$transaction([
        config_1.prisma.customer.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        config_1.prisma.customer.count({ where }),
    ]);
    return (0, response_util_1.SuccessResponse)(reply, "Customers fetched successfully", {
        customers,
        currentPage: page,
        totalPages: Math.ceil(totalCustomers / limit),
        totalCustomers,
        count: customers.length,
    });
}));
exports.getCustomerById = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const customer = yield config_1.prisma.customer.findUnique({
        where: { id },
    });
    if (!customer) {
        throw new response_util_1.ErrorResponse("Customer not found", types_1.statusCode.Bad_Request);
    }
    return (0, response_util_1.SuccessResponse)(reply, "Customer fetched successfully", customer);
}));
exports.updateCustomer = (0, asyncHandler_1.asyncHandler)((req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const parsed = validators_1.customerValidator.partial().safeParse(req.body);
    if (!parsed.success) {
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: (0, validators_1.zodError)(parsed.error),
        });
    }
    const { phone, name, isActive } = parsed.data;
    const customer = yield config_1.prisma.customer.findUnique({
        where: { id },
    });
    if (!customer) {
        throw new response_util_1.ErrorResponse("Customer not found", types_1.statusCode.Bad_Request);
    }
    const updatedCustomer = yield config_1.prisma.customer.update({
        where: { id },
        data: {
            phone,
            name,
            isActive,
        },
    });
    return (0, response_util_1.SuccessResponse)(reply, "Customer updated successfully", updatedCustomer);
}));
