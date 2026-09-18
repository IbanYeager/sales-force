<?php
// api_olx_pencapaian.php
// Data Resmi Rekap Pencapaian Trade-In OLX 2026 - Tunas Toyota Kiaracondong
// Berdasarkan Report OLX by SPV Periode 2026.xlsx
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'koneksi.php';

$month_filter = isset($_GET['month']) ? trim($_GET['month']) : 'all';

// ════════════════════════════════════════════════════════════════
// DATASET RESMI OLX 2026: CABANG TUNAS TOYOTA - KIARACONDONG
// TOTAL: 33 DEAL (ALVIN: 16, FERYANTO: 15, MUHAMMAD CAISARIVA: 2)
// Tidak memunculkan nama sales dan tidak memunculkan harga
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

foreach ($deals_matrix_source as $spv => $months) {
    foreach ($months as $month => $count) {
        for ($i = 1; $i <= $count; $i++) {
            $raw_data[] = [
                'month' => $month,
                'sales' => '-',
                'spv' => $spv,
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

        // Ensure cabang column exists
        $chkCol = $conn->query("SHOW COLUMNS FROM tabel_olx_pencapaian LIKE 'cabang'");
        if ($chkCol && $chkCol->num_rows === 0) {
            $conn->query("ALTER TABLE tabel_olx_pencapaian ADD COLUMN cabang VARCHAR(100) DEFAULT 'Tunas Toyota - Kiaracondong'");
        }

        $chk = $conn->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian");
        if ($chk) {
            $cRow = $chk->fetch_assoc();
            $currCount = intval($cRow['c']);
            // If count is not 33, re-sync with official Kiaracondong data
            if ($currCount !== count($raw_data)) {
                $conn->query("TRUNCATE TABLE tabel_olx_pencapaian");
                $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                if ($stmt) {
                    foreach ($raw_data as $rd) {
                        $stmt->bind_param("sssssisisssss", 
                            $rd['month'], $rd['sales'], $rd['spv'], $rd['merk'], $rd['type'],
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
            $sqlite_pdo->exec("ALTER TABLE tabel_olx_pencapaian ADD COLUMN cabang TEXT DEFAULT 'Tunas Toyota - Kiaracondong'");
        } catch (Throwable $e) {}

        $cnt = $sqlite_pdo->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian")->fetch()['c'];
        if (intval($cnt) !== count($raw_data)) {
            $sqlite_pdo->exec("DELETE FROM tabel_olx_pencapaian");
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sqlite_pdo->beginTransaction();
            foreach ($raw_data as $rd) {
                $stmt->execute([
                    $rd['month'], $rd['sales'], $rd['spv'], $rd['merk'], $rd['type'],
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
// REST API ENDPOINTS: POST (STATUS & DELETE FOR KACAB)
// ════════════════════════════════════════════════════════════════
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input)) $input = $_POST;
    $action = $input['action'] ?? '';

    if ($action === 'add') {
        $month = trim($input['month'] ?? 'Januari 2026');
        $spv = trim($input['spv'] ?? 'ALVIN');
        $cabang = 'Tunas Toyota - Kiaracondong';
        $hasil = trim($input['hasil'] ?? 'Deal');
        $ket = trim($input['ket'] ?? 'Closing Deal OLX mobbi');
        $sales = '-';
        $merk = '-';
        $type = 'Closing Deal OLX';
        $tahun = 2026;
        $warna = '-';
        $harga = 0;
        $km = '-';
        $pajak = '-';

        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssisisssss", $month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $cabang);
            $stmt->execute();
            $newId = $conn->insert_id;
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data deal OLX berhasil ditambahkan!', 'id' => $newId]);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, cabang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $cabang]);
            $newId = $sqlite_pdo->lastInsertId();
            echo json_encode(['status' => 'success', 'message' => 'Data deal OLX berhasil ditambahkan!', 'id' => $newId]);
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
            echo json_encode(['status' => 'success', 'message' => 'Data deal OLX berhasil dihapus!']);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("DELETE FROM tabel_olx_pencapaian WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Data deal OLX berhasil dihapus!']);
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
    'September 2026'
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
        $where[] = "hasil = ?";
        $params[] = $status_filter;
        $types .= "s";
    }

    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(spv LIKE ? OR month LIKE ? OR ket LIKE ? OR cabang LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
        $types .= "ssss";
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT id, month, spv, cabang, ket, hasil, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id ASC";

    if (empty($params)) {
        $res = $conn->query($sql);
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
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
        $where[] = "hasil = ?";
        $params[] = $status_filter;
    }
    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(spv LIKE ? OR month LIKE ? OR ket LIKE ? OR cabang LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $stmt = $sqlite_pdo->prepare("SELECT id, month, spv, cabang, ket, hasil, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id ASC");
    $stmt->execute($params);
    $db_rows = $stmt->fetchAll();
    foreach ($db_rows as &$row) {
        $row['id'] = (int)$row['id'];
    }
}

if (empty($db_rows) && !$is_db_ready) {
    $db_rows = $raw_data;
}

// Grouping per SPV (ALVIN, FERYANTO/RYAN, MUHAMMAD CAISARIVA/RIVA)
$main_spvs = ['ALVIN', 'FERYANTO', 'MUHAMMAD CAISARIVA'];
$spv_groups = [];
foreach ($main_spvs as $sName) {
    $spv_groups[$sName] = [
        'spv_name' => $sName,
        'cabang' => 'Tunas Toyota - Kiaracondong',
        'total_unit' => 0,
        'deal_count' => 0,
        'nego_count' => 0,
        'win_rate' => 100,
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
            'win_rate' => 100,
            'items' => []
        ];
    }

    $spv_groups[$key]['total_unit']++;
    $spv_groups[$key]['deal_count']++;
    $spv_groups[$key]['items'][] = $item;
    $total_deal_all++;
}

$spv_list = array_values($spv_groups);

// ════════════════════════════════════════════════════════════════
// 1. REKAP BULANAN DEAL PER SPV (PAPAN FISIK DEALER MATRIX)
// Sesuai Report OLX by SPV Periode 2026.xlsx - Kiaracondong
// Key kompatibel: alvin, feryanto & ryan, caisariva & riva
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
// 2. EXECUTIVE SPV SHOWCASE (KIARACONDONG)
// ALVIN, FERYANTO (RYAN), MUHAMMAD CAISARIVA (RIVA)
// ════════════════════════════════════════════════════════════════
$spv_showcase = [
    [
        'key' => 'alvin',
        'display_name' => 'ALVIN',
        'role' => 'Supervisor 1',
        'deal_count' => $tot_m_alvin,
        'cabang' => 'Tunas Toyota - Kiaracondong'
    ],
    [
        'key' => 'feryanto',
        'display_name' => 'FERYANTO / RYAN',
        'role' => 'Supervisor 2',
        'deal_count' => $tot_m_feryanto,
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

// Return clean, official JSON matching Excel Report OLX Kiaracondong
echo json_encode([
    'status' => 'success',
    'cabang' => 'Tunas Toyota - Kiaracondong',
    'selected_month' => $month_filter,
    'available_months' => $available_months,
    'summary' => [
        'total_deal' => $total_deal_all,
        'total_unit' => $total_deal_all,
        'deal_alvin' => $tot_m_alvin,
        'deal_feryanto' => $tot_m_feryanto,
        'deal_ryan' => $tot_m_feryanto,
        'deal_caisariva' => $tot_m_caisariva,
        'deal_riva' => $tot_m_caisariva,
        'win_rate' => 100
    ],
    'spv_showcase' => $spv_showcase,
    'top_sales_podium' => [], // Removed sales names as requested
    'spv_matrix' => $spv_matrix,
    'spv_data' => $spv_list,
    'items' => $db_rows
]);
