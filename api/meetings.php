<?php
require __DIR__ . '/../admin/config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

try {
  // Ensure table exists
  $pdo->exec("CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    service_title VARCHAR(150) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(5) NULL,
    timezone VARCHAR(64) NULL,
    status ENUM('pending','confirmed','done') NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    message TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
  // Try to add missing columns if table already existed
  try { $pdo->exec("ALTER TABLE meetings ADD COLUMN preferred_time VARCHAR(5) NULL"); } catch (Throwable $e) {}
  try { $pdo->exec("ALTER TABLE meetings ADD COLUMN timezone VARCHAR(64) NULL"); } catch (Throwable $e) {}
  try { $pdo->exec("ALTER TABLE meetings ADD COLUMN status ENUM('pending','confirmed','done') NOT NULL DEFAULT 'pending'"); } catch (Throwable $e) {}
  try { $pdo->exec("ALTER TABLE meetings ADD COLUMN notes TEXT NULL"); } catch (Throwable $e) {}

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
  }

  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) { $data = $_POST; }

  $name = trim((string)($data['name'] ?? ''));
  $wa = preg_replace('/\D+/', '', (string)($data['whatsapp'] ?? ''));
  $service = trim((string)($data['service_title'] ?? ''));
  $date = trim((string)($data['preferred_date'] ?? ''));
  $time = trim((string)($data['preferred_time'] ?? ''));
  $tz = trim((string)($data['timezone'] ?? ''));
  $status = 'pending';
  $message = trim((string)($data['message'] ?? ''));

  $errors = [];
  if ($name === '' || strlen($name) < 2) $errors['name'] = 'Nama wajib diisi';
  if ($wa === '' || strlen($wa) < 10 || strlen($wa) > 15) $errors['whatsapp'] = 'WA harus 10-15 digit';
  if ($service === '') $errors['service_title'] = 'Pilih layanan';
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $errors['preferred_date'] = 'Tanggal tidak valid';
  else {
    $ts = strtotime($date);
    if ($ts === false) $errors['preferred_date'] = 'Tanggal tidak valid';
    else {
      $today = strtotime(date('Y-m-d'));
      $max = strtotime('+60 days', $today);
      if ($ts < $today) $errors['preferred_date'] = 'Tanggal minimal hari ini';
      if ($ts > $max) $errors['preferred_date'] = 'Tanggal maksimal 60 hari ke depan';
      if ((int)date('w', $ts) === 0) $errors['preferred_date'] = 'Hari Minggu tidak tersedia';
    }
  }
  if ($time !== '' && !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $time)) { $time = ''; }
  if ($tz !== '' && strlen($tz) > 64) { $tz = substr($tz, 0, 64); }

  if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
  }

  $stmt = $pdo->prepare('INSERT INTO meetings (name, whatsapp, service_title, preferred_date, preferred_time, timezone, status, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([$name, $wa, $service, $date, $time, $tz, $status, $message]);

  echo json_encode(['ok' => true]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server error']);
}
