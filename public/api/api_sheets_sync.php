<?php
// api/api_sheets_sync.php
// Engine Sinkronisasi 2 Arah Google Spreadsheet (SPK & DO) <-> SFT MySQL Database
// Spreadsheet ID: 1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs
// Apps Script Webhook: https://script.google.com/macros/s/AKfycbzBG8ZTlJ2qR-7NY2uZvKqdiu9c43DgEKOZbU3ig19XvU1D9VxvzxMx3-ZWfD3r9QpT/exec

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

$SPREADSHEET_ID = "1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs";
$CSV_EXPORT_URL = "https://docs.google.com/spreadsheets/d/{$SPREADSHEET_ID}/export?format=csv";
$APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwg7iocmbSQeqHekaheVs3Co4DZ5-azv37f-CmSbOETyQLgFyEGph5_j1CySWbn3IHJ/exec";

// Pastikan tabel sync log & config ada serta kolom is_active di sales_accounts
if ($conn && !$conn->connect_error) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_sheets_sync_config (
        id INT PRIMARY KEY DEFAULT 1,
        spreadsheet_url VARCHAR(255) DEFAULT 'https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?gid=0#gid=0',
        spreadsheet_id VARCHAR(100) DEFAULT '1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs',
        apps_script_webhook_url TEXT,
        auto_sync_enabled INT DEFAULT 1,
        last_sync_at DATETIME DEFAULT NULL,
        last_sync_status VARCHAR(50) DEFAULT 'Ready',
        last_sync_summary TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("INSERT INTO tabel_sheets_sync_config (id, spreadsheet_id, apps_script_webhook_url, auto_sync_enabled) 
                  VALUES (1, '$SPREADSHEET_ID', '$APPS_SCRIPT_URL', 1)
                  ON DUPLICATE KEY UPDATE apps_script_webhook_url = '$APPS_SCRIPT_URL'");

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

// Function 1: TARIK DATA DARI GOOGLE SPREADSHEET KE DATABASE SFT (PULL DENGAN DYNAMIC MEMBER MANAGEMENT)
function syncGoogleSheetsToDb($conn, $month = null, $year = null) {
    global $CSV_EXPORT_URL;
    if (!$month) $month = intval(date('n'));
    if (!$year) $year = intval(date('Y'));

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $CSV_EXPORT_URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT => 20
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

    // Parse baris CSV
    $lines = preg_split('/\r\n|\r|\n/', trim($csvData));
    if (empty($lines)) {
        return [
            'status' => 'error',
            'message' => 'File spreadsheet kosong atau tidak dapat di-parse.'
        ];
    }

    // Ambil seluruh akun sales di database untuk pencocokan awal
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

    $current_spv = "Pak Ryan";
    $synced_rows = [];
    $active_sheet_ids = [];
    $teams_breakdown = [];
    $total_spk = 0;
    $total_do = 0;
    $total_target_spk = 0;
    $total_target_do = 0;

    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $cols = str_getcsv($line);

        $col0 = trim($cols[0] ?? '');
        $col1 = trim($cols[1] ?? '');

        // Deteksi Header SPV
        if (stripos($col0, 'Pak Ryan') !== false || stripos($col1, 'Pak Ryan') !== false) {
            $current_spv = "Pak Ryan";
            continue;
        } elseif (stripos($col0, 'Pak Alvin') !== false || stripos($col1, 'Pak Alvin') !== false) {
            $current_spv = "Pak Alvin";
            continue;
        } elseif (stripos($col0, 'Pak Riva') !== false || stripos($col1, 'Pak Riva') !== false) {
            $current_spv = "Pak Riva";
            continue;
        }

        // Lewati header kolom atau footer jumlah
        if (stripos($col0, 'No') !== false || stripos($col0, 'Jumlah') !== false || stripos($col0, 'Total') !== false || stripos($col1, 'Sales') !== false) {
            continue;
        }

        // Baris data wiraniaga (Format: No, Sales, Target SPK, Target DO, Actual SPK, Actual DO)
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

        // Cari sales di database
        $norm_name = normalizeName($nama_sales);
        $cur_spv_key = normalizeName($current_spv);
        $matched = null;

        if (isset($sales_map[$cur_spv_key . '_' . $norm_name])) {
            $matched = $sales_map[$cur_spv_key . '_' . $norm_name];
        } elseif ($norm_name === 'yeni' && isset($sales_map[$cur_spv_key . '_yenni'])) {
            $matched = $sales_map[$cur_spv_key . '_yenni'];
        } elseif (isset($sales_map[$norm_name])) {
            $matched = $sales_map[$norm_name];
        }

        $sales_id = null;
        if ($matched) {
            $sales_id = intval($matched['id']);
            // Pastikan nama_spv dan is_active terupdate
            $conn->query("UPDATE sales_accounts SET nama_spv = '$current_spv', is_active = 1 WHERE id = $sales_id");
        } else {
            // AUTO-CREATE JIKA ADA ANGGOTA BARU DI SPREADSHEET
            $safe_spv_code = strtolower(str_replace('Pak ', '', $current_spv));
            $base_user = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $nama_sales));
            $username = $base_user . ($safe_spv_code ? '_' . $safe_spv_code : '');
            
            $c_usr = $conn->query("SELECT id FROM sales_accounts WHERE username = '$username'");
            if ($c_usr && $c_usr->num_rows > 0) {
                $username .= '_' . rand(10, 99);
            }

            $pass_hash = md5('123456');
            $conn->query("INSERT INTO sales_accounts (username, password, nama_lengkap, tingkatan, nama_spv, is_active) 
                          VALUES ('$username', '$pass_hash', '$nama_sales', 'Executive', '$current_spv', 1)");
            $sales_id = $conn->insert_id;

            // Tambahkan ke map
            $sales_map[$cur_spv_key . '_' . $norm_name] = [
                'id' => $sales_id,
                'username' => $username,
                'nama_lengkap' => $nama_sales,
                'nama_spv' => $current_spv
            ];
        }

        $active_sheet_ids[] = $sales_id;

        // Update atau Insert ke tabel target_do_bulanan
        $cek = $conn->query("SELECT id_target_bulanan FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $month");
        if ($cek && $cek->num_rows > 0) {
            $id_target = intval($cek->fetch_assoc()['id_target_bulanan']);
            $conn->query("UPDATE target_do_bulanan SET 
                target_spk = $target_spk,
                target_do = $target_do,
                realisasi_spk = $actual_spk,
                realisasi_do = $actual_do,
                is_manual_spk = 1,
                is_manual_do = 1,
                is_manual_target_spk = 1,
                is_manual_target_do = 1,
                periode_tahun = $year
                WHERE id_target_bulanan = $id_target");
        } else {
            $conn->query("INSERT INTO target_do_bulanan 
                (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, is_manual_spk, is_manual_do, is_manual_target_spk, is_manual_target_do) 
                VALUES ($sales_id, $month, $year, $target_spk, $target_do, $actual_spk, $actual_do, 1, 1, 1, 1)");
        }

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

    // Nonaktifkan sales di DB yang sudah tidak terdaftar di spreadsheet saat ini
    if (!empty($active_sheet_ids)) {
        $id_list_str = implode(',', $active_sheet_ids);
        $conn->query("UPDATE sales_accounts SET is_active = 0 WHERE id NOT IN ($id_list_str)");
    }

    $now_str = date('Y-m-d H:i:s');
    $summary = "Berhasil sinkronisasi " . count($synced_rows) . " wiraniaga dari Google Sheets (Total: $total_spk SPK | $total_do DO)";
    
    $conn->query("UPDATE tabel_sheets_sync_config SET 
        last_sync_at = '$now_str',
        last_sync_status = 'Success',
        last_sync_summary = '$summary'
        WHERE id = 1");

    return [
        'status' => 'success',
        'message' => $summary,
        'timestamp' => $now_str,
        'synced_count' => count($synced_rows),
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
    
    // Clean name matching (e.g. 'Agus (Ryan)' -> 'Agus', 'Galih (Riva)' -> 'Galih')
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

    $q_all = $conn->query("SELECT s.id, s.nama_lengkap, s.nama_spv, s.username, 
                           COALESCE(t.target_spk, 0) as target_spk, 
                           COALESCE(t.target_do, 0) as target_do, 
                           COALESCE(t.realisasi_spk, 0) as realisasi_spk, 
                           COALESCE(t.realisasi_do, 0) as realisasi_do 
                           FROM sales_accounts s 
                           LEFT JOIN target_do_bulanan t ON s.id = t.sales_account_id AND t.periode_bulan = $month 
                           ORDER BY s.nama_spv, s.nama_lengkap ASC");

    $sales_data = [];
    if ($q_all) {
        while ($r = $q_all->fetch_assoc()) {
            $clean_nama = preg_replace('/\s*\(.*?\)\s*/', '', $r['nama_lengkap']);
            $sales_data[] = [
                'spv' => $r['nama_spv'],
                'nama_sales' => $clean_nama,
                'full_name' => $r['nama_lengkap'],
                'username' => $r['username'],
                'target_spk' => intval($r['target_spk']),
                'target_do' => intval($r['target_do']),
                'actual_spk' => intval($r['realisasi_spk']),
                'actual_do' => intval($r['realisasi_do'])
            ];
        }
    }

    $payload = [
        'action' => 'bulk_update',
        'sales_data' => $sales_data,
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

// Execute Routing only if this file is called directly as an HTTP endpoint
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'api_sheets_sync.php') {
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : 'pull');

    if ($action === 'pull' || $action === 'sync') {
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

