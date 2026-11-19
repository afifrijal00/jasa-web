-- AlterTable
ALTER TABLE `order` ADD COLUMN `deadline` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CalendarNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `catatan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
