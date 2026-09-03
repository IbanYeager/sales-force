<?php
// api/api_sheets_sync.php
// Engine Sinkronisasi 2 Arah Google Spreadsheet (SPK & DO) <-> SFT MySQL Database
// Mendukung Spreadsheet Rekap 12-Bulan (Januari - Desember) dan Format Bulanan Standar
// Spreadsheet Rekap ID: 1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc

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

$SPREADSHEET_ID = "1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc";
$CSV_EXPORT_URL = "https://docs.google.com/spreadsheets/d/{$SPREADSHEET_ID}/gviz/tq?tqx=out:csv";
$APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwg7iocmbSQeqHekaheVs3Co4DZ5-azv37f-CmSbOETyQLgFyEGph5_j1CySWbn3IHJ/exec";

// Pastikan tabel sync log & config ada serta kolom is_active di sales_accounts
if ($conn && !$conn->connect_error) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_sheets_sync_config (
        id INT PRIMARY KEY DEFAULT 1,
        spreadsheet_url VARCHAR(255) DEFAULT 'https://docs.google.com/spreadsheets/d/1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc/edit?usp=sharing',
        spreadsheet_id VARCHAR(100) DEFAULT '1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc',
        apps_script_webhook_url TEXT,
        auto_sync_enabled INT DEFAULT 1,
        last_sync_at DATETIME DEFAULT NULL,
        last_sync_status VARCHAR(50) DEFAULT 'Ready',
        last_sync_summary TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("INSERT INTO tabel_sheets_sync_config (id, spreadsheet_id, spreadsheet_url, apps_script_webhook_url, auto_sync_enabled) 
                  VALUES (1, '$SPREADSHEET_ID', 'https://docs.google.com/spreadsheets/d/1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc/edit?usp=sharing', '$APPS_SCRIPT_URL', 1)
                  ON DUPLICATE KEY UPDATE 
                    spreadsheet_id = '$SPREADSHEET_ID',
                    spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1mWrUtYNW5Q8_hiPLMmJzCUlfgP4o-4cB2VsEx8nqqjc/edit?usp=sharing'");

    try {
        $conn->query("ALTER TABLE sales_accounts ADD COLUMN is_active INT DEFAULT 1");
    } catch(Exception $e) {}
}

// Helper: Normalisasi Nama untuk Matching
function normalizeName($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9]/', '', $str);
    return $str;
}

