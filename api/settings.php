<?php
require __DIR__ . '/config.php';
try {
  $stmt = $pdo->query("SELECT `key`, `value` FROM settings");
  $rows = $stmt->fetchAll();
  $out = [];
  foreach ($rows as $row) { $out[$row['key']] = $row['value']; }
  echo json_encode($out);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => true]);
}
