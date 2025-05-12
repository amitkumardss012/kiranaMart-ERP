import { FastifyRequest } from "fastify";
import AdminService from "../services/admin.service";
import { statusCode } from "../types/types";
import { ErrorResponse, jwt, Password } from "../utils";
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/response.util";
import { AdminType, adminValidator, zodError } from "../validators";

export const createAdmin = asyncHandler(async (request, reply) => {
  const validData = adminValidator.safeParse(request.body);
  if (!validData.success) {
    const zodErr = zodError(validData.error);
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation Error",
      errors: zodErr,
    });
  }

  const [existingAdmin, hashedPassword] = await Promise.all([
    AdminService.getAdminByEmail(validData.data.email),
    Password.hashPassword(validData.data.password),
  ]);

  if (existingAdmin)
    throw new ErrorResponse("Admin already exists", statusCode.Bad_Request);

  const admin = await AdminService.createAdmin({
    ...validData.data,
    password: hashedPassword,
  });

  return SuccessResponse(
    reply,
    "Admin created successfully",
    admin,
    statusCode.Created
  );
});

export const login = asyncHandler(async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  if (!email || !password)
    throw new ErrorResponse(
      "Email and password are required",
      statusCode.Bad_Request
    );

  const admin = await AdminService.getAdminByEmail(email);

  if (admin?.isActive === false)
    throw new ErrorResponse("You are no longer admin", statusCode.Bad_Request);

  if (!admin || !(await Password.verifyPassword(password, admin.password)))
    throw new ErrorResponse(
      "Invalid email or Password",
      statusCode.Bad_Request
    );

  const token = jwt.generateToken({ id: admin.id, email: admin.email });

  return reply
    .status(statusCode.OK)
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
});

export const getAllAdmin = asyncHandler(async (request, reply) => {
  const admin = await AdminService.getAllAdmins();

  return SuccessResponse(
    reply,
    "Admin retrieved successfully",
    admin,
    statusCode.OK
  );
});

export const update = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<AdminType>;
    }>,
    reply
  ) => {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id))
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);

    const validData = adminValidator.partial().safeParse(request.body);
    if (!validData.success) {
      const zodErr = zodError(validData.error);
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation Error",
        errors: zodErr,
      });
    }

    const updateData = { ...validData.data };

    // ✅ Hash password if present
    if (updateData.password) {
      const hashedPassword = await Password.hashPassword(updateData.password);
      updateData.password = hashedPassword;
    }
    
    const admin = await AdminService.updateAdmin(id, updateData);
    if (!admin)
      throw new ErrorResponse("Admin not found", statusCode.Not_Found);

    return SuccessResponse(
      reply,
      "Admin updated successfully",
      admin,
      statusCode.OK
    );
  }
);

export const logout = asyncHandler(async (request, reply) => {
  return reply
    .clearCookie("token", {
      path: "/",
      expires: new Date(0),
    })
    .status(statusCode.OK)
    .send({
      success: true,
      message: "logged out successfully",
    });
});