// Function 1: TARIK DATA DARI GOOGLE SPREADSHEET KE DATABASE SFT
// Mendukung Spreadsheet Rekap 12-Bulan (Januari s/d Desember) & Format Standar Bulanan
function syncGoogleSheetsToDb($conn, $month = null, $year = null) {
    global $SPREADSHEET_ID, $CSV_EXPORT_URL;

    if (!$month) $month = intval(date('n'));
    if (!$year) $year = intval(date('Y'));

    // Ambil URL/ID Spreadsheet dari Database jika ada
    $fetch_url = $CSV_EXPORT_URL;
    if ($conn) {
        $res_cfg = $conn->query("SELECT spreadsheet_id FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
        if ($res_cfg && $c_row = $res_cfg->fetch_assoc()) {
            if (!empty($c_row['spreadsheet_id'])) {
                $s_id = trim($c_row['spreadsheet_id']);
                $fetch_url = "https://docs.google.com/spreadsheets/d/{$s_id}/gviz/tq?tqx=out:csv";
            }
        }
    }

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $fetch_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT => 25
    ]);
    $csvData = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if (!$csvData || $httpCode !== 200) {
        return [
            'status' => 'error',
            'message' => 'Gagal mengambil data dari Google Spreadsheet: ' . ($curlErr ?: "HTTP $httpCode")
        ];
    }

    $lines = preg_split('/\r\n|\r|\n/', trim($csvData));
    if (empty($lines)) {
        return [
            'status' => 'error',
            'message' => 'File spreadsheet kosong atau tidak dapat di-parse.'
        ];
    }

    // Ambil seluruh akun sales di database untuk pencocokan
    $sales_map = [];
    $res_sales = $conn->query("SELECT id, username, nama_lengkap, nama_spv, tingkatan, is_active FROM sales_accounts");
    if ($res_sales) {
        while ($row = $res_sales->fetch_assoc()) {
            $spv_key = normalizeName($row['nama_spv']);
            $norm = normalizeName($row['nama_lengkap']);
            $user_norm = normalizeName($row['username']);
            $clean_name = normalizeName(preg_replace('/\s*\(.*?\)\s*/', '', $row['nama_lengkap']));

            $sales_map[$spv_key . '_' . $norm] = $row;
            $sales_map[$spv_key . '_' . $clean_name] = $row;
            $sales_map[$spv_key . '_' . $user_norm] = $row;
            if (!isset($sales_map[$norm])) $sales_map[$norm] = $row;
            if (!isset($sales_map[$clean_name])) $sales_map[$clean_name] = $row;
            if (!isset($sales_map[$user_norm])) $sales_map[$user_norm] = $row;
        }
    }

    // Daftar alias nama untuk akurasi 100%
    $aliases = [
        'pakryan_denia' => 'denia',
        'pakryan_denis' => 'denis',
        'pakalvin_ardian' => 'abdian',
        'pakalvin_udil' => 'udu',
        'pakalvin_yeni' => 'yenni',
        'pakriva_reny' => 'reni'
    ];

    // Target baseline default jika belum ada target khusus
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

    // Cek apakah format spreadsheet adalah Rekap 12-Bulan (Januari - Desember)
    $header_preview = ($lines[0] ?? '') . ' ' . ($lines[1] ?? '') . ' ' . ($lines[2] ?? '');
    $is_12_month_rekap = (stripos($header_preview, 'Januari') !== false && stripos($header_preview, 'Desember') !== false);

    $current_spv = "Pak Ryan";
    $synced_rows = [];
    $active_sheet_ids = [];
    $teams_breakdown = [];
    $total_spk = 0;
    $total_do = 0;
    $total_target_spk = 0;
    $total_target_do = 0;
    $recap_months_synced = [];

    if ($is_12_month_rekap) {
        // ── MODE A: PARSER SPREADSHEET REKAP 12-BULAN ──
        foreach ($lines as $lineIdx => $line) {
            if (trim($line) === '') continue;
            $cols = str_getcsv($line);

            // Deteksi SPV berdasarkan section dan nomor baris
            if ($lineIdx >= 1 && $lineIdx <= 20) {
                $current_spv = "Pak Ryan";
            } elseif ($lineIdx >= 25 && $lineIdx <= 33) {
                $current_spv = "Pak Riva";
            } elseif ($lineIdx >= 38 && $lineIdx <= 55) {
                $current_spv = "Pak Alvin";
            } else {
                continue; // Header, Total, atau baris kosong
            }

            $nama_sales = trim($cols[1] ?? '');
            if (empty($nama_sales) || $nama_sales === 'Sales' || stripos($nama_sales, 'Total') !== false) continue;

            $cur_spv_key = normalizeName($current_spv);
            $norm_name = normalizeName($nama_sales);

            $matched = null;
            $lookup_key = $cur_spv_key . '_' . $norm_name;

            if (isset($sales_map[$lookup_key])) {
                $matched = $sales_map[$lookup_key];
            } elseif (isset($aliases[$lookup_key]) && isset($sales_map[$cur_spv_key . '_' . $aliases[$lookup_key]])) {
                $matched = $sales_map[$cur_spv_key . '_' . $aliases[$lookup_key]];
            } elseif (isset($sales_map[$norm_name])) {
                $matched = $sales_map[$norm_name];
            }

            $sales_id = null;
            if ($matched) {
                $sales_id = intval($matched['id']);
                $conn->query("UPDATE sales_accounts SET nama_spv = '$current_spv', is_active = 1 WHERE id = $sales_id");
            } else {
                // Auto-create akun jika ada anggota baru di spreadsheet
                $safe_spv_code = strtolower(str_replace('Pak ', '', $current_spv));
                $username = $norm_name . ($safe_spv_code ? '_' . $safe_spv_code : '');
                $c_usr = $conn->query("SELECT id FROM sales_accounts WHERE username = '$username'");
                if ($c_usr && $c_usr->num_rows > 0) {
                    $username .= '_' . rand(10, 99);
                }
                $pass_hash = md5('123456');
                $conn->query("INSERT INTO sales_accounts (username, password, nama_lengkap, tingkatan, nama_spv, is_active) 
                              VALUES ('$username', '$pass_hash', '$nama_sales', 'Executive', '$current_spv', 1)");
                $sales_id = $conn->insert_id;
                $matched = ['id' => $sales_id, 'username' => $username, 'nama_lengkap' => $nama_sales, 'nama_spv' => $current_spv];
                $sales_map[$lookup_key] = $matched;
            }

            $active_sheet_ids[] = $sales_id;

            // Target baseline
            $tgt_spk = 3;
            $tgt_do = 2;
            $wb_key = str_replace(['_', ' '], '', $norm_name);
            if (isset($whiteboard_targets[$wb_key])) {
                $tgt_spk = $whiteboard_targets[$wb_key]['target_spk'];
                $tgt_do = $whiteboard_targets[$wb_key]['target_do'];
            }

            // Sync seluruh bulan (1 s/d 12) yang memiliki data di spreadsheet
            $actual_spk_target_month = 0;
            $actual_do_target_month = 0;

            for ($m = 1; $m <= 12; $m++) {
                $col_spk = ($m - 1) * 2 + 2;
                $col_do = ($m - 1) * 2 + 3;

                $raw_spk = trim($cols[$col_spk] ?? '');
                $raw_do = trim($cols[$col_do] ?? '');

                // Jika kolom bulan ini ada isi angka atau ini adalah bulan yang sedang diminta
                if ($raw_spk !== '' || $raw_do !== '' || $m === $month) {
                    $val_spk = ($raw_spk !== '' && is_numeric($raw_spk)) ? intval($raw_spk) : 0;
                    $val_do = ($raw_do !== '' && is_numeric($raw_do)) ? intval($raw_do) : 0;

                    $sql = "INSERT INTO target_do_bulanan 
                            (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, is_manual_spk, is_manual_do, is_manual_target_spk, is_manual_target_do)
                            VALUES ($sales_id, $m, $year, $tgt_spk, $tgt_do, $val_spk, $val_do, 1, 1, 1, 1)
                            ON DUPLICATE KEY UPDATE 
                            realisasi_spk = $val_spk, 
                            realisasi_do = $val_do,
                            is_manual_spk = 1,
                            is_manual_do = 1";
                    $conn->query($sql);

                    if (!in_array($m, $recap_months_synced)) {
                        $recap_months_synced[] = $m;
                    }

                    if ($m === $month) {
                        $actual_spk_target_month = $val_spk;
                        $actual_do_target_month = $val_do;
                    }
                }
            }

            // Catat agregat untuk bulan yang dipilih
            $total_spk += $actual_spk_target_month;
            $total_do += $actual_do_target_month;
            $total_target_spk += $tgt_spk;
            $total_target_do += $tgt_do;

            if (!isset($teams_breakdown[$current_spv])) {
                $teams_breakdown[$current_spv] = [
                    'spv' => $current_spv,
                    'total_sales' => 0,
                    'target_spk' => 0,
                    'target_do' => 0,
                    'actual_spk' => 0,
                    'actual_do' => 0
                ];
            }
            $teams_breakdown[$current_spv]['total_sales']++;
            $teams_breakdown[$current_spv]['target_spk'] += $tgt_spk;
            $teams_breakdown[$current_spv]['target_do'] += $tgt_do;
            $teams_breakdown[$current_spv]['actual_spk'] += $actual_spk_target_month;
            $teams_breakdown[$current_spv]['actual_do'] += $actual_do_target_month;

            $synced_rows[] = [
                'sales_id' => $sales_id,
                'nama' => $nama_sales,
                'spv' => $current_spv,
                'target_spk' => $tgt_spk,
                'target_do' => $tgt_do,
                'actual_spk' => $actual_spk_target_month,
                'actual_do' => $actual_do_target_month
            ];
        }

    } else {
        // ── MODE B: FALLBACK PARSER FORMAT STANDAR BULANAN ──
        foreach ($lines as $line) {
            if (trim($line) === '') continue;
            $cols = str_getcsv($line);

            $col0 = trim($cols[0] ?? '');
            $col1 = trim($cols[1] ?? '');

            if (stripos($col0, 'Pak Ryan') !== false || stripos($col1, 'Pak Ryan') !== false) {
                $current_spv = "Pak Ryan"; continue;
            } elseif (stripos($col0, 'Pak Alvin') !== false || stripos($col1, 'Pak Alvin') !== false) {
                $current_spv = "Pak Alvin"; continue;
            } elseif (stripos($col0, 'Pak Riva') !== false || stripos($col1, 'Pak Riva') !== false) {
                $current_spv = "Pak Riva"; continue;
            }

            if (stripos($col0, 'No') !== false || stripos($col0, 'Jumlah') !== false || stripos($col0, 'Total') !== false || stripos($col1, 'Sales') !== false) {
                continue;
            }

            $nama_sales = trim($cols[1] ?? '');
            if (empty($nama_sales)) continue;

            $target_spk = intval(trim($cols[2] ?? '0'));
            $target_do = intval(trim($cols[3] ?? '0'));
            $actual_spk = intval(trim($cols[4] ?? '0'));
            $actual_do = intval(trim($cols[5] ?? '0'));

            $total_spk += $actual_spk;
            $total_do += $actual_do;
            $total_target_spk += $target_spk;
            $total_target_do += $target_do;

            if (!isset($teams_breakdown[$current_spv])) {
                $teams_breakdown[$current_spv] = [
                    'spv' => $current_spv,
                    'total_sales' => 0,
                    'target_spk' => 0,
                    'target_do' => 0,
                    'actual_spk' => 0,
                    'actual_do' => 0
                ];
            }
            $teams_breakdown[$current_spv]['total_sales']++;
            $teams_breakdown[$current_spv]['target_spk'] += $target_spk;
            $teams_breakdown[$current_spv]['target_do'] += $target_do;
            $teams_breakdown[$current_spv]['actual_spk'] += $actual_spk;
            $teams_breakdown[$current_spv]['actual_do'] += $actual_do;

            $norm_name = normalizeName($nama_sales);
            $cur_spv_key = normalizeName($current_spv);
            $matched = null;

            if (isset($sales_map[$cur_spv_key . '_' . $norm_name])) {
                $matched = $sales_map[$cur_spv_key . '_' . $norm_name];
            } elseif (isset($aliases[$cur_spv_key . '_' . $norm_name]) && isset($sales_map[$cur_spv_key . '_' . $aliases[$cur_spv_key . '_' . $norm_name]])) {
                $matched = $sales_map[$cur_spv_key . '_' . $aliases[$cur_spv_key . '_' . $norm_name]];
            } elseif (isset($sales_map[$norm_name])) {
                $matched = $sales_map[$norm_name];
            }

            $sales_id = null;
            if ($matched) {
                $sales_id = intval($matched['id']);
                $conn->query("UPDATE sales_accounts SET nama_spv = '$current_spv', is_active = 1 WHERE id = $sales_id");
            } else {
                $safe_spv_code = strtolower(str_replace('Pak ', '', $current_spv));
                $username = $norm_name . ($safe_spv_code ? '_' . $safe_spv_code : '');
                $c_usr = $conn->query("SELECT id FROM sales_accounts WHERE username = '$username'");
                if ($c_usr && $c_usr->num_rows > 0) {
                    $username .= '_' . rand(10, 99);
                }
                $pass_hash = md5('123456');
                $conn->query("INSERT INTO sales_accounts (username, password, nama_lengkap, tingkatan, nama_spv, is_active) 
                              VALUES ('$username', '$pass_hash', '$nama_sales', 'Executive', '$current_spv', 1)");
                $sales_id = $conn->insert_id;
                $sales_map[$cur_spv_key . '_' . $norm_name] = [
                    'id' => $sales_id,
                    'username' => $username,
                    'nama_lengkap' => $nama_sales,
                    'nama_spv' => $current_spv
                ];
            }

            $active_sheet_ids[] = $sales_id;

            $sql = "INSERT INTO target_do_bulanan 
                    (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, is_manual_spk, is_manual_do, is_manual_target_spk, is_manual_target_do) 
                    VALUES ($sales_id, $month, $year, $target_spk, $target_do, $actual_spk, $actual_do, 1, 1, 1, 1)
                    ON DUPLICATE KEY UPDATE 
                    target_spk = $target_spk,
                    target_do = $target_do,
                    realisasi_spk = $actual_spk,
                    realisasi_do = $actual_do,
                    is_manual_spk = 1,
                    is_manual_do = 1";
            $conn->query($sql);

            $synced_rows[] = [
                'sales_id' => $sales_id,
                'nama' => $nama_sales,
                'spv' => $current_spv,
                'target_spk' => $target_spk,
                'target_do' => $target_do,
                'actual_spk' => $actual_spk,
                'actual_do' => $actual_do
            ];
        }
    }

    // Update status aktif sales
    if (!empty($active_sheet_ids)) {
        $id_list_str = implode(',', $active_sheet_ids);
        $conn->query("UPDATE sales_accounts SET is_active = 0 WHERE id NOT IN ($id_list_str)");
    }

    $nama_bulan_list = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];
    $bulan_str = $nama_bulan_list[$month] ?? "Bulan ke-$month";

    $now_str = date('Y-m-d H:i:s');
    $summary = "Berhasil sinkronisasi " . count($synced_rows) . " wiraniaga dari Spreadsheet Rekap Tahunan untuk $bulan_str $year (Total: $total_spk SPK | $total_do DO)";
    if (!empty($recap_months_synced)) {
        sort($recap_months_synced);
        $m_names = array_map(function($m_num) use ($nama_bulan_list) { return $nama_bulan_list[$m_num] ?? $m_num; }, $recap_months_synced);
        $summary .= ". Bulan tersinkron: " . implode(', ', $m_names);
    }
    
    $conn->query("UPDATE tabel_sheets_sync_config SET 
        last_sync_at = '$now_str',
        last_sync_status = 'Success',
        last_sync_summary = '$summary'
        WHERE id = 1");

    return [
        'status' => 'success',
        'message' => $summary,
        'timestamp' => $now_str,
        'month' => $month,
        'month_name' => $bulan_str,
        'year' => $year,
        'synced_count' => count($synced_rows),
        'recap_months_synced' => $recap_months_synced,
        'totals' => [
            'total_target_spk' => $total_target_spk,
            'total_target_do' => $total_target_do,
            'total_actual_spk' => $total_spk,
            'total_actual_do' => $total_do
        ],
        'teams' => $teams_breakdown,
        'data' => $synced_rows
    ];
}

// Function 2: KIRIM DATA DARI SFT WEB KE GOOGLE SPREADSHEET (PUSH SATU SALES)
function pushTargetToGoogleSheets($conn, $sales_id, $target_spk, $target_do, $realisasi_spk, $realisasi_do) {
    global $APPS_SCRIPT_URL;
    if (!$conn || !$sales_id) return false;
    
    $q_sales = $conn->query("SELECT nama_lengkap, username, nama_spv FROM sales_accounts WHERE id = " . intval($sales_id) . " LIMIT 1");
    if (!$q_sales || $q_sales->num_rows === 0) return false;
    
    $sales = $q_sales->fetch_assoc();
    $nama_sales = $sales['nama_lengkap'];
    $nama_spv = $sales['nama_spv'];
    
    $clean_nama = preg_replace('/\s*\(.*?\)\s*/', '', $nama_sales);

    $webhook_url = $APPS_SCRIPT_URL;
    $res_cfg = $conn->query("SELECT apps_script_webhook_url FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
    if ($res_cfg && $c_row = $res_cfg->fetch_assoc()) {
        if (!empty($c_row['apps_script_webhook_url'])) {
            $webhook_url = $c_row['apps_script_webhook_url'];
        }
    }
    
    $payload = [
        'action' => 'update_sales',
        'spv' => $nama_spv,
        'nama_sales' => $clean_nama,
        'full_name' => $nama_sales,
        'username' => $sales['username'],
        'target_spk' => intval($target_spk),
        'target_do' => intval($target_do),
        'actual_spk' => intval($realisasi_spk),
        'actual_do' => intval($realisasi_do),
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $webhook_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 10
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'success' => ($code === 200),
        'response' => $resp
    ];
}

// Function 3: KIRIM SELURUH DATA DATABASE KE GOOGLE SPREADSHEET (PUSH ALL)
function pushAllTargetsToGoogleSheets($conn, $month = null, $year = null) {
    global $APPS_SCRIPT_URL;
    if (!$month) $month = intval(date('n'));
    if (!$year) $year = intval(date('Y'));

    $webhook_url = $APPS_SCRIPT_URL;
    $res_cfg = $conn->query("SELECT apps_script_webhook_url FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
    if ($res_cfg && $c_row = $res_cfg->fetch_assoc()) {
        if (!empty($c_row['apps_script_webhook_url'])) {
            $webhook_url = $c_row['apps_script_webhook_url'];
        }
    }

    $sales_data = [];
    $query = "SELECT s.id, s.nama_lengkap, s.username, s.nama_spv,
                     COALESCE(t.target_spk, 0) as target_spk,
                     COALESCE(t.target_do, 0) as target_do,
                     COALESCE(t.realisasi_spk, 0) as actual_spk,
                     COALESCE(t.realisasi_do, 0) as actual_do
              FROM sales_accounts s
              LEFT JOIN target_do_bulanan t ON s.id = t.sales_account_id AND t.periode_bulan = $month 
              WHERE s.is_active = 1
              ORDER BY s.nama_spv ASC, s.nama_lengkap ASC";
    
    $res = $conn->query($query);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $clean_nama = preg_replace('/\s*\(.*?\)\s*/', '', $row['nama_lengkap']);
            $sales_data[] = [
                'sales_id' => intval($row['id']),
                'nama_sales' => $clean_nama,
                'full_name' => $row['nama_lengkap'],
                'username' => $row['username'],
                'spv' => $row['nama_spv'],
                'target_spk' => intval($row['target_spk']),
                'target_do' => intval($row['target_do']),
                'actual_spk' => intval($row['actual_spk']),
                'actual_do' => intval($row['actual_do'])
            ];
        }
    }

    $payload = [
        'action' => 'batch_update',
        'month' => $month,
        'year' => $year,
        'timestamp' => date('Y-m-d H:i:s'),
        'sales_count' => count($sales_data),
        'data' => $sales_data
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $webhook_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 25
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'status' => ($code === 200) ? 'success' : 'error',
        'message' => ($code === 200) ? 'Seluruh target berhasil di-push ke Google Spreadsheet!' : "Gagal push ke Spreadsheet (HTTP $code)",
        'count' => count($sales_data),
        'response' => $resp
    ];
}

// Execute Routing jika file dipanggil langsung via HTTP
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'api_sheets_sync.php') {
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : 'pull');

    if ($action === 'pull' || $action === 'sync' || $action === 'sync_all') {
        $month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
        $year = isset($_GET['tahun']) ? intval($_GET['tahun']) : intval(date('Y'));
        $res = syncGoogleSheetsToDb($conn, $month, $year);
        echo json_encode($res);
        if ($conn) $conn->close();
        exit();
    }

    if ($action === 'push_all') {
        $month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
        $year = isset($_GET['tahun']) ? intval($_GET['tahun']) : intval(date('Y'));
        $res = pushAllTargetsToGoogleSheets($conn, $month, $year);
        echo json_encode($res);
        if ($conn) $conn->close();
        exit();
    }

    if ($action === 'push_single') {
        $data = json_decode(file_get_contents("php://input"), true) ?: $_POST;
        $sales_id = intval($data['sales_id'] ?? 0);
        $target_spk = intval($data['target_spk'] ?? 0);
        $target_do = intval($data['target_do'] ?? 0);
        $actual_spk = intval($data['actual_spk'] ?? 0);
        $actual_do = intval($data['actual_do'] ?? 0);

        $res = pushTargetToGoogleSheets($conn, $sales_id, $target_spk, $target_do, $actual_spk, $actual_do);
        echo json_encode(['status' => $res ? 'success' : 'error', 'data' => $res]);
        if ($conn) $conn->close();
        exit();
    }

    if ($action === 'status') {
        $res_cfg = $conn->query("SELECT * FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
        $cfg = $res_cfg ? $res_cfg->fetch_assoc() : [];
        echo json_encode([
            'status' => 'success',
            'config' => $cfg
        ]);
        if ($conn) $conn->close();
        exit();
    }

    echo json_encode(['status' => 'error', 'message' => 'Aksi tidak valid']);
    if ($conn) $conn->close();
    exit();
}
?>
