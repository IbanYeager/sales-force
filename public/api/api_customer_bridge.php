<?php
// api_customer_bridge.php — Omnichannel Customer POV ↔ SFT Bridge Endpoint
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'koneksi.php';

// Auto-create tb_customer_bridge if not exists
if ($conn instanceof mysqli) {
    $createTableSql = "CREATE TABLE IF NOT EXISTS `tb_customer_bridge` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `request_type` VARCHAR(50) NOT NULL,
      `customer_name` VARCHAR(150) NOT NULL,
      `customer_phone` VARCHAR(30) NOT NULL,
      `customer_email` VARCHAR(150) DEFAULT '',
      `unit_model` VARCHAR(150) DEFAULT '',
      `details_json` TEXT,
      `sales_account_id` INT DEFAULT 1,
      `status` VARCHAR(50) DEFAULT 'Pending',
      `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    $conn->query($createTableSql);

    $createNotifSql = "CREATE TABLE IF NOT EXISTS `tabel_notifikasi` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `sales_account_id` INT DEFAULT 1,
      `title` VARCHAR(255) NOT NULL,
      `body` TEXT NOT NULL,
      `time_label` VARCHAR(50) DEFAULT 'Baru saja',
      `unread` TINYINT(1) DEFAULT 1,
      `status_icon` VARCHAR(100) DEFAULT 'fa-bell'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    $conn->query($createNotifSql);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'get_requests';
    $sales_id = isset($_GET['sales_account_id']) ? intval($_GET['sales_account_id']) : 1;

    if ($action === 'get_tracking') {
        $spk = $_GET['spk'] ?? '';
        $phone = $_GET['phone'] ?? '';

        if (!$spk && !$phone) {
            echo json_encode(["status" => "error", "message" => "Nomor SPK atau HP wajib diisi."]);
            exit;
        }

        $query = "SELECT * FROM tb_customer_bridge WHERE request_type = 'spk' AND (details_json LIKE ? OR customer_phone LIKE ?) ORDER BY id DESC LIMIT 1";
        $stmt = $conn->prepare($query);
        $searchSpk = "%$spk%";
        $searchPhone = "%$phone%";
        $stmt->bind_param("ss", $searchSpk, $searchPhone);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($row = $res->fetch_assoc()) {
            $details = json_decode($row['details_json'], true) ?: [];
            echo json_encode([
                "status" => "success",
                "data" => [
                    "id" => $row['id'],
                    "customer_name" => $row['customer_name'],
                    "customer_phone" => $row['customer_phone'],
                    "unit_model" => $row['unit_model'],
                    "spk_no" => $details['spk_no'] ?? 'SPK-' . str_pad($row['id'], 5, '0', STR_PAD_LEFT),
                    "color" => $details['color'] ?? 'Attitude Black',
                    "stage" => $details['stage'] ?? 'Alokasi Pabrik',
                    "stage_index" => intval($details['stage_index'] ?? 1),
                    "created_at" => $row['created_at']
                ]
            ]);
        } else {
            // Default mock tracking data for smooth demo
            echo json_encode([
                "status" => "success",
                "data" => [
                    "customer_name" => "Pak Budi Santoso",
                    "customer_phone" => "08123456789",
                    "unit_model" => "Innova Zenix 2.0 V HV Hybrid",
                    "spk_no" => $spk ?: "SPK-20260813",
                    "color" => "Attitude Black",
                    "stage" => "Proses PDI & Pasang Aksesoris",
                    "stage_index" => 3,
                    "created_at" => date('Y-m-d H:i:s')
                ]
            ]);
        }
        exit;
    }

    // Default: Get list of requests for Sales Dashboard
    $query = "SELECT * FROM tb_customer_bridge WHERE sales_account_id = ? ORDER BY id DESC LIMIT 30";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $sales_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $row['details'] = json_decode($row['details_json'], true) ?: [];
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
    exit;

} elseif ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $action = $payload['action'] ?? 'submit_request';

    $request_type   = $payload['request_type'] ?? 'general';
    $customer_name  = $payload['customer_name'] ?? 'Customer Tunas';
    $customer_phone = $payload['customer_phone'] ?? '081200001111';
    $customer_email = $payload['customer_email'] ?? '';
    $unit_model     = $payload['unit_model'] ?? 'Toyota Unit';
    $sales_id       = intval($payload['sales_account_id'] ?? 1);
    $details        = $payload['details'] ?? [];

    $details_json = json_encode($details);

    // Save to tb_customer_bridge
    $stmt = $conn->prepare("INSERT INTO tb_customer_bridge (request_type, customer_name, customer_phone, customer_email, unit_model, details_json, sales_account_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')");
    if ($stmt) {
        $stmt->bind_param("ssssssi", $request_type, $customer_name, $customer_phone, $customer_email, $unit_model, $details_json, $sales_id);
        $stmt->execute();
        $req_id = $stmt->insert_id;
        $stmt->close();

        // Title and Body per feature type
        $title = "🚨 Permintaan Customer Baru";
        $body  = "Customer $customer_name ($customer_phone) mengajukan $request_type untuk $unit_model.";
        $icon  = "fa-solid fa-bell";

        switch ($request_type) {
            case 'spk':
                $title = "📝 Draf SPK & Booking Fee Baru";
                $body  = "Pak/Bu $customer_name mengajukan SPK unit $unit_model. Silakan verifikasi berkas & bayar booking fee.";
                $icon  = "fa-solid fa-file-contract";
                break;
            case 'tradein':
                $title = "🚗 Permintaan Appraisal Trade-In";
                $body  = "Pak/Bu $customer_name mengajukan appraisal mobil lama (" . ($details['old_car'] ?? 'Mobil Lama') . ") untuk tukar tambah ke $unit_model.";
                $icon  = "fa-solid fa-right-left";
                break;
            case 'configurator':
                $title = "🎨 Draf Racikan Aksesoris Customer";
                $body  = "Pak/Bu $customer_name meracik aksesoris untuk $unit_model. Siap di-generate ke Smart Quotation.";
                $icon  = "fa-solid fa-sliders";
                break;
            case 'document':
                $title = "📄 Upload Berkas Kredit Digital";
                $body  = "Pak/Bu $customer_name mengunggah berkas syarat kredit (KTP/KK/NPWP). Verifikasi untuk diajukan ke Leasing.";
                $icon  = "fa-solid fa-folder-open";
                break;
            case 'hold_stock':
                $title = "🚨 Penahanan Unit Ready Stock (24 Jam)";
                $body  = "Pak/Bu $customer_name meminta penahanan 24 jam untuk unit ready $unit_model. Ajukan approval ke SPV.";
                $icon  = "fa-solid fa-hand-holding-hand";
                break;
            case 'matchmaker':
                $title = "💡 Rekomendasi Matchmaker Mobil";
                $body  = "Pak/Bu $customer_name mengisi kuis budget & gaya hidup. Rekomendasi: $unit_model.";
                $icon  = "fa-solid fa-wand-magic-sparkles";
                break;
            case 'promo_claim':
                $title = "🎟️ Klaim Voucher Promo / Merchandise";
                $body  = "Pak/Bu $customer_name mengklaim voucher promo / reservasi merchandise untuk $unit_model.";
                $icon  = "fa-solid fa-ticket";
                break;
        }

        // Insert notification into tabel_notifikasi
        $notifStmt = $conn->prepare("INSERT INTO tabel_notifikasi (sales_account_id, title, body, time_label, unread, status_icon) VALUES (?, ?, ?, 'Baru saja', 1, ?)");
        if ($notifStmt) {
            $notifStmt->bind_param("isss", $sales_id, $title, $body, $icon);
            $notifStmt->execute();
            $notifStmt->close();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Permintaan Anda berhasil dikirim ke Sales Consultant Tunas Toyota!",
            "request_id" => $req_id
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyajikan data: " . $conn->error]);
    }
}
$conn->close();
?>
