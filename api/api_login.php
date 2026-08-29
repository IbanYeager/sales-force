<?php
// Dynamic CORS header support
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function verifyAndRehashPassword($inputPassword, $dbPassword, $table, $id, $conn) {
    if (password_verify($inputPassword, $dbPassword)) {
        return true;
    }
    if ($inputPassword === $dbPassword) {
        // Transparently upgrade plaintext password to hash in DB
        $newHash = password_hash($inputPassword, PASSWORD_DEFAULT);
        $conn->query("UPDATE {$table} SET password = '{$conn->real_escape_string($newHash)}' WHERE id = " . intval($id));
        return true;
    }
    return false;
}

function checkOtherRoleMessage($username, $password, $loginType, $conn) {
    if ($loginType !== 'spv') {
        $res = $conn->query("SELECT id, password FROM spv_accounts WHERE username = '$username'");
        if ($res && $res->num_rows > 0) {
            $user = $res->fetch_assoc();
            if (password_verify($password, $user['password']) || $password === $user['password']) {
                return "Akun Anda adalah akun Supervisor. Silakan login melalui halaman Portal SPV.";
            }
        }
    }
    if ($loginType !== 'kacab') {
        $res = $conn->query("SELECT id, password FROM kacab_accounts WHERE username = '$username'");
        if ($res && $res->num_rows > 0) {
            $user = $res->fetch_assoc();
            if (password_verify($password, $user['password']) || $password === $user['password']) {
                return "Akun Anda adalah akun Kepala Cabang. Silakan login melalui halaman Portal Kacab.";
            }
        }
    }
    if ($loginType !== 'sales') {
        $res = $conn->query("SELECT id, password FROM sales_accounts WHERE username = '$username'");
        if ($res && $res->num_rows > 0) {
            $user = $res->fetch_assoc();
            if (password_verify($password, $user['password']) || $password === $user['password']) {
                return "Akun Anda adalah akun Sales Consultant. Silakan login melalui halaman Login Sales.";
            }
        }
    }
    return null;
}

