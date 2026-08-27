<?php
error_reporting(0);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/koneksi.php';
global $conn;

// 1. Auto-check table existence and import SQL if missing
$checkTable = $conn->query("SHOW TABLES LIKE 'penjualan_kiara_condong'");
if (!$checkTable || $checkTable->num_rows === 0) {
    $sqlPath = __DIR__ . '/../penjualan_kiara_condong.sql';
    if (!file_exists($sqlPath)) {
        $sqlPath = __DIR__ . '/../penjualan_kircon.sql';
    }
    if (file_exists($sqlPath)) {
        $sqlContent = file_get_contents($sqlPath);
        $conn->multi_query($sqlContent);
        while ($conn->next_result()) {
            if (!$conn->more_results()) break;
        }
    }
}

// Helper to convert various date string formats into standard YYYY-MM-DD
function parseSalesDate($rawDate, $bulan1 = '') {
    if (empty($rawDate) || $rawDate === '-') {
        if (!empty($bulan1) && preg_match('/[a-zA-Z]+(\d{2})$/', trim($bulan1), $bm)) {
            $yy = (int)$bm[1];
            $fullYear = $yy < 50 ? (2000 + $yy) : (1900 + $yy);
            return "{$fullYear}-01-01";
        }
        return '';
    }
    $rawDate = trim($rawDate);

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $rawDate)) return $rawDate;

    if (is_numeric($rawDate) && (float)$rawDate > 30000) {
        $unix = ((float)$rawDate - 25569) * 86400;
        return date('Y-m-d', (int)$unix);
    }

    $monthsMap = [
        'jan' => '01', 'januari' => '01', 'feb' => '02', 'februari' => '02',
        'mar' => '03', 'maret' => '03', 'apr' => '04', 'april' => '04',
        'mei' => '05', 'may' => '05', 'jun' => '06', 'juni' => '06',
        'jul' => '07', 'juli' => '07', 'agu' => '08', 'agustus' => '08',
        'sep' => '09', 'september' => '09', 'okt' => '10', 'oktober' => '10',
        'nov' => '11', 'november' => '11', 'des' => '12', 'desember' => '12'
    ];

    if (preg_match('/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/i', $rawDate, $m)) {
        $day = str_pad($m[1], 2, '0', STR_PAD_LEFT);
        $monthName = strtolower($m[2]);
        $month = $monthsMap[$monthName] ?? '01';
        return "{$m[3]}-{$month}-{$day}";
    }

    $time = strtotime($rawDate);
    if ($time) return date('Y-m-d', $time);

    if (!empty($bulan1) && preg_match('/[a-zA-Z]+(\d{2})$/', trim($bulan1), $bm)) {
        $yy = (int)$bm[1];
        $fullYear = $yy < 50 ? (2000 + $yy) : (1900 + $yy);
        return "{$fullYear}-01-01";
    }

    return $rawDate;
}

// 2. Read All Raw Records from Table
$allRawRecords = [];
$vinsSeen = [];

