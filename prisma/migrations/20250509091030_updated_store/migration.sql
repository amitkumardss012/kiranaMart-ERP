/*
  Warnings:

  - You are about to drop the column `openingHours` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `store` DROP COLUMN `openingHours`,
    ADD COLUMN `isOnlineDeliveryAvailable` BOOLEAN NOT NULL DEFAULT true;
