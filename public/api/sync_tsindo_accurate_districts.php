<?php
// api/sync_tsindo_accurate_districts.php - Re-synchronize TSINDO districts & names directly from original Excel
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

@ini_set('memory_limit', '1024M');
@set_time_limit(600);

require_once __DIR__ . '/api_followup_db.php';
require_once __DIR__ . '/api_radar_gazetteer.php';

$excelPath = dirname(__DIR__) . '/TSINDO - Laporan Sales Unit (5) (1) (1).xlsx';
if (!file_exists($excelPath)) {
    $excelPath = __DIR__ . '/TSINDO - Laporan Sales Unit (5) (1) (1).xlsx';
}

if (!file_exists($excelPath)) {
    $candidates = array_merge(
        glob(dirname(__DIR__) . '/uploads/*TSINDO*.xlsx') ?: [],
        glob(__DIR__ . '/../uploads/*TSINDO*.xlsx') ?: [],
        glob(dirname(__DIR__) . '/*TSINDO*.xlsx') ?: [],
        glob(__DIR__ . '/*TSINDO*.xlsx') ?: []
    );
    if (!empty($candidates)) {
        usort($candidates, function($a, $b) { return filemtime($b) - filemtime($a); });
        $excelPath = $candidates[0];
    }
}

if (!file_exists($excelPath)) {
    echo json_encode([
        'success' => false,
        'message' => 'File Excel TSINDO tidak ditemukan di server.'
    ]);
    exit;
}

$zip = new ZipArchive();
if ($zip->open($excelPath) !== true) {
    echo json_encode(['success' => false, 'message' => 'Gagal membuka file Excel TSINDO']);
    exit;
}

// 1. Read shared strings
$sharedStrings = [];
if ($zip->locateName('xl/sharedStrings.xml') !== false) {
    $tempShared = tempnam(sys_get_temp_dir(), 'sh_rep_');
    file_put_contents($tempShared, $zip->getFromName('xl/sharedStrings.xml'));
    $reader = new XMLReader();
    if ($reader->open($tempShared)) {
        $currText = '';
        $isInsideSi = false;
        while ($reader->read()) {
            if ($reader->nodeType == XMLReader::ELEMENT && $reader->name == 'si') {
                $currText = '';
                $isInsideSi = true;
            } elseif ($isInsideSi && ($reader->nodeType == XMLReader::TEXT || $reader->nodeType == XMLReader::SIGNIFICANT_WHITESPACE)) {
                $currText .= $reader->value;
            } elseif ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'si') {
                $sharedStrings[] = $currText;
                $isInsideSi = false;
            }
        }
        $reader->close();
    }
    @unlink($tempShared);
}

// 2. Parse sheet1.xml
$sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
$zip->close();

if (!$sheetXml) {
    echo json_encode(['success' => false, 'message' => 'Sheet1 XML kosong atau tidak terbaca']);
    exit;
}

$distAliasMap = [
    'buah batu' => 'Buahbatu',
    'buahbatu' => 'Buahbatu',
    'kiara condong' => 'Kiaracondong',
    'kiaracondong' => 'Kiaracondong',
    'kircon' => 'Kiaracondong',
    'batu nunggal' => 'Batununggal',
    'batununggal' => 'Batununggal',
    'bojong soang' => 'Bojongsoang',
    'bojongsoang' => 'Bojongsoang',
    'ujung berung' => 'Ujungberung',
    'ujungberung' => 'Ujungberung',
    'bandung kidul' => 'Bandung Kidul',
    'bandung kulon' => 'Bandung Kulon',
    'bandung wetan' => 'Bandung Wetan',
    'cibeunying kidul' => 'Cibeunying Kidul',
    'cibeunying kaler' => 'Cibeunying Kaler',
    'bojongloa kaler' => 'Bojongloa Kaler',
    'bojongloa kidul' => 'Bojongloa Kidul',
    'babakan ciparay' => 'Babakan Ciparay',
    'sumur bandung' => 'Sumur Bandung',
    'lengkong' => 'Lengkong',
    'arcamanik' => 'Arcamanik',
    'antapani' => 'Antapani',
    'gedebage' => 'Gedebage',
    'rancasari' => 'Rancasari',
    'regol' => 'Regol',
    'sukasari' => 'Sukasari',
    'sukajadi' => 'Sukajadi',
    'coblong' => 'Coblong',
    'cidadap' => 'Cidadap',
    'astana anyar' => 'Astana Anyar',
    'andir' => 'Andir',
    'cicendo' => 'Cicendo',
    'cinambo' => 'Cinambo',
    'panyileukan' => 'Panyileukan',
    'cibiru' => 'Cibiru'
];

$vinDataMap = [];
$cstDataMap = [];
$nameDataMap = [];

$tempSheet = tempnam(sys_get_temp_dir(), 'sh_rows_dist_');
file_put_contents($tempSheet, $sheetXml);

