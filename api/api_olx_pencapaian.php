<?php
// api_olx_pencapaian.php
// Data Resmi Rekap Pencapaian Trade-In OLX 2026 - Tunas Toyota Kiaracondong
// Berdasarkan Report OLX by SPV Periode 2026 & Daily Board Monitoring Kiaracondong (Oktober 2026)
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'koneksi.php';

$month_filter = isset($_GET['month']) ? trim($_GET['month']) : 'all';

// ════════════════════════════════════════════════════════════════
// 1. DATASET RESMI OLX 2026: CABANG TUNAS TOYOTA - KIARACONDONG
// Historical Deals: Januari - September 2026 (33 Deal)
// Daily Board Oktober 2026: 17 Unit (2 Deal, 15 On-Progress)
// TOTAL DEAL 2026: 35 DEAL (FERYANTO: 17, ALVIN: 16, MUHAMMAD CAISARIVA: 2)
// ════════════════════════════════════════════════════════════════
$raw_data = [];

$deals_matrix_source = [
    'ALVIN' => [
        'Januari 2026' => 1,
        'Februari 2026' => 1,
        'Maret 2026' => 2,
        'April 2026' => 1,
        'Mei 2026' => 3,
        'Juni 2026' => 2,
        'Juli 2026' => 2,
        'Agustus 2026' => 2,
        'September 2026' => 2,
    ],
    'FERYANTO' => [
        'April 2026' => 2,
        'Mei 2026' => 4,
        'Juni 2026' => 4,
        'Juli 2026' => 1,
        'Agustus 2026' => 2,
        'September 2026' => 2,
    ],
    'MUHAMMAD CAISARIVA' => [
        'April 2026' => 1,
        'Juli 2026' => 1,
    ]
];

// Seed 33 Historical Deals (Januari - September 2026)
foreach ($deals_matrix_source as $spv => $months) {
    foreach ($months as $month => $count) {
        for ($i = 1; $i <= $count; $i++) {
            $raw_data[] = [
                'month' => $month,
                'sales' => '-',
                'spv' => $spv,
                'customer' => '-',
                'merk' => '-',
                'type' => 'Closing Deal OLX',
                'tahun' => 2026,
                'warna' => '-',
                'harga' => 0,
                'km' => '-',
                'pajak' => '-',
                'ket' => 'Closing Deal OLX mobbi',
                'hasil' => 'Deal',
                'cabang' => 'Tunas Toyota - Kiaracondong'
            ];
        }
    }
}

