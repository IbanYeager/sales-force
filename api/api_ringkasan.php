<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require 'koneksi.php';

$raw_sales = isset($_GET['sales_account_id']) ? trim($_GET['sales_account_id']) : '';

$sales_id = 0;
if ($raw_sales !== '') {
    if (is_numeric($raw_sales)) {
        $sales_id = intval($raw_sales);
    } else {
        $u_esc = $conn->real_escape_string($raw_sales);
        $q_find = $conn->query("SELECT id FROM sales_accounts WHERE username = '$u_esc' OR nama_lengkap LIKE '%$u_esc%' LIMIT 1");
        if ($q_find && $q_find->num_rows > 0) {
            $r = $q_find->fetch_assoc();
            $sales_id = intval($r['id']);
        }
    }
}

$current_month = intval(date('n'));
$current_year = intval(date('Y'));

// Auto Sinkronisasi Real-Time dengan Google Spreadsheet (Throttled 15s)
if (function_exists('syncGoogleSheetsToDb') || file_exists(__DIR__ . '/api_sheets_sync.php')) {
    require_once __DIR__ . '/api_sheets_sync.php';
    if ($conn) {
        $q_chk = $conn->query("SELECT last_sync_at FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
        $should_sync = true;
        if ($q_chk && $c_row = $q_chk->fetch_assoc()) {
            $last_time = strtotime($c_row['last_sync_at'] ?? '2000-01-01');
            if (time() - $last_time < 15) {
                $should_sync = false;
            }
        }
        if ($should_sync) {
            syncGoogleSheetsToDb($conn, $current_month, $current_year);
        }
    }
}

// 1. Hitung Follow Up (hanya untuk sales yang bersangkutan)
$count_follow_up = 0;
if ($sales_id > 0) {
    $q_fu1 = $conn->query("SELECT COUNT(*) as c FROM aktivitas WHERE sales_account_id = $sales_id AND tipe_aktivitas LIKE '%Follow%'");
    if ($q_fu1 && $row = $q_fu1->fetch_assoc()) { $count_follow_up += intval($row['c']); }

    $q_fu2 = $conn->query("SELECT COUNT(*) as c FROM tabel_jadwal WHERE sales_account_id = $sales_id AND judul LIKE '%Follow%'");
    if ($q_fu2 && $row = $q_fu2->fetch_assoc()) { $count_follow_up += intval($row['c']); }
}

// 2. Hitung Test Drive (hanya untuk sales yang bersangkutan)
$count_test_drive = 0;
if ($sales_id > 0) {
    $q_td1 = $conn->query("SELECT COUNT(*) as c FROM aktivitas WHERE sales_account_id = $sales_id AND tipe_aktivitas LIKE '%Test Drive%'");
    if ($q_td1 && $row = $q_td1->fetch_assoc()) { $count_test_drive += intval($row['c']); }

    $q_td2 = $conn->query("SELECT COUNT(*) as c FROM tabel_test_drive_request WHERE sales_account_id = $sales_id");
    if ($q_td2 && $row = $q_td2->fetch_assoc()) { $count_test_drive += intval($row['c']); }
}

// 3. Hitung SPK khusus per akun sales (dari target_do_bulanan / tabel_spk sales)
$count_spk = 0;
if ($sales_id > 0) {
    $q_spk_tgt = $conn->query("SELECT realisasi_spk FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $current_month LIMIT 1");
    if ($q_spk_tgt && $row = $q_spk_tgt->fetch_assoc()) {
        $count_spk = intval($row['realisasi_spk']);
    }

    if ($count_spk == 0) {
        $q_spk_db = $conn->query("SELECT COUNT(*) as c FROM tabel_spk WHERE sales_account_id = $sales_id AND status != 'Ditolak'");
        if ($q_spk_db && $row = $q_spk_db->fetch_assoc()) {
            $count_spk = intval($row['c']);
        }
    }
}

// 4. Hitung Foto Aktivitas (hanya untuk sales yang bersangkutan)
$count_foto = 0;
if ($sales_id > 0) {
    $q_foto = $conn->query("SELECT COUNT(*) as c FROM aktivitas WHERE sales_account_id = $sales_id AND foto IS NOT NULL AND foto != ''");
    if ($q_foto && $row = $q_foto->fetch_assoc()) { $count_foto += intval($row['c']); }
}

echo json_encode([
    "status" => "success",
    "sales_account_id" => $sales_id,
    "data" => [
        "follow_up" => $count_follow_up,
        "test_drive" => $count_test_drive,
        "spk" => $count_spk,
        "foto_aktivitas" => $count_foto
    ]
]);

if ($conn) { $conn->close(); }
?>
