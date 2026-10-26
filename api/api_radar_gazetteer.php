<?php
// api_radar_gazetteer.php - Comprehensive Spatial Gazetteer & Address Resolver for Tunas Toyota SFT CRM

// --- TIER 1: BANDUNG RAYA DISTRICTS, KELURAHAN, ROADS & LANDMARKS ---
$bandungDistricts = [
    // Kota Bandung - Kecamatan & Key Areas
    'antapani'         => [-6.9147, 107.6625],
    'antapani tengah'  => [-6.9147, 107.6625],
    'antapani kidul'   => [-6.9180, 107.6600],
    'antapani kulon'   => [-6.9120, 107.6580],
    'antapani wetan'   => [-6.9150, 107.6680],
    'kiaracondong'     => [-6.9248, 107.6472],
    'kiara condong'    => [-6.9248, 107.6472],
    'kircon'           => [-6.9248, 107.6472],
    'buahbatu'         => [-6.9554, 107.6468],
    'buah batu'        => [-6.9554, 107.6468],
    'terusan buahbatu' => [-6.9635, 107.6398],
    'terusan buah batu'=> [-6.9635, 107.6398],
    'lengkong'         => [-6.9312, 107.6189],
    'regol'            => [-6.9392, 107.6084],
    'arcamanik'        => [-6.9189, 107.6811],
    'rancasari'        => [-6.9625, 107.6722],
    'bandung kidul'    => [-6.9611, 107.6339],
    'gedebage'         => [-6.9589, 107.6953],
    'cibeunying kidul' => [-6.9069, 107.6394],
    'cibeunying kaler' => [-6.8925, 107.6322],
    'sumur bandung'    => [-6.9167, 107.6111],
    'bandung wetan'    => [-6.9039, 107.6186],
    'coblong'          => [-6.8837, 107.6139],
    'dago'             => [-6.8653, 107.6183],
    'sukajadi'         => [-6.8856, 107.5925],
    'pasteur'          => [-6.8944, 107.5889],
    'sukasari'         => [-6.8689, 107.5878],
    'andir'            => [-6.9078, 107.5819],
    'cicendo'          => [-6.9025, 107.5936],
    'bojongloa kaler'  => [-6.9328, 107.5889],
    'bojong loa kaler' => [-6.9328, 107.5889],
    'bojongloa kidul'  => [-6.9525, 107.5947],
    'bojong loa kidul' => [-6.9525, 107.5947],
    'babakan ciparay'  => [-6.9419, 107.5756],
    'bbk ciparay'      => [-6.9419, 107.5756],
    'bandung kulon'    => [-6.9239, 107.5689],
    'mandalajati'      => [-6.8994, 107.6747],
    'panyileukan'      => [-6.9422, 107.7083],
    'cinambo'          => [-6.9319, 107.6975],
    'cibiru'           => [-6.9244, 107.7214],
    'ujung berung'     => [-6.9114, 107.7011],
    'ujungberung'      => [-6.9114, 107.7011],
    'batununggal'      => [-6.9531, 107.6256],
    'batu nunggal'     => [-6.9531, 107.6256],
    'astana anyar'     => [-6.9367, 107.6011],
    'astanaanyar'      => [-6.9367, 107.6011],

    // Kab Bandung
    'bojongsoang'      => [-6.9833, 107.6333],
    'bojong soang'     => [-6.9833, 107.6333],
    'dayeuhkolot'      => [-6.9889, 107.6222],
    'dayeuh kolot'     => [-6.9889, 107.6222],
    'baleendah'        => [-7.0069, 107.6319],
    'bale endah'       => [-7.0069, 107.6319],
    'cileunyi'         => [-6.9442, 107.7478],
    'cimenyan'         => [-6.8711, 107.6489],
    'cilengkrang'      => [-6.9020, 107.7200],
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
    'solokan jeruk'    => [-7.0250, 107.7550],
    'paseh'            => [-7.0750, 107.7850],
    'ibun'             => [-7.1150, 107.7950],
    'pacet'            => [-7.1000, 107.7200],
    'kertasari'        => [-7.1850, 107.7000],
    'cicalengka'       => [-6.9833, 107.8333],
    'rancaekek'        => [-6.9667, 107.7667],
    'nagreg'           => [-7.0333, 107.8833],
    'pangalengan'      => [-7.1833, 107.5667],
    'ciwidey'          => [-7.1000, 107.4500],
    'pasirjambu'       => [-7.0850, 107.4850],
    'rancabali'        => [-7.1450, 107.3950],
    'cimaung'          => [-7.0850, 107.5600],
    'margahayu'        => [-6.9750, 107.5800],
    'sukamenak'        => [-6.9750, 107.5850],

    // Cimahi & KBB
    'cimahi'           => [-6.8722, 107.5417],
    'cimahi selatan'   => [-6.8950, 107.5450],
    'cimahi tengah'    => [-6.8722, 107.5417],
    'cimahi utara'     => [-6.8520, 107.5480],
    'batujajar'        => [-6.8833, 107.5000],
    'padalarang'       => [-6.8389, 107.4778],
    'ngamprah'         => [-6.8500, 107.5000],
    'lembang'          => [-6.8167, 107.6167],
    'parongpong'       => [-6.8250, 107.5833],
    'cisarua'          => [-6.8100, 107.5450],
    'cihampelas kbb'   => [-6.9350, 107.4850],
    'cililin'          => [-6.9550, 107.4650],
    'cipongkor'        => [-6.9850, 107.3850],
    'sindangkerta'     => [-6.9850, 107.4200],
    'gununghalu'       => [-7.0200, 107.2800],
    'cikalongwetan'    => [-6.7450, 107.4450],
    'cikalong wetan'   => [-6.7450, 107.4450],

    // Major Roads, Landmarks & Residential Complexes in Bandung Raya
    'ibrahim adjie'    => [-6.9290, 107.6440],
    'griya cempaka arum'=>[-6.9589, 107.6953],
    'cempaka arum'     => [-6.9589, 107.6953],
    'summarecon'       => [-6.9680, 107.6980],
    'buah batu square' => [-6.9733, 107.6455],
    'podomoro park'    => [-6.9850, 107.6420],
    'podomoro'         => [-6.9850, 107.6420],
    'ciganitri'        => [-6.9733, 107.6455],
    'cipagalo'         => [-6.9710, 107.6350],
    'riung bandung'    => [-6.9520, 107.6710],
    'margacinta'       => [-6.9580, 107.6520],
    'ciwastra'         => [-6.9620, 107.6650],
    'derwati'          => [-6.9650, 107.6820],
    'bodogol'          => [-6.9700, 107.6750],
    'kopo'             => [-6.9550, 107.5920],
    'cibaduyut'        => [-6.9620, 107.5900],
    'pasirkoja'        => [-6.9270, 107.5920],
    'terusan pasirkoja'=> [-6.9320, 107.5850],
    'terusan jakarta'  => [-6.9145, 107.6580],
    'terusan kopo'     => [-6.9750, 107.5750],
    'mohammad toha'    => [-6.9530, 107.6080],
    'moch toha'        => [-6.9530, 107.6080],
    'moch. toha'       => [-6.9530, 107.6080],
    'gatot subroto'    => [-6.9275, 107.6325],
    'gatsu'            => [-6.9275, 107.6325],
    'turangga'         => [-6.9388, 107.6294],
    'cihampelas'       => [-6.8950, 107.6040],
    'setiabudhi'       => [-6.8600, 107.5950],
    'setiabudi'        => [-6.8600, 107.5950],
    'surapati'         => [-6.8980, 107.6250],
    'supratman'        => [-6.9070, 107.6300],
    'cikutra'          => [-6.8986, 107.6358],
    'dipatiukur'       => [-6.8900, 107.6160],
    'dipati ukur'      => [-6.8900, 107.6160],
    'asia afrika'      => [-6.9210, 107.6100],
    'braga'            => [-6.9175, 107.6090],
    'ahmad yani'       => [-6.9150, 107.6400],
    'a yani'           => [-6.9150, 107.6400],
    'a. yani'          => [-6.9150, 107.6400],
    'sudirman'         => [-6.9180, 107.5850],
    'jend sudirman'    => [-6.9180, 107.5850],
    'cipaganti'        => [-6.8920, 107.6020],
    'dr djunjunan'     => [-6.8944, 107.5889],
    'djunjunan'        => [-6.8944, 107.5889],
    'phh mustofa'      => [-6.9010, 107.6450],
    'suci'             => [-6.9010, 107.6450],
    'laswi'            => [-6.9280, 107.6250],
    're martadinata'   => [-6.9080, 107.6180],
    'martadinata'      => [-6.9080, 107.6180],
    'pelajar pejuang'  => [-6.9320, 107.6250],
    'bkr'              => [-6.9380, 107.6100],
    'peta'             => [-6.9350, 107.5950],
    'lingkar selatan'  => [-6.9350, 107.6100],
    'otista'           => [-6.9280, 107.6040],
    'otto iskandardinata'=>[-6.9280, 107.6040],
    'karapitan'        => [-6.9310, 107.6150],
    'burangrang'       => [-6.9280, 107.6200],
    'ir h juanda'      => [-6.8850, 107.6140],
    'juanda'           => [-6.8850, 107.6140],
    'taman holis'      => [-6.9450, 107.5600],
    'holis'            => [-6.9450, 107.5600],
    'singgasana'       => [-6.9600, 107.5950],
    'mekarwangi'       => [-6.9550, 107.6020],
    'margahayu raya'   => [-6.9540, 107.6620],
    'margahayu permai' => [-6.9650, 107.5700],
    'de marrakesh'     => [-6.9630, 107.6880],
    'marrakesh'        => [-6.9630, 107.6880],
    'gbi'              => [-6.9730, 107.6590],
    'griya bandung indah'=> [-6.9730, 107.6590],
    'gba'              => [-6.9780, 107.6540],
    'griya bandung asri'=> [-6.9780, 107.6540],
    'taman kopo indah' => [-6.9720, 107.5580],
    'tki'              => [-6.9720, 107.5580],
    'puri dago'        => [-6.9180, 107.6750],
    'sanggar kencana'  => [-6.9530, 107.6560],
    'sanggar hurip'    => [-6.9530, 107.6560],
    'metro indah'      => [-6.9470, 107.6590],
    'mim'              => [-6.9470, 107.6590],
    'sarijadi'         => [-6.8770, 107.5820],
    'gegerkalong'      => [-6.8640, 107.5890],
    'gerlong'          => [-6.8640, 107.5890],
    'sukagalih'        => [-6.8860, 107.5880],
    'sukawarna'        => [-6.8870, 107.5810],
    'setrasari'        => [-6.8800, 107.5850],
    'ciburial'         => [-6.8580, 107.6430],
    'neglasari'        => [-6.8920, 107.6380],
    'pahlawan'         => [-6.8970, 107.6280],
    'cigondewah'       => [-6.9420, 107.5680],
    'melong'           => [-6.9250, 107.5550],
    'leuwigajah'       => [-6.9050, 107.5300],
    'leuwi gajah'      => [-6.9050, 107.5300],
    'baros'            => [-6.8850, 107.5380],
    'cimindi'          => [-6.8980, 107.5580],
    'cibeureum'        => [-6.9080, 107.5680],
    'karasak'          => [-6.9500, 107.6100],
    'leuwisari'        => [-6.9450, 107.5950],
    'pasirluyu'        => [-6.9485, 107.6195],
    'cijagra'          => [-6.9515, 107.6288],
    'mengger'          => [-6.9620, 107.6260],
    'sukapura'         => [-6.9680, 107.6380],
    'babakan sari'     => [-6.9280, 107.6480],
    'kebon jayanti'    => [-6.9240, 107.6460],
    'kebon gedang'     => [-6.9260, 107.6410],
    'binong'           => [-6.9320, 107.6370],
    'maleer'           => [-6.9280, 107.6340],
    'cibangkong'       => [-6.9270, 107.6310],
    'gumuruh'          => [-6.9340, 107.6330],
    'sekejati'         => [-6.9490, 107.6580],
    'margasari'        => [-6.9610, 107.6580],
    'cijawura'         => [-6.9610, 107.6580],
    'cisaranten'       => [-6.9280, 107.6850],
    'cisaranten kidul' => [-6.9480, 107.6850],
    'cisaranten kulon' => [-6.9280, 107.6750],
    'cisaranten endah' => [-6.9220, 107.6880],
    'sukamiskin'       => [-6.9120, 107.6820],
    'sindanglaya'      => [-6.9050, 107.6880],
    'cipadung'         => [-6.9260, 107.7180],
    'cipadung kidul'   => [-6.9350, 107.7120],
    'cinunuk'          => [-6.9380, 107.7320],
    'cimekar'          => [-6.9480, 107.7380],
    'sayang'           => [-6.9380, 107.7720],
    'parakan muncang'  => [-6.9750, 107.8200],
    'parakanmuncang'   => [-6.9750, 107.8200],
    'kujangsari'       => [-6.9664, 107.6432],
    'manjahlega'       => [-6.9450, 107.6690],
    'cipamokolan'      => [-6.9530, 107.6740],
    'pasawahan'        => [-6.9740, 107.6080],
    'mekarjaya'        => [-6.9360, 107.6780],
    'jatisari'         => [-6.9580, 107.6440],
    'palasari'         => [-6.9320, 107.6220],
    'rancabolang'      => [-6.9550, 107.6780],
    'cipageran'        => [-6.8520, 107.5250],
    'cigending'        => [-6.9050, 107.7020],
    'pasir endah'      => [-6.9050, 107.7080],
    'kebon kangkung'   => [-6.9250, 107.6430],
    'cicadas'          => [-6.9120, 107.6420],
    'cicaheum'         => [-6.9060, 107.6560],
    'padasuka'         => [-6.8980, 107.6520],
    'rancanumpang'     => [-6.9620, 107.7040],
    'tanimulya'        => [-6.8620, 107.5220],
    'campaka'          => [-6.9020, 107.5720],
    'permata biru'     => [-6.9420, 107.7420],
    'megabrata'        => [-6.9620, 107.6450],
    'bumi orange'      => [-6.9450, 107.7350],
    'bali view'        => [-6.9680, 107.6420],
    'pratama asri'     => [-6.9520, 107.6620],
    'gpa'              => [-6.9680, 107.6500],
    'taman permata palem' => [-6.9630, 107.6550],
    'd amerta'         => [-6.9720, 107.6620],
    'buah batu regency'=> [-6.9650, 107.6410],
    'taman cibaduyut indah' => [-6.9720, 107.5920],
    'griya winaya'     => [-6.9080, 107.7020],
    'griya caraka'     => [-6.9180, 107.6820],
    'astom residence'  => [-6.9540, 107.6620],
    'kiarasari'        => [-6.9620, 107.6470],
    'taman mekar agung'=> [-6.9850, 107.6250],
    'vijaya kusuma'    => [-6.9240, 107.5680],
    'eastern hills'    => [-6.9620, 107.6480],
    'bumi asri'        => [-6.9250, 107.5680],
    'taman holis indah'=> [-6.9450, 107.5600],
    'puri dago asri'   => [-6.9180, 107.6750],
];