// 17 Data Resmi Daily Board Monitoring Progress Bulan Oktober 2026
$oktober_items = [
    [
        'month' => 'Oktober 2026',
        'sales' => 'TAMA',
        'spv' => 'FERYANTO',
        'customer' => 'Yusuf',
        'merk' => 'Daihatsu',
        'type' => 'Sigra D',
        'tahun' => 2021,
        'warna' => 'Silver',
        'harga' => 115000000,
        'km' => '57.000',
        'pajak' => 'Mei 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Yeni',
        'spv' => 'ALVIN',
        'customer' => 'Jaya',
        'merk' => 'Toyota',
        'type' => 'Innova E MT BSN',
        'tahun' => 2011,
        'warna' => 'Hitam',
        'harga' => 145000000,
        'km' => '484.000',
        'pajak' => 'Feb 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Reza',
        'spv' => 'FERYANTO',
        'customer' => 'Deni',
        'merk' => 'Daihatsu',
        'type' => 'Rocky Turbo',
        'tahun' => 2022,
        'warna' => 'Silver',
        'harga' => 155000000,
        'km' => '14.000',
        'pajak' => 'Mei 2027',
        'ket' => 'Jadwal liat Mobil',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Yani',
        'spv' => 'FERYANTO',
        'customer' => 'Ujang',
        'merk' => 'Toyota',
        'type' => 'Calya E MT',
        'tahun' => 2018,
        'warna' => 'Putih',
        'harga' => 85000000,
        'km' => '70 rb',
        'pajak' => 'Jun 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Yoni',
        'spv' => 'ALVIN',
        'customer' => 'Ko Albert',
        'merk' => 'Mitsubishi',
        'type' => 'Pajero Dakar 4x2',
        'tahun' => 2022,
        'warna' => 'Putih',
        'harga' => 420000000,
        'km' => '16.000',
        'pajak' => 'Jan 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Putri',
        'spv' => 'MUHAMMAD CAISARIVA',
        'customer' => 'Siska',
        'merk' => 'Honda',
        'type' => 'Brio E CVT',
        'tahun' => 2023,
        'warna' => 'Putih',
        'harga' => 140000000,
        'km' => '45 rb',
        'pajak' => 'Jul 2027',
        'ket' => 'Jadwal Cek',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Denis',
        'spv' => 'FERYANTO',
        'customer' => 'Atang',
        'merk' => 'Toyota',
        'type' => 'Veloz Q Modellista',
        'tahun' => 2022,
        'warna' => 'Hitam',
        'harga' => 257000000,
        'km' => '4 rb',
        'pajak' => 'Agt 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Topik',
        'spv' => 'ALVIN',
        'customer' => 'Gilang',
        'merk' => 'Honda',
        'type' => 'Brio RS',
        'tahun' => 2020,
        'warna' => 'Putih',
        'harga' => 150000000,
        'km' => '50 rb',
        'pajak' => 'Sept 2027',
        'ket' => 'Cek Inspeksi',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Erik',
        'spv' => 'FERYANTO',
        'customer' => 'Bayu',
        'merk' => 'Toyota',
        'type' => 'Avanza E MT',
        'tahun' => 2016,
        'warna' => 'Hitam',
        'harga' => 110000000,
        'km' => '116 rb',
        'pajak' => 'Jul 2027',
        'ket' => 'Cek Inspeksi',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Dean',
        'spv' => 'FERYANTO',
        'customer' => 'Deny',
        'merk' => 'Nissan',
        'type' => 'Livina XV MT',
        'tahun' => 2008,
        'warna' => 'Hitam',
        'harga' => 70000000,
        'km' => '200 rb',
        'pajak' => 'Feb 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Rahma',
        'spv' => 'FERYANTO',
        'customer' => 'Firman',
        'merk' => 'Toyota',
        'type' => 'Veloz MT',
        'tahun' => 2022,
        'warna' => 'Hitam',
        'harga' => 182000000,
        'km' => '40 rb',
        'pajak' => 'Jan 2027',
        'ket' => 'Cek Inspeksi',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Rahma',
        'spv' => 'FERYANTO',
        'customer' => 'Sunandar',
        'merk' => 'Toyota',
        'type' => 'Calya G MT',
        'tahun' => 2023,
        'warna' => 'Silver',
        'harga' => 120000000,
        'km' => '9 rb',
        'pajak' => 'Mar 2027',
        'ket' => 'Cek Inspeksi',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Yeni',
        'spv' => 'ALVIN',
        'customer' => 'Andi',
        'merk' => 'Toyota',
        'type' => 'Alphard G AT',
        'tahun' => 2022,
        'warna' => 'Putih',
        'harga' => 750000000,
        'km' => '5 rb',
        'pajak' => 'Agt 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Yani',
        'spv' => 'FERYANTO',
        'customer' => 'Esti',
        'merk' => 'Toyota',
        'type' => 'Innova 2.4 G AT',
        'tahun' => 2026,
        'warna' => 'Putih',
        'harga' => 360000000,
        'km' => '6 rb',
        'pajak' => 'Apr 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Topik',
        'spv' => 'ALVIN',
        'customer' => 'R. Sekartini',
        'merk' => 'Honda',
        'type' => 'Brio E AT',
        'tahun' => 2022,
        'warna' => 'Silver',
        'harga' => 133000000,
        'km' => '70 rb',
        'pajak' => 'Agt 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Udil',
        'spv' => 'ALVIN',
        'customer' => 'Dwi Ratna',
        'merk' => 'Honda',
        'type' => 'Brio RS CVT',
        'tahun' => 2026,
        'warna' => 'Putih',
        'harga' => 155000000,
        'km' => '2 rb',
        'pajak' => 'Okt 2027',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'month' => 'Oktober 2026',
        'sales' => 'Egy',
        'spv' => 'FERYANTO',
        'customer' => 'Zaka',
        'merk' => 'Honda',
        'type' => 'Brio E MT',
        'tahun' => 2014,
        'warna' => 'Hitam',
        'harga' => 123000000,
        'km' => '140 rb',
        'pajak' => '-',
        'ket' => 'Cek Harga',
        'hasil' => 'Proses',
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ]
];

