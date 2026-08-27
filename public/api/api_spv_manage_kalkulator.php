<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'get_leasing') {
            $data = [];
            $res = $conn->query("SELECT * FROM tabel_leasing ORDER BY nama_leasing ASC");
            if($res) { while($row = $res->fetch_assoc()) $data[] = $row; }
            echo json_encode(['status' => 'success', 'data' => $data]);
            exit;
        }
        if ($action === 'get_provinsi') {
            $data = [];
            $res = $conn->query("SELECT * FROM tabel_bunga_provinsi ORDER BY nama_provinsi ASC");
            if($res) { while($row = $res->fetch_assoc()) $data[] = $row; }
            echo json_encode(['status' => 'success', 'data' => $data]);
            exit;
        }
    }
    
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';

        if ($action === 'save_leasing') {
            $id = intval($input['id'] ?? 0);
            $nama_leasing = trim($input['nama_leasing'] ?? '');
            $status = $input['status'] ?? 'Aktif';

            if (empty($nama_leasing)) throw new Exception('Nama Leasing wajib diisi');

            if ($id > 0) {
                $stmt = $conn->prepare("UPDATE tabel_leasing SET nama_leasing = ?, status = ? WHERE id = ?");
                $stmt->bind_param("ssi", $nama_leasing, $status, $id);
                $stmt->execute();
            } else {
                $stmt = $conn->prepare("INSERT INTO tabel_leasing (nama_leasing, status) VALUES (?, ?)");
                $stmt->bind_param("ss", $nama_leasing, $status);
                $stmt->execute();
            }
            echo json_encode(['status' => 'success', 'message' => 'Data leasing disimpan']);
            exit;
        }

        if ($action === 'delete_leasing') {
            $id = intval($input['id'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM tabel_leasing WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($action === 'save_provinsi') {
            $id = intval($input['id'] ?? 0);
            $nama_provinsi = trim($input['nama_provinsi'] ?? '');
            $suku_bunga = floatval($input['suku_bunga'] ?? 0);
            $status = $input['status'] ?? 'Aktif';

            if (empty($nama_provinsi)) throw new Exception('Nama Provinsi wajib diisi');

            if ($id > 0) {
                $stmt = $conn->prepare("UPDATE tabel_bunga_provinsi SET nama_provinsi = ?, suku_bunga = ?, status = ? WHERE id = ?");
                $stmt->bind_param("sdsi", $nama_provinsi, $suku_bunga, $status, $id);
                $stmt->execute();
            } else {
                $stmt = $conn->prepare("INSERT INTO tabel_bunga_provinsi (nama_provinsi, suku_bunga, status) VALUES (?, ?, ?)");
                $stmt->bind_param("sds", $nama_provinsi, $suku_bunga, $status);
                $stmt->execute();
            }
            echo json_encode(['status' => 'success', 'message' => 'Data provinsi disimpan']);
            exit;
        }

        if ($action === 'delete_provinsi') {
            $id = intval($input['id'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM tabel_bunga_provinsi WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['status' => 'success']);
            exit;
        }
    }
    
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
