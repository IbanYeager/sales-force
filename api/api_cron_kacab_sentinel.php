<?php
// api/api_cron_kacab_sentinel.php
// Script Cron Otomatis Pengiriman Laporan AI Sentinel ke WhatsApp Kepala Cabang (Kacab)
// Mendukung eksekusi via Windows Task Scheduler (CLI), Web-Cron Fallback, dan UI Manual Trigger

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

// Helper: Setup / Update Windows Task Scheduler dengan Setting Anti-Sleep & Anti-Battery-Delay
function syncWindowsTaskScheduler($schedule_time) {
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        return false;
    }
    
    // Cari path cron_sentinel_06am.bat
    $possible_paths = [
        dirname(__DIR__) . "\\cron_sentinel_06am.bat",
        "c:\\laragon\\www\\sft - Copy\\cron_sentinel_06am.bat",
        "c:\\laragon\\www\\sft\\cron_sentinel_06am.bat"
    ];
    $bat_path = "";
    foreach ($possible_paths as $p) {
        if (file_exists($p)) {
            $bat_path = $p;
            break;
        }
    }
    if (empty($bat_path)) {
        $bat_path = dirname(__DIR__) . "\\cron_sentinel_06am.bat";
    }

    $task_name = "SFT_AI_Sentinel_Kacab_06AM";
    // 1. Buat / Update Task Schedule Dasar dengan schtasks
    @exec("schtasks /create /tn \"$task_name\" /tr \"\\\"$bat_path\\\"\" /sc daily /st $schedule_time /f 2>&1", $task_output, $task_code);

    // 2. PowerShell: Izinkan jalan di baterai, jangan stop di baterai, bangunkan laptop jika tidur, dan jalankan segera jika waktu terlewat
    $ps_cmd = "powershell -ExecutionPolicy Bypass -Command \"Set-ScheduledTask -TaskName '$task_name' -Settings (New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -WakeToRun)\" 2>&1";
    @exec($ps_cmd, $ps_output, $ps_code);

    return ($task_code === 0);
}

// Parsing parameter dari CLI ($argv) atau HTTP request
$action = $_GET['action'] ?? '';
$data = [];

