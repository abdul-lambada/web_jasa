<?php
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
  if ($id > 0) {
    $stmt = $pdo->prepare('DELETE FROM clients WHERE id=?');
    $stmt->execute([$id]);
    set_flash('global', 'Client berhasil dihapus', 'success');
  }
}
header('Location: /admin/clients/index.php');
exit;
