<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'dpgwgcvf_db_akar';
$DB_USER = getenv('DB_USER') ?: 'dpgwgcvf_db_akar';
$DB_PASS = getenv('DB_PASS') ?: '4E~wddE91q&orjTx';

try {
  $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo 'Database connection failed';
  exit;
}

function e($str) { return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8'); }

function is_logged_in(): bool { return isset($_SESSION['admin_user']); }
function require_login(): void {
  $script = basename($_SERVER['SCRIPT_NAME'] ?? '');
  if ($script !== 'login.php' && !is_logged_in()) {
    header('Location: /web_jasa/admin/login.php');
    exit;
  }
}
require_login();

function csrf_token(): string {
  if (empty($_SESSION['_csrf'])) { $_SESSION['_csrf'] = bin2hex(random_bytes(16)); }
  return $_SESSION['_csrf'];
}
function verify_csrf(): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $t = $_POST['_csrf'] ?? '';
    if (!$t || !hash_equals($_SESSION['_csrf'] ?? '', $t)) {
      http_response_code(400);
      echo 'Invalid CSRF token';
      exit;
    }
  }
}

function set_flash(string $key, string $message, string $type = 'success'): void {
  $_SESSION['_flash'][$key] = ['message' => $message, 'type' => $type];
}
function get_flash(string $key): ?array {
  if (!isset($_SESSION['_flash'][$key])) return null;
  $data = $_SESSION['_flash'][$key];
  unset($_SESSION['_flash'][$key]);
  return $data;
}

function icon_whitelist(): array {
  return [
    'Code2', 'Wrench', 'Rocket', 'Handshake', 'Clock', 'FileCode', 'CheckCircle', 'MessageCircle', 'Calendar'
  ];
}