$res1Check = $conn->query("SHOW TABLES LIKE 'penjualan_kiara_condong'");
if ($res1Check && $res1Check->num_rows > 0) {
    $res1 = $conn->query("SELECT * FROM `penjualan_kiara_condong`");
    if ($res1) {
        while ($r = $res1->fetch_assoc()) {
            $b1 = trim($r['Bulan.1'] ?? '');
            $cDate = parseSalesDate($r['Sales Date'] ?? '', $b1);
            $y = $cDate ? (int)date('Y', strtotime($cDate)) : 0;
            $m = $cDate ? (int)date('n', strtotime($cDate)) : 0;

            $vin = trim($r['VIN'] ?? '');
            $spk = trim($r['SPK No'] ?? '');
            $cust = trim($r['Customer'] ?? '');

            $dedupKey = (!empty($vin) && $vin !== '-') ? $vin : ($spk . '_' . $cust . '_' . $cDate);
            if (!empty($dedupKey) && isset($vinsSeen[$dedupKey])) continue;
            if (!empty($dedupKey)) $vinsSeen[$dedupKey] = true;

            $allRawRecords[] = [
                'spk_no' => $spk,
                'outlet_name' => trim($r['Outlet Name'] ?? 'Tunas Toyota Kiara Condong'),
                'area_region' => trim($r['Area Region'] ?? 'Area - West Java'),
                'dealer' => trim($r['Dealer'] ?? 'Tunas Toyota'),
                'province' => trim($r['Province'] ?? 'Jawa Barat'),
                'city' => trim($r['City'] ?? 'Bandung'),
                'katashiki' => trim($r['Katashiki'] ?? ''),
                'suffix' => trim($r['Suffix'] ?? ''),
                'katashiki_suffix' => trim($r['Katashiki Suffix'] ?? ''),
                'model' => trim($r['Model'] ?? ''),
                'type' => trim($r['Type'] ?? ''),
                'color_code' => trim($r['Color Code'] ?? ''),
                'color_name' => trim($r['Color Name'] ?? ''),
                'sales_date' => $cDate,
                'year' => $y,
                'month' => $m,
                'qty' => (int)($r['Qty'] ?? 1),
                'vin' => $vin,
                'bulan' => trim($r['Bulan'] ?? ''),
                'bulan_1' => trim($r['Bulan.1'] ?? ''),
                'kota' => trim($r['KOTA'] ?? ($r['City'] ?? 'BANDUNG')),
                'hit_foa' => trim($r['Hit FOA'] ?? ''),
                'ket_foa' => trim($r['Ket FOA'] ?? ''),
                'hit_pma' => trim($r['Hit PMA'] ?? ''),
                'ket_pma' => trim($r['Ket PMA'] ?? ''),
                'leasing' => trim($r['Leasing'] ?? ''),
                'insurance' => trim($r['Insurance'] ?? ''),
                'payment' => trim($r['Payment'] ?? ''),
                'customer_type' => trim($r['Customer Type'] ?? ''),
                'customer' => $cust,
                'demand_structure' => trim($r['Demand Structure'] ?? ''),
                'lead_source' => trim($r['Lead Source'] ?? ''),
                'nama_salesman_idms' => trim($r['Nama Salesman IDMS'] ?? ''),
                'nama_spv' => trim($r['Nama SPV'] ?? ''),
                'id_sales' => trim($r['ID Sales'] ?? ''),
                'salesman_tones' => trim($r['SALESMAN TONES'] ?? ''),
                'level_salesman' => trim($r['LEVEL SALESMAN'] ?? ''),
                'segment_model' => trim($r['Segment Model'] ?? ''),
                'grp_model' => trim($r['Grp Model'] ?? ''),
                'grp_cabang' => trim($r['GRP CABANG'] ?? '')
            ];
        }
    }
}

// Fallback Table: penjualan_kircon if present
$res2Check = $conn->query("SHOW TABLES LIKE 'penjualan_kircon'");
if ($res2Check && $res2Check->num_rows > 0) {
    $res2 = $conn->query("SELECT * FROM `penjualan_kircon`");
    if ($res2) {
        while ($r = $res2->fetch_assoc()) {
            $cDate = parseSalesDate($r['sales_date'] ?? '');
            $y = $cDate ? (int)date('Y', strtotime($cDate)) : 0;
            $m = $cDate ? (int)date('n', strtotime($cDate)) : 0;

            $vin = trim($r['vin'] ?? '');
            $spk = trim($r['spk_no'] ?? '');
            $cust = trim($r['customer'] ?? '');

            $dedupKey = (!empty($vin) && $vin !== '-') ? $vin : ($spk . '_' . $cust . '_' . $cDate);
            if (!empty($dedupKey) && isset($vinsSeen[$dedupKey])) continue;
            if (!empty($dedupKey)) $vinsSeen[$dedupKey] = true;

            $allRawRecords[] = [
                'spk_no' => $spk,
                'outlet_name' => trim($r['outlet_name'] ?? 'Tunas Toyota Kiara Condong'),
                'area_region' => trim($r['area_region'] ?? 'Area - West Java'),
                'dealer' => trim($r['dealer'] ?? 'Tunas Toyota'),
                'province' => trim($r['province'] ?? 'Jawa Barat'),
                'city' => trim($r['city'] ?? 'Bandung'),
                'katashiki' => trim($r['katashiki'] ?? ''),
                'suffix' => trim($r['suffix'] ?? ''),
                'katashiki_suffix' => trim($r['katashiki_suffix'] ?? ''),
                'model' => trim($r['model'] ?? ''),
                'type' => trim($r['type'] ?? ''),
                'color_code' => trim($r['color_code'] ?? ''),
                'color_name' => trim($r['color_name'] ?? ''),
                'sales_date' => $cDate,
                'year' => $y,
                'month' => $m,
                'qty' => (int)($r['qty'] ?? 1),
                'vin' => $vin,
                'bulan' => trim($r['bulan'] ?? ''),
                'bulan_1' => '',
                'kota' => trim($r['city'] ?? 'KOTA BANDUNG'),
                'hit_foa' => '',
                'ket_foa' => '',
                'hit_pma' => '',
                'ket_pma' => '',
                'leasing' => trim($r['leasing'] ?? ''),
                'insurance' => '',
                'payment' => trim($r['payment'] ?? ''),
                'customer_type' => trim($r['customer_type'] ?? ''),
                'customer' => $cust,
                'demand_structure' => '',
                'lead_source' => '',
                'nama_salesman_idms' => '',
                'nama_spv' => '',
                'id_sales' => '',
                'salesman_tones' => '',
                'level_salesman' => '',
                'segment_model' => '',
                'grp_model' => '',
                'grp_cabang' => ''
            ];
        }
    }
}

