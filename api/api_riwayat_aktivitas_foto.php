<?php
// api_riwayat_aktivitas_foto.php
// Endpoint untuk mengambil riwayat foto kegiatan KHUSUS Pameran & Event

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

/**
 * Filter ketat: HANYA aktivitas Pameran dan Event yang diizinkan masuk galeri.
 * Aktivitas seperti Live TikTok, Follow Up Database, dsb DITOLAK.
 */
function isPameranOrEvent($tipe, $keterangan = '') {
    $t = strtolower(trim($tipe ?? ''));
    $k = strtolower(trim($keterangan ?? ''));

    // Pengecualian tegas untuk jenis aktivitas non-pameran / non-event
    if (strpos($t, 'tiktok') !== false || (strpos($t, 'live') !== false && strpos($t, 'event') === false)) {
        return false;
    }
    if (strpos($t, 'database') !== false || (strpos($t, 'db') !== false && strpos($t, 'borma') === false)) {
        return false;
    }
    if (strpos($t, 'digital marketing') !== false || strpos($t, 'walk in') !== false || strpos($t, 'call in') !== false) {
        return false;
    }
    if (strpos($t, 'residensial') !== false || strpos($t, 'foa') !== false) {
        return false;
    }
    if (strpos($t, 'referensi') !== false || strpos($t, 'repeat order') !== false) {
        return false;
    }
    if (strpos($t, 'fleet') !== false || strpos($t, 'corporate') !== false) {
        return false;
    }
    if (strpos($t, 'meeting') !== false || strpos($t, 'briefing') !== false || strpos($t, 'makan') !== false || strpos($t, 'kebersamaan') !== false || strpos($t, 'vip') !== false) {
        return false;
    }

    // Keyword pencocokan Pameran & Event
    $allowedKeywords = [
        'pameran',
        'event',
        'gathering',
        'customer gathering',
        'booth',
        'exhibition',
        'mall',
        'borma',
        'kings',
        'cimall'
    ];

    foreach ($allowedKeywords as $kw) {
        if (strpos($t, $kw) !== false || strpos($k, $kw) !== false) {
            return true;
        }
    }

    return false;
}

// Tentukan root path proyek secara presisi (baik dipanggil dari /api atau /public/api)
$projectRoot = dirname(__DIR__);
if (file_exists(dirname(dirname(__DIR__)) . '/artisan')) {
    $projectRoot = dirname(dirname(__DIR__));
} else if (file_exists(dirname(__DIR__) . '/artisan')) {
    $projectRoot = dirname(__DIR__);
}

function resolvePhotoFile($fName, $projectRoot) {
    $searchPaths = [
        ['dir' => $projectRoot . '/uploads/lokasi/', 'rel' => 'uploads/lokasi/'],
        ['dir' => $projectRoot . '/public/uploads/lokasi/', 'rel' => 'uploads/lokasi/'],
        ['dir' => $projectRoot . '/aktivitas/', 'rel' => 'aktivitas/'],
        ['dir' => $projectRoot . '/public/aktivitas/', 'rel' => 'aktivitas/'],
        ['dir' => $projectRoot . '/uploads/', 'rel' => 'uploads/'],
        ['dir' => $projectRoot . '/public/uploads/', 'rel' => 'uploads/']
    ];

    foreach ($searchPaths as $sp) {
        $full = $sp['dir'] . $fName;
        if (file_exists($full) && !is_dir($full)) {
            return [
                'full' => $full,
                'rel' => $sp['rel'] . rawurlencode($fName),
                'size' => filesize($full),
                'mtime' => filemtime($full)
            ];
        }
    }
    return null;
}

$photos = [];
$dateCounts = [];
$sessionCounts = ['Pagi' => 0, 'Siang' => 0, 'Sore' => 0, 'Malam' => 0];
$seenFiles = [];

