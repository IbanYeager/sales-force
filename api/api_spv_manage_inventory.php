<?php
// api_spv_manage_inventory.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT * FROM tabel_inventory ORDER BY id DESC";
    $result = $conn->query($query);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $data]);
} elseif ($method === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $model = isset($_POST['model']) ? $conn->real_escape_string($_POST['model']) : '';
    $varian = isset($_POST['varian']) ? $conn->real_escape_string($_POST['varian']) : '';
    $warna = isset($_POST['warna']) ? $conn->real_escape_string($_POST['warna']) : '';
    $stok = isset($_POST['stok']) ? intval($_POST['stok']) : 0;
    $status = isset($_POST['status']) ? $conn->real_escape_string($_POST['status']) : 'Tersedia';

    if (empty($model) || empty($varian)) {
        echo json_encode(["status" => "error", "message" => "Model dan Varian wajib diisi"]);
        exit;
    }

    if ($id > 0) {
        // Update
        $query = "UPDATE tabel_inventory SET model='$model', varian='$varian', warna='$warna', stok=$stok, status='$status' WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Inventory berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
        }
    } else {
        // Insert
        $query = "INSERT INTO tabel_inventory (model, varian, warna, stok, status) VALUES ('$model', '$varian', '$warna', $stok, '$status')";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Inventory berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal insert: " . $conn->error]);
        }
    }
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data['id']) ? intval($data['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
    
    if ($id > 0) {
        $query = "DELETE FROM tabel_inventory WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Inventory berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal hapus: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode tidak didukung"]);
}
$conn->close();
?>