// Append October 2026 items
foreach ($oktober_items as $oit) {
    $raw_data[] = $oit;
}

// ════════════════════════════════════════════════════════════════
// DATABASE INTEGRATION & SYNC (MySQL & SQLite Fallback)
// ════════════════════════════════════════════════════════════════
$is_db_ready = false;
$sqlite_pdo = null;

if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
    try {
        $conn->query("
            CREATE TABLE IF NOT EXISTS tabel_olx_pencapaian (
                id INT AUTO_INCREMENT PRIMARY KEY,
                month VARCHAR(50) NOT NULL,
                sales VARCHAR(100) NOT NULL DEFAULT '-',
                spv VARCHAR(100) NOT NULL,
                customer VARCHAR(150) NOT NULL DEFAULT '-',
                merk VARCHAR(100) NOT NULL DEFAULT '-',
                type VARCHAR(150) NOT NULL DEFAULT 'Closing Deal OLX',
                tahun INT NOT NULL DEFAULT 2026,
                warna VARCHAR(50) DEFAULT '-',
                harga BIGINT NOT NULL DEFAULT 0,
                km VARCHAR(50) DEFAULT '-',
                pajak VARCHAR(50) DEFAULT '-',
                ket VARCHAR(255) DEFAULT 'Closing Deal OLX mobbi',
                hasil VARCHAR(50) NOT NULL DEFAULT 'Deal',
                cabang VARCHAR(100) DEFAULT 'Tunas Toyota - Kiaracondong',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // Ensure columns exist
        $chkCust = $conn->query("SHOW COLUMNS FROM tabel_olx_pencapaian LIKE 'customer'");
        if ($chkCust && $chkCust->num_rows === 0) {
            $conn->query("ALTER TABLE tabel_olx_pencapaian ADD COLUMN customer VARCHAR(150) NOT NULL DEFAULT '-' AFTER spv");
        }
        $chkCol = $conn->query("SHOW COLUMNS FROM tabel_olx_pencapaian LIKE 'cabang'");
        if ($chkCol && $chkCol->num_rows === 0) {
            $conn->query("ALTER TABLE tabel_olx_pencapaian ADD COLUMN cabang VARCHAR(100) DEFAULT 'Tunas Toyota - Kiaracondong'");
        }

        $chk = $conn->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian");
        if ($chk) {
            $cRow = $chk->fetch_assoc();
            $currCount = intval($cRow['c']);
            // If count is not 50 (33 historical + 17 Oktober), re-sync with official Kiaracondong data
            if ($currCount !== count($raw_data)) {
                $conn->query("TRUNCATE TABLE tabel_olx_pencapaian");
                $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                if ($stmt) {
                    foreach ($raw_data as $rd) {
                        $cst = $rd['customer'] ?? '-';
                        $stmt->bind_param("ssssssisisssss", 
                            $rd['month'], $rd['sales'], $rd['spv'], $cst, $rd['merk'], $rd['type'],
                            $rd['tahun'], $rd['warna'], $rd['harga'], $rd['km'], $rd['pajak'],
                            $rd['ket'], $rd['hasil'], $rd['cabang']
                        );
                        $stmt->execute();
                    }
                    $stmt->close();
                }
            }
        }
        $is_db_ready = true;
    } catch (Throwable $e) {}
}

if (!$is_db_ready) {
    try {
        $sqlite_path = __DIR__ . '/olx_pencapaian.sqlite';
        $sqlite_pdo = new PDO("sqlite:" . $sqlite_path);
        $sqlite_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlite_pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $sqlite_pdo->exec("
            CREATE TABLE IF NOT EXISTS tabel_olx_pencapaian (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL,
                sales TEXT NOT NULL DEFAULT '-',
                spv TEXT NOT NULL,
                customer TEXT NOT NULL DEFAULT '-',
                merk TEXT NOT NULL DEFAULT '-',
                type TEXT NOT NULL DEFAULT 'Closing Deal OLX',
                tahun INTEGER NOT NULL DEFAULT 2026,
                warna TEXT DEFAULT '-',
                harga INTEGER NOT NULL DEFAULT 0,
                km TEXT DEFAULT '-',
                pajak TEXT DEFAULT '-',
                ket TEXT DEFAULT 'Closing Deal OLX mobbi',
                hasil TEXT NOT NULL DEFAULT 'Deal',
                cabang TEXT DEFAULT 'Tunas Toyota - Kiaracondong',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        try {
            $sqlite_pdo->exec("ALTER TABLE tabel_olx_pencapaian ADD COLUMN customer TEXT DEFAULT '-'");
        } catch (Throwable $e) {}
        try {
            $sqlite_pdo->exec("ALTER TABLE tabel_olx_pencapaian ADD COLUMN cabang TEXT DEFAULT 'Tunas Toyota - Kiaracondong'");
        } catch (Throwable $e) {}

        $cnt = $sqlite_pdo->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian")->fetch()['c'];
        if (intval($cnt) !== count($raw_data)) {
            $sqlite_pdo->exec("DELETE FROM tabel_olx_pencapaian");
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sqlite_pdo->beginTransaction();
            foreach ($raw_data as $rd) {
                $cst = $rd['customer'] ?? '-';
                $stmt->execute([
                    $rd['month'], $rd['sales'], $rd['spv'], $cst, $rd['merk'], $rd['type'],
                    $rd['tahun'], $rd['warna'], $rd['harga'], $rd['km'], $rd['pajak'],
                    $rd['ket'], $rd['hasil'], $rd['cabang']
                ]);
            }
            $sqlite_pdo->commit();
        }
        $is_db_ready = true;
    } catch (Throwable $e) {}
}

// ════════════════════════════════════════════════════════════════
// REST API ENDPOINTS: POST (STATUS & DELETE FOR KACAB / SPV)
// ════════════════════════════════════════════════════════════════
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input)) $input = $_POST;
    $action = $input['action'] ?? '';

    if ($action === 'add') {
        $month = trim($input['month'] ?? 'Oktober 2026');
        $sales = trim($input['sales'] ?? '-');
        $spv = trim($input['spv'] ?? 'ALVIN');
        $customer = trim($input['customer'] ?? '-');
        $cabang = 'Tunas Toyota - Kiaracondong';
        $hasil = trim($input['hasil'] ?? 'Proses');
        $ket = trim($input['ket'] ?? 'Cek Harga');
        $merk = trim($input['merk'] ?? '-');
        $type = trim($input['type'] ?? 'Closing Deal OLX');
        $tahun = intval($input['tahun'] ?? 2026);
        $warna = trim($input['warna'] ?? '-');
        $harga = intval($input['harga'] ?? 0);
        $km = trim($input['km'] ?? '-');
        $pajak = trim($input['pajak'] ?? '-');

        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssisisssss", $month, $sales, $spv, $customer, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $cabang);
            $stmt->execute();
            $newId = $conn->insert_id;
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data unit OLX berhasil ditambahkan!', 'id' => $newId]);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$month, $sales, $spv, $customer, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $cabang]);
            $newId = $sqlite_pdo->lastInsertId();
            echo json_encode(['status' => 'success', 'message' => 'Data unit OLX berhasil ditambahkan!', 'id' => $newId]);
            exit;
        }
    }

    if ($action === 'delete') {
        $id = intval($input['id'] ?? 0);
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID data tidak valid']);
            exit;
        }
        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("DELETE FROM tabel_olx_pencapaian WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data unit OLX berhasil dihapus!']);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("DELETE FROM tabel_olx_pencapaian WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Data unit OLX berhasil dihapus!']);
            exit;
        }
    }
}

