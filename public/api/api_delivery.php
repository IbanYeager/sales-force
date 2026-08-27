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
        echo json_encode([
            "status" => "success",
            "message" => "Sertifikat Serah Terima & PDI berhasil disimpan ke database!",
            "id" => $insert_id
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . $conn->error]);
    }
    exit();
}
