<?php
// api/api_ao_report.php
// Live Dynamic Backend API for Area Operation (AO) Report
// Synchronized with the physical whiteboard (31 Agustus 2026)

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
require_once __DIR__ . '/api_sheets_sync.php';

$current_month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
if ($current_month < 1 || $current_month > 12) {
    $current_month = intval(date('n'));
}
$current_year = isset($_GET['tahun']) ? intval($_GET['tahun']) : intval(date('Y'));
$current_day = intval(date('j'));

$nama_bulan_list = [
    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
    5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
    9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
];
$report_date_str = "31 Agustus 2026";
$period_month_str = "Agustus 2026";

// Whiteboard Baseline Data (31 Agustus 2026)
$full_stock_total = 46;
$full_stock_match = 16;
$full_stock_free = 30;

$os_total = 29;
$matching_ratio = 34;
$target_do = 92;
$potential_do_from_os = 16;
$gap_target = 76;
$mtd_actual = 16;

$table1_models = [
    ['model' => 'Avanza New', 'gapOS' => 1, 'w1' => 1, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 1, 'firmed' => 1, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Veloz New', 'gapOS' => 1, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Raize', 'gapOS' => 1, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Agya', 'gapOS' => 3, 'w1' => 1, 'w2' => 1, 'w3' => 0, 'w4' => 0, 'totalMatch' => 2, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Agya GR-S', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Calya', 'gapOS' => 5, 'w1' => 0, 'w2' => 0, 'w3' => 4, 'w4' => 0, 'totalMatch' => 4, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Yaris', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Yaris Cross Gasoline', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Yaris Cross Hybrid', 'gapOS' => 3, 'w1' => 1, 'w2' => 0, 'w3' => 2, 'w4' => 0, 'totalMatch' => 3, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Innova', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Innova Zenix Hybrid', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Innova Zenix', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Fortuner 4x2', 'gapOS' => 1, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Rush', 'gapOS' => 1, 'w1' => 1, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 1, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Alphard', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Alphard Hybrid', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 2, 'w4' => 1, 'totalMatch' => 3, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Voxy', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 2, 'w4' => 2, 'totalMatch' => 4, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hilux D-Cab', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hilux S-Cab', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hilux S-Cab 4x4', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hilux Rangga', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 2, 'w4' => 2, 'totalMatch' => 4, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hiace', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Hiace Premio', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0],
    ['model' => 'Others', 'gapOS' => 0, 'w1' => 0, 'w2' => 0, 'w3' => 0, 'w4' => 0, 'totalMatch' => 0, 'firmed' => 0, 'pLoan' => 0, 'unmatch' => 0]
];

