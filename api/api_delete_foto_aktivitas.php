<?php
/**
 * api/api_delete_foto_aktivitas.php
 * Endpoint untuk menghapus foto dokumentasi aktivitas dari database dan file storage
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

$rawFileName = trim($inputData['file_name'] ?? '');
$aktivitasId = isset($inputData['aktivitas_id']) ? intval($inputData['aktivitas_id']) : 0;

if (empty($rawFileName)) {
    echo json_encode(["status" => "error", "message" => "Parameter file_name wajib diisi"]);
    exit();
}

// Sanitasi nama file agar tidak ada path traversal
$fileName = basename($rawFileName);
$cleanFileName = str_replace(['..', '/', '\\'], '', $fileName);

if (empty($cleanFileName)) {
    echo json_encode(["status" => "error", "message" => "Nama file tidak valid"]);
    exit();
}

$deletedFromDb = 0;
$deletedFilesCount = 0;

// 1. Bersihkan database jika koneksi tersedia
if ($conn) {
    // Cari baris di tabel aktivitas yang memuat file ini
    $searchEscaped = $conn->real_escape_string($cleanFileName);
    $query = "SELECT id, foto, foto_laporan, keterangan, tipe_aktivitas FROM aktivitas 
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

            // Hapus dari kolom 'foto'
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

            // Hapus dari kolom 'foto_laporan'
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

            // Update kolom foto dan foto_laporan di database
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

// 2. Hapus berkas fisik dari disk di semua direktori terkait
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

foreach ($targetDirs as $dir) {
    $fullPath = $dir . $cleanFileName;
    if (file_exists($fullPath) && is_file($fullPath)) {
        if (@unlink($fullPath)) {
            $deletedFilesCount++;
        }
    }
}

echo json_encode([
    "status" => "success",
    "message" => "Foto dokumentasi aktivitas berhasil dihapus dari sistem.",
    "file_name" => $cleanFileName,
    "deleted_files_count" => $deletedFilesCount,
    "deleted_from_db" => $deletedFromDb
]);
exit();

