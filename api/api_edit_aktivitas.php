<?php
/**
 * api_edit_aktivitas.php
 * API Endpoint Khusus Portal Kepala Cabang (Kacab) untuk Memperbarui Informasi Aktivitas Sales
 * Mengizinkan pengeditan: Nama Sales, Tipe Aktivitas, Lokasi/Tempat, Keterangan, Status, Tanggal & Jam, Sesi, Durasi, Laporan Hasil, Jumlah Prospek, dan Foto.
 */

error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Metode request harus POST"]);
    exit();
}

$id = isset($_POST['aktivitas_id']) ? intval($_POST['aktivitas_id']) : 0;
if ($id <= 0) {
    echo json_encode(["status" => "error", "message" => "ID Aktivitas tidak valid atau kosong"]);
    exit();
}

// Cek keberadaan aktivitas
$checkStmt = $conn->prepare("SELECT * FROM aktivitas WHERE id = ? LIMIT 1");
$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$current = $checkStmt->get_result()->fetch_assoc();
$checkStmt->close();

if (!$current) {
    echo json_encode(["status" => "error", "message" => "Data aktivitas #{$id} tidak ditemukan"]);
    exit();
}

// Tangkap input yang dikirim
$namaSales = trim($_POST['nama_sales'] ?? $current['nama_sales']);
$salesAccountId = isset($_POST['sales_account_id']) && intval($_POST['sales_account_id']) > 0 
    ? intval($_POST['sales_account_id']) 
    : intval($current['sales_account_id']);

// Jika sales_account_id tidak dikirim, cari berdasarkan nama_sales di sales_accounts
if ($salesAccountId <= 0 && !empty($namaSales)) {
    $sQ = $conn->prepare("SELECT id FROM sales_accounts WHERE nama_lengkap = ? LIMIT 1");
    if ($sQ) {
        $sQ->bind_param("s", $namaSales);
        $sQ->execute();
        $sRes = $sQ->get_result()->fetch_assoc();
        if ($sRes) {
            $salesAccountId = intval($sRes['id']);
        }
        $sQ->close();
    }
}

$tipeAktivitas = trim($_POST['tipe_aktivitas'] ?? $current['tipe_aktivitas']);
$keterangan = trim($_POST['keterangan'] ?? $current['keterangan']);
$lokasi = trim($_POST['lokasi'] ?? $current['lokasi']);
$status = trim($_POST['status'] ?? $current['status']);
if (!in_array($status, ['Rencana', 'Sedang Dilakukan', 'Selesai'])) {
    $status = 'Selesai';
}

$sesiWaktu = trim($_POST['sesi_waktu'] ?? $current['sesi_waktu']);
$durasi = trim($_POST['durasi'] ?? $current['durasi']);
$laporanHasil = trim($_POST['laporan_hasil'] ?? $current['laporan_hasil']);
$jumlahProspek = isset($_POST['jumlah_prospek']) ? intval($_POST['jumlah_prospek']) : intval($current['jumlah_prospek']);

// Penanganan Tanggal & Waktu Pelaksanaan
$tanggal = trim($_POST['tanggal'] ?? '');
$jam = trim($_POST['jam'] ?? '');

$createdAt = $current['created_at'];
$waktuPelaksanaan = $current['waktu_pelaksanaan'];

if (!empty($tanggal)) {
    if (empty($jam)) {
        $jam = !empty($current['waktu_pelaksanaan']) ? $current['waktu_pelaksanaan'] : date('H:i:s', strtotime($current['created_at']));
    }
    // Pastikan format jam HH:MM:SS
    if (strlen($jam) === 5) {
        $jam .= ':00';
    }
    $createdAt = "{$tanggal} {$jam}";
    $waktuPelaksanaan = substr($jam, 0, 5);

    // Otomatis hitung sesi jika tidak dipilih
    if (empty($_POST['sesi_waktu'])) {
        $h = intval(substr($jam, 0, 2));
        if ($h >= 5 && $h < 12) $sesiWaktu = 'Pagi';
        elseif ($h >= 12 && $h < 15) $sesiWaktu = 'Siang';
        elseif ($h >= 15 && $h < 18) $sesiWaktu = 'Sore';
        else $sesiWaktu = 'Malam';
    }
} elseif (!empty($jam)) {
    $tglOnly = substr($current['created_at'], 0, 10);
    if (strlen($jam) === 5) {
        $jam .= ':00';
    }
    $createdAt = "{$tglOnly} {$jam}";
    $waktuPelaksanaan = substr($jam, 0, 5);
}

