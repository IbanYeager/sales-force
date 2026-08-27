<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM pricelist_mobil ORDER BY order_type ASC, model ASC, type ASC";
        $result = $conn->query($sql);
        $data = [];
        if ($result && $result->num_rows > 0) {
            $aggregated = [];
            while ($row = $result->fetch_assoc()) {
                $order_type = trim($row['order_type'] ?? '');
                $model = trim($row['model'] ?? '');
                $type = trim($row['type'] ?? '');
                $key = $order_type . '|' . $model . '|' . $type;

                if (!isset($aggregated[$key])) {
                    $kategori = preg_replace('/^\d+\.\s*/', '', $order_type);
                    $kategori_order = (int)$order_type;
                    if ($kategori_order == 0) $kategori_order = 99;

                    $aggregated[$key] = [
                        'id' => (int)$row['id'],
                        'kategori' => $kategori,
                        'model' => $model,
                        'tipe' => $type,
                        'harga_mt' => 0,
                        'harga_at' => 0,
                        'kategori_order' => $kategori_order
                    ];
                }

                $trans = trim($row['transmission'] ?? '');
                $price = (int)$row['pricelist'];
                
                if (strtoupper($trans) === 'M/T' || strtoupper($trans) === 'MT') {
                    $aggregated[$key]['harga_mt'] = $price;
                } else if (strtoupper($trans) === 'A/T' || strtoupper($trans) === 'AT' || strtoupper($trans) === 'CVT') {
                    $aggregated[$key]['harga_at'] = $price;
                } else {
                    $aggregated[$key]['harga_mt'] = $price;
                }
            }
            $data = array_values($aggregated);
        }
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) $data = $_POST;
        
        $kategori = $data['kategori'] ?? '';
        $model = $data['model'] ?? '';
        $tipe = $data['tipe'] ?? '';
        $harga_mt = isset($data['harga_mt']) ? (int)$data['harga_mt'] : 0;
        $harga_at = isset($data['harga_at']) ? (int)$data['harga_at'] : 0;
        $kategori_order = isset($data['kategori_order']) ? (int)$data['kategori_order'] : 99;
        $order_type = $kategori_order . ". " . $kategori;

        if (empty($model) || empty($tipe)) {
            echo json_encode(["status" => "error", "message" => "Model dan Tipe harus diisi"]);
            exit;
        }

        $success = true;
        if ($harga_mt > 0) {
            $stmt = $conn->prepare("INSERT INTO pricelist_mobil (order_type, model, type, transmission, pricelist) VALUES (?, ?, ?, 'M/T', ?)");
            $stmt->bind_param("sssi", $order_type, $model, $tipe, $harga_mt);
            if (!$stmt->execute()) $success = false;
            $stmt->close();
        }
        if ($harga_at > 0) {
            $stmt = $conn->prepare("INSERT INTO pricelist_mobil (order_type, model, type, transmission, pricelist) VALUES (?, ?, ?, 'A/T', ?)");
            $stmt->bind_param("sssi", $order_type, $model, $tipe, $harga_at);
            if (!$stmt->execute()) $success = false;
            $stmt->close();
        }

        if ($success) {
            echo json_encode(["status" => "success", "message" => "Data berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Terjadi kesalahan saat menyimpan data"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        $id = (int)$data['id'];
        
        // Find existing model & type
        $q = $conn->query("SELECT model, type FROM pricelist_mobil WHERE id = $id");
        if ($q && $q->num_rows > 0) {
            $row = $q->fetch_assoc();
            $old_model = $row['model'];
            $old_type = $row['type'];

            // Delete old rows
            $del = $conn->prepare("DELETE FROM pricelist_mobil WHERE model = ? AND type = ?");
            $del->bind_param("ss", $old_model, $old_type);
            $del->execute();
            $del->close();
        }

        $kategori = $data['kategori'] ?? '';
        $model = $data['model'] ?? '';
        $tipe = $data['tipe'] ?? '';
        $harga_mt = isset($data['harga_mt']) ? (int)$data['harga_mt'] : 0;
        $harga_at = isset($data['harga_at']) ? (int)$data['harga_at'] : 0;
        $kategori_order = isset($data['kategori_order']) ? (int)$data['kategori_order'] : 99;
        $order_type = $kategori_order . ". " . $kategori;

        $success = true;
        if ($harga_mt > 0) {
            $stmt = $conn->prepare("INSERT INTO pricelist_mobil (order_type, model, type, transmission, pricelist) VALUES (?, ?, ?, 'M/T', ?)");
            $stmt->bind_param("sssi", $order_type, $model, $tipe, $harga_mt);
            if (!$stmt->execute()) $success = false;
            $stmt->close();
        }
        if ($harga_at > 0) {
            $stmt = $conn->prepare("INSERT INTO pricelist_mobil (order_type, model, type, transmission, pricelist) VALUES (?, ?, ?, 'A/T', ?)");
            $stmt->bind_param("sssi", $order_type, $model, $tipe, $harga_at);
            if (!$stmt->execute()) $success = false;
            $stmt->close();
        }

        if ($success) {
            echo json_encode(["status" => "success", "message" => "Data berhasil diupdate"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Terjadi kesalahan update"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) $data = $_GET;
        if (!isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
            exit;
        }

        $id = (int)$data['id'];
        
        $q = $conn->query("SELECT model, type FROM pricelist_mobil WHERE id = $id");
        if ($q && $q->num_rows > 0) {
            $row = $q->fetch_assoc();
            $del_model = $row['model'];
            $del_type = $row['type'];

            $stmt = $conn->prepare("DELETE FROM pricelist_mobil WHERE model = ? AND type = ?");
            $stmt->bind_param("ss", $del_model, $del_type);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Data berhasil dihapus"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus data"]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Data tidak ditemukan"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
