<?php
/**
 * =========================================================================
 * SFT - STORAGE PROTECTION & AUTOMATIC SYMLINK WIZARD (HOSTINGER / LINUX)
 * =========================================================================
 * 
 * Script ini mengamankan folder upload user (aktivitas, lokasi, olx, profil, dll)
 * dengan memindahkannya ke luar jangkauan direktori Git (public_html),
 * kemudian membuat Symbolic Link (Symlink) otomatis.
 * 
 * Hasilnya:
 * - Setiap deploy update kode via Git, foto user TIDAK AKAN PERNAH TERHAPUS.
 * - Foto tersimpan permanen di direktori persistent server.
 */

// Konfigurasi Keamanan Sederhana
$SECRET_PIN = 'sft2026'; // PIN untuk otorisasi eksekusi

// Deteksi Root Proyek
$isPublicDir = basename(__DIR__) === 'public';
$projectRoot = $isPublicDir ? dirname(__DIR__) : __DIR__;
$publicRoot  = $projectRoot . '/public';

// Tentukan Lokasi Persistent Storage di LUAR folder Git (public_html)
$parentDir = dirname($projectRoot);
$persistentStorageDir = $parentDir . '/persistent_storage_sft';

// Jika di localhost / direktori root tidak bisa naik level, buat fallback
if (!is_dir($parentDir) || !is_writable($parentDir)) {
    // Coba path alternatif jika parent tidak writable
    if (is_writable($projectRoot . '/../')) {
        $persistentStorageDir = realpath($projectRoot . '/../') . '/persistent_storage_sft';
    }
}

// Daftar folder yang HARUS diproteksi dari Git
$foldersToProtect = [
    [
        'name'        => 'Foto Aktivitas Sales (Lokasi)',
        'target_sub'  => 'uploads/lokasi',
        'paths'       => [
            $projectRoot . '/uploads/lokasi',
            $publicRoot . '/uploads/lokasi'
        ]
    ],
    [
        'name'        => 'Galeri Aktivitas & Pameran',
        'target_sub'  => 'aktivitas',
        'paths'       => [
            $projectRoot . '/aktivitas',
            $publicRoot . '/aktivitas'
        ]
    ],
    [
        'name'        => 'Foto Unit Trade-in & OLX',
        'target_sub'  => 'uploads/olx',
        'paths'       => [
            $projectRoot . '/uploads/olx',
            $publicRoot . '/uploads/olx'
        ]
    ],
    [
        'name'        => 'Foto Profil Pengguna',
        'target_sub'  => 'uploads/profil',
        'paths'       => [
            $projectRoot . '/uploads/profil',
            $publicRoot . '/uploads/profil'
        ]
    ],
    [
        'name'        => 'Laporan & Dokumen Upload',
        'target_sub'  => 'uploads/laporan',
        'paths'       => [
            $projectRoot . '/uploads/laporan',
            $publicRoot . '/uploads/laporan'
        ]
    ]
];

$isCli = (php_sapi_name() === 'cli');
$isWindows = (PHP_OS_FAMILY === 'Windows');
$symlinkEnabled = function_exists('symlink');

// Fungsi rekursif salin file
function safeCopyFiles($src, $dst) {
    if (!is_dir($src)) return 0;
    if (!is_dir($dst)) @mkdir($dst, 0775, true);
    
    $copied = 0;
    $files = scandir($src);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || $file === '.gitkeep') continue;
        $srcPath = $src . '/' . $file;
        $dstPath = $dst . '/' . $file;
        if (is_file($srcPath)) {
            if (!file_exists($dstPath) || (filemtime($srcPath) > filemtime($dstPath))) {
                if (@copy($srcPath, $dstPath)) {
                    $copied++;
                }
            }
        } elseif (is_dir($srcPath) && !is_link($srcPath)) {
            $copied += safeCopyFiles($srcPath, $dstPath);
        }
    }
    return $copied;
}

// Fungsi hapus folder lokal yang sudah di-backup untuk diganti symlink
function removeDirExceptGitkeep($dir) {
    if (!is_dir($dir) || is_link($dir)) return;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $filePath = $dir . '/' . $file;
        if (is_file($filePath)) {
            @unlink($filePath);
        } elseif (is_dir($filePath)) {
            removeDirExceptGitkeep($filePath);
            @rmdir($filePath);
        }
    }
    @rmdir($dir);
}