// ════════════════════════════════════════════════════════════════
// REST API: GET (LIST DATA & AGGREGATED METRICS)
// ════════════════════════════════════════════════════════════════
$available_months = [
    'Januari 2026',
    'Februari 2026',
    'Maret 2026',
    'April 2026',
    'Mei 2026',
    'Juni 2026',
    'Juli 2026',
    'Agustus 2026',
    'September 2026',
    'Oktober 2026'
];
$db_rows = [];

if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
    $where = [];
    $params = [];
    $types = "";

    if ($month_filter !== 'all' && $month_filter !== '') {
        $where[] = "month = ?";
        $params[] = $month_filter;
        $types .= "s";
    }

    $spv_filter = isset($_GET['spv']) ? trim($_GET['spv']) : 'all';
    if ($spv_filter !== 'all' && $spv_filter !== '' && strtolower($spv_filter) !== 'semua') {
        $cleanSpv = str_replace(['Pak ', 'Bu ', 'Tim SPV '], '', $spv_filter);
        if (stripos($cleanSpv, 'ryan') !== false || stripos($cleanSpv, 'feryanto') !== false) {
            $where[] = "(spv LIKE '%FERYANTO%' OR spv LIKE '%RYAN%')";
        } elseif (stripos($cleanSpv, 'riva') !== false || stripos($cleanSpv, 'caisariva') !== false) {
            $where[] = "(spv LIKE '%CAISARIVA%' OR spv LIKE '%RIVA%')";
        } else {
            $where[] = "(spv = ? OR spv LIKE ?)";
            $params[] = $cleanSpv;
            $params[] = "%$cleanSpv%";
            $types .= "ss";
        }
    }

    $status_filter = isset($_GET['status']) ? trim($_GET['status']) : 'all';
    if ($status_filter !== 'all' && $status_filter !== '') {
        if (strtolower($status_filter) === 'deal') {
            $where[] = "(hasil = 'Deal' OR ket LIKE '%Deal%')";
        } else {
            $where[] = "(hasil = ? OR ket LIKE ?)";
            $params[] = $status_filter;
            $params[] = "%$status_filter%";
            $types .= "ss";
        }
    }

    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(sales LIKE ? OR customer LIKE ? OR spv LIKE ? OR merk LIKE ? OR type LIKE ? OR ket LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
        $types .= "ssssss";
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT id, month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id ASC";

    if (empty($params)) {
        $res = $conn->query($sql);
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['harga'] = (int)$row['harga'];
                $row['tahun'] = (int)$row['tahun'];
                $db_rows[] = $row;
            }
        }
    } else {
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['harga'] = (int)$row['harga'];
                $row['tahun'] = (int)$row['tahun'];
                $db_rows[] = $row;
            }
            $stmt->close();
        }
    }
} elseif ($sqlite_pdo) {
    $where = [];
    $params = [];
    if ($month_filter !== 'all' && $month_filter !== '') {
        $where[] = "month = ?";
        $params[] = $month_filter;
    }
    $spv_filter = isset($_GET['spv']) ? trim($_GET['spv']) : 'all';
    if ($spv_filter !== 'all' && $spv_filter !== '' && strtolower($spv_filter) !== 'semua') {
        $cleanSpv = str_replace(['Pak ', 'Bu ', 'Tim SPV '], '', $spv_filter);
        if (stripos($cleanSpv, 'ryan') !== false || stripos($cleanSpv, 'feryanto') !== false) {
            $where[] = "(spv LIKE '%FERYANTO%' OR spv LIKE '%RYAN%')";
        } elseif (stripos($cleanSpv, 'riva') !== false || stripos($cleanSpv, 'caisariva') !== false) {
            $where[] = "(spv LIKE '%CAISARIVA%' OR spv LIKE '%RIVA%')";
        } else {
            $where[] = "(spv = ? OR spv LIKE ?)";
            $params[] = $cleanSpv;
            $params[] = "%$cleanSpv%";
        }
    }
    $status_filter = isset($_GET['status']) ? trim($_GET['status']) : 'all';
    if ($status_filter !== 'all' && $status_filter !== '') {
        if (strtolower($status_filter) === 'deal') {
            $where[] = "(hasil = 'Deal' OR ket LIKE '%Deal%')";
        } else {
            $where[] = "(hasil = ? OR ket LIKE ?)";
            $params[] = $status_filter;
            $params[] = "%$status_filter%";
        }
    }
    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(sales LIKE ? OR customer LIKE ? OR spv LIKE ? OR merk LIKE ? OR type LIKE ? OR ket LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $stmt = $sqlite_pdo->prepare("SELECT id, month, sales, spv, customer, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id ASC");
    $stmt->execute($params);
    $db_rows = $stmt->fetchAll();
    foreach ($db_rows as &$row) {
        $row['id'] = (int)$row['id'];
        $row['harga'] = (int)$row['harga'];
        $row['tahun'] = (int)$row['tahun'];
    }
}

if (empty($db_rows) && !$is_db_ready) {
    $db_rows = $raw_data;
}

// Grouping per SPV (ALVIN, FERYANTO/RYAN, MUHAMMAD CAISARIVA/RIVA)
$main_spvs = ['FERYANTO', 'ALVIN', 'MUHAMMAD CAISARIVA'];
$spv_groups = [];
foreach ($main_spvs as $sName) {
    $spv_groups[$sName] = [
        'spv_name' => $sName,
        'cabang' => 'Tunas Toyota - Kiaracondong',
        'total_unit' => 0,
        'deal_count' => 0,
        'nego_count' => 0,
        'win_rate' => 0,
        'items' => []
    ];
}

$total_deal_all = 0;
foreach ($db_rows as $item) {
    $spv = strtoupper($item['spv']);
    if (stripos($spv, 'ALVIN') !== false) {
        $key = 'ALVIN';
    } elseif (stripos($spv, 'FERYANTO') !== false || stripos($spv, 'RYAN') !== false) {
        $key = 'FERYANTO';
    } elseif (stripos($spv, 'CAISARIVA') !== false || stripos($spv, 'RIVA') !== false) {
        $key = 'MUHAMMAD CAISARIVA';
    } else {
        $key = $spv;
    }

    if (!isset($spv_groups[$key])) {
        $spv_groups[$key] = [
            'spv_name' => $key,
            'cabang' => 'Tunas Toyota - Kiaracondong',
            'total_unit' => 0,
            'deal_count' => 0,
            'nego_count' => 0,
            'win_rate' => 0,
            'items' => []
        ];
    }

    $spv_groups[$key]['total_unit']++;
    $isDeal = (strcasecmp($item['hasil'], 'Deal') === 0 || stripos($item['ket'], 'Deal') !== false);
    if ($isDeal) {
        $spv_groups[$key]['deal_count']++;
        $total_deal_all++;
    } else {
        $spv_groups[$key]['nego_count']++;
    }
    $spv_groups[$key]['items'][] = $item;
}

foreach ($spv_groups as $k => $grp) {
    $spv_groups[$k]['win_rate'] = $grp['total_unit'] > 0 ? round(($grp['deal_count'] / $grp['total_unit']) * 100, 1) : 0;
}

$spv_list = array_values($spv_groups);

// ════════════════════════════════════════════════════════════════
// 1. REKAP BULANAN DEAL PER SPV (PAPAN FISIK DEALER MATRIX)
// Sesuai Report OLX by SPV Periode 2026.xlsx - Kiaracondong
// Termasuk Rekap Bulan Oktober 2026 (Deal: Denis & Dean = 2 Deal Tim Ryan)
// ════════════════════════════════════════════════════════════════
$month_names = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
$matrix_rows = [];
$tot_m_alvin = 0;
$tot_m_feryanto = 0;
$tot_m_caisariva = 0;

foreach ($month_names as $mn) {
    $matrix_rows[$mn] = [
        'month' => $mn,
        'alvin' => 0,
        'feryanto' => 0,
        'ryan' => 0,
        'caisariva' => 0,
        'riva' => 0,
        'total' => 0
    ];
}

if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
    $resMatrix = $conn->query("SELECT month, spv, COUNT(*) as c FROM tabel_olx_pencapaian WHERE hasil='Deal' GROUP BY month, spv");
    if ($resMatrix) {
        while ($r = $resMatrix->fetch_assoc()) {
            $mFull = $r['month'];
            $spv = strtoupper($r['spv']);
            $cnt = (int)$r['c'];
            foreach ($month_names as $mn) {
                if (stripos($mFull, $mn) !== false) {
                    if (stripos($spv, 'ALVIN') !== false) {
                        $matrix_rows[$mn]['alvin'] += $cnt;
                        $tot_m_alvin += $cnt;
                    } elseif (stripos($spv, 'FERYANTO') !== false || stripos($spv, 'RYAN') !== false) {
                        $matrix_rows[$mn]['feryanto'] += $cnt;
                        $matrix_rows[$mn]['ryan'] += $cnt;
                        $tot_m_feryanto += $cnt;
                    } elseif (stripos($spv, 'CAISARIVA') !== false || stripos($spv, 'RIVA') !== false) {
                        $matrix_rows[$mn]['caisariva'] += $cnt;
                        $matrix_rows[$mn]['riva'] += $cnt;
                        $tot_m_caisariva += $cnt;
                    }
                    $matrix_rows[$mn]['total'] += $cnt;
                    break;
                }
            }
        }
    }
} elseif ($sqlite_pdo) {
    $stmtMatrix = $sqlite_pdo->query("SELECT month, spv, COUNT(*) as c FROM tabel_olx_pencapaian WHERE hasil='Deal' GROUP BY month, spv");
    if ($stmtMatrix) {
        while ($r = $stmtMatrix->fetch()) {
            $mFull = $r['month'];
            $spv = strtoupper($r['spv']);
            $cnt = (int)$r['c'];
            foreach ($month_names as $mn) {
                if (stripos($mFull, $mn) !== false) {
                    if (stripos($spv, 'ALVIN') !== false) {
                        $matrix_rows[$mn]['alvin'] += $cnt;
                        $tot_m_alvin += $cnt;
                    } elseif (stripos($spv, 'FERYANTO') !== false || stripos($spv, 'RYAN') !== false) {
                        $matrix_rows[$mn]['feryanto'] += $cnt;
                        $matrix_rows[$mn]['ryan'] += $cnt;
                        $tot_m_feryanto += $cnt;
                    } elseif (stripos($spv, 'CAISARIVA') !== false || stripos($spv, 'RIVA') !== false) {
                        $matrix_rows[$mn]['caisariva'] += $cnt;
                        $matrix_rows[$mn]['riva'] += $cnt;
                        $tot_m_caisariva += $cnt;
                    }
                    $matrix_rows[$mn]['total'] += $cnt;
                    break;
                }
            }
        }
    }
}

