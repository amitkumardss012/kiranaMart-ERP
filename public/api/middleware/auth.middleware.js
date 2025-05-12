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
exports.isSuperAdmin = exports.authenticatAdmin = void 0;
const admin_service_1 = __importDefault(require("../services/admin.service"));
const types_1 = require("../types/types");
const utils_1 = require("../utils");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.authenticatAdmin = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const tokenFromCookie = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.token;
    const tokenFromHeader = ((_c = (_b = request.headers["authorization"]) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1]) === null || _c === void 0 ? void 0 : _c.trim()) ||
        ((_e = (_d = request.headers.cookie) === null || _d === void 0 ? void 0 : _d.split("token=")[1]) === null || _e === void 0 ? void 0 : _e.trim());
    const token = tokenFromCookie || tokenFromHeader;
    if (!token)
        throw new utils_1.ErrorResponse("Token not found", types_1.statusCode.Unauthorized);
    let decodedToken;
    try {
        decodedToken = utils_1.jwt.verifyToken(token);
    }
    catch (error) {
        throw new utils_1.ErrorResponse("Invalid or expired token", types_1.statusCode.Unauthorized);
    }
    const admin = yield admin_service_1.default.getAdminById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
    if (!admin || admin.isActive === false)
        throw new utils_1.ErrorResponse("Account disabled or not authorized", types_1.statusCode.Unauthorized);
    // (request as any).admin = admin;
    request.admin = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    };
}));
exports.isSuperAdmin = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = request.admin) === null || _a === void 0 ? void 0 : _a.role) !== "SUPER_ADMIN")
        throw new utils_1.ErrorResponse("You are not authorized for this task", types_1.statusCode.Unauthorized);
}));
