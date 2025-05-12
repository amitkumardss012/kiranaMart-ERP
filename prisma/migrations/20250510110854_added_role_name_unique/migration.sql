/*
  Warnings:

  - A unique constraint covering the columns `[roleName]` on the table `EmployeeRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EmployeeRole_roleName_key` ON `EmployeeRole`(`roleName`);