// --- STREET DISAMBIGUATION TABLE (Streets named after other cities in Bandung) ---
$bandungStreetToDistrict = [
    'indramayu'        => 'antapani',
    'purwakarta'       => 'antapani',
    'subang'           => 'antapani',
    'majalengka'       => 'antapani',
    'cirebon'          => 'antapani',
    'kuningan'         => 'antapani',
    'tasikmalaya'      => 'antapani',
    'semarang'         => 'antapani',
    'cianjur'          => 'antapani',
    'sumedang'         => 'antapani',
    'ciamis'           => 'antapani',
    'terusan jakarta'  => 'antapani',
    'jakarta'          => 'kiaracondong',
    'surabaya'         => 'kiaracondong',
    'sukabumi'         => 'batununggal',
    'garut'            => 'batununggal',
    'solo'             => 'batununggal',
    'bali'             => 'sumur bandung',
    'lombok'           => 'bandung wetan',
    'aceh'             => 'bandung wetan',
    'riau'             => 'bandung wetan',
    'jawa'             => 'sumur bandung',
    'belitung'         => 'sumur bandung',
    'kalimantan'       => 'sumur bandung',
    'sumatera'         => 'sumur bandung',
    'flores'           => 'bandung wetan',
    'madura'           => 'bandung wetan',
    'ambon'            => 'bandung wetan'
];

