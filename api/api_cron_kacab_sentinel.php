<?php
// api/api_cron_kacab_sentinel.php
// Script Cron Otomatis Pengiriman Laporan AI Sentinel ke WhatsApp Kepala Cabang (Kacab)
// Dijadwalkan otomatis setiap hari pukul 06:00 WIB

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

// Pastikan tabel pengaturan otomasi ada
if ($conn && !$conn->connect_error) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_sentinel_settings (
        id INT PRIMARY KEY DEFAULT 1,
        kacab_wa VARCHAR(50) DEFAULT '081234567890',
        schedule_time VARCHAR(10) DEFAULT '06:00',
        auto_send_enabled INT DEFAULT 1,
        gateway_provider VARCHAR(50) DEFAULT 'fonnte',
        gateway_token VARCHAR(255) DEFAULT '',
        last_sent_at DATETIME DEFAULT NULL,
        last_sent_status VARCHAR(100) DEFAULT 'Ready'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("INSERT IGNORE INTO tabel_sentinel_settings (id, kacab_wa, schedule_time, auto_send_enabled, gateway_provider) 
                  VALUES (1, '081234567890', '06:00', 1, 'fonnte')");

    $conn->query("CREATE TABLE IF NOT EXISTS tabel_ai_sentinel_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        periode_tanggal DATE NOT NULL,
        hari_ke INT NOT NULL,
        periode_slice INT NOT NULL,
        min_required INT NOT NULL,
        underperforming_count INT NOT NULL,
        on_track_count INT NOT NULL,
        report_message TEXT,
        sent_to_wa VARCHAR(50) DEFAULT '',
        status VARCHAR(50) DEFAULT 'Generated',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

// 1. Tangani Simpan Pengaturan jika dipanggil via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (isset($data['action']) && $data['action'] === 'save_settings') {
        $kacab_wa = $conn->real_escape_string(trim($data['kacab_wa'] ?? '081234567890'));
        $schedule_time = trim($data['schedule_time'] ?? '06:00');
        // Pastikan format HH:MM
        if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $schedule_time)) {
            $schedule_time = '06:00';
        }
        $schedule_time_db = $conn->real_escape_string($schedule_time);
        $auto_send = intval($data['auto_send_enabled'] ?? 1);
        $gateway_provider = $conn->real_escape_string(trim($data['gateway_provider'] ?? 'fonnte'));
        $gateway_token = $conn->real_escape_string(trim($data['gateway_token'] ?? ''));

        $conn->query("UPDATE tabel_sentinel_settings SET 
            kacab_wa = '$kacab_wa',
            schedule_time = '$schedule_time_db',
            auto_send_enabled = $auto_send,
            gateway_provider = '$gateway_provider',
            gateway_token = '$gateway_token'
            WHERE id = 1");

        // Sinkronisasi otomatis ke Windows Task Scheduler
        $bat_path = "c:\\laragon\\www\\sft\\cron_sentinel_06am.bat";
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            @exec("schtasks /create /tn \"SFT_AI_Sentinel_Kacab_06AM\" /tr \"$bat_path\" /sc daily /st $schedule_time /f 2>&1", $task_output, $task_code);
        }

        echo json_encode([
            "status" => "success",
            "schedule_time" => $schedule_time,
            "message" => "Jadwal kirim otomatis berhasil diatur ke pukul " . $schedule_time . " WIB setiap hari!"
        ]);
        if ($conn) $conn->close();
        exit();
    }
}

// 2. Ambil Pengaturan Aktif
$settings = [
    'kacab_wa' => '081234567890',
    'schedule_time' => '06:00',
    'auto_send_enabled' => 1,
    'gateway_provider' => 'fonnte',
    'gateway_token' => '',
    'last_sent_at' => null,
    'last_sent_status' => 'Ready'
];

