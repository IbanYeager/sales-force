<?php
// api_customer.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;
    
    if (!isset($data['nama']) || !isset($data['alamat']) || !isset($data['sales_account_id'])) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
        exit;
    }
    
    $nama = $data['nama'];
    $alamat = $data['alamat'];
    $no_telp = isset($data['no_telp']) ? $data['no_telp'] : NULL;
    $sales_account_id = intval($data['sales_account_id']);
    $status = 'Follow Up';
    
    $stmt = $conn->prepare("INSERT INTO tabel_customer (sales_account_id, nama, alamat, no_telp, status) VALUES (?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("issss", $sales_account_id, $nama, $alamat, $no_telp, $status);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Customer berhasil ditambahkan", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menambahkan customer"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Database error"]);
    }
    $conn->close();
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['status'])) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
        exit;
    }
    
    $id = intval($data['id']);
    $status = $data['status'];
    
    $stmt = $conn->prepare("UPDATE tabel_customer SET status = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("si", $status, $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Status pelanggan berhasil diubah"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengubah status"]);
        }
        $stmt->close();
    }
    $conn->close();
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
        exit;
    }
    
    $id = intval($data['id']);
    $stmt = $conn->prepare("DELETE FROM tabel_customer WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Customer berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus customer"]);
        }
        $stmt->close();
    }
    $conn->close();
    exit;
}

$raw_sales = isset($_GET['sales_account_id']) ? trim($_GET['sales_account_id']) : 10;
$sales_id = 10;
if (is_numeric($raw_sales)) {
    $sales_id = intval($raw_sales);
} else {
    $u_esc = $conn->real_escape_string($raw_sales);
    $q_find = $conn->query("SELECT id FROM sales_accounts WHERE username = '$u_esc' OR nama_lengkap LIKE '%$u_esc%' LIMIT 1");
    if ($q_find && $q_find->num_rows > 0) {
        $r = $q_find->fetch_assoc();
        $sales_id = intval($r['id']);
    }
}
$search = isset($_GET['search']) ? $_GET['search'] : '';

$query = "SELECT id, nama, alamat, no_telp, status FROM tabel_customer WHERE sales_account_id = ?";
if (!empty($search)) {
    $query .= " AND (nama LIKE ? OR alamat LIKE ?)";
}
$query .= " ORDER BY nama ASC";

$stmt = $conn->prepare($query);
if ($stmt) {
    if (!empty($search)) {
        $search_param = "%" . $search . "%";
        $stmt->bind_param("iss", $sales_id, $search_param, $search_param);
    } else {
        $stmt->bind_param("i", $sales_id);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
}

$conn->close();
?>
