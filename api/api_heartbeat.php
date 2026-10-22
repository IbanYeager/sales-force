<?php
// api/api_heartbeat.php
// Real-time Presence Engine for Sales & SPVs with Built-in Sentinel Auto-Dispatcher Fallback
error_reporting(0);
ini_set('display_errors', 0);
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Support being loaded from public/api or root api directory
if (file_exists(__DIR__ . '/koneksi.php')) {
    require_once __DIR__ . '/koneksi.php';
} elseif (file_exists(dirname(__DIR__) . '/public/api/koneksi.php')) {
    require_once dirname(__DIR__) . '/public/api/koneksi.php';
} elseif (file_exists(dirname(__DIR__) . '/api/koneksi.php')) {
    require_once dirname(__DIR__) . '/api/koneksi.php';
}

if (!$conn || $conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection error"]);
    exit();
}

// Helper: Format waktu relatif (WIB)
function formatRelativeTime($datetimeStr) {
    if (!$datetimeStr) return "Belum pernah aktif";
    $time = strtotime($datetimeStr);
    $diff = time() - $time;

    if ($diff < 900) return "Online Sekarang";
    if ($diff < 3600) return floor($diff / 60) . " mnt lalu";
    if ($diff < 86400) return "Hari ini " . date('H:i', $time);
    if ($diff < 172800) return "Kemarin " . date('H:i', $time);
    return date('d M Y H:i', $time);
}

// Helper: Web-Cron Fallback untuk AI Sentinel jika waktu jadwal tiba (3 Sesi: Pagi, Siang, Sore)
function checkAndTriggerSentinelWebCron($conn) {
    if (!$conn) return;
    try {
        $sentinel_check = @$conn->query("SELECT id, schedule_time_pagi, schedule_time_siang, schedule_time_sore, auto_send_enabled, last_sent_at, last_sent_status FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
        if ($sentinel_check && $s_set = $sentinel_check->fetch_assoc()) {
            if (intval($s_set['auto_send_enabled']) === 1) {
                $now_time = date('H:i');
                $today_date = date('Y-m-d');

                $sessions_config = [
                    'pagi' => !empty($s_set['schedule_time_pagi']) ? $s_set['schedule_time_pagi'] : '07:00',
                    'siang' => !empty($s_set['schedule_time_siang']) ? $s_set['schedule_time_siang'] : '12:00',
                    'sore' => !empty($s_set['schedule_time_sore']) ? $s_set['schedule_time_sore'] : '17:00'
                ];

                foreach ($sessions_config as $sess => $sched_time) {
                    if ($now_time >= $sched_time) {
                        $chk_log = @$conn->query("SELECT id FROM tabel_ai_sentinel_logs WHERE periode_tanggal = '$today_date' AND session = '$sess' AND status = 'Sent' LIMIT 1");
                        if (!$chk_log || $chk_log->num_rows === 0) {
                            $cron_script = __DIR__ . '/api_cron_kacab_sentinel.php';
                            if (file_exists($cron_script)) {
                                if (function_exists('popen') && strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                                    @pclose(@popen("start /B php \"$cron_script\" action=execute_cron session=$sess > NUL 2>&1", "r"));
                                } elseif (function_exists('exec')) {
                                    @exec("php \"$cron_script\" action=execute_cron session=$sess > /dev/null 2>&1 &");
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    } catch (Throwable $e) {}
}

$action = $_GET['action'] ?? '';
$data = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    if (!empty($rawInput)) {
        $decoded = json_decode($rawInput, true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
    }
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
        $conds = [];
        if ($id_user > 0) $conds[] = "id = $id_user";
        if (!empty($username)) $conds[] = "username = '$username'";
        if (!empty($nama)) $conds[] = "nama_lengkap LIKE '%$nama%'";
        $where = !empty($conds) ? implode(" OR ", $conds) : "1=0";
        @$conn->query("UPDATE spv_accounts SET last_active = NOW(), is_online = 1 WHERE $where");
        @$conn->query("UPDATE spv_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 15 MINUTE) OR last_active IS NULL");
    } else {
        $conds = [];
        if ($id_user > 0) $conds[] = "id = $id_user";
        if (!empty($username)) $conds[] = "username = '$username'";
        if (!empty($nama)) $conds[] = "nama_lengkap LIKE '%$nama%'";
        $where = !empty($conds) ? implode(" OR ", $conds) : "1=0";
        @$conn->query("UPDATE sales_accounts SET last_active = NOW(), is_online = 1 WHERE $where");
        @$conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 15 MINUTE) OR last_active IS NULL");
    }

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
        $conds = [];
        if ($id_user > 0) $conds[] = "id = $id_user";
        if (!empty($username)) $conds[] = "username = '$username'";
        if (!empty($nama)) $conds[] = "nama_lengkap LIKE '%$nama%'";
        $where = !empty($conds) ? implode(" OR ", $conds) : "1=0";
        @$conn->query("UPDATE spv_accounts SET is_online = 0, last_active = DATE_SUB(NOW(), INTERVAL 20 MINUTE) WHERE $where");
    } else {
        $conds = [];
        if ($id_user > 0) $conds[] = "id = $id_user";
        if (!empty($username)) $conds[] = "username = '$username'";
        if (!empty($nama)) $conds[] = "nama_lengkap LIKE '%$nama%'";
        $where = !empty($conds) ? implode(" OR ", $conds) : "1=0";
        @$conn->query("UPDATE sales_accounts SET is_online = 0, last_active = DATE_SUB(NOW(), INTERVAL 20 MINUTE) WHERE $where");
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
@$conn->query("UPDATE sales_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
@$conn->query("UPDATE sales_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 15 MINUTE) OR last_active IS NULL");

@$conn->query("UPDATE spv_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
@$conn->query("UPDATE spv_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 15 MINUTE) OR last_active IS NULL");

$spvQuery = @$conn->query("SELECT id, username, nama_lengkap, foto, last_active, is_online FROM spv_accounts ORDER BY id ASC");
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

$spv = $conn->real_escape_string(trim($_GET['spv'] ?? ''));
$salesQuery = "SELECT id, username, nama_lengkap, tingkatan, foto, nama_spv, is_active, last_active, is_online FROM sales_accounts";
if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
    $spv_clean = str_replace('Pak ', '', $spv);
    $salesQuery .= " WHERE (nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%')";
}
$salesQuery .= " ORDER BY is_online DESC, id ASC";

$salesRes = @$conn->query($salesQuery);
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
            if (strpos($f, 'http://') === 0 && strpos($f, 'localhost') === false) {
                $f = 'https://' . substr($f, 7);
            } elseif (strpos($f, 'uploads/') === 0) {
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
