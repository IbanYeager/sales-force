<?php
// api/api_penjualan_merchandise.php - Backend API for Merchandise Sales Monitoring
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
CREATE TABLE IF NOT EXISTS `tabel_penjualan_merchandise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_transaksi` varchar(50) NOT NULL,
  `spk_no` varchar(50) DEFAULT NULL,
  `tanggal_transaksi` date NOT NULL,
  `nama_customer` varchar(150) NOT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `nama_sales` varchar(100) NOT NULL,
  `nama_spv` varchar(100) NOT NULL,
  `merchandise_id` int(11) DEFAULT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `kategori` varchar(50) DEFAULT 'Kaos',
  `part_number` varchar(100) DEFAULT NULL,
  `size` varchar(50) DEFAULT 'All Size',
  `harga_satuan` bigint(20) NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 1,
  `total_harga` bigint(20) NOT NULL DEFAULT 0,
  `metode_pembayaran` varchar(50) DEFAULT 'Cash / Transfer',
  `status` varchar(50) DEFAULT 'Selesai',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nomor` (`nomor_transaksi`),
  KEY `idx_spk` (`spk_no`),
  KEY `idx_sales` (`nama_sales`),
  KEY `idx_spv` (`nama_spv`),
  KEY `idx_tanggal` (`tanggal_transaksi`),
  KEY `idx_kategori` (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";
$conn->query($createTableSql);

// Helper function to categorize merchandise by name
function categorizeMerchandise($name) {
    $n = strtolower($name);
    if (strpos($n, 'jacket') !== false || strpos($n, 'jaket') !== false || strpos($n, 'hoodie') !== false || strpos($n, 'sweater') !== false || strpos($n, 'vest') !== false) {
        return 'Jaket & Hoodie';
    }
    if (strpos($n, 'polo') !== false) {
        return 'Polo Shirt';
    }
    if (strpos($n, 't-shirt') !== false || strpos($n, 'tshirt') !== false || strpos($n, 'kaos') !== false || strpos($n, 'shirt') !== false) {
        return 'T-Shirt';
    }
    if (strpos($n, 'topi') !== false || strpos($n, 'cap') !== false || strpos($n, 'hat') !== false) {
        return 'Topi';
    }
    if (strpos($n, 'tumbler') !== false || strpos($n, 'thermos') !== false || strpos($n, 'mug') !== false || strpos($n, 'botol') !== false) {
        return 'Tumbler & Drinkware';
    }
    if (strpos($n, 'payung') !== false || strpos($n, 'umbrella') !== false) {
        return 'Payung';
    }
    if (strpos($n, 'keychain') !== false || strpos($n, 'key case') !== false || strpos($n, 'keycase') !== false || strpos($n, 'key fob') !== false || strpos($n, 'keystrap') !== false || strpos($n, 'key strap') !== false || strpos($n, 'lanyard') !== false) {
        return 'Gantungan Kunci & Lanyard';
    }
    if (strpos($n, 'tote') !== false || strpos($n, 'tas') !== false || strpos($n, 'bag') !== false) {
        return 'Tas & Tote Bag';
    }
    return 'Aksesoris & Lainnya';
}

// 2. Auto-seed realistic merchandise sales if table is empty
function seedMerchandiseTransactionsIfEmpty($conn) {
    $checkRes = $conn->query("SELECT COUNT(*) as c FROM `tabel_penjualan_merchandise`");
    if ($checkRes) {
        $row = $checkRes->fetch_assoc();
        if ((int)$row['c'] > 0) {
            return; // Already populated
        }
    }

    // Fetch available merchandise from merchandise_parts
    $partsRes = $conn->query("SELECT id, name, size, part_number, retail_price, image FROM `merchandise_parts` ORDER BY id ASC");
    $merchList = [];
    if ($partsRes) {
        while ($p = $partsRes->fetch_assoc()) {
            $price = (int)preg_replace('/[^0-9]/', '', $p['retail_price']);
            if ($price <= 0) $price = 250000;
            $merchList[] = [
                'id' => (int)$p['id'],
                'name' => $p['name'],
                'size' => !empty($p['size']) ? $p['size'] : 'All Size',
                'part_number' => $p['part_number'],
                'price' => $price,
                'category' => categorizeMerchandise($p['name']),
                'image' => $p['image']
            ];
        }
    }

    // Fallback if merchandise_parts is empty
    if (empty($merchList)) {
        $merchList = [
            ['id' => 1, 'name' => 'Gazoo Casual Light Jacket', 'size' => 'L', 'part_number' => '1034HTAG22', 'price' => 599000, 'category' => 'Jaket & Hoodie', 'image' => ''],
            ['id' => 2, 'name' => 'Gazoo T-Shirt Type 3 (Black)', 'size' => 'L', 'part_number' => '1021BTAG20', 'price' => 249000, 'category' => 'T-Shirt', 'image' => ''],
            ['id' => 3, 'name' => 'GR Polo Dry Fit Black (New)', 'size' => 'XL', 'part_number' => '1018GTAG23', 'price' => 449000, 'category' => 'Polo Shirt', 'image' => ''],
            ['id' => 4, 'name' => 'GR Cap Sporty Black Edition', 'size' => 'All Size', 'part_number' => '0834TAG21', 'price' => 279000, 'category' => 'Topi', 'image' => ''],
            ['id' => 5, 'name' => 'Gazoo Racing Stainless Tumbler', 'size' => '500ml', 'part_number' => '0921TAG22', 'price' => 329000, 'category' => 'Tumbler & Drinkware', 'image' => ''],
            ['id' => 6, 'name' => 'Toyota GR Umbrella Premium', 'size' => 'Large', 'part_number' => '0712TAG20', 'price' => 289000, 'category' => 'Payung', 'image' => ''],
            ['id' => 7, 'name' => 'GR Metal Key Ring & Leather Strap', 'size' => 'Standard', 'part_number' => '0543TAG21', 'price' => 165000, 'category' => 'Gantungan Kunci & Lanyard', 'image' => '']
        ];
    }

    // Branch SPVs (3 SPV Resmi Cabang Kiara Condong) and their Sales Consultants
    $teamStructure = [
        'FERYANTO' => [
            'REGYAWAN KURNIA', 'ARIEF SETYAWAN', 'REZA PAHLEVI PUTRA PRIBADI', 
            'YANI ANDRIYANI', 'DENO', 'ERICK JANUAR LISAPALY', 
            'NENG IDA WIDIANINGSIH', 'DADI HERYADI', 'SANDY PURNAMA', 'DADAN DARMADI',
            'DENI ALFIAN', 'TOMMY KUSUMA DASUKI'
        ],
        'ALVIN' => [
            'AHMAD MAULANA', 'INDAH PITALOKA', 'RIZKI RISMAWAN', 
            'TOPIK HIDAYAT', 'HILMAN PERMANA', 'DONNY KURNIAWAN', 
            'MUHAMMAD FADIL FAHMI', 'DADI SOBARI', 'YENI', 'LUVITA DAMAYANTI',
            'CECEP SOLEHUDIN', 'KURNIA YOGA PRATAMA'
        ],
        'MUHAMMAD CAISARIVA' => [
            'RIDWAN DWI AZHARI', 'DERI NURSANDI', 'SISKA TRISTIANI', 
            'FAUZAN AZINA', 'YOGA PRATAMA', 'PUTRI RAMADHANI', 
            'GIYONO', 'ROBBY NUGRAHA', 'JULI', 'TANARO MUHAR BUYUNG',
            'AGUS SUPARMAN', 'RIANA ROSIANTI'
        ]
    ];

    $spvKeys = array_keys($teamStructure);

    $customerPool = [
        ['name' => 'Bpk. Hendra Gunawan', 'phone' => '081223456789'],
        ['name' => 'Ibu Rina Kartika', 'phone' => '081398765432'],
        ['name' => 'Bpk. Ahmad Fauzi', 'phone' => '082114567890'],
        ['name' => 'PT. Mega Pratama Logistik', 'phone' => '081122334455'],
        ['name' => 'Ibu Siti Nurhaliza', 'phone' => '085712345678'],
        ['name' => 'Bpk. Dedi Supriadi', 'phone' => '081298712345'],
        ['name' => 'Bpk. Ronald Tambunan', 'phone' => '081345678912'],
        ['name' => 'Ibu Devi Anggraeni', 'phone' => '081234567811'],
        ['name' => 'CV. Jaya Abadi Mandiri', 'phone' => '082212345670'],
        ['name' => 'Bpk. Firman Hidayat', 'phone' => '081908765432'],
        ['name' => 'Bpk. Agus Setiawan', 'phone' => '081287654321'],
        ['name' => 'Ibu Maya Lestari', 'phone' => '085698712345'],
        ['name' => 'Bpk. Ricky Kurniawan', 'phone' => '081312345699'],
        ['name' => 'PT. Sumber Rezeki Sentosa', 'phone' => '081198765400'],
        ['name' => 'Bpk. Tri Wahyudi', 'phone' => '082123456789'],
        ['name' => 'Ibu Cynthia Dewi', 'phone' => '081299887766'],
        ['name' => 'Bpk. Ari Wibowo', 'phone' => '081388776655'],
        ['name' => 'Ibu Ratna Sari', 'phone' => '085812345678'],
        ['name' => 'Bpk. Sandy Pratama', 'phone' => '081245678901'],
        ['name' => 'Bpk. Yudi Hermawan', 'phone' => '082165432198'],
        ['name' => 'Ibu Anita Rahmawati', 'phone' => '081376543210'],
        ['name' => 'Bpk. Bambang Pamungkas', 'phone' => '081234098765'],
        ['name' => 'CV. Berkah Bintang Timur', 'phone' => '081134567890'],
        ['name' => 'Bpk. Gilang Ramadhan', 'phone' => '085723456789'],
        ['name' => 'Ibu Linda Susanti', 'phone' => '081345098765']
    ];

    $paymentMethods = [
        'Cash / Tunai',
        'Transfer Bank BCA',
        'Transfer Bank Mandiri',
        'Bonus SPK Kendaraan',
        'Hadiah Delivery Unit',
        'Voucher Promo Pameran'
    ];

    $statuses = ['Selesai', 'Selesai', 'Selesai', 'Selesai', 'Diproses', 'Pending'];

    $insertStmt = $conn->prepare("
        INSERT INTO `tabel_penjualan_merchandise` (
            `nomor_transaksi`, `spk_no`, `tanggal_transaksi`, `nama_customer`, `customer_phone`,
            `nama_sales`, `nama_spv`, `merchandise_id`, `nama_barang`, `kategori`,
            `part_number`, `size`, `harga_satuan`, `qty`, `total_harga`,
            `metode_pembayaran`, `status`, `keterangan`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $transCount = 94; // Total realistic seed transactions
    $startDate = strtotime('-75 days');
    $endDate = time();

    for ($i = 1; $i <= $transCount; $i++) {
        // Random date within last 75 days
        $randomTimestamp = mt_rand($startDate, $endDate);
        $tgl = date('Y-m-d', $randomTimestamp);
        $yearMonth = date('Ym', $randomTimestamp);
        $notaNo = 'MCH-' . $yearMonth . '-' . str_pad($i, 4, '0', STR_PAD_LEFT);

        // Pick SPV & Sales
        $spv = $spvKeys[mt_rand(0, count($spvKeys) - 1)];
        $salesList = $teamStructure[$spv];
        $sales = $salesList[mt_rand(0, count($salesList) - 1)];

        // Pick Customer
        $cust = $customerPool[mt_rand(0, count($customerPool) - 1)];

        // Pick Merchandise item
        $merch = $merchList[mt_rand(0, count($merchList) - 1)];
        $qty = (mt_rand(1, 100) > 85) ? mt_rand(2, 4) : 1;
        $totalPrice = $merch['price'] * $qty;

        // Payment Method
        $payment = $paymentMethods[mt_rand(0, count($paymentMethods) - 1)];
        $spkNo = (strpos($payment, 'SPK') !== false || strpos($payment, 'Delivery') !== false || mt_rand(1, 10) > 4) 
                 ? ('TG-26-' . str_pad(mt_rand(1000, 9999), 6, '0', STR_PAD_LEFT)) 
                 : null;

        $status = $statuses[mt_rand(0, count($statuses) - 1)];
        
        $keterangan = ($spkNo) ? "Bundling delivery SPK unit {$spkNo}" : "Pembelian retail langsung di counter showroom";
        if (strpos($payment, 'Voucher') !== false) {
            $keterangan = "Redeem voucher loyalty customer Tunas Toyota";
        }

        $insertStmt->bind_param(
            "sssssssissssiiisss",
            $notaNo,
            $spkNo,
            $tgl,
            $cust['name'],
            $cust['phone'],
            $sales,
            $spv,
            $merch['id'],
            $merch['name'],
            $merch['category'],
            $merch['part_number'],
            $merch['size'],
            $merch['price'],
            $qty,
            $totalPrice,
            $payment,
            $status,
            $keterangan
        );
        $insertStmt->execute();
    }
}

seedMerchandiseTransactionsIfEmpty($conn);

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_overview';

// =========================================================================
// ACTION: GET_OVERVIEW
// =========================================================================
if ($action === 'get_overview') {
    $periode = $_GET['periode'] ?? 'all'; // all, this_month, last_month, this_year
    $spvFilter = $_GET['spv'] ?? 'all';
    $salesFilter = $_GET['sales'] ?? 'all';
    $kategoriFilter = $_GET['kategori'] ?? 'all';
    $metodeFilter = $_GET['metode'] ?? 'all';
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

    // SPV Filter
    if ($spvFilter !== 'all' && !empty($spvFilter)) {
        $whereClauses[] = "nama_spv = ?";
        $params[] = $spvFilter;
        $types .= "s";
    }

    // Sales Filter
    if ($salesFilter !== 'all' && !empty($salesFilter)) {
        $whereClauses[] = "nama_sales = ?";
        $params[] = $salesFilter;
        $types .= "s";
    }

    // Kategori Filter
    if ($kategoriFilter !== 'all' && !empty($kategoriFilter)) {
        $whereClauses[] = "kategori = ?";
        $params[] = $kategoriFilter;
        $types .= "s";
    }

    // Metode Pembayaran Filter
    if ($metodeFilter !== 'all' && !empty($metodeFilter)) {
        $whereClauses[] = "metode_pembayaran LIKE ?";
        $params[] = "%{$metodeFilter}%";
        $types .= "s";
    }

    // Search
    if (!empty($search)) {
        $whereClauses[] = "(nomor_transaksi LIKE ? OR spk_no LIKE ? OR nama_customer LIKE ? OR nama_sales LIKE ? OR nama_barang LIKE ? OR part_number LIKE ?)";
        $sParam = "%{$search}%";
        for ($s = 0; $s < 6; $s++) {
            $params[] = $sParam;
            $types .= "s";
        }
    }

    $whereSql = implode(" AND ", $whereClauses);

    // 1. KPI Aggregates
    $kpiSql = "
        SELECT 
            COUNT(*) as total_transaksi,
            COALESCE(SUM(qty), 0) as total_qty,
            COALESCE(SUM(total_harga), 0) as total_revenue,
            COALESCE(AVG(total_harga), 0) as avg_transaksi,
            COALESCE(SUM(CASE WHEN metode_pembayaran LIKE '%Cash%' OR metode_pembayaran LIKE '%Transfer%' THEN total_harga ELSE 0 END), 0) as revenue_retail,
            COALESCE(SUM(CASE WHEN metode_pembayaran LIKE '%Bonus%' OR metode_pembayaran LIKE '%Delivery%' OR metode_pembayaran LIKE '%Voucher%' THEN qty ELSE 0 END), 0) as qty_bonus_spk
        FROM `tabel_penjualan_merchandise`
        WHERE {$whereSql}
    ";
    $kpiStmt = $conn->prepare($kpiSql);
    if (!empty($params)) {
        $kpiStmt->bind_param($types, ...$params);
    }
    $kpiStmt->execute();
    $kpi = $kpiStmt->get_result()->fetch_assoc();

    // 2. Top Merchandise Leaderboard
    $topItemsSql = "
        SELECT 
            m.nama_barang,
            m.kategori,
            m.part_number,
            m.size,
            SUM(m.qty) as qty_terjual,
            SUM(m.total_harga) as revenue,
            p.image as thumbnail,
            p.stock_cabang,
            p.stock_tam
        FROM `tabel_penjualan_merchandise` m
        LEFT JOIN `merchandise_parts` p ON m.merchandise_id = p.id
        WHERE {$whereSql}
        GROUP BY m.nama_barang, m.kategori, m.part_number, m.size, p.image, p.stock_cabang, p.stock_tam
        ORDER BY qty_terjual DESC, revenue DESC
        LIMIT 6
    ";
    $topItemsStmt = $conn->prepare($topItemsSql);
    if (!empty($params)) {
        $topItemsStmt->bind_param($types, ...$params);
    }
    $topItemsStmt->execute();
    $topItems = $topItemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 3. SPV Team Breakdown
    $spvSql = "
        SELECT 
            nama_spv,
            COUNT(*) as total_transaksi,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue
        FROM `tabel_penjualan_merchandise`
        WHERE {$whereSql} AND nama_spv IS NOT NULL AND nama_spv != ''
        GROUP BY nama_spv
        ORDER BY total_revenue DESC
    ";
    $spvStmt = $conn->prepare($spvSql);
    if (!empty($params)) {
        $spvStmt->bind_param($types, ...$params);
    }
    $spvStmt->execute();
    $spvBreakdown = $spvStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 4. Kategori Merchandise Breakdown
    $catSql = "
        SELECT 
            kategori,
            COUNT(*) as total_transaksi,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue
        FROM `tabel_penjualan_merchandise`
        WHERE {$whereSql}
        GROUP BY kategori
        ORDER BY total_revenue DESC
    ";
    $catStmt = $conn->prepare($catSql);
    if (!empty($params)) {
        $catStmt->bind_param($types, ...$params);
    }
    $catStmt->execute();
    $catBreakdown = $catStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 5. Top Wiraniaga Leaderboard
    $salesSql = "
        SELECT 
            nama_sales,
            nama_spv,
            COUNT(*) as total_transaksi,
            SUM(qty) as total_qty,
            SUM(total_harga) as total_revenue
        FROM `tabel_penjualan_merchandise`
        WHERE {$whereSql}
        GROUP BY nama_sales, nama_spv
        ORDER BY total_revenue DESC, total_qty DESC
        LIMIT 8
    ";
    $salesStmt = $conn->prepare($salesSql);
    if (!empty($params)) {
        $salesStmt->bind_param($types, ...$params);
    }
    $salesStmt->execute();
    $salesLeaderboard = $salesStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 6. Metadata Filters (Available SPVs, Categories)
    $allSpvsRes = $conn->query("SELECT DISTINCT nama_spv FROM `tabel_penjualan_merchandise` WHERE nama_spv IS NOT NULL AND nama_spv != '' ORDER BY nama_spv ASC");
    $availableSpvs = [];
    while ($r = $allSpvsRes->fetch_assoc()) {
        $availableSpvs[] = $r['nama_spv'];
    }

    $allCatsRes = $conn->query("SELECT DISTINCT kategori FROM `tabel_penjualan_merchandise` WHERE kategori IS NOT NULL AND kategori != '' ORDER BY kategori ASC");
    $availableCategories = [];
    while ($r = $allCatsRes->fetch_assoc()) {
        $availableCategories[] = $r['kategori'];
    }

    echo json_encode([
        'status' => 'success',
        'kpi' => [
            'total_transaksi' => (int)$kpi['total_transaksi'],
            'total_qty' => (int)$kpi['total_qty'],
            'total_revenue' => (float)$kpi['total_revenue'],
            'avg_transaksi' => (float)$kpi['avg_transaksi'],
            'revenue_retail' => (float)$kpi['revenue_retail'],
            'qty_bonus_spk' => (int)$kpi['qty_bonus_spk']
        ],
        'top_items' => $topItems,
        'spv_breakdown' => $spvBreakdown,
        'category_breakdown' => $catBreakdown,
        'sales_leaderboard' => $salesLeaderboard,
        'filters' => [
            'spvs' => $availableSpvs,
            'categories' => $availableCategories
        ]
    ]);
    exit;
}

// =========================================================================
// ACTION: GET_TRANSACTIONS (Paginated Data Table)
// =========================================================================
if ($action === 'get_transactions') {
    $periode = $_GET['periode'] ?? 'all';
    $spvFilter = $_GET['spv'] ?? 'all';
    $salesFilter = $_GET['sales'] ?? 'all';
    $kategoriFilter = $_GET['kategori'] ?? 'all';
    $metodeFilter = $_GET['metode'] ?? 'all';
    $search = trim($_GET['search'] ?? '');

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(5, min(100, (int)($_GET['limit'] ?? 15)));
    $offset = ($page - 1) * $limit;

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

    if ($spvFilter !== 'all' && !empty($spvFilter)) {
        $whereClauses[] = "nama_spv = ?";
        $params[] = $spvFilter;
        $types .= "s";
    }

    if ($salesFilter !== 'all' && !empty($salesFilter)) {
        $whereClauses[] = "nama_sales = ?";
        $params[] = $salesFilter;
        $types .= "s";
    }

    if ($kategoriFilter !== 'all' && !empty($kategoriFilter)) {
        $whereClauses[] = "kategori = ?";
        $params[] = $kategoriFilter;
        $types .= "s";
    }

    if ($metodeFilter !== 'all' && !empty($metodeFilter)) {
        $whereClauses[] = "metode_pembayaran LIKE ?";
        $params[] = "%{$metodeFilter}%";
        $types .= "s";
    }

    if (!empty($search)) {
        $whereClauses[] = "(nomor_transaksi LIKE ? OR spk_no LIKE ? OR nama_customer LIKE ? OR nama_sales LIKE ? OR nama_barang LIKE ? OR part_number LIKE ?)";
        $sParam = "%{$search}%";
        for ($s = 0; $s < 6; $s++) {
            $params[] = $sParam;
            $types .= "s";
        }
    }

    $whereSql = implode(" AND ", $whereClauses);

    // Count Total
    $countSql = "SELECT COUNT(*) as c FROM `tabel_penjualan_merchandise` WHERE {$whereSql}";
    $countStmt = $conn->prepare($countSql);
    if (!empty($params)) {
        $countStmt->bind_param($types, ...$params);
    }
    $countStmt->execute();
    $totalRows = (int)$countStmt->get_result()->fetch_assoc()['c'];

    // Select Rows
    $dataSql = "
        SELECT 
            m.*,
            p.image as thumbnail,
            p.stock_cabang,
            p.stock_tam
        FROM `tabel_penjualan_merchandise` m
        LEFT JOIN `merchandise_parts` p ON m.merchandise_id = p.id
        WHERE {$whereSql}
        ORDER BY m.tanggal_transaksi DESC, m.id DESC
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
// ACTION: GET_DROPDOWNS (For Input Modal)
// =========================================================================
if ($action === 'get_dropdowns') {
    // 1. Merchandise items
    $merchRes = $conn->query("SELECT id, name, size, part_number, retail_price, stock_cabang, image FROM `merchandise_parts` ORDER BY name ASC");
    $merchItems = [];
    while ($m = $merchRes->fetch_assoc()) {
        $m['retail_price_num'] = (int)preg_replace('/[^0-9]/', '', $m['retail_price']);
        $merchItems[] = $m;
    }

    // 2. Sales & SPV list from sales_accounts (Mapped to 3 SPVs Kircon)
    $salesList = [];
    $salesRes = $conn->query("SELECT nama_lengkap, nama_spv FROM sales_accounts WHERE (is_active = 1 OR is_active IS NULL) AND nama_lengkap != '' ORDER BY nama_lengkap ASC");
    if ($salesRes && $salesRes->num_rows > 0) {
        while ($s = $salesRes->fetch_assoc()) {
            $spv = $s['nama_spv'] ?? '';
            if (stripos($spv, 'Ryan') !== false || stripos($spv, 'Feryanto') !== false) {
                $spv = 'FERYANTO';
            } elseif (stripos($spv, 'Alvin') !== false) {
                $spv = 'ALVIN';
            } elseif (stripos($spv, 'Riva') !== false || stripos($spv, 'Caisariva') !== false) {
                $spv = 'MUHAMMAD CAISARIVA';
            } else {
                $spv = 'FERYANTO';
            }
            $salesList[] = [
                'nama_sales' => $s['nama_lengkap'],
                'nama_spv' => $spv
            ];
        }
    }

    echo json_encode([
        'status' => 'success',
        'merchandise' => $merchItems,
        'sales' => $salesList
    ]);
    exit;
}

// =========================================================================
// ACTION: ADD_TRANSACTION
// =========================================================================
if ($action === 'add_transaction') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    $nomorTransaksi = 'MCH-' . date('Ym') . '-' . str_pad(mt_rand(1000, 9999), 4, '0', STR_PAD_LEFT);
    $spkNo = !empty($input['spk_no']) ? trim($input['spk_no']) : null;
    $tanggal = !empty($input['tanggal_transaksi']) ? $input['tanggal_transaksi'] : date('Y-m-d');
    $customerName = trim($input['nama_customer'] ?? 'Pelanggan');
    $customerPhone = trim($input['customer_phone'] ?? '');
    $namaSales = trim($input['nama_sales'] ?? 'Sales Cabang');
    $namaSpv = trim($input['nama_spv'] ?? 'Supervisor');
    $merchandiseId = !empty($input['merchandise_id']) ? (int)$input['merchandise_id'] : null;
    $namaBarang = trim($input['nama_barang'] ?? 'Merchandise Toyota');
    $kategori = !empty($input['kategori']) ? trim($input['kategori']) : categorizeMerchandise($namaBarang);
    $partNumber = trim($input['part_number'] ?? '');
    $size = trim($input['size'] ?? 'All Size');
    $hargaSatuan = (int)($input['harga_satuan'] ?? 0);
    $qty = max(1, (int)($input['qty'] ?? 1));
    $totalHarga = (int)($input['total_harga'] ?? ($hargaSatuan * $qty));
    $metode = trim($input['metode_pembayaran'] ?? 'Cash / Transfer');
    $status = trim($input['status'] ?? 'Selesai');
    $keterangan = trim($input['keterangan'] ?? '');

    $stmt = $conn->prepare("
        INSERT INTO `tabel_penjualan_merchandise` (
            `nomor_transaksi`, `spk_no`, `tanggal_transaksi`, `nama_customer`, `customer_phone`,
            `nama_sales`, `nama_spv`, `merchandise_id`, `nama_barang`, `kategori`,
            `part_number`, `size`, `harga_satuan`, `qty`, `total_harga`,
            `metode_pembayaran`, `status`, `keterangan`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sssssssissssiiisss",
        $nomorTransaksi, $spkNo, $tanggal, $customerName, $customerPhone,
        $namaSales, $namaSpv, $merchandiseId, $namaBarang, $kategori,
        $partNumber, $size, $hargaSatuan, $qty, $totalHarga,
        $metode, $status, $keterangan
    );

    if ($stmt->execute()) {
        // If merchandise_id provided, optionally decrement stock_cabang
        if ($merchandiseId > 0 && $status === 'Selesai') {
            $conn->query("UPDATE `merchandise_parts` SET stock_cabang = GREATEST(0, stock_cabang - {$qty}) WHERE id = {$merchandiseId}");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Transaksi penjualan merchandise berhasil dicatat',
            'nomor_transaksi' => $nomorTransaksi,
            'inserted_id' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal mencatat transaksi: ' . $stmt->error
        ]);
    }
    exit;
}

// =========================================================================
// ACTION: DELETE_TRANSACTION
// =========================================================================
if ($action === 'delete_transaction') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = (int)($input['id'] ?? $_GET['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'ID transaksi tidak valid']);
        exit;
    }

    $delStmt = $conn->prepare("DELETE FROM `tabel_penjualan_merchandise` WHERE id = ?");
    $delStmt->bind_param("i", $id);
    if ($delStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data transaksi berhasil dihapus']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus data: ' . $delStmt->error]);
    }
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'Aksi tidak valid atau tidak didukung'
]);
