import AdminService from "../services/admin.service";
import { statusCode } from "../types/types";
import { ErrorResponse, jwt } from "../utils";
import { asyncHandler } from "../utils/asyncHandler";

declare module "fastify" {
  interface FastifyRequest {
    admin?: {
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "SUPER_ADMIN";
    };
  }
}

export const authenticatAdmin = asyncHandler(async (request, reply) => {
  const tokenFromCookie = request.cookies?.token;
  const tokenFromHeader =
    request.headers["authorization"]?.split("Bearer ")[1]?.trim() ||
    request.headers.cookie?.split("token=")[1]?.trim();
  const token = tokenFromCookie || tokenFromHeader;
  if (!token)
    throw new ErrorResponse("Token not found", statusCode.Unauthorized);

  let decodedToken;
  try {
    decodedToken = jwt.verifyToken(token) as { id: number; email: string };
  } catch (error) {
    throw new ErrorResponse(
      "Invalid or expired token",
      statusCode.Unauthorized
    );
  }

  const admin = await AdminService.getAdminById(decodedToken?.id);
  if (!admin || admin.isActive === false)
    throw new ErrorResponse(
      "Account disabled or not authorized",
      statusCode.Unauthorized
    );

  // (request as any).admin = admin;

  request.admin = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as "ADMIN" | "SUPER_ADMIN",
  };
});

export const isSuperAdmin = asyncHandler(async (request, reply) => {
  if (request.admin?.role !== "SUPER_ADMIN")
    throw new ErrorResponse(
      "You are not authorized for this task",
      statusCode.Unauthorized
    );
});
