<?php
require __DIR__ . '/../config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { header('Location: /admin/features/index.php'); exit; }

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  $icon = $_POST['icon'] ?? '';
  $title = $_POST['title'] ?? '';
  $description = $_POST['description'] ?? '';
  $sort_order = isset($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0;
  $active = isset($_POST['active']) ? 1 : 0;

  if ($title === '') { $errors['title'] = 'Title wajib diisi'; }
  if ($description === '') { $errors['description'] = 'Description wajib diisi'; }

  if (!$errors) {
    $stmt = $pdo->prepare('UPDATE features SET icon=?, title=?, description=?, sort_order=?, active=? WHERE id=?');
    $stmt->execute([$icon, $title, $description, $sort_order, $active, $id]);
    set_flash('global', 'Perubahan feature disimpan', 'success');
    header('Location: /admin/features/index.php');
    exit;
  }
} else {
  $stmt = $pdo->prepare('SELECT * FROM features WHERE id=?');
  $stmt->execute([$id]);
  $row = $stmt->fetch();
  if (!$row) { header('Location: /admin/features/index.php'); exit; }
  $icon = $row['icon'];
  $title = $row['title'];
  $description = $row['description'];
  $sort_order = (int)$row['sort_order'];
  $active = (int)$row['active'];
}

require __DIR__ . '/../layout/header.php';
?>
<div class="row">
  <div class="col-12">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Edit Feature</h4>
      <a href="/admin/features/index.php" class="btn btn-secondary">Kembali</a>
    </div>
    <div class="card">
      <div class="card-body">
        <form method="post">
          <input type="hidden" name="_csrf" value="<?= csrf_token() ?>" />
          <div class="mb-3">
            <label class="form-label">Icon (opsional)</label>
            <input type="text" name="icon" class="form-control" value="<?= e($icon) ?>" placeholder="Misal: Handshake" />
          </div>
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control <?= isset($errors['title']) ? 'is-invalid' : '' ?>" value="<?= e($title) ?>" required />
            <?php if (isset($errors['title'])): ?><div class="invalid-feedback"><?= e($errors['title']) ?></div><?php endif; ?>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" rows="4" class="form-control <?= isset($errors['description']) ? 'is-invalid' : '' ?>" required><?= e($description) ?></textarea>
            <?php if (isset($errors['description'])): ?><div class="invalid-feedback"><?= e($errors['description']) ?></div><?php endif; ?>
          </div>
          <div class="row">
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
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/../layout/footer.php'; ?>
