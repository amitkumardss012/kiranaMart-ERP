import { FastifyReply, FastifyRequest } from 'fastify';

type AsyncHandler<T = FastifyRequest> = (
    request: T,
    reply: FastifyReply,
) => Promise<any>;

export const asyncHandler =
    <T extends FastifyRequest>(fn: AsyncHandler<T>) =>
        async (request: FastifyRequest, reply: FastifyReply) => {
            return fn(request as T, reply);
        };
