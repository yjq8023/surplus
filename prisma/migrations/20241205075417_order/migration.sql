/*
  Warnings:

  - Added the required column `total` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tickets` ADD COLUMN `isPrize` BOOLEAN NULL,
    ADD COLUMN `prizeAmount` INTEGER NULL,
    ADD COLUMN `prizeNumber` VARCHAR(191) NULL,
    ADD COLUMN `total` INTEGER NOT NULL,
    ADD COLUMN `unitPrice` INTEGER NOT NULL;
