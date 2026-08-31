<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

// Auto-ensure columns for social media and contact
$cols = ['no_hp', 'email', 'instagram_url', 'tiktok_url', 'facebook_url', 'website_url'];
foreach ($cols as $col) {
    $chk = $conn->query("SHOW COLUMNS FROM sales_accounts LIKE '$col'");
    if ($chk && $chk->num_rows === 0) {
        @$conn->query("ALTER TABLE sales_accounts ADD COLUMN $col VARCHAR(255) DEFAULT ''");
    }
    if ($chk) $chk->free();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sales_id = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
    if ($sales_id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID Sales tidak valid."]);
        exit;
    }

    $query = "SELECT id, username, nama_lengkap, foto, nama_spv, tingkatan, no_hp, email, instagram_url, tiktok_url, facebook_url, website_url FROM sales_accounts WHERE id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("i", $sales_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Normalisasi HTTPS pada foto jika tersimpan HTTP
            if (!empty($user['foto']) && str_starts_with($user['foto'], 'http://') && !str_contains($user['foto'], 'localhost')) {
                $user['foto'] = 'https://' . substr($user['foto'], 7);
            }
            echo json_encode(["status" => "success", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Sales tidak ditemukan."]);
        }
        $stmt->close();
    }
} elseif ($method === 'POST') {
    $sales_id = isset($_POST['sales_id']) ? intval($_POST['sales_id']) : 0;
    if ($sales_id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID Sales tidak valid."]);
        exit;
    }

    $nama = trim($_POST['nama_lengkap'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $no_hp = trim($_POST['no_hp'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $instagram_url = trim($_POST['instagram_url'] ?? '');
    $tiktok_url = trim($_POST['tiktok_url'] ?? '');
    $facebook_url = trim($_POST['facebook_url'] ?? '');
    $website_url = trim($_POST['website_url'] ?? '');

    // Handle File Upload jika ada
    $fotoPath = '';
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $file = $_FILES['foto'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (in_array($ext, $allowTypes)) {
            $fileName = time() . '_' . $sales_id . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

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

                $fotoPath = $protocol . "://" . $domain . "/uploads/" . $fileName;
            }
        }
    }

    $query = "UPDATE sales_accounts SET nama_lengkap = ?, username = ?, no_hp = ?, email = ?, instagram_url = ?, tiktok_url = ?, facebook_url = ?, website_url = ?";
    $types = "ssssssss";
    $params = [&$nama, &$username, &$no_hp, &$email, &$instagram_url, &$tiktok_url, &$facebook_url, &$website_url];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $types .= "s";
        $params[] = &$hashed_password;
    }

    if (!empty($fotoPath)) {
        $query .= ", foto = ?";
        $types .= "s";
        $params[] = &$fotoPath;
    }

    $query .= " WHERE id = ?";
    $types .= "i";
    $params[] = &$sales_id;

    $stmt = $conn->prepare($query);
    if ($stmt) {
        $bind_names = [$types];
        for ($i = 0; $i < count($params); $i++) {
            $bind_names[] = &$params[$i];
        }
        call_user_func_array([$stmt, 'bind_param'], $bind_names);

        if ($stmt->execute()) {
            $q2 = "SELECT id, username, nama_lengkap, foto, no_hp, email, instagram_url, tiktok_url, facebook_url, website_url FROM sales_accounts WHERE id = $sales_id";
            $r2 = $conn->query($q2);
            $updated = $r2->fetch_assoc();
            if (!empty($updated['foto']) && str_starts_with($updated['foto'], 'http://') && !str_contains($updated['foto'], 'localhost')) {
                $updated['foto'] = 'https://' . substr($updated['foto'], 7);
            }
            echo json_encode(["status" => "success", "message" => "Profil dan link media sosial berhasil diperbarui!", "data" => $updated]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal memperbarui: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
}
$conn->close();
?>
