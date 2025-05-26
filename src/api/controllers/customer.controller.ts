import { FastifyRequest } from "fastify";
import { prisma } from "../../config";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { customerValidator, zodError } from "../validators";
import { statusCode } from "../types/types";

export const createCustomer = asyncHandler(async (req, reply) => {
  const parsed = customerValidator.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: zodError(parsed.error),
    });
  }

  const { phone, name, isActive } = parsed.data;

  // Check if customer already exists
  const existingCustomer = await prisma.customer.findUnique({
    where: { phone },
  });

  if (existingCustomer) {
    throw new ErrorResponse("Customer with this phone already exists", 409);
  }

  const customer = await prisma.customer.create({
    data: {
      phone,
      name,
      isActive,
    },
  });

  return SuccessResponse(reply, "Customer created successfully", customer);
});

export const getAllCustomer = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        isActive?: string;
        phone?: string;
      };
    }>,
    reply
  ) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const phone = req.query.phone || "";
    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (phone) {
      where.phone = {
        contains: phone,
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [customers, totalCustomers] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.customer.count({ where }),
    ]);

    return SuccessResponse(reply, "Customers fetched successfully", {
      customers,
      currentPage: page,
      totalPages: Math.ceil(totalCustomers / limit),
      totalCustomers,
      count: customers.length,
    });
  }
);

export const getCustomerById = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = Number(req.params.id);

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new ErrorResponse("Customer not found", statusCode.Bad_Request);
    }

    return SuccessResponse(reply, "Customer fetched successfully", customer);
  }
);

export const updateCustomer = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = Number(req.params.id);
    const parsed = customerValidator.partial().safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors: zodError(parsed.error),
      }); 
    }

    const { phone, name, isActive } = parsed.data;

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new ErrorResponse("Customer not found", statusCode.Bad_Request);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        phone,
        name,
        isActive,
      },
    });

    return SuccessResponse(reply, "Customer updated successfully", updatedCustomer);
  }
);
