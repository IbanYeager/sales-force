<?php
// api_spv_biaya_iklan.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'koneksi.php';

// Ensure table exists with exact Google Sheet schema
$createTableQuery = "CREATE TABLE IF NOT EXISTS `tabel_biaya_iklan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_sales` VARCHAR(100) NOT NULL DEFAULT 'Semua Tim',
    `nama_spv` VARCHAR(100) NOT NULL DEFAULT 'Pak Ryan',
    `iklan_di` VARCHAR(100) NOT NULL DEFAULT 'Google Search Ads',
    `budget_perhari` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `tanggal_iklan` DATE NOT NULL,
    `berakhir_iklan` DATE NULL,
    `total_biaya_1bulan` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `biaya` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `jumlah_lead` INT DEFAULT 0,
    `jumlah_spk` INT DEFAULT 0,
    `keterangan` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn) {
    $conn->query($createTableQuery);
}

function cleanNumberSpv($val) {
    $val = trim($val);
    $val = preg_replace('/[^0-9,\.]/', '', $val);
    if (strpos($val, ',') !== false) {
        $val = str_replace('.', '', $val);
        $val = str_replace(',', '.', $val);
    }
    return floatval($val);
}

function cleanDateSpv($val) {
    $val = trim($val);
    if (empty($val)) return date('Y-m-d');
    
    $timestamp = strtotime($val);
    if ($timestamp === false) {
        $parts = explode('/', $val);
        if (count($parts) === 3) {
            $d = intval($parts[0]);
            $m = intval($parts[1]);
            $y = intval($parts[2]);
            if ($y < 100) $y += 2000;
            return sprintf('%04d-%02d-%02d', $y, $m, $d);
        }
        return date('Y-m-d');
    }
    return date('Y-m-d', $timestamp);
}

