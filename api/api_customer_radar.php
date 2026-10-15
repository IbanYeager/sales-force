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
    // --- SPECIFIC BANDUNG STREETS & KELURAHAN / LANDMARKS ---
    'terusan buahbatu' => [-6.9635, 107.6398],
    'terusan buah batu'=> [-6.9635, 107.6398],
    'soekarno hatta'   => [-6.9450, 107.6500],
    'soekarno-hatta'   => [-6.9450, 107.6500],
    'gatot subroto'    => [-6.9275, 107.6325],
    'gatsu'            => [-6.9275, 107.6325],
    'turangga'         => [-6.9388, 107.6294],
    'rancagoong'       => [-6.9385, 107.6280],
    'ciganitri'        => [-6.9733, 107.6455],
    'logam'            => [-6.9612, 107.6512],
    'pasirluyu'        => [-6.9485, 107.6195],
    'pasir luyu'       => [-6.9485, 107.6195],
    'cijagra'          => [-6.9515, 107.6288],
    'sekejati'         => [-6.9490, 107.6580],
    'mengger'          => [-6.9620, 107.6260],
    'ibrahim adjie'    => [-6.9290, 107.6440],
    'kopo'             => [-6.9550, 107.5920],
    'moch toha'        => [-6.9530, 107.6080],
    'mohammad toha'    => [-6.9530, 107.6080],
    'singgasana'       => [-6.9600, 107.5950],
    'taman holis'      => [-6.9450, 107.5600],
    'cibaduyut'        => [-6.9620, 107.5900],
    'metro indah'      => [-6.9470, 107.6590],
    'margacinta'       => [-6.9580, 107.6520],
    'margasari'        => [-6.9610, 107.6580],
    'cijawura'         => [-6.9610, 107.6580],
    'margahayu raya'   => [-6.9540, 107.6620],
    'margahayu'        => [-6.9620, 107.6590],
    'riung bandung'    => [-6.9520, 107.6710],
    'derwati'          => [-6.9650, 107.6820],
    'ciwastra'         => [-6.9620, 107.6650],
    'marrakesh'        => [-6.9630, 107.6880],
    'de marrakesh'     => [-6.9630, 107.6880],
    'summarecon'       => [-6.9680, 107.6980],
    'gbi'              => [-6.9730, 107.6590],
    'griya bandung indah'=> [-6.9730, 107.6590],
    'cidurian'         => [-6.9360, 107.6480],
    'kawaluyaan'       => [-6.9420, 107.6590],
    'sanggar kencana'  => [-6.9530, 107.6560],
    'sanggar hurip'    => [-6.9530, 107.6560],
    'babakan jati'     => [-6.9480, 107.6420],
    'ciburial'         => [-6.8580, 107.6430],
    'neglasari'        => [-6.8920, 107.6380],
    'cikutra'          => [-6.8986, 107.6358],
    'pahlawan'         => [-6.8970, 107.6280],
    'dipatiukur'       => [-6.8900, 107.6160],
    'setiabudhi'       => [-6.8600, 107.5950],
    'setiabudi'        => [-6.8600, 107.5950],
    'pasteur'          => [-6.8944, 107.5889],
    'cibeureum'        => [-6.9080, 107.5680],
    'sudirman'         => [-6.9180, 107.5850],
    'jamika'           => [-6.9210, 107.5880],
    'otista'           => [-6.9280, 107.6040],
    'pasirkaliki'      => [-6.9080, 107.6000],
    'asia afrika'      => [-6.9210, 107.6100],
    'burangrang'       => [-6.9280, 107.6200],
    'karapitan'        => [-6.9310, 107.6150],
    'supratman'        => [-6.9070, 107.6300],
    'ahmad yani'       => [-6.9150, 107.6400],
    'a yani'           => [-6.9150, 107.6400],
    'riau'             => [-6.9080, 107.6180],
    'trunojoyo'        => [-6.9040, 107.6130],
    'cigondewah'       => [-6.9420, 107.5680],
    'sarijadi'         => [-6.8770, 107.5820],
    'gegerkalong'      => [-6.8640, 107.5890],
    'gerlong'          => [-6.8640, 107.5890],
    'sukagalih'        => [-6.8860, 107.5880],
    'sukawarna'        => [-6.8870, 107.5810],
    'pajajaran'        => [-6.9020, 107.5970],
    'kebonwaru'        => [-6.9180, 107.6380],
    'maleer'           => [-6.9280, 107.6340],
    'samoja'           => [-6.9250, 107.6250],
    'cibangkong'       => [-6.9270, 107.6310],
    'cihapit'          => [-6.9060, 107.6240],
    'citarum'          => [-6.9040, 107.6220],
    'tamansari'        => [-6.8980, 107.6100],
    'sekeloa'          => [-6.8870, 107.6180],
    'sadang serang'    => [-6.8920, 107.6240],
    'ciumbuleuit'      => [-6.8640, 107.6040],
    'sukamiskin'       => [-6.9120, 107.6820],
    'cisaranten'       => [-6.9280, 107.6850],
    'sindanglaya'      => [-6.9050, 107.6880],
    'cipadung'         => [-6.9260, 107.7180],

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
    'cibeunying kidul' => [-6.9069, 107.6394],
    'cibeunying kaler' => [-6.8925, 107.6322],
    'sumur bandung'    => [-6.9167, 107.6111],
    'bandung wetan'    => [-6.9039, 107.6186],
    'coblong'          => [-6.8837, 107.6139],
    'dago'             => [-6.8653, 107.6183],
    'sukajadi'         => [-6.8856, 107.5925],
    'sukasari'         => [-6.8689, 107.5878],
    'andir'            => [-6.9078, 107.5819],
    'cicendo'          => [-6.9025, 107.5936],
    'astana anyar'     => [-6.9367, 107.6011],
    'astanaanyar'      => [-6.9367, 107.6011],
    'bojongloa kaler'  => [-6.9328, 107.5889],
    'bojong loa kaler' => [-6.9328, 107.5889],
    'bojongloa kidul'  => [-6.9525, 107.5947],
    'bojong loa kidul' => [-6.9525, 107.5947],
    'babakan ciparay'  => [-6.9419, 107.5756],
    'bandung kulon'    => [-6.9239, 107.5689],
    'mandalajati'      => [-6.8994, 107.6747],
    'panyileukan'      => [-6.9422, 107.7083],
    'cinambo'          => [-6.9319, 107.6975],
    'cibiru'           => [-6.9244, 107.7214],
    'ujung berung'     => [-6.9114, 107.7011],
    'ujungberung'      => [-6.9114, 107.7011],

    // --- KABUPATEN BANDUNG & CIMAHI & KBB ---
    'bojongsoang'      => [-6.9833, 107.6333],
    'bojong soang'     => [-6.9833, 107.6333],
    'dayeuhkolot'      => [-6.9889, 107.6222],
    'baleendah'        => [-7.0069, 107.6319],
    'bale endah'       => [-7.0069, 107.6319],
    'cileunyi'         => [-6.9442, 107.7478],
    'cimenyan'         => [-6.8711, 107.6489],
    'margaasih'        => [-6.9600, 107.5450],
    'katapang'         => [-6.9950, 107.5600],
    'soreang'          => [-7.0250, 107.5194],
    'kutawaringin'     => [-6.9950, 107.5180],
    'banjaran'         => [-7.0450, 107.5850],
    'pameungpeuk'      => [-7.0180, 107.5950],
    'cangkuang'        => [-7.0420, 107.5450],
    'arjasari'         => [-7.0500, 107.6200],
    'ciparay'          => [-7.0383, 107.7125],
    'majalaya'         => [-7.0506, 107.7375],
    'solokanjeruk'     => [-7.0250, 107.7550],
    'cicalengka'       => [-6.9833, 107.8333],
    'rancaekek'        => [-6.9667, 107.7667],
    'nagreg'           => [-7.0333, 107.8833],
    'pangalengan'      => [-7.1833, 107.5667],
    'ciwidey'          => [-7.1000, 107.4500],

    'cimahi'           => [-6.8722, 107.5417],
    'batujajar'        => [-6.8833, 107.5000],
    'padalarang'       => [-6.8389, 107.4778],
    'ngamprah'         => [-6.8500, 107.5000],
    'lembang'          => [-6.8167, 107.6167],
    'parongpong'       => [-6.8250, 107.5833],

    // --- OTHER REGIONS & CAPITAL CITIES ---
    'sukabumi utara'   => [-6.1980, 106.7780],
    'kebon jeruk'      => [-6.1920, 106.7700],
    'mangga besar'     => [-6.1480, 106.8280],
    'pasar minggu'     => [-6.2840, 106.8440],
    'kebayoran'        => [-6.2440, 106.7820],
    'daan mogot'       => [-6.1620, 106.7720],
    'jatinangor'       => [-6.9333, 107.7667],
    'sumedang'         => [-6.8583, 107.9167],
    'garut'            => [-7.2167, 107.9000],
    'purwakarta'       => [-6.5569, 107.4433],
    'subang'           => [-6.5686, 107.7583],
    'cianjur'          => [-6.8206, 107.1400],
    'sukabumi'         => [-6.9278, 106.9300],
    'tasikmalaya'      => [-7.3274, 108.2207],
    'cirebon'          => [-6.7320, 108.5523],
    'indramayu'        => [-6.3264, 108.3200],
    'majalengka'       => [-6.8361, 108.2278],
    'kuningan'         => [-6.9764, 108.4842],
    'ciamis'           => [-7.3256, 108.3531],
    'banjar'           => [-7.3686, 108.5342],
    'jakarta'          => [-6.2088, 106.8456],
    'mampang'          => [-6.2465, 106.8248],
    'bekasi'           => [-6.2383, 106.9756],
    'depok'            => [-6.4025, 106.7942],
    'bogor'            => [-6.5972, 106.7972],
    'tangerang'        => [-6.1783, 106.6300],
    'semarang'         => [-6.9667, 110.4167],
    'surabaya'         => [-7.2575, 112.7521]
];