// --- TIER 2: EXTERNAL REGENCIES & CITIES (OUTSIDE BANDUNG RAYA) ---
$externalCities = [
    'jatinangor'       => [-6.9333, 107.7667],
    'sumedang'         => [-6.8583, 107.9167],
    'tanjungsari'      => [-6.9050, 107.8050],
    'garut'            => [-7.2167, 107.9000],
    'tarogong'         => [-7.1950, 107.8850],
    'purwakarta'       => [-6.5569, 107.4433],
    'subang'           => [-6.5686, 107.7583],
    'cianjur'          => [-6.8206, 107.1400],
    'sukabumi'         => [-6.9278, 106.9300],
    'tasikmalaya'      => [-7.3274, 108.2207],
    'tasik'            => [-7.3274, 108.2207],
    'cirebon'          => [-6.7320, 108.5523],
    'indramayu'        => [-6.3264, 108.3200],
    'majalengka'       => [-6.8361, 108.2278],
    'kuningan'         => [-6.9764, 108.4842],
    'ciamis'           => [-7.3256, 108.3531],
    'banjar'           => [-7.3686, 108.5342],
    'karawang'         => [-6.3072, 107.3069],
    'cikarang'         => [-6.3150, 107.1400],
    'bekasi'           => [-6.2383, 106.9756],
    'depok'            => [-6.4025, 106.7942],
    'bogor'            => [-6.5972, 106.7972],
    'tangerang'        => [-6.1783, 106.6300],
    'tangsel'          => [-6.2850, 106.7150],
    'jakarta pusat'    => [-6.1800, 106.8300],
    'jakarta selatan'  => [-6.2600, 106.8100],
    'jakarta timur'    => [-6.2250, 106.9000],
    'jakarta barat'    => [-6.1650, 106.7650],
    'jakarta utara'    => [-6.1350, 106.8700],
    'jakarta'          => [-6.2088, 106.8456],
    'mampang'          => [-6.2465, 106.8248],
    'kebayoran'        => [-6.2440, 106.7820],
    'tanah abang'      => [-6.1950, 106.8150],
    'semarang'         => [-6.9667, 110.4167],
    'surabaya'         => [-7.2575, 112.7521]
];