// 1. Ambil data dari database aktivitas yang terverifikasi Pameran & Event
if ($conn) {
    $resDb = $conn->query("SELECT id, sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, created_at FROM aktivitas WHERE foto IS NOT NULL AND foto != '' ORDER BY created_at DESC, id DESC");
    if ($resDb) {
        while ($row = $resDb->fetch_assoc()) {
            $tipeAktivitas = $row['tipe_aktivitas'] ?? '';
            $keterangan = $row['keterangan'] ?? '';

            // Filter: Hanya izinkan Pameran & Event
            if (!isPameranOrEvent($tipeAktivitas, $keterangan)) {
                continue;
            }

            $fotoField = $row['foto'];
            $fileList = array_map('trim', explode(',', $fotoField));

            foreach ($fileList as $fotoItem) {
                if (empty($fotoItem)) continue;
                $fName = basename($fotoItem);
                if (isset($seenFiles[$fName])) continue;

                $fileInfo = resolvePhotoFile($fName, $projectRoot);
                if (!$fileInfo) {
                    // File fisik tidak ditemukan di disk, lewati agar galeri tidak menampilkan gambar rusak
                    continue;
                }

                $fileRelUrl = $fileInfo['rel'];
                $fileSizeBytes = $fileInfo['size'];
                $mtime = $fileInfo['mtime'];

                $dateStr = '';
                $timeStr = '';
                $timestamp = 0;

                if (!empty($row['created_at'])) {
                    $dbTime = strtotime($row['created_at']);
                    if ($dbTime) {
                        $dateStr = date('Y-m-d', $dbTime);
                        $timeStr = date('H:i:s', $dbTime);
                        $timestamp = $dbTime;
                    }
                }

                if (!$timestamp) {
                    $timestamp = $mtime ?: time();
                    $dateStr = date('Y-m-d', $timestamp);
                    $timeStr = date('H:i:s', $timestamp);
                }

                $session = $row['sesi_waktu'] ?: determineSession($timeStr);
                $dateFormatted = formatIndonesianDate($dateStr);

                $photos[] = [
                    'file_name' => $fName,
                    'file_url' => $fileRelUrl,
                    'nama_sales' => $row['nama_sales'] ?: 'Sales Consultant',
                    'keterangan' => $keterangan ?: 'Dokumentasi kegiatan Pameran & Event',
                    'tipe_aktivitas' => $tipeAktivitas ?: 'Pameran (Exhibition)',
                    'date' => $dateStr,
                    'date_formatted' => $dateFormatted,
                    'time' => substr($timeStr, 0, 5),
                    'time_full' => $timeStr . ' WIB',
                    'session' => $session,
                    'size_kb' => round($fileSizeBytes / 1024, 1),
                    'timestamp' => $timestamp
                ];

                $seenFiles[$fName] = true;
            }
        }
    }
}

