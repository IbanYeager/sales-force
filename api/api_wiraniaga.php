<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'koneksi.php';

// Pastikan tabel sales_accounts ada
$checkTable = $conn->query("SHOW TABLES LIKE 'sales_accounts'");
if ($checkTable && $checkTable->num_rows === 0) {
    $conn->query("CREATE TABLE IF NOT EXISTS sales_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama_lengkap VARCHAR(100) NOT NULL,
        tingkatan VARCHAR(50) DEFAULT 'Magang',
        foto VARCHAR(255) DEFAULT '',
        nama_spv VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insert dummy data jika tabel baru dibuat
    $conn->query("INSERT IGNORE INTO sales_accounts (username, password, nama_lengkap, tingkatan, foto, nama_spv) VALUES 
    ('sales1', '123456', 'Ahmad wiraniaga', 'Magang', '', 'Pak Riva'),
    ('sales2', '123456', 'Budi Santoso', 'Junior', '', 'Pak Riva'),
    ('sales3', '123456', 'Citra Lestari', 'Magang', '', 'Pak Ryan')");
}
if ($checkTable) {
    $checkTable->free();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $spv = isset($_GET['spv']) ? $conn->real_escape_string(trim($_GET['spv'])) : '';
    
    $query = "SELECT id, username, nama_lengkap, tingkatan, foto, nama_spv, status, DATE_FORMAT(created_at, '%d %b %Y') as created_at, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at_raw FROM sales_accounts";
    if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
        $spv_clean = str_replace('Pak ', '', $spv);
        $query_spv = $query . " WHERE (nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%') ORDER BY id DESC";
        $result = $conn->query($query_spv);
        $data = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        echo json_encode(["status" => "success", "data" => $data]);
        $conn->close();
        exit();
    }

    // Jika SPV kosong (misal superadmin/login bukan SPV)
    $result = $conn->query($query . " ORDER BY id DESC");
    $data = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $data]);
    $conn->close();
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action'] : '';

    if ($action === 'create') {
        $nama_lengkap = $conn->real_escape_string(trim($data['nama_lengkap'] ?? ''));
        $username = $conn->real_escape_string(trim($data['username'] ?? ''));
        $raw_password = trim($data['password'] ?? '');
        $password = $conn->real_escape_string(password_hash($raw_password, PASSWORD_DEFAULT));
        $tingkatan = $conn->real_escape_string(trim($data['tingkatan'] ?? 'Magang'));
        $nama_spv = $conn->real_escape_string(trim($data['nama_spv'] ?? 'Pak Riva'));
        $status = $conn->real_escape_string(trim($data['status'] ?? 'Aktif'));
        $created_at = $conn->real_escape_string(trim($data['created_at'] ?? date('Y-m-d')));

        if (empty($nama_lengkap) || empty($username) || empty($raw_password)) {
            echo json_encode(["status" => "error", "message" => "Nama lengkap, username, dan password wajib diisi!"]);
            $conn->close();
            exit();
        }

        // Cek username apakah sudah ada
        $checkUser = $conn->query("SELECT id FROM sales_accounts WHERE username = '$username'");
        if ($checkUser && $checkUser->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Username '$username' sudah digunakan! Silakan pilih username lain."]);
            $conn->close();
            exit();
        }

        $sql = "INSERT INTO sales_accounts (nama_lengkap, username, password, tingkatan, nama_spv, foto, status, created_at) VALUES ('$nama_lengkap', '$username', '$password', '$tingkatan', '$nama_spv', '', '$status', '$created_at')";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Akun wiraniaga berhasil ditambahkan!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . $conn->error]);
        }
        $conn->close();
        exit();
    }

    if ($action === 'update') {
        $id = intval($data['id'] ?? 0);
        $nama_lengkap = $conn->real_escape_string(trim($data['nama_lengkap'] ?? ''));
        $username = $conn->real_escape_string(trim($data['username'] ?? ''));
        $raw_password = trim($data['password'] ?? '');
        $tingkatan = $conn->real_escape_string(trim($data['tingkatan'] ?? 'Magang'));
        $nama_spv = $conn->real_escape_string(trim($data['nama_spv'] ?? 'Pak Riva'));
        $status = $conn->real_escape_string(trim($data['status'] ?? 'Aktif'));
        $created_at = $conn->real_escape_string(trim($data['created_at'] ?? date('Y-m-d')));

        if ($id === 0 || empty($nama_lengkap) || empty($username)) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk melakukan update!"]);
            $conn->close();
            exit();
        }

        // Cek username lain
        $checkUser = $conn->query("SELECT id FROM sales_accounts WHERE username = '$username' AND id != $id");
        if ($checkUser && $checkUser->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Username '$username' sudah digunakan oleh akun lain!"]);
            $conn->close();
            exit();
        }

        if (!empty($raw_password)) {
            $password = $conn->real_escape_string(password_hash($raw_password, PASSWORD_DEFAULT));
            $sql = "UPDATE sales_accounts SET nama_lengkap = '$nama_lengkap', username = '$username', password = '$password', tingkatan = '$tingkatan', nama_spv = '$nama_spv', status = '$status', created_at = '$created_at' WHERE id = $id";
        } else {
            $sql = "UPDATE sales_accounts SET nama_lengkap = '$nama_lengkap', username = '$username', tingkatan = '$tingkatan', nama_spv = '$nama_spv', status = '$status', created_at = '$created_at' WHERE id = $id";
        }

        if ($conn->query($sql)) {
            // If status changed to Nonaktif / Resign, release unfinished database leads to the Open Pool (Rebutan)
            if ($status === 'Nonaktif' || $status === 'Resign') {
                $escName = $conn->real_escape_string($nama_lengkap);
                @$conn->query("UPDATE followup_customers SET assigned_sales_id = NULL, is_orphan = 1, ex_sales_name = '$escName', released_at = NOW() WHERE assigned_sales_id = $id AND (followup_status != 'Deal / Selesai' OR followup_status IS NULL)");
            }
            echo json_encode(["status" => "success", "message" => "Data wiraniaga berhasil diperbarui!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengupdate database: " . $conn->error]);
        }
        $conn->close();
        exit();
    }

    if ($action === 'delete') {
        $id = intval($data['id'] ?? 0);
        if ($id === 0) {
            echo json_encode(["status" => "error", "message" => "ID wiraniaga tidak valid!"]);
            $conn->close();
            exit();
        }

        // Get sales name before deleting
        $salesName = "Ex-Sales #$id";
        $qOld = $conn->query("SELECT nama_lengkap FROM sales_accounts WHERE id = $id LIMIT 1");
        if ($qOld && $rOld = $qOld->fetch_assoc()) {
            $salesName = $conn->real_escape_string($rOld['nama_lengkap']);
        }

        // 1. Release unfinished database leads to the Open Pool (Rebutan) so other active sales can claim them
        @$conn->query("UPDATE followup_customers SET assigned_sales_id = NULL, is_orphan = 1, ex_sales_name = '$salesName', released_at = NOW() WHERE assigned_sales_id = $id AND (followup_status != 'Deal / Selesai' OR followup_status IS NULL)");

        $sql = "DELETE FROM sales_accounts WHERE id = $id";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Akun wiraniaga berhasil dihapus dan prospek yang belum selesai telah dilepas ke Pool Rebutan!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus dari database: " . $conn->error]);
        }
        $conn->close();
        exit();
    }

    echo json_encode(["status" => "error", "message" => "Aksi tidak dikenali!"]);
    $conn->close();
    exit();
}

echo json_encode(["status" => "error", "message" => "Metode request tidak didukung!"]);
$conn->close();
?>
