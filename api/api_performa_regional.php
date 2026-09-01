<?php
// api/api_performa_regional.php
// API endpoint for Performa Regional Jawa Barat (SPK & Retail Sales AFI)

error_reporting(0);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$jsonPath = __DIR__ . '/regional_west_java_data.json';
if (!file_exists($jsonPath)) {
    // Fallback path
    $jsonPath = dirname(__DIR__) . '/api/regional_west_java_data.json';
}

if (!file_exists($jsonPath)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Berkas data performa regional Jawa Barat tidak ditemukan.'
    ]);
    exit;
}

$data = json_decode(file_get_contents($jsonPath), true);
if (!$data) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Format data regional tidak valid.'
    ]);
    exit;
}

// Optional filter parameters
$search = isset($_GET['q']) ? strtolower(trim($_GET['q'])) : '';
$dealerFilter = isset($_GET['dealer']) ? trim($_GET['dealer']) : '';

if ($search !== '' || ($dealerFilter !== '' && $dealerFilter !== 'all')) {
    $filteredBranches = [];
    foreach ($data['by_branch'] as $br) {
        $matchSearch = ($search === '') || 
                       (strpos(strtolower($br['branch']), $search) !== false) || 
                       (strpos(strtolower($br['dealer_group']), $search) !== false);
        $matchDealer = ($dealerFilter === '' || $dealerFilter === 'all') || 
                       (strcasecmp($br['dealer_group'], $dealerFilter) === 0);
        
        if ($matchSearch && $matchDealer) {
            $filteredBranches[] = $br;
        }
    }
    $data['by_branch'] = $filteredBranches;
}

echo json_encode([
    'status' => 'success',
    'data' => $data
]);
