<?php
// api/api_cron_kacab_sentinel.php
// Script Cron Otomatis Pengiriman Laporan AI Sentinel (3x Sehari: Pagi 07:00, Siang 12:00, Sore 17:00) ke WhatsApp Kacab
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

// Migration / Pastikan tabel dan kolom otomasi 3x harian tersedia
if ($conn && !$conn->connect_error) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_sentinel_settings (
        id INT PRIMARY KEY DEFAULT 1,
        kacab_wa VARCHAR(50) DEFAULT '081234567890',
        schedule_time VARCHAR(10) DEFAULT '07:00',
        schedule_time_pagi VARCHAR(10) DEFAULT '07:00',
        schedule_time_siang VARCHAR(10) DEFAULT '12:00',
        schedule_time_sore VARCHAR(10) DEFAULT '17:00',
        auto_send_enabled INT DEFAULT 1,
        gateway_provider VARCHAR(50) DEFAULT 'fonnte',
        gateway_token VARCHAR(255) DEFAULT '',
        last_sent_at DATETIME DEFAULT NULL,
        last_sent_status VARCHAR(100) DEFAULT 'Ready'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("INSERT IGNORE INTO tabel_sentinel_settings (id, kacab_wa, schedule_time, schedule_time_pagi, schedule_time_siang, schedule_time_sore, auto_send_enabled, gateway_provider) 
                  VALUES (1, '081234567890', '07:00', '07:00', '12:00', '17:00', 1, 'fonnte')");

    // Pastikan kolom schedule_time_pagi, schedule_time_siang, schedule_time_sore ada
    $check_col = $conn->query("SHOW COLUMNS FROM tabel_sentinel_settings LIKE 'schedule_time_pagi'");
    if ($check_col && $check_col->num_rows === 0) {
        $conn->query("ALTER TABLE tabel_sentinel_settings ADD COLUMN schedule_time_pagi VARCHAR(10) DEFAULT '07:00' AFTER schedule_time");
        $conn->query("ALTER TABLE tabel_sentinel_settings ADD COLUMN schedule_time_siang VARCHAR(10) DEFAULT '12:00' AFTER schedule_time_pagi");
        $conn->query("ALTER TABLE tabel_sentinel_settings ADD COLUMN schedule_time_sore VARCHAR(10) DEFAULT '17:00' AFTER schedule_time_siang");
    }

    $conn->query("CREATE TABLE IF NOT EXISTS tabel_ai_sentinel_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        periode_tanggal DATE NOT NULL,
        session VARCHAR(20) DEFAULT 'pagi',
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

    $check_log_session = $conn->query("SHOW COLUMNS FROM tabel_ai_sentinel_logs LIKE 'session'");
    if ($check_log_session && $check_log_session->num_rows === 0) {
        $conn->query("ALTER TABLE tabel_ai_sentinel_logs ADD COLUMN session VARCHAR(20) DEFAULT 'pagi' AFTER periode_tanggal");
    }
}

// Helper: Setup / Update 3 Windows Task Scheduler (Pagi, Siang, Sore)
function syncWindowsTaskScheduler($time_pagi, $time_siang, $time_sore) {
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        return false;
    }
    
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

    $php_executable = "php";
    $script_path = __DIR__ . "\\api_cron_kacab_sentinel.php";

    $tasks = [
        'pagi' => ['name' => 'SFT_AI_Sentinel_Kacab_Pagi', 'time' => $time_pagi],
        'siang' => ['name' => 'SFT_AI_Sentinel_Kacab_Siang', 'time' => $time_siang],
        'sore' => ['name' => 'SFT_AI_Sentinel_Kacab_Sore', 'time' => $time_sore]
    ];

    $all_success = true;

    foreach ($tasks as $sess => $info) {
        $t_name = $info['name'];
        $t_time = $info['time'];

        $cmd = "\"$php_executable\" \"$script_path\" action=execute_cron session=$sess";
        @exec("schtasks /create /tn \"$t_name\" /tr \"$cmd\" /sc daily /st $t_time /f 2>&1", $output, $code);

        if ($code === 0) {
            $ps_cmd = "powershell -ExecutionPolicy Bypass -Command \"Set-ScheduledTask -TaskName '$t_name' -Settings (New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -WakeToRun)\" 2>&1";
            @exec($ps_cmd);
        } else {
            $all_success = false;
        }
    }

    // Clean legacy task name if exists
    @exec("schtasks /delete /tn \"SFT_AI_Sentinel_Kacab_06AM\" /f 2>&1");

    return $all_success;
}

// Parsing parameter dari CLI ($argv) atau HTTP request
$action = $_GET['action'] ?? '';
$session_param = $_GET['session'] ?? '';
$data = [];

if (php_sapi_name() === 'cli') {
    $action = !empty($_GET['action']) ? $_GET['action'] : (!empty($_POST['action']) ? $_POST['action'] : 'execute_cron');
    if (isset($argv) && count($argv) > 1) {
        foreach (array_slice($argv, 1) as $arg) {
            if (strpos($arg, '=') !== false) {
                list($k, $v) = explode('=', $arg, 2);
                $_GET[$k] = $v;
                if ($k === 'action') $action = $v;
                if ($k === 'session') $session_param = $v;
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
    if (!empty($data['session'])) {
        $session_param = $data['session'];
    }
}

// Determine active session: pagi, siang, sore
$current_hour = intval(date('G'));
$session = strtolower(trim($session_param));
if (!in_array($session, ['pagi', 'siang', 'sore'])) {
    if ($current_hour < 11) {
        $session = 'pagi';
    } elseif ($current_hour < 16) {
        $session = 'siang';
    } else {
        $session = 'sore';
    }
}

// 1. Tangani Simpan Pengaturan jika dipanggil via POST action=save_settings
if ($action === 'save_settings') {
    $kacab_wa = $conn ? $conn->real_escape_string(trim($data['kacab_wa'] ?? $_POST['kacab_wa'] ?? '081234567890')) : '081234567890';
    
    $schedule_time_pagi = trim($data['schedule_time_pagi'] ?? $_POST['schedule_time_pagi'] ?? '07:00');
    $schedule_time_siang = trim($data['schedule_time_siang'] ?? $_POST['schedule_time_siang'] ?? '12:00');
    $schedule_time_sore = trim($data['schedule_time_sore'] ?? $_POST['schedule_time_sore'] ?? '17:00');

    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $schedule_time_pagi)) $schedule_time_pagi = '07:00';
    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $schedule_time_siang)) $schedule_time_siang = '12:00';
    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $schedule_time_sore)) $schedule_time_sore = '17:00';

    $auto_send = intval($data['auto_send_enabled'] ?? $_POST['auto_send_enabled'] ?? 1);
    $gateway_provider = $conn ? $conn->real_escape_string(trim($data['gateway_provider'] ?? $_POST['gateway_provider'] ?? 'fonnte')) : 'fonnte';
    $gateway_token = $conn ? $conn->real_escape_string(trim($data['gateway_token'] ?? $_POST['gateway_token'] ?? '')) : '';

    if ($conn) {
        $conn->query("UPDATE tabel_sentinel_settings SET 
            kacab_wa = '$kacab_wa',
            schedule_time = '$schedule_time_pagi',
            schedule_time_pagi = '$schedule_time_pagi',
            schedule_time_siang = '$schedule_time_siang',
            schedule_time_sore = '$schedule_time_sore',
            auto_send_enabled = $auto_send,
            gateway_provider = '$gateway_provider',
            gateway_token = '$gateway_token'
            WHERE id = 1");
    }

    // Sinkronisasi otomatis 3 jadwal di Task Scheduler Windows
    $synced = syncWindowsTaskScheduler($schedule_time_pagi, $schedule_time_siang, $schedule_time_sore);

    echo json_encode([
        "status" => "success",
        "schedule_time_pagi" => $schedule_time_pagi,
        "schedule_time_siang" => $schedule_time_siang,
        "schedule_time_sore" => $schedule_time_sore,
        "scheduler_synced" => $synced,
        "message" => "Jadwal 3x kirim otomatis berhasil disimpan (Pagi $schedule_time_pagi, Siang $schedule_time_siang, Sore $schedule_time_sore WIB)! (Proteksi baterai & anti-delay telah diaktifkan)"
    ]);
    if ($conn) $conn->close();
    exit();
}