// Handle Eksekusi Aksi
$actionResult = null;
$executed = false;

if (isset($_POST['action']) && $_POST['action'] === 'run_protection') {
    $executed = true;
    $enteredPin = $_POST['pin'] ?? '';
    
    if ($enteredPin !== $SECRET_PIN) {
        $actionResult = [
            'status'  => 'error',
            'message' => 'PIN Keamanan salah! Silakan gunakan PIN default: ' . htmlspecialchars($SECRET_PIN)
        ];
    } elseif ($isWindows) {
        $actionResult = [
            'status'  => 'warning',
            'message' => 'Sistem mendeteksi OS Windows (Localhost). Di localhost Windows, file upload Anda sudah aman di folder fisik Laragon. Fitur pembuatan symlink otomatis ini khusus dijalankan saat website berada di server Linux Hostinger.'
        ];
    } elseif (!$symlinkEnabled) {
        $actionResult = [
            'status'  => 'error',
            'message' => 'Fungsi PHP symlink() dinonaktifkan di server ini. Anda dapat membuat symlink secara manual melalui SSH Terminal Hostinger.'
        ];
    } else {
        // Buat folder persistent storage di luar public_html
        if (!is_dir($persistentStorageDir)) {
            @mkdir($persistentStorageDir, 0775, true);
        }

        $logs = [];
        $totalFilesPreserved = 0;

        foreach ($foldersToProtect as $item) {
            $storageTarget = $persistentStorageDir . '/' . $item['target_sub'];
            if (!is_dir($storageTarget)) {
                @mkdir($storageTarget, 0775, true);
            }

            foreach ($item['paths'] as $path) {
                // Jika sudah berupa symlink yang valid, lewati
                if (is_link($path)) {
                    $linkTarget = @readlink($path);
                    $logs[] = "✓ [Sudah Aman] {$path} sudah terhubung ke {$linkTarget}";
                    continue;
                }

                // 1. Selamatkan file lama (copy ke folder luar)
                $count = 0;
                if (is_dir($path)) {
                    $count = safeCopyFiles($path, $storageTarget);
                    $totalFilesPreserved += $count;
                    // Hapus folder lama agar bisa digantikan oleh symlink
                    removeDirExceptGitkeep($path);
                }

                // 2. Buat direktori parent jika belum ada
                $parentOfPath = dirname($path);
                if (!is_dir($parentOfPath)) {
                    @mkdir($parentOfPath, 0775, true);
                }

                // 3. Buat Symbolic Link
                $symSuccess = @symlink($storageTarget, $path);
                if ($symSuccess || is_link($path)) {
                    $logs[] = "✓ [Sukses Symlink] {$item['name']} ({$path} -> {$storageTarget}) [{$count} file diamankan]";
                } else {
                    $logs[] = "✗ [Gagal Symlink] Tidak dapat membuat symlink untuk {$path}. Coba jalankan via SSH: ln -s '{$storageTarget}' '{$path}'";
                }
            }
        }

        $actionResult = [
            'status'  => 'success',
            'message' => "Proteksi Storage Berhasil Diterapkan! Total {$totalFilesPreserved} file foto diamankan ke folder permanen luar.",
            'logs'    => $logs
        ];
    }
}

// Analisis Status Folder Saat Ini
$folderStatuses = [];
foreach ($foldersToProtect as $item) {
    $storageTarget = $persistentStorageDir . '/' . $item['target_sub'];
    $targetExists = is_dir($storageTarget);
    $fileCount = $targetExists ? count(array_diff(scandir($storageTarget), ['.', '..', '.gitkeep'])) : 0;

    $pathStatuses = [];
    foreach ($item['paths'] as $path) {
        $isLinked = is_link($path);
        $exists   = file_exists($path);
        $writable = is_writable($path);
        $linkTo   = $isLinked ? @readlink($path) : null;

        $pathStatuses[] = [
            'path'      => $path,
            'rel_path'  => str_replace($projectRoot, '', $path),
            'is_link'   => $isLinked,
            'link_to'   => $linkTo,
            'exists'    => $exists,
            'writable'  => $writable
        ];
    }

    $folderStatuses[] = [
        'name'         => $item['name'],
        'target_sub'   => $item['target_sub'],
        'storage_path' => $storageTarget,
        'file_count'   => $fileCount,
        'paths'        => $pathStatuses
    ];
}

