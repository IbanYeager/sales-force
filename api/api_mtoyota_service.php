<?php
// api_mtoyota_service.php
// API Manajemen Booking Service m-Toyota & Progress DO-DEC-FS Tracker

error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Koneksi database gagal."]);
    exit();
}

// Pastikan tabel ada
$conn->query("CREATE TABLE IF NOT EXISTS tabel_booking_mtoyota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sales_account_id INT NOT NULL,
    sales_name VARCHAR(100) DEFAULT '',
    sales_spv VARCHAR(100) DEFAULT '',
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150) DEFAULT '',
    model_kendaraan VARCHAR(100) NOT NULL,
    no_polisi VARCHAR(20) DEFAULT '',
    no_rangka VARCHAR(50) DEFAULT '',
    tanggal_do DATE DEFAULT NULL,
    status_do VARCHAR(20) DEFAULT 'completed',
    tanggal_selesai_do DATE DEFAULT NULL,
    foto_do TEXT DEFAULT '',
    catatan_do TEXT DEFAULT '',
    status_dec VARCHAR(20) DEFAULT 'pending',
    tanggal_selesai_dec DATE DEFAULT NULL,
    foto_dec TEXT DEFAULT '',
    catatan_dec TEXT DEFAULT '',
    status_fs1000 VARCHAR(20) DEFAULT 'pending',
    tanggal_booking_fs1000 DATE DEFAULT NULL,
    tanggal_selesai_fs1000 DATE DEFAULT NULL,
    foto_fs1000 TEXT DEFAULT '',
    catatan_fs1000 TEXT DEFAULT '',
    status_sb10k VARCHAR(20) DEFAULT 'pending',
    tanggal_booking_sb10k DATE DEFAULT NULL,
    tanggal_selesai_sb10k DATE DEFAULT NULL,
    foto_sb10k TEXT DEFAULT '',
    catatan_sb10k TEXT DEFAULT '',
    status_sb20k VARCHAR(20) DEFAULT 'pending',
    tanggal_booking_sb20k DATE DEFAULT NULL,
    tanggal_selesai_sb20k DATE DEFAULT NULL,
    foto_sb20k TEXT DEFAULT '',
    catatan_sb20k TEXT DEFAULT '',
    overall_progress INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sales (sales_account_id),
    INDEX idx_spv (sales_spv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");

$projectRoot = dirname(__DIR__);
if (file_exists(dirname(dirname(__DIR__)) . '/artisan')) {
    $projectRoot = dirname(dirname(__DIR__));
}

$upload_dir = $projectRoot . '/uploads/mtoyota/';
$public_upload_dir = $projectRoot . '/public/uploads/mtoyota/';
if (!is_dir($upload_dir)) @mkdir($upload_dir, 0777, true);
if (!is_dir($public_upload_dir)) @mkdir($public_upload_dir, 0777, true);

// Helper hitung persentase progress keseluruhan
function calculateOverallProgress($row) {
    $points = 0;
    if (($row['status_do'] ?? '') === 'completed') $points += 20;
    if (($row['status_dec'] ?? '') === 'completed') $points += 20;
    if (($row['status_fs1000'] ?? '') === 'completed') $points += 20;
    elseif (($row['status_fs1000'] ?? '') === 'booked') $points += 10;
    if (($row['status_sb10k'] ?? '') === 'completed') $points += 20;
    elseif (($row['status_sb10k'] ?? '') === 'booked') $points += 10;
    if (($row['status_sb20k'] ?? '') === 'completed') $points += 20;
    elseif (($row['status_sb20k'] ?? '') === 'booked') $points += 10;
    return min(100, $points);
}

function handleFileUpload($fileInputName, $prefix = 'mtoyota') {
    global $upload_dir, $public_upload_dir;
    if (!isset($_FILES[$fileInputName]) || $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    $ext = strtolower(pathinfo($_FILES[$fileInputName]['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'pdf'];
    if (!in_array($ext, $allowed)) {
        return null;
    }
    $filename = time() . '_' . $prefix . '_' . uniqid() . '.' . $ext;
    $targetPath = $upload_dir . $filename;
    if (@move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $targetPath)) {
        if (is_dir($public_upload_dir)) {
            @copy($targetPath, $public_upload_dir . $filename);
        }
        return '/uploads/mtoyota/' . $filename;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ================= ROUTE GET =================
if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list';

    // 1. STATS / RINGKASAN
    if ($action === 'stats') {
        $sales_id = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
        $spv = isset($_GET['spv']) ? $conn->real_escape_string(trim($_GET['spv'])) : '';

        $where = "WHERE 1=1";
        if ($sales_id > 0) {
            $where .= " AND sales_account_id = $sales_id";
        } elseif (!empty($spv) && $spv !== 'Semua' && $spv !== 'all') {
            $where .= " AND sales_spv = '$spv'";
        }

        $res = $conn->query("SELECT 
            COUNT(*) as total_unit,
            SUM(CASE WHEN status_do = 'completed' THEN 1 ELSE 0 END) as total_do_selesai,
            SUM(CASE WHEN status_dec = 'completed' THEN 1 ELSE 0 END) as total_dec_selesai,
            SUM(CASE WHEN status_fs1000 = 'completed' THEN 1 ELSE 0 END) as total_fs1000_selesai,
            SUM(CASE WHEN status_fs1000 = 'booked' THEN 1 ELSE 0 END) as total_fs1000_booked,
            SUM(CASE WHEN status_sb10k = 'completed' OR status_sb20k = 'completed' THEN 1 ELSE 0 END) as total_sb_selesai,
            SUM(CASE WHEN overall_progress >= 100 THEN 1 ELSE 0 END) as total_full_completed,
            AVG(overall_progress) as avg_progress
            FROM tabel_booking_mtoyota $where");
        
        $stats = $res ? $res->fetch_assoc() : [];
        echo json_encode([
            "status" => "success",
            "stats" => [
                "total_unit" => intval($stats['total_unit'] ?? 0),
                "total_do_selesai" => intval($stats['total_do_selesai'] ?? 0),
                "total_dec_selesai" => intval($stats['total_dec_selesai'] ?? 0),
                "total_fs1000_selesai" => intval($stats['total_fs1000_selesai'] ?? 0),
                "total_fs1000_booked" => intval($stats['total_fs1000_booked'] ?? 0),
                "total_sb_selesai" => intval($stats['total_sb_selesai'] ?? 0),
                "total_full_completed" => intval($stats['total_full_completed'] ?? 0),
                "avg_progress" => round(floatval($stats['avg_progress'] ?? 0), 1)
            ]
        ]);
        exit();
    }

    // 2. FILTER OPTIONS (SPV LIST & SALES LIST)
    if ($action === 'filters') {
        $spv_list = [];
        $sales_list = [];

        $q_spv = $conn->query("SELECT DISTINCT nama_spv FROM sales_accounts WHERE nama_spv != '' AND nama_spv IS NOT NULL ORDER BY nama_spv ASC");
        if ($q_spv) {
            while ($r = $q_spv->fetch_assoc()) {
                $spv_list[] = $r['nama_spv'];
            }
        }
        if (empty($spv_list)) {
            $spv_list = ['Ryan', 'Alvin', 'Riva', 'Rahma'];
        }

        $spv_param = isset($_GET['spv']) ? $conn->real_escape_string(trim($_GET['spv'])) : '';
        $where_sales = "WHERE 1=1";
        if (!empty($spv_param) && $spv_param !== 'Semua' && $spv_param !== 'all') {
            $where_sales .= " AND (nama_spv = '$spv_param' OR nama_spv LIKE '%$spv_param%')";
        }
        $q_sales = $conn->query("SELECT id, nama_lengkap, nama_spv FROM sales_accounts $where_sales ORDER BY nama_lengkap ASC");
        if ($q_sales) {
            while ($r = $q_sales->fetch_assoc()) {
                $sales_list[] = [
                    'id' => intval($r['id']),
                    'name' => $r['nama_lengkap'],
                    'spv' => $r['nama_spv']
                ];
            }
        }

        echo json_encode([
            "status" => "success",
            "spv_list" => $spv_list,
            "sales_list" => $sales_list
        ]);
        exit();
    }

    // 3. AUTOCOMPLETE CUSTOMER SPK / DO
    if ($action === 'customers') {
        $sales_id = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
        $q = isset($_GET['q']) ? $conn->real_escape_string(trim($_GET['q'])) : '';

        $list = [];
        $where = "WHERE 1=1";
        if ($sales_id > 0) {
            $where .= " AND sales_account_id = $sales_id";
        }
        if (!empty($q)) {
            $where .= " AND (nama_customer LIKE '%$q%' OR no_hp LIKE '%$q%' OR model_unit LIKE '%$q%')";
        }

        // Cari dari tabel_spk dan tabel_customer jika ada
        $check_spk = $conn->query("SHOW TABLES LIKE 'tabel_spk'");
        if ($check_spk && $check_spk->num_rows > 0) {
            $res = $conn->query("SELECT id, nama_customer, no_hp, model_unit, no_rangka, no_polisi, tanggal_spk 
                                 FROM tabel_spk $where ORDER BY id DESC LIMIT 20");
            if ($res) {
                while ($r = $res->fetch_assoc()) {
                    $list[] = [
                        'id' => $r['id'],
                        'name' => $r['nama_customer'],
                        'phone' => $r['no_hp'],
                        'model' => $r['model_unit'] ?: 'Toyota',
                        'chassis' => $r['no_rangka'] ?: '',
                        'plate' => $r['no_polisi'] ?: ''
                    ];
                }
            }
        }
        echo json_encode(["status" => "success", "data" => $list]);
        exit();
    }

    // 3. DETAIL DATA BOOKING
    if ($action === 'detail') {
        $id = intval($_GET['id'] ?? 0);
        $res = $conn->query("SELECT * FROM tabel_booking_mtoyota WHERE id = $id LIMIT 1");
        if ($res && $res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $row['overall_progress'] = calculateOverallProgress($row);
            echo json_encode(["status" => "success", "data" => $row]);
        } else {
            echo json_encode(["status" => "error", "message" => "Data booking tidak ditemukan."]);
        }
        exit();
    }

    // 4. LIST DAFTAR BOOKING SERVICE
    $sales_id = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
    $spv = isset($_GET['spv']) ? $conn->real_escape_string(trim($_GET['spv'])) : '';
    $stage = isset($_GET['stage']) ? trim($_GET['stage']) : '';
    $search = isset($_GET['q']) ? $conn->real_escape_string(trim($_GET['q'])) : '';

    $where = "WHERE 1=1";
    if ($sales_id > 0) {
        $where .= " AND sales_account_id = $sales_id";
    } elseif (!empty($spv) && $spv !== 'Semua' && $spv !== 'all') {
        $where .= " AND sales_spv = '$spv'";
    }

    if (!empty($search)) {
        $where .= " AND (customer_name LIKE '%$search%' OR customer_phone LIKE '%$search%' OR model_kendaraan LIKE '%$search%' OR no_polisi LIKE '%$search%' OR no_rangka LIKE '%$search%' OR sales_name LIKE '%$search%')";
    }

    if ($stage === 'pending_dec') {
        $where .= " AND status_dec != 'completed'";
    } elseif ($stage === 'pending_fs1000') {
        $where .= " AND status_fs1000 != 'completed'";
    } elseif ($stage === 'booked_fs1000') {
        $where .= " AND status_fs1000 = 'booked'";
    } elseif ($stage === 'completed') {
        $where .= " AND overall_progress >= 100";
    }

    $res = $conn->query("SELECT * FROM tabel_booking_mtoyota $where ORDER BY id DESC");
    $data = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $row['overall_progress'] = calculateOverallProgress($row);
            $data[] = $row;
        }
    }

    echo json_encode([
        "status" => "success",
        "total" => count($data),
        "data" => $data
    ]);
    exit();
}

// ================= ROUTE POST =================
if ($method === 'POST') {
    // Tangani baik multipart/form-data maupun JSON raw
    $rawInput = !empty($GLOBALS['RAW_INPUT_CONTENT']) ? $GLOBALS['RAW_INPUT_CONTENT'] : file_get_contents("php://input");
    $json = json_decode($rawInput, true);

    $action = $_POST['action'] ?? ($json['action'] ?? 'create');

    // 1. TAMBAH DATA BOOKING BARU
    if ($action === 'create') {
        $sales_account_id = intval($_POST['sales_account_id'] ?? ($json['sales_account_id'] ?? 0));
        $sales_name = $conn->real_escape_string(trim($_POST['sales_name'] ?? ($json['sales_name'] ?? '')));
        $sales_spv = $conn->real_escape_string(trim($_POST['sales_spv'] ?? ($json['sales_spv'] ?? '')));
        $customer_name = $conn->real_escape_string(trim($_POST['customer_name'] ?? ($json['customer_name'] ?? '')));
        $customer_phone = $conn->real_escape_string(trim($_POST['customer_phone'] ?? ($json['customer_phone'] ?? '')));
        $customer_email = $conn->real_escape_string(trim($_POST['customer_email'] ?? ($json['customer_email'] ?? '')));
        $model_kendaraan = $conn->real_escape_string(trim($_POST['model_kendaraan'] ?? ($json['model_kendaraan'] ?? '')));
        $no_polisi = $conn->real_escape_string(trim($_POST['no_polisi'] ?? ($json['no_polisi'] ?? '')));
        $no_rangka = $conn->real_escape_string(trim($_POST['no_rangka'] ?? ($json['no_rangka'] ?? '')));
        $tanggal_do = !empty($_POST['tanggal_do']) ? "'" . $conn->real_escape_string($_POST['tanggal_do']) . "'" : "CURDATE()";
        $catatan_do = $conn->real_escape_string(trim($_POST['catatan_do'] ?? ($json['catatan_do'] ?? 'Handover unit & aktivasi m-Toyota')));

        if (empty($customer_name) || empty($customer_phone) || empty($model_kendaraan)) {
            echo json_encode(["status" => "error", "message" => "Nama customer, no HP, dan model kendaraan wajib diisi!"]);
            exit();
        }

        // Cek data sales jika belum lengkap
        if ($sales_account_id > 0 && (empty($sales_name) || empty($sales_spv))) {
            $q_sales = $conn->query("SELECT nama_lengkap, nama_spv FROM sales_accounts WHERE id = $sales_account_id LIMIT 1");
            if ($q_sales && $s_row = $q_sales->fetch_assoc()) {
                if (empty($sales_name)) $sales_name = $conn->real_escape_string($s_row['nama_lengkap']);
                if (empty($sales_spv)) $sales_spv = $conn->real_escape_string($s_row['nama_spv']);
            }
        }

        // Upload foto DO jika ada
        $foto_do = handleFileUpload('foto_do', 'do') ?? '';
        $foto_dec = handleFileUpload('foto_dec', 'dec') ?? '';
        $status_dec = (!empty($foto_dec) || !empty($_POST['dec_completed'])) ? 'completed' : 'pending';
        $tgl_selesai_dec = ($status_dec === 'completed') ? "CURDATE()" : "NULL";

        $progress = ($status_dec === 'completed') ? 40 : 20;

        $sql = "INSERT INTO tabel_booking_mtoyota (
            sales_account_id, sales_name, sales_spv, customer_name, customer_phone, customer_email,
            model_kendaraan, no_polisi, no_rangka, tanggal_do, status_do, tanggal_selesai_do, foto_do, catatan_do,
            status_dec, tanggal_selesai_dec, foto_dec, overall_progress
        ) VALUES (
            $sales_account_id, '$sales_name', '$sales_spv', '$customer_name', '$customer_phone', '$customer_email',
            '$model_kendaraan', '$no_polisi', '$no_rangka', $tanggal_do, 'completed', CURDATE(), '$foto_do', '$catatan_do',
            '$status_dec', $tgl_selesai_dec, '$foto_dec', $progress
        )";

        if ($conn->query($sql)) {
            $new_id = $conn->insert_id;
            echo json_encode([
                "status" => "success",
                "message" => "Berhasil mencatat progres onboarding m-Toyota untuk $customer_name!",
                "id" => $new_id
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . $conn->error]);
        }
        exit();
    }

    // 2. UPDATE PROGRES TAHAPAN (DO, DEC, FS 1000 KM, SB 10K, SB 20K)
    if ($action === 'update_progress') {
        $id = intval($_POST['id'] ?? ($json['id'] ?? 0));
        $milestone = strtolower(trim($_POST['milestone'] ?? ($json['milestone'] ?? '')));

        if ($id <= 0 || empty($milestone)) {
            echo json_encode(["status" => "error", "message" => "ID dan milestone tahapan wajib disertakan."]);
            exit();
        }

        $res_curr = $conn->query("SELECT * FROM tabel_booking_mtoyota WHERE id = $id LIMIT 1");
        if (!$res_curr || $res_curr->num_rows === 0) {
            echo json_encode(["status" => "error", "message" => "Data booking tidak ditemukan."]);
            exit();
        }
        $curr = $res_curr->fetch_assoc();

        $update_parts = [];

        // Upload foto baru jika ada
        $uploaded_photo = handleFileUpload('foto', $milestone);

        if ($milestone === 'do') {
            $status = $conn->real_escape_string($_POST['status'] ?? 'completed');
            $catatan = $conn->real_escape_string($_POST['catatan'] ?? '');
            $update_parts[] = "status_do = '$status'";
            if ($status === 'completed') $update_parts[] = "tanggal_selesai_do = CURDATE()";
            if ($uploaded_photo) $update_parts[] = "foto_do = '$uploaded_photo'";
            if (!empty($catatan)) $update_parts[] = "catatan_do = '$catatan'";

        } elseif ($milestone === 'dec') {
            $status = $conn->real_escape_string($_POST['status'] ?? 'completed');
            $catatan = $conn->real_escape_string($_POST['catatan'] ?? '');
            $update_parts[] = "status_dec = '$status'";
            if ($status === 'completed') $update_parts[] = "tanggal_selesai_dec = CURDATE()";
            if ($uploaded_photo) $update_parts[] = "foto_dec = '$uploaded_photo'";
            if (!empty($catatan)) $update_parts[] = "catatan_dec = '$catatan'";

        } elseif ($milestone === 'fs1000') {
            $status = $conn->real_escape_string($_POST['status'] ?? 'booked');
            $tgl_booking = !empty($_POST['tanggal_booking']) ? "'" . $conn->real_escape_string($_POST['tanggal_booking']) . "'" : "NULL";
            $catatan = $conn->real_escape_string($_POST['catatan'] ?? '');
            $update_parts[] = "status_fs1000 = '$status'";
            $update_parts[] = "tanggal_booking_fs1000 = $tgl_booking";
            if ($status === 'completed') $update_parts[] = "tanggal_selesai_fs1000 = CURDATE()";
            if ($uploaded_photo) $update_parts[] = "foto_fs1000 = '$uploaded_photo'";
            if (!empty($catatan)) $update_parts[] = "catatan_fs1000 = '$catatan'";

        } elseif ($milestone === 'sb10k') {
            $status = $conn->real_escape_string($_POST['status'] ?? 'booked');
            $tgl_booking = !empty($_POST['tanggal_booking']) ? "'" . $conn->real_escape_string($_POST['tanggal_booking']) . "'" : "NULL";
            $catatan = $conn->real_escape_string($_POST['catatan'] ?? '');
            $update_parts[] = "status_sb10k = '$status'";
            $update_parts[] = "tanggal_booking_sb10k = $tgl_booking";
            if ($status === 'completed') $update_parts[] = "tanggal_selesai_sb10k = CURDATE()";
            if ($uploaded_photo) $update_parts[] = "foto_sb10k = '$uploaded_photo'";
            if (!empty($catatan)) $update_parts[] = "catatan_sb10k = '$catatan'";

        } elseif ($milestone === 'sb20k') {
            $status = $conn->real_escape_string($_POST['status'] ?? 'booked');
            $tgl_booking = !empty($_POST['tanggal_booking']) ? "'" . $conn->real_escape_string($_POST['tanggal_booking']) . "'" : "NULL";
            $catatan = $conn->real_escape_string($_POST['catatan'] ?? '');
            $update_parts[] = "status_sb20k = '$status'";
            $update_parts[] = "tanggal_booking_sb20k = $tgl_booking";
            if ($status === 'completed') $update_parts[] = "tanggal_selesai_sb20k = CURDATE()";
            if ($uploaded_photo) $update_parts[] = "foto_sb20k = '$uploaded_photo'";
            if (!empty($catatan)) $update_parts[] = "catatan_sb20k = '$catatan'";
        }

        if (!empty($update_parts)) {
            $sql_up = "UPDATE tabel_booking_mtoyota SET " . implode(", ", $update_parts) . " WHERE id = $id";
            $conn->query($sql_up);

            // Refresh & update calculated overall progress
            $fresh = $conn->query("SELECT * FROM tabel_booking_mtoyota WHERE id = $id LIMIT 1")->fetch_assoc();
            $new_progress = calculateOverallProgress($fresh);
            $conn->query("UPDATE tabel_booking_mtoyota SET overall_progress = $new_progress WHERE id = $id");

            echo json_encode([
                "status" => "success",
                "message" => "Progres " . strtoupper($milestone) . " berhasil diperbarui!",
                "overall_progress" => $new_progress,
                "photo_url" => $uploaded_photo
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Tidak ada perubahan data."]);
        }
        exit();
    }

    // 3. HAPUS DATA
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? ($json['id'] ?? 0));
        if ($id > 0) {
            $conn->query("DELETE FROM tabel_booking_mtoyota WHERE id = $id");
            echo json_encode(["status" => "success", "message" => "Data booking m-Toyota berhasil dihapus."]);
        } else {
            echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
        }
        exit();
    }
}

echo json_encode(["status" => "error", "message" => "Action tidak dikenal."]);
