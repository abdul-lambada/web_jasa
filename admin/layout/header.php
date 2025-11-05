<?php
require_once __DIR__ . '/../config.php';
$ASSETS = '/sneat-1.0.0/assets';
$__uri = $_SERVER['REQUEST_URI'] ?? '';
$__active = function (string $prefix) use ($__uri) { return (strpos($__uri, $prefix) === 0) ? ' active' : ''; };
// Load brand settings
$__brand = 'Admin Web Jasa';
$__logo = '';
try {
  $st = $pdo->query("SELECT `key`,`value` FROM settings WHERE `key` IN ('brand_name','brand_logo')");
  $vals = $st->fetchAll();
  foreach ($vals as $v) {
    if ($v['key'] === 'brand_name' && trim($v['value']) !== '') { $__brand = $v['value']; }
    if ($v['key'] === 'brand_logo' && trim($v['value']) !== '') { $__logo = $v['value']; }
  }
} catch (Throwable $e) { /* ignore */ }
?><!DOCTYPE html>
<html lang="en" class="light-style" dir="ltr" data-theme="theme-default" data-assets-path="<?= e($ASSETS) ?>/" data-template="vertical-menu-template">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  <title>Admin - Web Jasa</title>
  <link rel="icon" type="image/x-icon" href="<?= e($ASSETS) ?>/img/favicon/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e($ASSETS) ?>/vendor/css/core.css" />
  <link rel="stylesheet" href="<?= e($ASSETS) ?>/vendor/css/theme-default.css" />
  <link rel="stylesheet" href="<?= e($ASSETS) ?>/css/demo.css" />
</head>
<body>
<div class="layout-wrapper layout-content-navbar">
  <div class="layout-container">
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
      <div class="app-brand demo">
        <a href="/admin/index.php" class="app-brand-text demo menu-text d-flex align-items-center gap-2">
          <?php if ($__logo): ?>
            <img src="<?= e($__logo) ?>" alt="Logo" style="height:28px" />
            <span><?= e($__brand) ?></span>
          <?php else: ?>
            <span><?= e($__brand) ?></span>
          <?php endif; ?>
        </a>
      </div>
      <ul class="menu-inner py-1">
        <li class="menu-item<?= $__active('/admin/index.php') ?>"><a href="/admin/index.php" class="menu-link"><div>Dashboard</div></a></li>
        <li class="menu-item<?= $__active('/admin/services/') ?>"><a href="/admin/services/index.php" class="menu-link"><div>Services</div></a></li>
        <li class="menu-item<?= $__active('/admin/clients/') ?>"><a href="/admin/clients/index.php" class="menu-link"><div>Clients</div></a></li>
        <li class="menu-item<?= $__active('/admin/features/') ?>"><a href="/admin/features/index.php" class="menu-link"><div>Features</div></a></li>
        <li class="menu-item<?= $__active('/admin/workflow/') ?>"><a href="/admin/workflow/index.php" class="menu-link"><div>Workflow</div></a></li>
        <li class="menu-item<?= $__active('/admin/meetings/') ?>"><a href="/admin/meetings/index.php" class="menu-link"><div>Meetings</div></a></li>
        <li class="menu-item<?= $__active('/admin/settings/') ?>"><a href="/admin/settings/index.php" class="menu-link"><div>Settings</div></a></li>
      </ul>
    </aside>
    <div class="layout-page">
      <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        <div class="navbar-nav-right d-flex align-items-center w-100 justify-content-between" id="navbar-collapse">
          <span class="fw-semibold ms-3 d-flex align-items-center gap-2">
            <?php if ($__logo): ?>
              <img src="<?= e($__logo) ?>" alt="Logo" style="height:24px" />
            <?php endif; ?>
            <span><?= e($__brand) ?></span>
          </span>
          <div class="d-flex align-items-center gap-2 me-3">
            <span class="text-muted small"><?= e($_SESSION['admin_user'] ?? '') ?></span>
            <a class="btn btn-sm btn-outline-secondary" href="/admin/logout.php">Logout</a>
          </div>
        </div>
      </nav>
      <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
          <?php if ($f = get_flash('global')): ?>
            <div class="alert alert-<?= e($f['type']) ?>" role="alert"><?= e($f['message']) ?></div>
          <?php endif; ?>
