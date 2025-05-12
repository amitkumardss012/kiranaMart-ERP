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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.update = exports.getAllAdmin = exports.login = exports.createAdmin = void 0;
const admin_service_1 = __importDefault(require("../services/admin.service"));
const types_1 = require("../types/types");
const utils_1 = require("../utils");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
exports.createAdmin = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = validators_1.adminValidator.safeParse(request.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const [existingAdmin, hashedPassword] = yield Promise.all([
        admin_service_1.default.getAdminByEmail(validData.data.email),
        utils_1.Password.hashPassword(validData.data.password),
    ]);
    if (existingAdmin)
        throw new utils_1.ErrorResponse("Admin already exists", types_1.statusCode.Bad_Request);
    const admin = yield admin_service_1.default.createAdmin(Object.assign(Object.assign({}, validData.data), { password: hashedPassword }));
    return (0, response_util_1.SuccessResponse)(reply, "Admin created successfully", admin, types_1.statusCode.Created);
}));
exports.login = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    if (!email || !password)
        throw new utils_1.ErrorResponse("Email and password are required", types_1.statusCode.Bad_Request);
    const admin = yield admin_service_1.default.getAdminByEmail(email);
    if ((admin === null || admin === void 0 ? void 0 : admin.isActive) === false)
        throw new utils_1.ErrorResponse("You are no longer admin", types_1.statusCode.Bad_Request);
    if (!admin || !(yield utils_1.Password.verifyPassword(password, admin.password)))
        throw new utils_1.ErrorResponse("Invalid email or Password", types_1.statusCode.Bad_Request);
    const token = utils_1.jwt.generateToken({ id: admin.id, email: admin.email });
    return reply
        .status(types_1.statusCode.OK)
        .setCookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
        .headers({
        authorization: `Bearer ${token}`,
    })
        .send({
        success: true,
        message: "Admin logged in successfully",
        data: admin,
        token,
    });
}));
exports.getAllAdmin = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_service_1.default.getAllAdmins();
    return (0, response_util_1.SuccessResponse)(reply, "Admin retrieved successfully", admin, types_1.statusCode.OK);
}));
exports.update = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
        throw new utils_1.ErrorResponse("Invalid id", types_1.statusCode.Bad_Request);
    const validData = validators_1.adminValidator.partial().safeParse(request.body);
    if (!validData.success) {
        const zodErr = (0, validators_1.zodError)(validData.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    const updateData = Object.assign({}, validData.data);
    // ✅ Hash password if present
    if (updateData.password) {
        const hashedPassword = yield utils_1.Password.hashPassword(updateData.password);
        updateData.password = hashedPassword;
    }
    const admin = yield admin_service_1.default.updateAdmin(id, updateData);
    if (!admin)
        throw new utils_1.ErrorResponse("Admin not found", types_1.statusCode.Not_Found);
    return (0, response_util_1.SuccessResponse)(reply, "Admin updated successfully", admin, types_1.statusCode.OK);
}));
exports.logout = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply
        .clearCookie("token", {
        path: "/",
        expires: new Date(0),
    })
        .status(types_1.statusCode.OK)
        .send({
        success: true,
        message: "logged out successfully",
    });
}));
