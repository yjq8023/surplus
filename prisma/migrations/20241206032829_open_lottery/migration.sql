-- AlterTable
ALTER TABLE `Periods` ADD COLUMN `disabled` BOOLEAN NULL,
    ADD COLUMN `lotteryNumber` VARCHAR(191) NULL;
