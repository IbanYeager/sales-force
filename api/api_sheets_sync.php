<?php
// api/api_sheets_sync.php
// Engine Sinkronisasi 2 Arah Google Spreadsheet (SPK & DO) <-> SFT MySQL Database
// Spreadsheet ID: 1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs

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

// Pastikan tabel sync log & config ada
if ($conn && !$conn->connect_error) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_sheets_sync_config (
        id INT PRIMARY KEY DEFAULT 1,
        spreadsheet_url VARCHAR(255) DEFAULT 'https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?usp=sharing',
        spreadsheet_id VARCHAR(100) DEFAULT '1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs',
        apps_script_webhook_url TEXT,
        auto_sync_enabled INT DEFAULT 1,
        last_sync_at DATETIME DEFAULT NULL,
        last_sync_status VARCHAR(50) DEFAULT 'Ready',
        last_sync_summary TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("INSERT IGNORE INTO tabel_sheets_sync_config (id, spreadsheet_id, auto_sync_enabled) 
                  VALUES (1, '1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs', 1)");
}

// Helper: Normalisasi Nama untuk Matching
function normalizeName($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9]/', '', $str);
    return $str;
}

// Function Utama: Tarik Data dari Google Spreadsheet dan Simpan ke DB
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

    // Ambil seluruh akun sales di database untuk pencocokan
    $sales_map = [];
    $res_sales = $conn->query("SELECT id, username, nama_lengkap, nama_spv, tingkatan FROM sales_accounts");
    if ($res_sales) {
        while ($row = $res_sales->fetch_assoc()) {
            $spv_key = normalizeName($row['nama_spv']);
            $norm = normalizeName($row['nama_lengkap']);
            $user_norm = normalizeName($row['username']);

            $sales_map[$spv_key . '_' . $norm] = $row;
            $sales_map[$spv_key . '_' . $user_norm] = $row;
            if (!isset($sales_map[$norm])) $sales_map[$norm] = $row;
            if (!isset($sales_map[$user_norm])) $sales_map[$user_norm] = $row;
        }
    }

    $current_spv = "Pak Ryan";
    $synced_rows = [];
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
        $no = intval($col0);
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

        // Cari sales di database (prioritas kecocokan dengan SPV saat ini)
        $norm_name = normalizeName($nama_sales);
        $cur_spv_key = normalizeName($current_spv);
        $sales_id = null;

        if (isset($sales_map[$cur_spv_key . '_' . $norm_name])) {
            $matched = $sales_map[$cur_spv_key . '_' . $norm_name];
            $sales_id = intval($matched['id']);
        } elseif (isset($sales_map[$norm_name])) {
            $matched = $sales_map[$norm_name];
            $sales_id = intval($matched['id']);
        } else {
            // Coba pencarian LIKE
            $q_find = $conn->query("SELECT id FROM sales_accounts WHERE (nama_lengkap LIKE '%$nama_sales%' OR username LIKE '%$nama_sales%') AND (nama_spv = '$current_spv' OR nama_spv LIKE '%" . str_replace('Pak ', '', $current_spv) . "%') LIMIT 1");
            if ($q_find && $f = $q_find->fetch_assoc()) {
                $sales_id = intval($f['id']);
            }
        }

        if ($sales_id) {
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
    }

    $now_str = date('Y-m-d H:i:s');
    $summary = "Berhasil sinkronisasi " . count($synced_rows) . " sales dari Google Sheets (Total SPK: $total_spk, Total DO: $total_do)";
    
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
        'data' => $synced_rows
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

    // Push ke Webhook Google Apps Script jika disetel
    if ($action === 'push') {
        $raw = file_get_contents("php://input");
        $postData = json_decode($raw, true);

        $res_cfg = $conn->query("SELECT apps_script_webhook_url FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
        $webhook_url = $res_cfg ? $res_cfg->fetch_assoc()['apps_script_webhook_url'] : '';

        if (empty($webhook_url)) {
            echo json_encode([
                'status' => 'info',
                'message' => 'Google Apps Script Webhook URL belum dikonfigurasi. Data tersimpan di web SFT.',
                'app_script_guide' => 'Gunakan template Google Apps Script yang disediakan di WhatsApp Studio untuk menghubungkan push otomatis.'
            ]);
            if ($conn) $conn->close();
            exit();
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $webhook_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($postData),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 20
        ]);
        $resp = curl_exec($ch);
        curl_close($ch);

        echo json_encode([
            'status' => 'success',
            'message' => 'Data berhasil dikirim ke Google Spreadsheet via Apps Script Webhook!',
            'response' => $resp
        ]);
        if ($conn) $conn->close();
        exit();
    }

    echo json_encode(['status' => 'error', 'message' => 'Aksi tidak valid']);
    if ($conn) $conn->close();
    exit();
}
