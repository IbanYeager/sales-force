<?php
// api_komisi.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require 'koneksi.php';

$sales_id = isset($_GET['sales_account_id']) ? intval($_GET['sales_account_id']) : 0;

if ($sales_id == 0) {
    echo json_encode(["status" => "error", "message" => "Sales ID diperlukan"]);
    exit;
}

// Komisi: 1% dari Nominal SPK yang telah DO
$query = "SELECT SUM(nominal) as total_nominal, COUNT(id) as total_spk FROM tabel_spk WHERE sales_account_id = ? AND status = 'DO'";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("i", $sales_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    
    $total_nominal = $row['total_nominal'] ? (float)$row['total_nominal'] : 0;
    $total_komisi = $total_nominal * 0.01; // 1%
    $total_spk = (int)$row['total_spk'];

    echo json_encode([
        "status" => "success", 
        "data" => [
            "total_komisi" => $total_komisi,
            "total_spk_disetujui" => $total_spk
        ]
    ]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Gagal mengambil data komisi"]);
}

$conn->close();
?>
