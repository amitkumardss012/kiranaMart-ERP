import { FastifyReply } from 'fastify';

export class ErrorResponse extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ✅ Success response helper
export const SuccessResponse = (
  reply: FastifyReply,
  message: string,
  data: any = {},
  statusCode: number = 200
) => {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
};