// 2. Ambil Pengaturan Aktif dari DB
$settings = [
    'kacab_wa' => '081234567890',
    'schedule_time' => '07:00',
    'schedule_time_pagi' => '07:00',
    'schedule_time_siang' => '12:00',
    'schedule_time_sore' => '17:00',
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
    
    // Check per session sent status today
    $sent_sessions = [];
    if ($conn) {
        $q_log = $conn->query("SELECT session FROM tabel_ai_sentinel_logs WHERE periode_tanggal = '$today_str' AND status = 'Sent'");
        if ($q_log) {
            while ($l = $q_log->fetch_assoc()) {
                $sent_sessions[] = strtolower($l['session']);
            }
        }
    }

    echo json_encode([
        "status" => "success",
        "settings" => $settings,
        "current_session" => $session,
        "server_time" => date('Y-m-d H:i:s'),
        "sent_sessions_today" => array_unique($sent_sessions)
    ]);
    if ($conn) $conn->close();
    exit();
}

// 4. VALIDASI EKSEKUSI PENGIRIMAN (action=execute_cron atau action=send_now)
$is_manual_test = ($action === 'send_now') || (isset($_GET['force']) && $_GET['force'] == 1);

// Cek apakah auto-send diaktifkan
if (!$is_manual_test && intval($settings['auto_send_enabled']) !== 1) {
    echo json_encode([
        "status" => "disabled",
        "message" => "Pengiriman otomatis AI Sentinel sedang dinonaktifkan di pengaturan."
    ]);
    if ($conn) $conn->close();
    exit();
}