// Fallback totals if DB empty
if ($tot_m_alvin === 0 && $tot_m_feryanto === 0) {
    $tot_m_alvin = 16;
    $tot_m_feryanto = 17; // 15 + 2 Oktober
    $tot_m_caisariva = 2;
    $matrix_rows['Oktober']['feryanto'] = 2;
    $matrix_rows['Oktober']['ryan'] = 2;
    $matrix_rows['Oktober']['total'] = 2;
}

$spv_matrix = [
    'rows' => array_values($matrix_rows),
    'totals' => [
        'alvin' => $tot_m_alvin,
        'feryanto' => $tot_m_feryanto,
        'ryan' => $tot_m_feryanto,
        'caisariva' => $tot_m_caisariva,
        'riva' => $tot_m_caisariva,
        'dealer_total' => $tot_m_alvin + $tot_m_feryanto + $tot_m_caisariva
    ]
];

// ════════════════════════════════════════════════════════════════
// 2. EXECUTIVE SPV SHOWCASE (KIARACONDONG) - SORTED BY DEAL COUNT
// Rank 1: FERYANTO / RYAN (17 Deal)
// Rank 2: ALVIN (16 Deal)
// Rank 3: MUHAMMAD CAISARIVA / RIVA (2 Deal)
// ════════════════════════════════════════════════════════════════
$spv_showcase = [
    [
        'key' => 'feryanto',
        'display_name' => 'FERYANTO / RYAN',
        'role' => 'Supervisor 2',
        'deal_count' => $tot_m_feryanto,
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'key' => 'alvin',
        'display_name' => 'ALVIN',
        'role' => 'Supervisor 1',
        'deal_count' => $tot_m_alvin,
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'key' => 'caisariva',
        'display_name' => 'MUHAMMAD CAISARIVA / RIVA',
        'role' => 'Supervisor 3',
        'deal_count' => $tot_m_caisariva,
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ]
];

