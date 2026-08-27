<?php
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/koneksi.php';

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'all';
$sales_input = isset($_GET['sales_account_id']) ? trim($_GET['sales_account_id']) : '';
$sales_input_esc = $conn->real_escape_string($sales_input);

$month = date('m');
$year = date('Y');
$current_month = intval(date('n'));

// Resolve SPV Name for current sales consultant
$spv_name = '';
if (!empty($sales_input_esc)) {
    $spv_query = $conn->query("SELECT nama_spv FROM sales_accounts WHERE id = '$sales_input_esc' OR username = '$sales_input_esc' OR nama_lengkap LIKE '%$sales_input_esc%' LIMIT 1");
    if ($spv_query && $row = $spv_query->fetch_assoc()) {
        $spv_name = trim($row['nama_spv']);
    }
}

$team_filter = "";
if ($mode === 'team') {
    if (!empty($spv_name)) {
        $cleanSpv = str_replace('Pak ', '', $spv_name);
        $cleanSpvEsc = $conn->real_escape_string($cleanSpv);
        $team_filter = "AND (sa.nama_spv = '" . $conn->real_escape_string($spv_name) . "' OR sa.nama_spv LIKE '%$cleanSpvEsc%')";
    }
}

// 1. Fetch Sales Accounts
$query = "SELECT sa.id, sa.nama_lengkap as nama, sa.tingkatan, sa.nama_spv 
          FROM sales_accounts sa 
          WHERE 1=1 $team_filter";

$result = $conn->query($query);
$data = [];

// 2. Fetch Saved DO from target_do_bulanan (manual DO entries)
$saved_do = [];
$q_saved = $conn->query("SELECT sales_account_id, realisasi_do, is_manual_do FROM target_do_bulanan WHERE periode_bulan = '$current_month' AND (periode_tahun = '$year' OR periode_tahun IS NULL OR periode_tahun = 0)");
if ($q_saved) {
    while($row = $q_saved->fetch_assoc()) {
        $saved_do[$row['sales_account_id']] = [
            'realisasi' => (int)$row['realisasi_do'],
            'is_manual' => (int)($row['is_manual_do'] ?? 0)
        ];
    }
}

// 3. Fetch Dynamic DO from tabel_spk
$dyn_do = [];
$q_dyn = $conn->query("SELECT sales_account_id, SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as real_do FROM tabel_spk WHERE MONTH(created_at) = '$month' AND YEAR(created_at) = '$year' GROUP BY sales_account_id");
if ($q_dyn) {
    while($row = $q_dyn->fetch_assoc()) {
        $dyn_do[$row['sales_account_id']] = (int)$row['real_do'];
    }
}

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $sid = $row['id'];
        $do_count = 0;
        
        if (isset($saved_do[$sid]) && $saved_do[$sid]['is_manual'] == 1) {
            $do_count = $saved_do[$sid]['realisasi'];
        } else {
            if (isset($dyn_do[$sid])) {
                $do_count = $dyn_do[$sid];
            } else if (isset($saved_do[$sid])) {
                $do_count = $saved_do[$sid]['realisasi'];
            }
        }
        
        $row['do_count'] = $do_count;
        
        $namaParts = explode(' ', trim($row['nama']));
        $avatar = '';
        if (count($namaParts) >= 2) {
            $avatar = strtoupper(substr($namaParts[0], 0, 1) . substr($namaParts[1], 0, 1));
        } elseif (count($namaParts) == 1 && strlen($namaParts[0]) > 0) {
            $avatar = strtoupper(substr($namaParts[0], 0, 2));
        } else {
            $avatar = 'SC';
        }
        $row['avatar'] = $avatar;
        $row['cabang'] = 'Tunas Toyota Kiara Condong';
        
        $data[] = $row;
    }
}

// Filter 0 DO if mode is 'all', but keep team members if mode is 'team'
if ($mode !== 'team') {
    $data = array_values(array_filter($data, function($item) {
        return $item['do_count'] > 0;
    }));
}

// Sort by DO Count DESC, then Name ASC
usort($data, function($a, $b) {
    if ($a['do_count'] == $b['do_count']) {
        return strcmp($a['nama'], $b['nama']);
    }
    return $b['do_count'] - $a['do_count'];
});

// Take top 3
$data = array_slice($data, 0, 3);

echo json_encode(["status" => "success", "mode" => $mode, "spv_name" => $spv_name, "data" => $data]);
if ($conn) { $conn->close(); }
