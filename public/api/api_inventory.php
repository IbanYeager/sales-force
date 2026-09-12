<?php
// api_inventory.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require 'koneksi.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Auto-create tabel_inventory_hold jika belum ada
if ($conn) {
    @$conn->query("CREATE TABLE IF NOT EXISTS tabel_inventory_hold (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chassis_no VARCHAR(100) NOT NULL,
        product_description VARCHAR(255) NULL,
        sales_name VARCHAR(100) NOT NULL,
        sales_phone VARCHAR(50) NULL,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(50) NULL,
        tanda_jadi DECIMAL(15,2) DEFAULT 0,
        tipe_pembelian VARCHAR(50) DEFAULT 'Kredit',
        hold_duration_minutes INT DEFAULT 120,
        status ENUM('HOLD', 'SPK_SUBMITTED', 'RELEASED', 'EXPIRED') DEFAULT 'HOLD',
        held_at DATETIME NOT NULL,
        expires_at DATETIME NOT NULL,
        notes TEXT NULL,
        INDEX (chassis_no),
        INDEX (status),
        INDEX (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Otomatis update status hold yang sudah kadaluarsa
    @$conn->query("UPDATE tabel_inventory_hold SET status = 'EXPIRED' WHERE status = 'HOLD' AND expires_at <= NOW()");
}

// ── ACTION: HOLD UNIT ────────────────────────────────────────────────────────
if ($action === 'hold_unit') {
    $rawInput = file_get_contents('php://input');
    $postData = json_decode($rawInput, true) ?: $_POST;

    $chassis = trim($postData['chassis_no'] ?? '');
    $productDesc = trim($postData['product_description'] ?? '');
    $salesName = trim($postData['sales_name'] ?? 'Sales');
    $salesPhone = trim($postData['sales_phone'] ?? '');
    $custName = trim($postData['customer_name'] ?? '');
    $custPhone = trim($postData['customer_phone'] ?? '');
    $tandaJadi = floatval(preg_replace('/[^\d]/', '', $postData['tanda_jadi'] ?? '0'));
    $tipeBeli = trim($postData['tipe_pembelian'] ?? 'Kredit');
    $duration = intval($postData['duration_minutes'] ?? 120);
    if ($duration <= 0 || $duration > 1440) $duration = 120; // Default 2 jam

    if (empty($chassis) || empty($custName)) {
        echo json_encode([
            "status" => "error",
            "message" => "Nomor rangka/chassis dan nama customer wajib diisi."
        ]);
        exit;
    }

    if (!$conn) {
        echo json_encode(["status" => "error", "message" => "Koneksi database offline"]);
        exit;
    }

    // Periksa apakah unit ini sedang di-hold aktif oleh sales lain
    $chkStmt = $conn->prepare("SELECT * FROM tabel_inventory_hold WHERE chassis_no = ? AND status = 'HOLD' AND expires_at > NOW() LIMIT 1");
    $chkStmt->bind_param("s", $chassis);
    $chkStmt->execute();
    $existing = $chkStmt->get_result()->fetch_assoc();

    if ($existing) {
        $expTime = date('H:i', strtotime($existing['expires_at']));
        echo json_encode([
            "status" => "error",
            "message" => "Unit ({$chassis}) sedang di-HOLD oleh {$existing['sales_name']} untuk customer {$existing['customer_name']} hingga pukul {$expTime} WIB."
        ]);
        exit;
    }

    $heldAt = date('Y-m-d H:i:s');
    $expiresAt = date('Y-m-d H:i:s', strtotime("+{$duration} minutes"));

    $insStmt = $conn->prepare("INSERT INTO tabel_inventory_hold (chassis_no, product_description, sales_name, sales_phone, customer_name, customer_phone, tanda_jadi, tipe_pembelian, hold_duration_minutes, status, held_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'HOLD', ?, ?)");
    $insStmt->bind_param("ssssssdssss", $chassis, $productDesc, $salesName, $salesPhone, $custName, $custPhone, $tandaJadi, $tipeBeli, $duration, $heldAt, $expiresAt);

    if ($insStmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Unit {$chassis} berhasil di-HOLD selama {$duration} menit untuk {$custName}.",
            "data" => [
                "hold_id" => $conn->insert_id,
                "chassis_no" => $chassis,
                "sales_name" => $salesName,
                "customer_name" => $custName,
                "held_at" => $heldAt,
                "expires_at" => $expiresAt,
                "remaining_seconds" => $duration * 60
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mengunci unit: " . $conn->error]);
    }
    exit;
}

// ── ACTION: RELEASE HOLD ─────────────────────────────────────────────────────
if ($action === 'release_hold') {
    $rawInput = file_get_contents('php://input');
    $postData = json_decode($rawInput, true) ?: $_POST;

    $chassis = trim($postData['chassis_no'] ?? '');
    $holdId = intval($postData['hold_id'] ?? 0);

    if (!$conn) {
        echo json_encode(["status" => "error", "message" => "Koneksi database offline"]);
        exit;
    }

    if ($holdId > 0) {
        $upd = $conn->query("UPDATE tabel_inventory_hold SET status = 'RELEASED' WHERE id = {$holdId}");
    } elseif (!empty($chassis)) {
        $escChassis = $conn->real_escape_string($chassis);
        $upd = $conn->query("UPDATE tabel_inventory_hold SET status = 'RELEASED' WHERE chassis_no = '{$escChassis}' AND status = 'HOLD'");
    } else {
        echo json_encode(["status" => "error", "message" => "Parameter hold_id atau chassis_no diperlukan."]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Status Hold berhasil dilepas. Unit kini kembali berstatus Ready Stock."
    ]);
    exit;
}

// ── ACTION: CONFIRM SPK HOLD ─────────────────────────────────────────────────
if ($action === 'confirm_spk_hold') {
    $rawInput = file_get_contents('php://input');
    $postData = json_decode($rawInput, true) ?: $_POST;
    $chassis = trim($postData['chassis_no'] ?? '');
    if (!$conn || empty($chassis)) {
        echo json_encode(["status" => "error", "message" => "Parameter tidak valid."]);
        exit;
    }
    $esc = $conn->real_escape_string($chassis);
    $conn->query("UPDATE tabel_inventory_hold SET status = 'SPK_SUBMITTED' WHERE chassis_no = '{$esc}' AND status = 'HOLD'");
    echo json_encode(["status" => "success", "message" => "Unit resmi dialokasikan ke SPK."]);
    exit;
}

// ── 0. Ambil status hold aktif saat ini ───────────────────────────────────────
$active_holds = [];
if ($conn) {
    $res_holds = $conn->query("SELECT * FROM tabel_inventory_hold WHERE status = 'HOLD' AND expires_at > NOW()");
    if ($res_holds) {
        while ($h = $res_holds->fetch_assoc()) {
            $remSeconds = max(0, strtotime($h['expires_at']) - time());
            $active_holds[$h['chassis_no']] = [
                'hold_id' => intval($h['id']),
                'sales_name' => $h['sales_name'],
                'customer_name' => $h['customer_name'],
                'customer_phone' => $h['customer_phone'],
                'tanda_jadi' => floatval($h['tanda_jadi']),
                'tipe_pembelian' => $h['tipe_pembelian'],
                'held_at' => $h['held_at'],
                'expires_at' => $h['expires_at'],
                'remaining_seconds' => $remSeconds
            ];
        }
    }
}

$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';

// 1. Ambil data penyesuaian stok dari tabel_inventory (dikelola SPV)
$spv_stocks = [];
if ($conn) {
    $res_spv = $conn->query("SELECT * FROM tabel_inventory");
    if ($res_spv) {
        while ($r = $res_spv->fetch_assoc()) {
            $key = strtolower(trim($r['model'] . ' ' . $r['varian']));
            $spv_stocks[$key] = [
                'stok' => intval($r['stok']),
                'status' => $r['status']
            ];
        }
    }
}

// 2. Ambil seluruh katalog dari stock_inventory_essential
$query_ess = "SELECT * FROM stock_inventory_essential WHERE 1=1";
if (!empty($search)) {
    $query_ess .= " AND (product_description LIKE '%$search%' OR product_code LIKE '%$search%' OR color_description LIKE '%$search%')";
}
$query_ess .= " ORDER BY product_description ASC";

$res_ess = $conn ? $conn->query($query_ess) : null;
$data = [];
$matched_spv_keys = [];

if ($res_ess) {
    while ($row = $res_ess->fetch_assoc()) {
        $desc = strtolower(trim($row['product_description'] . ' ' . $row['product_code']));
        
        $status_lower = strtolower(trim($row['availability_status'] ?? ''));
        $is_available = (stripos($status_lower, 'available') !== false || $status_lower === 'tersedia');
        $stok_val = $is_available ? 1 : 0;
        $status_val = $row['availability_status'];

        foreach ($spv_stocks as $spv_key => $spv_val) {
            if (stripos($desc, $spv_key) !== false || stripos($spv_key, strtolower(trim($row['product_description']))) !== false) {
                $stok_val = $spv_val['stok'];
                if ($stok_val <= 0) {
                    $status_val = 'Inden / Kosong';
                } else {
                    $status_val = $spv_val['status'] ? $spv_val['status'] : 'Tersedia';
                }
                $matched_spv_keys[] = $spv_key;
                break;
            }
        }

        // Periksa apakah unit ini sedang di-HOLD
        $chassisNo = $row['chassis_no'] ?? '';
        $isHeld = false;
        $holdInfo = null;
        if (!empty($chassisNo) && isset($active_holds[$chassisNo])) {
            $isHeld = true;
            $holdInfo = $active_holds[$chassisNo];
            $status_val = 'LOCKED / DITAHAN';
        }

        $row['stok'] = $stok_val;
        $row['stock'] = $stok_val;
        $row['availability_status'] = $status_val;
        $row['is_held'] = $isHeld;
        $row['hold_info'] = $holdInfo;
        $data[] = $row;
    }
}

// 3. Sertakan unit dari tabel_inventory yang belum ada di katalog utama
if (isset($res_spv) && $res_spv) {
    $res_spv->data_seek(0);
    while ($r = $res_spv->fetch_assoc()) {
        $key = strtolower(trim($r['model'] . ' ' . $r['varian']));
        if (!in_array($key, $matched_spv_keys)) {
            $stok_val = intval($r['stok']);
            $chassisGenerated = 'INV-' . str_pad($r['id'], 4, '0', STR_PAD_LEFT);
            $isHeld = false;
            $holdInfo = null;
            $status_val = ($stok_val <= 0) ? 'Inden / Kosong' : ($r['status'] ? $r['status'] : 'Tersedia');

            if (isset($active_holds[$chassisGenerated])) {
                $isHeld = true;
                $holdInfo = $active_holds[$chassisGenerated];
                $status_val = 'LOCKED / DITAHAN';
            }

            $data[] = [
                'id' => $r['id'],
                'product_description' => $r['model'] . ' ' . $r['varian'],
                'product_code' => $r['varian'],
                'color_description' => $r['warna'],
                'stok' => $stok_val,
                'stock' => $stok_val,
                'availability_status' => $status_val,
                'chassis_no' => $chassisGenerated,
                'site' => 'Tunas Kiara Condong',
                'warehouse' => 'Main Stock',
                'is_held' => $isHeld,
                'hold_info' => $holdInfo
            ];
        }
    }
}

echo json_encode([
    "status" => "success", 
    "data" => $data,
    "active_holds_count" => count($active_holds)
]);
if ($conn) $conn->close();
?>
