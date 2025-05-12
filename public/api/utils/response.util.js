"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorResponse = ErrorResponse;
// ✅ Success response helper
const SuccessResponse = (reply, message, data = {}, statusCode = 200) => {
    return reply.status(statusCode).send({
        success: true,
        message,
        data,
    });
};
exports.SuccessResponse = SuccessResponse;