// Output CLI jika dijalankan lewat terminal
if ($isCli) {
    echo "=== SFT Storage Protection Wizard ===\n";
    echo "OS: " . PHP_OS_FAMILY . "\n";
    echo "Project Root: {$projectRoot}\n";
    echo "Persistent Storage: {$persistentStorageDir}\n";
    if ($actionResult) {
        echo "Result: [{$actionResult['status']}] {$actionResult['message']}\n";
        if (!empty($actionResult['logs'])) {
            foreach ($actionResult['logs'] as $l) echo "  {$l}\n";
        }
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proteksi Storage Upload - Sales Force Tracking</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #d32f2f;
            --primary-dark: #b71c1c;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --bg-page: #0f172a;
            --bg-card: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: #334155;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Outfit', sans-serif;
            background: var(--bg-page);
            color: var(--text-main);
            padding: 2rem 1rem;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .header h1 {
            font-size: 1.8rem;
            color: #fff;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .header p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        .alert {
            padding: 1rem 1.25rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 0.95rem;
        }
        .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
        .alert-warning { background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #fbbf24; }
        .alert-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; }
        
        .sys-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .sys-box {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 0.75rem 1rem;
        }
        .sys-box .label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
        }
        .sys-box .val {
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            margin-top: 4px;
            word-break: break-all;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-green { background: #065f46; color: #6ee7b7; }
        .badge-yellow { background: #78350f; color: #fcd34d; }
        .badge-red { background: #7f1d1d; color: #fca5a5; }

        .table-responsive {
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        th, td {
            padding: 10px 14px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        th {
            background: rgba(15, 23, 42, 0.8);
            color: var(--text-muted);
            font-weight: 600;
        }
        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
        .code-pill {
            font-family: monospace;
            background: rgba(0,0,0,0.3);
            padding: 2px 6px;
            border-radius: 4px;
            color: #38bdf8;
            font-size: 0.82rem;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #d32f2f;
            color: #fff;
            border: none;
            padding: 0.85rem 1.75rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
        }
        .btn-action:hover {
            background: #b71c1c;
            transform: translateY(-1px);
        }
        .form-group {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 1rem;
        }
        .input-pin {
            background: #0f172a;
            border: 1px solid var(--border);
            color: #fff;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            font-size: 1rem;
            width: 160px;
            text-align: center;
            font-family: monospace;
            letter-spacing: 2px;
        }
        .logs-box {
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 8px;
            padding: 1rem;
            font-family: monospace;
            font-size: 0.82rem;
            color: #38bdf8;
            max-height: 250px;
            overflow-y: auto;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🛡️ Proteksi Storage & Auto-Symlink</h1>
        <p>Solusi anti-hilang foto aktivitas sales saat melakukan Git Deployment di Hostinger</p>
    </div>

    <?php if ($actionResult): ?>
        <div class="alert alert-<?= $actionResult['status'] ?>">
            <div>
                <strong><?= $actionResult['status'] === 'success' ? 'Sukses!' : ($actionResult['status'] === 'warning' ? 'Perhatian:' : 'Gagal:') ?></strong>
                <?= $actionResult['message'] ?>
                <?php if (!empty($actionResult['logs'])): ?>
                    <div class="logs-box">
                        <?php foreach ($actionResult['logs'] as $log): ?>
                            <div><?= htmlspecialchars($log) ?></div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

    <!-- Status Sistem -->
    <div class="card">
        <h2 style="font-size: 1.15rem; margin-bottom: 1rem;">Status Server & Lingkungan</h2>
        <div class="sys-info">
            <div class="sys-box">
                <div class="label">Sistem Operasi</div>
                <div class="val"><?= PHP_OS_FAMILY ?> (<?= PHP_OS ?>)</div>
            </div>
            <div class="sys-box">
                <div class="label">PHP Version</div>
                <div class="val"><?= PHP_VERSION ?></div>
            </div>
            <div class="sys-box">
                <div class="label">Fitur symlink()</div>
                <div class="val">
                    <?= $symlinkEnabled ? '<span class="badge badge-green">AKTIF</span>' : '<span class="badge badge-red">NONAKTIF</span>' ?>
                </div>
            </div>
            <div class="sys-box">
                <div class="label">Target Penyimpanan Luar (Aman Git)</div>
                <div class="val" style="font-size: 0.82rem; color: #38bdf8;">
                    <?= htmlspecialchars($persistentStorageDir) ?>
                </div>
            </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
            💡 <strong>Mengapa folder luar ini kebal dari Git?</strong> Git di Hostinger hanya mengelola direktori <span class="code-pill">public_html</span>. Dengan memindahkan storage fisik ke luar folder tersebut (<span class="code-pill">persistent_storage_sft</span>) lalu membuat symlink, foto Anda tidak akan pernah disentuh atau dihapus oleh git pull / git deploy.
        </div>
    </div>

    <!-- Status Folder Upload -->
    <div class="card">
        <h2 style="font-size: 1.15rem; margin-bottom: 0.75rem;">Status Folder Upload Terproteksi</h2>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Folder & Tipe</th>
                        <th>Path di Proyek</th>
                        <th>Status Symlink</th>
                        <th>File Tersimpan</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($folderStatuses as $f): ?>
                        <?php foreach ($f['paths'] as $idx => $p): ?>
                            <tr>
                                <?php if ($idx === 0): ?>
                                    <td rowspan="<?= count($f['paths']) ?>" style="vertical-align: top; font-weight: 500;">
                                        <?= htmlspecialchars($f['name']) ?><br>
                                        <small style="color: var(--text-muted); font-family: monospace;"><?= $f['target_sub'] ?></small>
                                    </td>
                                <?php endif; ?>
                                <td>
                                    <span class="code-pill"><?= htmlspecialchars($p['rel_path']) ?></span>
                                </td>
                                <td>
                                    <?php if ($p['is_link']): ?>
                                        <span class="badge badge-green">✓ TERPROTEKSI (SYMLINK)</span>
                                    <?php else: ?>
                                        <span class="badge badge-yellow">⚠️ BELUM SYMLINK</span>
                                    <?php endif; ?>
                                </td>
                                <?php if ($idx === 0): ?>
                                    <td rowspan="<?= count($f['paths']) ?>" style="vertical-align: top;">
                                        <strong style="color: #34d399; font-size: 1.05rem;"><?= $f['file_count'] ?></strong> file
                                    </td>
                                <?php endif; ?>
                            </tr>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Tombol Eksekusi -->
    <div class="card" style="text-align: center;">
        <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Jalankan Proteksi Storage Otomatis</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 600px; margin: 0 auto 1.5rem auto;">
            Script ini akan menyalin seluruh foto yang ada ke folder aman di luar public_html, lalu membuat symlink otomatis sehingga aplikasi tetap bekerja normal tanpa merusak tautan foto.
        </p>

        <form method="POST" style="display: inline-block;">
            <input type="hidden" name="action" value="run_protection">
            <div class="form-group" style="justify-content: center;">
                <label for="pin" style="font-size: 0.9rem; color: var(--text-muted);">PIN Keamanan:</label>
                <input type="text" id="pin" name="pin" value="sft2026" class="input-pin" required title="PIN Keamanan">
                <button type="submit" class="btn-action" onclick="return confirm('Apakah Anda yakin ingin memproteksi seluruh folder upload dan menghubungkan symlink sekarang?')">
                    ⚡ Jalankan Proteksi Storage Sekarang
                </button>
            </div>
        </form>

        <div style="font-size: 0.8rem; color: #64748b; margin-top: 1rem;">
            Catatan: Jika Anda sedang berada di Localhost Windows, fitur symlink tidak diperlukan karena file tersimpan langsung di harddisk laptop Anda.
        </div>
    </div>
</div>
</body>
</html>
