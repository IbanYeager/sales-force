<?php
// api/sync_chat_archive.php
// Script otomatis untuk membaca log chat WA dan menyinkronkan seluruh foto & nama sales ke tabel aktivitas

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/koneksi.php';

if (!$conn) {
    die("Koneksi database gagal.\n");
}

$chatFile = dirname(__DIR__) . '/Chat WhatsApp dengan TUNAS TOYOTA KIARA CONDONG DO 150.txt';
$dirAktivitas = dirname(__DIR__) . '/aktivitas';

function parseDateToMysql($dStr, $tStr) {
    $parts = explode('/', $dStr);
    if (count($parts) === 3) {
        $day = $parts[0];
        $month = $parts[1];
        $year = strlen($parts[2]) === 2 ? '20' . $parts[2] : $parts[2];
        $timeParts = explode('.', $tStr);
        $hour = $timeParts[0] ?? '00';
        $min = $timeParts[1] ?? '00';
        $sec = $timeParts[2] ?? '00';
        return "$year-$month-$day $hour:$min:$sec";
    }
    return date('Y-m-d H:i:s');
}

function getSessionFromHour($hour) {
    $h = intval($hour);
    if ($h >= 5 && $h < 12) return 'Pagi';
    if ($h >= 12 && $h < 15) return 'Siang';
    if ($h >= 15 && $h < 18) return 'Sore';
    return 'Malam';
}

$salesMap = [
    'Egy' => 10,
    'Bapak Dendi' => 1,
    'Renata Toyota' => 2,
    'Rizky Tunas Toyota' => 3,
    'Erick Januar' => 4,
    'Deno' => 5,
    'Rizal Tunas Toyota' => 6,
    'Juarna K Putra' => 7,
    'DADAN dr TOYOTA' => 8,
    'Luvita Toyota Bandung' => 9,
    'Erlanda Tubagus' => 11,
    'Wulan Wahono' => 12,
    'Rahma Tunas Toyota' => 13,
    'Indah Toyota Bandung' => 14,
    'Yeni Yeni' => 15,
    'Dery_toyotajawabarat' => 16,
    'Teh Fia' => 17,
    'SyafrilOfficial' => 18
];

$matched = [];
$current = null;

if (file_exists($chatFile)) {
    $lines = file($chatFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;

        if (preg_match('/^(\d{2}\/\d{2}\/\d{2})\s+(\d{2}\.\d{2})\s+-\s+([^:]+):\s*(.*)$/', $line, $m)) {
            $d = $m[1];
            $t = $m[2];
            $sender = trim($m[3]);
            $text = trim($m[4]);

            $current = [
                'date_str' => $d,
                'time_str' => $t,
                'sender' => $sender,
                'text' => $text,
                'caption' => ''
            ];

            if (preg_match('/(IMG-\d+-WA\d+\.jpe?g|STK-\d+-WA\d+\.webp|WhatsApp Image [^)]+\.jpe?g)/i', $text, $fm)) {
                $current['file'] = $fm[1];
                $matched[$fm[1]] = $current;
            }
        } else if ($current && !empty($line)) {
            if (preg_match('/(IMG-\d+-WA\d+\.jpe?g|STK-\d+-WA\d+\.webp|WhatsApp Image [^)]+\.jpe?g)/i', $line, $fm)) {
                if (!isset($current['file'])) {
                    $current['file'] = $fm[1];
                    $matched[$fm[1]] = $current;
                }
            } else {
                $current['caption'] .= ($current['caption'] ? ' ' : '') . $line;
            }
        }
    }
}

echo "Total foto terpetakan dari chat text: " . count($matched) . "\n";

$inserted = 0;
$updated = 0;

