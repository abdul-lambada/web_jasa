<?php
require __DIR__ . '/../config.php';
header('Content-Type: text/html; charset=utf-8');

$q = trim((string)($_GET['q'] ?? ''));
$statusFilter = (string)($_GET['status'] ?? '');
$where = [];
$params = [];
if ($q !== '') { $where[] = '(name LIKE ? OR whatsapp LIKE ?)'; $params[] = "%$q%"; $params[] = "%$q%"; }
if (in_array($statusFilter, ['pending','confirmed','done'], true)) { $where[] = 'status = ?'; $params[] = $statusFilter; }
$sql = 'SELECT id,name,whatsapp,service_title,preferred_date,preferred_time,timezone,status,message,notes,created_at FROM meetings';
if ($where) { $sql .= ' WHERE ' . implode(' AND ', $where); }
$sql .= ' ORDER BY created_at DESC';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Meetings Print</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background: #f5f5f5; }
    .meta { margin-bottom: 8px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()">Print</button>
  </div>
  <div class="meta">
    <strong>Filter:</strong>
    Status: <?= htmlspecialchars($statusFilter ?: 'All') ?>,
    Query: <?= htmlspecialchars($q ?: '-') ?>
  </div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nama</th>
        <th>WhatsApp</th>
        <th>Layanan</th>
        <th>Tanggal</th>
        <th>Waktu</th>
        <th>Zona Waktu</th>
        <th>Status</th>
        <th>Pesan</th>
        <th>Notes</th>
        <th>Dibuat</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($rows as $r): ?>
      <tr>
        <td><?= htmlspecialchars($r['id']) ?></td>
        <td><?= htmlspecialchars($r['name']) ?></td>
        <td><?= htmlspecialchars($r['whatsapp']) ?></td>
        <td><?= htmlspecialchars($r['service_title']) ?></td>
        <td><?= htmlspecialchars($r['preferred_date']) ?></td>
        <td><?= htmlspecialchars($r['preferred_time']) ?></td>
        <td><?= htmlspecialchars($r['timezone']) ?></td>
        <td><?= htmlspecialchars($r['status']) ?></td>
        <td><?= nl2br(htmlspecialchars($r['message'])) ?></td>
        <td><?= nl2br(htmlspecialchars($r['notes'])) ?></td>
        <td><?= htmlspecialchars($r['created_at']) ?></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</body>
</html>