// Penanganan Upload Foto Baru jika ada
$fotoPath = $current['foto'];
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $fileTmp = $_FILES['foto']['tmp_name'];
    $originalName = basename($_FILES['foto']['name']);
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    
    $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'jfif'];
    if (in_array($ext, $allowedExt)) {
        $cleanName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $originalName);
        $newFileName = time() . '_' . uniqid() . '_' . $cleanName;

        $targetDirs = [
            dirname(__DIR__) . '/aktivitas/',
            dirname(__DIR__) . '/public/aktivitas/',
            dirname(__DIR__) . '/uploads/lokasi/',
            dirname(__DIR__) . '/public/uploads/lokasi/'
        ];

        foreach ($targetDirs as $td) {
            if (!is_dir($td)) {
                @mkdir($td, 0777, true);
            }
        }

        // Simpan ke target pertama, lalu salin ke target lain
        $mainTarget = $targetDirs[0] . $newFileName;
        if (move_uploaded_file($fileTmp, $mainTarget)) {
            for ($i = 1; $i < count($targetDirs); $i++) {
                @copy($mainTarget, $targetDirs[$i] . $newFileName);
            }
            $fotoPath = 'aktivitas/' . $newFileName;
        }
    }
}

// Eksekusi UPDATE di database
$updateSql = "UPDATE aktivitas SET 
    nama_sales = ?, 
    sales_account_id = ?, 
    tipe_aktivitas = ?, 
    keterangan = ?, 
    lokasi = ?, 
    status = ?, 
    sesi_waktu = ?, 
    durasi = ?, 
    laporan_hasil = ?, 
    jumlah_prospek = ?, 
    waktu_pelaksanaan = ?, 
    created_at = ?,
    foto = ?
WHERE id = ?";

$stmt = $conn->prepare($updateSql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Gagal prepare query update: " . $conn->error]);
    exit();
}

$stmt->bind_param(
    "sisssssssisssi",
    $namaSales,
    $salesAccountId,
    $tipeAktivitas,
    $keterangan,
    $lokasi,
    $status,
    $sesiWaktu,
    $durasi,
    $laporanHasil,
    $jumlahProspek,
    $waktuPelaksanaan,
    $createdAt,
    $fotoPath,
    $id
);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Gagal memperbarui aktivitas: " . $stmt->error]);
    $stmt->close();
    exit();
}
$stmt->close();

// Sync update ke local DB jika terkoneksi
$localConn = @new mysqli("localhost", "root", "", "db_sales_app", 3306);
if ($localConn && !$localConn->connect_error) {
    $locStmt = $localConn->prepare($updateSql);
    if ($locStmt) {
        $locStmt->bind_param(
            "sisssssssisssi",
            $namaSales,
            $salesAccountId,
            $tipeAktivitas,
            $keterangan,
            $lokasi,
            $status,
            $sesiWaktu,
            $durasi,
            $laporanHasil,
            $jumlahProspek,
            $waktuPelaksanaan,
            $createdAt,
            $fotoPath,
            $id
        );
        $locStmt->execute();
        $locStmt->close();
    }
    $localConn->close();
}

// Ambil data terbaru untuk dikembalikan ke frontend
$fetchStmt = $conn->prepare("SELECT * FROM aktivitas WHERE id = ? LIMIT 1");
$fetchStmt->bind_param("i", $id);
$fetchStmt->execute();
$updatedData = $fetchStmt->get_result()->fetch_assoc();
$fetchStmt->close();

echo json_encode([
    "status" => "success",
    "message" => "Informasi aktivitas berhasil diperbarui oleh Kepala Cabang!",
    "data" => $updatedData
]);
