<?php
require_once 'koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-create & Migrate table if not exists
if ($conn instanceof mysqli) {
    $createTableQuery = "CREATE TABLE IF NOT EXISTS tabel_customer_retention (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_account_id INT DEFAULT 1,
        nama_customer VARCHAR(150) NOT NULL,
        no_hp VARCHAR(50) NOT NULL,
        model_unit VARCHAR(150) NOT NULL,
        no_polisi VARCHAR(30) DEFAULT '',
        warna_unit VARCHAR(50) DEFAULT '',
        tanggal_do DATE NOT NULL,
        tanggal_lahir DATE NULL,
        tipe_asuransi VARCHAR(100) DEFAULT 'All Risk Garda Oto / Toyota Insurance',
        leasing_partner VARCHAR(100) DEFAULT 'TAF / Toyota Astra Finance',
        tipe_reminder VARCHAR(100) DEFAULT '1000KM',
        status_reminder VARCHAR(50) DEFAULT 'Belum Dihubungi',
        terakhir_dihubungi DATETIME NULL,
        booking_service_date DATETIME NULL,
        booking_service_type VARCHAR(100) DEFAULT '',
        catatan_sales TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    @$conn->query($createTableQuery);

    // Optional columns migration check
    $colsToCheck = [
        'no_polisi' => "VARCHAR(30) DEFAULT ''",
        'warna_unit' => "VARCHAR(50) DEFAULT ''",
        'tanggal_lahir' => "DATE NULL",
        'tipe_asuransi' => "VARCHAR(100) DEFAULT 'All Risk Garda Oto'",
        'leasing_partner' => "VARCHAR(100) DEFAULT 'TAF'",
        'booking_service_date' => "DATETIME NULL",
        'booking_service_type' => "VARCHAR(100) DEFAULT ''",
        'catatan_sales' => "TEXT"
    ];
    foreach ($colsToCheck as $col => $type) {
        $checkCol = @$conn->query("SHOW COLUMNS FROM tabel_customer_retention LIKE '$col'");
        if ($checkCol && $checkCol->num_rows === 0) {
            @$conn->query("ALTER TABLE tabel_customer_retention ADD COLUMN $col $type");
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $raw_sales = $_GET['sales_id'] ?? $_GET['sales_account_id'] ?? 0;
    $sales_id = 0;
    if (is_numeric($raw_sales)) {
        $sales_id = intval($raw_sales);
    } else if (!empty($raw_sales)) {
        $u_esc = $conn->real_escape_string($raw_sales);
        $q_find = $conn->query("SELECT id FROM sales_accounts WHERE username = '$u_esc' OR nama_lengkap LIKE '%$u_esc%' LIMIT 1");
        if ($q_find && $q_find->num_rows > 0) {
            $r = $q_find->fetch_assoc();
            $sales_id = intval($r['id']);
        }
    }
    $search = trim($_GET['search'] ?? '');
    $status = trim($_GET['status'] ?? '');

    $whereClauses = [];
    if ($sales_id > 0) {
        $whereClauses[] = "sales_account_id = $sales_id";
    }
    if (!empty($search)) {
        $s = $conn->real_escape_string($search);
        $whereClauses[] = "(nama_customer LIKE '%$s%' OR no_hp LIKE '%$s%' OR model_unit LIKE '%$s%' OR no_polisi LIKE '%$s%')";
    }
    if (!empty($status)) {
        $st = $conn->real_escape_string($status);
        $whereClauses[] = "status_reminder = '$st'";
    }

    $whereSQL = count($whereClauses) > 0 ? "WHERE " . implode(" AND ", $whereClauses) : "";
    $query = "SELECT * FROM tabel_customer_retention $whereSQL ORDER BY tanggal_do DESC LIMIT 200";

    $result = $conn ? $conn->query($query) : null;
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Hitung KPI / Summary Metrics
    $kpi = [
        "total_customers" => count($data),
        "due_soon" => 0,
        "stnk_asuransi" => 0,
        "tradein_opportunity" => 0,
        "service_scheduled" => 0
    ];

    $today = new DateTime();
    foreach ($data as $item) {
        $doDate = !empty($item['tanggal_do']) ? new DateTime($item['tanggal_do']) : null;
        if ($doDate) {
            $diffDays = $today->diff($doDate)->days;
            $isPast = $doDate <= $today;

            // 1 bulan (30 hari) atau 6 bulan (180 hari)
            if ($isPast && ($diffDays <= 45 || ($diffDays >= 160 && $diffDays <= 200))) {
                $kpi['due_soon']++;
            }
            // 1 tahun (365 hari) / asuransi
            if ($isPast && ($diffDays >= 330 && $diffDays <= 380)) {
                $kpi['stnk_asuransi']++;
            }
            // > 2.5 tahun (900 hari)
            if ($isPast && $diffDays >= 900) {
                $kpi['tradein_opportunity']++;
            }
        }
        if (!empty($item['booking_service_date'])) {
            $kpi['service_scheduled']++;
        }
    }

    echo json_encode([
        "status" => "success",
        "data" => $data,
        "kpi" => $kpi
    ]);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    $action = $data['action'] ?? 'update_status';

    if ($action === 'update_status') {
        $id = intval($data['id'] ?? 0);
        $status = $conn->real_escape_string($data['status'] ?? 'Dihubungi');
        $catatan = isset($data['catatan_sales']) ? $conn->real_escape_string($data['catatan_sales']) : null;
        $now = date('Y-m-d H:i:s');

        if ($id > 0) {
            $catatanSQL = $catatan !== null ? ", catatan_sales = '$catatan'" : "";
            $conn->query("UPDATE tabel_customer_retention SET status_reminder = '$status', terakhir_dihubungi = '$now' $catatanSQL WHERE id = $id");
            echo json_encode(["status" => "success", "message" => "Status pengingat berhasil diperbarui!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
        }
        exit();
    }

    if ($action === 'book_service') {
        $id = intval($data['id'] ?? 0);
        $bookingDate = $conn->real_escape_string($data['booking_service_date'] ?? date('Y-m-d H:i:s'));
        $bookingType = $conn->real_escape_string($data['booking_service_type'] ?? 'Servis Berkala T-Care');
        $catatan = $conn->real_escape_string($data['catatan_sales'] ?? 'Booking service bengkel resmi Tunas Toyota Kiara Condong');

        if ($id > 0) {
            $conn->query("UPDATE tabel_customer_retention SET 
                booking_service_date = '$bookingDate', 
                booking_service_type = '$bookingType',
                catatan_sales = '$catatan',
                status_reminder = 'Terjadwal Servis' 
                WHERE id = $id");
            echo json_encode(["status" => "success", "message" => "Jadwal booking servis resmi berhasil dicatat!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "ID customer tidak valid"]);
        }
        exit();
    }

    if ($action === 'create') {
        $sales_account_id = intval($data['sales_account_id'] ?? 1);
        $nama_customer = $conn->real_escape_string(trim($data['nama_customer'] ?? ''));
        $no_hp = $conn->real_escape_string(trim($data['no_hp'] ?? ''));
        $model_unit = $conn->real_escape_string(trim($data['model_unit'] ?? ''));
        $no_polisi = $conn->real_escape_string(trim($data['no_polisi'] ?? ''));
        $warna_unit = $conn->real_escape_string(trim($data['warna_unit'] ?? ''));
        $tanggal_do = $conn->real_escape_string(trim($data['tanggal_do'] ?? date('Y-m-d')));
        $tanggal_lahir = !empty($data['tanggal_lahir']) ? "'" . $conn->real_escape_string(trim($data['tanggal_lahir'])) . "'" : "NULL";
        $tipe_asuransi = $conn->real_escape_string($data['tipe_asuransi'] ?? 'All Risk Garda Oto');
        $leasing_partner = $conn->real_escape_string($data['leasing_partner'] ?? 'TAF / Toyota Astra Finance');
        $tipe_reminder = $conn->real_escape_string($data['tipe_reminder'] ?? '1000KM');
        $catatan_sales = $conn->real_escape_string($data['catatan_sales'] ?? '');

        if (empty($nama_customer) || empty($no_hp) || empty($model_unit)) {
            echo json_encode(["status" => "error", "message" => "Nama, No HP, dan Model Kendaraan wajib diisi!"]);
            exit();
        }

        $sql = "INSERT INTO tabel_customer_retention 
                (sales_account_id, nama_customer, no_hp, model_unit, no_polisi, warna_unit, tanggal_do, tanggal_lahir, tipe_asuransi, leasing_partner, tipe_reminder, catatan_sales) 
                VALUES 
                ('$sales_account_id', '$nama_customer', '$no_hp', '$model_unit', '$no_polisi', '$warna_unit', '$tanggal_do', $tanggal_lahir, '$tipe_asuransi', '$leasing_partner', '$tipe_reminder', '$catatan_sales')";

        if ($conn->query($sql)) {
            echo json_encode([
                "status" => "success", 
                "message" => "Data retention konsumen berhasil ditambahkan!",
                "id" => $conn->insert_id
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan: " . $conn->error]);
        }
        exit();
    }

    if ($action === 'sync_from_do') {
        $sales_account_id = intval($data['sales_account_id'] ?? 1);
        $importedCount = 0;

        // Ambil dari tabel_handover_delivery
        $checkDelivery = @$conn->query("SELECT nama_customer, no_hp, model_unit, created_at FROM tabel_handover_delivery WHERE sales_account_id = $sales_account_id");
        if ($checkDelivery && $checkDelivery->num_rows > 0) {
            while ($del = $checkDelivery->fetch_assoc()) {
                $cName = $conn->real_escape_string($del['nama_customer']);
                $cHp = $conn->real_escape_string($del['no_hp']);
                $cModel = $conn->real_escape_string($del['model_unit']);
                $cDo = date('Y-m-d', strtotime($del['created_at']));

                // Cek apakah sudah ada
                $checkExist = $conn->query("SELECT id FROM tabel_customer_retention WHERE nama_customer = '$cName' AND no_hp = '$cHp' LIMIT 1");
                if ($checkExist && $checkExist->num_rows === 0) {
                    $conn->query("INSERT INTO tabel_customer_retention (sales_account_id, nama_customer, no_hp, model_unit, tanggal_do, tipe_reminder) VALUES ('$sales_account_id', '$cName', '$cHp', '$cModel', '$cDo', '1000KM')");
                    $importedCount++;
                }
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Sinkronisasi berhasil! $importedCount data konsumen baru ditambahkan dari Delivery Order.",
            "imported_count" => $importedCount
        ]);
        exit();
    }

    if ($action === 'delete') {
        $id = intval($data['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM tabel_customer_retention WHERE id = $id");
            echo json_encode(["status" => "success", "message" => "Data retention berhasil dihapus!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
        }
        exit();
    }
}