$res_set = $conn->query("SELECT * FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
if ($res_set && $s_row = $res_set->fetch_assoc()) {
    $settings = array_merge($settings, $s_row);
}

require_once __DIR__ . '/api_sheets_sync.php';

// 3. Helper: Hitung Laporan AI Sentinel Hari Ini
$current_day = intval(date('j'));
$current_month = intval(date('n'));
$current_year = date('Y');

// Auto-sync dari Google Sheets terbaru sebelum membuat laporan
if (function_exists('syncGoogleSheetsToDb')) {
    syncGoogleSheetsToDb($conn, $current_month, $current_year);
}

// Parameter simulasi jika dipanggil dengan ?hari=X
if (isset($_GET['hari'])) {
    $current_day = intval($_GET['hari']);
}
if (isset($_GET['bulan'])) {
    $current_month = intval($_GET['bulan']);
}

// Panggil logika Sentinel internal
function getInternalSentinelReport($conn, $current_day, $current_month, $current_year) {
    if ($current_day <= 5) {
        $slice = 1; $min = 1; $range = "Hari 1 - 5";
    } elseif ($current_day <= 10) {
        $slice = 2; $min = 2; $range = "Hari 6 - 10";
    } elseif ($current_day <= 15) {
        $slice = 3; $min = 3; $range = "Hari 11 - 15";
    } elseif ($current_day <= 20) {
        $slice = 4; $min = 4; $range = "Hari 16 - 20";
    } elseif ($current_day <= 25) {
        $slice = 5; $min = 5; $range = "Hari 21 - 25";
    } else {
        $slice = 6; $min = 6; $range = "Hari 26 - Akhir Bulan";
    }

    $whiteboard_targets = [
        'indah' => ['target_spk' => 4, 'target_do' => 3], 'dadi' => ['target_spk' => 3, 'target_do' => 2],
        'topik' => ['target_spk' => 5, 'target_do' => 4], 'andri' => ['target_spk' => 4, 'target_do' => 3],
        'abdian' => ['target_spk' => 4, 'target_do' => 3], 'fadhil' => ['target_spk' => 4, 'target_do' => 3],
        'rizky' => ['target_spk' => 3, 'target_do' => 2], 'udu' => ['target_spk' => 3, 'target_do' => 2],
        'nova' => ['target_spk' => 4, 'target_do' => 3], 'cici' => ['target_spk' => 3, 'target_do' => 2],
        'galih_riva' => ['target_spk' => 4, 'target_do' => 3], 'deni_rv' => ['target_spk' => 4, 'target_do' => 3],
        'mustofa' => ['target_spk' => 4, 'target_do' => 3], 'sinta' => ['target_spk' => 4, 'target_do' => 3],
        'rizal' => ['target_spk' => 4, 'target_do' => 3], 'reni' => ['target_spk' => 3, 'target_do' => 2],
        'nuri' => ['target_spk' => 3, 'target_do' => 2], 'egy' => ['target_spk' => 5, 'target_do' => 3],
        'deno' => ['target_spk' => 4, 'target_do' => 3], 'erik' => ['target_spk' => 4, 'target_do' => 3],
        'denia' => ['target_spk' => 4, 'target_do' => 3], 'yani' => ['target_spk' => 3, 'target_do' => 2],
        'jajang' => ['target_spk' => 3, 'target_do' => 2], 'juarna' => ['target_spk' => 3, 'target_do' => 2],
        'galih_ryan' => ['target_spk' => 3, 'target_do' => 2], 'reza' => ['target_spk' => 3, 'target_do' => 2],
        'dadan' => ['target_spk' => 3, 'target_do' => 2], 'fani' => ['target_spk' => 3, 'target_do' => 2],
        'igo' => ['target_spk' => 3, 'target_do' => 2], 'fia' => ['target_spk' => 5, 'target_do' => 2],
        'rahma' => ['target_spk' => 3, 'target_do' => 2]
    ];

    $nama_bulan_list = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];
    $periode_str = $current_day . " " . $nama_bulan_list[$current_month] . " " . $current_year;

    $q_sales = $conn->query("SELECT id, username, nama_lengkap, tingkatan, nama_spv FROM sales_accounts ORDER BY nama_spv ASC, nama_lengkap ASC");

    $underperforming = [];
    $on_track = [];

    if ($q_sales && $q_sales->num_rows > 0) {
        while ($row = $q_sales->fetch_assoc()) {
            $sales_id = intval($row['id']);
            $username_clean = strtolower(trim($row['username']));
            $sales_name = $row['nama_lengkap'];
            $spv_name = $row['nama_spv'] ?: 'Supervisor';
            $tingkatan = $row['tingkatan'] ?: 'Executive';

            $tgt_spk = 7; $tgt_do = 5;
            if (isset($whiteboard_targets[$username_clean])) {
                $tgt_spk = $whiteboard_targets[$username_clean]['target_spk'];
                $tgt_do = $whiteboard_targets[$username_clean]['target_do'];
            }

            $q_target = $conn->query("SELECT target_spk, target_do, realisasi_spk, realisasi_do FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $current_month");

            $real_spk = 0; $real_do = 0;
            if ($q_target && $t_row = $q_target->fetch_assoc()) {
                if (intval($t_row['target_spk']) > 0) $tgt_spk = intval($t_row['target_spk']);
                if (intval($t_row['target_do']) > 0) $tgt_do = intval($t_row['target_do']);
                $real_spk = intval($t_row['realisasi_spk']);
                $real_do = intval($t_row['realisasi_do']);
            }

            if ($real_spk === 0) {
                $q_dyn = $conn->query("SELECT 
                    SUM(CASE WHEN status != 'Ditolak' THEN 1 ELSE 0 END) as dyn_spk,
                    SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as dyn_do
                    FROM tabel_spk WHERE sales_account_id = $sales_id AND (MONTH(created_at) = $current_month OR created_at IS NULL OR created_at = '')");
                if ($q_dyn && $d = $q_dyn->fetch_assoc()) {
                    $real_spk = max($real_spk, intval($d['dyn_spk'] ?? 0));
                    $real_do = max($real_do, intval($d['dyn_do'] ?? 0));
                }
            }

            $sales_target = max($tgt_spk, $tgt_do);
            if ($sales_target <= 0) $sales_target = 3;

            $sales_min_required = min($min, $sales_target);
            $highest_actual = max($real_spk, $real_do);

            $is_passed = ($highest_actual >= $sales_target) || ($highest_actual >= $sales_min_required);
            $deficit = max(0, $sales_min_required - $highest_actual);

            $ai_advice = "";
            if ($highest_actual == 0) {
                $ai_advice = "Belum ada SPK / DO (0 Unit). Wajib pendampingan co-closing bersama SPV $spv_name.";
            } elseif ($deficit > 0) {
                $ai_advice = "Kurang $deficit unit dari target minimal $sales_min_required unit. SPV disarankan evaluasi database Hot Prospect & percepat test drive.";
            } else {
                $ai_advice = "Target terpenuhi / on-track.";
            }

            $entry = [
                'nama_sales' => $sales_name,
                'nama_spv' => $spv_name,
                'realisasi_spk' => $real_spk,
                'realisasi_do' => $real_do,
                'target_spk' => $tgt_spk,
                'target_do' => $tgt_do,
                'min_required' => $sales_min_required,
                'deficit' => $deficit,
                'ai_advice' => $ai_advice
            ];

            if ($is_passed) {
                $on_track[] = $entry;
            } else {
                $underperforming[] = $entry;
            }
        }
    }

    usort($underperforming, function($a, $b) {
        if ($b['deficit'] !== $a['deficit']) {
            return $b['deficit'] - $a['deficit'];
        }
        return strcmp($a['nama_spv'], $b['nama_spv']);
    });

    $total_count = count($underperforming) + count($on_track);
    $needs_alert = (count($underperforming) > 0);

    $msg = "";
    if ($needs_alert) {
        $msg .= "🚨 *LAPORAN HARIAN AI SENTINEL KACAB (06:00 WIB)* 🚨\n";
        $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $msg .= "📅 *Tanggal*: {$periode_str}\n";
        $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
        $msg .= "🎯 *Standar Minimal 5-Harian*: Minimal *{$min} SPK / DO*\n";
        $msg .= "📊 *Kondisi Cabang*: *" . count($underperforming) . " dari {$total_count} Sales* belum mencapai target minimal\n";
        $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $msg .= "📋 *DAFTAR WIRANIAGA PERLU REVIEW SPV:*\n\n";

        $no = 1;
        foreach ($underperforming as $u) {
            $msg .= "{$no}. 👤 *{$u['nama_sales']}* ({$u['nama_spv']})\n";
            $msg .= "   • Target: {$u['target_spk']} SPK / {$u['target_do']} DO (Min. Hari Ini: {$u['min_required']} Unit)\n";
            $msg .= "   • Aktual: *{$u['realisasi_spk']} SPK* | *{$u['realisasi_do']} DO*\n";
            $msg .= "   • Defisit: *-{$u['deficit']} Unit*\n";
            $msg .= "   • Saran AI: {$u['ai_advice']}\n\n";
            $no++;
        }

        $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        if (count($on_track) > 0) {
            $msg .= "✅ *Sales Capai Target / On-Track*: " . count($on_track) . " Wiraniaga aman (tidak perlu review).\n\n";
        }

        $msg .= "📌 *Rekomendasi Tindakan Kepala Cabang:*\n";
        $msg .= "1. Instruksikan SPV untuk melakukan review harian dan mendampingi closing (Co-Closing).\n";
        $msg .= "2. Percepat proses approval diskon dan kredit untuk prospek yang sedang berjalan.";
    } else {
        $msg .= "✅ *LAPORAN HARIAN AI SENTINEL KACAB: SEMUA ON-TRACK (06:00 WIB)* ✅\n";
        $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $msg .= "📅 *Tanggal*: {$periode_str}\n";
        $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
        $msg .= "🎯 *Standar Minimal 5-Harian*: Minimal *{$min} SPK / DO*\n";
        $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $msg .= "Yth. Bapak Kepala Cabang,\n";
        $msg .= "Seluruh *{$total_count} Wiraniaga Cabang* telah berhasil mencapai target minimal pada periode ini. Kinerja operasional cabang berjalan optimal. 💪🔥";
    }

    return [
        'message' => $msg,
        'underperforming_count' => count($underperforming),
        'on_track_count' => count($on_track),
        'needs_alert' => $needs_alert,
        'slice' => $slice,
        'min' => $min
    ];
}

$report = getInternalSentinelReport($conn, $current_day, $current_month, $current_year);
$wa_message = $report['message'];
$target_phone = $settings['kacab_wa'];

// Bersihkan format nomor WA
$clean_phone = preg_replace('/[^0-9]/', '', $target_phone);
if (str_starts_with($clean_phone, '0')) {
    $clean_phone = '62' . substr($clean_phone, 1);
}

// 4. Pengiriman Nyata via Gateway WhatsApp (Jika Token Tersedia)
$dispatch_result = "Simulated / Logged";
$http_status = 200;

if (!empty($settings['gateway_token'])) {
    $provider = strtolower($settings['gateway_provider']);

    if ($provider === 'fonnte') {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => [
                'target' => $clean_phone,
                'message' => $wa_message,
                'countryCode' => '62'
            ],
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $settings['gateway_token']
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_TIMEOUT => 20
        ]);
        $response = curl_exec($curl);
        $curl_err = curl_error($curl);
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($curl_err) {
            $dispatch_result = "cURL Error: " . $curl_err;
        } else {
            $dispatch_result = "Fonnte: " . $response;
        }
    } elseif ($provider === 'wablas') {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://kudus.wablas.com/api/send-message',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'phone' => $clean_phone,
                'message' => $wa_message
            ]),
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $settings['gateway_token']
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_TIMEOUT => 20
        ]);
        $response = curl_exec($curl);
        $curl_err = curl_error($curl);
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($curl_err) {
            $dispatch_result = "cURL Error: " . $curl_err;
        } else {
            $dispatch_result = "Wablas: " . $response;
        }
    }
} else {
    $dispatch_result = "Auto-Logged (Ready for Gateway or Click-to-Send)";
}

