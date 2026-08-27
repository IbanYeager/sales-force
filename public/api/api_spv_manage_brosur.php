<?php
// api_spv_manage_brosur.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT * FROM tabel_brosur ORDER BY id DESC";
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
    $nama = isset($_POST['nama']) ? $conn->real_escape_string($_POST['nama']) : '';
    $deskripsi = isset($_POST['deskripsi']) ? $conn->real_escape_string($_POST['deskripsi']) : '';
    $pdf_url = isset($_POST['pdf_existing']) ? $conn->real_escape_string($_POST['pdf_existing']) : '';

    if (empty($nama) || empty($deskripsi)) {
        echo json_encode(["status" => "error", "message" => "Nama dan Deskripsi wajib diisi"]);
        exit;
    }

    // Handle File Upload
    if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $filename = time() . '_' . basename($_FILES['pdf_file']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['pdf_file']['tmp_name'], $targetFile)) {
            $pdf_url = '../uploads/' . $filename;
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengupload file PDF"]);
            exit;
        }
    }

    if ($id > 0) {
        // Update
        $query = "UPDATE tabel_brosur SET nama='$nama', deskripsi='$deskripsi', pdf_url='$pdf_url' WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Brosur berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
        }
    } else {
        // Insert
        $query = "INSERT INTO tabel_brosur (nama, deskripsi, pdf_url) VALUES ('$nama', '$deskripsi', '$pdf_url')";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Brosur berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal insert: " . $conn->error]);
        }
    }
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data['id']) ? intval($data['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
    
    if ($id > 0) {
        $query = "DELETE FROM tabel_brosur WHERE id=$id";
        if ($conn->query($query)) {
            echo json_encode(["status" => "success", "message" => "Brosur berhasil dihapus"]);
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
