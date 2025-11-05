<?php
require __DIR__ . '/../config.php';

$allowedKeys = ['brand_name', 'whatsapp_number', 'whatsapp_message', 'anim_style', 'anim_duration_ms', 'anim_delay_ms'];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verify_csrf();
  $brand = (string)($_POST['brand_name'] ?? '');
  $wa = (string)($_POST['whatsapp_number'] ?? '');
  $msg = (string)($_POST['whatsapp_message'] ?? '');
  $newLogoPath = '';
  $animStyle = (string)($_POST['anim_style'] ?? ($values['anim_style'] ?? 'fade'));
  $animDuration = (int)($_POST['anim_duration_ms'] ?? ($values['anim_duration_ms'] ?? 600));
  $animDelay = (int)($_POST['anim_delay_ms'] ?? ($values['anim_delay_ms'] ?? 60));

  $waDigits = preg_replace('/\D+/', '', $wa);
  if ($waDigits === '' || strlen($waDigits) < 10 || strlen($waDigits) > 15) {
    $errors['whatsapp_number'] = 'Nomor WhatsApp harus hanya angka (10-15 digit)';
  }
  $allowedStyles = ['fade','fade-left','fade-right','zoom'];
  if (!in_array($animStyle, $allowedStyles, true)) { $errors['anim_style'] = 'Animasi tidak valid'; }
  if ($animDuration < 100 || $animDuration > 2000) { $errors['anim_duration_ms'] = 'Durasi harus 100-2000 ms'; }
  if ($animDelay < 0 || $animDelay > 300) { $errors['anim_delay_ms'] = 'Delay per-item harus 0-300 ms'; }

  // Handle logo upload (optional)
  if (isset($_FILES['brand_logo']) && ($_FILES['brand_logo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $f = $_FILES['brand_logo'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
      $errors['brand_logo'] = 'Upload logo gagal';
    } else {
      if ($f['size'] > 2 * 1024 * 1024) { // 2MB
        $errors['brand_logo'] = 'Ukuran logo maksimal 2MB';
      } else {
        $allowedExt = ['png','jpg','jpeg','webp','gif'];
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        $fi = new finfo(FILEINFO_MIME_TYPE);
        $mime = $fi->file($f['tmp_name']);
        $allowedMime = ['image/png','image/jpeg','image/webp','image/gif'];
        if (!in_array($ext, $allowedExt, true) || !in_array($mime, $allowedMime, true)) {
          $errors['brand_logo'] = 'Format logo harus PNG, JPG, WEBP, atau GIF';
        } else {
          // Resolve project root (htdocs/web_jasa) then /uploads
          $projectRoot = dirname(__DIR__); // .../admin
          $root = dirname($projectRoot);   // .../web_jasa
          $uploadDir = $root . DIRECTORY_SEPARATOR . 'uploads';
          if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0775, true);
          }
          $safeName = 'logo_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
          $destFs = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $safeName;
          if (move_uploaded_file($f['tmp_name'], $destFs)) {
            $newLogoPath = '/uploads/' . $safeName;
          } else {
            $errors['brand_logo'] = 'Gagal menyimpan file logo';
          }
        }
      }
    }
  }

  if (!$errors) {
    $pairs = [
      ['brand_name', $brand],
      ['whatsapp_number', $waDigits],
      ['whatsapp_message', $msg],
      ['anim_style', $animStyle],
      ['anim_duration_ms', (string)$animDuration],
      ['anim_delay_ms', (string)$animDelay],
    ];
    if ($newLogoPath !== '') {
      // Optional: remove old logo file if exists and within /uploads/
      $oldLogo = $values['brand_logo'] ?? '';
      if ($oldLogo && strpos($oldLogo, '/uploads/') === 0) {
        $projectRoot = dirname(__DIR__); // .../admin
        $root = dirname($projectRoot);   // .../web_jasa
        $rel = ltrim($oldLogo, '/'); // uploads/filename.ext
        $oldPath = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rel);
        if (is_file($oldPath)) { @unlink($oldPath); }
      }
      $pairs[] = ['brand_logo', $newLogoPath];
    }
    foreach ($pairs as [$k, $v]) {
      $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
      $stmt->execute([$k, $v]);
    }
    set_flash('global', 'Settings berhasil disimpan', 'success');
    header('Location: /admin/settings/index.php');
    exit;
  } else {
    $values = [
      'brand_name' => $brand,
      'whatsapp_number' => $wa,
      'whatsapp_message' => $msg,
      'anim_style' => $animStyle,
      'anim_duration_ms' => (string)$animDuration,
      'anim_delay_ms' => (string)$animDelay,
    ];
  }
}

