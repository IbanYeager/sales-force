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

// Known Coordinates Dictionary for Bandung & Greater Area & Indonesian Cities
$cityDistrictCoords = [
    // --- BANDUNG CITY KECAMATAN (Inner Bandung) ---
    'kiaracondong'     => [-6.9248, 107.6472],
    'kiara condong'    => [-6.9248, 107.6472],
    'batununggal'      => [-6.9531, 107.6256],
    'batu nunggal'     => [-6.9531, 107.6256],
    'buahbatu'         => [-6.9554, 107.6468],
    'buah batu'        => [-6.9554, 107.6468],
    'lengkong'         => [-6.9312, 107.6189],
    'regol'            => [-6.9392, 107.6084],
    'antapani'         => [-6.9147, 107.6625],
    'arcamanik'        => [-6.9189, 107.6811],
    'rancasari'        => [-6.9625, 107.6722],
    'bandung kidul'    => [-6.9611, 107.6339],
    'bdg kidul'        => [-6.9611, 107.6339],
    'gedebage'         => [-6.9589, 107.6953],
    'bedebage'         => [-6.9589, 107.6953],
    'cibeunying kidul' => [-6.9069, 107.6394],
    'cibeunying kaler' => [-6.8925, 107.6322],
    'cikutra'          => [-6.8986, 107.6358],
    'sumur bandung'    => [-6.9167, 107.6111],
    'bandung wetan'    => [-6.9039, 107.6186],
    'bdh wetan'        => [-6.9039, 107.6186],
    'coblong'          => [-6.8837, 107.6139],
    'dago'             => [-6.8653, 107.6183],
    'sukajadi'         => [-6.8856, 107.5925],
    'sukasari'         => [-6.8689, 107.5878],
    'pasteur'          => [-6.8944, 107.5889],
    'andir'            => [-6.9078, 107.5819],
    'cicendo'          => [-6.9025, 107.5936],
    'astana anyar'     => [-6.9367, 107.6011],
    'bojongloa kaler'  => [-6.9328, 107.5889],
    'bojong loa kaler' => [-6.9328, 107.5889],
    'bojongloa kidul'  => [-6.9525, 107.5947],
    'bojong loa kidul' => [-6.9525, 107.5947],
    'babakan ciparay'  => [-6.9419, 107.5756],
    'bbk tarogong'     => [-6.9380, 107.5900],
    'bandung kulon'    => [-6.9239, 107.5689],
    'bdg kulon'        => [-6.9239, 107.5689],
    'mandalajati'      => [-6.8994, 107.6747],
    'panyileukan'      => [-6.9422, 107.7083],
    'cinambo'          => [-6.9319, 107.6975],
    'cibiru'           => [-6.9244, 107.7214],
    'ujung berung'     => [-6.9114, 107.7011],
    'ujungberung'      => [-6.9114, 107.7011],
    'soekarno hatta'   => [-6.9450, 107.6500],

    // --- KABUPATEN BANDUNG & CIMAHI & KBB ---
    'bojongsoang'      => [-6.9833, 107.6333],
    'bojong soang'     => [-6.9833, 107.6333],
    'dayeuhkolot'      => [-6.9889, 107.6222],
    'baleendah'        => [-7.0069, 107.6319],
    'bale endah'       => [-7.0069, 107.6319],
    'cileunyi'         => [-6.9442, 107.7478],
    'cimenyan'         => [-6.8711, 107.6489],
    'margahayu'        => [-6.9722, 107.5667],
    'margaasih'        => [-6.9600, 107.5450],
    'katapang'         => [-6.9950, 107.5600],
    'soreang'          => [-7.0250, 107.5194],
    'banjaran'         => [-7.0450, 107.5850],
    'arjasari'         => [-7.0500, 107.6200],
    'ciparay'          => [-7.0383, 107.7125],
    'majalaya'         => [-7.0506, 107.7375],
    'cicalengka'       => [-6.9833, 107.8333],
    'rancaekek'        => [-6.9667, 107.7667],
    'nagreg'           => [-7.0333, 107.8833],
    'paseh'            => [-7.0667, 107.7667],
    'pangalengan'      => [-7.1833, 107.5667],
    'ciwidey'          => [-7.1000, 107.4500],

    'cimahi'           => [-6.8722, 107.5417],
    'batujajar'        => [-6.8833, 107.5000],
    'padalarang'       => [-6.8389, 107.4778],
    'ngamprah'         => [-6.8500, 107.5000],
    'lembang'          => [-6.8167, 107.6167],
    'parongpong'       => [-6.8250, 107.5833],
    'cisarua'          => [-6.8167, 107.5500],
    'cililin'          => [-6.9500, 107.4500],

    // --- OTHER CITIES / PROVINCES ---
    'jatinangor'       => [-6.9333, 107.7667],
    'sumedang'         => [-6.8583, 107.9167],
    'garut'            => [-7.2167, 107.9000],
    'limbangan'        => [-7.0333, 107.9833],
    'banyuresmi'       => [-7.1500, 107.9333],
    'bayongbong'       => [-7.2667, 107.8667],
    'purwakarta'       => [-6.5569, 107.4433],
    'subang'           => [-6.5686, 107.7583],
    'cianjur'          => [-6.8206, 107.1400],
    'sukabumi'         => [-6.9278, 106.9300],
    'tasikmalaya'      => [-7.3274, 108.2207],
    'kawalu'           => [-7.3719, 108.2081],
    'ciamis'           => [-7.3256, 108.3531],
    'banjar'           => [-7.3686, 108.5342],
    'cirebon'          => [-6.7320, 108.5523],
    'kuningan'         => [-6.9764, 108.4842],
    'majalengka'       => [-6.8361, 108.2278],
    'indramayu'        => [-6.3264, 108.3200],
    'jakarta'          => [-6.2088, 106.8456],
    'mampang'          => [-6.2465, 106.8248],
    'gambir'           => [-6.1764, 106.8272],
    'bekasi'           => [-6.2383, 106.9756],
    'depok'            => [-6.4025, 106.7942],
    'bogor'            => [-6.5972, 106.7972],
    'tangerang'        => [-6.1783, 106.6300],
    'serang'           => [-6.1200, 106.1500],
    'jambi'            => [-1.6101, 103.6131],
    'lampung'          => [-5.4500, 105.2667],
    'palembang'        => [-2.9761, 104.7754],
    'semarang'         => [-6.9667, 110.4167],
    'surabaya'         => [-7.2575, 112.7521],
    'banjarmasin'      => [-3.3194, 114.5908]
];

