<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM tabel_test_drive_unit ORDER BY model ASC";
        $result = $conn->query($sql);
        $data = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['model']) || !isset($data['type'])) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }
        $model = $data['model'];
        $type = $data['type'];
        $warna = $data['warna'] ?? '-';
        $tahun = $data['tahun'] ?? '2024';
        $ketersediaan = $data['ketersediaan'] ?? 'tersedia';

        $id = uniqid('td_');
        $stmt = $conn->prepare("INSERT INTO tabel_test_drive_unit (id, model, type, warna, tahun, ketersediaan) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $id, $model, $type, $warna, $tahun, $ketersediaan);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Unit berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal tambah data: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "ID diperlukan"]);
            exit;
        }

        $id = $data['id'];
        if (isset($data['action']) && $data['action'] === 'update_full') {
            // Update all fields
            $model = $data['model'];
            $type = $data['type'];
            $warna = $data['warna'];
            $tahun = $data['tahun'];
            $ketersediaan = $data['ketersediaan'];
            $stmt = $conn->prepare("UPDATE tabel_test_drive_unit SET model=?, type=?, warna=?, tahun=?, ketersediaan=? WHERE id=?");
            $stmt->bind_param("ssssss", $model, $type, $warna, $tahun, $ketersediaan, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Data unit berhasil diupdate"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal update data: " . $stmt->error]);
            }
            $stmt->close();
        } else if (isset($data['ketersediaan'])) {
            // Update ketersediaan only
            $ketersediaan = $data['ketersediaan'];
            $stmt = $conn->prepare("UPDATE tabel_test_drive_unit SET ketersediaan=? WHERE id=?");
            $stmt->bind_param("ss", $ketersediaan, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Status unit berhasil diupdate"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal update status: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Aksi tidak dikenal"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
            exit;
        }
        $id = $data['id'];
        $stmt = $conn->prepare("DELETE FROM tabel_test_drive_unit WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Data berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal hapus data: " . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
