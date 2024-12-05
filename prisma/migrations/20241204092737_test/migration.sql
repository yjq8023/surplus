-- AlterTable
ALTER TABLE `Tickets` MODIFY `orderId` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(191) NULL,
    MODIFY `times` INTEGER NULL,
    MODIFY `data` JSON NULL;
