<?php
require __DIR__ . '/../config.php';

$errors = [];
$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$year = isset($_POST['year']) ? (int)$_POST['year'] : (int)date('Y');
$sort_order = isset($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0;
$active = isset($_POST['active']) ? 1 : 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  if ($name === '') { $errors['name'] = 'Name wajib diisi'; }
  if ($category === '') { $errors['category'] = 'Category wajib diisi'; }
  if ($year < 1900 || $year > 2100) { $errors['year'] = 'Year harus antara 1900-2100'; }
  if (!$errors) {
    $stmt = $pdo->prepare('INSERT INTO clients (name, category, year, sort_order, active) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$name, $category, $year, $sort_order, $active]);
    set_flash('global', 'Client berhasil ditambahkan', 'success');
    header('Location: /admin/clients/index.php');
    exit;
  }
}

require __DIR__ . '/../layout/header.php';
?>
<div class="row">
  <div class="col-12">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Tambah Client</h4>
      <a href="/admin/clients/index.php" class="btn btn-secondary">Kembali</a>
    </div>
    <div class="card">
      <div class="card-body">
        <form method="post">
          <input type="hidden" name="_csrf" value="<?= csrf_token() ?>" />
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control <?= isset($errors['name']) ? 'is-invalid' : '' ?>" value="<?= e($name) ?>" required />
            <?php if (isset($errors['name'])): ?><div class="invalid-feedback"><?= e($errors['name']) ?></div><?php endif; ?>
          </div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <input type="text" name="category" class="form-control <?= isset($errors['category']) ? 'is-invalid' : '' ?>" value="<?= e($category) ?>" required />
            <?php if (isset($errors['category'])): ?><div class="invalid-feedback"><?= e($errors['category']) ?></div><?php endif; ?>
          </div>
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">Year</label>
              <input type="number" name="year" class="form-control <?= isset($errors['year']) ? 'is-invalid' : '' ?>" value="<?= (int)$year ?>" />
              <?php if (isset($errors['year'])): ?><div class="invalid-feedback"><?= e($errors['year']) ?></div><?php endif; ?>
            </div>
            <div class="col-md-4">
              <label class="form-label">Sort Order</label>
              <input type="number" name="sort_order" class="form-control" value="<?= (int)$sort_order ?>" />
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="active" id="active" <?= $active ? 'checked' : '' ?> />
                <label class="form-check-label" for="active"> Active </label>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/../layout/footer.php'; ?>
