<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'koneksi.php';

    // Pastikan tabel kacab_approvals ada
    $conn->query("CREATE TABLE IF NOT EXISTS kacab_approvals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jenis VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        pemohon_sales VARCHAR(100) NOT NULL,
        nama_spv VARCHAR(100) NOT NULL,
        nama_customer VARCHAR(100) NOT NULL,
        diskon_standar DECIMAL(12, 2) DEFAULT 0,
        diskon_pengajuan DECIMAL(12, 2) DEFAULT 0,
        harga_pasar DECIMAL(12, 2) DEFAULT 0,
        pengajuan_appraisal DECIMAL(12, 2) DEFAULT 0,
        status ENUM('Menunggu', 'Disetujui', 'Ditolak') DEFAULT 'Menunggu',
        catatan_pemohon TEXT,
        catatan_kacab TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $action = $data->action ?? 'update_status';

        if ($action === 'update_status' && isset($data->id) && isset($data->status)) {
            $id = intval($data->id);
            $status = $conn->real_escape_string($data->status);
            $catatan_kacab = $conn->real_escape_string($data->catatan_kacab ?? '');

            $stmt = $conn->prepare("UPDATE kacab_approvals SET status = ?, catatan_kacab = ? WHERE id = ?");
            $stmt->bind_param("ssi", $status, $catatan_kacab, $id);

            if ($stmt->execute()) {
                echo json_encode(["ok" => true, "message" => "Status otorisasi berhasil diperbarui"]);
            } else {
                echo json_encode(["ok" => false, "message" => "Gagal memperbarui status: " . $conn->error]);
            }
            $stmt->close();
        } elseif ($action === 'create_pengajuan' && !empty($data->jenis)) {
            $jenis = $conn->real_escape_string($data->jenis);
            $model = $conn->real_escape_string($data->model ?? '');
            $pemohon_sales = $conn->real_escape_string($data->pemohon_sales ?? 'Sales Consultant');
            $nama_spv = $conn->real_escape_string($data->nama_spv ?? 'Supervisor');
            $nama_customer = $conn->real_escape_string($data->nama_customer ?? 'Customer');
            $diskon_standar = floatval($data->diskon_standar ?? 0);
            $diskon_pengajuan = floatval($data->diskon_pengajuan ?? 0);
            $harga_pasar = floatval($data->harga_pasar ?? 0);
            $pengajuan_appraisal = floatval($data->pengajuan_appraisal ?? 0);
            $catatan_pemohon = $conn->real_escape_string($data->catatan_pemohon ?? '');

            $stmt = $conn->prepare("INSERT INTO kacab_approvals (jenis, model, pemohon_sales, nama_spv, nama_customer, diskon_standar, diskon_pengajuan, harga_pasar, pengajuan_appraisal, catatan_pemohon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssdddds", $jenis, $model, $pemohon_sales, $nama_spv, $nama_customer, $diskon_standar, $diskon_pengajuan, $harga_pasar, $pengajuan_appraisal, $catatan_pemohon);

            if ($stmt->execute()) {
                echo json_encode(["ok" => true, "message" => "Pengajuan otorisasi berhasil dibuat", "id" => $conn->insert_id]);
            } else {
                echo json_encode(["ok" => false, "message" => "Gagal membuat pengajuan: " . $conn->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["ok" => false, "message" => "Parameter POST tidak valid!"]);
        }
    } else {
        // GET Request: Ambil daftar pengajuan otorisasi dari database real
        $result = $conn->query("SELECT id, jenis, model, pemohon_sales, nama_spv, nama_customer, diskon_standar, diskon_pengajuan, harga_pasar, pengajuan_appraisal, status, catatan_pemohon, catatan_kacab, created_at FROM kacab_approvals ORDER BY id DESC");

        $approvals = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['id'] = intval($row['id']);
                $row['diskon_standar'] = floatval($row['diskon_standar']);
                $row['diskon_pengajuan'] = floatval($row['diskon_pengajuan']);
                $row['harga_pasar'] = floatval($row['harga_pasar']);
                $row['pengajuan_appraisal'] = floatval($row['pengajuan_appraisal']);
                $approvals[] = $row;
            }
        }

        echo json_encode([
            "ok" => true,
            "data" => $approvals
        ]);
    }
} catch (Throwable $e) {
    echo json_encode(["ok" => false, "message" => "Terjadi kesalahan server: " . $e->getMessage()]);
}

if (isset($conn) && $conn) {
    $conn->close();
}
?>
