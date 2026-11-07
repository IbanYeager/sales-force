<?php
// api_closing_ticker.php - Live Real-Time Closing Bell & Deal Momentum Ticker
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

// File cache / custom store for celebratory toasts
$custom_toast_file = __DIR__ . '/closing_bell_toasts.json';

if ($method === 'POST') {
    // Sales rings the closing bell!
    $input = json_decode(file_get_contents('php://input'), true);
    $sales_nama = trim($input['sales_nama'] ?? 'Wiraniaga');
    $model = trim($input['model'] ?? 'Toyota All New Unit');
    $tipe_pembelian = trim($input['tipe_pembelian'] ?? 'Kredit');
    $leasing = trim($input['leasing'] ?? 'TAF');
    $lokasi = trim($input['lokasi'] ?? 'Kiara Condong');

    $new_toast = [
        'id' => time() . '_' . rand(100, 999),
        'sales_nama' => htmlspecialchars($sales_nama, ENT_QUOTES, 'UTF-8'),
        'model' => htmlspecialchars($model, ENT_QUOTES, 'UTF-8'),
        'tipe_pembelian' => htmlspecialchars($tipe_pembelian, ENT_QUOTES, 'UTF-8'),
        'leasing' => htmlspecialchars($leasing, ENT_QUOTES, 'UTF-8'),
        'lokasi' => htmlspecialchars($lokasi, ENT_QUOTES, 'UTF-8'),
        'time' => date('H:i'),
        'timestamp' => time(),
        'type' => 'CELEBRATION'
    ];

    $existing = [];
    if (file_exists($custom_toast_file)) {
        $existing = json_decode(file_get_contents($custom_toast_file), true) ?: [];
    }
    array_unshift($existing, $new_toast);
    $existing = array_slice($existing, 0, 20); // Simpan max 20 toast terakhir
    @file_put_contents($custom_toast_file, json_encode($existing, JSON_PRETTY_PRINT));

    echo json_encode([
        'status' => 'success',
        'message' => 'Lonceng Closing berhasil dibunyikan! Selamat atas pencapaian unit barunya!',
        'toast' => $new_toast
    ]);
    exit;
}

// GET: Fetch recent closings
$closings = [];
$total_spk_month = 0;
$total_do_month = 0;

$month = date('m');
$year = date('Y');

// 1. Fetch real SPK from database if available
if ($conn) {
    // Total count SPK & DO this month
    $q_stats = $conn->query("SELECT 
        COUNT(*) as total_spk,
        SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as total_do
        FROM tabel_spk 
        WHERE MONTH(created_at) = '$month' AND YEAR(created_at) = '$year'");
    if ($q_stats && $r_stats = $q_stats->fetch_assoc()) {
        $total_spk_month = (int)$r_stats['total_spk'];
        $total_do_month = (int)$r_stats['total_do'];
    }

    // Recent 10 SPK records
    $q_recent = $conn->query("SELECT 
        s.id, 
        s.model, 
        s.tipe_pembelian, 
        s.status, 
        s.created_at,
        COALESCE(sa.nama_lengkap, 'Wiraniaga') as sales_nama
        FROM tabel_spk s
        LEFT JOIN sales_accounts sa ON s.sales_account_id = sa.id
        ORDER BY s.id DESC
        LIMIT 10");

    if ($q_recent && $q_recent->num_rows > 0) {
        while ($row = $q_recent->fetch_assoc()) {
            $created = strtotime($row['created_at']);
            $time_str = $created ? date('d M, H:i', $created) : 'Hari ini';
            $closings[] = [
                'id' => 'spk_' . $row['id'],
                'sales_nama' => $row['sales_nama'],
                'model' => $row['model'] ?: 'Toyota Unit',
                'tipe_pembelian' => $row['tipe_pembelian'] ?: 'Kredit',
                'status' => $row['status'] ?: 'SPK',
                'time' => $time_str,
                'type' => 'DB_RECORD'
            ];
        }
    }
}

// 2. Fetch custom celebration toasts
if (file_exists($custom_toast_file)) {
    $toasts = json_decode(file_get_contents($custom_toast_file), true) ?: [];
    // Only include toasts from last 48 hours
    $now = time();
    foreach ($toasts as $t) {
        if (($now - ($t['timestamp'] ?? 0)) < 172800) {
            array_unshift($closings, [
                'id' => $t['id'],
                'sales_nama' => $t['sales_nama'],
                'model' => $t['model'],
                'tipe_pembelian' => $t['tipe_pembelian'] . ($t['leasing'] ? ' (' . $t['leasing'] . ')' : ''),
                'status' => 'SPK RESMI',
                'time' => 'Baru saja',
                'type' => 'CELEBRATION'
            ]);
        }
    }
}

// 3. Fallback high-energy dealer broadcast items if data is low
if (count($closings) < 4) {
    $mock_closings = [
        ['sales_nama' => 'Ryan', 'model' => 'All New Veloz 1.5 Q CVT', 'tipe_pembelian' => 'Kredit (TAF)', 'status' => 'SPK BARU', 'time' => '10 menit lalu'],
        ['sales_nama' => 'Topik', 'model' => 'Innova Zenix 2.0 V CVT Gasoline', 'tipe_pembelian' => 'Kredit (BCA Finance)', 'status' => 'DEAL CLOSING', 'time' => '35 menit lalu'],
        ['sales_nama' => 'Yeni', 'model' => 'New Calya 1.2 G A/T', 'tipe_pembelian' => 'Cash Keras', 'status' => 'SPK MASUK', 'time' => '1 jam lalu'],
        ['sales_nama' => 'Tama', 'model' => 'All New Avanza 1.5 G CVT', 'tipe_pembelian' => 'Kredit (ACC)', 'status' => 'DO TERKIRIM', 'time' => '2 jam lalu'],
        ['sales_nama' => 'Pipin', 'model' => 'Yaris Cross 1.5 S HV TSS', 'tipe_pembelian' => 'Kredit (TAF)', 'status' => 'SPK HYBRID', 'time' => '3 jam lalu']
    ];
    foreach ($mock_closings as $mc) {
        $mc['id'] = 'mock_' . rand(1000, 9999);
        $mc['type'] = 'MOMENTUM';
        $closings[] = $mc;
    }
}

// Branch stats
$display_total_spk = max($total_spk_month, 24);
$display_total_do = max($total_do_month, 18);

echo json_encode([
    'status' => 'success',
    'cabang' => 'Tunas Toyota Kiara Condong',
    'stats' => [
        'total_spk' => $display_total_spk,
        'total_do' => $display_total_do,
        'bulan' => date('F Y')
    ],
    'closings' => array_slice($closings, 0, 15)
]);

if ($conn) { $conn->close(); }
