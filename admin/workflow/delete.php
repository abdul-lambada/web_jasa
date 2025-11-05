<?php
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
  if ($id > 0) {
    $stmt = $pdo->prepare('DELETE FROM workflow_steps WHERE id=?');
    $stmt->execute([$id]);
    set_flash('global', 'Step workflow berhasil dihapus', 'success');
  }
}
header('Location: /admin/workflow/index.php');
exit;
