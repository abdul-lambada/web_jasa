<?php
require __DIR__ . '/config.php';
try {
  $stmt = $pdo->query("SELECT icon, title, description FROM services WHERE active = 1 ORDER BY sort_order, id");
  echo json_encode($stmt->fetchAll());
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => true]);
}
