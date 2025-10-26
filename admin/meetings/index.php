<?php
require __DIR__ . '/../config.php';
require __DIR__ . '/../layout/header.php';

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  service_title VARCHAR(150) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(5) NULL,
  timezone VARCHAR(64) NULL,
  status ENUM('pending','confirmed','done') NOT NULL DEFAULT 'pending',
  message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
try { $pdo->exec("ALTER TABLE meetings ADD COLUMN preferred_time VARCHAR(5) NULL"); } catch (Throwable $e) {}
try { $pdo->exec("ALTER TABLE meetings ADD COLUMN timezone VARCHAR(64) NULL"); } catch (Throwable $e) {}
try { $pdo->exec("ALTER TABLE meetings ADD COLUMN status ENUM('pending','confirmed','done') NOT NULL DEFAULT 'pending'"); } catch (Throwable $e) {}

// Handle status update
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'update_status') {
  verify_csrf();
  $id = (int)($_POST['id'] ?? 0);
  $st = (string)($_POST['status'] ?? 'pending');
  if (!in_array($st, ['pending','confirmed','done'], true)) { $st = 'pending'; }
  if ($id > 0) {
    $stmt = $pdo->prepare('UPDATE meetings SET status = ? WHERE id = ?');
    $stmt->execute([$st, $id]);
    set_flash('global', 'Status updated', 'success');
    header('Location: /web_jasa/admin/meetings/index.php');
    exit;
  }
}

// Handle notes save
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'save_notes') {
  verify_csrf();
  $id = (int)($_POST['id'] ?? 0);
  $notes = (string)($_POST['notes'] ?? '');
  if ($id > 0) {
    $stmt = $pdo->prepare('UPDATE meetings SET notes = ? WHERE id = ?');
    $stmt->execute([$notes, $id]);
    set_flash('global', 'Notes saved', 'success');
    header('Location: /web_jasa/admin/meetings/index.php');
    exit;
  }
}

// Filters
$q = trim((string)($_GET['q'] ?? ''));
$statusFilter = (string)($_GET['status'] ?? '');
$where = [];
$params = [];
if ($q !== '') { $where[] = '(name LIKE ? OR whatsapp LIKE ?)'; $params[] = "%$q%"; $params[] = "%$q%"; }
if (in_array($statusFilter, ['pending','confirmed','done'], true)) { $where[] = 'status = ?'; $params[] = $statusFilter; }
$sqlBase = 'FROM meetings';
$sql = 'SELECT * ' . $sqlBase;
if ($where) { $sql .= ' WHERE ' . implode(' AND ', $where); }
$sql .= ' ORDER BY created_at DESC';

// Pagination
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = 10;
$offset = ($page - 1) * $perPage;

// Total count
$countSql = 'SELECT COUNT(*) ' . $sqlBase;
if ($where) { $countSql .= ' WHERE ' . implode(' AND ', $where); }
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$totalRows = (int)$countStmt->fetchColumn();
$totalPages = max(1, (int)ceil($totalRows / $perPage));