// Cek Deduplikasi Harian Per Sesi (Mencegah pesan sesi ganda terkirim berulang di hari & sesi yang sama)
$today_str = date('Y-m-d');
$already_sent_session = false;

if ($conn) {
    $q_chk = $conn->query("SELECT id, created_at FROM tabel_ai_sentinel_logs WHERE periode_tanggal = '$today_str' AND session = '$session' AND status = 'Sent' LIMIT 1");
    if ($q_chk && $q_chk->num_rows > 0) {
        $already_sent_session = true;
    }
}

if (!$is_manual_test && $already_sent_session) {
    echo json_encode([
        "status" => "skipped",
        "session" => $session,
        "message" => "Laporan AI Sentinel sesi " . strtoupper($session) . " hari ini ($today_str) sudah pernah terkirim. Pengiriman duplikat dilewati."
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

if (isset($_GET['hari'])) {
    $current_day = intval($_GET['hari']);
}
if (isset($_GET['bulan'])) {
    $current_month = intval($_GET['bulan']);
}

// Logic Sentinel internal
function getInternalSentinelReport($conn, $current_day, $current_month, $current_year, $session) {
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

    $nama_bulan_list = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];
    $periode_str = $current_day . " " . $nama_bulan_list[$current_month] . " " . $current_year;

    $q_sales = $conn ? $conn->query("SELECT id, username, nama_lengkap, tingkatan, nama_spv FROM sales_accounts WHERE is_active = 1 ORDER BY nama_spv ASC, nama_lengkap ASC") : null;

    $underperforming = [];
    $on_track = [];
    $total_spk_cabang = 0;
    $total_do_cabang = 0;

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

            $total_spk_cabang += $real_spk;
            $total_do_cabang += $real_do;

            // Minimal SPK 5-harian
            $sales_min_required = min($min, $tgt_spk);

            // ATURAN SPK: Evaluasi defisit dilakukan KHUSUS untuk SPK
            $is_passed = ($real_spk >= $tgt_spk) || ($real_spk >= $sales_min_required);
            $deficit = max(0, $sales_min_required - $real_spk);

            $ai_advice = "";
            if ($session === 'pagi') {
                if ($real_spk == 0) {
                    $ai_advice = "Fokus Pagi: Belum ada SPK (0 Unit). Evaluasi list prospek & jadwalkan min 3 canvassing/test-drive hari ini. Wajib pendampingan SPV $spv_name.";
                } elseif ($deficit > 0) {
                    $ai_advice = "Fokus Pagi: Defisit -$deficit SPK dari min. $sales_min_required SPK. SPV $spv_name mohon dorong penutupan SPK dari database Hot Prospect hari ini.";
                } else {
                    $ai_advice = "Pagi: Target SPK aman ($real_spk SPK). Fokus pendampingan closing sales lain & dorong penyelesaian DO ($real_do DO).";
                }
            } elseif ($session === 'siang') {
                if ($real_spk == 0) {
                    $ai_advice = "Update Siang: Belum ada SPK (0 Unit). SPV $spv_name mohon cek hasil follow-up prospek pagi ini.";
                } elseif ($deficit > 0) {
                    $ai_advice = "Update Siang: Kurang $deficit SPK dari min. $sales_min_required SPK. Dorong penutupan transaksi prospek hangat siang ini.";
                } else {
                    $ai_advice = "Update Siang: SPK On-track ($real_spk SPK | $real_do DO). Pertahankan ritme hingga sore.";
                }
            } else { // sore
                if ($real_spk == 0) {
                    $ai_advice = "Closing Sore: 0 SPK. Wajib evaluasi komprehensif bersama SPV $spv_name untuk penyusunan strategi esok hari.";
                } elseif ($deficit > 0) {
                    $ai_advice = "Closing Sore: Masih defisit -$deficit SPK. Siapkan daftar konsumen prioritas untuk di-follow up besok pagi.";
                } else {
                    $ai_advice = "Closing Sore: Kinerja SPK tercapai ($real_spk SPK | $real_do DO). Siapkan pengiriman unit DO selanjutnya.";
                }
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

    // Group underperforming sales by SPV team
    $under_by_spv = [];
    foreach ($underperforming as $u) {
        $spv = $u['nama_spv'] ?: 'Supervisor';
        if (!isset($under_by_spv[$spv])) {
            $under_by_spv[$spv] = [];
        }
        $under_by_spv[$spv][] = $u;
    }

    foreach ($under_by_spv as $spv_key => &$s_list) {
        usort($s_list, function($a, $b) {
            if ($b['deficit'] !== $a['deficit']) {
                return $b['deficit'] - $a['deficit'];
            }
            return strcmp($a['nama_sales'], $b['nama_sales']);
        });
    }
    unset($s_list);

    // Fetch dynamic schedule times from DB
    $time_pagi = '07:00';
    $time_siang = '12:00';
    $time_sore = '17:00';

    if ($conn) {
        $q_set = $conn->query("SELECT schedule_time_pagi, schedule_time_siang, schedule_time_sore FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
        if ($q_set && $s_row = $q_set->fetch_assoc()) {
            if (!empty($s_row['schedule_time_pagi'])) $time_pagi = $s_row['schedule_time_pagi'];
            if (!empty($s_row['schedule_time_siang'])) $time_siang = $s_row['schedule_time_siang'];
            if (!empty($s_row['schedule_time_sore'])) $time_sore = $s_row['schedule_time_sore'];
        }
    }

    $total_count = count($underperforming) + count($on_track);
    $needs_alert = (count($underperforming) > 0);

    $msg = "";
    if ($session === 'pagi') {
        if ($needs_alert) {
            $msg .= "🌅 *SARAN BRIEFING PAGI KACAB ({$time_pagi} WIB) - AI SENTINEL* 🌅\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🎯 *Target Minimal SPK*: Minimal *{$min} SPK* (s.d. hari ini)\n";
            $msg .= "📊 *Status Tim*: *" . count($underperforming) . " dari {$total_count} Sales* belum mencapai target minimal SPK\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "📋 *FOKUS BRIEFING PER TIM SUPERVISOR (SPV):*\n\n";

            foreach ($under_by_spv as $spv_name => $sales_list) {
                $cnt_spv = count($sales_list);
                $msg .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Perlu Review):\n";

                $no_spv = 1;
                $zero_spk_cnt = 0;
                foreach ($sales_list as $u) {
                    if ($u['realisasi_spk'] == 0) $zero_spk_cnt++;
                    $msg .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']}/{$u['target_spk']}* (Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']}/{$u['target_do']}*\n";
                    $no_spv++;
                }

                $team_advice = "";
                if ($zero_spk_cnt == $cnt_spv) {
                    $team_advice = "Seluruh {$cnt_spv} sales tim {$spv_name} belum mencatat SPK (0 Unit). SPV wajib evaluasi ulang list prospek & lakukan pendampingan co-closing harian.";
                } elseif ($zero_spk_cnt > 0) {
                    $team_advice = "{$zero_spk_cnt} dari {$cnt_spv} sales tim {$spv_name} masih 0 SPK. SPV {$spv_name} mohon prioritaskan pendampingan closing & pastikan min. 3 canvassing/test-drive per sales hari ini.";
                } else {
                    $team_advice = "{$cnt_spv} sales tim {$spv_name} masih defisit SPK. SPV {$spv_name} mohon dorong penutupan SPK dari database Hot Prospect tim hari ini.";
                }

                $msg .= "   💡 *Saran Briefing Tim {$spv_name}*: {$team_advice}\n\n";
            }

            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            if (count($on_track) > 0) {
                $msg .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales aman (tidak perlu review).\n\n";
            }

            $msg .= "📌 *REKOMENDASI ARAHAN UTAMA KECABANGAN (BRIEFING PAGI):*\n";
            $msg .= "1. Instruksikan setiap SPV untuk melakukan review harian dan mendampingi closing (Co-Closing) sales yang defisit SPK.\n";
            $msg .= "2. Evaluasi daftar Hot Prospect & pastikan jadwal test drive harian terdaftar.\n";
            $msg .= "3. Percepat proses approval diskon dan permohonan kredit pending.";
        } else {
            $msg .= "✅ *BRIEFING PAGI KACAB ({$time_pagi} WIB): SELURUH SALES ON-TRACK* ✅\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🎯 *Target Minimal SPK*: Minimal *{$min} SPK*\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "Yth. Bapak Kepala Cabang,\n";
            $msg .= "Seluruh *{$total_count} Wiraniaga Cabang* telah berhasil mencapai target minimal SPK pada periode ini. Briefing pagi dapat difokuskan pada dorongan akselerasi DO dan perolehan SPK tambahan! 💪🔥";
        }
    } elseif ($session === 'siang') {
        if ($needs_alert) {
            $msg .= "☀️ *UPDATE SPK & DO SIANG ({$time_siang} WIB) - AI SENTINEL* ☀️\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🎯 *Target Minimal SPK*: Minimal *{$min} SPK*\n";
            $msg .= "📊 *Capaian Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "📋 *PROGRESS MONITORING PER TIM SPV:*\n\n";

            foreach ($under_by_spv as $spv_name => $sales_list) {
                $cnt_spv = count($sales_list);
                $msg .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Monitoring SPK):\n";

                $no_spv = 1;
                foreach ($sales_list as $u) {
                    $msg .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']} SPK* (Min: {$u['min_required']} | Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']} DO*\n";
                    $no_spv++;
                }

                $msg .= "   💡 *Status Siang Tim {$spv_name}*: SPV {$spv_name} mohon pantau progress follow-up siang. Dorong penutupan transaksi prospek hangat sebelum sore.\n\n";
            }

            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            if (count($on_track) > 0) {
                $msg .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales aman.\n\n";
            }

            $msg .= "📌 *REKOMENDASI SIANG KEPALA CABANG:*\n";
            $msg .= "1. Cek progress follow-up siang tim SPV terhadap konsumen prospek hangat.\n";
            $msg .= "2. Pastikan pengiriman unit DO yang dijadwalkan hari ini berjalan lancar.";
        } else {
            $msg .= "✅ *UPDATE SPK & DO SIANG ({$time_siang} WIB): PERFORMA OPTIMAL* ✅\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🎯 *Target Minimal SPK*: Minimal *{$min} SPK*\n";
            $msg .= "📊 *Capaian Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "Yth. Bapak Kepala Cabang,\n";
            $msg .= "Performa cabang hingga siang ini sangat baik. Seluruh sales telah memenuhi standar ritme SPK. Kinerja operasional cabang berjalan lancar! 👍🔥";
        }
    } else {
        if ($needs_alert) {
            $msg .= "🌆 *UPDATE CLOSING SORE ({$time_sore} WIB) - AI SENTINEL* 🌆\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🎯 *Target Minimal SPK*: Minimal *{$min} SPK*\n";
            $msg .= "🏆 *Hasil Closing Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "📋 *REKAP CLOSING SORE PER TIM SPV:*\n\n";

            foreach ($under_by_spv as $spv_name => $sales_list) {
                $cnt_spv = count($sales_list);
                $msg .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Perlu Perhatian Besok):\n";

                $no_spv = 1;
                foreach ($sales_list as $u) {
                    $msg .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']} SPK* (Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']} DO*\n";
                    $no_spv++;
                }

                $msg .= "   💡 *Evaluasi Sore Tim {$spv_name}*: Wajib evaluasi komprehensif bersama tim {$spv_name} untuk menyusun prioritas prospek esok pagi.\n\n";
            }

            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            if (count($on_track) > 0) {
                $msg .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales tuntas.\n\n";
            }

            $msg .= "📌 *REKOMENDASI CLOSING SORE KEPALA CABANG:*\n";
            $msg .= "1. Rekap hasil perolehan SPK harian & evaluasi hambatan penutupan prospek bersama SPV.\n";
            $msg .= "2. Pastikan input SPK baru dan jadwal serah terima unit DO esok hari sudah terverifikasi.";
        } else {
            $msg .= "✅ *UPDATE CLOSING SORE ({$time_sore} WIB): TARGET MINIMAL TERPENUHI* ✅\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n";
            $msg .= "📅 *Tanggal*: {$periode_str}\n";
            $msg .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice})\n";
            $msg .= "🏆 *Hasil Closing Hari Ini*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
            $msg .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
            $msg .= "Yth. Bapak Kepala Cabang,\n";
            $msg .= "Closing harian cabang berjalan sukses! Seluruh wiraniaga berhasil memenuhi standar ritme SPK untuk periode ini. Terima kasih atas kepemimpinan Anda! 🎉💪";
        }
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

