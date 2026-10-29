<?php
/**
 * api/api_kacab_upload_foto.php
 * Endpoint Khusus Kepala Cabang (Kacab) untuk Upload Massal (Bulk / Multi-Upload) Foto Aktivitas Sales
 */

// Cegah output HTML liar agar JSON tidak corrupt
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

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Koneksi ke database terputus. Pastikan MySQL aktif."]);
    exit();
}

// Deteksi direktori root proyek
$projectRoot = dirname(__DIR__);
if (file_exists(dirname(dirname(__DIR__)) . '/artisan')) {
    $projectRoot = dirname(dirname(__DIR__));
} else if (file_exists(dirname(__DIR__) . '/artisan')) {
    $projectRoot = dirname(__DIR__);
}

// Pastikan semua target folder upload dan galeri ada
$uploadDirs = [
    $projectRoot . '/uploads/lokasi/',
    $projectRoot . '/public/uploads/lokasi/',
    $projectRoot . '/uploads/laporan/',
    $projectRoot . '/public/uploads/laporan/',
    $projectRoot . '/aktivitas/',
    $projectRoot . '/public/aktivitas/'
];

foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Metode request harus POST"]);
        exit();
    }

    $sales_account_id = preg_replace('/[^0-9]/', '', $_POST['sales_account_id'] ?? '1');
    if (empty($sales_account_id)) $sales_account_id = '1';

    $nama_sales = trim($_POST['nama_sales'] ?? 'Tim Sales Cabang');
    if (empty($nama_sales)) $nama_sales = 'Tim Sales Cabang';

    $tipe_aktivitas = trim($_POST['tipe_aktivitas'] ?? 'Pameran (Exhibition / Booth)');
    if (empty($tipe_aktivitas)) $tipe_aktivitas = 'Pameran (Exhibition / Booth)';

    $lokasi = trim($_POST['lokasi'] ?? 'Bandung & Sekitarnya');
    if (empty($lokasi)) $lokasi = 'Bandung & Sekitarnya';

    $keterangan = trim($_POST['keterangan'] ?? 'Dokumentasi foto aktivitas kegiatan sales cabang');
    if (empty($keterangan)) $keterangan = 'Dokumentasi foto aktivitas kegiatan sales cabang';

    $durasi = trim($_POST['durasi'] ?? '1 Jam');
    $mode_upload = trim($_POST['mode_upload'] ?? 'gabung'); // 'gabung' atau 'pisah'
    $existing_activity_id = isset($_POST['existing_activity_id']) ? intval($_POST['existing_activity_id']) : 0;

    // Sesi waktu
    $sesi_waktu = trim($_POST['sesi_waktu'] ?? '');
    if (!in_array($sesi_waktu, ['Pagi', 'Siang', 'Sore', 'Malam'])) {
        $hour = intval(date('H'));
        if ($hour >= 5 && $hour < 12) $sesi_waktu = 'Pagi';
        elseif ($hour >= 12 && $hour < 15) $sesi_waktu = 'Siang';
        elseif ($hour >= 15 && $hour < 18) $sesi_waktu = 'Sore';
        else $sesi_waktu = 'Malam';
    }

    // Tanggal & Jam
    $tanggal = trim($_POST['tanggal'] ?? date('Y-m-d'));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
        $tanggal = date('Y-m-d');
    }

    $jam = trim($_POST['jam'] ?? date('H:i'));
    if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $jam)) {
        $jam = date('H:i');
    }
    if (strlen($jam) === 5) $jam .= ':00';

    $created_at_val = "$tanggal $jam";
    $waktu_pelaksanaan_val = substr($jam, 0, 5);
    $waktu_selesai_val = date('Y-m-d H:i:s', strtotime($created_at_val . ' +1 hour'));
    $status_val = 'Selesai';

    // Cek file foto yang dikirim
    $uploaded_files = [];
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'webp', 'jfif'];

    if (isset($_FILES['foto'])) {
        $filesObj = $_FILES['foto'];
        $isMulti = is_array($filesObj['name']);
        $totalFiles = $isMulti ? count($filesObj['name']) : 1;

        for ($i = 0; $i < $totalFiles; $i++) {
            $fName = $isMulti ? $filesObj['name'][$i] : $filesObj['name'];
            $fTmp  = $isMulti ? $filesObj['tmp_name'][$i] : $filesObj['tmp_name'];
            $fErr  = $isMulti ? $filesObj['error'][$i] : $filesObj['error'];

            if ($fErr === UPLOAD_ERR_OK && is_uploaded_file($fTmp)) {
                $ext = strtolower(pathinfo($fName, PATHINFO_EXTENSION));
                if (!in_array($ext, $allowed_extensions)) {
                    continue;
                }

                $sanitized = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', basename($fName));
                $targetFileName = time() . '_' . uniqid() . '_' . $sanitized;

                // Simpan master ke uploads/lokasi/
                $masterPath = $projectRoot . '/uploads/lokasi/' . $targetFileName;
                if (@move_uploaded_file($fTmp, $masterPath)) {
                    $uploaded_files[] = $targetFileName;

                    // Salin ke direktori lain agar langsung dapat diakses oleh galeri dan public
                    @copy($masterPath, $projectRoot . '/public/uploads/lokasi/' . $targetFileName);
                    @copy($masterPath, $projectRoot . '/uploads/laporan/' . $targetFileName);
                    @copy($masterPath, $projectRoot . '/public/uploads/laporan/' . $targetFileName);
                    @copy($masterPath, $projectRoot . '/aktivitas/' . $targetFileName);
                    @copy($masterPath, $projectRoot . '/public/aktivitas/' . $targetFileName);
                }
            }
        }
    }

    if (empty($uploaded_files) && $existing_activity_id <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Tidak ada file foto valid yang diunggah. Pastikan format foto adalah JPG, JPEG, PNG, atau WEBP."
        ]);
        exit();
    }

    $saved_activity_id = $existing_activity_id;
    $inserted_records = 0;

    if ($mode_upload === 'gabung') {
        $foto_string = implode(',', $uploaded_files);

        if ($existing_activity_id > 0) {
            // Append foto ke aktivitas yang sudah dibuat pada chunk sebelumnya
            $stmtGet = $conn->prepare("SELECT foto, foto_laporan FROM aktivitas WHERE id = ? LIMIT 1");
            $stmtGet->bind_param("i", $existing_activity_id);
            $stmtGet->execute();
            $resGet = $stmtGet->get_result();

            if ($resGet && $rowGet = $resGet->fetch_assoc()) {
                $existingFoto = trim($rowGet['foto'] ?? '');
                $existingLap  = trim($rowGet['foto_laporan'] ?? '');

                $newFoto = !empty($existingFoto) ? ($existingFoto . ',' . $foto_string) : $foto_string;
                $newLap  = !empty($existingLap)  ? ($existingLap . ',' . $foto_string)  : $foto_string;

                $stmtUp = $conn->prepare("UPDATE aktivitas SET foto = ?, foto_laporan = ? WHERE id = ?");
                $stmtUp->bind_param("ssi", $newFoto, $newLap, $existing_activity_id);
                $stmtUp->execute();
                $stmtUp->close();
            }
            $stmtGet->close();
            $saved_activity_id = $existing_activity_id;
        } else {
            // Buat entri aktivitas baru
            $stmt = $conn->prepare("INSERT INTO aktivitas (
                sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, 
                foto, status, sesi_waktu, durasi, laporan_hasil, jumlah_prospek, 
                waktu_selesai, waktu_pelaksanaan, created_at, foto_laporan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)");

            if (!$stmt) {
                echo json_encode(["status" => "error", "message" => "Gagal prepare query SQL: " . $conn->error]);
                exit();
            }

            $stmt->bind_param(
                "ssssssssssssss",
                $sales_account_id, $nama_sales, $tipe_aktivitas, $keterangan, $lokasi,
                $foto_string, $status_val, $sesi_waktu, $durasi, $keterangan,
                $waktu_selesai_val, $waktu_pelaksanaan_val, $created_at_val, $foto_string
            );

            if ($stmt->execute()) {
                $saved_activity_id = $conn->insert_id;
                $inserted_records = 1;
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menyimpan entri aktivitas: " . $stmt->error]);
                exit();
            }
            $stmt->close();
        }
    } else {
        // Mode 'pisah': setiap foto dicatat sebagai aktivitas terpisah
        $stmt = $conn->prepare("INSERT INTO aktivitas (
            sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, 
            foto, status, sesi_waktu, durasi, laporan_hasil, jumlah_prospek, 
            waktu_selesai, waktu_pelaksanaan, created_at, foto_laporan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)");

        if (!$stmt) {
            echo json_encode(["status" => "error", "message" => "Gagal prepare query SQL: " . $conn->error]);
            exit();
        }

        foreach ($uploaded_files as $fSingle) {
            $stmt->bind_param(
                "ssssssssssssss",
                $sales_account_id, $nama_sales, $tipe_aktivitas, $keterangan, $lokasi,
                $fSingle, $status_val, $sesi_waktu, $durasi, $keterangan,
                $waktu_selesai_val, $waktu_pelaksanaan_val, $created_at_val, $fSingle
            );
            if ($stmt->execute()) {
                $inserted_records++;
                if (!$saved_activity_id) {
                    $saved_activity_id = $conn->insert_id;
                }
            }
        }
        $stmt->close();
    }

    echo json_encode([
        "status" => "success",
        "message" => "Berhasil mengunggah " . count($uploaded_files) . " foto aktivitas sales!",
        "activity_id" => $saved_activity_id,
        "files_count" => count($uploaded_files),
        "mode_upload" => $mode_upload,
        "nama_sales" => $nama_sales,
        "tipe_aktivitas" => $tipe_aktivitas,
        "lokasi" => $lokasi,
        "tanggal" => $tanggal,
        "uploaded_files" => $uploaded_files
    ]);

} catch (Throwable $t) {
    echo json_encode(["status" => "error", "message" => "Terjadi kesalahan server: " . $t->getMessage()]);
}
?>

