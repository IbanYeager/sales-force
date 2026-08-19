<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['sales_account_id']) || !isset($data['periode_bulan']) || !isset($data['periode_tahun'])) {
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    exit();
}

$sales_id = intval($data['sales_account_id']);
$bulan = intval($data['periode_bulan']);
$tahun = intval($data['periode_tahun']);

$target_spk = isset($data['target_spk']) ? intval($data['target_spk']) : -1;
$target_do = isset($data['target_do']) ? intval($data['target_do']) : -1;

$update_fields = [];
if ($target_spk >= 0) {
    $update_fields[] = "target_spk = $target_spk";
    $update_fields[] = "is_manual_target_spk = 1";
}
if ($target_do >= 0) {
    $update_fields[] = "target_do = $target_do";
    $update_fields[] = "is_manual_target_do = 1";
}

if (count($update_fields) > 0) {
    $set_str = implode(", ", $update_fields);
    // Cek apakah data sudah ada
    $cek = $conn->query("SELECT id_target_bulanan FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $bulan");
    if ($cek && $cek->num_rows > 0) {
        $row = $cek->fetch_assoc();
        $id_target = $row['id_target_bulanan'];
        $sql = "UPDATE target_do_bulanan SET $set_str, periode_tahun = $tahun WHERE id_target_bulanan = $id_target";
        if ($conn->query($sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Target berhasil diperbarui']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui target']);
        }
    } else {
        // Jika belum ada, buat baru
        $t_spk = $target_spk >= 0 ? $target_spk : 0;
        $t_do = $target_do >= 0 ? $target_do : 0;
        $m_spk = $target_spk >= 0 ? 1 : 0;
        $m_do = $target_do >= 0 ? 1 : 0;
        
        $sql = "INSERT INTO target_do_bulanan (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, is_manual_target_spk, is_manual_target_do) 
                VALUES ($sales_id, $bulan, $tahun, $t_spk, $t_do, $m_spk, $m_do)";
        if ($conn->query($sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Target berhasil dibuat']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal membuat target']);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Tidak ada data target yang diperbarui']);
}
?>
