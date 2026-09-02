<?php
// Matikan error bawaan PHP agar tidak merusak format JSON
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sales_id = intval($_POST['sales_id'] ?? 0);
    if ($sales_id <= 0) {
        echo json_encode(["ok" => false, "message" => "ID Sales tidak valid"]);
        exit();
    }

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $file = $_FILES['foto'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($ext, $allowTypes)) {
            echo json_encode(["ok" => false, "message" => "Format file tidak didukung (Gunakan JPG, PNG, WEBP, GIF)"]);
            exit();
        }

        // Keamanan: Validasi batas ukuran file (maksimal 5MB)
        if (($file['size'] ?? 0) > 5 * 1024 * 1024) {
            echo json_encode(["ok" => false, "message" => "Ukuran file terlalu besar (maksimal 5 MB)"]);
            exit();
        }

        // Keamanan: Validasi integritas gambar asli (mencegah script berbahaya disamarkan)
        $imgInfo = @getimagesize($file['tmp_name']);
        if ($imgInfo === false) {
            echo json_encode(["ok" => false, "message" => "File yang diunggah bukan gambar yang valid"]);
            exit();
        }
        $mime = strtolower($imgInfo['mime'] ?? '');
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($mime, $allowedMimes)) {
            echo json_encode(["ok" => false, "message" => "Tipe konten gambar tidak diizinkan"]);
            exit();
        }

        // Sanitasi nama file unik
        $fileName = time() . '_' . $sales_id . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

        // Target direktori (simpan ke kedua lokasi: root uploads dan public uploads agar selalu sinkron)
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
            // Tentukan URL yang aman & selalu HTTPS di production
            $isHttps = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === '1')) ||
                       (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') ||
                       (isset($_SERVER['HTTP_CF_VISITOR']) && stripos($_SERVER['HTTP_CF_VISITOR'], 'https') !== false) ||
                       (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

            $protocol = $isHttps ? "https" : "http";
            $domain = $_SERVER['HTTP_HOST'] ?? 'salesforcetunassft.com';
            if ($domain !== 'localhost' && !str_starts_with($domain, '127.0.0.1')) {
                $protocol = "https"; // Selalu paksa HTTPS untuk domain publik
            }

            // Path lengkap dan path relatif root
            $fullPath = $protocol . "://" . $domain . "/uploads/" . $fileName;

            // Hapus foto lama jika ada
            $qOld = $conn->query("SELECT foto FROM sales_accounts WHERE id = $sales_id LIMIT 1");
            if ($qOld && $rOld = $qOld->fetch_assoc()) {
                $oldFoto = trim($rOld['foto'] ?? '');
                if ($oldFoto && !str_starts_with($oldFoto, 'http://ui-avatars') && !str_starts_with($oldFoto, 'https://ui-avatars')) {
                    $oldName = basename($oldFoto);
                    foreach ($dirs as $d) {
                        $oldFile = rtrim($d, '/\\') . '/' . $oldName;
                        if (file_exists($oldFile) && is_file($oldFile)) {
                            @unlink($oldFile);
                        }
                    }
                }
            }

            $sql = "UPDATE sales_accounts SET foto = '" . $conn->real_escape_string($fullPath) . "' WHERE id = $sales_id";
            if ($conn->query($sql)) {
                echo json_encode([
                    "ok" => true,
                    "status" => "success",
                    "message" => "Foto profil berhasil diperbarui!",
                    "path" => $fullPath,
                    "foto" => $fullPath
                ]);
            } else {
                echo json_encode(["ok" => false, "message" => "Gagal menyimpan ke database: " . $conn->error]);
            }
        } else {
            echo json_encode(["ok" => false, "message" => "Gagal memindahkan file ke server"]);
        }
    } else {
        echo json_encode(["ok" => false, "message" => "Tidak ada file yang diunggah atau ukuran file terlalu besar"]);
    }
} else {
    echo json_encode(["ok" => false, "message" => "Metode request salah"]);
}

$conn->close();
?>