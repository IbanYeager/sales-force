<?php
// api_customer_radar.php - Calculate distance to nearest prospects based on Sales GPS location
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

// Known Coordinates Dictionary for Bandung & Greater Area Districts / Subdistricts
$districtCoords = [
    'kiaracondong'    => [-6.9248, 107.6472],
    'kiara condong'   => [-6.9248, 107.6472],
    'batununggal'     => [-6.9531, 107.6256],
    'buahbatu'        => [-6.9554, 107.6468],
    'buah batu'       => [-6.9554, 107.6468],
    'lengkong'        => [-6.9312, 107.6189],
    'regol'           => [-6.9392, 107.6084],
    'antapani'        => [-6.9147, 107.6625],
    'arcamanik'       => [-6.9189, 107.6811],
    'coblong'         => [-6.8837, 107.6139],
    'sukajadi'        => [-6.8856, 107.5925],
    'sukasari'        => [-6.8689, 107.5878],
    'andir'           => [-6.9078, 107.5819],
    'cicendo'         => [-6.9025, 107.5936],
    'bojongloa kaler' => [-6.9328, 107.5889],
    'bojongloa kidul' => [-6.9525, 107.5947],
    'astana anyar'    => [-6.9367, 107.6011],
    'babakan ciparay' => [-6.9419, 107.5756],
    'cibeunying kaler'=> [-6.8925, 107.6322],
    'cibeunying kidul'=> [-6.9069, 107.6394],
    'mandalajati'     => [-6.8994, 107.6747],
    'panyileukan'     => [-6.9422, 107.7083],
    'cinambo'         => [-6.9319, 107.6975],
    'cibiru'          => [-6.9244, 107.7214],
    'ujung berung'    => [-6.9114, 107.7011],
    'ujungberung'     => [-6.9114, 107.7011],
    'rancasari'       => [-6.9625, 107.6722],
    'bandung kidul'   => [-6.9611, 107.6339],
    'bandung kulon'   => [-6.9239, 107.5689],
    'bandung wetan'   => [-6.9039, 107.6186],
    'sumur bandung'   => [-6.9167, 107.6111],
    'gedebage'        => [-6.9589, 107.6953],
    'dago'            => [-6.8653, 107.6183],
    'cikutra'         => [-6.8986, 107.6358],
    'pasteur'         => [-6.8944, 107.5889],
    'soekarno hatta'  => [-6.9450, 107.6500],
    'bojongsoang'     => [-6.9833, 107.6333],
    'dayeuhkolot'     => [-6.9889, 107.6222],
    'baleendah'       => [-7.0069, 107.6319],
    'margahayu'       => [-6.9722, 107.5667],
    'cimahi'          => [-6.8722, 107.5417],
    'padalarang'      => [-6.8389, 107.4778],
    'lembang'         => [-6.8167, 107.6167],
    'soreang'         => [-7.0250, 107.5194]
];

// Haversine formula to calculate distance in KM
function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371; // km
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) * sin($dLat / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon / 2) * sin($dLon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    return $earthRadius * $c;
}

// Function to estimate coordinates from text
function getCoordinatesForLocation($text, $districtMap) {
    if (empty($text)) {
        return [-6.9248 + (mt_rand(-15, 15) / 1000), 107.6472 + (mt_rand(-15, 15) / 1000)];
    }
    
    $clean = strtolower($text);
    foreach ($districtMap as $key => $coords) {
        if (strpos($clean, $key) !== false) {
            $jitterLat = (crc32($text . 'lat') % 100 - 50) / 10000;
            $jitterLng = (crc32($text . 'lng') % 100 - 50) / 10000;
            return [$coords[0] + $jitterLat, $coords[1] + $jitterLng];
        }
    }
    
    return [-6.9248, 107.6472];
}

$salesLat = isset($_GET['lat']) ? floatval($_GET['lat']) : -6.9248; // default Tunas Kircon
$salesLng = isset($_GET['lng']) ? floatval($_GET['lng']) : 107.6472;
$maxRadius = isset($_GET['radius']) ? floatval($_GET['radius']) : 15.0; // km
$salesId = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

