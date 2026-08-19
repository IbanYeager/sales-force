<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid JSON data');
    }

    $type = $input['type'] ?? '';
    $overwrite = $input['overwrite'] ?? false;
    $data = $input['data'] ?? [];

    if (empty($data)) {
        throw new Exception('Data tidak boleh kosong');
    }

    $conn->begin_transaction();

    if ($type === 'pricelist') {
        if ($overwrite) {
            $conn->query("TRUNCATE TABLE pricelist_mobil");
        }
        
        $stmt = $conn->prepare("INSERT INTO pricelist_mobil (order_type, model, type, transmission, pricelist) VALUES (?, ?, ?, ?, ?)");
        if(!$stmt) throw new Exception("Prepare failed: " . $conn->error);
        
        $count = 0;
        foreach ($data as $row) {
            $model = trim($row['model'] ?? '');
            $tipe = trim($row['tipe'] ?? '');
            $harga_mt = floatval($row['harga_mt'] ?? 0);
            $harga_at = floatval($row['harga_at'] ?? 0);
            $kategori = trim($row['kategori'] ?? '');
            if (empty($kategori)) $kategori = 'Tanpa Kategori';
            $order_type = "99. " . $kategori;
            
            if ($harga_mt > 0) {
                $trans = 'M/T';
                $stmt->bind_param("ssssd", $order_type, $model, $tipe, $trans, $harga_mt);
                if ($stmt->execute()) {
                    $count++;
                }
            }
            if ($harga_at > 0) {
                $trans = 'A/T';
                $stmt->bind_param("ssssd", $order_type, $model, $tipe, $trans, $harga_at);
                if ($stmt->execute()) {
                    if ($harga_mt <= 0) $count++;
                }
            }
        }
        $stmt->close();
        
    } else if ($type === 'polreg') {
        if ($overwrite) {
            $conn->query("TRUNCATE TABLE tabel_polreg");
        }
        
        $stmt = $conn->prepare("INSERT INTO tabel_polreg (kecamatan, tahun, merk, type) VALUES (?, ?, ?, ?)");
        if(!$stmt) throw new Exception("Prepare failed: " . $conn->error);
        
        $count = 0;
        foreach ($data as $row) {
            $kecamatan = $row['kecamatan'];
            $tahun = $row['tahun'];
            $merk = $row['merk'];
            $tipe = $row['type'];
            
            $stmt->bind_param("ssss", $kecamatan, $tahun, $merk, $tipe);
            if ($stmt->execute()) {
                $count++;
            }
        }
    } else {
        throw new Exception('Tipe data tidak didukung');
    }

    $conn->commit();
    echo json_encode(['status' => 'success', 'count' => $count]);

} catch (Exception $e) {
    if (isset($conn) && $conn->connect_errno == 0) {
        $conn->rollback();
    }
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
