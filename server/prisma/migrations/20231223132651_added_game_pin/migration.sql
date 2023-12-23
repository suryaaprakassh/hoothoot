/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Game` ADD COLUMN `pin` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Game_pin_key` ON `Game`(`pin`);
