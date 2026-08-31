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
    
    // Update online status threshold (2 minutes)
    $conn->query("UPDATE sales_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
    $conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE) OR last_active IS NULL");

    $query = "SELECT id, username, nama_lengkap, tingkatan, foto, nama_spv, last_active, no_hp, email, instagram_url, tiktok_url, facebook_url, website_url,
                     CASE WHEN last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) THEN 1 ELSE 0 END as is_online,
                     DATE_FORMAT(created_at, '%d %b %Y') as created_at, 
                     DATE_FORMAT(created_at, '%Y-%m-%d') as created_at_raw 
              FROM sales_accounts";
    
    function formatRelTime($datetimeStr) {
        if (!$datetimeStr) return "Belum pernah aktif";
        $time = strtotime($datetimeStr);
        $diff = time() - $time;
        if ($diff < 90) return "Online Sekarang";
        if ($diff < 3600) return floor($diff / 60) . " mnt lalu";
        if ($diff < 86400) return "Hari ini " . date('H:i', $time);
        if ($diff < 172800) return "Kemarin " . date('H:i', $time);
        return date('d M Y H:i', $time);
    }

    $show_all = isset($_GET['all']) && $_GET['all'] === '1';
    $where_parts = [];
    if (!$show_all) {
        $where_parts[] = "is_active = 1";
    }

    if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
        $spv_clean = str_replace('Pak ', '', $spv);
        $where_parts[] = "(nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%')";
    }

    if (!empty($where_parts)) {
        $query .= " WHERE " . implode(" AND ", $where_parts);
    }
    $query .= " ORDER BY id ASC";

    $result = $conn->query($query);
    $data = [];
    $total_online = 0;
    $total_offline = 0;

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $is_on = intval($row['is_online']) === 1;
            if ($is_on) $total_online++;
            else $total_offline++;

            // Normalisasi URL foto agar selalu valid & HTTPS di production
            $f = trim($row['foto'] ?? '');
            if ($f !== '') {
                if (str_starts_with($f, 'http://') && !str_contains($f, 'localhost')) {
                    $f = 'https://' . substr($f, 7);
                } elseif (str_starts_with($f, 'uploads/')) {
                    $f = '/' . $f;
                }
            }
            $row['foto'] = $f;

            $row['is_online'] = $is_on;
            $row['status_online'] = $is_on ? "Online" : "Offline";
            $row['last_active_formatted'] = formatRelTime($row['last_active']);
            $data[] = $row;
        }
    }
    echo json_encode([
        "status" => "success", 
        "total" => count($data),
        "total_online" => $total_online,
        "total_offline" => $total_offline,
        "data" => $data
    ]);
    $conn->close();
    exit();
}

if ($method === 'POST') {
    // Support both JSON input and multipart/form-data
    $data = [];
    $rawInput = file_get_contents("php://input");
    if (!empty($rawInput) && !empty($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $data = json_decode($rawInput, true) ?: [];
    } else {
        $data = $_POST;
    }

    $action = isset($data['action']) ? $data['action'] : '';

    // Helper to process uploaded photo if any
    $uploadedFotoUrl = null;
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $file = $_FILES['foto'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (in_array($ext, $allowTypes)) {
            $salesIdTag = intval($data['id'] ?? 0);
            $fileName = time() . '_' . $salesIdTag . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

            $dirs = [
                __DIR__ . '/../uploads/',
                __DIR__ . '/../public/uploads/',
                __DIR__ . '/../../public/uploads/',
                __DIR__ . '/uploads/'
            ];

            $uploaded = false;
            $savedPath = '';

            foreach ($dirs as $dir) {
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                if (is_dir($dir)) {
                    $dest = rtrim($dir, '/\\') . '/' . $fileName;
                    if (!$uploaded) {
                        if (@move_uploaded_file($file['tmp_name'], $dest)) {
                            $uploaded = true;
                            $savedPath = $dest;
                        }
                    } else if ($savedPath && file_exists($savedPath)) {
                        @copy($savedPath, $dest);
                    }
                }
            }

            if ($uploaded) {
                $isHttps = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === '1')) ||
                           (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') ||
                           (isset($_SERVER['HTTP_CF_VISITOR']) && stripos($_SERVER['HTTP_CF_VISITOR'], 'https') !== false);

                $protocol = $isHttps ? "https" : "http";
                $domain = $_SERVER['HTTP_HOST'] ?? 'salesforcetunassft.com';
                if ($domain !== 'localhost' && !str_starts_with($domain, '127.0.0.1')) {
                    $protocol = "https";
                }

                $uploadedFotoUrl = $protocol . "://" . $domain . "/uploads/" . $fileName;
            }
        }
    }

    if ($action === 'create') {
        $nama_lengkap = $conn->real_escape_string(trim($data['nama_lengkap'] ?? ''));
        $username = $conn->real_escape_string(trim($data['username'] ?? ''));
        $raw_password = trim($data['password'] ?? '');
        $password = $conn->real_escape_string(password_hash($raw_password, PASSWORD_DEFAULT));
        $tingkatan = $conn->real_escape_string(trim($data['tingkatan'] ?? 'Magang'));
        $nama_spv = $conn->real_escape_string(trim($data['nama_spv'] ?? 'Pak Riva'));
        $created_at = $conn->real_escape_string(trim($data['created_at'] ?? date('Y-m-d')));
        $foto = $uploadedFotoUrl !== null ? $conn->real_escape_string($uploadedFotoUrl) : $conn->real_escape_string(trim($data['foto'] ?? ''));

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

        $sql = "INSERT INTO sales_accounts (nama_lengkap, username, password, tingkatan, nama_spv, foto, created_at) VALUES ('$nama_lengkap', '$username', '$password', '$tingkatan', '$nama_spv', '$foto', '$created_at')";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Akun wiraniaga berhasil ditambahkan!", "foto" => $foto]);
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
        $created_at = $conn->real_escape_string(trim($data['created_at'] ?? date('Y-m-d')));
        
        $foto = $uploadedFotoUrl !== null ? $conn->real_escape_string($uploadedFotoUrl) : (isset($data['foto']) ? $conn->real_escape_string(trim($data['foto'])) : null);

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

        $set_parts = [
            "nama_lengkap = '$nama_lengkap'",
            "username = '$username'",
            "tingkatan = '$tingkatan'",
            "nama_spv = '$nama_spv'",
            "created_at = '$created_at'"
        ];

        if (!empty($raw_password)) {
            $password = $conn->real_escape_string(password_hash($raw_password, PASSWORD_DEFAULT));
            $set_parts[] = "password = '$password'";
        }

        if ($foto !== null) {
            $set_parts[] = "foto = '$foto'";
        }

        $sql = "UPDATE sales_accounts SET " . implode(", ", $set_parts) . " WHERE id = $id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Data wiraniaga berhasil diperbarui!", "foto" => $foto]);
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