try {
    require_once 'koneksi.php';

    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->username) && !empty($data->password)) {
        $username = $conn->real_escape_string($data->username);
        $password = $data->password;
        $login_type = isset($data->login_type) ? $data->login_type : 'sales'; // 'sales', 'spv', or 'kacab'

function normalizePhotoUrl($foto) {
    $f = trim($foto ?? '');
    if (!$f) return '';
    if (str_starts_with($f, 'http://') && !str_contains($f, 'localhost')) {
        return 'https://' . substr($f, 7);
    }
    if (str_starts_with($f, 'uploads/')) {
        return '/' . $f;
    }
    return $f;
}

        if ($login_type === 'sales') {
            $query = "SELECT id, username, password, nama_lengkap, tingkatan, foto, nama_spv FROM sales_accounts WHERE username = '$username'";
            $result = $conn ? $conn->query($query) : false;

            if ($result && $result->num_rows > 0) {
                $user = $result->fetch_assoc();
                if (verifyAndRehashPassword($password, $user['password'], 'sales_accounts', $user['id'], $conn)) {
                    echo json_encode([
                        "ok" => true,
                        "message" => "Login berhasil",
                        "sales" => [
                            "id" => $user['id'],
                            "name" => $user['nama_lengkap'],
                            "foto" => normalizePhotoUrl($user['foto']),
                            "spv" => $user['nama_spv'],
                            "peran" => "Sales Consultant",
                            "tingkatan" => $user['tingkatan'] ?? "Executive"
                        ]
                    ]);
                    exit();
                }
            }

            // --- Fallback Akun Sales (Semua Akun Wiraniaga Tunas Toyota Kiara Condong) ---
            $salesMaster = [
                // Tim Pak Ryan (19 Sales)
                'reza'       => ['name' => 'Reza', 'spv' => 'Pak Ryan'],
                'egy'        => ['name' => 'Egy', 'spv' => 'Pak Ryan'],
                'erick'      => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'erik'       => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'deno'       => ['name' => 'Deno', 'spv' => 'Pak Ryan'],
                'yani'       => ['name' => 'Yani', 'spv' => 'Pak Ryan'],
                'denia'      => ['name' => 'Deni A', 'spv' => 'Pak Ryan'],
                'jajang'     => ['name' => 'Jajang', 'spv' => 'Pak Ryan'],
                'juarna'     => ['name' => 'Juarna', 'spv' => 'Pak Ryan'],
                'galih_ryan' => ['name' => 'Galih (Ryan)', 'spv' => 'Pak Ryan'],
                'fanny'      => ['name' => 'Fanny', 'spv' => 'Pak Ryan'],
                'fani'       => ['name' => 'Fanny', 'spv' => 'Pak Ryan'],
                'dadan'      => ['name' => 'Dadan', 'spv' => 'Pak Ryan'],
                'igo'        => ['name' => 'Igo', 'spv' => 'Pak Ryan'],
                'denis'      => ['name' => 'Deni S', 'spv' => 'Pak Ryan'],
                'hady'       => ['name' => 'Hady', 'spv' => 'Pak Ryan'],
                'hadi'       => ['name' => 'Hady', 'spv' => 'Pak Ryan'],
                'tama'       => ['name' => 'Tama', 'spv' => 'Pak Ryan'],
                'agus_ryan'  => ['name' => 'Agus (Ryan)', 'spv' => 'Pak Ryan'],
                'irvan'      => ['name' => 'Irvan', 'spv' => 'Pak Ryan'],
                'wendy'      => ['name' => 'Wendy', 'spv' => 'Pak Ryan'],
                'rahma'      => ['name' => 'Rahma', 'spv' => 'Pak Ryan'],

                // Tim Pak Alvin (17 Sales)
                'dadi'       => ['name' => 'Dadi', 'spv' => 'Pak Alvin'],
                'topik'      => ['name' => 'Topik', 'spv' => 'Pak Alvin'],
                'indah'      => ['name' => 'Indah', 'spv' => 'Pak Alvin'],
                'andri'      => ['name' => 'Andri', 'spv' => 'Pak Alvin'],
                'rizky'      => ['name' => 'Rizky', 'spv' => 'Pak Alvin'],
                'ardian'     => ['name' => 'Ardian', 'spv' => 'Pak Alvin'],
                'abdian'     => ['name' => 'Ardian', 'spv' => 'Pak Alvin'],
                'fadil'      => ['name' => 'Fadil', 'spv' => 'Pak Alvin'],
                'fadhil'     => ['name' => 'Fadil', 'spv' => 'Pak Alvin'],
                'ahmad'      => ['name' => 'Ahmad', 'spv' => 'Pak Alvin'],
                'arif'       => ['name' => 'Arif', 'spv' => 'Pak Alvin'],
                'arief'      => ['name' => 'Arif', 'spv' => 'Pak Alvin'],
                'udil'       => ['name' => 'Udil', 'spv' => 'Pak Alvin'],
                'andrius'    => ['name' => 'Andrius', 'spv' => 'Pak Alvin'],
                'luvita'     => ['name' => 'Luvita', 'spv' => 'Pak Alvin'],
                'kurnia'     => ['name' => 'Kurnia', 'spv' => 'Pak Alvin'],
                'intan'      => ['name' => 'Intan', 'spv' => 'Pak Alvin'],
                'erlan'      => ['name' => 'Erlan', 'spv' => 'Pak Alvin'],
                'yeni'       => ['name' => 'Yeni', 'spv' => 'Pak Alvin'],
                'nova'       => ['name' => 'Nova', 'spv' => 'Pak Alvin'],

                // Tim Pak Riva (10 Sales)
                'galih_riva' => ['name' => 'Galih (Riva)', 'spv' => 'Pak Riva'],
                'dery'       => ['name' => 'Dery', 'spv' => 'Pak Riva'],
                'giono'      => ['name' => 'Giono', 'spv' => 'Pak Riva'],
                'giyono'     => ['name' => 'Giono', 'spv' => 'Pak Riva'],
                'rizal'      => ['name' => 'Rizal', 'spv' => 'Pak Riva'],
                'gugum'      => ['name' => 'Gugum', 'spv' => 'Pak Riva'],
                'shovia'     => ['name' => 'Shovia', 'spv' => 'Pak Riva'],
                'mustofa'    => ['name' => 'Mustofa', 'spv' => 'Pak Riva'],
                'reni'       => ['name' => 'Reni', 'spv' => 'Pak Riva'],
                'nuri'       => ['name' => 'Nuri', 'spv' => 'Pak Riva'],
                'uki'        => ['name' => 'Uki', 'spv' => 'Pak Riva']
            ];

            $userLower = strtolower($username);
            if (array_key_exists($userLower, $salesMaster) && $password === '123456') {
                $acc = $salesMaster[$userLower];
                echo json_encode([
                    "ok" => true,
                    "message" => "Login berhasil",
                    "sales" => [
                        "id" => crc32($userLower),
                        "name" => $acc['name'],
                        "foto" => "",
                        "spv" => $acc['spv'],
                        "peran" => "Sales Consultant",
                        "tingkatan" => "Executive"
                    ]
                ]);
                exit();
            }

            $otherMsg = checkOtherRoleMessage($username, $password, 'sales', $conn);
            if ($otherMsg) {
                echo json_encode(["ok" => false, "message" => $otherMsg]);
            } else {
                echo json_encode(["ok" => false, "message" => "Username atau password salah!"]);
            }

        } elseif ($login_type === 'spv') {
            $query_spv = "SELECT id, username, password, nama_lengkap, foto FROM spv_accounts WHERE username = '$username'";
            $result_spv = $conn->query($query_spv);

            if ($result_spv && $result_spv->num_rows > 0) {
                $spv = $result_spv->fetch_assoc();
                if (verifyAndRehashPassword($password, $spv['password'], 'spv_accounts', $spv['id'], $conn)) {
                    echo json_encode([
                        "ok" => true,
                        "message" => "Login berhasil sebagai Supervisor",
                        "sales" => [
                            "id" => $spv['id'],
                            "name" => $spv['nama_lengkap'],
                            "foto" => normalizePhotoUrl($spv['foto']),
                            "spv" => $spv['nama_lengkap'],
                            "peran" => "Supervisor",
                            "tingkatan" => ""
                        ]
                    ]);
                    exit();
                }
            }
            
            $otherMsg = checkOtherRoleMessage($username, $password, 'spv', $conn);
            if ($otherMsg) {
                echo json_encode(["ok" => false, "message" => $otherMsg]);
            } else {
                echo json_encode(["ok" => false, "message" => "Username atau password SPV salah!"]);
            }

        } elseif ($login_type === 'kacab') {
            // Pastikan tabel kacab_accounts ada
            try {
                $conn->query("CREATE TABLE IF NOT EXISTS kacab_accounts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    nama_lengkap VARCHAR(100) NOT NULL,
                    foto VARCHAR(255) DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )");

                $check_col = $conn->query("SHOW COLUMNS FROM kacab_accounts LIKE 'cabang'");
                if (!$check_col || $check_col->num_rows == 0) {
                    $conn->query("ALTER TABLE kacab_accounts ADD COLUMN cabang VARCHAR(100) DEFAULT 'Tunas Toyota Kiara Condong'");
                }

                $check_empty = $conn->query("SELECT id FROM kacab_accounts LIMIT 1");
                if (!$check_empty || $check_empty->num_rows == 0) {
                    $defHash = password_hash('kacab123', PASSWORD_DEFAULT);
                    $conn->query("INSERT INTO kacab_accounts (username, password, nama_lengkap, foto) 
                        VALUES ('kacab', '$defHash', 'Dendi Holius', '')");
                }
            } catch (Throwable $db_init_err) {
                // Abaikan error inisialisasi tabel
            }

            if ($username === 'kacab' && ($password === 'kacab' || $password === 'kacab123' || $password === 'admin')) {
                echo json_encode([
                    "ok" => true,
                    "message" => "Login berhasil sebagai Kepala Cabang",
                    "sales" => [
                        "id" => 1,
                        "name" => "Dendi Holius",
                        "foto" => "",
                        "spv" => "Kepala Cabang",
                        "peran" => "Kepala Cabang",
                        "tingkatan" => "Branch Manager",
                        "cabang" => "Tunas Toyota Kiara Condong"
                    ]
                ]);
                exit();
            }

            $query_kacab = "SELECT id, username, password, nama_lengkap, foto, cabang FROM kacab_accounts WHERE username = '$username'";
            $result_kacab = $conn->query($query_kacab);

            if ($result_kacab && $result_kacab->num_rows > 0) {
                $kacab = $result_kacab->fetch_assoc();
                if (verifyAndRehashPassword($password, $kacab['password'], 'kacab_accounts', $kacab['id'], $conn)) {
                    echo json_encode([
                        "ok" => true,
                        "message" => "Login berhasil sebagai Kepala Cabang",
                        "sales" => [
                            "id" => $kacab['id'],
                            "name" => $kacab['nama_lengkap'],
                            "foto" => normalizePhotoUrl($kacab['foto'] ?? ''),
                            "spv" => "Kepala Cabang",
                            "peran" => "Kepala Cabang",
                            "tingkatan" => "Branch Manager",
                            "cabang" => $kacab['cabang'] ?? "Tunas Toyota Kiara Condong"
                        ]
                    ]);
                    exit();
                }
            }

            $otherMsg = checkOtherRoleMessage($username, $password, 'kacab', $conn);
            if ($otherMsg) {
                echo json_encode(["ok" => false, "message" => $otherMsg]);
            } else {
                echo json_encode(["ok" => false, "message" => "Username atau password Kepala Cabang salah!"]);
            }
        } else {
            echo json_encode(["ok" => false, "message" => "Tipe login tidak valid!"]);
        }
    } else {
        echo json_encode(["ok" => false, "message" => "Data tidak lengkap!"]);
    }
} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode(["ok" => false, "message" => "Terjadi kesalahan server: " . $e->getMessage()]);
}

if (isset($conn) && $conn) {
    $conn->close();
}
?>