// 5. Catat Log ke Database
$now_str = date('Y-m-d H:i:s');
$today_str = date('Y-m-d');
$status_log = ($http_status === 200) ? 'Sent' : 'Failed';

$stmt = $conn->prepare("INSERT INTO tabel_ai_sentinel_logs 
    (periode_tanggal, hari_ke, periode_slice, min_required, underperforming_count, on_track_count, report_message, sent_to_wa, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("siiiiisss", $today_str, $current_day, $report['slice'], $report['min'], $report['underperforming_count'], $report['on_track_count'], $wa_message, $clean_phone, $status_log);
    $stmt->execute();
    $stmt->close();
}

$conn->query("UPDATE tabel_sentinel_settings SET last_sent_at = '$now_str', last_sent_status = '$status_log' WHERE id = 1");

$wa_url = "https://api.whatsapp.com/send?phone=" . $clean_phone . "&text=" . urlencode($wa_message);

echo json_encode([
    "status" => "success",
    "scheduled_time" => $settings['schedule_time'] . " WIB",
    "executed_at" => $now_str,
    "target_kacab_wa" => $clean_phone,
    "underperforming_sales_count" => $report['underperforming_count'],
    "dispatch_result" => $dispatch_result,
    "wa_share_url" => $wa_url,
    "settings" => $settings
]);

if ($conn) $conn->close();
exit();
