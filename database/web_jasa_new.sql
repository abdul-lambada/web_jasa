-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Okt 2025 pada 14.24
-- Versi server: 10.4.17-MariaDB
-- Versi PHP: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_jasa`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(200) NOT NULL,
  `year` year(4) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `clients`
--

INSERT INTO `clients` (`id`, `name`, `category`, `year`, `sort_order`, `active`, `created_at`) VALUES
(1, 'Mahasiswa Teknik Industri UMC', 'Tugas Pemrograman Web - Modifikasi & Perbaikan', 2024, 1, 1, '2025-10-26 08:55:08'),
(2, 'Cahya Karyawan PJM', 'Website Profile Company - Buat Website dari Nol', 2024, 3, 1, '2025-10-26 08:55:08'),
(3, 'Mahasiswa Polindra (Politeknik Negri Indramayu)', 'Absensi IoT – Laravel 12 - Jasa Tugas Website', 2025, 1, 1, '2025-10-26 08:55:08'),
(4, 'Mahasiswa Teknik Informatika UMC', 'Sistem Informasi KKM - Buat Website dari Nol', 2025, 3, 1, '2025-10-26 08:55:08'),
(5, 'Guru SMK', 'Sistem Absensi Sekolah dengan Integrasi Fingerprint & WhatsApp - Buat Website dari Nol', 2024, 3, 1, '2025-10-26 08:55:08'),
(6, 'Mahasiswa Teknik Informatika UNMA', 'Website KP MoodTracker Karyawan - Buat Website dari Nol', 2025, 3, 1, '2025-10-26 08:55:08'),
(7, 'Mahasiswa Teknik Informatika UNMA', 'Website KP Qr Pembayaran Buat Login Cafee - Buat Website dari Nol', 2025, 3, 1, '2025-10-26 09:06:53');

-- --------------------------------------------------------

--
-- Struktur dari tabel `features`
--

CREATE TABLE `features` (
  `id` int(11) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `features`
--

INSERT INTO `features` (`id`, `icon`, `title`, `description`, `sort_order`, `active`, `created_at`) VALUES
(1, 'Handshake', 'Harga Nego Sampai Deal', 'Harga awal fleksibel. Kita diskusikan detailnya dan negosiasi harga terbaik saat meet (pertemuan).', 1, 1, '2025-10-26 08:55:08'),
(2, 'Clock', 'Pengerjaan Cepat', 'Proses kerja yang efisien dan tepat waktu sesuai deadline Anda.', 2, 1, '2025-10-26 08:55:08'),
(3, 'FileCode', 'Full Source Code', 'Anda mendapatkan seluruh source code bersih yang siap pakai.', 3, 1, '2025-10-26 08:55:08'),
(4, 'CheckCircle', 'Garansi Revisi', 'Kami berikan revisi minor gratis sampai Anda puas dengan hasilnya.', 4, 1, '2025-10-26 08:55:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `meetings`
--

CREATE TABLE `meetings` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `whatsapp` varchar(20) NOT NULL,
  `service_title` varchar(150) NOT NULL,
  `preferred_date` date NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `preferred_time` varchar(5) DEFAULT NULL,
  `timezone` varchar(64) DEFAULT NULL,
  `status` enum('pending','confirmed','done') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `meetings`
--

INSERT INTO `meetings` (`id`, `name`, `whatsapp`, `service_title`, `preferred_date`, `message`, `created_at`, `preferred_time`, `timezone`, `status`, `notes`) VALUES
(1, 'Abdul Kholik', '628515633656', 'Jasa Tugas Website', '2025-10-27', 'Test', '2025-10-26 18:10:20', '09:13', 'Asia/Bangkok', 'done', 'Baik');

-- --------------------------------------------------------

--
-- Struktur dari tabel `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `services`
--

INSERT INTO `services` (`id`, `icon`, `title`, `description`, `sort_order`, `active`, `created_at`) VALUES
(1, 'Code2', 'Jasa Tugas Website', 'Membantu client mengerjakan tugas coding, error handling, atau proyek web untuk mata kuliah dan skripsi. Sesuai brief dosen dan deadline.', 1, 1, '2025-10-26 08:55:08'),
(2, 'Wrench', 'Modifikasi & Perbaikan', 'Client punya website tapi tampilannya kuno atau ada bug? Kami bantu perbaiki, modifikasi fitur, atau redesign total tampilan website Anda.', 2, 1, '2025-10-26 08:55:08'),
(3, 'Rocket', 'Buat Website dari Nol', 'Kami buatkan website custom untuk portfolio, UKM, atau proyek pribadi client. Desain unik dan fungsional sesuai permintaan.', 3, 1, '2025-10-26 08:55:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`) VALUES
(1, 'brand_name', 'SyntaxTrust'),
(2, 'whatsapp_number', '625156553226'),
(3, 'whatsapp_message', 'Halo! Saya tertarik dengan layanan SyntaxTrust dan ingin konsultasi.'),
(13, 'brand_logo', '/web_jasa/uploads/logo_20251026_101543_f11e3a35.png');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(150) NOT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `display_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', 1, '2025-10-26 08:55:08', '2025-10-26 08:55:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `workflow_steps`
--

CREATE TABLE `workflow_steps` (
  `id` int(11) NOT NULL,
  `step_number` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `workflow_steps`
--

INSERT INTO `workflow_steps` (`id`, `step_number`, `title`, `description`, `sort_order`, `active`, `created_at`) VALUES
(1, 1, 'Konsultasi Awal', 'Ceritakan kebutuhan, brief proyek, dan deadline Anda via chat.', 1, 1, '2025-10-26 08:55:08'),
(2, 2, 'Jadwalkan Meet & Deal', 'Kita atur jadwal meet (bisa online/offline) untuk diskusi detail fitur dan negosiasi harga sampai deal.', 2, 1, '2025-10-26 08:55:08'),
(3, 3, 'Proses Pengerjaan', 'Kami kerjakan proyek Anda sesuai kesepakatan harga dan fitur.', 3, 1, '2025-10-26 08:55:08'),
(4, 4, 'Revisi & Serah Terima', 'Anda meninjau hasil, kami revisi, dan source code final kami kirimkan setelah pembayaran lunas.', 4, 1, '2025-10-26 08:55:08');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `workflow_steps`
--
ALTER TABLE `workflow_steps`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `workflow_steps`
--
ALTER TABLE `workflow_steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
