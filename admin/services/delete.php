<?php
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
  if ($id > 0) {
    $stmt = $pdo->prepare('DELETE FROM services WHERE id=?');
    $stmt->execute([$id]);
    set_flash('global', 'Service berhasil dihapus', 'success');
  }
}
header('Location: /web_jasa/admin/services/index.php');
exit;