// Data page
$stmt = $pdo->prepare($sql . ' LIMIT ' . (int)$perPage . ' OFFSET ' . (int)$offset);
$stmt->execute($params);
$rows = $stmt->fetchAll();
?>
<div class="container-xxl flex-grow-1 container-p-y">
  <div class="card">
    <div class="card-header">
      <form class="row g-2 align-items-end" method="get">
        <div class="col"><h5 class="mb-0">Meeting Requests</h5></div>
        <div class="col-auto">
          <label class="form-label mb-1">Status</label>
          <select name="status" class="form-select form-select-sm">
            <option value="">All</option>
            <option value="pending" <?= $statusFilter==='pending'?'selected':'' ?>>Pending</option>
            <option value="confirmed" <?= $statusFilter==='confirmed'?'selected':'' ?>>Confirmed</option>
            <option value="done" <?= $statusFilter==='done'?'selected':'' ?>>Done</option>
          </select>
        </div>
        <div class="col-auto">
          <label class="form-label mb-1">Cari</label>
          <input type="text" name="q" value="<?= e($q) ?>" class="form-control form-control-sm" placeholder="Nama/WA" />
        </div>
        <div class="col-auto">
          <button class="btn btn-sm btn-primary" type="submit">Filter</button>
        </div>
        <div class="col-auto ms-auto d-flex gap-2">
          <?php $queryStr = http_build_query(array_filter(['status'=>$statusFilter?:null,'q'=>$q?:null])); ?>
          <a class="btn btn-sm btn-outline-secondary" href="/web_jasa/admin/meetings/export_csv.php<?= $queryStr?('?'.$queryStr):'' ?>">Export CSV</a>
          <a class="btn btn-sm btn-outline-secondary" target="_blank" href="/web_jasa/admin/meetings/export_print.php<?= $queryStr?('?'.$queryStr):'' ?>">Print PDF</a>
        </div>
      </form>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>WhatsApp</th>
              <th>Layanan</th>
              <th>Tanggal</th>
              <th>Pesan</th>
              <th>Waktu</th>
              <th>Status</th>
              <th>Dibuat</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($rows as $i => $r): ?>
              <tr>
                <td><?= e($r['id']) ?></td>
                <td><?= e($r['name']) ?></td>
                <td><a href="https://wa.me/<?= e($r['whatsapp']) ?>" target="_blank"><?= e($r['whatsapp']) ?></a></td>
                <td><?= e($r['service_title']) ?></td>
                <td><?= e($r['preferred_date']) ?></td>
                <td style="max-width:360px;white-space:pre-wrap;"><?= e($r['message']) ?></td>
                <td><?= e(trim(($r['preferred_time'] ?? '')) . (($r['timezone'] ?? '') ? ' (' . $r['timezone'] . ')' : '')) ?></td>
                <td>
                  <form method="post" class="d-flex align-items-center gap-2">
                    <input type="hidden" name="_csrf" value="<?= e(csrf_token()) ?>" />
                    <input type="hidden" name="action" value="update_status" />
                    <input type="hidden" name="id" value="<?= e($r['id']) ?>" />
                    <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                      <?php foreach (['pending'=>'Pending','confirmed'=>'Confirmed','done'=>'Done'] as $k=>$label): ?>
                        <option value="<?= e($k) ?>" <?= ($r['status'] ?? 'pending') === $k ? 'selected' : '' ?>><?= e($label) ?></option>
                      <?php endforeach; ?>
                    </select>
                  </form>
                </td>
                <td><?= e($r['created_at']) ?></td>
                <td style="min-width:260px;">
                  <form method="post" class="d-flex align-items-start gap-2">
                    <input type="hidden" name="_csrf" value="<?= e(csrf_token()) ?>" />
                    <input type="hidden" name="action" value="save_notes" />
                    <input type="hidden" name="id" value="<?= e($r['id']) ?>" />
                    <textarea name="notes" rows="2" class="form-control form-control-sm" placeholder="Catatan tindak lanjut..."><?= e($r['notes'] ?? '') ?></textarea>
                    <button class="btn btn-sm btn-outline-primary" type="submit">Simpan</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <?php if (!$rows): ?>
          <div class="text-muted small">Belum ada data.</div>
        <?php endif; ?>
      </div>
    </div>
  </div>
  <?php if ($totalPages > 1): ?>
  <nav>
    <ul class="pagination mt-3">
      <?php 
        $base = '/web_jasa/admin/meetings/index.php';
        for ($p=1; $p<=$totalPages; $p++): 
          $qs = array_filter(['status'=>$statusFilter?:null,'q'=>$q?:null,'page'=>$p]);
          $href = $base.'?'.http_build_query($qs);
      ?>
        <li class="page-item <?= $p===$page?'active':'' ?>">
          <a class="page-link" href="<?= e($href) ?>"><?= e($p) ?></a>
        </li>
      <?php endfor; ?>
    </ul>
  </nav>
  <?php endif; ?>
</div>
<?php require __DIR__ . '/../layout/footer.php'; ?>