// Master merged array for legacy compatibility
$cityDistrictCoords = array_merge($bandungDistricts, $externalCities);

// Sort bandungDistricts and externalCities by length descending
uksort($bandungDistricts, function($a, $b) {
    return strlen($b) - strlen($a);
});
uksort($externalCities, function($a, $b) {
    return strlen($b) - strlen($a);
});
uksort($cityDistrictCoords, function($a, $b) {
    return strlen($b) - strlen($a);
});

/**
 * Intelligent high-precision geocoding resolver for Sales Radar & Customer CRM
 * Prioritizes: Housing Complexes > Kelurahan > Streets > Districts > Explicit Cities.
 * Uses micro-jitter (15-45m) to keep pins exactly on their neighborhood streets.
 */
function getAccurateCoords($id, $rawDistrict, $notes, $cityDistrictCoords = null, $plateNumber = '', $vin = '') {
    global $bandungDistricts, $bandungStreetToDistrict, $externalCities;

    $cleanAddress = '';
    if (preg_match('/Alamat\s*:\s*(.+)$/i', (string)$notes, $m)) {
        $cleanAddress = trim($m[1]);
    }
    $cleanAddressLower = strtolower($cleanAddress);
    $rawDistLower = strtolower(trim((string)$rawDistrict));
    $haystack = trim("$rawDistLower $cleanAddressLower");

    $isBandungMentioned = (bool)preg_match('/\b(bandung|bdg|kota bandung|kab bandung)\b/i', $haystack);

    $matchedKey = null;
    $coords = null;

    // LEVEL 1: Specific Housing Complex / Komplek / Perumahan / Taman / Griya / Cluster
    if (!empty($cleanAddressLower)) {
        if (preg_match('/\b(komp\.?|komplek|perum\.?|perumahan|griya|taman|residence|regency)\s+([a-z0-9\s]+?)(?=\s+blok|\s+no|\s+rt|\s+rw|\s+kel|\s+kec|\s*,|\s*$)/i', $cleanAddressLower, $km)) {
            $kompClean = trim($km[2]);
            foreach ($bandungDistricts as $k => $c) {
                if (strlen($k) < 3) continue;
                if (strpos($kompClean, $k) !== false || strpos($cleanAddressLower, $k) !== false) {
                    $matchedKey = $k;
                    $coords = $c;
                    break;
                }
            }
        }
    }

    // LEVEL 2: Specific Kelurahan / Desa Pattern (e.g. "KEL. KUJANGSARI", "KEL. SEKEJATI")
    if (!$coords && !empty($cleanAddressLower)) {
        if (preg_match('/\b(kel\.?|kelurahan|desa)\s+([a-z\s]+?)(?=\s+kec|\s+kota|\s+kab|\s*rt|\s*rw|\s*,|\s*$)/i', $cleanAddressLower, $km)) {
            $kelClean = trim($km[2]);
            foreach ($bandungDistricts as $k => $c) {
                if (strlen($k) < 3) continue;
                if (strpos($kelClean, $k) !== false || preg_match('/\b' . preg_quote($k, '/') . '\b/i', $kelClean)) {
                    $matchedKey = $k;
                    $coords = $c;
                    break;
                }
            }
        }
    }

    // LEVEL 3: Street Disambiguation Protection
    // Handles streets named after cities in Bandung (e.g. "JL. INDRAMAYU NO.27 - ANTAPANI. BANDUNG", "JL. PURWAKARTA")
    if (!$coords && !empty($cleanAddressLower)) {
        foreach ($bandungStreetToDistrict as $streetWord => $targetDistrict) {
            if (preg_match('/\b(jl|jln|jalan)\.?\s*' . preg_quote($streetWord, '/') . '\b/i', $cleanAddressLower)) {
                // If an explicit Bandung district is also written in the address (e.g. "ANTAPANI. BANDUNG")
                foreach ($bandungDistricts as $distKey => $c) {
                    if ($distKey === 'bandung' || strlen($distKey) < 4) continue;
                    if (preg_match('/\b' . preg_quote($distKey, '/') . '\b/i', $cleanAddressLower)) {
                        $matchedKey = $distKey;
                        $coords = $c;
                        break;
                    }
                }
                if (!$coords) {
                    $matchedKey = $targetDistrict;
                    $coords = $bandungDistricts[$targetDistrict] ?? [-6.9248, 107.6472];
                }
                break;
            }
        }
    }

    // LEVEL 4: Explicit Bandung Raya Districts, Kelurahan, Roads & Complexes
    if (!$coords) {
        $searchHaystacks = array_filter([$cleanAddressLower, $rawDistLower]);
        foreach ($searchHaystacks as $h) {
            if ($coords) break;
            foreach ($bandungDistricts as $key => $c) {
                if ($key === 'bandung' || $key === 'kota bandung' || $key === 'kab bandung') continue;
                if (preg_match('/\b' . preg_quote($key, '/') . '\b/i', $h)) {
                    $matchedKey = $key;
                    $coords = $c;
                    break;
                }
            }
        }
    }

    // LEVEL 4.5: Arterial Highway Interpolation (Jl. Soekarno Hatta 20km Corridor)
    // Matches sub-districts along the corridor or parses building numbers to distribute correctly across Bandung
    if (!$coords && (preg_match('/\b(soekarno[\s\-]hatta|by[\s\-]?pass)\b/i', $cleanAddressLower) || preg_match('/\b(soekarno[\s\-]hatta)\b/i', $rawDistLower))) {
        $subCorridor = [
            'pasirluyu'        => [-6.9485, 107.6195],
            'regol'            => [-6.9392, 107.6084],
            'cimencrang'       => [-6.9580, 107.7050],
            'gedebage'         => [-6.9589, 107.6953],
            'cinambo'          => [-6.9319, 107.6975],
            'babakan penghulu' => [-6.9319, 107.6975],
            'sekejati'         => [-6.9490, 107.6580],
            'kebon kangkung'   => [-6.9250, 107.6430],
            'buahbatu'         => [-6.9554, 107.6468],
            'buah batu'        => [-6.9554, 107.6468],
            'arcamanik'        => [-6.9189, 107.6811],
            'cisaranten endah' => [-6.9220, 107.6880],
            'cisaranten kidul' => [-6.9480, 107.6850],
            'cisaranten'       => [-6.9280, 107.6850],
            'bandung kidul'    => [-6.9611, 107.6339],
            'kopo'             => [-6.9550, 107.5920],
            'bojongloa kaler'  => [-6.9328, 107.5889],
            'bojongloa kidul'  => [-6.9520, 107.6000],
            'gumuruh'          => [-6.9340, 107.6330],
            'batununggal'      => [-6.9531, 107.6256],
            'cipamokolan'      => [-6.9530, 107.6740],
            'rancasari'        => [-6.9625, 107.6722],
            'jatisari'         => [-6.9580, 107.6440],
            'margahayu raya'   => [-6.9540, 107.6620],
            'riung bandung'    => [-6.9520, 107.6710],
            'caringin'         => [-6.9400, 107.5750],
            'holis'            => [-6.9450, 107.5600],
            'cibeureum'        => [-6.9080, 107.5680],
            'babakan ciparay'  => [-6.9420, 107.5780],
            'cijagra'          => [-6.9515, 107.6288]
        ];
        foreach ($subCorridor as $subName => $subCoord) {
            if (preg_match('/\b' . preg_quote($subName, '/') . '\b/i', $cleanAddressLower)) {
                $matchedKey = $subName;
                $coords = $subCoord;
                break;
            }
        }

        // If no kelurahan specified, interpolate based on street number / KM
        if (!$coords) {
            if (preg_match('/(?:no\.?|km\.?)\s*([0-9]+)/i', $cleanAddressLower, $numMatch)) {
                $num = intval($numMatch[1]);
                if ($num < 200) {
                    $matchedKey = 'Soekarno Hatta Barat';
                    $coords = [-6.9360, 107.5700];
                } elseif ($num < 380) {
                    $matchedKey = 'Soekarno Hatta Pasirkoja';
                    $coords = [-6.9420, 107.5920];
                } elseif ($num < 490) {
                    $matchedKey = 'Soekarno Hatta Regol';
                    $coords = [-6.9470, 107.6180];
                } elseif ($num < 590) {
                    $matchedKey = 'Soekarno Hatta Batununggal';
                    $coords = [-6.9460, 107.6420];
                } elseif ($num < 690) {
                    $matchedKey = 'Soekarno Hatta Rancasari';
                    $coords = [-6.9450, 107.6680];
                } else {
                    $matchedKey = 'Soekarno Hatta Gedebage';
                    $coords = [-6.9400, 107.7000];
                }
            } else {
                $matchedKey = 'Soekarno Hatta Batununggal';
                $coords = [-6.9460, 107.6420];
            }
        }
    }

    // LEVEL 5: Explicit External Regencies & Cities (Strictly ONLY if NOT Bandung & explicit city appears)
    if (!$coords && !$isBandungMentioned) {
        $searchHaystacks = array_filter([$cleanAddressLower, $rawDistLower]);
        foreach ($searchHaystacks as $h) {
            if ($coords) break;
            foreach ($externalCities as $key => $c) {
                if (!empty($cleanAddressLower) && preg_match('/\b(jl|jln|jalan)\.?\s*' . preg_quote($key, '/') . '\b/i', $cleanAddressLower)) {
                    continue;
                }
                if (preg_match('/\b' . preg_quote($key, '/') . '\b/i', $h)) {
                    $matchedKey = $key;
                    $coords = $c;
                    break;
                }
            }
        }
    }

    // LEVEL 6: Fallback for local incomplete addresses (Default to Tunas Kircon Bandung Catchment)
    if (!$coords) {
        $matchedKey = 'kiaracondong';
        $coords = [-6.9248, 107.6472];
    }

    // High Precision Micro-Jitter (15 to 45 meters only!)
    // Keeps pin strictly on the actual street/neighborhood block and prevents stacking
    $hash1 = abs(crc32($id . '_' . $matchedKey));
    $hash2 = abs(crc32($matchedKey . '_' . $id));
    $angle = (($hash1 % 360) / 180.0) * M_PI;
    // 0.015 km to 0.045 km (15 to 45 meters)
    $distanceKm = 0.015 + (($hash2 % 30) / 1000.0);
    $deltaLat = ($distanceKm / 111.0) * cos($angle);
    $deltaLng = ($distanceKm / (111.0 * cos(deg2rad($coords[0])))) * sin($angle);

    $finalLat = round($coords[0] + $deltaLat, 6);
    $finalLng = round($coords[1] + $deltaLng, 6);

    return [$finalLat, $finalLng, ucwords($matchedKey), $cleanAddress];
}

/**
 * Address to District String resolver for Import and Migration engines
 */
function resolveAddressAndDistrict($address, $plateNumber = '', $id = 0) {
    global $cityDistrictCoords;
    $coordsInfo = getAccurateCoords($id, '', "Alamat: $address", $cityDistrictCoords, $plateNumber);
    return $coordsInfo[2]; // District name (e.g. 'Antapani')
}
