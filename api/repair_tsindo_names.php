<?php
// api/repair_tsindo_names.php - Automatic Name Fix for TSINDO Sales Unit Records
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once __DIR__ . '/api_followup_db.php';

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

// 2. Read sheet1.xml and map Col P (Customer No) -> Col Q (Customer Name) and Col S (STNK Name)
$cstToNameMap = [];
$vinToNameMap = [];

$sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
$zip->close();

if ($sheetXml) {
    $tempSheet = tempnam(sys_get_temp_dir(), 'sh_rows_rep_');
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
                    $cstNo = trim($currRow['P'] ?? '');
                    $cstName = trim($currRow['Q'] ?? '');
                    $stnkName = trim($currRow['S'] ?? '');
                    $chasis = trim($currRow['K'] ?? '');

                    $finalName = $cstName;
                    if (preg_match('/^CST-\d+/i', $finalName) || !$finalName) {
                        $finalName = $stnkName;
                    }

                    if ($cstNo && $finalName && !preg_match('/^CST-\d+/i', $finalName)) {
                        $cstToNameMap[strtoupper($cstNo)] = $finalName;
                    }
                    if ($chasis && $finalName && !preg_match('/^CST-\d+/i', $finalName)) {
                        $vinToNameMap[strtoupper($chasis)] = $finalName;
                    }
                }
            }
        }
        $reader->close();
    }
    @unlink($tempSheet);
}

$cstCount = count($cstToNameMap);
$vinCount = count($vinToNameMap);

// 3. Update database followup_customers
$rows = followup_query("SELECT id, name, vin FROM followup_customers WHERE name LIKE 'CST-%' OR (sync_source = 'tsindo_sales_radar' AND name LIKE 'CST%')");
$repaired = 0;

foreach ($rows as $row) {
    $id = (int)$row['id'];
    $currentName = strtoupper(trim($row['name']));
    $vin = strtoupper(trim($row['vin'] ?? ''));

    $realName = $cstToNameMap[$currentName] ?? '';
    if (!$realName && $vin && isset($vinToNameMap[$vin])) {
        $realName = $vinToNameMap[$vin];
    }

    if ($realName && !preg_match('/^CST-\d+/i', $realName)) {
        followup_execute("UPDATE followup_customers SET name = ? WHERE id = ?", [$realName, $id]);
        $repaired++;
    }
}

if ($repaired > 0) {
    @unlink(__DIR__ . '/cache_radar_customers.json');
    @unlink(dirname(__DIR__) . '/public/api/cache_radar_customers.json');
}

echo json_encode([
    'success' => true,
    'total_cst_mapped' => $cstCount,
    'total_vin_mapped' => $vinCount,
    'repaired_customers' => $repaired,
    'message' => "Berhasil memperbaiki {$repaired} nama customer dari kode CST ke nama asli!"
]);
