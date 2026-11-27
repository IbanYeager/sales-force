<?php
// api_followup_sync.php - 2-Way Google Sheet & Excel Sync Engine for SFT Follow-Up CRM
@ini_set('memory_limit', '512M');
@ini_set('max_execution_time', '300');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/api_followup_db.php';
require_once __DIR__ . '/api_radar_gazetteer.php';

// Helper clean phone
if (!function_exists('clean_phone_number')) {
    function clean_phone_number($phone) {
        $phone = preg_replace('/[^0-9]/', '', (string)$phone);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62' . $phone;
        }
        return $phone;
    }
}

// Helper JSON input
if (!function_exists('get_json_input')) {
    function get_json_input() {
        $raw = file_get_contents('php://input');
        return json_decode($raw, true) ?: [];
    }
}

// Helper: Territory Priority mapping by Kecamatan (Phase 1 Apr 2026)
if (!function_exists('get_territory_priority')) {
    function get_territory_priority($district) {
        $clean = preg_replace('/^(kecamatan|kec\.?)\s*/i', '', trim((string)$district));
        $norm = strtolower(preg_replace('/[^a-z]/i', '', $clean));
        if ($norm === '') return '';
        $p1 = ['andir', 'antapani', 'arcamanik', 'bojongloakidul', 'cidadap'];
        $p2 = ['buahbatu', 'ujungberung', 'kiaracondong'];
        $p3 = ['bandungkidul', 'bandungkulon', 'regol', 'sumurbandung', 'cibiru', 'batununggal'];
        $p4 = ['panyileukan', 'cicendo', 'rancasari', 'sukasari', 'coblong', 'lengkong', 'mandalajati', 'cibeunyingkaler', 'cibeunyingkidul', 'bojongloakaler', 'bandungwetan', 'babakanciparay', 'gedebage', 'cinambo', 'astanaanyar', 'sukajadi'];
        if (in_array($norm, $p1, true)) return 'Priority 1';
        if (in_array($norm, $p2, true)) return 'Priority 2';
        if (in_array($norm, $p3, true)) return 'Priority 3';
        if (in_array($norm, $p4, true)) return 'Priority 4';
        return '';
    }
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// -------------------------------------------------------------
// ROUTE: GET /api_followup_sync.php?action=get_settings
// -------------------------------------------------------------
if ($action === 'get_settings') {
    $rows = followup_query("SELECT setting_key, setting_value FROM followup_settings");
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['setting_key']] = $r['setting_value'];
    }

    $defaultSheet = 'https://docs.google.com/spreadsheets/d/1fvam5FfR1AIKKmv68RGf0dKy2lNpUv-dWc7sbqAe4k4/edit?gid=622548953#gid=622548953';
    $defaultScript = 'https://script.google.com/macros/s/AKfycbwIJPz6HNdNIrpNMnGNGS4c5Ojr0mLKoSTx9_fDTMVxmWey6OdGoMHXOxdA5sjvx_-v0w/exec';

    if (empty($settings['google_sheet_url'])) {
        $settings['google_sheet_url'] = $defaultSheet;
    }
    if (empty($settings['google_apps_script_url'])) {
        $settings['google_apps_script_url'] = $defaultScript;
    }

    echo json_encode(['success' => true, 'settings' => $settings]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=save_settings
// -------------------------------------------------------------
if ($action === 'save_settings') {
    $input = get_json_input();
    global $is_mysql, $conn;

    foreach ($input as $key => $val) {
        followup_execute("
            INSERT INTO followup_settings (setting_key, setting_value) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = ?
        ", [$key, $val, $val]);
    }

    echo json_encode(['success' => true, 'message' => 'Pengaturan sinkronisasi berhasil disimpan']);
    exit;
}

function sft_resolve_storage_dir() {
    $candidates = [
        dirname(__DIR__) . '/storage',
        dirname(__DIR__, 2) . '/storage',
        __DIR__
    ];
    foreach ($candidates as $dir) {
        if (is_dir($dir) && is_writable($dir)) {
            return $dir;
        }
    }
    $fallback = dirname(__DIR__) . '/storage';
    @mkdir($fallback, 0775, true);
    return is_writable($fallback) ? $fallback : __DIR__;
}

function sft_get_sync_state_path() {
    return sft_resolve_storage_dir() . '/sheet_fu_sync_state.json';
}

function sft_load_sync_state() {
    $path = sft_get_sync_state_path();
    if (!file_exists($path)) {
        return ['csv_hash' => '', 'last_checked_at' => 0, 'last_sync' => '', 'snapshots' => [], 'push_locks' => []];
    }
    $raw = @file_get_contents($path);
    $data = $raw ? @json_decode($raw, true) : null;
    if (!is_array($data)) {
        return ['csv_hash' => '', 'last_checked_at' => 0, 'last_sync' => '', 'snapshots' => [], 'push_locks' => []];
    }
    $data['snapshots'] = is_array($data['snapshots'] ?? null) ? $data['snapshots'] : [];
    $data['push_locks'] = is_array($data['push_locks'] ?? null) ? $data['push_locks'] : [];
    return $data;
}

function sft_save_sync_state($state) {
    $path = sft_get_sync_state_path();
    @file_put_contents($path, json_encode($state), LOCK_EX);
}

function sft_parse_sheet_bool($val) {
    $u = strtoupper(trim((string)$val));
    return in_array($u, ['1', 'TRUE', 'YA', 'IYA', 'YES'], true) ? 'TRUE' : 'FALSE';
}

function sft_derive_followup_state($connFlag, $contFlag, $prospFlag, $spkFlag, $remarks, $doUnit = 'FALSE') {
    $remLower = strtolower(trim((string)$remarks));
    if ($doUnit === 'TRUE' || $spkFlag === 'TRUE' || strpos($remLower, 'spk berhasil') !== false) {
        return 'Deal / Selesai';
    }
    if ($remLower === 'customer tertarik' || $prospFlag === 'TRUE') {
        return 'Tertarik / Jadwal Servis';
    }
    if ($remLower === 'customer menolak' || $remLower === 'customer tidak aktif') {
        return 'Tidak Tertarik';
    }
    if ($remLower === 'customer janjian' || $remLower === 'customer pending' || $remLower === 'menunggu respon' || $remLower === 'customer tidak diangkat' || $contFlag === 'TRUE' || $connFlag === 'TRUE') {
        return 'Menunggu Respon';
    }
    return 'Belum Dihubungi';
}

function sft_build_sales_matcher() {
    $salesDbRows = followup_query("SELECT id, username, nama_lengkap, nama_spv, is_active FROM sales_accounts ORDER BY is_active DESC, id ASC");
    $salesDbRows = is_array($salesDbRows) ? $salesDbRows : [];

    $salesLookup = [];
    foreach ($salesDbRows as $sAcc) {
        $sid = (int)$sAcc['id'];
        $sName = trim($sAcc['nama_lengkap'] ?? '');
        $uName = trim($sAcc['username'] ?? '');
        if (!$sName && !$uName) continue;
        $primaryName = $sName ?: $uName;

        if ($sName !== '') {
            $lowerFull = strtolower($sName);
            if (!isset($salesLookup[$lowerFull])) $salesLookup[$lowerFull] = ['id' => $sid, 'name' => $sName];
            $cleanParen = trim(preg_replace('/\s*\([^)]*\)/', '', $lowerFull));
            if ($cleanParen !== '' && !isset($salesLookup[$cleanParen])) $salesLookup[$cleanParen] = ['id' => $sid, 'name' => $sName];
            $words = preg_split('/\s+/', $lowerFull);
            if (!empty($words[0]) && strlen($words[0]) >= 3 && !isset($salesLookup[$words[0]])) $salesLookup[$words[0]] = ['id' => $sid, 'name' => $sName];
        }
        if ($uName !== '') {
            $lowerUser = strtolower($uName);
            if (!isset($salesLookup[$lowerUser])) $salesLookup[$lowerUser] = ['id' => $sid, 'name' => $primaryName];
            $cleanUser = preg_replace('/(_ryan|_alvin|_riva|_kacab|_spv|\d+)$/i', '', $lowerUser);
            if ($cleanUser !== '' && strlen($cleanUser) >= 3 && !isset($salesLookup[$cleanUser])) $salesLookup[$cleanUser] = ['id' => $sid, 'name' => $primaryName];
        }
    }

    if (isset($salesLookup['yenni']) && !isset($salesLookup['yeni'])) $salesLookup['yeni'] = $salesLookup['yenni'];
    if (isset($salesLookup['yeni']) && !isset($salesLookup['yenni'])) $salesLookup['yenni'] = $salesLookup['yeni'];
    if (isset($salesLookup['egi']) && !isset($salesLookup['egy'])) $salesLookup['egy'] = $salesLookup['egi'];
    if (isset($salesLookup['egy']) && !isset($salesLookup['egi'])) $salesLookup['egi'] = $salesLookup['egy'];
    if (isset($salesLookup['fadil']) && !isset($salesLookup['fadhil'])) $salesLookup['fadhil'] = $salesLookup['fadil'];
    if (isset($salesLookup['fadhil']) && !isset($salesLookup['fadil'])) $salesLookup['fadil'] = $salesLookup['fadhil'];

    return function($rawSalesName) use ($salesLookup, $salesDbRows) {
        $raw = trim((string)$rawSalesName);
        if (!$raw || $raw === '-' || $raw === '0' || strtolower($raw) === 'no data' || strtolower($raw) === 'unassigned' || strtolower($raw) === 'belum ditugaskan') {
            return [null, ''];
        }
        $lower = strtolower($raw);
        if (isset($salesLookup[$lower])) {
            return [$salesLookup[$lower]['id'], $salesLookup[$lower]['name']];
        }
        foreach ($salesDbRows as $s) {
            $sName = strtolower(trim($s['nama_lengkap'] ?? ''));
            if ($sName && (strpos($sName, $lower) !== false || strpos($lower, $sName) !== false)) {
                return [(int)$s['id'], $s['nama_lengkap']];
            }
        }
        $firstWord = explode(' ', $lower)[0] ?? '';
        if ($firstWord && strlen($firstWord) >= 3) {
            foreach ($salesDbRows as $s) {
                $sFirst = explode(' ', strtolower(trim($s['nama_lengkap'] ?? '')))[0] ?? '';
                if ($sFirst === $firstWord) {
                    return [(int)$s['id'], $s['nama_lengkap']];
                }
            }
        }
        return [null, $raw];
    };
}

/**
 * Reusable Bidirectional Google Sheet -> Salesforce Sync Engine
 * Supports full sync (manual) and fast throttled hash-diff auto-sync (clears/deletes reflected 100%).
 */
function sync_google_sheet_data($sheetUrl = null, $forceFull = true, $cooldownSec = 6) {
    global $is_mysql, $sqlite_pdo, $conn;

    $state = sft_load_sync_state();
    $nowTs = time();
    if (!$forceFull && ($nowTs - (int)($state['last_checked_at'] ?? 0)) < $cooldownSec) {
        return [
            'success' => true,
            'changed' => 0,
            'updated' => 0,
            'inserted' => 0,
            'throttled' => true,
            'last_sync' => $state['last_sync'] ?? ''
        ];
    }

    if (!$sheetUrl) {
        $rows = followup_query("SELECT setting_value FROM followup_settings WHERE setting_key = 'google_sheet_url' LIMIT 1");
        $sheetUrl = !empty($rows) ? $rows[0]['setting_value'] : '';
    }

    $defaultSheet = 'https://docs.google.com/spreadsheets/d/1fvam5FfR1AIKKmv68RGf0dKy2lNpUv-dWc7sbqAe4k4/edit?gid=622548953#gid=622548953';
    if (!$sheetUrl) {
        $sheetUrl = $defaultSheet;
    }

    $csvUrl = $sheetUrl;
    if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $sheetUrl, $matches)) {
        $sheetId = $matches[1];
        $gid = '622548953';
        if (preg_match('/gid=([0-9]+)/', $sheetUrl, $gMatches)) {
            $parsedGid = $gMatches[1];
            if (!empty($parsedGid) && $parsedGid !== '0') {
                $gid = $parsedGid;
            }
        }
        $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";
    }

    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
            "timeout" => $forceFull ? 45 : 15
        ],
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false
        ]
    ];
    $context = stream_context_create($opts);
    $csvContent = @file_get_contents($csvUrl, false, $context);

    if ($csvContent === false || (stripos($csvContent, '<html') !== false && stripos($csvContent, 'Customer Name') === false)) {
        return [
            'success' => false,
            'changed' => 0,
            'message' => 'Gagal mengambil data dari Google Spreadsheet. Pastikan link dapat diakses publik.'
        ];
    }

    $csvHash = sha1($csvContent);
    if (!$forceFull && !empty($state['csv_hash']) && $csvHash === $state['csv_hash'] && !empty($state['snapshots'])) {
        $state['last_checked_at'] = $nowTs;
        sft_save_sync_state($state);
        return [
            'success' => true,
            'changed' => 0,
            'updated' => 0,
            'inserted' => 0,
            'cached' => true,
            'last_sync' => $state['last_sync'] ?? ''
        ];
    }

    $stream = fopen('php://memory', 'r+');
    fwrite($stream, $csvContent);
    rewind($stream);

    $rawRows = [];
    while (($rCols = fgetcsv($stream)) !== false) {
        $rawRows[] = $rCols;
    }
    fclose($stream);

    if (empty($rawRows)) {
        return ['success' => false, 'changed' => 0, 'message' => 'Google Sheet kosong.'];
    }

    $headerRowIdx = 0;
    $keywords = ['nama', 'customer', 'contact', 'telepon', 'phone', 'wa', 'vehicle', 'mobil', 'model', 'vin', 'cluster', 'priority'];
    for ($r = 0; $r < min(10, count($rawRows)); $r++) {
        $cols = array_map('strtolower', array_map('trim', $rawRows[$r]));
        $matches = 0;
        foreach ($cols as $c) {
            foreach ($keywords as $k) {
                if (strpos($c, $k) !== false) $matches++;
            }
        }
        if ($matches >= 2) {
            $headerRowIdx = $r;
            break;
        }
    }

    $rawHeaders = $rawRows[$headerRowIdx];
    $headers = array_map('strtolower', array_map('trim', $rawHeaders));

    $findIdx = function($patterns) use ($headers) {
        foreach ($patterns as $p) {
            foreach ($headers as $idx => $h) {
                if (preg_match($p, $h)) return $idx;
            }
        }
        return -1;
    };

    $nameIdx = $findIdx(['/^customer name$/i', '/nama by single vin/i', '/nama customer/i', '/nama/i', '/customer/i', '/pelanggan/i']);
    $phone1Idx = $findIdx(['/^no tlp\/hp$/i', '/^decision maker phone$/i', '/contact person 1/i', '/no wa/i', '/telepon/i', '/phone/i', '/no_hp/i', '/hp/i']);
    $phone2Idx = $findIdx(['/^contact person phone$/i', '/contact person 2/i']);
    $vehicleFilterIdx = $findIdx(['/vehicle filter/i']);
    $rec1Idx = $findIdx(['/alternative_recommendation_model_1/i', '/1\.\s*model/i']);
    $rec2Idx = $findIdx(['/alternative_recommendation_model_2/i', '/2\.\s*model/i']);
    $rec3Idx = $findIdx(['/alternative_recommendation_model_3/i', '/3\.\s*model/i']);
    $lastCarIdx = $findIdx(['/^tipe kendaraan$/i', '/latest_model/i', '/model_kendaraan_terakhir/i', '/mobil.*saat ini/i', '/unit.*saat ini/i']);
    $ageIdx = $findIdx(['/^tahun produksi$/i', '/vehicle age/i', '/usia_kendaraan_terakhir/i', '/usia.*kendaraan/i', '/usia/i', '/tahun/i']);
    $clusterIdx = $findIdx(['/^operation description$/i', '/cluster_name/i', '/cluster/i', '/klaster/i']);
    $priorityIdx = $findIdx(['/^pkb status$/i', '/priority/i', '/prioritas/i']);
    $districtIdx = $findIdx(['/alamat_kecamatan/i', '/kecamatan/i', '/wilayah/i', '/domisili/i']);
    $cityIdx = $findIdx(['/^kota\/kabupaten$/i', '/^kota$/i', '/kabupaten/i']);
    $addrIdx = $findIdx(['/^customer address$/i', '/alamat/i', '/address/i']);
    $vinIdx = $findIdx(['/^no rangka$/i', '/latest_vin/i', '/vin_kendaraan_terakhir/i', '/vin/i', '/no_rangka/i']);
    $plateIdx = $findIdx(['/^police reg no/i', '/no\.?\s*pol/i', '/plat/i']);
    $pkbNoIdx = $findIdx(['/^pkb no/i']);
    $custTypeIdx = $findIdx(['/cust\.\s*type/i', '/fleet_or_retail/i', '/tipe.*customer/i']);
    $doOutletIdx = $findIdx(['/do_oleh_tunas/i', '/nama_outlet_do/i', '/outlet.*do/i']);
    $srvOutletIdx = $findIdx(['/service_di_tunas/i', '/nama_outlet_service/i']);
    $srvComplianceIdx = $findIdx(['/rasio_kepatuhan_service/i', '/kepatuhan_service/i']);
    $tempIdx = $findIdx(['/veloz_hybrid_temperature/i', '/1\.\s*temperatur/i', '/temperatur/i', '/class/i']);
    $outletNameIdx = $findIdx(['/outlet_name/i', '/nama.*outlet/i', '/cabang/i']);

    $connIdx = $findIdx(['/^connected/i']);
    $contIdx = $findIdx(['/^contacted/i']);
    $prospIdx = $findIdx(['/^prospect/i']);
    $spkIdx = $findIdx(['/^spk/i']);
    $remarksIdx = $findIdx(['/^remarks/i']);
    $statusFuIdx = $findIdx(['/^status.*fu/i']);
    $reasonFuIdx = $findIdx(['/^reason/i', '/^alasan/i']);
    $salesFuIdx = $findIdx(['/^sales\s*fu/i', '/sales.*fu/i', '/^sales_fu$/i', '/sales\s*pic/i', '/wiraniaga/i', '/^pic$/i']);
    $fuDateIdx = $findIdx(['/tanggal.*pengisian/i', '/tanggal.*fu/i']);
    $allSpkIdx = $findIdx(['/all spk/i']);
    $allDoIdx = $findIdx(['/all do/i']);
    $dataTypeIdx = $findIdx(['/^type$/i', '/^data\s*type$/i', '/tipe\s*pembelian/i']);
    $custMigrationIdx = $findIdx(['/customer\s*migration/i', '/migration/i', '/migrasi/i']);
    $vehicleModelSpkIdx = $findIdx(['/vehicle\s*model\s*spk/i', '/model.*spk/i']);
    $vehicleMatchIdx = $findIdx(['/vehicle\s*match/i', '/match/i']);

    $matchSales = sft_build_sales_matcher();

    // Preload DB rows to match accurately by (PKB + VIN + Plate + OpDesc + Name), (PKB + VIN), (PKB), or fallback customer_code
    $dbExisting = followup_query("
        SELECT id, customer_code, sheet_row_index, pkb_no, vin, plate_number, operation_desc, name,
               connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup,
               followup_status, followup_date, sales_fu, assigned_sales_id, is_orphan
        FROM followup_customers
        ORDER BY id ASC
    ");
    $dbExisting = is_array($dbExisting) ? $dbExisting : [];

    $dbById = [];
    $compQ = [];
    $pkbVinQ = [];
    $pkbQ = [];
    $codeMap = [];

    foreach ($dbExisting as $dbr) {
        $did = (int)$dbr['id'];
        $dbById[$did] = $dbr;
        $dPkb = strtoupper(trim((string)($dbr['pkb_no'] ?? '')));
        $dVin = strtoupper(trim((string)($dbr['vin'] ?? '')));
        $dPlate = strtoupper(trim((string)($dbr['plate_number'] ?? '')));
        $dOp = strtoupper(trim((string)($dbr['operation_desc'] ?? '')));
        $dName = strtoupper(trim((string)($dbr['name'] ?? '')));
        $dCode = trim((string)($dbr['customer_code'] ?? ''));

        $cKey = "$dPkb|$dVin|$dPlate|$dOp|$dName";
        $compQ[$cKey][] = $did;
        if ($dPkb !== '' && $dVin !== '') {
            $pkbVinQ["$dPkb|$dVin"][] = $did;
        }
        if ($dPkb !== '') {
            $pkbQ[$dPkb][] = $did;
        }
        if ($dCode !== '') {
            $codeMap[$dCode] = $did;
        }
    }

    $usedIds = [];
    $popQueue = function(&$qMap, $key) use (&$usedIds) {
        if (empty($qMap[$key])) return 0;
        while (!empty($qMap[$key])) {
            $cand = array_shift($qMap[$key]);
            if (empty($usedIds[$cand])) {
                $usedIds[$cand] = true;
                return $cand;
            }
        }
        return 0;
    };

    $cleanP = function($p) {
        if (!$p || $p === '-') return '';
        if (stripos($p, 'E+') !== false || (stripos($p, 'E') !== false && is_numeric($p))) {
            $p = sprintf('%.0f', (float)$p);
        }
        $c = preg_replace('/[^0-9]/', '', $p);
        if (str_starts_with($c, '0')) $c = '62' . substr($c, 1);
        elseif (str_starts_with($c, '8')) $c = '62' . $c;
        return $c;
    };

    $updates = [];
    $rowsToInsert = [];
    $newSnapshots = [];
    $changedFuCount = 0;

    for ($i = $headerRowIdx + 1; $i < count($rawRows); $i++) {
        $row = $rawRows[$i];
        if (empty($row) || count($row) < 5) continue;

        $name = $nameIdx !== -1 ? trim($row[$nameIdx] ?? '') : '';
        if (!$name || $name === '-' || $name === 'NO DATA') continue;

        $vin = $vinIdx !== -1 ? trim($row[$vinIdx] ?? '') : '';
        $plateNumber = $plateIdx !== -1 ? trim($row[$plateIdx] ?? '') : '';
        $pkbNo = $pkbNoIdx !== -1 ? trim($row[$pkbNoIdx] ?? '') : '';
        $cluster = $clusterIdx !== -1 ? trim($row[$clusterIdx] ?? '') : '';
        $sheetRowIndex = $i + 1;
        $code = 'PKB-ROW-' . $sheetRowIndex;

        $connected = sft_parse_sheet_bool($connIdx !== -1 ? ($row[$connIdx] ?? '') : '');
        $contacted = sft_parse_sheet_bool($contIdx !== -1 ? ($row[$contIdx] ?? '') : '');
        $prospect = sft_parse_sheet_bool($prospIdx !== -1 ? ($row[$prospIdx] ?? '') : '');
        $spk = sft_parse_sheet_bool($spkIdx !== -1 ? ($row[$spkIdx] ?? '') : '');

        $remarks = $remarksIdx !== -1 ? trim($row[$remarksIdx] ?? '') : '';
        $salesFuStatus = $statusFuIdx !== -1 ? trim($row[$statusFuIdx] ?? '') : '';
        if ($salesFuStatus === '' || $salesFuStatus === '-') $salesFuStatus = 'Open';
        $reasonFu = $reasonFuIdx !== -1 ? trim($row[$reasonFuIdx] ?? '') : '';
        $rawSalesFu = $salesFuIdx !== -1 ? trim($row[$salesFuIdx] ?? '') : '';
        if ($rawSalesFu === '-' || $rawSalesFu === '0' || strtolower($rawSalesFu) === 'belum ditugaskan') $rawSalesFu = '';

        $allSpk = $allSpkIdx !== -1 ? trim($row[$allSpkIdx] ?? '') : '';
        $allDo = $allDoIdx !== -1 ? trim($row[$allDoIdx] ?? '') : '';
        $hasAllDo = (!empty($allDo) && $allDo !== '-' && $allDo !== '0' && stripos($allDo, 'DO') !== false);
        $doUnit = ($hasAllDo || stripos($remarks, 'DO') !== false) ? 'TRUE' : 'FALSE';
        $hasAllSpk = (!empty($allSpk) && $allSpk !== '-' && $allSpk !== '0' && stripos($allSpk, 'SPK') !== false);
        if ($hasAllSpk || stripos($remarks, 'SPK berhasil') !== false) {
            $spk = 'TRUE';
        }
        $fuDate = $fuDateIdx !== -1 ? trim($row[$fuDateIdx] ?? '') : '';

        // If any later stage in Sheet is TRUE, enforce logical upstream TRUE consistency if remarks is not rejecting
        if ($spk === 'TRUE') {
            $connected = 'TRUE';
            $contacted = 'TRUE';
            $prospect = 'TRUE';
            if ($remarks === '') $remarks = 'SPK berhasil';
            $salesFuStatus = 'Closed';
        } elseif ($prospect === 'TRUE') {
            $connected = 'TRUE';
            $contacted = 'TRUE';
        } elseif ($contacted === 'TRUE') {
            $connected = 'TRUE';
        }

        $status = sft_derive_followup_state($connected, $contacted, $prospect, $spk, $remarks, $doUnit);

        $uPkb = strtoupper($pkbNo);
        $uVin = strtoupper($vin);
        $uPlate = strtoupper($plateNumber);
        $uOp = strtoupper($cluster);
        $uName = strtoupper($name);

        $matchedId = $popQueue($compQ, "$uPkb|$uVin|$uPlate|$uOp|$uName");
        if (!$matchedId && $uPkb !== '' && $uVin !== '') {
            $matchedId = $popQueue($pkbVinQ, "$uPkb|$uVin");
        }
        if (!$matchedId && $uPkb !== '') {
            $matchedId = $popQueue($pkbQ, $uPkb);
        }
        if (!$matchedId && isset($codeMap[$code]) && empty($usedIds[$codeMap[$code]])) {
            $candRow = $dbById[$codeMap[$code]];
            if (strtoupper(trim($candRow['name'] ?? '')) === $uName) {
                $usedIds[$codeMap[$code]] = true;
                $matchedId = $codeMap[$code];
            }
        }

        list($matchedSalesId, $matchedSalesName) = $matchSales($rawSalesFu);
        $salesFuVal = $rawSalesFu !== '' ? ($matchedSalesName ?: $rawSalesFu) : '';

        $sheetSig = [$connected, $contacted, $prospect, $spk, $remarks, $salesFuStatus, $reasonFu, $salesFuVal, $status];

        if ($matchedId && isset($dbById[$matchedId])) {
            $dbRow = $dbById[$matchedId];
            $prevSnap = $state['snapshots'][$matchedId] ?? null;
            $pushLockTs = (int)($state['push_locks'][$matchedId] ?? 0);

            // Prevent overwriting a brand-new Salesforce push whose webhook write to Google Sheet hasn't landed in CSV yet
            if ($pushLockTs > 0 && ($nowTs - $pushLockTs) < 25 && $prevSnap !== null && $sheetSig === $prevSnap) {
                $newSnapshots[$matchedId] = $prevSnap;
                continue;
            }

            $dbConn = (strtoupper(trim((string)($dbRow['connected'] ?? ''))) === 'TRUE') ? 'TRUE' : 'FALSE';
            $dbCont = (strtoupper(trim((string)($dbRow['contacted'] ?? ''))) === 'TRUE') ? 'TRUE' : 'FALSE';
            $dbProsp = (strtoupper(trim((string)($dbRow['prospect'] ?? ''))) === 'TRUE') ? 'TRUE' : 'FALSE';
            $dbSpk = (strtoupper(trim((string)($dbRow['spk'] ?? ''))) === 'TRUE') ? 'TRUE' : 'FALSE';
            $dbRemarks = trim((string)($dbRow['remarks'] ?? ''));
            $dbFuStat = trim((string)($dbRow['sales_fu_status'] ?? 'Open')) ?: 'Open';
            $dbReason = trim((string)($dbRow['reason_followup'] ?? ''));
            $dbStatus = trim((string)($dbRow['followup_status'] ?? 'Belum Dihubungi')) ?: 'Belum Dihubungi';
            $dbSalesFu = trim((string)($dbRow['sales_fu'] ?? ''));
            $dbAssignedId = !empty($dbRow['assigned_sales_id']) ? (int)$dbRow['assigned_sales_id'] : null;
            $dbIsOrphan = isset($dbRow['is_orphan']) ? (int)$dbRow['is_orphan'] : 0;
            $dbRowIdx = (int)($dbRow['sheet_row_index'] ?? 0);

            if ($salesFuVal !== '') {
                $targetAssignedId = $matchedSalesId;
                $targetSalesFu = $salesFuVal;
                $targetIsOrphan = (!$targetAssignedId && $targetSalesFu === '') ? 1 : 0;
            } else {
                $prevHadSalesFu = ($prevSnap !== null && trim((string)($prevSnap[7] ?? '')) !== '');
                $wasFollowedNowCleared = ($dbStatus !== 'Belum Dihubungi' && $status === 'Belum Dihubungi');
                if ($prevHadSalesFu || $wasFollowedNowCleared || $forceFull) {
                    // When sheet clears a previously filled FU row (or full pull with empty Sales FU), clear sales assignment too unless preserved below
                    $targetAssignedId = ($prevHadSalesFu || $wasFollowedNowCleared) ? null : $dbAssignedId;
                    $targetSalesFu = ($prevHadSalesFu || $wasFollowedNowCleared) ? '' : $dbSalesFu;
                    $targetIsOrphan = ($prevHadSalesFu || $wasFollowedNowCleared) ? 1 : $dbIsOrphan;
                } else {
                    $targetAssignedId = $dbAssignedId;
                    $targetSalesFu = $dbSalesFu;
                    $targetIsOrphan = $dbIsOrphan;
                }
            }

            if ($status === 'Belum Dihubungi' && $connected === 'FALSE' && $remarks === '') {
                $targetFuDate = null;
            } elseif ($dbStatus !== $status || $dbSpk !== $spk || $dbConn !== $connected) {
                $targetFuDate = $fuDate ?: ($dbRow['followup_date'] ?: date('Y-m-d H:i:s'));
            } else {
                $targetFuDate = $dbRow['followup_date'] ?: null;
            }

            $fuChanged = (
                $dbConn !== $connected ||
                $dbCont !== $contacted ||
                $dbProsp !== $prospect ||
                $dbSpk !== $spk ||
                $dbRemarks !== $remarks ||
                $dbFuStat !== $salesFuStatus ||
                $dbReason !== $reasonFu ||
                $dbStatus !== $status ||
                $dbSalesFu !== $targetSalesFu ||
                $dbAssignedId !== $targetAssignedId
            );
            $rowIdxChanged = ($dbRowIdx !== $sheetRowIndex);

            if ($fuChanged) {
                $changedFuCount++;
            }

            if ($fuChanged || $rowIdxChanged) {
                $updates[] = [
                    $connected, $contacted, $prospect, $spk, $remarks,
                    $salesFuStatus, $reasonFu, $status, $targetFuDate,
                    $targetAssignedId, $targetSalesFu, $targetIsOrphan,
                    $doUnit, $allSpk, $allDo, $sheetRowIndex, $matchedId
                ];
            }

            $newSnapshots[$matchedId] = $sheetSig;
            continue;
        }

        // Brand-new row added directly inside Google Sheet -> prepare insert
        $rawPhone1 = $phone1Idx !== -1 ? trim($row[$phone1Idx] ?? '') : '';
        $rawPhone2 = $phone2Idx !== -1 ? trim($row[$phone2Idx] ?? '') : '';
        $phone = $cleanP($rawPhone1) ?: ($cleanP($rawPhone2) ?: '-');

        $lastCar = $lastCarIdx !== -1 ? trim($row[$lastCarIdx] ?? '') : '';
        if ($lastCar === 'NO DATA' || $lastCar === '-') $lastCar = '';
        $vFilter = $vehicleFilterIdx !== -1 ? trim($row[$vehicleFilterIdx] ?? 'OTHERS') : 'OTHERS';
        if (!$vFilter || $vFilter === 'NO DATA') $vFilter = 'OTHERS';
        $rec1 = $rec1Idx !== -1 ? trim(str_replace('(Target Repurchase)', '', $row[$rec1Idx] ?? '')) : '';
        if ($rec1 === 'NO DATA' || $rec1 === '-') $rec1 = '';
        $rec2 = $rec2Idx !== -1 ? trim($row[$rec2Idx] ?? '') : '';
        if ($rec2 === 'NO DATA' || $rec2 === '-') $rec2 = '';
        $rec3 = $rec3Idx !== -1 ? trim($row[$rec3Idx] ?? '') : '';
        if ($rec3 === 'NO DATA' || $rec3 === '-') $rec3 = '';

        $age = $ageIdx !== -1 ? trim($row[$ageIdx] ?? '') : '';
        if ($age === 'NO DATA' || $age === '-') $age = '';
        $district = $districtIdx !== -1 ? trim($row[$districtIdx] ?? '') : '';
        if ($district === 'NO DATA' || $district === '-' || $district === '0') $district = '';
        $city = $cityIdx !== -1 ? trim($row[$cityIdx] ?? '') : '';
        if ($city === 'NO DATA' || $city === '-' || $city === '0') $city = '';
        $address = $addrIdx !== -1 ? trim($row[$addrIdx] ?? '') : '';
        if ($address === 'NO DATA' || $address === '-' || $address === '0') $address = '';
        $priority = get_territory_priority($district);

        $custType = $custTypeIdx !== -1 ? strtoupper(trim($row[$custTypeIdx] ?? 'RETAIL')) : 'RETAIL';
        if ($custType !== 'FLEET') $custType = 'RETAIL';
        $outletDo = $doOutletIdx !== -1 ? trim($row[$doOutletIdx] ?? '') : '';
        $outletSrv = $srvOutletIdx !== -1 ? trim($row[$srvOutletIdx] ?? '') : '';
        $srvComp = $srvComplianceIdx !== -1 ? trim($row[$srvComplianceIdx] ?? '') : '';
        $temperature = $tempIdx !== -1 ? strtoupper(trim($row[$tempIdx] ?? 'MEDIUM')) : 'MEDIUM';
        if (!in_array($temperature, ['HIGH', 'MEDIUM', 'LOW'])) $temperature = 'MEDIUM';
        $outletName = $outletNameIdx !== -1 ? trim($row[$outletNameIdx] ?? 'TUNAS TOYOTA KIARA CONDONG') : 'TUNAS TOYOTA KIARA CONDONG';

        $dataType = $dataTypeIdx !== -1 ? trim($row[$dataTypeIdx] ?? '') : '';
        if (in_array($dataType, ['NO DATA', '-', '#N/A', '#REF!'], true)) $dataType = '';
        $custMigration = $custMigrationIdx !== -1 ? trim($row[$custMigrationIdx] ?? '') : '';
        if (in_array($custMigration, ['NO DATA', '-', '#N/A', '#REF!'], true)) $custMigration = '';
        $vehicleModelSpk = $vehicleModelSpkIdx !== -1 ? trim($row[$vehicleModelSpkIdx] ?? '') : '';
        if (in_array($vehicleModelSpk, ['NO DATA', '-', '#N/A', '#REF!'], true)) $vehicleModelSpk = '';
        $vehicleMatch = $vehicleMatchIdx !== -1 ? trim($row[$vehicleMatchIdx] ?? '') : '';
        if (in_array($vehicleMatch, ['NO DATA', '-', '#N/A', '#REF!'], true)) $vehicleMatch = '';

        $targetCar = $rec1 ?: ($vFilter !== 'OTHERS' ? $vFilter : ($lastCar ?: 'Toyota Unit'));
        $carModel = $targetCar;
        $category = 'Servis Berkala';
        $isOrphan = (!$matchedSalesId && $salesFuVal === '') ? 1 : 0;

        $insertCode = isset($codeMap[$code]) ? ('PKB-ROW-' . $sheetRowIndex . '-' . substr(md5("$pkbNo|$vin|$sheetRowIndex"), 0, 6)) : $code;
        $fullAddr = implode(', ', array_filter([$address, $district, $city], fn($v) => $v !== '' && $v !== '0'));
        $eSeed = radarComputeEntitySeed($sheetRowIndex, $name, $address ?: $district, $district, $city);
        $GLOBALS['SKIP_REMOTE_GEOCODE'] = true;
        $gCoords = getAccurateCoords($sheetRowIndex, $district, $fullAddr, null, $plateNumber, $vin, $eSeed);

        $rowsToInsert[] = [
            $insertCode, $name, $phone, $carModel, $lastCar, $age,
            $targetCar, $rec2, $rec3, $cluster, $priority, $district, $city, $address, $vin, $plateNumber, $pkbNo, $sheetRowIndex,
            $outletDo, $outletSrv, $srvComp,
            $connected, $contacted, $prospect, $spk, $remarks, $salesFuStatus, $reasonFu, ($status === 'Belum Dihubungi' ? null : ($fuDate ?: date('Y-m-d H:i:s'))),
            $category, $status,
            $vFilter, $custType, $temperature, $outletName, $salesFuVal, $doUnit, $allSpk, $allDo,
            $matchedSalesId, $isOrphan,
            $dataType, $custMigration, $vehicleModelSpk, $vehicleMatch,
            (float)$gCoords[0], (float)$gCoords[1], substr((string)($gCoords[2] ?? $district), 0, 145), (string)($gCoords[3] ?? $fullAddr)
        ];
    }

    $updatedCount = 0;
    if (!empty($updates)) {
        if ($is_mysql && $conn) {
            $conn->begin_transaction();
            $stmt = $conn->prepare("
                UPDATE followup_customers SET
                    connected = ?, contacted = ?, prospect = ?, spk = ?, remarks = ?,
                    sales_fu_status = ?, reason_followup = ?, followup_status = ?, followup_date = ?,
                    assigned_sales_id = ?, sales_fu = ?, is_orphan = ?,
                    do_unit = ?, all_spk = ?, all_do = ?, sheet_row_index = ?
                WHERE id = ?
            ");
            foreach ($updates as $u) {
                $stmt->bind_param(
                    'sssssssssisisssii',
                    $u[0], $u[1], $u[2], $u[3], $u[4],
                    $u[5], $u[6], $u[7], $u[8],
                    $u[9], $u[10], $u[11],
                    $u[12], $u[13], $u[14], $u[15], $u[16]
                );
                $stmt->execute();
                $updatedCount++;
            }
            $stmt->close();
            $conn->commit();
        } else {
            if ($sqlite_pdo) $sqlite_pdo->beginTransaction();
            foreach ($updates as $u) {
                followup_execute("
                    UPDATE followup_customers SET
                        connected = ?, contacted = ?, prospect = ?, spk = ?, remarks = ?,
                        sales_fu_status = ?, reason_followup = ?, followup_status = ?, followup_date = ?,
                        assigned_sales_id = ?, sales_fu = ?, is_orphan = ?,
                        do_unit = ?, all_spk = ?, all_do = ?, sheet_row_index = ?
                    WHERE id = ?
                ", $u);
                $updatedCount++;
            }
            if ($sqlite_pdo) $sqlite_pdo->commit();
        }
    }

    $insertedCount = 0;
    if (!empty($rowsToInsert)) {
        $chunks = array_chunk($rowsToInsert, 50);
        if ($is_mysql && $conn) {
            foreach ($chunks as $chunk) {
                $placeholders = [];
                $flatParams = [];
                foreach ($chunk as $rData) {
                    $placeholders[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'google_sheet', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    foreach ($rData as $val) $flatParams[] = $val;
                    $insertedCount++;
                }
                $sql = "
                    INSERT INTO followup_customers (
                        customer_code, name, phone, car_model, last_car_model, car_age,
                        recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, city, address, vin, plate_number, pkb_no, sheet_row_index,
                        outlet_do, outlet_service, service_compliance,
                        connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup, followup_date,
                        followup_category, followup_status, sync_source,
                        vehicle_filter, cust_type, priority_class, outlet_name, sales_fu, do_unit, all_spk, all_do,
                        assigned_sales_id, is_orphan,
                        data_type, customer_migration, vehicle_model_spk, vehicle_match,
                        lat, lng, geo_district, geo_address
                    ) VALUES " . implode(', ', $placeholders);
                followup_execute($sql, $flatParams);
            }
        }
    }

    // Prune expired push locks
    $cleanLocks = [];
    foreach ($state['push_locks'] as $lid => $ts) {
        if (($nowTs - (int)$ts) < 60) $cleanLocks[$lid] = (int)$ts;
    }

    $nowStr = date('Y-m-d H:i:s');
    $state['csv_hash'] = $csvHash;
    $state['last_checked_at'] = $nowTs;
    $state['snapshots'] = $newSnapshots;
    $state['push_locks'] = $cleanLocks;
    if ($forceFull || $changedFuCount > 0 || $insertedCount > 0 || empty($state['last_sync'])) {
        $state['last_sync'] = $nowStr;
    }
    sft_save_sync_state($state);

    if ($forceFull || $changedFuCount > 0 || $insertedCount > 0) {
        if ($is_mysql && $conn) {
            followup_execute("INSERT INTO followup_settings (setting_key, setting_value) VALUES ('last_sync_time', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [$nowStr, $nowStr]);
            followup_execute("INSERT INTO followup_settings (setting_key, setting_value) VALUES ('google_sheet_url', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [$sheetUrl, $sheetUrl]);
        } else {
            followup_execute("INSERT OR REPLACE INTO followup_settings (setting_key, setting_value) VALUES ('last_sync_time', ?)", [$nowStr]);
            followup_execute("INSERT OR REPLACE INTO followup_settings (setting_key, setting_value) VALUES ('google_sheet_url', ?)", [$sheetUrl]);
        }
    }

    $msgChanged = $changedFuCount + $insertedCount;
    return [
        'success' => true,
        'message' => $msgChanged > 0
            ? "Sinkronisasi Google Spreadsheet berhasil! $changedFuCount data follow-up diperbarui dan $insertedCount data baru ditambahkan."
            : "Database sudah sinkron dengan Google Spreadsheet.",
        'changed' => $changedFuCount + $insertedCount,
        'updated' => $changedFuCount,
        'row_index_repaired' => $updatedCount,
        'inserted' => $insertedCount,
        'last_sync' => $nowStr,
        'sheet_url' => $sheetUrl
    ];
}

// -------------------------------------------------------------
// ROUTE: GET / POST /api_followup_sync.php?action=auto_sync_sheet
// Differential automatic sync from Google Sheet -> Salesforce
// -------------------------------------------------------------
if ($action === 'auto_sync_sheet') {
    $force = !empty($_GET['force']) || !empty($_POST['force']);
    $res = sync_google_sheet_data(null, $force, 5);
    echo json_encode($res);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=webhook_from_sheet
// Realtime receiver from Google Apps Script onEdit trigger
// -------------------------------------------------------------
if ($action === 'webhook_from_sheet') {
    $input = get_json_input();
    if (empty($input)) $input = $_POST;

    $sheetRow = (int)($input['sheet_row_index'] ?? ($input['row'] ?? 0));
    $pkbNo = trim((string)($input['pkb_no'] ?? ''));
    $vin = trim((string)($input['vin'] ?? ''));
    $name = trim((string)($input['name'] ?? ''));

    $targetRow = null;
    if ($pkbNo !== '' && $vin !== '') {
        $rows = followup_query("SELECT * FROM followup_customers WHERE pkb_no = ? AND vin = ? LIMIT 1", [$pkbNo, $vin]);
        if (!empty($rows)) $targetRow = $rows[0];
    }
    if (!$targetRow && $pkbNo !== '') {
        $rows = followup_query("SELECT * FROM followup_customers WHERE pkb_no = ? LIMIT 1", [$pkbNo]);
        if (!empty($rows)) $targetRow = $rows[0];
    }
    if (!$targetRow && $sheetRow > 0) {
        $rows = followup_query("SELECT * FROM followup_customers WHERE sheet_row_index = ? OR customer_code = ? LIMIT 1", [$sheetRow, 'PKB-ROW-' . $sheetRow]);
        if (!empty($rows)) $targetRow = $rows[0];
    }

    if (!$targetRow) {
        echo json_encode(['success' => false, 'message' => 'Baris customer tidak ditemukan']);
        exit;
    }

    $cid = (int)$targetRow['id'];
    $connected = array_key_exists('connected', $input) ? sft_parse_sheet_bool($input['connected']) : ($targetRow['connected'] ?: 'FALSE');
    $contacted = array_key_exists('contacted', $input) ? sft_parse_sheet_bool($input['contacted']) : ($targetRow['contacted'] ?: 'FALSE');
    $prospect = array_key_exists('prospect', $input) ? sft_parse_sheet_bool($input['prospect']) : ($targetRow['prospect'] ?: 'FALSE');
    $spk = array_key_exists('spk', $input) ? sft_parse_sheet_bool($input['spk']) : ($targetRow['spk'] ?: 'FALSE');
    $remarks = array_key_exists('remarks', $input) ? trim((string)$input['remarks']) : trim((string)($targetRow['remarks'] ?? ''));
    $salesFuStatus = array_key_exists('status_fu', $input) || array_key_exists('sales_fu_status', $input)
        ? (trim((string)($input['status_fu'] ?? ($input['sales_fu_status'] ?? 'Open'))) ?: 'Open')
        : (trim((string)($targetRow['sales_fu_status'] ?? 'Open')) ?: 'Open');
    $reasonFu = array_key_exists('reason_followup', $input) || array_key_exists('reason', $input)
        ? trim((string)($input['reason_followup'] ?? ($input['reason'] ?? '')))
        : trim((string)($targetRow['reason_followup'] ?? ''));

    $matchSales = sft_build_sales_matcher();
    if (array_key_exists('sales_fu', $input)) {
        $rawSalesFu = trim((string)$input['sales_fu']);
        list($assignedId, $salesName) = $matchSales($rawSalesFu);
        $salesFuVal = $rawSalesFu !== '' ? ($salesName ?: $rawSalesFu) : '';
        $isOrphan = ($salesFuVal === '' && !$assignedId) ? 1 : 0;
    } else {
        $assignedId = !empty($targetRow['assigned_sales_id']) ? (int)$targetRow['assigned_sales_id'] : null;
        $salesFuVal = trim((string)($targetRow['sales_fu'] ?? ''));
        $isOrphan = isset($targetRow['is_orphan']) ? (int)$targetRow['is_orphan'] : 0;
    }

    if ($spk === 'TRUE') {
        $connected = 'TRUE'; $contacted = 'TRUE'; $prospect = 'TRUE';
        if ($remarks === '') $remarks = 'SPK berhasil';
        $salesFuStatus = 'Closed';
    }

    $status = sft_derive_followup_state($connected, $contacted, $prospect, $spk, $remarks, $targetRow['do_unit'] ?? 'FALSE');
    $fuDate = ($status === 'Belum Dihubungi' && $connected === 'FALSE' && $remarks === '')
        ? null
        : ($targetRow['followup_date'] ?: date('Y-m-d H:i:s'));

    if ($status === 'Belum Dihubungi' && !array_key_exists('sales_fu', $input) && $remarks === '' && $connected === 'FALSE') {
        // Keep existing assigned sales unless sheet cleared it
    }

    followup_execute("
        UPDATE followup_customers SET
            connected = ?, contacted = ?, prospect = ?, spk = ?,
            remarks = ?, sales_fu_status = ?, reason_followup = ?, followup_status = ?, followup_date = ?,
            assigned_sales_id = ?, sales_fu = ?, is_orphan = ?,
            sheet_row_index = CASE WHEN ? > 0 THEN ? ELSE sheet_row_index END
        WHERE id = ?
    ", [
        $connected, $contacted, $prospect, $spk,
        $remarks, $salesFuStatus, $reasonFu, $status, $fuDate,
        $assignedId, $salesFuVal, $isOrphan,
        $sheetRow, $sheetRow, $cid
    ]);

    $state = sft_load_sync_state();
    $state['csv_hash'] = '';
    $state['snapshots'][$cid] = [$connected, $contacted, $prospect, $spk, $remarks, $salesFuStatus, $reasonFu, $salesFuVal, $status];
    sft_save_sync_state($state);

    echo json_encode(['success' => true, 'id' => $cid, 'status' => $status, 'spk' => $spk]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=pull_sheet
// -------------------------------------------------------------
if ($action === 'pull_sheet') {
    $input = get_json_input();
    $sheetUrl = trim($input['google_sheet_url'] ?? '');
    $res = sync_google_sheet_data($sheetUrl ?: null, true, 0);
    echo json_encode($res);
    exit;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup_sync.php?action=export_csv
// -------------------------------------------------------------
if ($action === 'export_csv') {
    $customers = followup_query("SELECT * FROM followup_customers ORDER BY id DESC");

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=Database_Customer_FollowUp_' . date('Ymd_His') . '.csv');

    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

    fputcsv($output, [
        'ID', 'Kode Customer', 'Nama Customer', 'No WhatsApp', 'Model Mobil Target',
        'Mobil Saat Ini', 'Usia Kendaraan', 'Klaster', 'Prioritas', 'Kecamatan',
        'Plat Nomor', 'VIN/No Rangka', 'Connected', 'Contacted', 'Prospect', 'SPK',
        'Remarks', 'Status FU', 'Alasan Follow-Up', 'Tanggal Follow-Up', 'Status Follow-Up'
    ]);

    foreach ($customers as $c) {
        fputcsv($output, [
            $c['id'],
            $c['customer_code'],
            $c['name'],
            $c['phone'],
            $c['car_model'],
            $c['last_car_model'] ?? '-',
            $c['car_age'] ?? '-',
            $c['cluster_name'] ?? '-',
            $c['priority'] ?? '-',
            $c['district'] ?? '-',
            $c['plate_number'] ?? '-',
            $c['vin'] ?? '-',
            $c['connected'] ?? 'FALSE',
            $c['contacted'] ?? 'FALSE',
            $c['prospect'] ?? 'FALSE',
            $c['spk'] ?? 'FALSE',
            $c['remarks'] ?? '-',
            $c['sales_fu_status'] ?? 'Open',
            $c['reason_followup'] ?? ($c['notes'] ?? '-'),
            $c['followup_date'] ?? '-',
            $c['followup_status']
        ]);
    }

    fclose($output);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=import_database_batch
// Fast chunked upsert from Google Sheet "Database" tab
// -------------------------------------------------------------
if ($action === 'import_database_batch') {
    $input = get_json_input();
    $rows = $input['rows'] ?? [];
    if (empty($rows) || !is_array($rows)) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada data rows']);
        exit;
    }

    global $is_mysql, $sqlite_pdo, $conn;
    $inserted = 0;

    if (!empty($input['reset_all'])) {
        followup_execute("DELETE FROM followup_customers");
        followup_execute("DELETE FROM followup_logs");
    }

    if ($is_mysql && $conn) {
        $chunks = array_chunk($rows, 100);
        foreach ($chunks as $chunk) {
            $placeholders = [];
            $flatParams = [];
            foreach ($chunk as $r) {
                $placeholders[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $flatParams[] = $r['customer_code'];
                $flatParams[] = $r['name'];
                $flatParams[] = $r['phone'];
                $flatParams[] = $r['car_model'];
                $flatParams[] = $r['last_car_model'] ?? $r['car_model'];
                $flatParams[] = $r['car_age'] ?? '';
                $flatParams[] = $r['car_year'] ?? '';
                $flatParams[] = $r['recommended_model'] ?? $r['car_model'];
                $flatParams[] = $r['cluster_name'] ?? '';
                $flatParams[] = get_territory_priority($r['district'] ?? '');
                $flatParams[] = $r['district'] ?? '';
                $flatParams[] = $r['city'] ?? '';
                $flatParams[] = $r['address'] ?? '';
                $flatParams[] = $r['vin'] ?? '';
                $flatParams[] = $r['plate_number'] ?? '';
                $flatParams[] = $r['kilometer'] ?? '';
                $flatParams[] = $r['pkb_no'] ?? '';
                $flatParams[] = $r['pkb_date'] ?? '';
                $flatParams[] = $r['service_advisor'] ?? '';
                $flatParams[] = $r['mechanic'] ?? '';
                $flatParams[] = $r['foreman'] ?? '';
                $flatParams[] = $r['operation_desc'] ?? '';
                $flatParams[] = $r['ths_type'] ?? '';
                $flatParams[] = $r['booking_type'] ?? '';
                $flatParams[] = $r['order_type'] ?? '';
                $flatParams[] = $r['decision_maker'] ?? '';
                $flatParams[] = $r['dm_phone'] ?? '';
                $flatParams[] = $r['contact_person'] ?? '';
                $flatParams[] = $r['cp_phone'] ?? '';
                $flatParams[] = $r['deliver_date'] ?? '';
                $flatParams[] = $r['pkb_status'] ?? '';
                $flatParams[] = (int)($r['sheet_row_index'] ?? 0);
                $flatParams[] = $r['outlet_do'] ?? 'TUNAS TOYOTA KIARA CONDONG';
                $flatParams[] = $r['outlet_service'] ?? 'TUNAS TOYOTA KIARA CONDONG';
                $flatParams[] = $r['connected'] ?? 'FALSE';
                $flatParams[] = $r['contacted'] ?? 'FALSE';
                $flatParams[] = $r['prospect'] ?? 'FALSE';
                $flatParams[] = $r['spk'] ?? 'FALSE';
                $flatParams[] = $r['remarks'] ?? '';
                $flatParams[] = $r['sales_fu_status'] ?? 'Open';
                $flatParams[] = $r['reason_followup'] ?? '';
                $flatParams[] = $r['followup_category'] ?? 'Servis Berkala';
                $flatParams[] = $r['followup_status'] ?? 'Belum Dihubungi';
                $flatParams[] = 'google_sheet';
                $flatParams[] = 'OTHERS';
                $flatParams[] = 'RETAIL';
                $flatParams[] = 'MEDIUM';
                $flatParams[] = 'TUNAS TOYOTA KIARA CONDONG';
                $flatParams[] = $r['sales_fu'] ?? '';
                $flatParams[] = !empty($r['assigned_sales_id']) ? (int)$r['assigned_sales_id'] : null;
                $flatParams[] = isset($r['is_orphan']) ? (int)$r['is_orphan'] : 1;
                $inserted++;
            }
            $sql = "
                INSERT INTO followup_customers (
                    customer_code, name, phone, car_model, last_car_model, car_age, car_year,
                    recommended_model, cluster_name, priority, district, city, address,
                    vin, plate_number, kilometer, pkb_no, pkb_date, service_advisor, mechanic,
                    foreman, operation_desc, ths_type, booking_type, order_type,
                    decision_maker, dm_phone, contact_person, cp_phone, deliver_date, pkb_status,
                    sheet_row_index, outlet_do, outlet_service,
                    connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup,
                    followup_category, followup_status, sync_source,
                    vehicle_filter, cust_type, priority_class, outlet_name,
                    sales_fu, assigned_sales_id, is_orphan
                ) VALUES " . implode(', ', $placeholders) . "
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    phone = VALUES(phone),
                    car_model = VALUES(car_model),
                    last_car_model = VALUES(last_car_model),
                    car_age = VALUES(car_age),
                    car_year = VALUES(car_year),
                    recommended_model = VALUES(recommended_model),
                    cluster_name = VALUES(cluster_name),
                    priority = VALUES(priority),
                    district = VALUES(district),
                    city = VALUES(city),
                    address = VALUES(address),
                    vin = VALUES(vin),
                    plate_number = VALUES(plate_number),
                    kilometer = VALUES(kilometer),
                    pkb_no = VALUES(pkb_no),
                    pkb_date = VALUES(pkb_date),
                    service_advisor = VALUES(service_advisor),
                    mechanic = VALUES(mechanic),
                    foreman = VALUES(foreman),
                    operation_desc = VALUES(operation_desc),
                    ths_type = VALUES(ths_type),
                    booking_type = VALUES(booking_type),
                    order_type = VALUES(order_type),
                    decision_maker = VALUES(decision_maker),
                    dm_phone = VALUES(dm_phone),
                    contact_person = VALUES(contact_person),
                    cp_phone = VALUES(cp_phone),
                    deliver_date = VALUES(deliver_date),
                    pkb_status = VALUES(pkb_status),
                    sheet_row_index = VALUES(sheet_row_index),
                    outlet_do = VALUES(outlet_do),
                    outlet_service = VALUES(outlet_service),
                    followup_category = VALUES(followup_category),
                    sync_source = 'google_sheet'
            ";
            $execRes = followup_execute($sql, $flatParams);
            if ($execRes === [] && $conn->error) {
                echo json_encode(['success' => false, 'message' => 'SQL Error: ' . $conn->error]);
                exit;
            }
        }
    }

    if (!empty($input['mark_complete'])) {
        $now = date('Y-m-d H:i:s');
        $sheetUrl = 'https://docs.google.com/spreadsheets/d/1fvam5FfR1AIKKmv68RGf0dKy2lNpUv-dWc7sbqAe4k4/edit?gid=622548953#gid=622548953';
        if ($is_mysql && $conn) {
            followup_execute("INSERT INTO followup_settings (setting_key, setting_value) VALUES ('last_sync_time', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [$now, $now]);
            followup_execute("INSERT INTO followup_settings (setting_key, setting_value) VALUES ('google_sheet_url', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [$sheetUrl, $sheetUrl]);
        }
    }

    echo json_encode(['success' => true, 'inserted' => $inserted]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=clean_dummy_followups
// Hapus seluruh data yang sudah di-follow up dummy & reset agar bersih sinkron dengan Google Spreadsheet
// -------------------------------------------------------------
if ($action === 'clean_dummy_followups') {
    global $is_mysql, $conn, $sqlite_pdo;

    // 1. Hapus data customer yang berstatus sudah difollow up (dummy progress dari demo sebelumnya)
    $resDel = followup_execute("
        DELETE FROM followup_customers 
        WHERE (followup_status != 'Belum Dihubungi' AND followup_status IS NOT NULL AND followup_status != '')
           OR connected = 'TRUE'
           OR contacted = 'TRUE'
           OR prospect = 'TRUE'
           OR spk = 'TRUE'
           OR (remarks IS NOT NULL AND remarks != '' AND remarks != '-')
           OR (reason_followup IS NOT NULL AND reason_followup != '')
           OR (sales_fu_status IS NOT NULL AND sales_fu_status = 'Closed')
           OR (followup_date IS NOT NULL AND followup_date != '')
    ");

    // 2. Reset sisa database yang ada agar semua murni dalam status Belum Dihubungi (sama persis dengan sheet Database)
    followup_execute("
        UPDATE followup_customers 
        SET connected = 'FALSE',
            contacted = 'FALSE',
            prospect = 'FALSE',
            spk = 'FALSE',
            remarks = '',
            sales_fu_status = 'Open',
            reason_followup = '',
            followup_date = NULL,
            last_contacted_at = NULL,
            followup_status = 'Belum Dihubungi'
        WHERE followup_status IS NULL OR followup_status = '' OR followup_status = 'Belum Dihubungi'
    ");

    // 3. Bersihkan seluruh log aktivitas dummy
    followup_execute("DELETE FROM followup_logs");

    echo json_encode([
        'success' => true,
        'message' => 'Seluruh data follow-up dummy berhasil dihapus. Database kini bersih dan tersinkronkan dengan Google Spreadsheet (semua berstatus Belum Dihubungi).'
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=recalculate_territory_priorities
// Hitung ulang status Priority 1-4 berdasarkan nama Kecamatan (Mapping Territory Phase 1)
// -------------------------------------------------------------
if ($action === 'recalculate_territory_priorities') {
    $normExpr = "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(COALESCE(district, '')), ' ', ''), '.', ''), 'kecamatan', ''), 'kec', ''))";

    followup_execute("UPDATE followup_customers SET priority = ''");
    followup_execute("UPDATE followup_customers SET priority = 'Priority 1' WHERE $normExpr IN ('andir', 'antapani', 'arcamanik', 'bojongloakidul', 'cidadap')");
    followup_execute("UPDATE followup_customers SET priority = 'Priority 2' WHERE $normExpr IN ('buahbatu', 'ujungberung', 'kiaracondong')");
    followup_execute("UPDATE followup_customers SET priority = 'Priority 3' WHERE $normExpr IN ('bandungkidul', 'bandungkulon', 'regol', 'sumurbandung', 'cibiru', 'batununggal')");
    followup_execute("UPDATE followup_customers SET priority = 'Priority 4' WHERE $normExpr IN ('panyileukan', 'cicendo', 'rancasari', 'sukasari', 'coblong', 'lengkong', 'mandalajati', 'cibeunyingkaler', 'cibeunyingkidul', 'bojongloakaler', 'bandungwetan', 'babakanciparay', 'gedebage', 'cinambo', 'astanaanyar', 'sukajadi')");

    $summary = followup_query("SELECT COALESCE(NULLIF(priority, ''), 'Tanpa Priority') as p, COUNT(*) as cnt FROM followup_customers GROUP BY priority ORDER BY p ASC");

    echo json_encode([
        'success' => true,
        'message' => 'Status Priority 1-4 berhasil diperbarui sesuai Mapping Territory Kecamatan.',
        'summary' => $summary
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=recalculate_radar_coords
// Batch geocode seluruh database menggunakan Gazetteer & Alamat Akurat
// -------------------------------------------------------------
if ($action === 'recalculate_radar_coords') {
    global $is_mysql, $conn;
    $GLOBALS['SKIP_REMOTE_GEOCODE'] = true;

    $limit = isset($_GET['limit']) ? max(100, min(3000, (int)$_GET['limit'])) : 1500;
    $force = !empty($_GET['force']) || !empty($_POST['force']);
    $afterId = isset($_GET['after_id']) ? (int)$_GET['after_id'] : 0;

    if ($force) {
        $rows = followup_query("SELECT id, name, district, address, city, notes, plate_number, vin FROM followup_customers WHERE id > ? ORDER BY id ASC LIMIT $limit", [$afterId]);
    } else {
        $rows = followup_query("SELECT id, name, district, address, city, notes, plate_number, vin FROM followup_customers WHERE (lat IS NULL OR lng IS NULL) ORDER BY id ASC LIMIT $limit");
    }

    $processed = 0;
    $lastId = $afterId;

    if (!empty($rows) && is_array($rows)) {
        if ($is_mysql && $conn) {
            $conn->begin_transaction();
            $stmt = $conn->prepare("UPDATE followup_customers SET lat = ?, lng = ?, geo_district = ?, geo_address = ? WHERE id = ?");
            foreach ($rows as $row) {
                $cid = (int)$row['id'];
                $rawName = trim((string)($row['name'] ?? ''));
                $rawDist = trim((string)($row['district'] ?? ''));
                $rawAddr = trim((string)($row['address'] ?? ''));
                $rawCity = trim((string)($row['city'] ?? ''));
                $rawNotes = trim((string)($row['notes'] ?? ''));

                $fullAddrParts = array_filter([$rawAddr, $rawDist, $rawCity], fn($v) => $v !== '' && $v !== '0');
                $fullAddr = !empty($fullAddrParts) ? implode(', ', $fullAddrParts) : $rawNotes;
                $entityAddrSrc = ($rawAddr !== '' && $rawAddr !== '0') ? $rawAddr : $rawNotes;
                $entitySeed = radarComputeEntitySeed($cid, $rawName, $entityAddrSrc, $rawDist, $rawCity);

                $coords = getAccurateCoords($cid, $rawDist, $fullAddr, null, $row['plate_number'] ?? '', $row['vin'] ?? '', $entitySeed);
                $latVal = (float)$coords[0];
                $lngVal = (float)$coords[1];
                $gDist = substr((string)($coords[2] ?? $rawDist), 0, 145);
                $gAddr = (string)($coords[3] ?? $fullAddr);

                $stmt->bind_param('ddssi', $latVal, $lngVal, $gDist, $gAddr, $cid);
                $stmt->execute();
                $processed++;
                $lastId = $cid;
            }
            $stmt->close();
            $conn->commit();
        }
    }

    $remRows = $force
        ? followup_query("SELECT COUNT(*) as cnt FROM followup_customers WHERE id > ?", [$lastId])
        : followup_query("SELECT COUNT(*) as cnt FROM followup_customers WHERE lat IS NULL OR lng IS NULL");
    $remaining = !empty($remRows) ? (int)$remRows[0]['cnt'] : 0;

    echo json_encode([
        'success' => true,
        'processed' => $processed,
        'remaining' => $remaining,
        'last_id' => $lastId
    ]);
    exit;
}
