<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'koneksi.php';

function formatRelSpvTime($datetimeStr) {
    if (!$datetimeStr) return "Belum pernah aktif";
    $time = strtotime($datetimeStr);
    $diff = time() - $time;
    if ($diff < 90) return "Online Sekarang";
    if ($diff < 3600) return floor($diff / 60) . " mnt lalu";
    if ($diff < 86400) return "Hari ini " . date('H:i', $time);
    if ($diff < 172800) return "Kemarin " . date('H:i', $time);
    return date('d M Y H:i', $time);
}

// Update online threshold (2 minutes)
$conn->query("UPDATE spv_accounts SET is_online = 1 WHERE last_active >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)");
$conn->query("UPDATE spv_accounts SET is_online = 0 WHERE last_active < DATE_SUB(NOW(), INTERVAL 2 MINUTE) OR last_active IS NULL");

$spv_names = [];
$spv_details = [];
$total_online = 0;
$total_offline = 0;

// Ambil daftar SPV lengkap
$res1 = $conn->query("SELECT id, username, nama_lengkap, foto, last_active, is_online FROM spv_accounts ORDER BY id ASC");
if ($res1 && $res1->num_rows > 0) {
    while ($row = $res1->fetch_assoc()) {
        $isOn = intval($row['is_online']) === 1;
        if ($isOn) $total_online++;
        else $total_offline++;

        $row['is_online'] = $isOn;
        $row['status_online'] = $isOn ? "Online" : "Offline";
        $row['last_active_formatted'] = formatRelSpvTime($row['last_active']);

        $spv_names[] = $row['nama_lengkap'];
        $spv_details[] = $row;
    }
}

// Distinct nama_spv dari sales_accounts sebagai backup
$res2 = $conn->query("SELECT DISTINCT nama_spv FROM sales_accounts WHERE nama_spv IS NOT NULL AND nama_spv != ''");
if ($res2 && $res2->num_rows > 0) {
    while ($row = $res2->fetch_assoc()) {
        if (!in_array($row['nama_spv'], $spv_names)) {
            $spv_names[] = $row['nama_spv'];
            $spv_details[] = [
                'id' => 0,
                'username' => strtolower(str_replace(' ', '', $row['nama_spv'])),
                'nama_lengkap' => $row['nama_spv'],
                'foto' => '',
                'last_active' => null,
                'is_online' => false,
                'status_online' => 'Offline',
                'last_active_formatted' => 'Belum pernah aktif'
            ];
            $total_offline++;
        }
    }
}

echo json_encode([
    "ok" => true,
    "total" => count($spv_details),
    "total_online" => $total_online,
    "total_offline" => $total_offline,
    "data" => $spv_names,
    "details" => $spv_details
]);

$conn->close();
?>
