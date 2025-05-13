import { FastifyRequest } from "fastify";
import { EmployeeService } from "../services";
import { statusCode } from "../types/types";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { EmployeeType, employeeValidator, zodError } from "../validators";
import { prisma } from "../../config";

export const Create = asyncHandler(async (req, reply) => {
  const result = employeeValidator.safeParse(req.body);

  if (!result.success) {
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation failed",
      errors: zodError(result.error),
    });
  }

  const employee = await EmployeeService.createEmployee(result.data);
  console.log("employee", employee);
  return SuccessResponse(
    reply,
    "Employee created successfully",
    employee,
    statusCode.Created
  );
});

export const GetAll = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        page: string;
        limit: string;
        searchQuery: string;
        gender: string;
        isActive: string;
        hireDateFrom: string;
        hireDateTo: string;
      };
    }>,
    reply
  ) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchQuery = req.query.searchQuery || "";
    const gender = req.query.gender || "";
    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const hireDateFrom = req.query.hireDateFrom || "";
    const hireDateTo = req.query.hireDateTo || "";

    const skip = (page - 1) * limit;
    const where: any = {};

    // Optional filters
    if (searchQuery) {
      where.OR = [
        { firstName: { contains: searchQuery } },
        { lastName: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { userName: { contains: searchQuery } },
      ];
    }

    if (gender) where.gender = gender;
    if (typeof isActive === "boolean") where.isActive = isActive;

    if (hireDateFrom || hireDateTo) {
      where.hireDate = {};
      if (hireDateFrom) where.hireDate.gte = new Date(hireDateFrom);
      if (hireDateTo) where.hireDate.lte = new Date(hireDateTo);
    }

    const [employees, totalEmployee] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          employeeRole: true,
          accessStores: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return SuccessResponse(
      reply,
      "Employees fetched successfully",
      {
        employees,
        currentPage: page,
        totalPages: Math.ceil(totalEmployee / limit),
        totalEmployee,
        count: employees.length,
      },
      statusCode.OK
    );
  }
);

export const GetById = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);
    const employee = await EmployeeService.getById(id);
    if (!employee)
      throw new ErrorResponse("Employee not found", statusCode.Not_Found);
    return SuccessResponse(
      reply,
      "Employee fetched successfully",
      employee,
      statusCode.OK
    );
  }
);


export const Update = asyncHandler(async(request: FastifyRequest<{Params: {id: string}, Body: Partial<EmployeeType>}>, reply) => {
  const id = Number(request.params.id);
  if (!id || isNaN(id))
    throw new ErrorResponse("Invalid id", statusCode.Bad_Request);

  const validData = employeeValidator.partial().safeParse(request.body);
  if (!validData.success) {
    const zodErr = zodError(validData.error);
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation Error",
      errors: zodErr,
    });
  }

  const employee = await EmployeeService.updateEmployee(id, validData.data);
  if (!employee || employee.id !== id)
    throw new ErrorResponse("Employee not found", statusCode.Not_Found);

  return SuccessResponse(
    reply,
    "Employee updated successfully",
    employee,
    statusCode.OK
  );
});