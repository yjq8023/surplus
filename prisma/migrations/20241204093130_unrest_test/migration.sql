/*
  Warnings:

  - Made the column `orderId` on table `Tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `times` on table `Tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data` on table `Tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Tickets` DROP FOREIGN KEY `Tickets_orderId_fkey`;

-- AlterTable
ALTER TABLE `Tickets` MODIFY `orderId` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `times` INTEGER NOT NULL,
    MODIFY `data` JSON NOT NULL;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
