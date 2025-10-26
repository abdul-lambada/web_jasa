<?php
require __DIR__ . '/../config.php';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="meetings.csv"');

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

$out = fopen('php://output', 'w');
fputcsv($out, ['ID','Nama','WhatsApp','Layanan','Tanggal','Waktu','Zona Waktu','Status','Pesan','Notes','Dibuat']);
while ($r = $stmt->fetch()) {
  fputcsv($out, [$r['id'],$r['name'],$r['whatsapp'],$r['service_title'],$r['preferred_date'],$r['preferred_time'],$r['timezone'],$r['status'],$r['message'],$r['notes'],$r['created_at']]);
}
fclose($out);
