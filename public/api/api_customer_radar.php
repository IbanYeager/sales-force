<?php
// api_customer_radar.php - Unified Live GPS Radar for Sales Force CRM
date_default_timezone_set('Asia/Jakarta');

if (!ob_start("ob_gzhandler")) {
    ob_start();
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
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
    return 6371 * 2 * atan2(Math_sqrt_safe($a), Math_sqrt_safe(1 - $a));
}

function Math_sqrt_safe($val) {
    return sqrt(max(0.0, (float)$val));
}

$salesLat = isset($_GET['lat']) ? floatval($_GET['lat']) : -6.9248; // default Tunas Kircon
$salesLng = isset($_GET['lng']) ? floatval($_GET['lng']) : 107.6472;
$maxRadius = isset($_GET['radius']) ? floatval($_GET['radius']) : 50.0;
$salesId = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
$salesNameParam = isset($_GET['sales_name']) ? trim($_GET['sales_name']) : '';
$targetDistrict = isset($_GET['district']) ? strtolower(trim($_GET['district'])) : 'all';
$targetCar = isset($_GET['car_model']) ? strtolower(trim($_GET['car_model'])) : 'all';

try {
    $GLOBALS['SKIP_REMOTE_GEOCODE'] = true;

    $salesList = get_sales_list();
    $salesMap = [];
    foreach ($salesList as $s) {
        $salesMap[(int)$s['id']] = $s['name'];
    }

    $latDelta = ($maxRadius + 0.5) / 111.0;
    $lngDelta = ($maxRadius + 0.5) / 110.2;

    $where = [];
    $params = [];

    // Ownership visibility filter:
    // If sales is logged in (sales_id > 0 or sales_name provided), ONLY show:
    // 1. Customers assigned to / followed up by THIS sales, OR
    // 2. Customers that are still completely unassigned & unfollowed (Belum Dihubungi).
    // Leads already followed up or claimed by ANOTHER sales (e.g. Rahma) are hidden from Yani.
    if ($salesId > 0 || $salesNameParam !== '') {
        list($salesOwnerClause, $salesOwnerParams) = get_sales_filter_clause($salesId, $salesNameParam);
        $where[] = "(
            ($salesOwnerClause)
            OR (
                (assigned_sales_id IS NULL OR assigned_sales_id = 0)
                AND (sales_fu IS NULL OR sales_fu = '' OR sales_fu = '-' OR sales_fu = '0')
                AND (followup_status = 'Belum Dihubungi' OR followup_status IS NULL OR followup_status = '')
            )
        )";
        foreach ($salesOwnerParams as $sp) {
            $params[] = $sp;
        }
    }

    // Fast SQL bounding-box filter when searching within bounded radius (and no specific district override)
    if ($maxRadius < 500 && ($targetDistrict === 'all' || $targetDistrict === '')) {
        $minLat = $salesLat - $latDelta;
        $maxLat = $salesLat + $latDelta;
        $minLng = $salesLng - $lngDelta;
        $maxLng = $salesLng + $lngDelta;
        $where[] = "((lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?) OR lat IS NULL OR lng IS NULL)";
        $params[] = $minLat;
        $params[] = $maxLat;
        $params[] = $minLng;
        $params[] = $maxLng;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $districtAliases = [
        'kircon' => ['kiaracondong', 'kircon', 'ibrahim adjie', 'babakan surabaya', 'kebon kangkung'],
        'kiaracondong' => ['kiaracondong', 'kircon', 'ibrahim adjie', 'babakan surabaya', 'kebon kangkung'],
        'buahbatu' => ['buahbatu', 'buah batu', 'terusan buah batu', 'margacinta', 'ciwastra'],
        'buah batu' => ['buahbatu', 'buah batu', 'terusan buah batu', 'margacinta', 'ciwastra'],
        'batununggal' => ['batununggal', 'batu nunggal', 'mengger', 'kujangsari'],
        'batu nunggal' => ['batununggal', 'batu nunggal', 'mengger', 'kujangsari'],
        'rancasari' => ['rancasari', 'derwati', 'cipamokolan'],
        'lengkong' => ['lengkong', 'turangga', 'malabar', 'burangrang'],
        'arcamanik' => ['arcamanik', 'cisaranten', 'sukamiskin'],
        'gedebage' => ['gedebage', 'summarecon', 'rancabolang'],
        'bojongsoang' => ['bojongsoang', 'bojong soang', 'ciganitri', 'cipagalo'],
        'bojong soang' => ['bojongsoang', 'bojong soang', 'ciganitri', 'cipagalo'],
        'panyileukan' => ['panyileukan', 'cipadung kidul', 'mekarmulya'],
        'bandung kidul' => ['bandung kidul', 'wates', 'batununggal kidul'],
        'regol' => ['regol', 'pasirluyu', 'ciateul', 'pungkur', 'ancol'],
        'cinambo' => ['cinambo', 'babakan penghulu', 'sukamulya'],
        'andir' => ['andir', 'garuda', 'dunguscangang', 'campaka'],
        'cibaduyut' => ['cibaduyut', 'bojongloa kidul'],
        'ujungberung' => ['ujungberung', 'ujung berung', 'pasirwangi', 'cigending'],
        'ujung berung' => ['ujungberung', 'ujung berung', 'pasirwangi', 'cigending'],
        'sukajadi' => ['sukajadi', 'sukawarna', 'sukagalih', 'sarijadi'],
        'pasteur' => ['pasteur', 'dr djunjunan', 'djunjunan'],
        'dago' => ['dago', 'coblong', 'dipatiukur', 'lebakgede', 'sadang serang', 'sekeloa'],
        'kopo' => ['kopo', 'babakan ciparay', 'cirangrang'],
        'cimahi' => ['cimahi', 'cibeber', 'leuwigajah', 'baros', 'melong'],
        'soreang' => ['soreang', 'katapang', 'kutawaringin'],
        'cileunyi' => ['cileunyi', 'cinunuk', 'jatinangor'],
        'antapani' => ['antapani', 'antapani tengah', 'antapani kidul', 'antapani kulon', 'antapani wetan'],
    ];

    $searchKeywords = isset($districtAliases[$targetDistrict]) ? $districtAliases[$targetDistrict] : [$targetDistrict];

    $results = [];
    $districtsList = [];
    $carsList = [];

    $sql = "
        SELECT id, name, phone, district, geo_district, address, geo_address, city,
               car_model, last_car_model, car_age, car_year, priority, followup_status,
               cluster_name, outlet_do, notes, assigned_sales_id, sales_fu, sync_source,
               visit_photo, reason_followup, plate_number, vin, kilometer, pkb_no, pkb_date,
               operation_desc, ths_type, booking_type, service_advisor, foreman, lat, lng
        FROM followup_customers
        $whereSql
        ORDER BY id DESC
    ";
    $fuRows = followup_query($sql, $params);

    if (!empty($fuRows) && is_array($fuRows)) {
        foreach ($fuRows as $row) {
            $rawDist = trim((string)($row['district'] ?? ''));
            $rawAddr = trim((string)($row['address'] ?? ''));
            $rawCity = trim((string)($row['city'] ?? ''));
            $rawNotes = trim((string)($row['notes'] ?? ''));

            $hasStoredCoords = (isset($row['lat']) && isset($row['lng']) && is_numeric($row['lat']) && is_numeric($row['lng']) && floatval($row['lat']) != 0 && floatval($row['lng']) != 0);

            if ($hasStoredCoords) {
                $rLat = floatval($row['lat']);
                $rLng = floatval($row['lng']);
                $resolvedDist = !empty($row['geo_district'])
                    ? $row['geo_district']
                    : (($rawDist && $rawDist !== '0' && strtolower($rawDist) !== 'bandung area') ? $rawDist : 'Bandung Area');
                $resolvedAddr = ($rawAddr && $rawAddr !== '0')
                    ? trim($rawAddr . ($rawCity && $rawCity !== '0' ? ', ' . $rawCity : ''))
                    : ($row['geo_address'] ?? '');
            } else {
                $fullAddrParts = array_filter([$rawAddr, $rawDist, $rawCity], fn($v) => $v !== '' && $v !== '0');
                $fullAddr = !empty($fullAddrParts) ? implode(', ', $fullAddrParts) : $rawNotes;
                $entityAddrSrc = ($rawAddr !== '' && $rawAddr !== '0') ? $rawAddr : $rawNotes;
                $entitySeed = radarComputeEntitySeed($row['id'], $row['name'] ?? '', $entityAddrSrc, $rawDist, $rawCity);
                $coords = getAccurateCoords($row['id'], $rawDist, $fullAddr, null, $row['plate_number'] ?? '', $row['vin'] ?? '', $entitySeed);
                $rLat = round($coords[0], 6);
                $rLng = round($coords[1], 6);
                $resolvedDist = ($rawDist && $rawDist !== '0' && strtolower($rawDist) !== 'bandung area')
                    ? $rawDist
                    : ($coords[2] ?: 'Bandung Area');
                $resolvedAddr = $coords[3] ?? $fullAddr;
            }

            // District Filter check
            if ($targetDistrict !== 'all' && $targetDistrict !== '') {
                $distNameClean = strtolower($resolvedDist ?: '');
                $rawDistClean = strtolower($rawDist);
                $matched = false;
                foreach ($searchKeywords as $kw) {
                    if (($distNameClean && strpos($distNameClean, $kw) !== false) || ($rawDistClean && strpos($rawDistClean, $kw) !== false)) {
                        $matched = true;
                        break;
                    }
                }
                if (!$matched) {
                    $addrCheck = strtolower($resolvedAddr . ' ' . $rawCity . ' ' . $rawNotes);
                    foreach ($searchKeywords as $kw) {
                        if (strpos($addrCheck, $kw) !== false) {
                            $matched = true;
                            break;
                        }
                    }
                }
                if (!$matched) continue;
            }

            // Car Model Filter check
            if ($targetCar !== 'all' && $targetCar !== '') {
                $carClean = strtolower(($row['car_model'] ?? '') . ' ' . ($row['last_car_model'] ?? ''));
                if (strpos($carClean, $targetCar) === false) continue;
            }

            if ($maxRadius < 500 && ($targetDistrict === 'all' || $targetDistrict === '')) {
                if (abs($rLat - $salesLat) > $latDelta) continue;
                if (abs($rLng - $salesLng) > $lngDelta) continue;
            }

            $dist = calculateDistance($salesLat, $salesLng, $rLat, $rLng);

            if (($targetDistrict !== 'all' && $targetDistrict !== '') || $maxRadius >= 500 || $dist <= $maxRadius) {
                if ($resolvedDist && strtolower($resolvedDist) !== 'bandung area') {
                    $districtsList[$resolvedDist] = true;
                }
                $cm = trim((string)($row['car_model'] ?: $row['last_car_model']));
                if ($cm) $carsList[$cm] = true;

                $sid = (int)($row['assigned_sales_id'] ?? 0);
                $sFu = trim((string)($row['sales_fu'] ?? ''));
                if ($sid > 0 && isset($salesMap[$sid])) {
                    $salesName = $salesMap[$sid];
                } elseif ($sFu !== '' && $sFu !== '-' && $sFu !== '0') {
                    $salesName = $sFu;
                } else {
                    $salesName = 'Terbuka (Belum Di-FU)';
                }

                $phoneClean = clean_phone_number($row['phone'] ?? '');
                $car = $row['car_model'] ?: ($row['last_car_model'] ?: 'Toyota Unit');

                $results[] = [
                    'id' => (int)$row['id'],
                    'source' => 'unified_db',
                    'name' => $row['name'],
                    'phone' => $phoneClean,
                    'car_model' => $car,
                    'last_car_model' => $row['last_car_model'] ?: '',
                    'car_age' => $row['car_age'] ?: '',
                    'car_year' => $row['car_year'] ?: '',
                    'district' => $resolvedDist,
                    'city' => $rawCity !== '0' ? $rawCity : '',
                    'address' => $resolvedAddr,
                    'plate_number' => $row['plate_number'] ?? '',
                    'kilometer' => $row['kilometer'] ?? '',
                    'pkb_no' => $row['pkb_no'] ?? '',
                    'pkb_date' => $row['pkb_date'] ?? '',
                    'operation_desc' => $row['operation_desc'] ?? '',
                    'ths_type' => $row['ths_type'] ?? '',
                    'booking_type' => $row['booking_type'] ?? '',
                    'service_advisor' => $row['service_advisor'] ?? '',
                    'foreman' => $row['foreman'] ?? '',
                    'priority' => $row['priority'] ?? '',
                    'status' => $row['followup_status'] ?: 'Belum Dihubungi',
                    'assigned_sales_id' => $sid,
                    'sales_fu' => $sFu,
                    'sales_name' => $salesName,
                    'visit_photo' => $row['visit_photo'] ?: '',
                    'reason_followup' => $row['reason_followup'] ?: '',
                    'lat' => $rLat,
                    'lng' => $rLng,
                    'distance_km' => round($dist, 2),
                    'formatted_distance' => $dist < 1 ? round($dist * 1000) . ' m' : round($dist, 1) . ' km'
                ];
            }
        }
    }

    ksort($districtsList);
    ksort($carsList);

    usort($results, function($a, $b) {
        return $a['distance_km'] <=> $b['distance_km'];
    });

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 25000;
    if ($limit <= 0) $limit = 25000;
    $totalFound = count($results);
    $slicedResults = array_slice($results, 0, $limit);

    echo json_encode([
        'status' => 'success',
        'center' => ['lat' => $salesLat, 'lng' => $salesLng],
        'radius_km' => $maxRadius,
        'total_found' => $totalFound,
        'districts_list' => array_keys($districtsList),
        'cars_list' => array_keys($carsList),
        'data' => $slicedResults
    ]);
} catch (Throwable $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
