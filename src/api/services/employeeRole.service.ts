import { prisma } from "../../config";
import { statusCode } from "../types/types";
import { ErrorResponse } from "../utils";
import { EmployeeRoleType } from "../validators";

class EmployeeRoleService {
  public static async createEmployeeRole(data: EmployeeRoleType) {
    const { roleName, permissions } = data;

    // Use a transaction to ensure atomicity
    const newRole = await prisma.$transaction(async (tx) => {
      // Check if role name already exists
      const existingRole = await tx.employeeRole.findFirst({
        where: { roleName: roleName.trim() },
      });

      if (existingRole) {
        throw new ErrorResponse(
          "Role name already exists",
          statusCode.Conflict
        );
      }

      // Fetch permission records
      const permissionRecords = await tx.permission.findMany({
        where: { name: { in: permissions } },
      });

      // Check if all requested permissions exist
      const missingPermissions = permissions.filter(
        (perm) => !permissionRecords.some((record) => record.name === perm)
      );
      if (missingPermissions.length > 0) {
        throw new ErrorResponse(
          `Permissions not found: ${missingPermissions.join(", ")}`,
          statusCode.Bad_Request
        );
      }

      // Create the employee role with permissions
      return tx.employeeRole.create({
        data: {
          roleName: roleName.trim(),
          permission: {
            connect: permissionRecords.map((perm) => ({ id: perm.id })),
          },
        },
        include: {
          permission: true,
        },
      });
    });

    return newRole;
  }

  public static async getAllEmployeeRoles() {
    const employeeRoles = await prisma.employeeRole.findMany({
      select: {
        id: true,
        roleName: true,
      },
    });
    return employeeRoles;
  }

  public static async getEmployeeRoleById(id: number) {
    const employeeRole = await prisma.employeeRole.findUnique({
      where: {
        id,
      },
      include: {
        permission: true,
      },
    });
    return employeeRole;
  }

  public static async updateEmployeeRole(
    id: number,
    data: Partial<EmployeeRoleType>
  ) {
    const { roleName, permissions } = data;
    const employeeRole = await prisma.employeeRole.update({
      where: {
        id,
      },
      data: {
        roleName: roleName?.trim(),
        permission: data.permissions
          ? { set: data.permissions.map((perm) => ({ name: perm })) }
          : undefined,
      },
      include: {
        permission: true,
      },
    });
    return employeeRole;
  }
}

export default EmployeeRoleService;