function getAccurateCoords($id, $text, $cityDistrictCoords) {
    $clean = strtolower((string)$text);
    foreach ($cityDistrictCoords as $key => $coords) {
        if (strpos($clean, $key) !== false) {
            $hash = abs(crc32($id . $key));
            $jLat = (($hash % 120) - 60) / 10000;
            $jLng = ((($hash >> 3) % 120) - 60) / 10000;
            return [$coords[0] + $jLat, $coords[1] + $jLng, ucwords($key)];
        }
    }
    
    // Default fallback for generic 'Bandung Area': Tunas Kircon / Kiara Condong hub (-6.9248, 107.6472)
    $hash = abs(crc32($id . 'kircon'));
    $jLat = (($hash % 140) - 70) / 10000;
    $jLng = ((($hash >> 3) % 140) - 70) / 10000;
    return [-6.9248 + $jLat, 107.6472 + $jLng, 'Bandung Area'];
}

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
$maxRadius = isset($_GET['radius']) ? floatval($_GET['radius']) : 5.0; // km
$salesId = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 500;

try {
    $salesList = get_sales_list();
    $salesMap = [];
    foreach ($salesList as $s) {
        $salesMap[(int)$s['id']] = $s['name'];
    }

    // Bounding Box Deltas for ultra-fast filtering
    $latDelta = ($maxRadius + 0.1) / 111.0;
    $lngDelta = ($maxRadius + 0.1) / 110.2;

    // Fetch ALL Followup Customers (PKB Radar + SPV/Kacab dataset)
    $fuRows = followup_query("SELECT id, name, phone, district, car_model, last_car_model, car_age, priority, followup_status, cluster_name, outlet_do, notes, assigned_sales_id, sync_source FROM followup_customers ORDER BY id DESC", []);
    
    $results = [];

    if (!empty($fuRows) && is_array($fuRows)) {
        foreach ($fuRows as $row) {
            $locText = ($row['district'] ?: '') . ' ' . ($row['cluster_name'] ?: '') . ' ' . ($row['notes'] ?: '');
            $coords = getAccurateCoords($row['id'], $locText, $cityDistrictCoords);
            
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
                
                $waUrl = '';
                if (!empty($phoneClean) && $phoneClean !== '-') {
                    $waUrl = "https://wa.me/" . $phoneClean . "?text=" . urlencode("Halo Bapak/Ibu " . $row['name'] . ", saya dari Tunas Toyota Kiara Condong. Kebetulan saya sedang ada agenda di sekitar area " . ($coords[2] ?: 'tempat Bapak/Ibu') . ". Apakah ada waktu luang sebentar jika saya mampir untuk update info promo/unit?");
                }

                $results[] = [
                    'id' => (int)$row['id'],
                    'source' => $row['sync_source'] ?: 'followup_db',
                    'name' => $row['name'],
                    'phone' => $phoneClean,
                    'car_model' => $car,
                    'last_car_model' => $row['last_car_model'] ?: '',
                    'car_age' => $row['car_age'] ?: '',
                    'district' => $coords[2] ?: ($row['district'] ?: 'Bandung Area'),
                    'priority' => $row['priority'] ?: 'Warm',
                    'status' => $row['followup_status'] ?: 'Belum Dihubungi',
                    'sales_name' => $salesName,
                    'lat' => round($coords[0], 6),
                    'lng' => round($coords[1], 6),
                    'distance_km' => round($dist, 2),
                    'formatted_distance' => $dist < 1 ? round($dist * 1000) . ' m' : round($dist, 1) . ' km',
                    'maps_url' => "https://www.google.com/maps/dir/?api=1&destination=" . round($coords[0], 6) . "," . round($coords[1], 6),
                    'wa_url' => $waUrl
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
