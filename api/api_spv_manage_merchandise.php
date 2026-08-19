<?php
// api_spv_manage_merchandise.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT * FROM merchandise_parts ORDER BY id DESC";
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
    $name = isset($_POST['name']) ? $conn->real_escape_string($_POST['name']) : '';
    $size = isset($_POST['size']) ? $conn->real_escape_string($_POST['size']) : '';
    $part_number = isset($_POST['part_number']) ? $conn->real_escape_string($_POST['part_number']) : '';
    $wpbt = isset($_POST['wpbt']) ? $conn->real_escape_string($_POST['wpbt']) : '';
    $retail_price = isset($_POST['retail_price']) ? intval($_POST['retail_price']) : 0;
    $stock_cabang = isset($_POST['stock_cabang']) ? intval($_POST['stock_cabang']) : 0;
    $stock_tam = isset($_POST['stock_tam']) ? intval($_POST['stock_tam']) : 0;
    $ket_indent = isset($_POST['ket_indent']) ? $conn->real_escape_string($_POST['ket_indent']) : '';
    $image = isset($_POST['image_existing']) ? $conn->real_escape_string($_POST['image_existing']) : '';

    if (empty($name) || empty($part_number)) {
        echo json_encode(["status" => "error", "message" => "Nama dan Part Number wajib diisi"]);
        exit;
    }

    // Handle File Upload
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $filename = time() . '_' . basename($_FILES['image_file']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetFile)) {
            $image = 'uploads/' . $filename;
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengupload file gambar"]);
            exit;
        }
    }

    if ($id > 0) {
        // Update
        $query = "UPDATE merchandise_parts SET 
                    name='$name', size='$size', part_number='$part_number', wpbt='$wpbt', 
                    retail_price=$retail_price, stock_cabang=$stock_cabang, stock_tam=$stock_tam, 
                    ket_indent='$ket_indent', image='$image' 
                  WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Merchandise berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
        }
    } else {
        // Insert
        $query = "INSERT INTO merchandise_parts (name, size, part_number, wpbt, retail_price, stock_cabang, stock_tam, ket_indent, image) 
                  VALUES ('$name', '$size', '$part_number', '$wpbt', $retail_price, $stock_cabang, $stock_tam, '$ket_indent', '$image')";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Merchandise berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal insert: " . $conn->error]);
        }
    }
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data['id']) ? intval($data['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
    
    if ($id > 0) {
        $query = "DELETE FROM merchandise_parts WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Merchandise berhasil dihapus"]);
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
