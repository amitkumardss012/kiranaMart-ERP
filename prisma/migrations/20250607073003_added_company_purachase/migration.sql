-- CreateTable
CREATE TABLE `companyPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `supplierName` VARCHAR(191) NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL,
    `receivedDate` DATETIME(3) NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `taxAmount` DOUBLE NULL,
    `discountAmount` DOUBLE NULL,
    `paymentStatus` ENUM('PAID', 'UNPAID') NOT NULL DEFAULT 'UNPAID',
    `paymentMethod` ENUM('CASH', 'CARD', 'UPI', 'OTHER') NOT NULL DEFAULT 'CASH',
    `remarks` VARCHAR(191) NULL,
    `storeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companyPurchase_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `companyPurchase` ADD CONSTRAINT `companyPurchase_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
