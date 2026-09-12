<?php
require_once 'koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sales_id = intval($_GET['sales_id'] ?? 0);
    $query = "SELECT * FROM tabel_handover_delivery";
    if ($sales_id > 0) {
        $query .= " WHERE sales_account_id = $sales_id";
    }
    $query .= " ORDER BY created_at DESC LIMIT 50";

    $result = $conn->query($query);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $data]);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    $sales_account_id = intval($data['sales_account_id'] ?? 1);
    $nama_customer = $conn->real_escape_string(trim($data['nama_customer'] ?? ''));
    $no_hp = $conn->real_escape_string(trim($data['no_hp'] ?? ''));
    $model_unit = $conn->real_escape_string(trim($data['model_unit'] ?? ''));
    $no_rangka = $conn->real_escape_string(trim($data['no_rangka'] ?? ''));
    $no_mesin = $conn->real_escape_string(trim($data['no_mesin'] ?? ''));
    $pdi_checklist = $conn->real_escape_string(json_encode($data['pdi_checklist'] ?? []));
    $tanda_tangan = $conn->real_escape_string($data['tanda_tangan'] ?? '');
    $foto_ceremony = $conn->real_escape_string($data['foto_ceremony'] ?? '');

    if (empty($nama_customer) || empty($model_unit)) {
        echo json_encode(["status" => "error", "message" => "Nama customer dan model kendaraan wajib diisi!"]);
        exit();
    }

    $sql = "INSERT INTO tabel_handover_delivery (sales_account_id, nama_customer, no_hp, model_unit, no_rangka, no_mesin, pdi_checklist, tanda_tangan, foto_ceremony) 
            VALUES ('$sales_account_id', '$nama_customer', '$no_hp', '$model_unit', '$no_rangka', '$no_mesin', '$pdi_checklist', '$tanda_tangan', '$foto_ceremony')";

    if ($conn->query($sql)) {
        $insert_id = $conn->insert_id;

        // Auto-Enroll Customer ke Siklus Servis Berkala (Retention Hub)
        $today = date('Y-m-d');
        $check_ret = $conn->query("SELECT id FROM tabel_customer_retention WHERE (nama_customer = '$nama_customer' OR (no_hp = '$no_hp' AND no_hp != '')) LIMIT 1");
        if ($check_ret && $check_ret->num_rows === 0) {
            $conn->query("INSERT INTO tabel_customer_retention (sales_account_id, nama_customer, no_hp, model_unit, tanggal_do, tipe_reminder, status_reminder, catatan_sales) 
                          VALUES ('$sales_account_id', '$nama_customer', '$no_hp', '$model_unit', '$today', '1000KM', 'Belum Dihubungi', 'Otomatis terdaftar dari Serah Terima Unit (Digital Delivery Ceremony).')");
        }

        // Update status di CRM tabel_customer
        $conn->query("UPDATE tabel_customer SET status = 'DO (Delivered)', updated_at = NOW() WHERE (nama = '$nama_customer' OR (no_telp = '$no_hp' AND no_telp != ''))");

        echo json_encode([
            "status" => "success",
            "message" => "Sertifikat Serah Terima & PDI berhasil diterbitkan! Customer otomatis terdaftar dalam jadwal servis berkala T-Care.",
            "id" => $insert_id
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . $conn->error]);
    }
    exit();
}