$report = getInternalSentinelReport($conn, $current_day, $current_month, $current_year, $session);
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

// 7. Catat Log ke Database (Termasuk Kolom Session)
$now_str = date('Y-m-d H:i:s');
$today_str = date('Y-m-d');
$status_log = ($http_status === 200) ? 'Sent' : 'Failed';

if ($conn) {
    $stmt = $conn->prepare("INSERT INTO tabel_ai_sentinel_logs 
        (periode_tanggal, session, hari_ke, periode_slice, min_required, underperforming_count, on_track_count, report_message, sent_to_wa, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssiiiiisss", $today_str, $session, $current_day, $report['slice'], $report['min'], $report['underperforming_count'], $report['on_track_count'], $wa_message, $clean_phone, $status_log);
        $stmt->execute();
        $stmt->close();
    }

    $conn->query("UPDATE tabel_sentinel_settings SET last_sent_at = '$now_str', last_sent_status = '$status_log' WHERE id = 1");
}

$wa_url = "https://api.whatsapp.com/send?phone=" . $clean_phone . "&text=" . urlencode($wa_message);

$sched_time_display = ($session === 'pagi' ? $settings['schedule_time_pagi'] : ($session === 'siang' ? $settings['schedule_time_siang'] : $settings['schedule_time_sore'])) . " WIB";

echo json_encode([
    "status" => "success",
    "session" => $session,
    "scheduled_time" => $sched_time_display,
    "executed_at" => $now_str,
    "target_kacab_wa" => $clean_phone,
    "underperforming_sales_count" => $report['underperforming_count'],
    "dispatch_result" => $dispatch_result,
    "wa_share_url" => $wa_url,
    "settings" => $settings
]);

if ($conn) $conn->close();
exit();
