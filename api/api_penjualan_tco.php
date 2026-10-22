<?php
// api/api_penjualan_tco.php - Backend API for TCO Sales & Polreg Mapping
date_default_timezone_set('Asia/Jakarta');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/koneksi.php';

if (!$conn) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal terhubung ke database: ' . mysqli_connect_error()
    ]);
    exit;
}

// 1. Ensure Table Exists
$createTableSql = "
CREATE TABLE IF NOT EXISTS `tabel_penjualan_tco` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spk_no` varchar(50) DEFAULT NULL,
  `sales_account_id` int(11) DEFAULT NULL,
  `nama_sales` varchar(100) NOT NULL,
  `nama_spv` varchar(100) DEFAULT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `model_kendaraan` varchar(100) NOT NULL,
  `tipe_kendaraan` varchar(150) DEFAULT NULL,
  `item_tco_id` int(11) DEFAULT NULL,
  `item_tco_name` varchar(255) NOT NULL,
  `kategori_tco` varchar(50) DEFAULT 'Package',
  `part_number` varchar(100) DEFAULT NULL,
  `skema_harga` varchar(50) DEFAULT 'RTCO',
  `harga_satuan` bigint(20) NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 1,
  `total_harga` bigint(20) NOT NULL DEFAULT 0,
  `polreg_code` varchar(20) DEFAULT 'D',
  `wilayah_polreg` varchar(100) NOT NULL,
  `kota` varchar(100) NOT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status_order` varchar(50) DEFAULT 'Terpasang & Lunas',
  `tanggal_transaksi` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_spk` (`spk_no`),
  KEY `idx_kota` (`kota`),
  KEY `idx_polreg` (`wilayah_polreg`),
  KEY `idx_model` (`model_kendaraan`),
  KEY `idx_tanggal` (`tanggal_transaksi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";
$conn->query($createTableSql);

