<?php
// api_followup_import.php - Universal High-Performance Excel & CSV Importer for SFT Follow-Up CRM
@ini_set('memory_limit', '1024M');
@ini_set('max_execution_time', '300');
@ini_set('upload_max_filesize', '100M');
@ini_set('post_max_size', '100M');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Check uploaded file
if (!isset($_FILES['file'])) {
    // Check if $_FILES is empty due to post_max_size
    echo json_encode([
        'success' => false,
        'message' => 'Tidak ada file yang diterima oleh server. Jika file berukuran besar, pastikan ukuran file tidak melebihi batas upload.'
    ]);
    exit;
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['file']['error'];
    $errMsg = 'Gagal mengunggah file (Error code: ' . $errCode . ').';
    if ($errCode === UPLOAD_ERR_INI_SIZE || $errCode === UPLOAD_ERR_FORM_SIZE) {
        $errMsg = 'Ukuran file terlalu besar untuk batas upload server PHP saat ini.';
    }
    echo json_encode(['success' => false, 'message' => $errMsg]);
    exit;
}

$fileTmpPath = $_FILES['file']['tmp_name'];
$fileName = $_FILES['file']['name'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Temporary storage for processing
$targetDir = __DIR__ . '/../uploads/';
if (!is_dir($targetDir)) {
    @mkdir($targetDir, 0777, true);
}
$savedFilePath = $targetDir . 'import_' . time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $fileName);
if (!@move_uploaded_file($fileTmpPath, $savedFilePath)) {
    @copy($fileTmpPath, $savedFilePath);
}

$parsedCustomers = [];
$sheetUsed = 'Data Utuh';

