CREATE DATABASE IF NOT EXISTS web_jasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_jasa;

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(200) NOT NULL,
  year YEAR NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS workflow_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step_number INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO settings (`key`, `value`) VALUES
  ("brand_name", "SyntaxTrust")
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

INSERT INTO settings (`key`, `value`) VALUES
  ("whatsapp_number", "6281234567890")
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

INSERT INTO settings (`key`, `value`) VALUES
  ("whatsapp_message", "Halo! Saya tertarik dengan layanan SyntaxTrust dan ingin konsultasi.")
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

INSERT INTO services (icon, title, description, sort_order) VALUES
  ("Code2", "Jasa Tugas Website", "Membantu client mengerjakan tugas coding, error handling, atau proyek web untuk mata kuliah dan skripsi. Sesuai brief dosen dan deadline.", 1),
  ("Wrench", "Modifikasi & Perbaikan", "Client punya website tapi tampilannya kuno atau ada bug? Kami bantu perbaiki, modifikasi fitur, atau redesign total tampilan website Anda.", 2),
  ("Rocket", "Buat Website dari Nol", "Kami buatkan website custom untuk portfolio, UKM, atau proyek pribadi client. Desain unik dan fungsional sesuai permintaan.", 3)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), icon = VALUES(icon), sort_order = VALUES(sort_order);

INSERT INTO clients (name, category, year, sort_order) VALUES
  ("Muhammad Rizki", "Tugas Pemrograman Web - Informatika", 2024, 1),
  ("Siti Nurhaliza", "Website Portfolio - Desain Komunikasi Visual", 2024, 2),
  ("Ahmad Fadhil", "Skripsi E-Commerce - Sistem Informasi", 2023, 3),
  ("Dewi Lestari", "Modifikasi Landing Page - Marketing", 2024, 4),
  ("Budi Santoso", "Website UKM Kampus - Manajemen", 2024, 5),
  ("Rina Puspita", "Tugas Frontend React - Informatika", 2023, 6)
ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), year = VALUES(year), sort_order = VALUES(sort_order);

INSERT INTO features (icon, title, description, sort_order) VALUES
  ("Handshake", "Harga Nego Sampai Deal", "Harga awal fleksibel. Kita diskusikan detailnya dan negosiasi harga terbaik saat meet (pertemuan).", 1),
  ("Clock", "Pengerjaan Cepat", "Proses kerja yang efisien dan tepat waktu sesuai deadline Anda.", 2),
  ("FileCode", "Full Source Code", "Anda mendapatkan seluruh source code bersih yang siap pakai.", 3),
  ("CheckCircle", "Garansi Revisi", "Kami berikan revisi minor gratis sampai Anda puas dengan hasilnya.", 4)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), icon = VALUES(icon), sort_order = VALUES(sort_order);

INSERT INTO workflow_steps (step_number, title, description, sort_order) VALUES
  (1, "Konsultasi Awal", "Ceritakan kebutuhan, brief proyek, dan deadline Anda via chat.", 1),
  (2, "Jadwalkan Meet & Deal", "Kita atur jadwal meet (bisa online/offline) untuk diskusi detail fitur dan negosiasi harga sampai deal.", 2),
  (3, "Proses Pengerjaan", "Kami kerjakan proyek Anda sesuai kesepakatan harga dan fitur.", 3),
  (4, "Revisi & Serah Terima", "Anda meninjau hasil, kami revisi, dan source code final kami kirimkan setelah pembayaran lunas.", 4)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), step_number = VALUES(step_number), sort_order = VALUES(sort_order);

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin user (password: "password")
INSERT INTO users (username, password_hash, display_name, role, is_active)
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', 1)
ON DUPLICATE KEY UPDATE username = username;
