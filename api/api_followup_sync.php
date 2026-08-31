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

    $defaultSheet = 'https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?usp=sharing';
    $defaultScript = 'https://script.google.com/macros/s/AKfycbwg7iocmbSQeqHekaheVs3Co4DZ5-azv37f-CmSbOETyQLgFyEGph5_j1CySWbn3IHJ/exec';

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

    // Sync to MySQL tabel_sheets_sync_config if active
    if ($is_mysql && $conn) {
        try {
            $sheetUrl = trim($input['google_sheet_url'] ?? '');
            $scriptUrl = trim($input['google_apps_script_url'] ?? '');
            if ($sheetUrl) {
                $sheetId = '';
                if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $sheetUrl, $matches)) {
                    $sheetId = $matches[1];
                }
                $conn->query("
                    INSERT INTO tabel_sheets_sync_config (id, spreadsheet_url, spreadsheet_id, apps_script_webhook_url, auto_sync_enabled)
                    VALUES (1, '" . $conn->real_escape_string($sheetUrl) . "', '" . $conn->real_escape_string($sheetId) . "', '" . $conn->real_escape_string($scriptUrl) . "', 1)
                    ON DUPLICATE KEY UPDATE
                        spreadsheet_url = '" . $conn->real_escape_string($sheetUrl) . "',
                        spreadsheet_id = '" . $conn->real_escape_string($sheetId) . "',
                        apps_script_webhook_url = '" . $conn->real_escape_string($scriptUrl) . "'
                ");
            }
        } catch (Exception $e) {
            // Ignore error
        }
    }

    echo json_encode(['success' => true, 'message' => 'Pengaturan sinkronisasi berhasil disimpan']);
    exit;
}

/**
 * Reusable Google Sheet pull engine for Tunas Toyota Kiara Condong CRM
 */
