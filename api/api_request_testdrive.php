<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $nama_sales = isset($_GET['sales']) ? $_GET['sales'] : '';
        if (empty($nama_sales)) {
            echo json_encode(["status" => "error", "message" => "Parameter sales diperlukan"]);
            exit;
        }
        $nama_sales_safe = $conn->real_escape_string($nama_sales);

        $sql = "SELECT r.*, u.model, u.type, u.warna, u.tahun 
                FROM tabel_test_drive_request r 
                LEFT JOIN tabel_test_drive_unit u ON r.id_unit = u.id
                WHERE r.nama_sales COLLATE utf8mb4_general_ci = '$nama_sales_safe' COLLATE utf8mb4_general_ci 
                ORDER BY r.created_at DESC";
        $result = $conn->query($sql);
        if (!$result) {
            echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
            exit;
        }
        
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) $data = $_POST;

        $sales_account_id = isset($data['sales_account_id']) ? intval($data['sales_account_id']) : 1;
        $nama_sales = $data['nama_sales'] ?? '';
        $nama_customer = $data['nama_customer'] ?? '';
        $id_unit = $data['id_unit'] ?? '';
        $jadwal = $data['jadwal'] ?? '';
        $rute = $data['rute'] ?? '';

        if (empty($nama_sales) || empty($nama_customer) || empty($id_unit) || empty($jadwal)) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO tabel_test_drive_request (sales_account_id, nama_sales, nama_customer, id_unit, jadwal, rute) VALUES (?, ?, ?, ?, ?, ?)");
        if(!$stmt) {
             echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
             exit;
        }
        $stmt->bind_param("isssss", $sales_account_id, $nama_sales, $nama_customer, $id_unit, $jadwal, $rute);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Pengajuan berhasil dikirim"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengirim pengajuan: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id'])) {
            echo json_encode(["status" => "error", "message" => "ID pengajuan diperlukan"]);
            exit;
        }
        
        $id = (int)$data['id'];
        
        // Pastikan hanya pengajuan yang masih 'Menunggu' yang bisa dihapus
        $check = $conn->query("SELECT status FROM tabel_test_drive_request WHERE id = $id");
        if ($check && $check->num_rows > 0) {
            $row = $check->fetch_assoc();
            if ($row['status'] !== 'Menunggu') {
                echo json_encode(["status" => "error", "message" => "Pengajuan yang sudah diproses tidak bisa dibatalkan"]);
                exit;
            }
            
            $stmt = $conn->prepare("DELETE FROM tabel_test_drive_request WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Pengajuan berhasil dibatalkan"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal membatalkan pengajuan: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Data pengajuan tidak ditemukan"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
