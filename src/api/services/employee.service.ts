import { prisma } from "../../config";
import { statusCode } from "../types/types";
import { ErrorResponse } from "../utils";
import { EmployeeType } from "../validators";

class EmployeeService {
  public static async createEmployee(data: EmployeeType) {
    const employe = await prisma.$transaction(async (tx) => {
      const existing = await tx.employee.findFirst({
        where: {
          OR: [
            { email: data.email },
            { userName: data.userName },
            { aadharNumber: data.aadharNumber },
            { panNumber: data.panNumber },
          ],
        },
      });

      if (existing) {
        throw new ErrorResponse(
          "Duplicate email, username, Aadhar or PAN",
          statusCode.Conflict
        );
      }

      const storeCount = await tx.store.count({
        where: { id: { in: data.accessStores } },
      });

      if (storeCount !== data.accessStores.length) {
        throw new ErrorResponse(
          "One or more access stores do not exist",
          statusCode.Bad_Request
        );
      }

      const roleExists = await tx.employeeRole.findUnique({
        where: { id: data.employeeRoleId },
      });

      if (!roleExists) {
        throw new ErrorResponse(
          "Invalid employee role ID",
          statusCode.Bad_Request
        );
      }

      return await tx.employee.create({
        data: {
          ...data,
          accessStores: {
            connect: data.accessStores.map((id) => ({ id })),
          },
        },
      });
    });

    return employe;
  }

  public static async getById(id: number) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        employeeRole: true,
        accessStores: true,
      },
    });
    return employee;
  }
}

export default EmployeeService;
