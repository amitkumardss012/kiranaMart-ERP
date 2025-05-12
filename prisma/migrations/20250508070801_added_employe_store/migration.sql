-- AlterTable
ALTER TABLE `admin` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `bloodGroup` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `alternatePhoneNumber` VARCHAR(191) NULL,
    `familyPhoneNumber` VARCHAR(191) NULL,
    `twitterLink` VARCHAR(191) NULL,
    `faceBookLink` VARCHAR(191) NULL,
    `instagramLink` VARCHAR(191) NULL,
    `guardian` VARCHAR(191) NULL,
    `aadharNumber` VARCHAR(191) NOT NULL,
    `panNumber` VARCHAR(191) NOT NULL,
    `permanentAddress` VARCHAR(191) NOT NULL,
    `currentAddress` VARCHAR(191) NOT NULL,
    `accountHolderName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `IFSC_code` VARCHAR(191) NOT NULL,
    `bankBranch` VARCHAR(191) NOT NULL,
    `taxPayerId` VARCHAR(191) NULL,
    `primaryWorkLocation` VARCHAR(191) NULL,
    `basicSalary` VARCHAR(191) NOT NULL,
    `salaryType` ENUM('MONTHLY', 'HOURLY') NOT NULL DEFAULT 'MONTHLY',
    `payComponent` VARCHAR(191) NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL,
    `hireDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    UNIQUE INDEX `Employee_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('ACTIVE', 'CLOSED', 'UNDER_MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    `type` ENUM('FRANCHISE', 'COMPANY_OWNED', 'OTHER') NOT NULL DEFAULT 'FRANCHISE',
    `openingHours` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EmployeeAccessStores` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EmployeeAccessStores_AB_unique`(`A`, `B`),
    INDEX `_EmployeeAccessStores_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EmployeeAccessStores` ADD CONSTRAINT `_EmployeeAccessStores_A_fkey` FOREIGN KEY (`A`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmployeeAccessStores` ADD CONSTRAINT `_EmployeeAccessStores_B_fkey` FOREIGN KEY (`B`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
