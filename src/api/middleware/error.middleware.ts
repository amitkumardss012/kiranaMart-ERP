import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ErrorResponse } from '../utils';
import { statusCode } from '../types/types';
import { ZodError } from 'zod';
import { zodError } from '../validators';

export async function errorHandlerPlugin(fastify: FastifyInstance) {
    fastify.setErrorHandler((err: FastifyError | ErrorResponse, request: FastifyRequest, reply: FastifyReply) => {

        if ('code' in err && err.code === 'P2025') {
            reply.status(statusCode.Not_Found).send({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        if (err.name === 'CastError') {
            return reply.status(statusCode.Bad_Request).send({
                success: false,
                message: 'Invalid ID format',
            });
        }

        if(err instanceof ZodError) {
            // const zodErr = zodError(err);
            // return reply.status(statusCode.Bad_Request).send({
            //     success: false,
            //     message: "Validation Error",
            //     errors: zodErr,
            // });
            return reply.status(statusCode.Bad_Request).send({
                success: false,
                message: "Validation Error",
                errors: err.flatten().formErrors, 
            })
        } else {
            reply.status(statusCode.Internal_Server_Error).send({
                success: false,
                message: err.message || 'Internal Server Error',
            });
        }
        
    });
}
