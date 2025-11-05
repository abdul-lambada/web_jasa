<?php
session_start();
require __DIR__ . '/config.php';
// Bypass auth guard for this script
// require_login() in config checks basename and won't redirect for login.php

$ASSETS = '/sneat-1.0.0/assets';
$error = '';

if (isset($_SESSION['admin_user'])) {
  header('Location: /admin/index.php');
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  $user = trim((string)($_POST['username'] ?? ''));
  $pass = (string)($_POST['password'] ?? '');
  if ($user !== '' && $pass !== '') {
    try {
      $stmt = $pdo->prepare('SELECT id, username, password_hash, display_name, role FROM users WHERE username = ? AND is_active = 1 LIMIT 1');
      $stmt->execute([$user]);
      $row = $stmt->fetch();
      if ($row && password_verify($pass, $row['password_hash'])) {
        $_SESSION['admin_user'] = $row['username'];
        $_SESSION['admin_name'] = $row['display_name'];
        $_SESSION['admin_role'] = $row['role'];
        header('Location: /admin/index.php');
        exit;
      }
    } catch (Throwable $e) {
      // fallthrough to error
    }
  }
  $error = 'Username atau password salah';
}
?>
<!DOCTYPE html>
<html lang="en" class="light-style" dir="ltr" data-theme="theme-default" data-assets-path="<?= htmlspecialchars($ASSETS) ?>/" data-template="vertical-menu-template">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  <title>Login Admin - Web Jasa</title>
  <link rel="icon" type="image/x-icon" href="<?= htmlspecialchars($ASSETS) ?>/img/favicon/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= htmlspecialchars($ASSETS) ?>/vendor/css/core.css" />
  <link rel="stylesheet" href="<?= htmlspecialchars($ASSETS) ?>/vendor/css/theme-default.css" />
  <link rel="stylesheet" href="<?= htmlspecialchars($ASSETS) ?>/css/demo.css" />
  <style>
    .authentication-wrapper { min-height: 100vh; display: flex; align-items: center; }
    .authentication-inner { width: 100%; max-width: 420px; margin: 0 auto; }
    .authentication-inner .card { border-radius: 14px; }
    .authentication-inner .card-body { padding: 20px 20px; }
    @media (min-width: 480px) { .authentication-inner .card-body { padding: 24px; } }
    h4.mb-2 { font-size: 1.125rem; }
    .form-control, .input-group>.form-control { height: 42px; }
    .btn { height: 42px; }
  </style>
</head>
<body>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-2">Web Jasa Admin</h4>
            <?php if ($error): ?>
              <div class="alert alert-danger" role="alert"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
            <form method="post">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary d-grid w-100">Masuk</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="/sneat-1.0.0/assets/vendor/js/bootstrap.js"></script>
</body>
</html>
