<?php
// =========================================================================
// api_wa_gateway.php - Universal WhatsApp Gateway Engine per Sales Account
// Mendukung Fonnte, Wablas, Custom Gateway, dan Mode Simulasi
// =========================================================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/koneksi.php';

// Pastikan tabel_wa_logs siap
$conn->query("CREATE TABLE IF NOT EXISTS tabel_wa_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sales_id INT DEFAULT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    provider VARCHAR(50) DEFAULT 'fonnte',
    status VARCHAR(30) DEFAULT 'pending',
    gateway_response TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Pastikan kolom wa_gateway_token dan wa_gateway_provider ada di tabel sales_accounts jika ada
$checkCols = $conn->query("SHOW COLUMNS FROM sales_accounts LIKE 'wa_gateway_token'");
if ($checkCols && $checkCols->num_rows === 0) {
    @$conn->query("ALTER TABLE sales_accounts ADD COLUMN wa_gateway_token VARCHAR(255) DEFAULT NULL");
    @$conn->query("ALTER TABLE sales_accounts ADD COLUMN wa_gateway_provider VARCHAR(50) DEFAULT 'fonnte'");
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$rawInput = file_get_contents("php://input");
$payload = json_decode($rawInput, true) ?? $_POST;

if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

// Default action jika mengirim phone & message langsung
if (empty($action)) {
    if (isset($payload['phone']) && isset($payload['message'])) {
        $action = 'send';
    } else {
        $action = 'status';
    }
}

// -------------------------------------------------------------------------
// 1. ACTION: GET_TOKEN - Ambil token sales
// -------------------------------------------------------------------------
if ($action === 'get_token') {
    $sales_id = intval($payload['sales_id'] ?? ($_GET['sales_id'] ?? 0));
    if ($sales_id <= 0) {
        echo json_encode(["success" => false, "message" => "Sales ID tidak valid."]);
        exit;
    }

    $token = '';
    $provider = 'fonnte';
    $phone = '';
    $sales_name = '';

    $stmt = $conn->prepare("SELECT id, nama_lengkap, no_hp, wa_gateway_token, wa_gateway_provider FROM sales_accounts WHERE id = ? LIMIT 1");
    if ($stmt) {
        $stmt->bind_param("i", $sales_id);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $token = $row['wa_gateway_token'] ?? '';
            $provider = $row['wa_gateway_provider'] ?? 'fonnte';
            $phone = $row['no_hp'] ?? '';
            $sales_name = $row['nama_lengkap'] ?? '';
        }
        $stmt->close();
    }

    echo json_encode([
        "success" => true,
        "sales_id" => $sales_id,
        "sales_name" => $sales_name,
        "sales_phone" => $phone,
        "token" => $token,
        "provider" => $provider,
        "has_token" => !empty($token)
    ]);
    exit;
}

// -------------------------------------------------------------------------
// 2. ACTION: SAVE_TOKEN - Simpan token gateway sales
// -------------------------------------------------------------------------
if ($action === 'save_token') {
    $sales_id = intval($payload['sales_id'] ?? 0);
    $token = trim($payload['token'] ?? '');
    $provider = trim($payload['provider'] ?? 'fonnte');

    if ($sales_id <= 0) {
        echo json_encode(["success" => false, "message" => "Sales ID tidak valid."]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE sales_accounts SET wa_gateway_token = ?, wa_gateway_provider = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("ssi", $token, $provider, $sales_id);
        $stmt->execute();
        $stmt->close();
        echo json_encode([
            "success" => true,
            "message" => "Token WA Gateway sales berhasil disimpan.",
            "token" => $token,
            "provider" => $provider
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menyimpan token ke database."]);
    }
    exit;
}

// -------------------------------------------------------------------------
// 3. ACTION: TEST_TOKEN - Tes koneksi device gateway
// -------------------------------------------------------------------------
if ($action === 'test_token') {
    $token = trim($payload['token'] ?? '');
    $provider = trim($payload['provider'] ?? 'fonnte');

    if (empty($token)) {
        echo json_encode(["success" => false, "message" => "Token gateway belum diisi."]);
        exit;
    }

    if ($provider === 'fonnte') {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.fonnte.com/device',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $token
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            echo json_encode(["success" => false, "message" => "Koneksi ke Fonnte timeout/gagal: " . $err]);
            exit;
        }

        $resJson = json_decode($response, true);
        if ($resJson && isset($resJson['status']) && $resJson['status'] === true) {
            echo json_encode([
                "success" => true,
                "message" => "WhatsApp Terhubung! (" . ($resJson['name'] ?? 'Device Aktif') . " - " . ($resJson['device'] ?? '') . ")",
                "device_info" => $resJson
            ]);
        } else {
            $msg = $resJson['reason'] ?? ($resJson['message'] ?? 'Token tidak valid atau device belum terhubung/disconnect.');
            echo json_encode(["success" => false, "message" => "Fonnte: " . $msg]);
        }
        exit;
    } elseif ($provider === 'wablas') {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://phone.wablas.com/api/device/info?token=' . urlencode($token),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 12
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            echo json_encode(["success" => false, "message" => "Koneksi Wablas gagal: " . $err]);
            exit;
        }

        $resJson = json_decode($response, true);
        if ($resJson && isset($resJson['status']) && $resJson['status'] == 200) {
            echo json_encode([
                "success" => true,
                "message" => "Wablas Device Terhubung!",
                "device_info" => $resJson
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Wablas: " . ($resJson['message'] ?? 'Token tidak valid.')]);
        }
        exit;
    } else {
        echo json_encode(["success" => true, "message" => "Mode gateway kustom/simulasi aktif."]);
        exit;
    }
}

// -------------------------------------------------------------------------
// 4. ACTION: SEND - Kirim pesan WA via Gateway secara Otomatis
// -------------------------------------------------------------------------
if ($action === 'send') {
    $phone = trim($payload['phone'] ?? '');
    $message = trim($payload['message'] ?? '');
    $sales_id = intval($payload['sales_id'] ?? 0);
    $token = trim($payload['token'] ?? '');
    $provider = trim($payload['provider'] ?? '');

    if (empty($phone) || empty($message)) {
        echo json_encode(["success" => false, "message" => "Nomor telepon dan isi pesan wajib diisi."]);
        exit;
    }

    // Normalisasi nomor telepon format 62xxx
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    if (strpos($cleanPhone, '0') === 0) {
        $cleanPhone = '62' . substr($cleanPhone, 1);
    } elseif (strpos($cleanPhone, '8') === 0) {
        $cleanPhone = '62' . $cleanPhone;
    }

    // Jika token tidak disertakan langsung, cari di database berdasarkan sales_id
    if (empty($token) && $sales_id > 0) {
        $stmt = $conn->prepare("SELECT wa_gateway_token, wa_gateway_provider FROM sales_accounts WHERE id = ? LIMIT 1");
        if ($stmt) {
            $stmt->bind_param("i", $sales_id);
            $stmt->execute();
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $token = $row['wa_gateway_token'] ?? '';
                if (empty($provider)) {
                    $provider = $row['wa_gateway_provider'] ?? 'fonnte';
                }
            }
            $stmt->close();
        }
    }

    if (empty($provider)) {
        $provider = 'fonnte';
    }

    $waLink = "https://wa.me/" . $cleanPhone . "?text=" . urlencode($message);
    $isSuccess = false;
    $logStatus = 'failed';
    $gatewayResponse = '';

    // A. KIRIM VIA FONNTE
    if ($provider === 'fonnte' && !empty($token)) {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_POSTFIELDS => [
                'target' => $cleanPhone,
                'message' => $message,
                'countryCode' => '62'
            ],
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $token
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $gatewayResponse = $response ?: $err;
        $resJson = json_decode($response, true);

        if ($resJson && isset($resJson['status']) && $resJson['status'] === true) {
            $isSuccess = true;
            $logStatus = 'success';
            $returnMsg = "Pesan berhasil terkirim ke " . $cleanPhone;
        } else {
            $isSuccess = false;
            $logStatus = 'failed';
            $returnMsg = $resJson['reason'] ?? ($resJson['message'] ?? 'Gagal mengirim via Fonnte.');
        }
    }
    // B. KIRIM VIA WABLAS
    elseif ($provider === 'wablas' && !empty($token)) {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://phone.wablas.com/api/send-message',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_POSTFIELDS => http_build_query([
                'phone' => $cleanPhone,
                'message' => $message
            ]),
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $token,
                'Content-Type: application/x-www-form-urlencoded'
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $gatewayResponse = $response ?: $err;
        $resJson = json_decode($response, true);

        if ($resJson && isset($resJson['status']) && $resJson['status'] == 200) {
            $isSuccess = true;
            $logStatus = 'success';
            $returnMsg = "Pesan berhasil terkirim ke " . $cleanPhone;
        } else {
            $isSuccess = false;
            $logStatus = 'failed';
            $returnMsg = $resJson['message'] ?? 'Gagal mengirim via Wablas.';
        }
    }
    // C. MODE SIMULASI / TANPA TOKEN (FALLBACK AUTO-LOG)
    else {
        $isSuccess = true;
        $logStatus = 'simulated';
        $gatewayResponse = json_encode(["status" => "simulated", "info" => "No token provided, logged for manual wa.me link"]);
        $returnMsg = "Pesan tercatat & siap dibuka di WhatsApp.";
    }

    // Catat ke tabel_wa_logs
    $stmt = $conn->prepare("INSERT INTO tabel_wa_logs (sales_id, phone, message, provider, status, gateway_response) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("isssss", $sales_id, $cleanPhone, $message, $provider, $logStatus, $gatewayResponse);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode([
        "success" => $isSuccess,
        "status" => $logStatus,
        "message" => $returnMsg,
        "phone" => $cleanPhone,
        "wa_link" => $waLink,
        "provider" => $provider,
        "raw_response" => $gatewayResponse
    ]);
    exit;
}

// Status check default
echo json_encode([
    "success" => true,
    "service" => "Sales Force Toyota WhatsApp Gateway API Engine",
    "timestamp" => date("Y-m-d H:i:s")
]);
$conn->close();
?>