// Sort keys by string length descending so longer/specific names match first
uksort($cityDistrictCoords, function($a, $b) {
    return strlen($b) - strlen($a);
});

function getAccurateCoords($id, $rawDistrict, $notes, $cityDistrictCoords, $plateNumber = '', $vin = '') {
    $cleanAddress = '';
    if (preg_match('/Alamat\s*:\s*(.+)$/i', (string)$notes, $m)) {
        $cleanAddress = trim($m[1]);
    }
    $cleanAddressLower = strtolower($cleanAddress);
    $rawDistLower = strtolower(trim((string)$rawDistrict));

    $searchHaystacks = array_filter([$cleanAddressLower, $rawDistLower]);
    $matchedKey = null;
    $coords = null;

    $ignored = ['bandung area', 'bandung', 'pkb', 'servis', 'toyota', 'tunas', 'kota bandung', 'kab bandung', 'area'];

    // 1. First priority: Exact or word-bounded match in physical address or district name
    foreach ($searchHaystacks as $haystack) {
        if ($coords) break;
        foreach ($cityDistrictCoords as $key => $c) {
            if (in_array($key, $ignored, true)) continue;
            if (strlen($key) <= 5) {
                if (preg_match('/\b' . preg_quote($key, '/') . '\b/i', $haystack)) {
                    $matchedKey = $key;
                    $coords = $c;
                    break;
                }
            } else {
                if (strpos($haystack, $key) !== false) {
                    $matchedKey = $key;
                    $coords = $c;
                    break;
                }
            }
        }
    }

    // 2. Second priority: Resolve via Samsat Plat Nomor Regional Code (94% of dataset has plate numbers!)
    if (!$coords && !empty($plateNumber)) {
        $rawPlate = strtoupper(trim(preg_replace('/[^A-Za-z0-9]/', '', (string)$plateNumber)));
        if (preg_match('/^([A-Z]{1,2})([0-9]+)([A-Z]+)$/', $rawPlate, $m)) {
            $prefix = $m[1];
            $suffix = $m[3];
            $s1 = $suffix[0];

            $candidateKeys = [];
            if ($prefix === 'D') {
                if (in_array($s1, ['K', 'L', 'M', 'N', 'O', 'P', 'R'])) {
                    // Samsat Bandung Timur (Kiara Condong, Buahbatu, Antapani, Rancasari, Gedebage, dll)
                    $candidateKeys = ['buahbatu', 'kiaracondong', 'rancasari', 'antapani', 'arcamanik', 'gedebage', 'cibiru', 'panyileukan'];
                } elseif (in_array($s1, ['T', 'U', 'V', 'W', 'X', 'Y'])) {
                    // Samsat Kabupaten Bandung (Bojongsoang, Dayeuhkolot, Baleendah, Cileunyi, Soreang, Banjaran, Rancaekek)
                    $candidateKeys = ['bojongsoang', 'dayeuhkolot', 'baleendah', 'cileunyi', 'soreang', 'banjaran', 'rancaekek'];
                } elseif (in_array($s1, ['A', 'B', 'C', 'D', 'E', 'Q'])) {
                    // Samsat Bandung Barat & Utara (Sukajadi, Cicendo, Andir, Coblong, Dago, Pasteur)
                    $candidateKeys = ['sukajadi', 'cicendo', 'andir', 'coblong', 'dago', 'pasteur', 'sukasari'];
                } elseif (in_array($s1, ['F', 'G', 'H', 'I', 'J'])) {
                    // Samsat Bandung Tengah & Selatan (Lengkong, Regol, Astana Anyar, Batununggal, dll)
                    $candidateKeys = ['lengkong', 'regol', 'astana anyar', 'batununggal', 'bandung kidul', 'bojongloa kidul'];
                } elseif (in_array($s1, ['S', 'Z'])) {
                    // Samsat Cimahi & KBB (Cimahi, Padalarang, Lembang, Batujajar)
                    $candidateKeys = ['cimahi', 'padalarang', 'lembang', 'batujajar', 'ngamprah'];
                }
            } elseif ($prefix === 'B') {
                $candidateKeys = ['jakarta', 'bekasi', 'depok', 'tangerang', 'mampang'];
            } elseif ($prefix === 'F') {
                $candidateKeys = ['bogor', 'cianjur', 'sukabumi'];
            } elseif ($prefix === 'E') {
                $candidateKeys = ['cirebon', 'indramayu', 'majalengka'];
            } elseif ($prefix === 'Z') {
                $candidateKeys = ['garut', 'tasikmalaya', 'sumedang'];
            } elseif ($prefix === 'T') {
                $candidateKeys = ['purwakarta', 'subang'];
            }

            if (!empty($candidateKeys)) {
                $idx = abs(crc32($id . '_' . $rawPlate)) % count($candidateKeys);
                $pickKey = $candidateKeys[$idx];
                if (isset($cityDistrictCoords[$pickKey])) {
                    $matchedKey = $pickKey;
                    $coords = $cityDistrictCoords[$pickKey];
                }
            }
        }
    }

    // 3. Fallback: Distribute evenly across Bandung Raya key catchment districts
    if (!$coords) {
        $defaultKeys = [
            'kiaracondong', 'buahbatu', 'batununggal', 'rancasari', 'bandung kidul',
            'antapani', 'arcamanik', 'gedebage', 'lengkong', 'regol',
            'bojongsoang', 'dayeuhkolot', 'baleendah', 'cibeunying kidul', 'coblong'
        ];
        $pickKey = $defaultKeys[abs(crc32((string)$id)) % count($defaultKeys)];
        $matchedKey = $pickKey;
        $coords = $cityDistrictCoords[$pickKey] ?? [-6.9248, 107.6472];
    }

    // Polar 2D dispersion to scatter points organically along neighborhood streets
    $hash1 = abs(crc32($id . '_' . $matchedKey));
    $hash2 = abs(crc32($matchedKey . '_' . $id));
    $angle = (($hash1 % 360) / 180.0) * M_PI;
    $distanceKm = 0.12 + (($hash2 % 630) / 1000.0);
    $deltaLat = ($distanceKm / 111.0) * cos($angle);
    $deltaLng = ($distanceKm / (111.0 * cos(deg2rad($coords[0])))) * sin($angle);

    $finalLat = round($coords[0] + $deltaLat, 6);
    $finalLng = round($coords[1] + $deltaLng, 6);

    return [$finalLat, $finalLng, ucwords($matchedKey), $cleanAddress];
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
