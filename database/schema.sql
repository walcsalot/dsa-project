-- DSA Project Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `dsa_project` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dsa_project`;

-- Users table (minimal for now, will be expanded later)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cabinets table
CREATE TABLE IF NOT EXISTS `cabinets` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `name` VARCHAR(100) NOT NULL DEFAULT 'Cabinet',
    `position` INT(11) DEFAULT NULL COMMENT 'Order/position of cabinet',
    `description` TEXT DEFAULT NULL COMMENT 'Short description of the cabinet',
    `status` ENUM('active', 'pending', 'archived') DEFAULT 'active',
    `added_by` VARCHAR(100) DEFAULT NULL COMMENT 'Username or name of person who added',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Files table
CREATE TABLE IF NOT EXISTS `files` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `cabinet_id` INT(11) NOT NULL,
    `cabinet_number` VARCHAR(20) NOT NULL COMMENT 'Format: C1.1, C1.2, etc. (per cabinet numbering)',
    `filename` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL COMMENT 'Short description of the file',
    `category` VARCHAR(50) DEFAULT 'Documents' COMMENT 'Category: Documents, Sports, Objects, etc.',
    `status` ENUM('available', 'borrowed', 'archived') DEFAULT 'available',
    `added_by` VARCHAR(100) DEFAULT NULL COMMENT 'Username or name of person who added',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cabinet_id`) REFERENCES `cabinets`(`id`) ON DELETE CASCADE,
    INDEX `idx_cabinet_id` (`cabinet_id`),
    INDEX `idx_cabinet_number` (`cabinet_number`),
    INDEX `idx_status` (`status`),
    INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- File uses table (tracks file usage, borrowing, archiving)
CREATE TABLE IF NOT EXISTS `file_uses` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `cabinet_id` INT(11) NOT NULL,
    `file_id` INT(11) NOT NULL,
    `uses_by` VARCHAR(100) DEFAULT NULL COMMENT 'Username or name of person who used',
    `borrow_by` VARCHAR(100) DEFAULT NULL COMMENT 'Username or name of person who borrowed',
    `archived_by` VARCHAR(100) DEFAULT NULL COMMENT 'Username or name of person who archived',
    `status` ENUM('available', 'borrowed', 'archived') DEFAULT 'available',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cabinet_id`) REFERENCES `cabinets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE,
    INDEX `idx_cabinet_id` (`cabinet_id`),
    INDEX `idx_file_id` (`file_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin - TODO: hash this in production)
-- Password hash for 'admin' using password_hash('admin', PASSWORD_DEFAULT)
-- For now, using a simple hash - REPLACE THIS IN PRODUCTION
INSERT INTO `users` (`username`, `email`, `password`) VALUES
('admin', 'admin@dsa-project.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE `username`=`username`;
