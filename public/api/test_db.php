<?php
// api/test_db.php - Diagnostic Tool for Hosting / Server Setup
header("Content-Type: text/html; charset=UTF-8");

// Keamanan: Batasi akses hanya untuk localhost atau gunakan query parameter ?key=sft_diag_2026
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
$isLocal = in_array($clientIp, ['127.0.0.1', '::1', 'localhost']) || (strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false);
$authKey = $_GET['key'] ?? '';
$validKey = 'sft_diag_2026';

if (!$isLocal && $authKey !== $validKey) {
    http_response_code(403);
    echo '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;padding:60px 20px;background:#0f172a;color:#f8fafc;"><div style="max-width:500px;margin:0 auto;background:#1e293b;padding:30px;border-radius:12px;border:1px solid #334155;"><h1 style="color:#ef4444;font-size:24px;margin-top:0;">403 Forbidden</h1><p style="color:#94a3b8;font-size:14px;">Akses langsung ke modul diagnostik database ini dibatasi untuk menjaga keamanan server.</p><p style="color:#64748b;font-size:12px;">Gunakan parameter kunci resmi untuk mengakses.</p></div></body></html>';
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/koneksi.php';

$diag = [
    'php_version' => phpversion(),
    'mysql_extension' => extension_loaded('mysqli') ? 'Aktif (OK)' : 'Tidak Aktif (Error)',
    'pdo_sqlite_extension' => extension_loaded('pdo_sqlite') ? 'Aktif (OK)' : 'Tidak Aktif',
    'mysql_connection' => 'Gagal Terhubung',
    'mysql_error' => '',
    'db_name' => $db ?? 'db_sales_app',
    'db_user' => $user ?? 'root',
    'db_host' => $host ?? 'localhost',
    'tables' => []
];

if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
    $diag['mysql_connection'] = 'BERHASIL TERHUBUNG (OK)';
    $res = $conn->query("SHOW TABLES");
    if ($res) {
        while ($row = $res->fetch_array()) {
            $diag['tables'][] = $row[0];
        }
    }
} else {
    $diag['mysql_error'] = (isset($conn) && $conn->connect_error) ? $conn->connect_error : 'Tidak dapat terhubung ke MySQL. Kredensial username/password/nama database di hosting mungkin belum sesuai.';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Diagnostik Database Server - SFT CRM</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; line-height: 1.6; }
    .card { background: #1e293b; border-radius: 14px; padding: 24px; max-width: 700px; margin: 0 auto; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    h1 { color: #38bdf8; font-size: 20px; margin-top: 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; }
    .badge-ok { background: #166534; color: #86efac; }
    .badge-err { background: #991b1b; color: #fecaca; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155; font-size: 14px; }
    .code-box { background: #0f172a; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #f59e0b; margin-top: 15px; overflow-x: auto; }
    .guide-box { background: #1e1b4b; border: 1px solid #4338ca; border-radius: 10px; padding: 16px; margin-top: 20px; font-size: 13px; color: #e0e7ff; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔍 Diagnostik Database Hosting (SFT CRM)</h1>
    <p style="font-size:13px; color:#94a3b8;">Gunakan halaman ini untuk memeriksa apakah database MySQL di hosting Anda sudah terhubung.</p>

    <div class="info-row">
      <span>Versi PHP Server:</span>
      <strong><?= $diag['php_version'] ?></strong>
    </div>

    <div class="info-row">
      <span>Driver MySQLi:</span>
      <span class="badge badge-ok"><?= $diag['mysql_extension'] ?></span>
    </div>

    <div class="info-row">
      <span>Host Database:</span>
      <code><?= htmlspecialchars($diag['db_host']) ?></code>
    </div>

    <div class="info-row">
      <span>User Database:</span>
      <code><?= htmlspecialchars($diag['db_user']) ?></code>
    </div>

    <div class="info-row">
      <span>Nama Database:</span>
      <code><?= htmlspecialchars($diag['db_name']) ?></code>
    </div>

    <div class="info-row">
      <span>Status Koneksi MySQL:</span>
      <?php if ($diag['mysql_connection'] === 'BERHASIL TERHUBUNG (OK)'): ?>
        <span class="badge badge-ok">✅ <?= $diag['mysql_connection'] ?></span>
      <?php else: ?>
        <span class="badge badge-err">❌ <?= $diag['mysql_connection'] ?></span>
      <?php endif; ?>
    </div>

    <?php if ($diag['mysql_error']): ?>
      <div class="code-box">
        <strong>Pesan Error MySQL:</strong><br>
        <?= htmlspecialchars($diag['mysql_error']) ?>
      </div>

      <div class="guide-box">
        <strong style="color:#a5b4fc; font-size:14px;">💡 Cara Memperbaikinya di Hosting / cPanel / Hostinger:</strong>
        <ol style="margin: 8px 0 0 16px; padding: 0;">
          <li>Buka <strong>File Manager</strong> di cPanel / Hostinger hosting Anda.</li>
          <li>Masuk ke folder <strong><code>api/</code></strong>.</li>
          <li>Buka file <strong><code>koneksi.php</code></strong> (atau buat file baru <strong><code>api/config_db.php</code></strong>).</li>
          <li>Sesuaikan kredensial MySQL sesuai database hosting Anda:
            <pre style="background:#0f172a; padding:10px; border-radius:6px; margin:8px 0; color:#38bdf8;">
&lt;?php
$host = "localhost";
$user = "NAMA_USER_DATABASE_HOSTING";
$pass = "PASSWORD_DATABASE_HOSTING";
$db   = "NAMA_DATABASE_HOSTING";
?&gt;</pre>
          </li>
          <li>Simpan file tersebut dan refresh kembali halaman CRM.</li>
        </ol>
      </div>
    <?php else: ?>
      <div style="margin-top: 20px;">
        <strong style="font-size:14px; color:#38bdf8;">Tabel Database yang Ditemukan (<?= count($diag['tables']) ?>):</strong>
        <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:6px;">
          <?php foreach ($diag['tables'] as $t): ?>
            <span style="background:#334155; padding:3px 8px; border-radius:6px; font-size:12px; font-family:monospace;"><?= $t ?></span>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