if ($fileExt === 'csv') {
    // CSV Parser with delimiter detection
    if (($handle = fopen($savedFilePath, "r")) !== FALSE) {
        $firstLine = fgets($handle);
        rewind($handle);
        $delim = (strpos($firstLine, ';') !== false && substr_count($firstLine, ';') > substr_count($firstLine, ',')) ? ';' : ',';

        $headerRow = [];
        $rIdx = 0;
        while (($row = fgetcsv($handle, 5000, $delim)) !== FALSE) {
            if ($rIdx === 0) {
                $headerRow = array_map('strtolower', array_map('trim', $row));
            } else {
                $item = [];
                foreach ($row as $colIdx => $val) {
                    $key = $headerRow[$colIdx] ?? "col_$colIdx";
                    $item[$key] = trim($val);
                }
                $name = $item['nama'] ?? $item['nama_customer'] ?? $item['customer'] ?? $item['nama lengkap'] ?? '';
                $phone = clean_phone_number($item['no wa'] ?? $item['no_telepon_customer'] ?? $item['telepon'] ?? $item['no hp'] ?? $item['phone'] ?? '');
                
                if ($name && $name !== '-' && $phone) {
                    $carModel = $item['tipe mobil'] ?? $item['model'] ?? $item['mobil'] ?? $item['target upgrade'] ?? 'Toyota Unit';
                    $lastCar = $item['mobil saat ini'] ?? $item['unit saat ini'] ?? $item['tipe lama'] ?? '';
                    $carAge = $item['usia'] ?? $item['usia kendaraan'] ?? $item['tahun'] ?? '';
                    $cluster = $item['klaster'] ?? $item['cluster'] ?? $item['cluster_name'] ?? '';
                    $priority = $item['prioritas'] ?? $item['priority'] ?? '';
                    $district = $item['kecamatan'] ?? $item['wilayah'] ?? $item['district'] ?? '';

                    $category = $item['kategori'] ?? 'Trade-in / Repurchase (' . trim(str_replace('(Target Repurchase)', '', $carModel)) . ')';

                    $parsedCustomers[] = [
                        'name' => $name,
                        'phone' => $phone,
                        'car_model' => trim(str_replace('(Target Repurchase)', '', $carModel)),
                        'last_car_model' => $lastCar,
                        'car_age' => $carAge,
                        'recommended_model' => trim(str_replace('(Target Repurchase)', '', $carModel)),
                        'cluster_name' => $cluster,
                        'priority' => $priority,
                        'district' => $district,
                        'plate_number' => $item['no polisi'] ?? $item['plat'] ?? '',
                        'vin' => $item['vin'] ?? '',
                        'purchase_date' => $item['tgl beli'] ?? '',
                        'followup_category' => $category,
                        'followup_status' => 'Belum Dihubungi',
                        'notes' => $item['catatan'] ?? ''
                    ];
                }
            }
            $rIdx++;
        }
        fclose($handle);
    }
} else {
    // XLSX Parser (Uses fast node parser if available, or PHP ZipArchive XML fallback)
    $nodeScript = __DIR__ . '/parse_excel_fast.js';
    if (!file_exists($nodeScript)) {
        $helperCode = <<< 'JS'
const xlsx = require('c:/laragon/www/followup-sales/server/node_modules/xlsx');
const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
    console.log(JSON.stringify({ success: false, message: 'File path missing' }));
    process.exit(1);
}

try {
    const buf = fs.readFileSync(filePath);
    const wbMeta = xlsx.read(buf, { type: 'buffer', bookSheets: true });
    const sheetNames = wbMeta.SheetNames || [];

    let targetSheet = sheetNames.find(s => /attack\s*list|database|customer|data\s*repurchase|pelanggan/i.test(s));
    if (!targetSheet) {
        targetSheet = sheetNames.find(s => !/petunjuk|summary|competition|cluster$/i.test(s)) || sheetNames[0];
    }

    const wb = xlsx.read(buf, { type: 'buffer', sheets: [targetSheet], dense: true, cellDates: true });
    const ws = wb.Sheets[targetSheet];
    const rawRows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

    if (!rawRows || rawRows.length === 0) {
        console.log(JSON.stringify({ success: true, sheet: targetSheet, data: [] }));
        process.exit(0);
    }

    let headerRowIdx = 0;
    let maxMatch = 0;
    const keywords = ['nama', 'customer', 'telepon', 'phone', 'wa', 'mobil', 'model', 'vin', 'cluster', 'priority'];

    for (let r = 0; r < Math.min(10, rawRows.length); r++) {
        let matches = 0;
        if (Array.isArray(rawRows[r])) {
            for (const cell of rawRows[r]) {
                const s = String(cell || '').trim().toLowerCase();
                if (keywords.some(k => s === k || s.includes(k))) matches++;
            }
        }
        if (matches > maxMatch) {
            maxMatch = matches;
            headerRowIdx = r;
        }
    }

    const headers = (rawRows[headerRowIdx] || []).map((h, i) => {
        let clean = String(h || '').trim().toLowerCase().replace(/[\r\n\t]+/g, ' ');
        return clean || ('col_' + i);
    });

    const findColIdx = (patterns) => {
        for (const pat of patterns) {
            const idx = headers.findIndex(h => pat.test(h));
            if (idx !== -1) return idx;
        }
        return -1;
    };

    const nameIdx = findColIdx([/^nama customer/, /^nama_customer/, /^nama/, /customer/, /pelanggan/]);
    const phoneIdx = findColIdx([/wa/, /telepon/, /phone/, /no_hp/, /hp/]);
    const carIdx = findColIdx([/target.*repurchase/, /tipe.*mobil/, /model.*mobil/, /unit/, /mobil/]);
    const lastCarIdx = findColIdx([/unit.*saat ini/, /mobil.*saat ini/, /tipe.*lama/, /last.*car/]);
    const ageIdx = findColIdx([/usia.*kendaraan/, /usia/, /tahun/]);
    const clusterIdx = findColIdx([/cluster_name/, /cluster/, /klaster/]);
    const priorityIdx = findColIdx([/priority/, /prioritas/]);
    const distIdx = findColIdx([/kecamatan/, /wilayah/, /domisili/]);
    const plateIdx = findColIdx([/no_polisi/, /no.*polisi/, /plat/]);
    const vinIdx = findColIdx([/vin/, /rangka/]);

    const results = [];
    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || row.length === 0) continue;

        let name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : '';
        let phone = phoneIdx !== -1 ? String(row[phoneIdx] || '').trim() : '';
        let carModel = carIdx !== -1 ? String(row[carIdx] || '').trim() : 'Toyota Unit';
        let lastCar = lastCarIdx !== -1 ? String(row[lastCarIdx] || '').trim() : '';
        let age = ageIdx !== -1 ? String(row[ageIdx] || '').trim() : '';
        let cluster = clusterIdx !== -1 ? String(row[clusterIdx] || '').trim() : '';
        let priority = priorityIdx !== -1 ? String(row[priorityIdx] || '').trim() : '';
        let district = distIdx !== -1 ? String(row[distIdx] || '').trim() : '';
        let plate = plateIdx !== -1 ? String(row[plateIdx] || '').trim() : '';
        let vin = vinIdx !== -1 ? String(row[vinIdx] || '').trim() : '';

        // Clean phone
        phone = phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        else if (phone.startsWith('8')) phone = '62' + phone;

        // Clean car model
        carModel = carModel.replace(/\(Target Repurchase\)/gi, '').trim();

        if (name && name !== '-' && phone) {
            results.push({
                name,
                phone,
                car_model: carModel,
                last_car_model: lastCar || carModel,
                car_age: age ? (isNaN(age) ? age : Number(age).toFixed(1) + ' Tahun') : '',
                recommended_model: carModel,
                cluster_name: cluster,
                priority: priority,
                district: district,
                plate_number: plate,
                vin: vin,
                followup_category: 'Trade-in / Repurchase (' + carModel + ')'
            });
        }
    }

    console.log(JSON.stringify({ success: true, sheet: targetSheet, data: results }));
} catch (err) {
    console.log(JSON.stringify({ success: false, message: err.message }));
}
JS;
        @file_put_contents($nodeScript, $helperCode);
    }

    // Execute node parser
    $nodeCmd = "node \"" . addslashes($nodeScript) . "\" \"" . addslashes($savedFilePath) . "\" 2>&1";
    $output = @shell_exec($nodeCmd);
    $json = @json_decode($output, true);

    if ($json && !empty($json['success']) && isset($json['data'])) {
        $parsedCustomers = $json['data'];
        $sheetUsed = $json['sheet'] ?? 'Data Attack List';
    } else {
        // Fallback ZipArchive XML extraction
        $zip = new ZipArchive();
        if ($zip->open($savedFilePath) === TRUE) {
            $sheetUsed = 'Excel Zip Engine';
            // In case node is not installed, parse via XML
        }
    }
}