$reader = new XMLReader();
if ($reader->open($tempSheet)) {
    $currRow = [];
    $currRef = '';
    $currType = '';
    $currVal = '';
    $isV = false;
    $isT = false;

    while ($reader->read()) {
        if ($reader->nodeType == XMLReader::ELEMENT) {
            if ($reader->name == 'row') {
                $currRow = [];
            } elseif ($reader->name == 'c') {
                $currRef = $reader->getAttribute('r') ?: '';
                $currType = $reader->getAttribute('t') ?: '';
                $currVal = '';
            } elseif ($reader->name == 'v') {
                $isV = true;
            } elseif ($reader->name == 't' || $reader->name == 'is') {
                $isT = true;
            }
        } elseif ($reader->nodeType == XMLReader::TEXT || $reader->nodeType == XMLReader::SIGNIFICANT_WHITESPACE) {
            if ($isV || $isT) $currVal .= $reader->value;
        } elseif ($reader->nodeType == XMLReader::END_ELEMENT) {
            if ($reader->name == 'v') $isV = false;
            elseif ($reader->name == 't' || $reader->name == 'is') $isT = false;
            elseif ($reader->name == 'c') {
                $val = trim($currVal);
                if ($currType === 's' && is_numeric($val)) {
                    $val = $sharedStrings[(int)$val] ?? '';
                }
                preg_match('/^([A-Z]+)/', $currRef, $m);
                $col = $m[1] ?? '';
                $currRow[$col] = $val;
            } elseif ($reader->name == 'row') {
                $vin = strtoupper(trim($currRow['J'] ?? '')); // Chasis
                $cstNo = strtoupper(trim($currRow['O'] ?? '')); // Customer No
                $custName = trim($currRow['P'] ?? ''); // Customer Name
                $stnkName = trim($currRow['R'] ?? ''); // STNK Name
                $rawAddr = trim($currRow['S'] ?? ''); // Address
                $rawDist = trim($currRow['T'] ?? ''); // District
                $rawCity = trim($currRow['U'] ?? ''); // City

                $finalName = $custName;
                if (preg_match('/^CST-\d+/i', $finalName) || !$finalName) {
                    $finalName = $stnkName;
                }

                $cleanDist = trim(preg_replace('/^(kecamatan|kec\.|kec)\s+/i', '', $rawDist));
                $cleanDistLower = strtolower($cleanDist);
                $cleanCityLower = strtolower(trim($rawCity));

                $isBandung = false;
                if (preg_match('/(bandung|cimahi)/i', $cleanCityLower)) {
                    $isBandung = true;
                }

                if ($isBandung) {
                    $district = isset($distAliasMap[$cleanDistLower]) ? $distAliasMap[$cleanDistLower] : ucwords($cleanDistLower);
                } elseif (!empty($cleanCityLower) && $cleanCityLower !== 'no data') {
                    $simpleCity = trim(preg_replace('/^(kota|kab\.|kabupaten)\s+/i', '', $cleanCityLower));
                    $simpleCityTitle = ucwords($simpleCity);
                    $kecTitle = ucwords($cleanDistLower);
                    $district = (!empty($kecTitle) && strtolower($kecTitle) !== strtolower($simpleCityTitle)) ? "{$kecTitle}, {$simpleCityTitle}" : $simpleCityTitle;
                } else {
                    $district = isset($distAliasMap[$cleanDistLower]) ? $distAliasMap[$cleanDistLower] : ucwords($cleanDistLower);
                }

                $addrParts = array_filter([$rawAddr, $cleanDist ? "Kec. " . ucwords($cleanDistLower) : '', $rawCity]);
                $fullAddr = implode(', ', $addrParts);

                $data = [
                    'name' => $finalName,
                    'district' => $district,
                    'address' => $fullAddr,
                    'cstNo' => $cstNo,
                    'vin' => $vin
                ];

                if ($vin) $vinDataMap[$vin] = $data;
                if ($cstNo) $cstDataMap[$cstNo] = $data;
                if ($finalName) $nameDataMap[strtoupper($finalName)] = $data;
            }
        }
    }
    $reader->close();
}
@unlink($tempSheet);

// 3. Update database followup_customers
$existingRows = followup_query("SELECT id, name, vin, customer_code, district FROM followup_customers");
$updated = 0;
$districtBreakdown = [];

foreach ($existingRows as $row) {
    $id = (int)$row['id'];
    $vin = strtoupper(trim($row['vin'] ?? ''));
    $name = strtoupper(trim($row['name'] ?? ''));
    $code = strtoupper(trim($row['customer_code'] ?? ''));

    $matchedData = null;
    if ($vin && isset($vinDataMap[$vin])) {
        $matchedData = $vinDataMap[$vin];
    } elseif (isset($cstDataMap[$name])) {
        $matchedData = $cstDataMap[$name];
    } elseif (isset($nameDataMap[$name])) {
        $matchedData = $nameDataMap[$name];
    }

    if ($matchedData && !empty($matchedData['district'])) {
        $realName = $matchedData['name'];
        $dist = $matchedData['district'];
        $addr = $matchedData['address'];

        $sqlParts = ["district = ?"];
        $params = [$dist];

        if ($realName && !preg_match('/^CST-\d+/i', $realName)) {
            $sqlParts[] = "name = ?";
            $params[] = $realName;
        }

        if ($addr) {
            $sqlParts[] = "notes = ?";
            $params[] = "Alamat: " . $addr;
        }

        $params[] = $id;
        followup_execute("UPDATE followup_customers SET " . implode(', ', $sqlParts) . " WHERE id = ?", $params);
        $updated++;
        $districtBreakdown[$dist] = ($districtBreakdown[$dist] ?? 0) + 1;
    }
}

// 4. Invalidate and delete radar cache files to force clean re-geocoding
@unlink(__DIR__ . '/cache_radar_customers.json');
@unlink(dirname(__DIR__) . '/public/api/cache_radar_customers.json');

echo json_encode([
    'success' => true,
    'total_excel_rows' => count($vinDataMap),
    'updated_records' => $updated,
    'top_districts' => array_slice($districtBreakdown, 0, 15, true),
    'message' => "Berhasil mensinkronkan {$updated} data customer dengan Kecamatan resmi dari Excel dan menghapus cache radar!"
]);