function syncGoogleSheetsLive($conn) {
    $sheetId = "1QbMIXl5bKqQ517z96p7ZCRFnTzG7Y0_xUPXMNNdoZ2A";
    $url = "https://docs.google.com/spreadsheets/d/$sheetId/export?format=csv";

    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
            "follow_location" => 1,
            "timeout" => 5
        ]
    ];
    $context = stream_context_create($opts);
    $csvContent = @file_get_contents($url, false, $context);

    if ($csvContent === false) {
        $url2 = "https://docs.google.com/spreadsheets/d/$sheetId/gviz/tq?tqx=out:csv";
        $csvContent = @file_get_contents($url2, false, $context);
    }

    if ($csvContent !== false && !empty(trim($csvContent))) {
        $lines = explode("\n", $csvContent);
        $hasDataRows = false;
        
        // Parse rows
        $parsedRows = [];
        foreach ($lines as $idx => $line) {
            $line = trim($line);
            if (empty($line)) continue;
            
            $cols = str_getcsv($line);
            if ($idx === 0) continue; // Skip header

            if (count($cols) >= 3) {
                $nama_sales = trim($cols[0] ?? '');
                $nama_spv = trim($cols[1] ?? '');
                $iklan_di = trim($cols[2] ?? '');
                
                if (empty($nama_sales) && empty($iklan_di)) continue;

                $budget_perhari = cleanNumberSpv($cols[3] ?? 0);
                $tanggal_iklan = cleanDateSpv($cols[4] ?? '');
                $berakhir_iklan = cleanDateSpv($cols[5] ?? '');
                $total_biaya = cleanNumberSpv($cols[6] ?? 0);

                if ($total_biaya <= 0 && $budget_perhari > 0) {
                    $total_biaya = $budget_perhari * 30;
                }

                $parsedRows[] = [
                    'nama_sales' => !empty($nama_sales) ? $nama_sales : 'Semua Tim',
                    'nama_spv' => !empty($nama_spv) ? $nama_spv : 'Pak Ryan',
                    'iklan_di' => !empty($iklan_di) ? $iklan_di : 'Showroom',
                    'budget_perhari' => $budget_perhari,
                    'tanggal_iklan' => $tanggal_iklan,
                    'berakhir_iklan' => $berakhir_iklan,
                    'total_biaya_1bulan' => $total_biaya
                ];
                $hasDataRows = true;
            }
        }

        if ($hasDataRows && !empty($parsedRows)) {
            // Replace table content with live sheet rows
            $conn->query("TRUNCATE TABLE `tabel_biaya_iklan`");
            $stmt = $conn->prepare("INSERT INTO `tabel_biaya_iklan` (`nama_sales`, `nama_spv`, `iklan_di`, `budget_perhari`, `tanggal_iklan`, `berakhir_iklan`, `total_biaya_1bulan`, `biaya`, `jumlah_lead`, `jumlah_spk`, `keterangan`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'Auto-synced from Google Sheets')");
            if ($stmt) {
                foreach ($parsedRows as $r) {
                    $stmt->bind_param("sssissdd", $r['nama_sales'], $r['nama_spv'], $r['iklan_di'], $r['budget_perhari'], $r['tanggal_iklan'], $r['berakhir_iklan'], $r['total_biaya_1bulan'], $r['total_biaya_1bulan']);
                    $stmt->execute();
                }
                $stmt->close();
            }
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action === 'export_csv') {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="biaya_iklan_google_sheets_' . date('Ymd_His') . '.csv"');

        $output = fopen('php://output', 'w');
        fputs($output, "\xEF\xBB\xBF");
        fputcsv($output, ['Nama Sales', 'Nama spv', 'Iklan di', 'Budget perhari', 'Tanggal iklan', 'Berakhir iklan', 'Total biaya 1 bulan', 'Leads', 'SPK', 'Keterangan']);

        $res = $conn->query("SELECT * FROM `tabel_biaya_iklan` ORDER BY tanggal_iklan DESC, id DESC");
        if ($res) {
            while ($r = $res->fetch_assoc()) {
                fputcsv($output, [
                    $r['nama_sales'],
                    $r['nama_spv'],
                    $r['iklan_di'],
                    $r['budget_perhari'],
                    $r['tanggal_iklan'],
                    $r['berakhir_iklan'],
                    $r['total_biaya_1bulan'],
                    $r['jumlah_lead'],
                    $r['jumlah_spk'],
                    $r['keterangan']
                ]);
            }
        }
        fclose($output);
        exit();
    }

    // Only sync Google Sheets on explicit sync request or if database is empty
    if (isset($_GET['sync']) || isset($_GET['sync_gsheet']) || $action === 'sync') {
        syncGoogleSheetsLive($conn);
    } else {
        $chkCount = $conn->query("SELECT COUNT(*) FROM `tabel_biaya_iklan`")->fetch_row()[0] ?? 0;
        if ($chkCount == 0) {
            syncGoogleSheetsLive($conn);
        }
    }

    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $spvFilter = isset($_GET['spv']) ? $conn->real_escape_string($_GET['spv']) : '';

    $where = ["1=1"];
    if (!empty($search)) {
        $where[] = "(nama_sales LIKE '%$search%' OR nama_spv LIKE '%$search%' OR iklan_di LIKE '%$search%')";
    }
    if (!empty($spvFilter) && $spvFilter !== 'ALL') {
        $where[] = "nama_spv = '$spvFilter'";
    }

    $whereSql = implode(" AND ", $where);
    $query = "SELECT * FROM `tabel_biaya_iklan` WHERE $whereSql ORDER BY id ASC";
    $result = $conn->query($query);

    $items = [];
    if ($result) {
        while ($r = $result->fetch_assoc()) {
            $items[] = $r;
        }
    }

    // Calculate Marketing Summary (Filtered)
    $summaryRes = $conn->query("SELECT 
        SUM(total_biaya_1bulan) AS total_biaya,
        SUM(jumlah_lead) AS total_lead,
        SUM(jumlah_spk) AS total_spk
    FROM `tabel_biaya_iklan` WHERE $whereSql");

    $metrics = [
        "total_biaya" => 0,
        "total_lead" => 0,
        "total_spk" => 0,
        "cpl" => 0,
        "cps" => 0
    ];

    if ($summaryRes && $row = $summaryRes->fetch_assoc()) {
        $metrics["total_biaya"] = floatval($row['total_biaya'] ?? 0);
        $metrics["total_lead"] = intval($row['total_lead'] ?? 0);
        $metrics["total_spk"] = intval($row['total_spk'] ?? 0);

        if ($metrics["total_lead"] > 0) {
            $metrics["cpl"] = round($metrics["total_biaya"] / $metrics["total_lead"]);
        }
        if ($metrics["total_spk"] > 0) {
            $metrics["cps"] = round($metrics["total_biaya"] / $metrics["total_spk"]);
        }
    }

    // Breakdown per SPV Team
    $spvBreakdown = [];
    $spvRes = $conn->query("SELECT nama_spv, 
                            SUM(total_biaya_1bulan) AS total_biaya, 
                            SUM(jumlah_lead) AS total_lead, 
                            SUM(jumlah_spk) AS total_spk, 
                            COUNT(*) as campaign_count 
                            FROM `tabel_biaya_iklan` 
                            GROUP BY nama_spv 
                            ORDER BY total_biaya DESC");
    if ($spvRes) {
        while ($sr = $spvRes->fetch_assoc()) {
            $b = floatval($sr['total_biaya']);
            $l = intval($sr['total_lead']);
            $s = intval($sr['total_spk']);
            $spvBreakdown[] = [
                'nama_spv' => $sr['nama_spv'],
                'total_biaya' => $b,
                'total_lead' => $l,
                'total_spk' => $s,
                'cpl' => $l > 0 ? round($b / $l) : 0,
                'cps' => $s > 0 ? round($b / $s) : 0,
                'campaign_count' => intval($sr['campaign_count'])
            ];
        }
    }

    // Distinct SPVs list
    $spvList = [];
    $spvListRes = $conn->query("SELECT DISTINCT nama_spv FROM `tabel_biaya_iklan` WHERE nama_spv IS NOT NULL AND nama_spv != '' ORDER BY nama_spv ASC");
    if ($spvListRes) {
        while ($sl = $spvListRes->fetch_row()) {
            $spvList[] = $sl[0];
        }
    }

    echo json_encode([
        "status" => "success",
        "current_spv" => $spvFilter ?: 'ALL',
        "metrics" => $metrics,
        "spv_breakdown" => $spvBreakdown,
        "spv_list" => $spvList,
        "data" => $items
    ]);
    exit();
}

if ($method === 'POST' || $method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!$input) {
        $input = $_POST;
    }

    $action = isset($input['action']) ? $input['action'] : '';

    // Handle Inline Cell Update from Spreadsheet Grid
    if ($action === 'update_single') {
        $id = intval($input['id'] ?? 0);
        $field = $conn->real_escape_string($input['field'] ?? '');
        $value = $input['value'] ?? '';

        $allowedFields = ['nama_sales', 'nama_spv', 'iklan_di', 'budget_perhari', 'tanggal_iklan', 'berakhir_iklan', 'total_biaya_1bulan', 'jumlah_lead', 'jumlah_spk', 'keterangan'];
        if ($id <= 0 || !in_array($field, $allowedFields)) {
            echo json_encode(["status" => "error", "message" => "ID atau Field tidak valid"]);
            exit();
        }

        if ($field === 'budget_perhari' || $field === 'total_biaya_1bulan') {
            $valEscaped = floatval($value);
        } elseif ($field === 'jumlah_lead' || $field === 'jumlah_spk') {
            $valEscaped = intval($value);
        } else {
            $valEscaped = "'" . $conn->real_escape_string($value) . "'";
        }

        $sql = "UPDATE `tabel_biaya_iklan` SET `$field` = $valEscaped WHERE id = $id";
        if ($conn->query($sql)) {
            if ($field === 'total_biaya_1bulan') {
                $conn->query("UPDATE `tabel_biaya_iklan` SET `biaya` = $valEscaped WHERE id = $id");
            }
            echo json_encode(["status" => "success", "message" => "Cell berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update cell: " . $conn->error]);
        }
        exit();
    }

    // Handle Bulk Sync / Import from Spreadsheet or Google Sheets
    if ($action === 'bulk_sync') {
        $rows = isset($input['rows']) && is_array($input['rows']) ? $input['rows'] : [];
        if (empty($rows)) {
            echo json_encode(["status" => "error", "message" => "Data baris spreadsheet kosong"]);
            exit();
        }

        $inserted = 0;
        $updated = 0;

        foreach ($rows as $row) {
            $id = intval($row['id'] ?? 0);
            $nama_sales = !empty($row['nama_sales']) ? trim($row['nama_sales']) : 'Semua Tim';
            $nama_spv = !empty($row['nama_spv']) ? trim($row['nama_spv']) : 'Pak Ryan';
            $iklan_di = !empty($row['iklan_di']) ? trim($row['iklan_di']) : 'Google Ads';
            $budget_perhari = floatval($row['budget_perhari'] ?? 0);
            $tanggal_iklan = !empty($row['tanggal_iklan']) ? trim($row['tanggal_iklan']) : date('Y-m-d');
            $berakhir_iklan = !empty($row['berakhir_iklan']) ? trim($row['berakhir_iklan']) : date('Y-m-d', strtotime('+30 days'));
            $total_biaya_1bulan = floatval($row['total_biaya_1bulan'] ?? ($budget_perhari * 30));
            $jumlah_lead = intval($row['jumlah_lead'] ?? 0);
            $jumlah_spk = intval($row['jumlah_spk'] ?? 0);
            $keterangan = trim($row['keterangan'] ?? '');

            if ($id > 0) {
                $stmt = $conn->prepare("UPDATE `tabel_biaya_iklan` SET `nama_sales`=?, `nama_spv`=?, `iklan_di`=?, `budget_perhari`=?, `tanggal_iklan`=?, `berakhir_iklan`=?, `total_biaya_1bulan`=?, `biaya`=?, `jumlah_lead`=?, `jumlah_spk`=?, `keterangan`=? WHERE `id`=?");
                if ($stmt) {
                    $stmt->bind_param("sssissddiisi", $nama_sales, $nama_spv, $iklan_di, $budget_perhari, $tanggal_iklan, $berakhir_iklan, $total_biaya_1bulan, $total_biaya_1bulan, $jumlah_lead, $jumlah_spk, $keterangan, $id);
                    $stmt->execute();
                    $stmt->close();
                    $updated++;
                }
            } else {
                $stmt = $conn->prepare("INSERT INTO `tabel_biaya_iklan` (`nama_sales`, `nama_spv`, `iklan_di`, `budget_perhari`, `tanggal_iklan`, `berakhir_iklan`, `total_biaya_1bulan`, `biaya`, `jumlah_lead`, `jumlah_spk`, `keterangan`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                if ($stmt) {
                    $stmt->bind_param("sssissddiis", $nama_sales, $nama_spv, $iklan_di, $budget_perhari, $tanggal_iklan, $berakhir_iklan, $total_biaya_1bulan, $total_biaya_1bulan, $jumlah_lead, $jumlah_spk, $keterangan);
                    $stmt->execute();
                    $stmt->close();
                    $inserted++;
                }
            }
        }

        echo json_encode(["status" => "success", "message" => "Sinkronisasi spreadsheet berhasil ($inserted dibuat, $updated diperbarui)"]);
        exit();
    }

    // Standard single row insert/update
    $id = isset($input['id']) ? intval($input['id']) : 0;
    $nama_sales = isset($input['nama_sales']) ? trim($input['nama_sales']) : 'Semua Tim';
    $nama_spv = isset($input['nama_spv']) ? trim($input['nama_spv']) : 'Pak Ryan';
    $iklan_di = isset($input['iklan_di']) ? trim($input['iklan_di']) : 'Google Ads';
    $budget_perhari = isset($input['budget_perhari']) ? floatval($input['budget_perhari']) : 0.00;
    $tanggal_iklan = isset($input['tanggal_iklan']) ? trim($input['tanggal_iklan']) : date('Y-m-d');
    $berakhir_iklan = isset($input['berakhir_iklan']) ? trim($input['berakhir_iklan']) : date('Y-m-d', strtotime('+30 days'));
    $total_biaya_1bulan = isset($input['total_biaya_1bulan']) ? floatval($input['total_biaya_1bulan']) : ($budget_perhari * 30);
    $jumlah_lead = isset($input['jumlah_lead']) ? intval($input['jumlah_lead']) : 0;
    $jumlah_spk = isset($input['jumlah_spk']) ? intval($input['jumlah_spk']) : 0;
    $keterangan = isset($input['keterangan']) ? trim($input['keterangan']) : '';

    if (empty($nama_sales) || empty($iklan_di)) {
        echo json_encode(["status" => "error", "message" => "Nama Sales dan Platform Iklan wajib diisi"]);
        exit();
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE `tabel_biaya_iklan` SET `nama_sales`=?, `nama_spv`=?, `iklan_di`=?, `budget_perhari`=?, `tanggal_iklan`=?, `berakhir_iklan`=?, `total_biaya_1bulan`=?, `biaya`=?, `jumlah_lead`=?, `jumlah_spk`=?, `keterangan`=? WHERE `id`=?");
        if ($stmt) {
            $stmt->bind_param("sssissddiisi", $nama_sales, $nama_spv, $iklan_di, $budget_perhari, $tanggal_iklan, $berakhir_iklan, $total_biaya_1bulan, $total_biaya_1bulan, $jumlah_lead, $jumlah_spk, $keterangan, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Data biaya iklan berhasil diperbarui"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal merubah data: " . $stmt->error]);
            }
            $stmt->close();
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO `tabel_biaya_iklan` (`nama_sales`, `nama_spv`, `iklan_di`, `budget_perhari`, `tanggal_iklan`, `berakhir_iklan`, `total_biaya_1bulan`, `biaya`, `jumlah_lead`, `jumlah_spk`, `keterangan`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("sssissddiis", $nama_sales, $nama_spv, $iklan_di, $budget_perhari, $tanggal_iklan, $berakhir_iklan, $total_biaya_1bulan, $total_biaya_1bulan, $jumlah_lead, $jumlah_spk, $keterangan);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Data biaya iklan berhasil disimpan", "id" => $conn->insert_id]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $stmt->error]);
            }
            $stmt->close();
        }
    }
    exit();
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
        exit();
    }

    $res = $conn->query("DELETE FROM `tabel_biaya_iklan` WHERE id = $id");
    if ($res) {
        echo json_encode(["status" => "success", "message" => "Data biaya iklan berhasil dihapus"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus data"]);
    }
    exit();
}

echo json_encode(["status" => "error", "message" => "Metode request tidak didukung"]);
?>
