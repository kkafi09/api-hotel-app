-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_user` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'RECEPTIONIST', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pemesanan` (
    `id_pemesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_pemesanan` INTEGER NOT NULL,
    `nama_pemesan` VARCHAR(191) NOT NULL,
    `email_pemesan` VARCHAR(191) NOT NULL,
    `tgl_pemesanan` DATETIME(3) NOT NULL,
    `tgl_check_in` DATETIME(3) NOT NULL,
    `tgl_check_out` DATETIME(3) NOT NULL,
    `nama_tamu` VARCHAR(191) NOT NULL,
    `jumlah_kamar` INTEGER NOT NULL,
    `id_tipe_kamar` INTEGER NOT NULL,
    `status_kamar` ENUM('BARU', 'CHECK_IN', 'CHECK_OUT') NOT NULL,
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `Pemesanan_nomor_pemesanan_key`(`nomor_pemesanan`),
    PRIMARY KEY (`id_pemesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Detail_Pemesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pemesanan` INTEGER NOT NULL,
    `id_kamar` INTEGER NOT NULL,
    `tgl_akses` DATETIME(3) NOT NULL,
    `harga` INTEGER NOT NULL,

    UNIQUE INDEX `Detail_Pemesanan_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id_kamar` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_kamar` INTEGER NOT NULL,
    `id_tipe_kamar` INTEGER NOT NULL,

    UNIQUE INDEX `Kamar_nomor_kamar_key`(`nomor_kamar`),
    PRIMARY KEY (`id_kamar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tipe_Kamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_tipe_kamar` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tipe_Kamar_nama_tipe_kamar_key`(`nama_tipe_kamar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_id_tipe_kamar_fkey` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `Kamar`(`id_kamar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Pemesanan` ADD CONSTRAINT `Detail_Pemesanan_id_pemesanan_fkey` FOREIGN KEY (`id_pemesanan`) REFERENCES `Pemesanan`(`id_pemesanan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Pemesanan` ADD CONSTRAINT `Detail_Pemesanan_id_kamar_fkey` FOREIGN KEY (`id_kamar`) REFERENCES `Kamar`(`id_kamar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kamar` ADD CONSTRAINT `Kamar_id_tipe_kamar_fkey` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `Tipe_Kamar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