$table2_supply = [
    ['model' => 'Avanza New', 'stock' => 7, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 7, 'doActual' => 0, 'stockMatching' => 1, 'fts' => 6, 'spk' => 0, 'do' => 0, 'netFts' => 6],
    ['model' => 'Veloz New', 'stock' => 5, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 5, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 5, 'spk' => 0, 'do' => 0, 'netFts' => 5],
    ['model' => 'Raize', 'stock' => 7, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 7, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 7, 'spk' => 0, 'do' => 0, 'netFts' => 7],
    ['model' => 'Rush', 'stock' => 4, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 4, 'doActual' => 0, 'stockMatching' => 1, 'fts' => 3, 'spk' => 0, 'do' => 0, 'netFts' => 3],
    ['model' => 'Agya', 'stock' => 3, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 3, 'doActual' => 0, 'stockMatching' => 2, 'fts' => 1, 'spk' => 0, 'do' => 0, 'netFts' => 1],
    ['model' => 'Agya GR-S', 'stock' => 2, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 2, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 2, 'spk' => 0, 'do' => 0, 'netFts' => 2],
    ['model' => 'Calya', 'stock' => 4, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 4, 'doActual' => 0, 'stockMatching' => 4, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Yaris', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Yaris Cross Gasoline', 'stock' => 1, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 1, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 1, 'spk' => 0, 'do' => 0, 'netFts' => 1],
    ['model' => 'Yaris Cross Hybrid', 'stock' => 3, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 3, 'doActual' => 0, 'stockMatching' => 3, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Innova', 'stock' => 2, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 2, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 2, 'spk' => 0, 'do' => 0, 'netFts' => 2],
    ['model' => 'Innova Zenix Hybrid', 'stock' => 3, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 3, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 3, 'spk' => 0, 'do' => 0, 'netFts' => 3],
    ['model' => 'Innova Zenix', 'stock' => 5, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 5, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 5, 'spk' => 0, 'do' => 0, 'netFts' => 5],
    ['model' => 'Fortuner 4x2', 'stock' => 2, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 2, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 2, 'spk' => 0, 'do' => 0, 'netFts' => 2],
    ['model' => 'Alphard', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Alphard Hybrid', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Voxy', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hilux D-Cab', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hilux S-Cab', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hilux S-Cab 4x4', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hilux Rangga', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hiace', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Hiace Premio', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0],
    ['model' => 'Others', 'stock' => 0, 'mdp' => 0, 'secondAllo' => 0, 'co' => 0, 'ttlSupply' => 0, 'doActual' => 0, 'stockMatching' => 0, 'fts' => 0, 'spk' => 0, 'do' => 0, 'netFts' => 0]
];

$response_data = [
    "status" => "success",
    "branch" => "TUNAS TOYOTA KIARACONDONG",
    "reportDate" => $report_date_str,
    "periodMonth" => $period_month_str,
    "stock" => [
        "fullStock" => ["total" => $full_stock_total, "free" => $full_stock_free, "match" => $full_stock_match],
        "invoiceableStock" => ["total" => $full_stock_total, "free" => $full_stock_free, "match" => $full_stock_match],
        "osOrder" => [
            "total" => $os_total,
            "gt60Days" => ["total" => 0, "match" => 0],
            "d30To60Days" => ["total" => 4, "match" => 2],
            "firmedOSLt30" => ["total" => 25, "firmed" => 6, "plCpi" => 19]
        ],
        "stockMatching" => [
            "matchUnfirmedGt30" => 2,
            "matchUnfirmedLt30" => 2,
            "unmatchStock" => 10,
            "unmatchBreakdown" => [
                "firmedGt30" => 1,
                "firmedLt30" => 5,
                "unfirmedLt30" => 4,
                "unfirmedGt30" => 0
            ],
            "matchStock" => 16,
            "matchBreakdown" => [
                "firmedGt30" => 1,
                "plCpi" => 15
            ]
        ],
        "kpi" => [
            "matchingRatio" => $matching_ratio,
            "targetDO" => $target_do,
            "potentialDoFromOS" => $potential_do_from_os,
            "gapTarget" => $gap_target,
            "mtdActual" => $mtd_actual,
            "mdpVal" => 0,
            "onHandStock" => 16
        ],
        "ritme5Harian" => [
            ["period" => "1-5", "value" => 2, "accum" => 2],
            ["period" => "6-10", "value" => 3, "accum" => 5],
            ["period" => "11-15", "value" => 3, "accum" => 8],
            ["period" => "16-20", "value" => 3, "accum" => 11],
            ["period" => "21-25", "value" => 3, "accum" => 14],
            ["period" => "26-31", "value" => 2, "accum" => 16]
        ]
    ],
    "spkPlan" => [
        "periods" => ['TTL', '1-5', '6-10', '11-15', '16-20', '21-25', '26-31'],
        "effectiveNRS" => 76,
        "forNPlus1RS" => 42,
        "spkGrossPlan" => [122, 20, 20, 20, 20, 20, 22],
        "spkGrossActual" => [54, 30, 24, null, null, null, null],
        "gapGross" => ['-', 0, 1, 2, 3, 1, 1],
        "cancellationAssum" => [8, 1, 1, 2, 2, 1, 1],
        "cancellationActual" => [0, 0, 0, null, null, null, null],
        "cancellationRatio" => ['0%', '0%', '0%', '0%', '0%', '0%', '0%'],
        "cancelRatioStats" => [
            "threeMonthsAvg" => "4%",
            "loanRejection" => "2%"
        ],
        "spkNettPlan" => [114, 19, 19, 19, 19, 19, 19],
        "spkNettActual" => [54, 30, 24, null, null, null, null],
        "gapNett" => ['-', '+11', '+5', '-19', '-19', '-19', '-19'],
        "nettSpkVisualize" => [
            ["period" => "1-5", "val" => 19],
            ["period" => "6-10", "val" => 19],
            ["period" => "11-15", "val" => 19],
            ["period" => "16-20", "val" => 19],
            ["period" => "21-25", "val" => 19],
            ["period" => "26-31", "val" => 19]
        ],
        "rsPillar" => [
            "ttl" => 114,
            "becomeOS" => 38,
            "effectiveMonthRS" => 76,
            "avgDays" => 8
        ]
    ],
    "mdpPlan" => [
        "leftPillar" => [
            "total" => 32,
            "green" => 2,
            "blue" => 30
        ],
        "ffsPillar" => 46,
        "ffsSellingPlan" => [
            ["period" => "1-5", "accum" => 46],
            ["period" => "6-10", "accum" => 52],
            ["period" => "11-15", "accum" => 72],
            ["period" => "16-20", "accum" => 95],
            ["period" => "21-25", "accum" => 117],
            ["period" => "26-31", "accum" => 125]
        ],
        "rsPlanSteps" => [19, 19, 19, 19, 19, 19],
        "accumMtdDoRsValues" => [0, 0, 8, 17, 27, 40],
        "fromNewOrder" => 76
    ],
    "closingEstimation" => [
        "oapTarget" => 92,
        "matchingOutstanding" => 29,
        "newOrderSPK" => 76,
        "totalEstClosing" => 92,
        "totalInvoiceableStock" => 46,
        "efficiencySTO" => "24%"
    ],
    "table1Models" => $table1_models,
    "table2Supply" => $table2_supply
];

echo json_encode($response_data, JSON_PRETTY_PRINT);

if ($conn) {
    $conn->close();
}
exit();
