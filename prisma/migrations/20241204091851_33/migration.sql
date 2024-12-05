/*
  Warnings:

  - You are about to alter the column `data` on the `Tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Tickets` MODIFY `data` JSON NOT NULL;