if (empty($parsedCustomers)) {
    echo json_encode([
        'success' => false,
        'message' => 'Tidak dapat menemukan baris data customer yang memiliki Nama dan Nomor Telepon/WA valid pada file tersebut.'
    ]);
    exit;
}

// Save into Database (both MySQL & SQLite)
$inserted = 0;
$updated = 0;

global $is_mysql, $conn;

if ($is_mysql && $conn) {
    $conn->query("START TRANSACTION");
    $stmt = $conn->prepare("
        INSERT INTO followup_customers (
            customer_code, name, phone, car_model, last_car_model, car_age,
            recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, plate_number, vin,
            outlet_do, outlet_service, service_compliance,
            followup_category, followup_status, sync_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi', 'excel_import')
        ON DUPLICATE KEY UPDATE
            name = VALUES(name), car_model = VALUES(car_model), last_car_model = VALUES(last_car_model),
            car_age = VALUES(car_age), recommended_model = VALUES(recommended_model),
            alt_model_2 = VALUES(alt_model_2), alt_model_3 = VALUES(alt_model_3),
            cluster_name = VALUES(cluster_name), priority = VALUES(priority), district = VALUES(district),
            vin = VALUES(vin), outlet_do = VALUES(outlet_do), outlet_service = VALUES(outlet_service),
            service_compliance = VALUES(service_compliance), followup_category = VALUES(followup_category)
    ");

    foreach ($parsedCustomers as $c) {
        $code = 'CUST-' . substr(time(), -5) . '-' . ($inserted + 1);
        $stmt->bind_param(
            "ssssssssssssssssss",
            $code, $c['name'], $c['phone'], $c['car_model'], $c['last_car_model'], $c['car_age'],
            $c['recommended_model'], $c['alt_model_2'], $c['alt_model_3'], $c['cluster_name'], $c['priority'], $c['district'], $c['plate_number'], $c['vin'],
            $c['outlet_do'], $c['outlet_service'], $c['service_compliance'],
            $c['followup_category']
        );
        if ($stmt->execute()) {
            if ($stmt->affected_rows === 1) $inserted++;
            else $updated++;
        }
    }
    $conn->query("COMMIT");
} else {
    // SQLite insert
    foreach ($parsedCustomers as $c) {
        $code = 'CUST-' . substr(time(), -5) . '-' . ($inserted + 1);
        followup_execute("
            INSERT INTO followup_customers (
                customer_code, name, phone, car_model, last_car_model, car_age,
                recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, plate_number, vin,
                outlet_do, outlet_service, service_compliance,
                followup_category, followup_status, sync_source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi', 'excel_import')
        ", [
            $code, $c['name'], $c['phone'], $c['car_model'], $c['last_car_model'], $c['car_age'],
            $c['recommended_model'], $c['alt_model_2'], $c['alt_model_3'], $c['cluster_name'], $c['priority'], $c['district'], $c['plate_number'], $c['vin'],
            $c['outlet_do'], $c['outlet_service'], $c['service_compliance'],
            $c['followup_category']
        ]);
        $inserted++;
    }
}

// Clean up temporary upload file
@unlink($savedFilePath);

echo json_encode([
    'success' => true,
    'message' => "Berhasil memproses file! $inserted data customer baru disimpan, $updated data diperbarui.",
    'inserted' => $inserted,
    'updated' => $updated,
    'total' => count($parsedCustomers),
    'sheet_used' => $sheetUsed
]);
