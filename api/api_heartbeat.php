<?php
// api/api_heartbeat.php
// Real-time Presence Engine for Sales & SPVs with Built-in Sentinel Auto-Dispatcher Fallback
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
    if ($diff < 3600) return floor($diff / 60) . " mnt lalu";
    if ($diff < 86400) return "Hari ini " . date('H:i', $time);
    if ($diff < 172800) return "Kemarin " . date('H:i', $time);
    return date('d M Y H:i', $time);
}

// Helper: Web-Cron Fallback untuk AI Sentinel jika waktu jadwal tiba
function checkAndTriggerSentinelWebCron($conn) {
    if (!$conn) return;
    $sentinel_check = $conn->query("SELECT id, schedule_time, auto_send_enabled, last_sent_at, last_sent_status FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
    if ($sentinel_check && $s_set = $sentinel_check->fetch_assoc()) {
        if (intval($s_set['auto_send_enabled']) === 1) {
            $sched_time = $s_set['schedule_time'] ?: '06:00';
            $now_time = date('H:i');
            $today_date = date('Y-m-d');
            $last_date = !empty($s_set['last_sent_at']) ? date('Y-m-d', strtotime($s_set['last_sent_at'])) : '';
            $already_sent = ($last_date === $today_date && $s_set['last_sent_status'] === 'Sent');

            // Jika sudah mencapai/melewati waktu jadwal hari ini dan belum terkirim sukses hari ini
            if (!$already_sent && $now_time >= $sched_time) {
                // Kunci lock atomik di database agar tidak dieksekusi dobel jika banyak user online
                $conn->query("UPDATE tabel_sentinel_settings SET last_sent_status = 'In Progress', last_sent_at = NOW() 
                              WHERE id = 1 AND auto_send_enabled = 1 
                              AND (DATE(last_sent_at) != CURDATE() OR last_sent_at IS NULL OR last_sent_status != 'Sent')");
                if ($conn->affected_rows > 0) {
                    // Berhasil klaim lock! Trigger eksekusi di latar belakang tanpa memblokir request user
                    $cron_script = __DIR__ . '/api_cron_kacab_sentinel.php';
                    if (file_exists($cron_script)) {
                        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                            pclose(popen("start /B php \"$cron_script\" action=execute_cron > NUL 2>&1", "r"));
                        } else {
                            exec("php \"$cron_script\" action=execute_cron > /dev/null 2>&1 &");
                        }
                    }
                }
            }
        }
    }
}

$action = $_GET['action'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    if (!empty($data['action'])) {
        $action = $data['action'];
    }
}

$role = strtolower(trim($_GET['role'] ?? $data['role'] ?? 'sales'));
$id_user = intval($_GET['id_sales'] ?? $_GET['id_user'] ?? $data['id_sales'] ?? $data['id_user'] ?? 0);
$username = $conn->real_escape_string(trim($_GET['username'] ?? $data['username'] ?? ''));
$nama = $conn->real_escape_string(trim($_GET['nama'] ?? $data['nama'] ?? ''));

// ── 1. PING / HEARTBEAT KETIKA USER MEMBUKA WEB ──
if ($action === 'ping') {
    if (strpos($role, 'spv') !== false || strpos($role, 'supervisor') !== false) {
        // Heartbeat untuk SPV
        $where = $id_user > 0 ? "id = $id_user" : (!empty($username) ? "username = '$username'" : "nama_lengkap LIKE '%$nama%'");
        $conn->query("UPDATE spv_accounts SET last_active = NOW(), is_online = 1 WHERE $where");
        $conn->query("UPDATE spv_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
    } else {
        // Heartbeat untuk Sales
        $where = $id_user > 0 ? "id = $id_user" : (!empty($username) ? "username = '$username'" : "nama_lengkap = '$nama'");
        $conn->query("UPDATE sales_accounts SET last_active = NOW(), is_online = 1 WHERE $where");
        $conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
    }

    // Auto-check apakah ada jadwal Sentinel yang jatuh tempo
    checkAndTriggerSentinelWebCron($conn);

    echo json_encode([
        "status" => "success",
        "is_online" => true,
        "role" => $role,
        "timestamp" => date('Y-m-d H:i:s'),
        "message" => "Heartbeat recorded"
    ]);
    $conn->close();
    exit();
}

// ── 2. OFFLINE SIGNAL KETIKA USER LOGOUT / TUTUP TAB ──
if ($action === 'offline') {
    if (strpos($role, 'spv') !== false || strpos($role, 'supervisor') !== false) {
        $where = $id_user > 0 ? "id = $id_user" : (!empty($username) ? "username = '$username'" : "nama_lengkap LIKE '%$nama%'");
        $conn->query("UPDATE spv_accounts SET is_online = 0, last_active = DATE_SUB(NOW(), INTERVAL 3 MINUTE) WHERE $where");
    } else {
        $where = $id_user > 0 ? "id = $id_user" : (!empty($username) ? "username = '$username'" : "nama_lengkap = '$nama'");
        $conn->query("UPDATE sales_accounts SET is_online = 0, last_active = DATE_SUB(NOW(), INTERVAL 3 MINUTE) WHERE $where");
    }

    echo json_encode([
        "status" => "success",
        "is_online" => false,
        "message" => "User marked offline"
    ]);
    $conn->close();
    exit();
}

// ── 3. QUERY DAFTAR STATUS SPV & SALES UNTUK KACAB & SPV ──
// Auto-update thresholds
$conn->query("UPDATE sales_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
$conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE) OR last_active IS NULL");

$conn->query("UPDATE spv_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
$conn->query("UPDATE spv_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE) OR last_active IS NULL");

// Ambil SPVs
$spvQuery = $conn->query("SELECT id, username, nama_lengkap, foto, last_active, is_online FROM spv_accounts ORDER BY id ASC");
$spv_list = [];
$spv_online_count = 0;
$spv_offline_count = 0;

if ($spvQuery && $spvQuery->num_rows > 0) {
    while ($spvRow = $spvQuery->fetch_assoc()) {
        $isOn = intval($spvRow['is_online']) === 1;
        if ($isOn) $spv_online_count++;
        else $spv_offline_count++;

        $spvRow['is_online'] = $isOn;
        $spvRow['status_online'] = $isOn ? "Online" : "Offline";
        $spvRow['last_active_formatted'] = formatRelativeTime($spvRow['last_active']);
        $spv_list[] = $spvRow;
    }
}

// Ambil Sales
$spv = $conn->real_escape_string(trim($_GET['spv'] ?? ''));
$salesQuery = "SELECT id, username, nama_lengkap, tingkatan, foto, nama_spv, is_active, last_active, is_online FROM sales_accounts";
if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
    $spv_clean = str_replace('Pak ', '', $spv);
    $salesQuery .= " WHERE (nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%')";
}
$salesQuery .= " ORDER BY is_online DESC, id ASC";

$salesRes = $conn->query($salesQuery);
$sales_list = [];
$sales_online_count = 0;
$sales_offline_count = 0;

if ($salesRes && $salesRes->num_rows > 0) {
    while ($sRow = $salesRes->fetch_assoc()) {
        $isOn = intval($sRow['is_online']) === 1;
        if ($isOn) $sales_online_count++;
        else $sales_offline_count++;

        $f = trim($sRow['foto'] ?? '');
        if ($f !== '') {
            if (str_starts_with($f, 'http://') && !str_contains($f, 'localhost')) {
                $f = 'https://' . substr($f, 7);
            } elseif (str_starts_with($f, 'uploads/')) {
                $f = '/' . $f;
            }
        }
        $sRow['foto'] = $f;

        $sRow['is_online'] = $isOn;
        $sRow['status_online'] = $isOn ? "Online" : "Offline";
        $sRow['last_active_formatted'] = formatRelativeTime($sRow['last_active']);
        $sales_list[] = $sRow;
    }
}

// Auto-check apakah ada jadwal Sentinel yang jatuh tempo
checkAndTriggerSentinelWebCron($conn);

echo json_encode([
    "status" => "success",
    "spv" => [
        "total" => count($spv_list),
        "total_online" => $spv_online_count,
        "total_offline" => $spv_offline_count,
        "data" => $spv_list
    ],
    "sales" => [
        "total" => count($sales_list),
        "total_online" => $sales_online_count,
        "total_offline" => $sales_offline_count,
        "data" => $sales_list
    ]
]);

$conn->close();
?>
