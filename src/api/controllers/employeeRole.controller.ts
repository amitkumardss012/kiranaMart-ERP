import { FastifyRequest } from "fastify";
import { EmployeeRoleService } from "../services";
import { statusCode } from "../types/types";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { zodError } from "../validators";
import {
  EmployeeRoleType,
  employeeRoleValidator,
} from "../validators/employeeRole.validator";

export const Create = asyncHandler(async (request, reply) => {
  // Validate request body
  const parsed = employeeRoleValidator.safeParse(request.body);
  if (!parsed.success) {
    const errors = zodError(parsed.error);
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Create employee role using the service
  const newRole = await EmployeeRoleService.createEmployeeRole(parsed.data);

  return SuccessResponse(
    reply,
    "Employee role created successfully",
    newRole,
    statusCode.Created
  );
});

export const GetAll = asyncHandler(async (request, reply) => {
  const roles = await EmployeeRoleService.getAllEmployeeRoles();
  return SuccessResponse(reply, "Employee roles fetched successfully", roles);
});

export const GetById = asyncHandler(
  async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);
    const role = await EmployeeRoleService.getEmployeeRoleById(id);
    return SuccessResponse(reply, "Employee role fetched successfully", role);
  }
);

export const Update = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<EmployeeRoleType>;
    }>,
    reply
  ) => {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);

    const validData = employeeRoleValidator.partial().safeParse(request.body);
    if (!validData.success) {
      const zodErr = zodError(validData.error);
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation Error",
        errors: zodErr,
      });
    }
    const updatedRole = await EmployeeRoleService.updateEmployeeRole(
      id,
      validData.data
    );

    return SuccessResponse(
      reply,
      "Employee role updated successfully",
      updatedRole 
    )
  }
);
