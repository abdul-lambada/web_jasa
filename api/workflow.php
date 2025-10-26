<?php
require __DIR__ . '/config.php';
try {
  $stmt = $pdo->query("SELECT step_number, title, description FROM workflow_steps WHERE active = 1 ORDER BY sort_order, step_number, id");
  echo json_encode($stmt->fetchAll());
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => true]);
}
