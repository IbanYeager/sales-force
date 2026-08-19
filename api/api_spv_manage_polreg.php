<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT id, kecamatan, tahun, merk, type FROM tabel_polreg ORDER BY tahun DESC, kecamatan ASC, merk ASC LIMIT 1000";
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
        if (!$data) {
            $data = $_POST;
        }
        
        $kecamatan = $data['kecamatan'] ?? '';
        $tahun = $data['tahun'] ?? '';
        $merk = $data['merk'] ?? '';
        $type = $data['type'] ?? '';
        $jumlah = isset($data['jumlah']) ? (int)$data['jumlah'] : 1;

        if (empty($kecamatan) || empty($merk) || empty($type) || empty($tahun)) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        // Insert multiple rows based on jumlah (since the existing system uses COUNT(*))
        $conn->begin_transaction();
        try {
            $stmt = $conn->prepare("INSERT INTO tabel_polreg (kecamatan, tahun, merk, type) VALUES (?, ?, ?, ?)");
            for ($i = 0; $i < $jumlah; $i++) {
                $stmt->bind_param("ssss", $kecamatan, $tahun, $merk, $type);
                $stmt->execute();
            }
            $conn->commit();
            echo json_encode(["status" => "success", "message" => "$jumlah Data berhasil ditambahkan"]);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["status" => "error", "message" => "Gagal menambahkan data: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        $id = (int)$data['id'];
        $kecamatan = $data['kecamatan'] ?? '';
        $tahun = $data['tahun'] ?? '';
        $merk = $data['merk'] ?? '';
        $type = $data['type'] ?? '';

        $stmt = $conn->prepare("UPDATE tabel_polreg SET kecamatan=?, tahun=?, merk=?, type=? WHERE id=?");
        $stmt->bind_param("ssssi", $kecamatan, $tahun, $merk, $type, $id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Data berhasil diupdate"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update data: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            $data = $_GET;
        }
        if (!isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
            exit;
        }

        $id = (int)$data['id'];
        $stmt = $conn->prepare("DELETE FROM tabel_polreg WHERE id=?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Data berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus data"]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