if (is_dir($dirAktivitas)) {
    $files = scandir($dirAktivitas);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

        $filePath = 'aktivitas/' . $f;

        if (isset($matched[$f])) {
            $item = $matched[$f];
            $senderName = $item['sender'];
            $salesId = $salesMap[$senderName] ?? 10;
            $createdAt = parseDateToMysql($item['date_str'], $item['time_str']);
            $hour = explode(' ', $createdAt)[1] ?? '08:00:00';
            $session = getSessionFromHour(substr($hour, 0, 2));

            $keterangan = !empty($item['caption']) ? $item['caption'] : (!empty($item['text']) && !strpos($item['text'], 'terlampir') ? $item['text'] : "Kegiatan Sales Grup WA ($session)");
            $keterangan = str_replace(['(file terlampir)', '‎'], '', $keterangan);
            if (empty(trim($keterangan))) {
                $keterangan = "Dokumentasi kegiatan lapangan oleh $senderName";
            }

            $tipe = 'Canvassing Lapangan';
            $ketLower = strtolower($keterangan);
            if (strpos($ketLower, 'test drive') !== false) $tipe = 'Test Drive';
            else if (strpos($ketLower, 'visit') !== false || strpos($ketLower, 'cust') !== false) $tipe = 'Follow Up Customer';
            else if (strpos($ketLower, 'piket') !== false || strpos($ketLower, 'showroom') !== false || strpos($ketLower, 'dealer') !== false) $tipe = 'Showroom Duty';
            else if (strpos($ketLower, 'survey') !== false || strpos($ketLower, 'leasing') !== false) $tipe = 'Survey Bersama Leasing';
            else if (strpos($ketLower, 'pameran') !== false || strpos($ketLower, 'booth') !== false || strpos($ketLower, 'mall') !== false) $tipe = 'Pameran & Booth Mall';

            // Upsert
            $chk = $conn->prepare("SELECT id FROM aktivitas WHERE foto = ?");
            $chk->bind_param("s", $filePath);
            $chk->execute();
            $res = $chk->get_result();

            if ($res && $res->num_rows > 0) {
                $row = $res->fetch_assoc();
                $upd = $conn->prepare("UPDATE aktivitas SET nama_sales = ?, sales_account_id = ?, tipe_aktivitas = ?, keterangan = ?, sesi_waktu = ?, created_at = ? WHERE id = ?");
                $upd->bind_param("sissssi", $senderName, $salesId, $tipe, $keterangan, $session, $createdAt, $row['id']);
                $upd->execute();
                $updated++;
            } else {
                $ins = $conn->prepare("INSERT INTO aktivitas (sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, durasi, created_at) VALUES (?, ?, ?, ?, 'Wilayah Bandung', ?, 'Selesai', ?, '60 Menit', ?)");
                $ins->bind_param("issssss", $salesId, $senderName, $tipe, $keterangan, $filePath, $session, $createdAt);
                $ins->execute();
                $inserted++;
            }
        } else {
            // Unmatched WhatsApp Image YYYY-MM-DD at HH.MM.SS
            $chk = $conn->prepare("SELECT id FROM aktivitas WHERE foto = ?");
            $chk->bind_param("s", $filePath);
            $chk->execute();
            $res = $chk->get_result();

            if ($res && $res->num_rows === 0) {
                if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $f, $m)) {
                    $createdAt = "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}";
                    $session = getSessionFromHour($m[4]);
                } else {
                    $createdAt = date('Y-m-d H:i:s');
                    $session = 'Pagi';
                }

                $salesId = 10;
                $senderName = 'Egy';
                $tipe = 'Canvassing Lapangan';
                $keterangan = "Dokumentasi kegiatan WhatsApp {$session} ({$createdAt})";

                $ins = $conn->prepare("INSERT INTO aktivitas (sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, durasi, created_at) VALUES (?, ?, ?, ?, 'Wilayah Bandung', ?, 'Selesai', ?, '60 Menit', ?)");
                $ins->bind_param("issssss", $salesId, $senderName, $tipe, $keterangan, $filePath, $session, $createdAt);
                $ins->execute();
                $inserted++;
            }
        }
    }
}

echo "Sinkronisasi selesai!\n";
echo "- Foto Baru Dimasukkan ke Database: $inserted\n";
echo "- Foto Diperbarui dengan Nama Sales & Waktu: $updated\n";
?>
