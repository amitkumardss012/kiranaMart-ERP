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
exports.errorHandlerPlugin = errorHandlerPlugin;
const types_1 = require("../types/types");
const zod_1 = require("zod");
function errorHandlerPlugin(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.setErrorHandler((err, request, reply) => {
            if ('code' in err && err.code === 'P2025') {
                reply.status(types_1.statusCode.Not_Found).send({
                    success: false,
                    message: 'Item not found',
                });
                return;
            }
            if (err.name === 'CastError') {
                return reply.status(types_1.statusCode.Bad_Request).send({
                    success: false,
                    message: 'Invalid ID format',
                });
            }
            if (err instanceof zod_1.ZodError) {
                // const zodErr = zodError(err);
                // return reply.status(statusCode.Bad_Request).send({
                //     success: false,
                //     message: "Validation Error",
                //     errors: zodErr,
                // });
                return reply.status(types_1.statusCode.Bad_Request).send({
                    success: false,
                    message: "Validation Error",
                    errors: err.flatten().formErrors,
                });
            }
            else {
                reply.status(types_1.statusCode.Internal_Server_Error).send({
                    success: false,
                    message: err.message || 'Internal Server Error',
                });
            }
        });
    });
}
