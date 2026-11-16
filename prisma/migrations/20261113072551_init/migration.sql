-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NOT NULL,
    `paket` VARCHAR(191) NOT NULL,
    `deploy` BOOLEAN NOT NULL DEFAULT false,
    `deskripsi` TEXT NOT NULL,
    `estimasi` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BARU',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Order_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `tech` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `gambar` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
