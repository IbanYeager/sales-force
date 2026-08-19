<?php
// api_analytics.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require 'koneksi.php';

$spv = isset($_GET['spv']) ? $_GET['spv'] : '';

// Base where clause for SPV filter
$where_spk = "";
$where_td = "";
if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
    $where_spk = "WHERE s.sales_account_id IN (SELECT id FROM sales_accounts WHERE nama_spv = '" . $conn->real_escape_string($spv) . "' OR nama_spv LIKE '%" . str_replace('Pak ', '', $conn->real_escape_string($spv)) . "%')";
}

// 1. SPK Status Summary
$spk_summary = [
    'Menunggu' => 0,
    'Disetujui' => 0,
    'DO' => 0,
    'Ditolak' => 0
];
$res = $conn->query("SELECT status, COUNT(id) as count FROM tabel_spk s $where_spk GROUP BY status");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $spk_summary[$row['status']] = (int)$row['count'];
    }
}

// 2. Top Models Sold (from DO)
$top_models = [];
$res = $conn->query("SELECT model, COUNT(id) as count FROM tabel_spk s " . ($where_spk ? $where_spk . " AND status='DO'" : "WHERE status='DO'") . " GROUP BY model ORDER BY count DESC LIMIT 5");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $top_models[$row['model']] = (int)$row['count'];
    }
}

echo json_encode([
    "status" => "success",
    "data" => [
        "spk_summary" => $spk_summary,
        "top_models" => $top_models
    ]
]);

$conn->close();
?>