// Sort showcase descending
usort($spv_showcase, function ($a, $b) {
    return $b['deal_count'] - $a['deal_count'];
});

// Calculate Daily Board Summary for Oktober
$okt_deal_count = 0;
$okt_deal_nominal = 0;
$okt_total_nominal = 0;
foreach ($oktober_items as $oit) {
    $okt_total_nominal += (int)$oit['harga'];
    if (strcasecmp($oit['hasil'], 'Deal') === 0 || strcasecmp($oit['ket'], 'Deal') === 0) {
        $okt_deal_count++;
        $okt_deal_nominal += (int)$oit['harga'];
    }
}

// Return clean, official JSON matching Excel Report OLX & Daily Board Oktober
echo json_encode([
    'status' => 'success',
    'cabang' => 'Tunas Toyota - Kiaracondong',
    'selected_month' => $month_filter,
    'available_months' => $available_months,
    'summary' => [
        'total_deal' => ($month_filter === 'all' || $month_filter === '') ? ($tot_m_alvin + $tot_m_feryanto + $tot_m_caisariva) : $total_deal_all,
        'total_unit' => count($db_rows),
        'deal_alvin' => $tot_m_alvin,
        'deal_feryanto' => $tot_m_feryanto,
        'deal_ryan' => $tot_m_feryanto,
        'deal_caisariva' => $tot_m_caisariva,
        'deal_riva' => $tot_m_caisariva,
        'win_rate' => count($db_rows) > 0 ? round(($total_deal_all / count($db_rows)) * 100, 1) : 100
    ],
    'spv_showcase' => $spv_showcase,
    'top_sales_podium' => [],
    'spv_matrix' => $spv_matrix,
    'spv_data' => $spv_list,
    'daily_board_oktober' => [
        'period' => 'Oktober 2026',
        'branch' => 'Kiaracondong',
        'total_unit' => count($oktober_items),
        'total_deal' => $okt_deal_count,
        'deal_nominal' => $okt_deal_nominal,
        'total_nominal' => $okt_total_nominal,
        'items' => $oktober_items
    ],
    'items' => $db_rows
]);