// 3. Extract Filters List
$yearsSet = [];
$modelsSet = [];
$paymentsSet = [];
$leasingsSet = [];
$kotasSet = [];

foreach ($allRawRecords as $rec) {
    if ($rec['year'] > 2000) $yearsSet[$rec['year']] = true;
    if (!empty($rec['model'])) $modelsSet[$rec['model']] = true;
    if (!empty($rec['payment'])) $paymentsSet[$rec['payment']] = true;
    if (!empty($rec['leasing']) && $rec['leasing'] !== '0') $leasingsSet[$rec['leasing']] = true;
    if (!empty($rec['kota'])) $kotasSet[$rec['kota']] = true;
}

krsort($yearsSet);
ksort($modelsSet);
ksort($paymentsSet);
ksort($leasingsSet);
ksort($kotasSet);

// Query String Filter Parameters
$filterYear = isset($_GET['year']) ? trim($_GET['year']) : '';
$filterMonth = isset($_GET['month']) ? trim($_GET['month']) : '';
$filterModel = isset($_GET['model']) ? trim($_GET['model']) : '';
$filterKota = isset($_GET['kota']) ? trim($_GET['kota']) : '';
$filterPayment = isset($_GET['payment']) ? trim($_GET['payment']) : '';
$filterLeasing = isset($_GET['leasing']) ? trim($_GET['leasing']) : '';
$filterSearch = isset($_GET['search']) ? trim($_GET['search']) : '';

$sortBy = isset($_GET['sort_by']) ? trim($_GET['sort_by']) : 'sales_date';
$sortDir = isset($_GET['sort_dir']) && strtolower($_GET['sort_dir']) === 'asc' ? 'asc' : 'desc';

// 4. Apply Filters
$filteredRecords = array_filter($allRawRecords, function($r) use ($filterYear, $filterMonth, $filterModel, $filterKota, $filterPayment, $filterLeasing, $filterSearch) {
    if ($filterYear !== '' && $filterYear !== 'all' && (string)$r['year'] !== (string)$filterYear) {
        return false;
    }
    if ($filterMonth !== '' && $filterMonth !== 'all' && (string)$r['month'] !== (string)$filterMonth) {
        return false;
    }
    if ($filterModel !== '' && $filterModel !== 'all' && strcasecmp($r['model'], $filterModel) !== 0) {
        return false;
    }
    if ($filterKota !== '' && $filterKota !== 'all' && strcasecmp($r['kota'], $filterKota) !== 0) {
        return false;
    }
    if ($filterPayment !== '' && $filterPayment !== 'all' && strcasecmp($r['payment'], $filterPayment) !== 0) {
        return false;
    }
    if ($filterLeasing !== '' && $filterLeasing !== 'all' && strcasecmp($r['leasing'], $filterLeasing) !== 0) {
        return false;
    }
    if ($filterSearch !== '') {
        $kw = mb_strtolower($filterSearch);
        $searchHaystack = mb_strtolower(
            $r['customer'] . ' ' . $r['vin'] . ' ' . $r['type'] . ' ' . $r['model'] . ' ' .
            $r['color_name'] . ' ' . $r['spk_no'] . ' ' . $r['nama_salesman_idms'] . ' ' .
            $r['nama_spv'] . ' ' . $r['salesman_tones'] . ' ' . $r['kota'] . ' ' . $r['lead_source']
        );
        if (mb_strpos($searchHaystack, $kw) === false) {
            return false;
        }
    }
    return true;
});

// Sort filtered records based on sortBy & sortDir
usort($filteredRecords, function($a, $b) use ($sortBy, $sortDir) {
    $valA = $a[$sortBy] ?? '';
    $valB = $b[$sortBy] ?? '';

    if (is_numeric($valA) && is_numeric($valB)) {
        $cmp = $valA <=> $valB;
    } else {
        $cmp = strcasecmp((string)$valA, (string)$valB);
    }
    return ($sortDir === 'asc') ? $cmp : -$cmp;
});

