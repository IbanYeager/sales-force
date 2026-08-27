<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'koneksi.php';

    // Pastikan tabel sales_checkins ada
    $conn->query("CREATE TABLE IF NOT EXISTS sales_checkins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_id VARCHAR(50) NOT NULL,
        nama_sales VARCHAR(100) NOT NULL,
        nama_spv VARCHAR(100) DEFAULT '',
        jenis_kunjungan VARCHAR(100) NOT NULL,
        nama_lokasi VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        keterangan TEXT,
        foto_bukti VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Pastikan tabel sales_last_locations ada untuk tracking otomatis
    $conn->query("CREATE TABLE IF NOT EXISTS sales_last_locations (
        sales_id VARCHAR(50) PRIMARY KEY,
        nama_sales VARCHAR(100) NOT NULL,
        nama_spv VARCHAR(100) DEFAULT '',
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        status_aktif VARCHAR(50) DEFAULT 'On-Duty',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw_input = file_get_contents("php://input");
        $data = json_decode($raw_input);

        $action = $data->action ?? $_POST['action'] ?? 'checkin';

        if ($action === 'auto_ping' && ((isset($data->latitude) && isset($data->longitude)) || (isset($_POST['latitude']) && isset($_POST['longitude'])))) {
            $sales_id = $conn->real_escape_string($data->sales_id ?? $_POST['sales_id'] ?? '1');
            $nama_sales = $conn->real_escape_string($data->nama_sales ?? $_POST['nama_sales'] ?? 'Sales Consultant');
            $nama_spv = $conn->real_escape_string($data->nama_spv ?? $_POST['nama_spv'] ?? 'Supervisor');
            $latitude = floatval($data->latitude ?? $_POST['latitude']);
            $longitude = floatval($data->longitude ?? $_POST['longitude']);
            $status_aktif = $conn->real_escape_string($data->status_aktif ?? $_POST['status_aktif'] ?? 'On-Duty');

            $stmt = $conn->prepare("INSERT INTO sales_last_locations (sales_id, nama_sales, nama_spv, latitude, longitude, status_aktif) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama_sales = VALUES(nama_sales), nama_spv = VALUES(nama_spv), latitude = VALUES(latitude), longitude = VALUES(longitude), status_aktif = VALUES(status_aktif), updated_at = CURRENT_TIMESTAMP");
            $stmt->bind_param("sssdds", $sales_id, $nama_sales, $nama_spv, $latitude, $longitude, $status_aktif);

            if ($stmt->execute()) {
                echo json_encode(["ok" => true, "message" => "Auto ping lokasi berhasil diperbarui"]);
            } else {
                echo json_encode(["ok" => false, "message" => "Gagal auto ping: " . $conn->error]);
            }
            $stmt->close();
            exit();
        }

        $sales_id = $conn->real_escape_string($data->sales_id ?? $_POST['sales_id'] ?? '1');
        $nama_sales = $conn->real_escape_string($data->nama_sales ?? $_POST['nama_sales'] ?? '');
        $nama_spv = $conn->real_escape_string($data->nama_spv ?? $_POST['nama_spv'] ?? 'Supervisor');
        $jenis_kunjungan = $conn->real_escape_string($data->jenis_kunjungan ?? $_POST['jenis_kunjungan'] ?? '');
        $nama_lokasi = $conn->real_escape_string($data->nama_lokasi ?? $_POST['nama_lokasi'] ?? 'Lokasi Lapangan');
        $latitude = floatval($data->latitude ?? $_POST['latitude'] ?? 0);
        $longitude = floatval($data->longitude ?? $_POST['longitude'] ?? 0);
        $keterangan = $conn->real_escape_string($data->keterangan ?? $_POST['keterangan'] ?? '');
        $foto_bukti = $conn->real_escape_string($data->foto_bukti ?? $_POST['foto_bukti'] ?? '');

        // Handle uploaded file if present
        if (isset($_FILES['foto_bukti']) && $_FILES['foto_bukti']['error'] === 0) {
            $upload_dir = __DIR__ . '/../uploads/lokasi/';
            if (!is_dir($upload_dir)) {
                @mkdir($upload_dir, 0777, true);
            }
            $ext = strtolower(pathinfo($_FILES['foto_bukti']['name'], PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $filename = 'checkin_' . time() . '_' . rand(100, 999) . '.' . $ext;
                if (move_uploaded_file($_FILES['foto_bukti']['tmp_name'], $upload_dir . $filename)) {
                    $foto_bukti = 'uploads/lokasi/' . $filename;
                }
            }
        } elseif (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
            $upload_dir = __DIR__ . '/../uploads/lokasi/';
            if (!is_dir($upload_dir)) {
                @mkdir($upload_dir, 0777, true);
            }
            $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $filename = 'checkin_' . time() . '_' . rand(100, 999) . '.' . $ext;
                if (move_uploaded_file($_FILES['foto']['tmp_name'], $upload_dir . $filename)) {
                    $foto_bukti = 'uploads/lokasi/' . $filename;
                }
            }
        }

        if (!empty($nama_sales) && !empty($jenis_kunjungan) && $latitude != 0 && $longitude != 0) {
            $stmt = $conn->prepare("INSERT INTO sales_checkins (sales_id, nama_sales, nama_spv, jenis_kunjungan, nama_lokasi, latitude, longitude, keterangan, foto_bukti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssddss", $sales_id, $nama_sales, $nama_spv, $jenis_kunjungan, $nama_lokasi, $latitude, $longitude, $keterangan, $foto_bukti);

            if ($stmt->execute()) {
                // Update juga last location
                @$conn->query("INSERT INTO sales_last_locations (sales_id, nama_sales, nama_spv, latitude, longitude, status_aktif) VALUES ('$sales_id', '$nama_sales', '$nama_spv', $latitude, $longitude, '$jenis_kunjungan') ON DUPLICATE KEY UPDATE latitude = $latitude, longitude = $longitude, status_aktif = '$jenis_kunjungan', updated_at = CURRENT_TIMESTAMP");

                echo json_encode([
                    "ok" => true,
                    "message" => "Check-in kunjungan lapangan berhasil disimpan",
                    "id" => $conn->insert_id,
                    "foto_bukti" => $foto_bukti
                ]);
            } else {
                echo json_encode(["ok" => false, "message" => "Gagal menyimpan check-in: " . $conn->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["ok" => false, "message" => "Data check-in tidak lengkap. Pastikan nama lokasi dan koordinat GPS terdeteksi."]);
        }
    } else {
        // GET Request: Ambil data real dari tabel sales_checkins DAN sales_last_locations
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
        $type = isset($_GET['type']) ? $_GET['type'] : 'all';

        if ($type === 'last_locations') {
            $result = $conn->query("SELECT sales_id, nama_sales, nama_spv, latitude, longitude, status_aktif, updated_at FROM sales_last_locations ORDER BY updated_at DESC");
            $last_locs = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $row['latitude'] = floatval($row['latitude']);
                    $row['longitude'] = floatval($row['longitude']);
                    $last_locs[] = $row;
                }
            }
            echo json_encode(["ok" => true, "data" => $last_locs]);
            exit();
        }

        $where = [];
        if (!empty($_GET['sales_id'])) {
            $sid = $conn->real_escape_string($_GET['sales_id']);
            $where[] = "(sales_id = '$sid')";
        }
        if (!empty($_GET['nama_sales'])) {
            $ns = $conn->real_escape_string($_GET['nama_sales']);
            $where[] = "(nama_sales LIKE '%$ns%')";
        }
        $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $result = $conn->query("SELECT id, sales_id, nama_sales, nama_spv, jenis_kunjungan, nama_lokasi, latitude, longitude, keterangan, foto_bukti, created_at FROM sales_checkins $whereSql ORDER BY created_at DESC LIMIT $limit");

        $checkins = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['id'] = intval($row['id']);
                $row['latitude'] = floatval($row['latitude']);
                $row['longitude'] = floatval($row['longitude']);
                $checkins[] = $row;
            }
        }

        echo json_encode([
            "ok" => true,
            "data" => $checkins
        ]);
    }
} catch (Throwable $e) {
    echo json_encode(["ok" => false, "message" => "Terjadi kesalahan server: " . $e->getMessage()]);
}

if (isset($conn) && $conn) {
    $conn->close();
}
?>
