<?php
// api_riwayat_aktivitas_foto.php
// Endpoint untuk mengambil riwayat foto kegiatan dari folder aktivitas/ dengan waktu presisi dari nama file

error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/koneksi.php';

function indonesianDayName($dateStr) {
    $days = [
        'Sunday' => 'Minggu',
        'Monday' => 'Senin',
        'Tuesday' => 'Selasa',
        'Wednesday' => 'Rabu',
        'Thursday' => 'Kamis',
        'Friday' => 'Jumat',
        'Saturday' => 'Sabtu'
    ];
    $day = date('l', strtotime($dateStr));
    return $days[$day] ?? $day;
}

function indonesianMonthName($m) {
    $months = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];
    return $months[intval($m)] ?? $m;
}

function formatIndonesianDate($dateStr) {
    $ts = strtotime($dateStr);
    if (!$ts) return $dateStr;
    $dayName = indonesianDayName($dateStr);
    $d = date('j', $ts);
    $m = indonesianMonthName(date('n', $ts));
    $y = date('Y', $ts);
    return "$dayName, $d $m $y";
}

function determineSession($timeStr) {
    $hour = intval(substr($timeStr, 0, 2));
    if ($hour >= 5 && $hour < 12) return 'Pagi';
    if ($hour >= 12 && $hour < 15) return 'Siang';
    if ($hour >= 15 && $hour < 18) return 'Sore';
    return 'Malam';
}

$dir = dirname(__DIR__) . '/aktivitas';
$photos = [];
$dateCounts = [];
$sessionCounts = ['Pagi' => 0, 'Siang' => 0, 'Sore' => 0, 'Malam' => 0];

// Load all DB records to match sales name & caption
$dbMap = [];
if ($conn) {
    $resDb = $conn->query("SELECT id, sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, created_at FROM aktivitas");
    if ($resDb) {
        while ($row = $resDb->fetch_assoc()) {
            $base = basename($row['foto']);
            $dbMap[$base] = $row;
        }
    }
}

if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

        $filePath = $dir . '/' . $f;
        $fileSize = filesize($filePath);

        $namaSales = 'Egy';
        $keterangan = 'Dokumentasi kegiatan sales lapangan';
        $tipeAktivitas = 'Canvassing Lapangan';

        if (isset($dbMap[$f])) {
            $db = $dbMap[$f];
            if (!empty($db['nama_sales'])) $namaSales = $db['nama_sales'];
            if (!empty($db['keterangan'])) $keterangan = $db['keterangan'];
            if (!empty($db['tipe_aktivitas'])) $tipeAktivitas = $db['tipe_aktivitas'];
        }

        $dateStr = '';
        $timeStr = '';
        $timestamp = 0;

        // 1. Prioritize timestamp from WhatsApp Image filename directly: WhatsApp Image YYYY-MM-DD at HH.MM.SS
        if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $f, $m)) {
            $dateStr = "{$m[1]}-{$m[2]}-{$m[3]}";
            $timeStr = "{$m[4]}:{$m[5]}:{$m[6]}";
            $timestamp = strtotime("$dateStr $timeStr");
        } else if (isset($dbMap[$f]) && !empty($dbMap[$f]['created_at'])) {
            $dbTime = strtotime($dbMap[$f]['created_at']);
            if ($dbTime) {
                $dateStr = date('Y-m-d', $dbTime);
                $timeStr = date('H:i:s', $dbTime);
                $timestamp = $dbTime;
            }
        } else if (preg_match('/IMG-(\d{4})(\d{2})(\d{2})-WA/i', $f, $m)) {
            $dateStr = "{$m[1]}-{$m[2]}-{$m[3]}";
            $timeStr = "08:00:00";
            $timestamp = strtotime("$dateStr $timeStr");
        } else {
            $mtime = filemtime($filePath);
            $dateStr = date('Y-m-d', $mtime);
            $timeStr = date('H:i:s', $mtime);
            $timestamp = $mtime;
        }

        $session = determineSession($timeStr);
        $dateFormatted = formatIndonesianDate($dateStr);

        $photos[] = [
            'file_name' => $f,
            'file_url' => 'aktivitas/' . rawurlencode($f),
            'nama_sales' => $namaSales,
            'keterangan' => $keterangan,
            'tipe_aktivitas' => $tipeAktivitas,
            'date' => $dateStr,
            'date_formatted' => $dateFormatted,
            'time' => substr($timeStr, 0, 5),
            'time_full' => $timeStr . ' WIB',
            'session' => $session,
            'size_kb' => round($fileSize / 1024, 1),
            'timestamp' => $timestamp
        ];

        // Track counts
        if (!isset($dateCounts[$dateStr])) {
            $dateCounts[$dateStr] = [
                'date' => $dateStr,
                'date_formatted' => $dateFormatted,
                'short_label' => date('d M Y', strtotime($dateStr)),
                'count' => 0
            ];
        }
        $dateCounts[$dateStr]['count']++;
        $sessionCounts[$session]++;
    }
}

// Sort photos newest first
usort($photos, function ($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

// Sort date options newest first
krsort($dateCounts);

// Filter by query parameters
$filterDate = $_GET['date'] ?? 'all';
$filterSession = $_GET['session'] ?? 'all';
$search = trim($_GET['search'] ?? '');

$filtered = $photos;

if ($filterDate !== 'all' && !empty($filterDate)) {
    $filtered = array_filter($filtered, function ($p) use ($filterDate) {
        return $p['date'] === $filterDate;
    });
}

if ($filterSession !== 'all' && !empty($filterSession)) {
    $filtered = array_filter($filtered, function ($p) use ($filterSession) {
        return $p['session'] === $filterSession;
    });
}

if (!empty($search)) {
    $searchLower = strtolower($search);
    $filtered = array_filter($filtered, function ($p) use ($searchLower) {
        return strpos(strtolower($p['nama_sales']), $searchLower) !== false ||
               strpos(strtolower($p['keterangan']), $searchLower) !== false ||
               strpos(strtolower($p['date_formatted']), $searchLower) !== false ||
               strpos(strtolower($p['time_full']), $searchLower) !== false ||
               strpos(strtolower($p['session']), $searchLower) !== false ||
               strpos(strtolower($p['file_name']), $searchLower) !== false;
    });
}

// Group by Date for timeline view
$groupedByDate = [];
foreach ($filtered as $p) {
    $d = $p['date'];
    if (!isset($groupedByDate[$d])) {
        $groupedByDate[$d] = [
            'date' => $d,
            'date_formatted' => $p['date_formatted'],
            'total_photos' => 0,
            'photos' => []
        ];
    }
    $groupedByDate[$d]['photos'][] = $p;
    $groupedByDate[$d]['total_photos']++;
}

echo json_encode([
    'status' => 'success',
    'total_all' => count($photos),
    'total_filtered' => count($filtered),
    'date_options' => array_values($dateCounts),
    'session_counts' => $sessionCounts,
    'photos' => array_values($filtered),
    'grouped_by_date' => array_values($groupedByDate)
]);
?>