// 2. Daftar arsip kegiatan Pameran & Event cabang dari folder aktivitas
// Masing-masing telah diverifikasi khusus kegiatan pameran mall, borma, & event outdoor
$pameranEventStaticMap = [
    'WhatsApp Image 2026-08-16 at 09.53.25.jpeg' => [
        'nama_sales' => 'Anugrah',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pameran Mall Mobil Listrik Toyota bZ4X & Hybrid di Mall Bandung'
    ],
    'WhatsApp Image 2026-08-16 at 06.35.27.jpeg' => [
        'nama_sales' => 'Egi',
        'tipe_aktivitas' => 'Customer Gathering & Event',
        'keterangan' => 'Open Booth & Tenda Event Semarak Kemerdekaan New Veloz Hybrid'
    ],
    'WhatsApp Image 2026-08-16 at 09.00.33.jpeg' => [
        'nama_sales' => 'Tim Sales Lapangan',
        'tipe_aktivitas' => 'Customer Gathering & Event',
        'keterangan' => 'Kegiatan Tim Pameran & Booth Lapangan Tunas Toyota'
    ],
    'WhatsApp Image 2026-08-16 at 09.25.08.jpeg' => [
        'nama_sales' => 'Erick Januar',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Interaksi konsumen & prospek booth pameran mobil Toyota'
    ],
    'WhatsApp Image 2026-08-14 at 09.57.01.jpeg' => [
        'nama_sales' => 'Rizal Tunas Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pameran Borma Margacinta Tunas Toyota'
    ],
    'WhatsApp Image 2026-08-14 at 10.38.16.jpeg' => [
        'nama_sales' => 'Luvita Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pameran & Booth Display Borma Margacinta'
    ],
    'WhatsApp Image 2026-08-14 at 11.00.21.jpeg' => [
        'nama_sales' => 'Egy',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Stand Pameran Mobil Toyota Borma Margacinta'
    ],
    'WhatsApp Image 2026-08-14 at 11.45.39.jpeg' => [
        'nama_sales' => 'Tim Sales Pameran',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pelayanan informasi produk di area Pameran Borma'
    ],
    'WhatsApp Image 2026-08-14 at 11.57.14.jpeg' => [
        'nama_sales' => 'Egi',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Dokumentasi booth pameran unit display Toyota'
    ],
    'WhatsApp Image 2026-08-14 at 12.35.50.jpeg' => [
        'nama_sales' => 'Achmad Safaat Gugum',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Briefing & prospek konsumen pameran Borma Margacinta'
    ],
    'WhatsApp Image 2026-08-14 at 16.00.32.jpeg' => [
        'nama_sales' => 'Rizal Tunas Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pameran sesi sore display unit Toyota'
    ],
    'WhatsApp Image 2026-08-14 at 16.00.33.jpeg' => [
        'nama_sales' => 'Rizky Tunas Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Penjagaan booth pameran & pembagian brosur Toyota'
    ],
    'WhatsApp Image 2026-08-14 at 16.03.23.jpeg' => [
        'nama_sales' => 'Dadan dr Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Konsultasi simulasi kredit konsumen di pameran'
    ],
    'WhatsApp Image 2026-08-14 at 22.01.13.jpeg' => [
        'nama_sales' => 'Rizky Tunas Toyota',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Closing booth pameran malam Borma Margacinta'
    ],
    'WhatsApp Image 2026-08-15 at 16.01.46.jpeg' => [
        'nama_sales' => 'Tim Sales Pameran',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Pameran hari ke-2 Borma Margacinta display unit'
    ],
    'IMG-20260728-WA0015.jpg' => [
        'nama_sales' => 'Deno',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Closing booth pameran Cimahi Mall (Cimall)'
    ],
    'IMG-20260627-WA0000.jpg' => [
        'nama_sales' => 'Sales Consultant',
        'tipe_aktivitas' => 'Pameran (Exhibition)',
        'keterangan' => 'Join pameran booth The Kings Shopping Centre'
    ]
];

// Sinkronisasi otomatis antara folder aktivitas/ dan public/aktivitas/
$rootAktivitasDir = $projectRoot . '/aktivitas';
$publicAktivitasDir = $projectRoot . '/public/aktivitas';

if (is_dir($rootAktivitasDir)) {
    if (!is_dir($publicAktivitasDir)) {
        @mkdir($publicAktivitasDir, 0777, true);
    }
    $rFiles = @scandir($rootAktivitasDir) ?: [];
    foreach ($rFiles as $rf) {
        if ($rf === '.' || $rf === '..') continue;
        $srcPath = $rootAktivitasDir . '/' . $rf;
        $destPath = $publicAktivitasDir . '/' . $rf;
        if (is_file($srcPath) && !file_exists($destPath)) {
            @copy($srcPath, $destPath);
        }
    }
}
if (is_dir($publicAktivitasDir)) {
    if (!is_dir($rootAktivitasDir)) {
        @mkdir($rootAktivitasDir, 0777, true);
    }
    $pFiles = @scandir($publicAktivitasDir) ?: [];
    foreach ($pFiles as $pf) {
        if ($pf === '.' || $pf === '..') continue;
        $srcPath = $publicAktivitasDir . '/' . $pf;
        $destPath = $rootAktivitasDir . '/' . $pf;
        if (is_file($srcPath) && !file_exists($destPath)) {
            @copy($srcPath, $destPath);
        }
    }
}

