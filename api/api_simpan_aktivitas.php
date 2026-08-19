<?php
// Prevent raw HTML error output from damaging JSON
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

require_once 'koneksi.php';

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Koneksi ke database terputus. Pastikan MySQL pada Laragon aktif."]);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $action = $_POST['action'] ?? '';

        // Action 0: Update Status Only (e.g. Rencana -> Sedang Dilakukan)
        if ($action === 'update_status') {
            $id = isset($_POST['aktivitas_id']) ? intval($_POST['aktivitas_id']) : 0;
            $status_baru = $_POST['status'] ?? 'Sedang Dilakukan';

            if ($id <= 0) {
                echo json_encode(["status" => "error", "message" => "ID Aktivitas tidak valid"]);
                exit();
            }

            $stmt = $conn->prepare("UPDATE aktivitas SET status = ? WHERE id = ?");
            if (!$stmt) {
                echo json_encode(["status" => "error", "message" => "Gagal prepare query status: " . $conn->error]);
                exit();
            }
            $stmt->bind_param("si", $status_baru, $id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Status aktivitas berhasil diperbarui ke " . $status_baru]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui status: " . $stmt->error]);
            }
            $stmt->close();
            $conn->close();
            exit();
        }

        // Action 1: Submit Laporan Hasil Aktivitas (Complete Activity)
        if ($action === 'submit_laporan' || (isset($_POST['aktivitas_id']) && isset($_POST['laporan_hasil']))) {
            $id = isset($_POST['aktivitas_id']) ? intval($_POST['aktivitas_id']) : 0;
            $laporan_hasil = $_POST['laporan_hasil'] ?? '';
            $jumlah_prospek = isset($_POST['jumlah_prospek']) ? intval($_POST['jumlah_prospek']) : 0;

            if ($id <= 0) {
                echo json_encode(["status" => "error", "message" => "ID Aktivitas tidak valid"]);
                exit();
            }

            // Handle upload foto laporan hasil
            $uploaded_files = [];
            $upload_dir = __DIR__ . '/../uploads/laporan/';
            if (!is_dir($upload_dir)) {
                @mkdir($upload_dir, 0777, true);
            }

            if (isset($_FILES['foto_laporan'])) {
                $jumlah_foto = is_array($_FILES['foto_laporan']['name']) ? count($_FILES['foto_laporan']['name']) : 1;
                if (is_array($_FILES['foto_laporan']['name'])) {
                    for ($i = 0; $i < $jumlah_foto; $i++) {
                        if (isset($_FILES['foto_laporan']['error'][$i]) && $_FILES['foto_laporan']['error'][$i] == 0) {
                            $file_name = time() . '_lap_' . uniqid() . '_' . basename($_FILES['foto_laporan']['name'][$i]);
                            $file_path = $upload_dir . $file_name;
                            if (@move_uploaded_file($_FILES['foto_laporan']['tmp_name'][$i], $file_path)) {
                                $uploaded_files[] = $file_name;
                            }
                        }
                    }
                } else {
                    if (isset($_FILES['foto_laporan']['error']) && $_FILES['foto_laporan']['error'] == 0) {
                        $file_name = time() . '_lap_' . uniqid() . '_' . basename($_FILES['foto_laporan']['name']);
                        $file_path = $upload_dir . $file_name;
                        if (@move_uploaded_file($_FILES['foto_laporan']['tmp_name'], $file_path)) {
                            $uploaded_files[] = $file_name;
                        }
                    }
                }
            }

            $foto_laporan_string = implode(',', $uploaded_files);

            $stmt = $conn->prepare("UPDATE aktivitas SET status = 'Selesai', laporan_hasil = ?, jumlah_prospek = ?, foto_laporan = IF(? != '', ?, foto_laporan), waktu_selesai = NOW() WHERE id = ?");
            if (!$stmt) {
                echo json_encode(["status" => "error", "message" => "Gagal prepare query laporan: " . $conn->error]);
                exit();
            }
            $stmt->bind_param("sissi", $laporan_hasil, $jumlah_prospek, $foto_laporan_string, $foto_laporan_string, $id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Laporan hasil aktivitas berhasil disimpan!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui laporan: " . $stmt->error]);
            }

            $stmt->close();
            $conn->close();
            exit();
        }

        // Action 2: Create New Activity
        $tipe = $_POST['tipe_Aktivitas'] ?? $_POST['jenisAktivitas'] ?? $_POST['tipe_aktivitas'] ?? '';
        $keterangan = $_POST['keterangan'] ?? $_POST['keteranganAktivitas'] ?? '';
        $lokasi = $_POST['lokasi'] ?? '';
        $nama_sales = $_POST['nama_sales'] ?? 'Sales Consultant';
        $status = $_POST['status'] ?? 'Sedang Dilakukan';
        if (!in_array($status, ['Rencana', 'Sedang Dilakukan', 'Selesai'])) {
            $status = 'Sedang Dilakukan';
        }

        $sesi_waktu = $_POST['sesi_waktu'] ?? '';
        if (!in_array($sesi_waktu, ['Pagi', 'Siang', 'Sore'])) {
            $hour = intval(date('H'));
            if ($hour < 12) $sesi_waktu = 'Pagi';
            else if ($hour < 15.5) $sesi_waktu = 'Siang';
            else $sesi_waktu = 'Sore';
        }

        $durasi = $_POST['durasi'] ?? '1 Jam';
        $laporan_hasil = $_POST['laporan_hasil'] ?? '';
        $jumlah_prospek = isset($_POST['jumlah_prospek']) ? intval($_POST['jumlah_prospek']) : 0;

        // Handle Upload Multi Foto
        $uploaded_files = [];
        $upload_dir = __DIR__ . '/../uploads/lokasi/';
        if (!is_dir($upload_dir)) {
            @mkdir($upload_dir, 0777, true);
        }

        if (isset($_FILES['foto'])) {
            $jumlah_foto = is_array($_FILES['foto']['name']) ? count($_FILES['foto']['name']) : 1;
            if (is_array($_FILES['foto']['name'])) {
                for ($i = 0; $i < $jumlah_foto; $i++) {
                    if (isset($_FILES['foto']['error'][$i]) && $_FILES['foto']['error'][$i] == 0) {
                        $file_name = time() . '_' . uniqid() . '_' . basename($_FILES['foto']['name'][$i]);
                        $file_path = $upload_dir . $file_name;
                        if (@move_uploaded_file($_FILES['foto']['tmp_name'][$i], $file_path)) {
                            $uploaded_files[] = $file_name;
                        }
                    }
                }
            } else {
                if (isset($_FILES['foto']['error']) && $_FILES['foto']['error'] == 0) {
                    $file_name = time() . '_' . uniqid() . '_' . basename($_FILES['foto']['name']);
                    $file_path = $upload_dir . $file_name;
                    if (@move_uploaded_file($_FILES['foto']['tmp_name'], $file_path)) {
                        $uploaded_files[] = $file_name;
                    }
                }
            }
        }

        $foto_string = implode(',', $uploaded_files);
        
        // Parse sales_account_id safely to support any BIGINT or string ID
        $raw_sales_id = $_POST['sales_account_id'] ?? '1';
        $sales_account_id = preg_replace('/[^0-9]/', '', $raw_sales_id);
        if (empty($sales_account_id)) $sales_account_id = '1';

        $waktu_selesai_val = ($status === 'Selesai') ? date('Y-m-d H:i:s') : null;

        $stmt = $conn->prepare("INSERT INTO aktivitas (sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, durasi, laporan_hasil, jumlah_prospek, waktu_selesai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            echo json_encode(["status" => "error", "message" => "Gagal prepare query insert: " . $conn->error]);
            exit();
        }
        
        // Bind sales_account_id as string ("s") to safely support BIGINT (12 parameters = 10s + 1i + 1s)
        $stmt->bind_param("ssssssssssis", $sales_account_id, $nama_sales, $tipe, $keterangan, $lokasi, $foto_string, $status, $sesi_waktu, $durasi, $laporan_hasil, $jumlah_prospek, $waktu_selesai_val);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Aktivitas berhasil disimpan",
                "id" => $conn->insert_id,
                "sesi_waktu" => $sesi_waktu,
                "durasi" => $durasi
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $stmt->error]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan"]);
    }
} catch (Throwable $t) {
    echo json_encode(["status" => "error", "message" => "Terjadi kesalahan server: " . $t->getMessage()]);
}
?>