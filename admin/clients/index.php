<?php
require __DIR__ . '/../layout/header.php';
$perPage = 10;
$page = max(1, (int)($_GET['page'] ?? 1));
$q = trim((string)($_GET['q'] ?? ''));
$offset = ($page - 1) * $perPage;

$where = '';
$params = [];
if ($q !== '') {
  $where = 'WHERE name LIKE :q OR category LIKE :q';
  $params[':q'] = "%{$q}%";
}

$countSql = "SELECT COUNT(*) FROM clients {$where}";
$countStmt = $pdo->prepare($countSql);
foreach ($params as $k => $v) { $countStmt->bindValue($k, $v, PDO::PARAM_STR); }
$countStmt->execute();
$total = (int)$countStmt->fetchColumn();

$stmt = $pdo->prepare("SELECT id, name, category, year, sort_order, active FROM clients {$where} ORDER BY sort_order, id LIMIT :lim OFFSET :off");
foreach ($params as $k => $v) { $stmt->bindValue($k, $v, PDO::PARAM_STR); }
$stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':off', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();
$totalPages = max(1, (int)ceil($total / $perPage));
$summary = "Page {$page} of {$totalPages} (Total {$total})";
?>
<div class="row">
  <div class="col-12">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="mb-1">Clients</h4>
        <div class="text-muted small"><?= e($summary) ?></div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <form class="d-flex" method="get" action="">
          <input type="text" class="form-control" name="q" placeholder="Cari name/category" value="<?= e($q) ?>" />
          <button class="btn btn-outline-secondary ms-2" type="submit">Cari</button>
        </form>
        <?php if ($q !== ''): ?>
          <a class="btn btn-outline-secondary" href="/admin/clients/index.php">Reset</a>
        <?php endif; ?>
        <a href="/admin/clients/create.php" class="btn btn-primary">Tambah Client</a>
      </div>
    </div>
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Year</th>
              <th>Sort</th>
              <th>Active</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <?php foreach ($rows as $r): ?>
            <tr>
              <td><?= (int)$r['id'] ?></td>
              <td><?= e($r['name']) ?></td>
              <td><?= e($r['category']) ?></td>
              <td><?= e($r['year']) ?></td>
              <td><?= (int)$r['sort_order'] ?></td>
              <td><span class="badge bg-<?= $r['active'] ? 'success' : 'secondary' ?>"><?= $r['active'] ? 'Yes' : 'No' ?></span></td>
              <td>
                <a class="btn btn-sm btn-outline-secondary" href="/admin/clients/edit.php?id=<?= (int)$r['id'] ?>">Edit</a>
                <form action="/admin/clients/delete.php" method="post" style="display:inline-block" onsubmit="return confirm('Hapus client ini?')">
                  <input type="hidden" name="_csrf" value="<?= csrf_token() ?>">
                  <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
                  <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                </form>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<?php if ($totalPages > 1): ?>
<nav aria-label="Page navigation" class="mt-3">
  <ul class="pagination">
    <li class="page-item <?= $page <= 1 ? 'disabled' : '' ?>">
      <a class="page-link" href="?q=<?= urlencode($q) ?>&page=<?= max(1, $page-1) ?>">Prev</a>
    </li>
    <?php for ($p = 1; $p <= $totalPages; $p++): ?>
      <li class="page-item <?= $p === $page ? 'active' : '' ?>">
        <a class="page-link" href="?q=<?= urlencode($q) ?>&page=<?= $p ?>"><?= $p ?></a>
      </li>
    <?php endfor; ?>
    <li class="page-item <?= $page >= $totalPages ? 'disabled' : '' ?>">
      <a class="page-link" href="?q=<?= urlencode($q) ?>&page=<?= min($totalPages, $page+1) ?>">Next</a>
    </li>
  </ul>
</nav>
<?php endif; ?>
<?php
require __DIR__ . '/../layout/footer.php';
