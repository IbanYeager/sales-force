<?php
error_reporting(0);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

$jsonPath = __DIR__ . '/market_analysis_data.json';

if (!file_exists($jsonPath)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Berkas data analisis pasar tidak ditemukan.'
    ]);
    exit;
}

$rawData = json_decode(file_get_contents($jsonPath), true);
if (!$rawData) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal membaca format JSON data analisis pasar.'
    ]);
    exit;
}

$availableDistricts = array_keys($rawData);
$selectedDistrict = isset($_GET['district']) ? strtoupper(trim($_GET['district'])) : 'KIARACONDONG';

if (!isset($rawData[$selectedDistrict])) {
    $selectedDistrict = $availableDistricts[0] ?? 'KIARACONDONG';
}

$districtData = $rawData[$selectedDistrict] ?? ['composition' => [], 'market_share' => []];

// Calculate summary indicators for selected district
$topSegment = '-';
$topSegmentVal = 0;
$topModel = '-';
$topModelVal = 0;
$pcShareYtm = 0;
$cvShareYtm = 0;

foreach ($districtData['composition'] as $row) {
    $seg = $row['segment'] ?? '';
    $mod = $row['model'] ?? '';
    $ytm = is_numeric($row['ytm']) ? (float)$row['ytm'] : 0;

    if ($seg === 'PC' && empty($mod)) {
        $pcShareYtm = $ytm;
    } elseif ($seg === 'CV' && empty($mod)) {
        $cvShareYtm = $ytm;
    }

    if (!empty($mod) && $ytm > $topModelVal) {
        $topModelVal = $ytm;
        $topModel = $mod . ' (' . $seg . ')';
    } elseif (empty($mod) && $seg !== 'Total Model' && $seg !== 'PC' && $seg !== 'CV' && $ytm > $topSegmentVal) {
        $topSegmentVal = $ytm;
        $topSegment = $seg;
    }
}

// Find top market share Toyota model in market_share
$topToyotaShareModel = '-';
$topToyotaShareVal = 0;
foreach ($districtData['market_share'] as $row) {
    $mod = $row['model'] ?? '';
    $ytm = is_numeric($row['ytm']) ? (float)$row['ytm'] : 0;
    if (!empty($mod) && $ytm > $topToyotaShareVal) {
        $topToyotaShareVal = $ytm;
        $topToyotaShareModel = $mod;
    }
}

// Load housing complex dataset if available
$housingPath = __DIR__ . '/housing_data.json';
$housingDataAll = file_exists($housingPath) ? json_decode(file_get_contents($housingPath), true) : [];
$districtHousing = $housingDataAll[$selectedDistrict] ?? [
    'total_komplek' => 0,
    'total_unit' => 0,
    'komplek_list' => []
];

// List of all districts from housing dataset + market dataset
$allDistricts = array_values(array_unique(array_merge($availableDistricts, array_keys($housingDataAll))));
sort($allDistricts);

echo json_encode([
    'status' => 'success',
    'district' => $selectedDistrict,
    'districts' => $allDistricts,
    'summary' => [
        'top_segment' => $topSegment,
        'top_segment_pct' => round($topSegmentVal * 100, 1),
        'top_model' => $topModel,
        'top_model_pct' => round($topModelVal * 100, 1),
        'pc_share_ytm' => round($pcShareYtm * 100, 1),
        'cv_share_ytm' => round($cvShareYtm * 100, 1),
        'top_toyota_share_model' => $topToyotaShareModel,
        'top_toyota_share_val' => round($topToyotaShareVal, 1),
        'total_housing_komplek' => $districtHousing['total_komplek'],
        'total_housing_unit' => $districtHousing['total_unit']
    ],
    'housing' => $districtHousing,
    'data' => $districtData
]);

