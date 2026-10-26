<?php
// api_customer_radar.php - Strict Radius Live GPS Radar for Sales Force CRM
date_default_timezone_set('Asia/Jakarta');
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

function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) * sin($dLat / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon / 2) * sin($dLon / 2);
    return 6371 * 2 * atan2(sqrt($a), sqrt(1 - $a));
}

$salesLat = isset($_GET['lat']) ? floatval($_GET['lat']) : -6.9248; // default Tunas Kircon
$salesLng = isset($_GET['lng']) ? floatval($_GET['lng']) : 107.6472;
$maxRadius = isset($_GET['radius']) ? floatval($_GET['radius']) : 50.0; // km (allow wide range for map)
$salesId = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0; // 0 = unlimited, return all matched database customers
$targetDistrict = isset($_GET['district']) ? strtolower(trim($_GET['district'])) : 'all';
$dbSource = isset($_GET['db_source']) ? strtolower(trim($_GET['db_source'])) : 'all';

try {
    $salesList = get_sales_list();
    $salesMap = [];
    foreach ($salesList as $s) {
        $salesMap[(int)$s['id']] = $s['name'];
    }

    // Bounding Box Deltas for ultra-fast filtering
    $latDelta = ($maxRadius + 0.1) / 111.0;
    $lngDelta = ($maxRadius + 0.1) / 110.2;

    $where = [];
    $params = [];
    if ($dbSource === 'radar') {
        $where[] = "(sync_source = 'pkb_excel_radar' OR sync_source LIKE '%radar%' OR followup_category LIKE '%radar%')";
    } elseif ($dbSource === 'sales') {
        $where[] = "(sync_source IS NULL OR sync_source = '' OR (sync_source != 'pkb_excel_radar' AND sync_source NOT LIKE '%radar%'))";
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    // Fetch Followup Customers
    $fuRows = followup_query("SELECT id, name, phone, district, car_model, last_car_model, car_age, priority, followup_status, cluster_name, outlet_do, notes, assigned_sales_id, sync_source, visit_photo, reason_followup, plate_number, vin FROM followup_customers $whereSql ORDER BY id DESC", $params);
    
    $results = [];

    if (!empty($fuRows) && is_array($fuRows)) {
        foreach ($fuRows as $row) {
            $coords = getAccurateCoords($row['id'], $row['district'] ?? '', $row['notes'] ?? '', $cityDistrictCoords, $row['plate_number'] ?? '', $row['vin'] ?? '');
            
            // District Filter check
            if ($targetDistrict !== 'all' && $targetDistrict !== '') {
                $distNameClean = strtolower($coords[2] ?: '');
                $rawDistClean = strtolower((string)($row['district'] ?: ''));
                $notesClean = strtolower((string)($row['notes'] ?: ''));
                if (strpos($distNameClean, $targetDistrict) === false && strpos($rawDistClean, $targetDistrict) === false && strpos($notesClean, $targetDistrict) === false) {
                    continue;
                }
            }

            // Fast bounding box check
            if (abs($coords[0] - $salesLat) > $latDelta) continue;
            if (abs($coords[1] - $salesLng) > $lngDelta) continue;

            $dist = calculateDistance($salesLat, $salesLng, $coords[0], $coords[1]);

            // STRICT RADIUS FILTER
            if ($dist <= $maxRadius) {
                $phoneClean = clean_phone_number($row['phone'] ?? '');
                $car = $row['car_model'] ?: ($row['last_car_model'] ?: 'Toyota Unit');
                $sid = (int)($row['assigned_sales_id'] ?? 0);
                $salesName = isset($salesMap[$sid]) ? $salesMap[$sid] : 'Terbuka (Siapa Saja)';
                
                $results[] = [
                    'id' => (int)$row['id'],
                    'source' => $row['sync_source'] ?: 'followup_db',
                    'name' => $row['name'],
                    'phone' => $phoneClean,
                    'car_model' => $car,
                    'last_car_model' => $row['last_car_model'] ?: '',
                    'car_age' => $row['car_age'] ?: '',
                    'district' => $coords[2] ?: ($row['district'] ?: 'Bandung Area'),
                    'address' => $coords[3] ?? '',
                    'plate_number' => $row['plate_number'] ?? '',
                    'priority' => $row['priority'] ?: 'Warm',
                    'status' => $row['followup_status'] ?: 'Belum Dihubungi',
                    'sales_name' => $salesName,
                    'visit_photo' => $row['visit_photo'] ?: '',
                    'reason_followup' => $row['reason_followup'] ?: '',
                    'lat' => round($coords[0], 6),
                    'lng' => round($coords[1], 6),
                    'distance_km' => round($dist, 2),
                    'formatted_distance' => $dist < 1 ? round($dist * 1000) . ' m' : round($dist, 1) . ' km'
                ];
            }
        }
    }

    // Sort results by nearest distance
    usort($results, function($a, $b) {
        return $a['distance_km'] <=> $b['distance_km'];
    });

    $sliced = ($limit > 0 && count($results) > $limit) ? array_slice($results, 0, $limit) : $results;

    echo json_encode([
        'status' => 'success',
        'sales_coords' => ['lat' => $salesLat, 'lng' => $salesLng],
        'radius_km' => $maxRadius,
        'total_found' => count($results),
        'data' => $sliced
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