try {
    // 1. Fetch Followup Customers
    $whereFu = "1=1";
    $paramsFu = [];
    if ($salesId > 0) {
        $whereFu .= " AND (assigned_sales_id = ? OR assigned_sales_id IS NULL OR assigned_sales_id = 0)";
        $paramsFu[] = $salesId;
    }
    
    $fuRows = followup_query("SELECT id, name, phone, district, car_model, last_car_model, priority, followup_status, cluster_name, outlet_do, notes FROM followup_customers WHERE $whereFu LIMIT 250", $paramsFu);
    
    $results = [];

    if (!empty($fuRows) && is_array($fuRows)) {
        foreach ($fuRows as $row) {
            $locText = ($row['district'] ?: '') . ' ' . ($row['cluster_name'] ?: '') . ' ' . ($row['notes'] ?: '');
            $coords = getCoordinatesForLocation($locText, $districtCoords);
            $dist = calculateDistance($salesLat, $salesLng, $coords[0], $coords[1]);

            if ($dist <= $maxRadius) {
                $phoneClean = clean_phone_number($row['phone'] ?? '');
                $car = $row['car_model'] ?: ($row['last_car_model'] ?: 'Toyota Unit');
                
                $results[] = [
                    'id' => (int)$row['id'],
                    'source' => 'followup_db',
                    'name' => $row['name'],
                    'phone' => $phoneClean,
                    'car_model' => $car,
                    'district' => $row['district'] ?: 'Bandung Area',
                    'priority' => $row['priority'] ?: 'Warm',
                    'status' => $row['followup_status'] ?: 'Belum Dihubungi',
                    'lat' => round($coords[0], 6),
                    'lng' => round($coords[1], 6),
                    'distance_km' => round($dist, 2),
                    'formatted_distance' => $dist < 1 ? round($dist * 1000) . ' m' : round($dist, 1) . ' km',
                    'maps_url' => "https://www.google.com/maps/dir/?api=1&destination=" . $coords[0] . "," . $coords[1],
                    'wa_url' => "https://wa.me/" . $phoneClean . "?text=" . urlencode("Halo Bapak/Ibu " . $row['name'] . ", saya dari Tunas Toyota Kiara Condong. Kebetulan saya sedang ada agenda di sekitar area " . ($row['district'] ?: 'tempat Bapak/Ibu') . ". Apakah ada waktu luang sebentar jika saya mampir untuk update info promo/unit?")
                ];
            }
        }
    }

    // 2. Also Fetch from tabel_customer (Kanban CRM) if available
    if ($conn) {
        $whereCust = "1=1";
        if ($salesId > 0) {
            $whereCust .= " AND sales_account_id = $salesId";
        }
        $custRes = $conn->query("SELECT id, nama, no_telp, alamat, status FROM tabel_customer WHERE $whereCust LIMIT 100");
        if ($custRes && $custRes->num_rows > 0) {
            while ($c = $custRes->fetch_assoc()) {
                $coords = getCoordinatesForLocation($c['alamat'] ?: '', $districtCoords);
                $dist = calculateDistance($salesLat, $salesLng, $coords[0], $coords[1]);

                if ($dist <= $maxRadius) {
                    $phoneClean = clean_phone_number($c['no_telp'] ?? '');
                    $results[] = [
                        'id' => (int)$c['id'],
                        'source' => 'pipeline_crm',
                        'name' => $c['nama'],
                        'phone' => $phoneClean,
                        'car_model' => 'Prospek CRM',
                        'district' => $c['alamat'] ?: 'Bandung',
                        'priority' => 'Hot Lead',
                        'status' => $c['status'] ?: 'Follow Up',
                        'lat' => round($coords[0], 6),
                        'lng' => round($coords[1], 6),
                        'distance_km' => round($dist, 2),
                        'formatted_distance' => $dist < 1 ? round($dist * 1000) . ' m' : round($dist, 1) . ' km',
                        'maps_url' => "https://www.google.com/maps/dir/?api=1&destination=" . $coords[0] . "," . $coords[1],
                        'wa_url' => "https://wa.me/" . $phoneClean . "?text=" . urlencode("Halo Bapak/Ibu " . $c['nama'] . ", saya dari Tunas Toyota. Kebetulan saya sedang berada di dekat area " . ($c['alamat'] ?: 'lokasi Anda') . ". Apakah bisa saya mampir sebentar untuk diskusi penawaran?")
                    ];
                }
            }
        }
    }

    // Sort results by nearest distance
    usort($results, function($a, $b) {
        return $a['distance_km'] <=> $b['distance_km'];
    });

    // Slice to limit
    $sliced = array_slice($results, 0, $limit);

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