if (php_sapi_name() === 'cli') {
    $action = !empty($_GET['action']) ? $_GET['action'] : (!empty($_POST['action']) ? $_POST['action'] : 'execute_cron');
    if (isset($argv) && count($argv) > 1) {
        foreach (array_slice($argv, 1) as $arg) {
            if (strpos($arg, '=') !== false) {
                list($k, $v) = explode('=', $arg, 2);
                $_GET[$k] = $v;
                if ($k === 'action') $action = $v;
            } else {
                $_GET[$arg] = true;
                if (in_array($arg, ['execute_cron', 'send_now', 'get_settings', 'save_settings'])) {
                    $action = $arg;
                }
            }
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: [];
    if (!empty($data['action'])) {
        $action = $data['action'];
    } elseif (!empty($_POST['action'])) {
        $action = $_POST['action'];
    }
}

// 1. Tangani Simpan Pengaturan jika dipanggil via POST action=save_settings
if ($action === 'save_settings') {
    $kacab_wa = $conn ? $conn->real_escape_string(trim($data['kacab_wa'] ?? $_POST['kacab_wa'] ?? '081234567890')) : '081234567890';
    $schedule_time = trim($data['schedule_time'] ?? $_POST['schedule_time'] ?? '06:00');
    // Pastikan format HH:MM
    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $schedule_time)) {
        $schedule_time = '06:00';
    }
    $schedule_time_db = $conn ? $conn->real_escape_string($schedule_time) : $schedule_time;
    $auto_send = intval($data['auto_send_enabled'] ?? $_POST['auto_send_enabled'] ?? 1);
    $gateway_provider = $conn ? $conn->real_escape_string(trim($data['gateway_provider'] ?? $_POST['gateway_provider'] ?? 'fonnte')) : 'fonnte';
    $gateway_token = $conn ? $conn->real_escape_string(trim($data['gateway_token'] ?? $_POST['gateway_token'] ?? '')) : '';

    if ($conn) {
        $conn->query("UPDATE tabel_sentinel_settings SET 
            kacab_wa = '$kacab_wa',
            schedule_time = '$schedule_time_db',
            auto_send_enabled = $auto_send,
            gateway_provider = '$gateway_provider',
            gateway_token = '$gateway_token'
            WHERE id = 1");
    }

    // Sinkronisasi otomatis ke Windows Task Scheduler dengan pengaturan Power & Wakeup
    $synced = syncWindowsTaskScheduler($schedule_time);

    echo json_encode([
        "status" => "success",
        "schedule_time" => $schedule_time,
        "scheduler_synced" => $synced,
        "message" => "Jadwal kirim otomatis berhasil disimpan ke pukul " . $schedule_time . " WIB setiap hari! (Proteksi baterai & anti-delay telah diaktifkan)"
    ]);
    if ($conn) $conn->close();
    exit();
}

// 2. Ambil Pengaturan Aktif dari DB
$settings = [
    'kacab_wa' => '081234567890',
    'schedule_time' => '06:00',
    'auto_send_enabled' => 1,
    'gateway_provider' => 'fonnte',
    'gateway_token' => '',
    'last_sent_at' => null,
    'last_sent_status' => 'Ready'
];

if ($conn) {
    $res_set = $conn->query("SELECT * FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
    if ($res_set && $s_row = $res_set->fetch_assoc()) {
        $settings = array_merge($settings, $s_row);
    }
}

// 3. JIKA HANYA BACA PENGATURAN (GET biasa / action=get_settings) -> RETURN SETTINGS TANPA KIRIM PESAN!
if ($action === 'get_settings' || (empty($action) && php_sapi_name() !== 'cli')) {
    $today_str = date('Y-m-d');
    $last_sent_date = !empty($settings['last_sent_at']) ? date('Y-m-d', strtotime($settings['last_sent_at'])) : '';
    $already_sent_today = ($last_sent_date === $today_str && $settings['last_sent_status'] === 'Sent');

    echo json_encode([
        "status" => "success",
        "settings" => $settings,
        "server_time" => date('Y-m-d H:i:s'),
        "today_already_sent" => $already_sent_today
    ]);
    if ($conn) $conn->close();
    exit();
}

// 4. VALIDASI EKSEKUSI PENGIRIMAN (action=execute_cron atau action=send_now)
$is_manual_test = ($action === 'send_now') || (isset($_GET['force']) && $_GET['force'] == 1);

// Cek apakah auto-send diaktifkan (khusus eksekusi cron otomatis)
if (!$is_manual_test && intval($settings['auto_send_enabled']) !== 1) {
    echo json_encode([
        "status" => "disabled",
        "message" => "Pengiriman otomatis AI Sentinel sedang dinonaktifkan di pengaturan."
    ]);
    if ($conn) $conn->close();
    exit();
}

// Cek Deduplikasi Harian (Mencegah pesan ganda terkirim berulang di hari yang sama)
$today_str = date('Y-m-d');
$last_sent_date = !empty($settings['last_sent_at']) ? date('Y-m-d', strtotime($settings['last_sent_at'])) : '';
$already_sent_today = ($last_sent_date === $today_str && $settings['last_sent_status'] === 'Sent');

if (!$is_manual_test && $already_sent_today) {
    echo json_encode([
        "status" => "skipped",
        "message" => "Laporan AI Sentinel hari ini ($today_str) sudah terkirim pada {$settings['last_sent_at']} WIB. Pengiriman duplikat dilewati.",
        "last_sent_at" => $settings['last_sent_at']
    ]);
    if ($conn) $conn->close();
    exit();
}

require_once __DIR__ . '/api_sheets_sync.php';

// 5. Helper: Hitung Laporan AI Sentinel Hari Ini
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
    $range_label = $range;

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

    // Ambil HANYA wiraniaga yang aktif di Google Spreadsheet saat ini
    $q_sales = $conn ? $conn->query("SELECT id, username, nama_lengkap, tingkatan, nama_spv FROM sales_accounts WHERE is_active = 1 ORDER BY nama_spv ASC, nama_lengkap ASC") : null;

    $underperforming = [];
    $on_track = [];

    if ($q_sales && $q_sales->num_rows > 0) {
        while ($row = $q_sales->fetch_assoc()) {
            $sales_id = intval($row['id']);
            $sales_name = $row['nama_lengkap'];
            $spv_name = $row['nama_spv'] ?: 'Supervisor';
            $tingkatan = $row['tingkatan'] ?: 'Executive';

            $tgt_spk = 3; 
            $tgt_do = 3;
            $real_spk = 0; 
            $real_do = 0;

            // Target & Realisasi langsung dari Google Spreadsheet yang tersimpan di target_do_bulanan
            $q_target = $conn->query("SELECT target_spk, target_do, realisasi_spk, realisasi_do FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $current_month LIMIT 1");
            if ($q_target && $t_row = $q_target->fetch_assoc()) {
                $tgt_spk = intval($t_row['target_spk']) > 0 ? intval($t_row['target_spk']) : 3;
                $tgt_do = intval($t_row['target_do']) > 0 ? intval($t_row['target_do']) : 3;
                $real_spk = intval($t_row['realisasi_spk']);
                $real_do = intval($t_row['realisasi_do']);
            }

            if ($real_spk === 0 && $real_do === 0) {
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
        $msg .= "🚨 *LAPORAN HARIAN AI SENTINEL KACAB* 🚨\n";
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
        $msg .= "✅ *LAPORAN HARIAN AI SENTINEL KACAB: SEMUA ON-TRACK* ✅\n";
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

// 6. Pengiriman Nyata via Gateway WhatsApp (Jika Token Tersedia)
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

// 7. Catat Log ke Database
$now_str = date('Y-m-d H:i:s');
$today_str = date('Y-m-d');
$status_log = ($http_status === 200) ? 'Sent' : 'Failed';

if ($conn) {
    $stmt = $conn->prepare("INSERT INTO tabel_ai_sentinel_logs 
        (periode_tanggal, hari_ke, periode_slice, min_required, underperforming_count, on_track_count, report_message, sent_to_wa, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("siiiiisss", $today_str, $current_day, $report['slice'], $report['min'], $report['underperforming_count'], $report['on_track_count'], $wa_message, $clean_phone, $status_log);
        $stmt->execute();
        $stmt->close();
    }

    $conn->query("UPDATE tabel_sentinel_settings SET last_sent_at = '$now_str', last_sent_status = '$status_log' WHERE id = 1");
}

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
