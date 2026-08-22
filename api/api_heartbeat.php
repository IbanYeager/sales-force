<?php
// api/api_heartbeat.php
// Real-time Sales Online Presence & Heartbeat Engine
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

if (!$conn || $conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection error"]);
    exit();
}

// Helper: Format waktu relatif (WIB)
function formatRelativeTime($datetimeStr) {
    if (!$datetimeStr) return "Belum pernah aktif";
    $time = strtotime($datetimeStr);
    $diff = time() - $time;

    if ($diff < 90) return "Online Sekarang";
    if ($diff < 3600) return floor($diff / 60) . " menit lalu";
    if ($diff < 86400) return "Hari ini " . date('H:i', $time);
    if ($diff < 172800) return "Kemarin " . date('H:i', $time);
    return date('d M Y H:i', $time);
}

$action = $_GET['action'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    if (!empty($data['action'])) {
        $action = $data['action'];
    }
}

// ── 1. PING / HEARTBEAT KETIKA SALES MEMBUKA & BERAKTIVITAS DI WEB ──
if ($action === 'ping') {
    $id_sales = intval($_GET['id_sales'] ?? $data['id_sales'] ?? 0);
    $username = $conn->real_escape_string(trim($_GET['username'] ?? $data['username'] ?? ''));

    if ($id_sales > 0 || !empty($username)) {
        $where = $id_sales > 0 ? "id = $id_sales" : "username = '$username'";
        $conn->query("UPDATE sales_accounts SET last_active = NOW(), is_online = 1 WHERE $where");
        
        // Auto-cleanup user yang sudah tidak aktif lebih dari 2 menit
        $conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE)");

        echo json_encode([
            "status" => "success",
            "is_online" => true,
            "timestamp" => date('Y-m-d H:i:s'),
            "message" => "Heartbeat recorded"
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid sales ID"]);
    }
    $conn->close();
    exit();
}

// ── 2. OFFLINE SIGNAL KETIKA SALES LOGOUT ATAU MENUTUP TAB ──
if ($action === 'offline') {
    $id_sales = intval($_GET['id_sales'] ?? $data['id_sales'] ?? 0);
    $username = $conn->real_escape_string(trim($_GET['username'] ?? $data['username'] ?? ''));

    if ($id_sales > 0 || !empty($username)) {
        $where = $id_sales > 0 ? "id = $id_sales" : "username = '$username'";
        $conn->query("UPDATE sales_accounts SET is_online = 0, last_active = DATE_SUB(NOW(), INTERVAL 3 MINUTE) WHERE $where");

        echo json_encode([
            "status" => "success",
            "is_online" => false,
            "message" => "User marked offline"
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid sales ID"]);
    }
    $conn->close();
    exit();
}

// ── 3. STATUS DAFTAR SALES ONLINE UNTUK SPV & KACAB ──
$spv = $conn->real_escape_string(trim($_GET['spv'] ?? ''));

// Update status online berdasarkan threshold 2 menit
$conn->query("UPDATE sales_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
$conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE) OR last_active IS NULL");

$query = "SELECT id, username, nama_lengkap, tingkatan, foto, nama_spv, status,
                 last_active, 
                 CASE 
                    WHEN last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) THEN 1 
                    ELSE 0 
                 END AS is_online
          FROM sales_accounts";

if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
    $spv_clean = str_replace('Pak ', '', $spv);
    $query .= " WHERE (nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%')";
}
$query .= " ORDER BY is_online DESC, id ASC";

$res = $conn->query($query);
$sales_list = [];
$total_online = 0;
$total_offline = 0;

if ($res && $res->num_rows > 0) {
    while ($r = $res->fetch_assoc()) {
        $online = intval($r['is_online']) === 1;
        if ($online) $total_online++;
        else $total_offline++;

        $r['is_online'] = $online;
        $r['status_label'] = $online ? "Online Sekarang" : "Offline";
        $r['last_active_formatted'] = formatRelativeTime($r['last_active']);
        $sales_list[] = $r;
    }
}

echo json_encode([
    "status" => "success",
    "total" => count($sales_list),
    "total_online" => $total_online,
    "total_offline" => $total_offline,
    "data" => $sales_list
]);

$conn->close();
?>