// 5. Compute Aggregation Metrics
$totalUnits = 0;
$totalTrans = count($filteredRecords);

$modelCounts = [];
$leasingCounts = [];
$paymentCounts = [];
$kotaCounts = [];
$monthlyCounts = array_fill(1, 12, ['qty' => 0, 'trans' => 0]);

$monthNames = [
    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
    5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
    9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
];

foreach ($filteredRecords as $r) {
    $qty = $r['qty'] > 0 ? $r['qty'] : 1;
    $totalUnits += $qty;

    // Model breakdown
    $mName = !empty($r['model']) ? $r['model'] : 'LAINNYA';
    $modelCounts[$mName] = ($modelCounts[$mName] ?? 0) + $qty;

    // Leasing breakdown
    $lName = (!empty($r['leasing']) && $r['leasing'] !== '0') ? $r['leasing'] : 'NON-LEASING';
    $leasingCounts[$lName] = ($leasingCounts[$lName] ?? 0) + 1;

    // Payment breakdown
    $pName = !empty($r['payment']) ? $r['payment'] : 'LAINNYA';
    $paymentCounts[$pName] = ($paymentCounts[$pName] ?? 0) + 1;

    // Kota breakdown
    $kName = !empty($r['kota']) ? $r['kota'] : 'LAINNYA';
    $kotaCounts[$kName] = ($kotaCounts[$kName] ?? 0) + $qty;

    // Monthly breakdown
    $mIdx = $r['month'];
    if ($mIdx >= 1 && $mIdx <= 12) {
        $monthlyCounts[$mIdx]['qty'] += $qty;
        $monthlyCounts[$mIdx]['trans'] += 1;
    }
}

// Sort breakdowns
arsort($modelCounts);
arsort($leasingCounts);
arsort($paymentCounts);
arsort($kotaCounts);

// Format breakdowns into structured arrays
$modelBreakdown = [];
foreach ($modelCounts as $k => $v) {
    $modelBreakdown[] = ['model' => $k, 'qty' => $v];
}

$leasingBreakdown = [];
foreach ($leasingCounts as $k => $v) {
    $leasingBreakdown[] = ['leasing' => $k, 'count' => $v];
}

$paymentBreakdown = [];
foreach ($paymentCounts as $k => $v) {
    $paymentBreakdown[] = ['payment' => $k, 'count' => $v];
}

$kotaBreakdown = [];
foreach ($kotaCounts as $k => $v) {
    $kotaBreakdown[] = ['kota' => $k, 'qty' => $v];
}

$monthlyBreakdown = [];
for ($m = 1; $m <= 12; $m++) {
    $monthlyBreakdown[] = [
        'month_number' => $m,
        'month_name' => $monthNames[$m],
        'total_qty' => $monthlyCounts[$m]['qty'],
        'total_trans' => $monthlyCounts[$m]['trans']
    ];
}

// Determine top values
$topKota = !empty($kotaBreakdown) ? $kotaBreakdown[0]['kota'] : '-';
$topKotaQty = !empty($kotaBreakdown) ? $kotaBreakdown[0]['qty'] : 0;

$topModel = !empty($modelBreakdown) ? $modelBreakdown[0]['model'] : '-';
$topModelQty = !empty($modelBreakdown) ? $modelBreakdown[0]['qty'] : 0;

$topLeasing = !empty($leasingBreakdown) ? $leasingBreakdown[0]['leasing'] : '-';
$topLeasingCount = !empty($leasingBreakdown) ? $leasingBreakdown[0]['count'] : 0;

// Output JSON Response
ob_end_clean();
echo json_encode([
    'status' => 'success',
    'filters' => [
        'years' => array_keys($yearsSet),
        'kotas' => array_keys($kotasSet),
        'models' => array_keys($modelsSet),
        'payments' => array_keys($paymentsSet),
        'leasings' => array_keys($leasingsSet)
    ],
    'summary' => [
        'total_units' => $totalUnits,
        'total_transactions' => $totalTrans,
        'top_kota' => $topKota,
        'top_kota_qty' => $topKotaQty,
        'top_model' => $topModel,
        'top_model_qty' => $topModelQty,
        'top_leasing' => $topLeasing,
        'top_leasing_count' => $topLeasingCount,
        'kota_breakdown' => $kotaBreakdown,
        'model_breakdown' => $modelBreakdown,
        'leasing_breakdown' => $leasingBreakdown,
        'payment_breakdown' => $paymentBreakdown,
        'monthly_breakdown' => $monthlyBreakdown
    ],
    'data' => array_values($filteredRecords)
]);
exit;