// Load current settings
$stmt = $pdo->query("SELECT `key`, `value` FROM settings");
$rows = $stmt->fetchAll();
$values = [];
foreach ($rows as $r) { $values[$r['key']] = $r['value']; }

require __DIR__ . '/../layout/header.php';
?>
<div class="row">
  <div class="col-12">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Settings</h4>
    </div>
    <div class="card">
      <div class="card-body">
        <form method="post" enctype="multipart/form-data">
          <input type="hidden" name="_csrf" value="<?= csrf_token() ?>" />
          <div class="mb-3">
            <label class="form-label">Brand Name</label>
            <input type="text" name="brand_name" class="form-control" value="<?= e($values['brand_name'] ?? '') ?>" />
          </div>
          <div class="row">
            <div class="col-md-6">
              <label class="form-label">WhatsApp Number (tanpa +)</label>
              <input type="text" name="whatsapp_number" class="form-control <?= isset($errors['whatsapp_number']) ? 'is-invalid' : '' ?>" value="<?= e($values['whatsapp_number'] ?? '') ?>" />
              <?php if (isset($errors['whatsapp_number'])): ?><div class="invalid-feedback"><?= e($errors['whatsapp_number']) ?></div><?php endif; ?>
            </div>
            <div class="col-md-6">
              <label class="form-label">Default WhatsApp Message</label>
              <input type="text" name="whatsapp_message" class="form-control" value="<?= e($values['whatsapp_message'] ?? '') ?>" />
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label">Brand Logo (PNG/JPG/WEBP/GIF, max 2MB)</label>
            <?php if (!empty($values['brand_logo'])): ?>
              <div class="mb-2">
                <img src="<?= e($values['brand_logo']) ?>" alt="Logo" style="max-height:60px" />
              </div>
            <?php endif; ?>
            <input type="file" name="brand_logo" class="form-control <?= isset($errors['brand_logo']) ? 'is-invalid' : '' ?>" accept="image/png,image/jpeg,image/webp,image/gif" />
            <?php if (isset($errors['brand_logo'])): ?><div class="invalid-feedback"><?= e($errors['brand_logo']) ?></div><?php endif; ?>
          </div>
          <hr class="my-4" />
          <h6 class="mb-3">Animation Settings</h6>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Anim Style</label>
              <select name="anim_style" class="form-select <?= isset($errors['anim_style']) ? 'is-invalid' : '' ?>">
                <?php $opts=['fade'=>'Fade','fade-left'=>'Fade Left','fade-right'=>'Fade Right','zoom'=>'Zoom']; foreach ($opts as $k=>$label): ?>
                  <option value="<?= e($k) ?>" <?= ($values['anim_style'] ?? 'fade') === $k ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
              </select>
              <?php if (isset($errors['anim_style'])): ?><div class="invalid-feedback"><?= e($errors['anim_style']) ?></div><?php endif; ?>
            </div>
            <div class="col-md-4">
              <label class="form-label">Anim Duration (ms)</label>
              <input type="number" name="anim_duration_ms" class="form-control <?= isset($errors['anim_duration_ms']) ? 'is-invalid' : '' ?>" value="<?= (int)($values['anim_duration_ms'] ?? 600) ?>" />
              <?php if (isset($errors['anim_duration_ms'])): ?><div class="invalid-feedback"><?= e($errors['anim_duration_ms']) ?></div><?php endif; ?>
            </div>
            <div class="col-md-4">
              <label class="form-label">Anim Delay/Item (ms)</label>
              <input type="number" name="anim_delay_ms" class="form-control <?= isset($errors['anim_delay_ms']) ? 'is-invalid' : '' ?>" value="<?= (int)($values['anim_delay_ms'] ?? 60) ?>" />
              <?php if (isset($errors['anim_delay_ms'])): ?><div class="invalid-feedback"><?= e($errors['anim_delay_ms']) ?></div><?php endif; ?>
            </div>
          </div>
          <div class="mt-4">
            <button type="submit" class="btn btn-primary">Simpan Settings</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/../layout/footer.php'; ?>