// 2. Scan SEMUA file foto dari folder aktivitas secara dinamis dan otomatis
$allAktivitasFiles = [];

// Dahulukan file yang sudah terdefinisi di static map agar deskripsinya terpakai
foreach (array_keys($pameranEventStaticMap) as $mappedFile) {
    $allAktivitasFiles[$mappedFile] = true;
}

// Pindai direktori aktivitas untuk mencari SEMUA foto yang ditambahkan
foreach ([$rootAktivitasDir, $publicAktivitasDir] as $scanDir) {
    if (is_dir($scanDir)) {
        $scanned = @scandir($scanDir) ?: [];
        foreach ($scanned as $sf) {
            if ($sf === '.' || $sf === '..') continue;
            $ext = strtolower(pathinfo($sf, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $allAktivitasFiles[$sf] = true;
            }
        }
    }
}

foreach (array_keys($allAktivitasFiles) as $f) {
    if (isset($seenFiles[$f])) continue;

    $fileInfo = resolvePhotoFile($f, $projectRoot);
    if (!$fileInfo) continue;

    $fileSize = $fileInfo['size'];
    $dateStr = '';
    $timeStr = '';
    $timestamp = 0;

    if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $f, $m)) {
        $dateStr = "{$m[1]}-{$m[2]}-{$m[3]}";
        $timeStr = "{$m[4]}:{$m[5]}:{$m[6]}";
        $timestamp = strtotime("$dateStr $timeStr");
    } else if (preg_match('/IMG-(\d{4})(\d{2})(\d{2})-WA/i', $f, $m)) {
        $dateStr = "{$m[1]}-{$m[2]}-{$m[3]}";
        $timeStr = "08:00:00";
        $timestamp = strtotime("$dateStr $timeStr");
    } else {
        $mtime = $fileInfo['mtime'];
        $dateStr = date('Y-m-d', $mtime);
        $timeStr = date('H:i:s', $mtime);
        $timestamp = $mtime;
    }

    $session = determineSession($timeStr);
    $dateFormatted = formatIndonesianDate($dateStr);

    $meta = $pameranEventStaticMap[$f] ?? null;
    $namaSales = $meta['nama_sales'] ?? 'Sales Lapangan';
    $tipeAktivitas = $meta['tipe_aktivitas'] ?? 'Pameran (Exhibition)';
    $keterangan = $meta['keterangan'] ?? ('Dokumentasi foto aktivitas pameran & event cabang (' . date('d/m/Y', $timestamp) . ')');

    $photos[] = [
        'file_name' => $f,
        'file_url' => $fileInfo['rel'],
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

    $seenFiles[$f] = true;
}

// Urutkan foto terbaru di atas
usort($photos, function ($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

// Hitung rekap tanggal & sesi khusus foto pameran & event
foreach ($photos as $p) {
    $d = $p['date'];
    if (!isset($dateCounts[$d])) {
        $dateCounts[$d] = [
            'date' => $d,
            'date_formatted' => $p['date_formatted'],
            'short_label' => date('d M Y', strtotime($d)),
            'count' => 0
        ];
    }
    $dateCounts[$d]['count']++;
    $sessionCounts[$p['session']]++;
}

krsort($dateCounts);

// Filter opsional via query parameters
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
               strpos(strtolower($p['tipe_aktivitas']), $searchLower) !== false ||
               strpos(strtolower($p['date_formatted']), $searchLower) !== false ||
               strpos(strtolower($p['time_full']), $searchLower) !== false ||
               strpos(strtolower($p['session']), $searchLower) !== false ||
               strpos(strtolower($p['file_name']), $searchLower) !== false;
    });
}

// Kelompokkan per tanggal
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
