<?php
/**
 * api/api_delete_foto_aktivitas.php
 * Endpoint untuk menghapus foto dokumentasi aktivitas dari database dan file storage
 * Mendukung: hapus 1 foto, hapus batch foto (file_names[]), atau hapus semua foto (mode: 'all')
 */

error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

// Deteksi direktori root proyek
$projectRoot = dirname(__DIR__);
if (file_exists(dirname(dirname(__DIR__)) . '/artisan')) {
    $projectRoot = dirname(dirname(__DIR__));
} else if (file_exists(dirname(__DIR__) . '/artisan')) {
    $projectRoot = dirname(__DIR__);
}

$inputData = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_POST)) {
        $inputData = $_POST;
    } else {
        $raw = file_get_contents('php://input');
        $inputData = json_decode($raw, true) ?: [];
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request harus POST"]);
    exit();
}

$targetDirs = [
    $projectRoot . '/aktivitas/',
    $projectRoot . '/public/aktivitas/',
    $projectRoot . '/uploads/lokasi/',
    $projectRoot . '/public/uploads/lokasi/',
    $projectRoot . '/uploads/laporan/',
    $projectRoot . '/public/uploads/laporan/',
    $projectRoot . '/uploads/',
    $projectRoot . '/public/uploads/'
];

$mode = trim($inputData['mode'] ?? '');
$isDeleteAll = ($mode === 'all' || !empty($inputData['delete_all']) || ($inputData['file_name'] ?? '') === '__ALL__');

// ==============================================================
// 1. FITUR HAPUS SEMUA FOTO
// ==============================================================
if ($isDeleteAll) {
    $deletedFromDb = 0;
    $deletedFilesCount = 0;

    // Bersihkan seluruh referensi foto di database tabel aktivitas
    if ($conn) {
        $upSql = "UPDATE aktivitas SET foto = NULL, foto_laporan = NULL 
                  WHERE (foto IS NOT NULL AND foto != '') OR (foto_laporan IS NOT NULL AND foto_laporan != '')";
        if ($conn->query($upSql)) {
            $deletedFromDb = $conn->affected_rows;
        }
    }

    // Hapus seluruh file gambar di direktori aktivitas/ dan public/aktivitas/
    $scanDirs = [
        $projectRoot . '/aktivitas/',
        $projectRoot . '/public/aktivitas/'
    ];

    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    foreach ($scanDirs as $dir) {
        if (is_dir($dir)) {
            $files = @scandir($dir) ?: [];
            foreach ($files as $f) {
                if ($f === '.' || $f === '..' || $f === '.gitignore' || $f === 'index.php') continue;
                $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                if (in_array($ext, $allowedExts)) {
                    $fullPath = $dir . $f;
                    if (is_file($fullPath) && @unlink($fullPath)) {
                        $deletedFilesCount++;
                    }
                }
            }
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Seluruh foto aktivitas di sistem berhasil dihapus.",
        "mode" => "all",
        "deleted_files_count" => $deletedFilesCount,
        "deleted_from_db" => $deletedFromDb
    ]);
    exit();
}

// ==============================================================
// 2. FITUR HAPUS SATU FOTO / BATCH LIST FOTO
// ==============================================================
$filesToDelete = [];
if (!empty($inputData['file_names'])) {
    if (is_array($inputData['file_names'])) {
        $filesToDelete = $inputData['file_names'];
    } else if (is_string($inputData['file_names'])) {
        $decoded = json_decode($inputData['file_names'], true);
        if (is_array($decoded)) {
            $filesToDelete = $decoded;
        } else {
            $filesToDelete = explode(',', $inputData['file_names']);
        }
    }
} else if (!empty($inputData['file_name'])) {
    $filesToDelete = [$inputData['file_name']];
}

if (empty($filesToDelete)) {
    echo json_encode(["status" => "error", "message" => "Parameter file_name atau file_names wajib diisi"]);
    exit();
}

$deletedFromDb = 0;
$deletedFilesCount = 0;
$aktivitasId = isset($inputData['aktivitas_id']) ? intval($inputData['aktivitas_id']) : 0;

foreach ($filesToDelete as $rawFileName) {
    $fileName = basename(trim($rawFileName));
    $cleanFileName = str_replace(['..', '/', '\\'], '', $fileName);
    if (empty($cleanFileName)) continue;

    // Bersihkan dari DB
    if ($conn) {
        $searchEscaped = $conn->real_escape_string($cleanFileName);
        $query = "SELECT id, foto, foto_laporan FROM aktivitas 
                  WHERE foto LIKE '%$searchEscaped%' OR foto_laporan LIKE '%$searchEscaped%'";
        if ($aktivitasId > 0) {
            $query .= " OR id = $aktivitasId";
        }

        $res = $conn->query($query);
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $rowId = intval($row['id']);
                $oldFoto = $row['foto'] ?? '';
                $oldFotoLaporan = $row['foto_laporan'] ?? '';

                $newFotoArr = [];
                if (!empty($oldFoto)) {
                    $parts = explode(',', $oldFoto);
                    foreach ($parts as $p) {
                        $pTrim = trim($p);
                        if (empty($pTrim)) continue;
                        if (basename($pTrim) !== $cleanFileName && $pTrim !== $cleanFileName) {
                            $newFotoArr[] = $pTrim;
                        }
                    }
                }

                $newFotoLapArr = [];
                if (!empty($oldFotoLaporan)) {
                    $parts = explode(',', $oldFotoLaporan);
                    foreach ($parts as $p) {
                        $pTrim = trim($p);
                        if (empty($pTrim)) continue;
                        if (basename($pTrim) !== $cleanFileName && $pTrim !== $cleanFileName) {
                            $newFotoLapArr[] = $pTrim;
                        }
                    }
                }

                $newFotoStr = implode(',', $newFotoArr);
                $newFotoLapStr = implode(',', $newFotoLapArr);

                $upSql = "UPDATE aktivitas SET 
                          foto = " . (empty($newFotoStr) ? "NULL" : "'" . $conn->real_escape_string($newFotoStr) . "'") . ", 
                          foto_laporan = " . (empty($newFotoLapStr) ? "NULL" : "'" . $conn->real_escape_string($newFotoLapStr) . "'") . " 
                          WHERE id = $rowId";
                if ($conn->query($upSql)) {
                    $deletedFromDb++;
                }
            }
        }
    }

    // Hapus fisik dari disk
    foreach ($targetDirs as $dir) {
        $fullPath = $dir . $cleanFileName;
        if (file_exists($fullPath) && is_file($fullPath)) {
            if (@unlink($fullPath)) {
                $deletedFilesCount++;
            }
        }
    }
}

echo json_encode([
    "status" => "success",
    "message" => "Foto dokumentasi aktivitas berhasil dihapus dari sistem.",
    "deleted_files_count" => $deletedFilesCount,
    "deleted_from_db" => $deletedFromDb
]);
exit();