function sync_google_sheet_data($sheetUrl = null) {
    if (!$sheetUrl) {
        $rows = followup_query("SELECT setting_value FROM followup_settings WHERE setting_key = 'google_sheet_url' LIMIT 1");
        $sheetUrl = !empty($rows) ? $rows[0]['setting_value'] : '';
    }

    $defaultSheet = 'https://docs.google.com/spreadsheets/d/1pqfrHV6Ycl-5UAJXtEe_9h9Y6XIyvHTicOOraFkbO8g/edit?gid=1618304635#gid=1618304635';
    if (!$sheetUrl) {
        $sheetUrl = $defaultSheet;
    }

    // Convert standard Google Sheet URL to public CSV export URL
    $csvUrl = $sheetUrl;
    if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $sheetUrl, $matches)) {
        $sheetId = $matches[1];
        $gid = '1525199412'; // Default data sheet for Tunas Toyota Kiara Condong ('New FU Kiara Condong')
        if (preg_match('/gid=([0-9]+)/', $sheetUrl, $gMatches)) {
            $parsedGid = $gMatches[1];
            if ($parsedGid === '1618304635' || $parsedGid === '607414573' || $parsedGid === '0') {
                $gid = '1525199412';
            } else {
                $gid = $parsedGid;
            }
        }
        $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";
    }

    // Fetch CSV content
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
            "timeout" => 35
        ],
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false
        ]
    ];
    $context = stream_context_create($opts);
    $csvContent = @file_get_contents($csvUrl, false, $context);

    if ($csvContent === false) {
        return [
            'success' => false,
            'message' => 'Gagal mengambil data dari Google Spreadsheet. Pastikan link dapat diakses publik.'
        ];
    }

    // Parse CSV rows
    $lines = str_getcsv($csvContent, "\n");
    if (empty($lines)) {
        return ['success' => false, 'message' => 'Google Sheet kosong.'];
    }

    // Find header row
    $headerRowIdx = 0;
    $keywords = ['nama', 'customer', 'contact', 'telepon', 'phone', 'wa', 'vehicle', 'mobil', 'model', 'vin', 'cluster', 'priority'];

    for ($r = 0; $r < min(10, count($lines)); $r++) {
        $cols = array_map('strtolower', array_map('trim', str_getcsv($lines[$r], ",")));
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

    $rawHeaders = str_getcsv($lines[$headerRowIdx], ",");
    $headers = array_map('strtolower', array_map('trim', $rawHeaders));

    $findIdx = function($patterns) use ($headers) {
        foreach ($patterns as $p) {
            foreach ($headers as $idx => $h) {
                if (preg_match($p, $h)) return $idx;
            }
        }
        return -1;
    };

    $nameIdx = $findIdx(['/nama by single vin/i', '/nama customer/i', '/nama/i', '/customer/i', '/pelanggan/i']);
    $phone1Idx = $findIdx(['/contact person 1/i', '/no wa/i', '/telepon/i', '/phone/i', '/no_hp/i', '/hp/i']);
    $phone2Idx = $findIdx(['/contact person 2/i']);
    $vehicleFilterIdx = $findIdx(['/vehicle filter/i']);
    $rec1Idx = $findIdx(['/alternative_recommendation_model_1/i', '/1\.\s*model/i']);
    $rec2Idx = $findIdx(['/alternative_recommendation_model_2/i', '/2\.\s*model/i']);
    $rec3Idx = $findIdx(['/alternative_recommendation_model_3/i', '/3\.\s*model/i']);
    $lastCarIdx = $findIdx(['/latest_model/i', '/model_kendaraan_terakhir/i', '/mobil.*saat ini/i', '/unit.*saat ini/i']);
    $ageIdx = $findIdx(['/vehicle age/i', '/usia_kendaraan_terakhir/i', '/usia.*kendaraan/i', '/usia/i', '/tahun/i']);
    $clusterIdx = $findIdx(['/cluster_name/i', '/cluster/i', '/klaster/i']);
    $priorityIdx = $findIdx(['/priority/i', '/prioritas/i']);
    $districtIdx = $findIdx(['/alamat_kecamatan/i', '/kecamatan/i', '/wilayah/i', '/domisili/i']);
    $vinIdx = $findIdx(['/latest_vin/i', '/vin_kendaraan_terakhir/i', '/vin/i', '/no_rangka/i']);
    $custTypeIdx = $findIdx(['/cust\.\s*type/i', '/fleet_or_retail/i', '/tipe.*customer/i']);
    $doOutletIdx = $findIdx(['/do_oleh_tunas/i', '/nama_outlet_do/i', '/outlet.*do/i']);
    $srvOutletIdx = $findIdx(['/service_di_tunas/i', '/nama_outlet_service/i']);
    $srvComplianceIdx = $findIdx(['/rasio_kepatuhan_service/i', '/kepatuhan_service/i']);
    $tempIdx = $findIdx(['/veloz_hybrid_temperature/i', '/1\.\s*temperatur/i', '/temperatur/i', '/class/i']);
    $outletNameIdx = $findIdx(['/outlet_name/i', '/nama.*outlet/i', '/cabang/i']);

    // TAM standard response columns
    $connIdx = $findIdx(['/^connected/i']);
    $contIdx = $findIdx(['/^contacted/i']);
    $prospIdx = $findIdx(['/^prospect/i']);
    $spkIdx = $findIdx(['/^spk/i']);
    $remarksIdx = $findIdx(['/^remarks/i']);
    $statusFuIdx = $findIdx(['/^status.*fu/i']);
    $reasonFuIdx = $findIdx(['/^reason/i', '/^alasan/i']);
    $salesFuIdx = $findIdx(['/^sales.*fu/i', '/sales/i', '/pic/i', '/wiraniaga/i']);
    $fuDateIdx = $findIdx(['/tanggal.*pengisian/i', '/tanggal.*fu/i']);
    $allSpkIdx = $findIdx(['/all spk/i']);
    $allDoIdx = $findIdx(['/all do/i']);

    // Begin SQLite Transaction or MySQL mass insert
    global $is_mysql, $sqlite_pdo, $conn;
    if ($sqlite_pdo) {
        $sqlite_pdo->beginTransaction();
    }

    // Clean up phantom/blank records from previous syncs
    try {
        followup_execute("DELETE FROM followup_customers WHERE name LIKE 'Pelanggan Toyota%' OR phone = '-' OR phone = '' OR name = '-' OR name = 'NO DATA' OR customer_code LIKE 'CUST-KIRCON-%'");
    } catch (Exception $e) {}

    global $is_mysql, $sqlite_pdo, $conn;

    $rowsToInsert = [];
    $inserted = 0;

    for ($i = $headerRowIdx + 1; $i < count($lines); $i++) {
        if (!trim($lines[$i])) continue;
        $row = str_getcsv($lines[$i], ",");
        if (empty($row) || count($row) < 5) continue;

        $name = $nameIdx !== -1 ? trim($row[$nameIdx] ?? '') : '';
        if (!$name || $name === '-' || $name === 'NO DATA') continue;

        $rawPhone1 = $phone1Idx !== -1 ? trim($row[$phone1Idx] ?? '') : '';
        $rawPhone2 = $phone2Idx !== -1 ? trim($row[$phone2Idx] ?? '') : '';

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

        $phone1 = $cleanP($rawPhone1);
        $phone2 = $cleanP($rawPhone2);
        $phone = $phone1 ?: ($phone2 ?: '');

        if (!$phone) continue;

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
        if ($age && is_numeric($age)) $age = number_format((float)$age, 1) . ' Thn';

        $cluster = $clusterIdx !== -1 ? trim($row[$clusterIdx] ?? '') : '';
        $priority = $priorityIdx !== -1 ? trim($row[$priorityIdx] ?? '') : '';
        $district = $districtIdx !== -1 ? trim($row[$districtIdx] ?? '') : '';
        if ($district === 'NO DATA' || $district === '-') $district = '';

        $vin = $vinIdx !== -1 ? trim($row[$vinIdx] ?? '') : '';
        $custType = $custTypeIdx !== -1 ? strtoupper(trim($row[$custTypeIdx] ?? 'RETAIL')) : 'RETAIL';
        if ($custType !== 'FLEET') $custType = 'RETAIL';

        $outletDo = $doOutletIdx !== -1 ? trim($row[$doOutletIdx] ?? '') : '';
        $outletSrv = $srvOutletIdx !== -1 ? trim($row[$srvOutletIdx] ?? '') : '';
        $srvComp = $srvComplianceIdx !== -1 ? trim($row[$srvComplianceIdx] ?? '') : '';
        $temperature = $tempIdx !== -1 ? strtoupper(trim($row[$tempIdx] ?? 'MEDIUM')) : 'MEDIUM';
        if (!in_array($temperature, ['HIGH', 'MEDIUM', 'LOW'])) $temperature = 'MEDIUM';

        $outletName = $outletNameIdx !== -1 ? trim($row[$outletNameIdx] ?? 'TUNAS TOYOTA KIARA CONDONG') : 'TUNAS TOYOTA KIARA CONDONG';

        // Response fields
        $rawConn = $connIdx !== -1 ? trim($row[$connIdx] ?? '') : '';
        $connected = ($rawConn === '1' || strtoupper($rawConn) === 'TRUE') ? 'TRUE' : 'FALSE';

        $rawCont = $contIdx !== -1 ? trim($row[$contIdx] ?? '') : '';
        $contacted = ($rawCont === '1' || strtoupper($rawCont) === 'TRUE') ? 'TRUE' : 'FALSE';

        $rawProsp = $prospIdx !== -1 ? trim($row[$prospIdx] ?? '') : '';
        $prospect = ($rawProsp === '1' || strtoupper($rawProsp) === 'TRUE') ? 'TRUE' : 'FALSE';

        $rawSpk = $spkIdx !== -1 ? trim($row[$spkIdx] ?? '') : '';
        $spk = ($rawSpk === '1' || strtoupper($rawSpk) === 'TRUE') ? 'TRUE' : 'FALSE';

        $remarks = $remarksIdx !== -1 ? trim($row[$remarksIdx] ?? '') : '';
        $salesFuStatus = $statusFuIdx !== -1 ? trim($row[$statusFuIdx] ?? 'Open') : 'Open';
        $reasonFu = $reasonFuIdx !== -1 ? trim($row[$reasonFuIdx] ?? '') : '';
        $salesFu = $salesFuIdx !== -1 ? trim($row[$salesFuIdx] ?? '') : '';
        $fuDate = $fuDateIdx !== -1 ? trim($row[$fuDateIdx] ?? '') : '';

        $allSpk = $allSpkIdx !== -1 ? trim($row[$allSpkIdx] ?? '') : '';
        $allDo = $allDoIdx !== -1 ? trim($row[$allDoIdx] ?? '') : '';

        $doUnit = (stripos($allDo, 'DO') !== false || $allDo === '1' || stripos($remarks, 'DO') !== false) ? 'TRUE' : 'FALSE';

        // Target Recommended Unit
        $targetCar = $rec1 ?: ($vFilter !== 'OTHERS' ? $vFilter : ($lastCar ?: 'Toyota Unit'));
        $carModel = $targetCar;
        $category = 'Trade-in / Repurchase (' . $carModel . ')';

        $status = 'Belum Dihubungi';
        if ($doUnit === 'TRUE' || $spk === 'TRUE' || $remarks === 'SPK berhasil') $status = 'Deal / Selesai';
        elseif ($remarks === 'Customer tertarik' || $prospect === 'TRUE') $status = 'Tertarik / Jadwal Servis';
        elseif ($remarks === 'Customer menolak' || $remarks === 'Customer tidak aktif') $status = 'Tidak Tertarik';
        elseif ($remarks === 'Customer janjian' || $remarks === 'Customer pending' || $contacted === 'TRUE' || $connected === 'TRUE') $status = 'Menunggu Respon';

        // Deterministic customer code to prevent duplicates on repeated syncs
        $code = $vin ? ('VIN-' . $vin) : ('CUST-' . substr(md5($name . $phone), 0, 12));

        $rowsToInsert[] = [
            $code, $name, $phone, $carModel, $lastCar, $age,
            $targetCar, $rec2, $rec3, $cluster, $priority, $district, $vin,
            $outletDo, $outletSrv, $srvComp,
            $connected, $contacted, $prospect, $spk, $remarks, $salesFuStatus, $reasonFu, $fuDate ?: null,
            $category, $status,
            $vFilter, $custType, $temperature, $outletName, $salesFu, $doUnit, $allSpk, $allDo
        ];
    }

    // Execute in fast chunks of 50 rows
    $chunkSize = 50;
    $chunks = array_chunk($rowsToInsert, $chunkSize);

    if ($sqlite_pdo && !$is_mysql) {
        $sqlite_pdo->beginTransaction();
        $sqlite_stmt = $sqlite_pdo->prepare("
            INSERT INTO followup_customers (
                customer_code, name, phone, car_model, last_car_model, car_age,
                recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, vin,
                outlet_do, outlet_service, service_compliance,
                connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup, followup_date,
                followup_category, followup_status, sync_source,
                vehicle_filter, cust_type, priority_class, outlet_name, sales_fu, do_unit, all_spk, all_do
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'google_sheet', ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(customer_code) DO UPDATE SET
                name = excluded.name, car_model = excluded.car_model, last_car_model = excluded.last_car_model,
                car_age = excluded.car_age, recommended_model = excluded.recommended_model,
                alt_model_2 = excluded.alt_model_2, alt_model_3 = excluded.alt_model_3,
                cluster_name = excluded.cluster_name, priority = excluded.priority, district = excluded.district,
                vin = excluded.vin, outlet_do = excluded.outlet_do, outlet_service = excluded.outlet_service,
                service_compliance = excluded.service_compliance,
                connected = CASE WHEN excluded.connected != 'FALSE' THEN excluded.connected ELSE followup_customers.connected END,
                contacted = CASE WHEN excluded.contacted != 'FALSE' THEN excluded.contacted ELSE followup_customers.contacted END,
                prospect = CASE WHEN excluded.prospect != 'FALSE' THEN excluded.prospect ELSE followup_customers.prospect END,
                spk = CASE WHEN excluded.spk != 'FALSE' THEN excluded.spk ELSE followup_customers.spk END,
                remarks = CASE WHEN excluded.remarks != '' THEN excluded.remarks ELSE followup_customers.remarks END,
                sales_fu_status = CASE WHEN excluded.sales_fu_status != 'Open' THEN excluded.sales_fu_status ELSE followup_customers.sales_fu_status END,
                reason_followup = CASE WHEN excluded.reason_followup != '' THEN excluded.reason_followup ELSE followup_customers.reason_followup END,
                followup_date = CASE WHEN excluded.followup_date IS NOT NULL THEN excluded.followup_date ELSE followup_customers.followup_date END,
                followup_category = excluded.followup_category,
                vehicle_filter = excluded.vehicle_filter,
                cust_type = excluded.cust_type,
                priority_class = excluded.priority_class,
                outlet_name = excluded.outlet_name,
                sales_fu = CASE WHEN excluded.sales_fu != '' THEN excluded.sales_fu ELSE followup_customers.sales_fu END,
                do_unit = CASE WHEN excluded.do_unit != 'FALSE' THEN excluded.do_unit ELSE followup_customers.do_unit END,
                all_spk = excluded.all_spk,
                all_do = excluded.all_do
        ");
        foreach ($rowsToInsert as $rData) {
            $sqlite_stmt->execute($rData);
            $inserted++;
        }
        $sqlite_pdo->commit();
    } elseif ($is_mysql && $conn) {
        foreach ($chunks as $chunk) {
            $placeholders = [];
            $flatParams = [];
            foreach ($chunk as $rData) {
                $placeholders[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'google_sheet', ?, ?, ?, ?, ?, ?, ?, ?)";
                foreach ($rData as $val) {
                    $flatParams[] = $val;
                }
                $inserted++;
            }
            $sql = "
                INSERT INTO followup_customers (
                    customer_code, name, phone, car_model, last_car_model, car_age,
                    recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, vin,
                    outlet_do, outlet_service, service_compliance,
                    connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup, followup_date,
                    followup_category, followup_status, sync_source,
                    vehicle_filter, cust_type, priority_class, outlet_name, sales_fu, do_unit, all_spk, all_do
                ) VALUES " . implode(', ', $placeholders) . "
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name), car_model = VALUES(car_model), last_car_model = VALUES(last_car_model),
                    car_age = VALUES(car_age), recommended_model = VALUES(recommended_model),
                    alt_model_2 = VALUES(alt_model_2), alt_model_3 = VALUES(alt_model_3),
                    cluster_name = VALUES(cluster_name), priority = VALUES(priority), district = VALUES(district),
                    vin = VALUES(vin), outlet_do = VALUES(outlet_do), outlet_service = VALUES(outlet_service),
                    service_compliance = VALUES(service_compliance),
                    connected = CASE WHEN VALUES(connected) != 'FALSE' THEN VALUES(connected) ELSE connected END,
                    contacted = CASE WHEN VALUES(contacted) != 'FALSE' THEN VALUES(contacted) ELSE contacted END,
                    prospect = CASE WHEN VALUES(prospect) != 'FALSE' THEN VALUES(prospect) ELSE prospect END,
                    spk = CASE WHEN VALUES(spk) != 'FALSE' THEN VALUES(spk) ELSE spk END,
                    remarks = CASE WHEN VALUES(remarks) != '' THEN VALUES(remarks) ELSE remarks END,
                    sales_fu_status = CASE WHEN VALUES(sales_fu_status) != 'Open' THEN VALUES(sales_fu_status) ELSE sales_fu_status END,
                    reason_followup = CASE WHEN VALUES(reason_followup) != '' THEN VALUES(reason_followup) ELSE reason_followup END,
                    followup_date = CASE WHEN VALUES(followup_date) IS NOT NULL THEN VALUES(followup_date) ELSE followup_date END,
                    followup_category = VALUES(followup_category),
                    vehicle_filter = VALUES(vehicle_filter),
                    cust_type = VALUES(cust_type),
                    priority_class = VALUES(priority_class),
                    outlet_name = VALUES(outlet_name),
                    sales_fu = CASE WHEN VALUES(sales_fu) != '' THEN VALUES(sales_fu) ELSE sales_fu END,
                    do_unit = CASE WHEN VALUES(do_unit) != 'FALSE' THEN VALUES(do_unit) ELSE do_unit END,
                    all_spk = VALUES(all_spk),
                    all_do = VALUES(all_do)
            ";
            followup_execute($sql, $flatParams);
        }
    }

    $now = date('Y-m-d H:i:s');
    if ($is_mysql && $conn) {
        followup_execute("
            INSERT INTO followup_settings (setting_key, setting_value) VALUES ('last_sync_time', ?)
            ON DUPLICATE KEY UPDATE setting_value = ?
        ", [$now, $now]);
        followup_execute("
            INSERT INTO followup_settings (setting_key, setting_value) VALUES ('google_sheet_url', ?)
            ON DUPLICATE KEY UPDATE setting_value = ?
        ", [$sheetUrl, $sheetUrl]);
    } else {
        followup_execute("INSERT OR REPLACE INTO followup_settings (setting_key, setting_value) VALUES ('last_sync_time', ?)", [$now]);
        followup_execute("INSERT OR REPLACE INTO followup_settings (setting_key, setting_value) VALUES ('google_sheet_url', ?)", [$sheetUrl]);
    }

    return [
        'success' => true,
        'message' => "Sinkronisasi Google Spreadsheet berhasil! $inserted data leads customer berhasil disinkronkan ke sistem.",
        'inserted' => $inserted,
        'last_sync' => $now,
        'sheet_url' => $sheetUrl
    ];
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup_sync.php?action=pull_sheet
// -------------------------------------------------------------
if ($action === 'pull_sheet') {
    $input = get_json_input();
    $sheetUrl = trim($input['google_sheet_url'] ?? '');
    $res = sync_google_sheet_data($sheetUrl);
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