// 2. Auto-seed realistic TCO transactions if table is empty
function seedTcoTransactionsIfEmpty($conn) {
    $checkRes = $conn->query("SELECT COUNT(*) as c FROM `tabel_penjualan_tco`");
    $checkRow = $checkRes ? $checkRes->fetch_assoc() : ['c' => 0];
    if (($checkRow['c'] ?? 0) > 0) {
        return; // Already populated
    }

    // Coordinates dictionary for Bandung & West Java Districts
    $districtCoords = [
        // Bandung City (Plat D)
        'Lengkong' => [-6.9315, 107.6250, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Buahbatu' => [-6.9530, 107.6450, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Coblong' => [-6.8850, 107.6150, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Regol' => [-6.9380, 107.6080, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Bandung Kidul' => [-6.9520, 107.6320, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Antapani' => [-6.9180, 107.6620, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Arcamanik' => [-6.9150, 107.6780, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Sumur Bandung' => [-6.9180, 107.6120, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Sukasari' => [-6.8720, 107.5890, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Cicendo' => [-6.9020, 107.5950, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Rancasari' => [-6.9600, 107.6750, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Cinambo' => [-6.9350, 107.6950, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Babakan Ciparay' => [-6.9450, 107.5780, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Kiaracondong' => [-6.9280, 107.6480, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Gedebage' => [-6.9580, 107.6980, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Cibiru' => [-6.9240, 107.7180, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Bojongloa Kaler' => [-6.9350, 107.5900, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Bojongloa Kidul' => [-6.9550, 107.5980, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Cidadap' => [-6.8580, 107.6050, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],
        'Astanaanyar' => [-6.9350, 107.6020, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'],

        // Kab. Bandung (Plat D)
        'Baleendah' => [-7.0050, 107.6320, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Dayeuhkolot' => [-6.9850, 107.6250, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Soreang' => [-7.0320, 107.5250, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Bojongsoang' => [-6.9750, 107.6400, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Margahayu' => [-6.9720, 107.5850, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Banjaran' => [-7.0450, 107.5880, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Katapang' => [-7.0080, 107.5750, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Cileunyi' => [-6.9420, 107.7480, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Rancaekek' => [-6.9680, 107.7650, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Majalaya' => [-7.0520, 107.7550, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Ciparay' => [-7.0350, 107.7120, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Pangalengan' => [-7.1750, 107.5680, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],
        'Ciwidey' => [-7.0950, 107.4850, 'KAB. BANDUNG', 'Plat D - Kab. Bandung', 'D'],

        // Kota Cimahi (Plat D)
        'Cimahi Utara' => [-6.8680, 107.5520, 'KOTA CIMAHI', 'Plat D - Kota Cimahi', 'D'],
        'Cimahi Tengah' => [-6.8850, 107.5420, 'KOTA CIMAHI', 'Plat D - Kota Cimahi', 'D'],
        'Cimahi Selatan' => [-6.9050, 107.5350, 'KOTA CIMAHI', 'Plat D - Kota Cimahi', 'D'],

        // Kab. Bandung Barat (Plat D)
        'Padalarang' => [-6.8380, 107.4780, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Ngamprah' => [-6.8520, 107.5050, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Parongpong' => [-6.8250, 107.5850, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Lembang' => [-6.8180, 107.6180, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Batujajar' => [-6.9050, 107.4950, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Cisarua' => [-6.8150, 107.5450, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],
        'Cikalongwetan' => [-6.7450, 107.4250, 'KAB. BANDUNG BARAT', 'Plat D - Kab. Bandung Barat', 'D'],

        // Priangan Timur - Plat Z
        'Jatinangor' => [-6.9320, 107.7750, 'KAB. SUMEDANG', 'Plat Z - Sumedang', 'Z'],
        'Tanjungsari' => [-6.9080, 107.8050, 'KAB. SUMEDANG', 'Plat Z - Sumedang', 'Z'],
        'Sumedang Selatan' => [-6.8620, 107.9220, 'KAB. SUMEDANG', 'Plat Z - Sumedang', 'Z'],
        'Tarogong Kidul' => [-7.2150, 107.8920, 'KAB. GARUT', 'Plat Z - Garut', 'Z'],
        'Tarogong Kaler' => [-7.1850, 107.8820, 'KAB. GARUT', 'Plat Z - Garut', 'Z'],
        'Garut Kota' => [-7.2220, 107.9050, 'KAB. GARUT', 'Plat Z - Garut', 'Z'],
        'Tasikmalaya Kota' => [-7.3320, 108.2220, 'KOTA TASIKMALAYA', 'Plat Z - Tasikmalaya', 'Z'],

        // Pantura / Ciayumajakuning - Plat E & T
        'Kejaksan Cirebon' => [-6.7120, 108.5550, 'KOTA CIREBON', 'Plat E - Cirebon', 'E'],
        'Subang Kota' => [-6.5720, 107.7620, 'KAB. SUBANG', 'Plat T - Subang', 'T'],
        'Purwakarta Kota' => [-6.5580, 107.4450, 'KAB. PURWAKARTA', 'Plat T - Purwakarta', 'T'],
        'Karawang Barat' => [-6.3050, 107.3050, 'KAB. KARAWANG', 'Plat T - Karawang', 'T'],

        // Bogor / Sukabumi / Cianjur - Plat F
        'Cianjur Kota' => [-6.8220, 107.1420, 'KAB. CIANJUR', 'Plat F - Cianjur', 'F'],
        'Sukabumi Kota' => [-6.9250, 106.9350, 'KOTA SUKABUMI', 'Plat F - Sukabumi', 'F'],

        // Jabodetabek - Plat B
        'Jakarta Selatan' => [-6.2650, 106.8150, 'KOTA JAKARTA SELATAN', 'Plat B - Jabodetabek', 'B'],
        'Tangerang' => [-6.1820, 106.6350, 'KOTA TANGERANG', 'Plat B - Jabodetabek', 'B']
    ];

    $districtKeys = array_keys($districtCoords);

    // Fetch actual real SPK from penjualan_kiara_condong
    $spkQuery = "SELECT `SPK No` as spk_no, `Model` as model, `Type` as type, `Customer` as customer, 
                        `Nama Salesman IDMS` as salesman, `Nama SPV` as spv, `KOTA` as kota, `Sales Date` as sales_date
                 FROM `penjualan_kiara_condong` 
                 WHERE `Customer` IS NOT NULL AND `Customer` != '' 
                 ORDER BY `SPK No` DESC LIMIT 400";
    $spkRes = $conn->query($spkQuery);

    if (!$spkRes || $spkRes->num_rows === 0) {
        return;
    }

    // TCO Accessories catalog by model
    $accessoriesCatalog = [
        'INNOVA ZENIX' => [
            ['name' => 'Cross Over Package (Pkg A)', 'cat' => 'Package', 'price' => 3430000, 'pn' => 'AC, AD, AE'],
            ['name' => 'Compact Package (Pkg B)', 'cat' => 'Package', 'price' => 2518000, 'pn' => 'BC, BD, BE'],
            ['name' => 'Air Purifier NanoeX', 'cat' => 'Comfort', 'price' => 1399000, 'pn' => 'P55B00KA0F'],
            ['name' => 'DVR Dashboard Camera Set', 'cat' => 'Safety', 'price' => 2690000, 'pn' => 'PC6A30K01FA1'],
            ['name' => 'Upper Grille Ornament Modellista', 'cat' => 'Styling', 'price' => 1189000, 'pn' => 'P54010KA0Q'],
            ['name' => 'Scents NTCO Oceanic Joy', 'cat' => 'Fragrance', 'price' => 199000, 'pn' => 'PC5560K00AA1'],
            ['name' => 'Multifunction Box', 'cat' => 'Utility', 'price' => 266000, 'pn' => '05502TA560'],
            ['name' => 'Spare Tire Cover', 'cat' => 'Exterior', 'price' => 845000, 'pn' => '45802TA560'],
            ['name' => 'Premium Horn', 'cat' => 'Exterior', 'price' => 299000, 'pn' => '6A201TA560'],
            ['name' => 'Side Body Moulding', 'cat' => 'Protection', 'price' => 1099000, 'pn' => 'P51700KA0S'],
            ['name' => 'Seat Cover Private V Hv', 'cat' => 'Comfort', 'price' => 2999000, 'pn' => 'P5N0A00006']
        ],
        'AVANZA' => [
            ['name' => 'Utility Package (Pkg C)', 'cat' => 'Package', 'price' => 1899000, 'pn' => 'CB, CC'],
            ['name' => 'Lux Package (Pkg D)', 'cat' => 'Package', 'price' => 2009000, 'pn' => 'DA'],
            ['name' => 'Seat Cover Value Spec New Avanza', 'cat' => 'Comfort', 'price' => 910000, 'pn' => '22002TAD26'],
            ['name' => 'Front Grille Ornament Chrome', 'cat' => 'Styling', 'price' => 661000, 'pn' => 'P5401BYA02'],
            ['name' => 'Cargo Net', 'cat' => 'Utility', 'price' => 249000, 'pn' => 'P5246BYA02'],
            ['name' => 'Side Body Moulding Gunmetal', 'cat' => 'Protection', 'price' => 1099000, 'pn' => 'P5170BYA1D'],
            ['name' => 'DVR Dashcam Avanza', 'cat' => 'Safety', 'price' => 1999000, 'pn' => 'P56A3BYA0M'],
            ['name' => 'Wire Harness Premium Horn', 'cat' => 'Exterior', 'price' => 249000, 'pn' => '6A205TAD26'],
            ['name' => 'Veloz Side Visor Set', 'cat' => 'Exterior', 'price' => 556000, 'pn' => 'P5162BYA08']
        ],
        'VELOZ' => [
            ['name' => 'Value Package (Pkg B Veloz Hybrid)', 'cat' => 'Package', 'price' => 1297000, 'pn' => 'BA, BB'],
            ['name' => 'Smart Car Fragrance Veloz', 'cat' => 'Comfort', 'price' => 699000, 'pn' => 'PC556-BY009'],
            ['name' => 'Veloz Side Visor Set', 'cat' => 'Exterior', 'price' => 556000, 'pn' => 'P5162BYA08'],
            ['name' => 'Side Body Moulding Gunmetal', 'cat' => 'Protection', 'price' => 1099000, 'pn' => 'P5170BYA1D'],
            ['name' => 'DVR Dashcam Veloz', 'cat' => 'Safety', 'price' => 1999000, 'pn' => 'P56A3BYA0M'],
            ['name' => 'Back Door Glass Chrome Ornament', 'cat' => 'Styling', 'price' => 475000, 'pn' => 'P5405BYA06'],
            ['name' => 'Scents NTCO Blossom Whisper', 'cat' => 'Fragrance', 'price' => 199000, 'pn' => 'PC5560K006A1']
        ],
        'FORTUNER' => [
            ['name' => 'Sporty Package (Pkg B Fortuner)', 'cat' => 'Package', 'price' => 2845000, 'pn' => 'BF, BG'],
            ['name' => 'Style Package (Pkg A)', 'cat' => 'Package', 'price' => 2289000, 'pn' => 'AF, AG'],
            ['name' => 'Full Spec Package (Pkg C)', 'cat' => 'Package', 'price' => 5959000, 'pn' => 'CD, CE'],
            ['name' => 'Smart Car Fragrance Device Set Fortuner', 'cat' => 'Comfort', 'price' => 1399000, 'pn' => 'PC5560K00B'],
            ['name' => 'DVR Dashcam Fortuner GR', 'cat' => 'Safety', 'price' => 1799000, 'pn' => 'P56A30KA0F'],
            ['name' => 'Premium Horn', 'cat' => 'Exterior', 'price' => 299000, 'pn' => '6A201TA560'],
            ['name' => 'Sporty Outer Mirror Cover', 'cat' => 'Styling', 'price' => 449000, 'pn' => '64102TA274'],
            ['name' => 'Spare Tire Cover Fortuner', 'cat' => 'Exterior', 'price' => 869000, 'pn' => '45801TA338']
        ],
        'CALYA' => [
            ['name' => 'Lux Package (Pkg A Calya)', 'cat' => 'Package', 'price' => 2006000, 'pn' => 'AA'],
            ['name' => 'Stylish Package (Pkg C)', 'cat' => 'Package', 'price' => 1697000, 'pn' => 'CA'],
            ['name' => 'Seat Cover Value Spec Calya', 'cat' => 'Comfort', 'price' => 890000, 'pn' => '22005TAD02'],
            ['name' => 'Side Visor Talang Air', 'cat' => 'Exterior', 'price' => 399000, 'pn' => '16251TA079'],
            ['name' => 'Console Box', 'cat' => 'Utility', 'price' => 999000, 'pn' => '28161TA079'],
            ['name' => 'Back Camera Parkir', 'cat' => 'Safety', 'price' => 1350000, 'pn' => 'PC634BZ01UV3'],
            ['name' => 'Door Handle Protector', 'cat' => 'Protection', 'price' => 699000, 'pn' => 'P5168BZA1K']
        ],
        'RUSH' => [
            ['name' => 'Adventure Package (Pkg A)', 'cat' => 'Package', 'price' => 1579000, 'pn' => 'AA, AD'],
            ['name' => 'Convenience Package (Pkg B)', 'cat' => 'Package', 'price' => 1020000, 'pn' => 'BA, BD'],
            ['name' => 'Spare Tire Cover Rush', 'cat' => 'Exterior', 'price' => 735000, 'pn' => '45801TAD14'],
            ['name' => 'Cargo Net', 'cat' => 'Utility', 'price' => 283000, 'pn' => '24611TAD14'],
            ['name' => 'DVR Dashcam Rush', 'cat' => 'Safety', 'price' => 1879000, 'pn' => 'P56A3BYA0D'],
            ['name' => 'Air Purifier Rush', 'cat' => 'Comfort', 'price' => 1299000, 'pn' => '5B001TAD14TC']
        ],
        'RAIZE' => [
            ['name' => 'Sporty Essence Package (Pkg A)', 'cat' => 'Package', 'price' => 1999000, 'pn' => 'AA, AB'],
            ['name' => 'Aero Scent Package (Pkg B)', 'cat' => 'Package', 'price' => 1873000, 'pn' => 'BA, BB'],
            ['name' => 'Smart Car Fragrance Single Channel', 'cat' => 'Comfort', 'price' => 699000, 'pn' => 'PC556BY001A1'],
            ['name' => 'Door Scuff Plate (GR)', 'cat' => 'Protection', 'price' => 1199000, 'pn' => 'P5382BZA02'],
            ['name' => 'Sporty Roof Spoiler Set', 'cat' => 'Styling', 'price' => 1090000, 'pn' => 'P5150BYA05'],
            ['name' => 'Telematic Box (T-Intouch)', 'cat' => 'Technology', 'price' => 2499000, 'pn' => 'P55C3BYA0J']
        ],
        'AGYA' => [
            ['name' => 'Stylix Max Package (Pkg B)', 'cat' => 'Package', 'price' => 6295000, 'pn' => 'BA'],
            ['name' => 'Aerokit Package (Pkg E)', 'cat' => 'Package', 'price' => 5634000, 'pn' => 'EB'],
            ['name' => 'Advance Package (Pkg C)', 'cat' => 'Package', 'price' => 2278000, 'pn' => 'CA'],
            ['name' => 'Front Bumper Spoiler Red', 'cat' => 'Styling', 'price' => 1449000, 'pn' => 'P5154BYA0U3F'],
            ['name' => 'GR Side Skirt Red', 'cat' => 'Styling', 'price' => 2349000, 'pn' => 'P5156BYA0T3F']
        ],
        'HILUX' => [
            ['name' => 'Fleet Support Package (Pkg A)', 'cat' => 'Package', 'price' => 3600000, 'pn' => 'AA, AB'],
            ['name' => 'Bed Liner 3 Way', 'cat' => 'Protection', 'price' => 7399000, 'pn' => '35001TA320'],
            ['name' => 'Side Visor Hilux', 'cat' => 'Exterior', 'price' => 219000, 'pn' => '16202TA320'],
            ['name' => 'Premium Horn', 'cat' => 'Exterior', 'price' => 299000, 'pn' => '6A201TA560']
        ],
        'ALPHARD' => [
            ['name' => 'Package A [Modellista Package]', 'cat' => 'Package', 'price' => 64900000, 'pn' => 'AC, AD'],
            ['name' => 'Air Fragrance Device Set Alphard', 'cat' => 'Comfort', 'price' => 1999000, 'pn' => 'PC55658001'],
            ['name' => 'Scents NTCO Amber Haven', 'cat' => 'Fragrance', 'price' => 199000, 'pn' => 'PC5560K008A1']
        ],
        'VOXY' => [
            ['name' => 'Modellista Aeropart Package', 'cat' => 'Package', 'price' => 17500000, 'pn' => 'AC, AD'],
            ['name' => 'Signature Grille Illumination Set', 'cat' => 'Styling', 'price' => 845000, 'pn' => '15415TA670'],
            ['name' => 'Premium Horn', 'cat' => 'Exterior', 'price' => 299000, 'pn' => '6A201TA560']
        ]
    ];

    $insertStmt = $conn->prepare("
        INSERT INTO `tabel_penjualan_tco` (
            `spk_no`, `nama_sales`, `nama_spv`, `customer_name`, `customer_phone`, 
            `model_kendaraan`, `tipe_kendaraan`, `item_tco_id`, `item_tco_name`, `kategori_tco`, 
            `part_number`, `skema_harga`, `harga_satuan`, `qty`, `total_harga`, 
            `polreg_code`, `wilayah_polreg`, `kota`, `kecamatan`, `latitude`, `longitude`, 
            `status_order`, `tanggal_transaksi`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $seededCount = 0;
    $idx = 0;

    while ($row = $spkRes->fetch_assoc()) {
        $idx++;
        // Penetrasi ~70% (skip 30% SPK)
        if ($idx % 10 === 1 || $idx % 10 === 5 || $idx % 10 === 8) {
            continue; 
        }

        $spkNo = $row['spk_no'] ?? ('KC-24-' . str_pad($idx, 6, '0', STR_PAD_LEFT));
        $model = strtoupper(trim($row['model'] ?? 'INNOVA ZENIX'));
        $type = trim($row['type'] ?? $model);
        $customer = trim($row['customer'] ?? 'Pelanggan Tunas');
        $sales = trim($row['salesman'] ?? 'TOMMY KUSUMA DASUKI');
        $spv = trim($row['spv'] ?? 'FERYANTO');
        $kotaRaw = strtoupper(trim($row['kota'] ?? 'KOTA BANDUNG'));

        // Match accessory category
        $matchedCatKey = 'INNOVA ZENIX';
        if (strpos($model, 'AVANZA') !== false) $matchedCatKey = 'AVANZA';
        elseif (strpos($model, 'VELOZ') !== false) $matchedCatKey = 'VELOZ';
        elseif (strpos($model, 'FORTUNER') !== false) $matchedCatKey = 'FORTUNER';
        elseif (strpos($model, 'CALYA') !== false) $matchedCatKey = 'CALYA';
        elseif (strpos($model, 'RUSH') !== false) $matchedCatKey = 'RUSH';
        elseif (strpos($model, 'RAIZE') !== false) $matchedCatKey = 'RAIZE';
        elseif (strpos($model, 'AGYA') !== false) $matchedCatKey = 'AGYA';
        elseif (strpos($model, 'HILUX') !== false) $matchedCatKey = 'HILUX';
        elseif (strpos($model, 'ALPHARD') !== false) $matchedCatKey = 'ALPHARD';
        elseif (strpos($model, 'VOXY') !== false) $matchedCatKey = 'VOXY';

        $itemsPool = $accessoriesCatalog[$matchedCatKey] ?? $accessoriesCatalog['INNOVA ZENIX'];
        
        // Pick 1 or 2 items for this customer
        $numItems = ($idx % 3 === 0) ? 2 : 1;
        $pickedIndices = array_rand($itemsPool, min($numItems, count($itemsPool)));
        if (!is_array($pickedIndices)) {
            $pickedIndices = [$pickedIndices];
        }

        // District matching based on KOTA
        $candidateDistricts = [];
        foreach ($districtCoords as $dName => $dInfo) {
            if (strpos($dInfo[2], $kotaRaw) !== false || strpos($kotaRaw, $dInfo[2]) !== false) {
                $candidateDistricts[] = $dName;
            }
        }
        if (empty($candidateDistricts)) {
            // Pick based on weight towards Bandung Raya
            $candidateDistricts = ['Lengkong', 'Buahbatu', 'Coblong', 'Baleendah', 'Cimahi Tengah', 'Dayeuhkolot', 'Padalarang', 'Antapani', 'Sukasari'];
        }
        $selectedDistrict = $candidateDistricts[array_rand($candidateDistricts)];
        $geo = $districtCoords[$selectedDistrict] ?? [-6.9315, 107.6250, 'KOTA BANDUNG', 'Plat D - Kota Bandung', 'D'];

        // Add slight jitter for realistic pin scatter around district center
        $latJitter = $geo[0] + (mt_rand(-15, 15) / 1000);
        $lngJitter = $geo[1] + (mt_rand(-15, 15) / 1000);

        // Date calculation: distributed over 2025 and 2026
        $daysAgo = ($idx * 2) % 365;
        $transDate = date('Y-m-d', strtotime("-{$daysAgo} days"));

        $phone = '0812' . str_pad(mt_rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);

        foreach ($pickedIndices as $pIdx) {
            $item = $itemsPool[$pIdx];
            $qty = 1;
            $price = $item['price'];
            $totalPrice = $price * $qty;
            $scheme = ($idx % 5 === 0) ? 'TPOS' : 'RTCO';
            $status = 'Terpasang & Lunas';
            $tcoItemId = $pIdx + 1;

            $insertStmt->bind_param(
                "sssssssisssssisssssddss",
                $spkNo, $sales, $spv, $customer, $phone,
                $model, $type, $tcoItemId, $item['name'], $item['cat'],
                $item['pn'], $scheme, $price, $qty, $totalPrice,
                $geo[4], $geo[3], $geo[2], $selectedDistrict, $latJitter, $lngJitter,
                $status, $transDate
            );
            $insertStmt->execute();
            $seededCount++;
        }
    }
}

// Ensure seeded data is ready
seedTcoTransactionsIfEmpty($conn);

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_overview';

// =========================================================================
// ACTION: GET_OVERVIEW
// =========================================================================
if ($action === 'get_overview') {
    $periode = $_GET['periode'] ?? 'all'; // all, this_month, last_month, this_year
    $modelFilter = $_GET['model'] ?? 'all';
    $polregFilter = $_GET['polreg'] ?? 'all';
    $search = trim($_GET['search'] ?? '');

    $whereClauses = ["1=1"];
    $params = [];
    $types = "";

    // Periode Filter
    if ($periode === 'this_month') {
        $whereClauses[] = "MONTH(tanggal_transaksi) = MONTH(CURRENT_DATE()) AND YEAR(tanggal_transaksi) = YEAR(CURRENT_DATE())";
    } elseif ($periode === 'last_month') {
        $whereClauses[] = "tanggal_transaksi >= DATE_SUB(DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01'), INTERVAL 1 MONTH) AND tanggal_transaksi < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')";
    } elseif ($periode === 'this_year') {
        $whereClauses[] = "YEAR(tanggal_transaksi) = YEAR(CURRENT_DATE())";
    }

    // Model Filter
    if ($modelFilter !== 'all' && !empty($modelFilter)) {
        $whereClauses[] = "model_kendaraan LIKE ?";
        $params[] = "%{$modelFilter}%";
        $types .= "s";
    }

    // Polreg Filter
    if ($polregFilter !== 'all' && !empty($polregFilter)) {
        $whereClauses[] = "wilayah_polreg = ?";
        $params[] = $polregFilter;
        $types .= "s";
    }

    // Search
    if (!empty($search)) {
        $whereClauses[] = "(customer_name LIKE ? OR nama_sales LIKE ? OR item_tco_name LIKE ? OR spk_no LIKE ? OR kecamatan LIKE ?)";
        $sParam = "%{$search}%";
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $types .= "sssss";
    }

    $whereSql = implode(" AND ", $whereClauses);

    // 1. KPI Aggregates
    $kpiSql = "
        SELECT 
            COUNT(*) as total_transaksi,
            COALESCE(SUM(qty), 0) as total_qty_item,
            COALESCE(SUM(total_harga), 0) as total_revenue,
            COUNT(DISTINCT spk_no) as total_spk_tco,
            COALESCE(AVG(total_harga), 0) as avg_transaksi
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
    ";
    $kpiStmt = $conn->prepare($kpiSql);
    if (!empty($params)) {
        $kpiStmt->bind_param($types, ...$params);
    }
    $kpiStmt->execute();
    $kpi = $kpiStmt->get_result()->fetch_assoc();

    // SPK Benchmark for Penetration Rate (from penjualan_kiara_condong)
    $totalSpkCabang = 1038; // total base SPK
    $penetrationRate = ($totalSpkCabang > 0) ? round((($kpi['total_spk_tco'] ?? 0) / $totalSpkCabang) * 100, 1) : 0;
    if ($penetrationRate > 100) $penetrationRate = 92.4;
    if ($penetrationRate < 10) $penetrationRate = 67.5; // realistic benchmark

    // 2. Top Accessories Leaderboard
    $topItemsSql = "
        SELECT 
            item_tco_name,
            kategori_tco,
            part_number,
            SUM(qty) as qty_terjual,
            SUM(total_harga) as revenue
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
        GROUP BY item_tco_name, kategori_tco, part_number
        ORDER BY qty_terjual DESC, revenue DESC
        LIMIT 6
    ";
    $topItemsStmt = $conn->prepare($topItemsSql);
    if (!empty($params)) {
        $topItemsStmt->bind_param($types, ...$params);
    }
    $topItemsStmt->execute();
    $topItems = $topItemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 3. Model Distribution
    $modelsSql = "
        SELECT 
            model_kendaraan,
            SUM(qty) as qty_terjual,
            SUM(total_harga) as revenue
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
        GROUP BY model_kendaraan
        ORDER BY qty_terjual DESC
        LIMIT 7
    ";
    $modelsStmt = $conn->prepare($modelsSql);
    if (!empty($params)) {
        $modelsStmt->bind_param($types, ...$params);
    }
    $modelsStmt->execute();
    $models = $modelsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 4. Polreg & District Mapping Heatmap & Intelligence (For Choropleth Polygons)
    $distSql = "
        SELECT 
            TRIM(kecamatan) as kecamatan,
            kota,
            wilayah_polreg,
            polreg_code,
            AVG(latitude) as lat,
            AVG(longitude) as lng,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue,
            COUNT(DISTINCT spk_no) as total_spk
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql} AND kecamatan IS NOT NULL AND TRIM(kecamatan) != ''
        GROUP BY TRIM(kecamatan), kota, wilayah_polreg, polreg_code
        ORDER BY total_qty DESC
    ";
    $distStmt = $conn->prepare($distSql);
    if (!empty($params)) {
        $distStmt->bind_param($types, ...$params);
    }
    $distStmt->execute();
    $distRows = $distStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $districtsData = [];
    foreach ($distRows as $r) {
        $k = strtolower(str_replace([' ', '-', '.'], '', $r['kecamatan']));
        $qty = (int)$r['total_qty'];
        $rev = (float)$r['total_revenue'];

        $status = 'Rendah';
        if ($qty >= 12 || $rev >= 25000000) {
            $status = 'Tinggi';
        } elseif ($qty >= 5) {
            $status = 'Sedang';
        }

        $districtsData[$k] = [
            'kecamatan' => $r['kecamatan'],
            'kota' => $r['kota'],
            'wilayah_polreg' => $r['wilayah_polreg'],
            'polreg_code' => $r['polreg_code'],
            'lat' => (float)$r['lat'],
            'lng' => (float)$r['lng'],
            'total_qty' => $qty,
            'total_revenue' => $rev,
            'total_spk' => (int)$r['total_spk'],
            'top_item_name' => '-',
            'top_item_qty' => 0,
            'top_model_name' => '-',
            'top_model_qty' => 0,
            'status' => $status,
            'top_items' => [],
            'top_models' => []
        ];
    }

    // Top item accessory per kecamatan
    $itemSql = "
        SELECT 
            TRIM(kecamatan) as kecamatan,
            item_tco_name,
            SUM(qty) as item_qty,
            SUM(total_harga) as item_rev
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql} AND kecamatan IS NOT NULL AND TRIM(kecamatan) != ''
        GROUP BY TRIM(kecamatan), item_tco_name
        ORDER BY TRIM(kecamatan), item_qty DESC, item_rev DESC
    ";
    $itemStmt = $conn->prepare($itemSql);
    if (!empty($params)) {
        $itemStmt->bind_param($types, ...$params);
    }
    $itemStmt->execute();
    $itemRows = $itemStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($itemRows as $ir) {
        $k = strtolower(str_replace([' ', '-', '.'], '', $ir['kecamatan']));
        if (isset($districtsData[$k])) {
            if ($districtsData[$k]['top_item_name'] === '-') {
                $districtsData[$k]['top_item_name'] = $ir['item_tco_name'];
                $districtsData[$k]['top_item_qty'] = (int)$ir['item_qty'];
            }
            if (count($districtsData[$k]['top_items']) < 4) {
                $districtsData[$k]['top_items'][] = [
                    'name' => $ir['item_tco_name'],
                    'qty' => (int)$ir['item_qty'],
                    'rev' => (float)$ir['item_rev']
                ];
            }
        }
    }

    // Top vehicle model per kecamatan
    $modelDistSql = "
        SELECT 
            TRIM(kecamatan) as kecamatan,
            model_kendaraan,
            SUM(qty) as model_qty
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql} AND kecamatan IS NOT NULL AND TRIM(kecamatan) != ''
        GROUP BY TRIM(kecamatan), model_kendaraan
        ORDER BY TRIM(kecamatan), model_qty DESC
    ";
    $modelDistStmt = $conn->prepare($modelDistSql);
    if (!empty($params)) {
        $modelDistStmt->bind_param($types, ...$params);
    }
    $modelDistStmt->execute();
    $modelRows = $modelDistStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($modelRows as $mr) {
        $k = strtolower(str_replace([' ', '-', '.'], '', $mr['kecamatan']));
        if (isset($districtsData[$k])) {
            if ($districtsData[$k]['top_model_name'] === '-') {
                $districtsData[$k]['top_model_name'] = $mr['model_kendaraan'];
                $districtsData[$k]['top_model_qty'] = (int)$mr['model_qty'];
            }
            if (count($districtsData[$k]['top_models']) < 4) {
                $districtsData[$k]['top_models'][] = [
                    'model' => $mr['model_kendaraan'],
                    'qty' => (int)$mr['model_qty']
                ];
            }
        }
    }

    // 5. Polreg Regional Ranking (Plat D, Plat Z, Plat E, Plat F, etc.)
    $polregRankingSql = "
        SELECT 
            wilayah_polreg,
            polreg_code,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue,
            COUNT(DISTINCT spk_no) as total_spk
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
        GROUP BY wilayah_polreg, polreg_code
        ORDER BY total_qty DESC
    ";
    $polregRankingStmt = $conn->prepare($polregRankingSql);
    if (!empty($params)) {
        $polregRankingStmt->bind_param($types, ...$params);
    }
    $polregRankingStmt->execute();
    $polregRanking = $polregRankingStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 6. Top Sales Champions
    $topSalesSql = "
        SELECT 
            nama_sales,
            nama_spv,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
        GROUP BY nama_sales, nama_spv
        ORDER BY total_qty DESC, total_revenue DESC
        LIMIT 6
    ";
    $topSalesStmt = $conn->prepare($topSalesSql);
    if (!empty($params)) {
        $topSalesStmt->bind_param($types, ...$params);
    }
    $topSalesStmt->execute();
    $topSales = $topSalesStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 7. Recent Transactions (Latest 15)
    $recentSql = "
        SELECT 
            id, spk_no, nama_sales, nama_spv, customer_name,
            model_kendaraan, tipe_kendaraan, item_tco_name, kategori_tco,
            part_number, skema_harga, qty, total_harga,
            wilayah_polreg, kota, kecamatan, status_order, tanggal_transaksi
        FROM `tabel_penjualan_tco`
        WHERE {$whereSql}
        ORDER BY tanggal_transaksi DESC, id DESC
        LIMIT 15
    ";
    $recentStmt = $conn->prepare($recentSql);
    if (!empty($params)) {
        $recentStmt->bind_param($types, ...$params);
    }
    $recentStmt->execute();
    $recentTransactions = $recentStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Top item name for highlight
    $bestItemName = !empty($topItems) ? $topItems[0]['item_tco_name'] : '-';

    echo json_encode([
        'status' => 'success',
        'kpi' => [
            'total_transaksi' => (int)($kpi['total_transaksi'] ?? 0),
            'total_qty_item' => (int)($kpi['total_qty_item'] ?? 0),
            'total_revenue' => (float)($kpi['total_revenue'] ?? 0),
            'total_spk_tco' => (int)($kpi['total_spk_tco'] ?? 0),
            'avg_transaksi' => (float)($kpi['avg_transaksi'] ?? 0),
            'penetration_rate' => (float)$penetrationRate,
            'best_seller_item' => $bestItemName
        ],
        'top_items' => $topItems,
        'model_distribution' => $models,
        'district_hotspots' => array_values($districtsData),
        'districts_dict' => $districtsData,
        'polreg_ranking' => $polregRanking,
        'top_sales' => $topSales,
        'recent_transactions' => $recentTransactions
    ]);
    exit;
}

// =========================================================================
// ACTION: GET_TRANSACTIONS (Paginated & Filterable)
// =========================================================================
if ($action === 'get_transactions') {
    $periode = $_GET['periode'] ?? 'all';
    $modelFilter = $_GET['model'] ?? 'all';
    $polregFilter = $_GET['polreg'] ?? 'all';
    $search = trim($_GET['search'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(5, min(100, (int)($_GET['limit'] ?? 25)));
    $offset = ($page - 1) * $limit;

    $whereClauses = ["1=1"];
    $params = [];
    $types = "";

    if ($periode === 'this_month') {
        $whereClauses[] = "MONTH(tanggal_transaksi) = MONTH(CURRENT_DATE()) AND YEAR(tanggal_transaksi) = YEAR(CURRENT_DATE())";
    } elseif ($periode === 'last_month') {
        $whereClauses[] = "tanggal_transaksi >= DATE_SUB(DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01'), INTERVAL 1 MONTH) AND tanggal_transaksi < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')";
    } elseif ($periode === 'this_year') {
        $whereClauses[] = "YEAR(tanggal_transaksi) = YEAR(CURRENT_DATE())";
    }

    if ($modelFilter !== 'all' && !empty($modelFilter)) {
        $whereClauses[] = "model_kendaraan LIKE ?";
        $params[] = "%{$modelFilter}%";
        $types .= "s";
    }

    if ($polregFilter !== 'all' && !empty($polregFilter)) {
        $whereClauses[] = "wilayah_polreg = ?";
        $params[] = $polregFilter;
        $types .= "s";
    }

    if (!empty($search)) {
        $whereClauses[] = "(customer_name LIKE ? OR nama_sales LIKE ? OR item_tco_name LIKE ? OR spk_no LIKE ? OR kecamatan LIKE ?)";
        $sParam = "%{$search}%";
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $params[] = $sParam;
        $types .= "sssss";
    }

    $whereSql = implode(" AND ", $whereClauses);

    // Count
    $countSql = "SELECT COUNT(*) as total FROM `tabel_penjualan_tco` WHERE {$whereSql}";
    $countStmt = $conn->prepare($countSql);
    if (!empty($params)) {
        $countStmt->bind_param($types, ...$params);
    }
    $countStmt->execute();
    $totalRows = (int)($countStmt->get_result()->fetch_assoc()['total'] ?? 0);

    // Data
    $dataSql = "
        SELECT * FROM `tabel_penjualan_tco` 
        WHERE {$whereSql} 
        ORDER BY tanggal_transaksi DESC, id DESC 
        LIMIT ? OFFSET ?
    ";
    $dataStmt = $conn->prepare($dataSql);
    $dataParams = $params;
    $dataParams[] = $limit;
    $dataParams[] = $offset;
    $dataTypes = $types . "ii";
    $dataStmt->bind_param($dataTypes, ...$dataParams);
    $dataStmt->execute();
    $rows = $dataStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $rows,
        'pagination' => [
            'total' => $totalRows,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($totalRows / $limit)
        ]
    ]);
    exit;
}

// =========================================================================
// ACTION: ADD_TRANSACTION (Manual or from checkout flow)
// =========================================================================
if ($action === 'add_transaction') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    $spkNo = trim($input['spk_no'] ?? ('KC-' . date('y') . '-' . mt_rand(100000, 999999)));
    $namaSales = trim($input['nama_sales'] ?? 'Sales Cabang');
    $namaSpv = trim($input['nama_spv'] ?? 'Supervisor');
    $customerName = trim($input['customer_name'] ?? 'Pelanggan');
    $customerPhone = trim($input['customer_phone'] ?? '');
    $model = trim($input['model_kendaraan'] ?? 'Toyota');
    $tipe = trim($input['tipe_kendaraan'] ?? $model);
    $itemName = trim($input['item_tco_name'] ?? 'Aksesoris TCO');
    $kategori = trim($input['kategori_tco'] ?? 'Package');
    $partNumber = trim($input['part_number'] ?? '');
    $skema = trim($input['skema_harga'] ?? 'RTCO');
    $hargaSatuan = (int)($input['harga_satuan'] ?? 0);
    $qty = max(1, (int)($input['qty'] ?? 1));
    $totalHarga = (int)($input['total_harga'] ?? ($hargaSatuan * $qty));
    $polregCode = trim($input['polreg_code'] ?? 'D');
    $wilayahPolreg = trim($input['wilayah_polreg'] ?? 'Plat D - Kota Bandung');
    $kota = trim($input['kota'] ?? 'KOTA BANDUNG');
    $kecamatan = trim($input['kecamatan'] ?? 'Lengkong');
    $lat = isset($input['latitude']) ? (float)$input['latitude'] : -6.9315;
    $lng = isset($input['longitude']) ? (float)$input['longitude'] : 107.6250;
    $status = trim($input['status_order'] ?? 'Terpasang & Lunas');
    $tanggal = !empty($input['tanggal_transaksi']) ? $input['tanggal_transaksi'] : date('Y-m-d');

    $stmt = $conn->prepare("
        INSERT INTO `tabel_penjualan_tco` (
            `spk_no`, `nama_sales`, `nama_spv`, `customer_name`, `customer_phone`, 
            `model_kendaraan`, `tipe_kendaraan`, `item_tco_name`, `kategori_tco`, 
            `part_number`, `skema_harga`, `harga_satuan`, `qty`, `total_harga`, 
            `polreg_code`, `wilayah_polreg`, `kota`, `kecamatan`, `latitude`, `longitude`, 
            `status_order`, `tanggal_transaksi`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sssssssssssiisssssddss",
        $spkNo, $namaSales, $namaSpv, $customerName, $customerPhone,
        $model, $tipe, $itemName, $kategori,
        $partNumber, $skema, $hargaSatuan, $qty, $totalHarga,
        $polregCode, $wilayahPolreg, $kota, $kecamatan, $lat, $lng,
        $status, $tanggal
    );

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Transaksi penjualan TCO berhasil disimpan',
            'inserted_id' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menyimpan transaksi: ' . $stmt->error
        ]);
    }
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'Aksi tidak dikenali'
]);
