<?php
// api/api_target.php - 100% Robust & Null-Safe Endpoint
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

@include_once __DIR__ . '/koneksi.php';

// Pastikan tabel target_do_bulanan ada jika koneksi DB tersedia
if ($conn && !$conn->connect_error) {
    try {
        $conn->query("CREATE TABLE IF NOT EXISTS target_do_bulanan (
            id_target_bulanan INT AUTO_INCREMENT PRIMARY KEY,
            sales_account_id INT NOT NULL,
            periode_bulan INT NOT NULL,
            periode_tahun INT NOT NULL DEFAULT 2026,
            target_spk INT NOT NULL DEFAULT 0,
            target_do INT NOT NULL DEFAULT 0,
            realisasi_spk INT NOT NULL DEFAULT 0,
            realisasi_do INT NOT NULL DEFAULT 0,
            plan_spk VARCHAR(255) DEFAULT '',
            target_total INT NOT NULL DEFAULT 0,
            is_manual_spk TINYINT(1) DEFAULT 0,
            is_manual_do TINYINT(1) DEFAULT 0,
            is_manual_target_spk TINYINT(1) DEFAULT 0,
            is_manual_target_do TINYINT(1) DEFAULT 0,
            UNIQUE KEY sales_bulan (sales_account_id, periode_bulan)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $existingCols = [];
        $colRes = $conn->query("SHOW COLUMNS FROM target_do_bulanan");
        if ($colRes) {
            while ($c = $colRes->fetch_assoc()) {
                $existingCols[] = $c['Field'];
            }
        }
        if (!in_array('periode_tahun', $existingCols)) {
            @$conn->query("ALTER TABLE target_do_bulanan ADD COLUMN periode_tahun INT NOT NULL DEFAULT 2026");
        }
        if (!in_array('is_manual_spk', $existingCols)) {
            @$conn->query("ALTER TABLE target_do_bulanan ADD COLUMN is_manual_spk TINYINT(1) DEFAULT 0");
        }
        if (!in_array('is_manual_do', $existingCols)) {
            @$conn->query("ALTER TABLE target_do_bulanan ADD COLUMN is_manual_do TINYINT(1) DEFAULT 0");
        }
        if (!in_array('is_manual_target_spk', $existingCols)) {
            @$conn->query("ALTER TABLE target_do_bulanan ADD COLUMN is_manual_target_spk TINYINT(1) DEFAULT 0");
        }
        if (!in_array('is_manual_target_do', $existingCols)) {
            @$conn->query("ALTER TABLE target_do_bulanan ADD COLUMN is_manual_target_do TINYINT(1) DEFAULT 0");
        }
    } catch (Throwable $e) {}
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id_sales = intval($data['id_sales'] ?? 1);
    $bulan = intval($data['bulan'] ?? date('n'));
    $realisasi_spk = intval($data['realisasi_spk'] ?? 0);
    $realisasi_do = intval($data['realisasi_do'] ?? 0);

    if ($conn && !$conn->connect_error) {
        $check = $conn->query("SELECT id_target_bulanan FROM target_do_bulanan WHERE sales_account_id = $id_sales AND periode_bulan = $bulan");
        if ($check && $check->num_rows > 0) {
            $row = $check->fetch_assoc();
            $id = $row['id_target_bulanan'];
            $sql = "UPDATE target_do_bulanan SET realisasi_spk = $realisasi_spk, realisasi_do = $realisasi_do, is_manual_spk = 1, is_manual_do = 1 WHERE id_target_bulanan = $id";
        } else {
            $current_year = date('Y');
            $sql = "INSERT INTO target_do_bulanan (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, plan_spk, is_manual_spk, is_manual_do) 
                    VALUES ($id_sales, $bulan, $current_year, 7, 5, $realisasi_spk, $realisasi_do, '', 1, 1)";
        }
        $conn->query($sql);
    }

    echo json_encode(["status" => "success", "message" => "Realisasi berhasil diperbarui!"]);
    if ($conn) { @$conn->close(); }
    exit();
}

if ($method === 'GET') {
    $id_raw = isset($_GET['id_sales']) ? trim($_GET['id_sales']) : '1';
    $id_sales = intval($id_raw);
    $spv = '';
    if (isset($_GET['spv'])) {
        $spv_val = trim($_GET['spv']);
        $spv = ($conn && !$conn->connect_error) ? $conn->real_escape_string($spv_val) : addslashes($spv_val);
    }

    $current_month = intval(date('n'));
    $current_year = intval(date('Y'));
    $nama_bulan_list = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];

    $periode_str = $nama_bulan_list[$current_month] . " " . $current_year;

    $tingkatan = 'Executive';
    $created_at = '2026-01-01';

    if ($conn && !$conn->connect_error) {
        if ($id_sales <= 0 || !is_numeric($id_raw)) {
            $u_esc = $conn->real_escape_string($id_raw);
            $q_find = $conn->query("SELECT id, tingkatan, created_at FROM sales_accounts WHERE username = '$u_esc' OR nama_lengkap LIKE '%$u_esc%' LIMIT 1");
            if ($q_find && $q_find->num_rows > 0) {
                $r_find = $q_find->fetch_assoc();
                $id_sales = intval($r_find['id']);
                $tingkatan = $r_find['tingkatan'] ?? 'Executive';
                $created_at = $r_find['created_at'] ?? '2026-01-01';
            } else {
                $id_sales = 1;
            }
        } else {
            $q_sales_info = $conn->query("SELECT tingkatan, created_at FROM sales_accounts WHERE id = $id_sales");
            if ($q_sales_info && $q_sales_info->num_rows > 0) {
                $r_info = $q_sales_info->fetch_assoc();
                $tingkatan = $r_info['tingkatan'] ?? 'Executive';
                $created_at = $r_info['created_at'] ?? '2026-01-01';
            }
        }

        if ($spv !== '' && !isset($_GET['id_sales'])) {
            $q_sales_info = $conn->query("SELECT created_at FROM sales_accounts WHERE nama_spv = '$spv' ORDER BY id ASC LIMIT 1");
            if ($q_sales_info && $q_sales_info->num_rows > 0) {
                $r_info = $q_sales_info->fetch_assoc();
                $created_at = $r_info['created_at'] ?? '2026-01-01';
            }
        }
    }

    $start_m = intval(date('n', strtotime($created_at)));
    if ($start_m < 1 || $start_m > 12) $start_m = 1;

    $cycles = [];
    for ($c = 0; $c < 3; $c++) {
        $cycle = [];
        for ($i = 0; $i < 4; $i++) {
            $m_val = (($start_m + ($c * 4) + $i - 1) % 12) + 1;
            $cycle[] = $m_val;
        }
        $cycles[] = $cycle;
    }

    $active_cycle = $cycles[0];
    foreach ($cycles as $cyc) {
        if (in_array($current_month, $cyc)) {
            $active_cycle = $cyc;
            break;
        }
    }

    $start_name = $nama_bulan_list[$active_cycle[0]];
    $end_name = $nama_bulan_list[$active_cycle[3]];
    $evaluasi_do_label = "$start_name - $end_name $current_year";
    if ($active_cycle[0] > $active_cycle[3]) {
        $next_year = $current_year + 1;
        $evaluasi_do_label = "$start_name $current_year - $end_name $next_year";
    }

    // Default target & bulanan
    $perm_target_do_eval = 20;
    $perm_target_do_arr = [5, 5, 5, 5];
    $perm_target_spk = 7;

    if (stripos($tingkatan, 'junior') !== false) {
        $perm_target_do_eval = 12;
        $perm_target_do_arr = [3, 3, 3, 3];
        $perm_target_spk = 5;
    } elseif (stripos($tingkatan, 'executive') !== false) {
        $perm_target_do_eval = 20;
        $perm_target_do_arr = [5, 5, 5, 5];
        $perm_target_spk = 7;
    } elseif (stripos($tingkatan, 'senior') !== false) {
        $perm_target_do_eval = 28;
        $perm_target_do_arr = [7, 7, 7, 7];
        $perm_target_spk = 8;
    }

    $bulanan = [];
    for ($i = 1; $i <= 12; $i++) {
        $bulanan[$i] = [
            "periode_bulan" => $i,
            "nama_bulan" => $nama_bulan_list[$i],
            "target_spk" => $perm_target_spk,
            "realisasi_spk" => 0,
            "target_do" => $perm_target_do_arr[0],
            "realisasi_do" => 0,
            "plan_spk" => ""
        ];
    }

    if ($conn && !$conn->connect_error) {
        if ($spv !== '' && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master' && !isset($_GET['id_sales'])) {
            $spv_clean = str_replace('Pak ', '', $spv);
            $q_target = $conn->query("SELECT t.periode_bulan, SUM(t.target_spk) as target_spk, SUM(t.target_do) as target_do, 
                                      SUM(t.realisasi_spk) as realisasi_spk, SUM(t.realisasi_do) as realisasi_do 
                                      FROM target_do_bulanan t 
                                      JOIN sales_accounts s ON t.sales_account_id = s.id 
                                      WHERE (s.nama_spv = '$spv' OR s.nama_spv LIKE '%$spv_clean%') 
                                      GROUP BY t.periode_bulan");
        } elseif (!isset($_GET['id_sales'])) {
            // Master Aggregate for All Branch Teams
            $q_target = $conn->query("SELECT t.periode_bulan, SUM(t.target_spk) as target_spk, SUM(t.target_do) as target_do, 
                                      SUM(t.realisasi_spk) as realisasi_spk, SUM(t.realisasi_do) as realisasi_do 
                                      FROM target_do_bulanan t 
                                      JOIN sales_accounts s ON t.sales_account_id = s.id 
                                      GROUP BY t.periode_bulan");
        } else {
            foreach ($active_cycle as $idx => $m) {
                $perm_target_do = $perm_target_do_arr[$idx] ?? 5;
                $c_m = $conn->query("SELECT id_target_bulanan, target_do, target_spk FROM target_do_bulanan WHERE sales_account_id = $id_sales AND periode_bulan = $m");
                if (!$c_m || $c_m->num_rows === 0) {
                    $conn->query("INSERT INTO target_do_bulanan (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, plan_spk) 
                                  VALUES ($id_sales, $m, $current_year, $perm_target_spk, $perm_target_do, 0, 0, '')");
                }
            }
            $q_target = $conn->query("SELECT * FROM target_do_bulanan WHERE sales_account_id = $id_sales");
        }

        if ($q_target && $q_target->num_rows > 0) {
            while ($row = $q_target->fetch_assoc()) {
                $m = intval($row['periode_bulan']);
                if ($m >= 1 && $m <= 12) {
                    if (intval($row['target_spk']) > 0) $bulanan[$m]['target_spk'] = intval($row['target_spk']);
                    if (intval($row['target_do']) > 0) $bulanan[$m]['target_do'] = intval($row['target_do']);
                    $bulanan[$m]['realisasi_spk'] = intval($row['realisasi_spk']);
                    $bulanan[$m]['realisasi_do'] = intval($row['realisasi_do']);
                    $bulanan[$m]['outstanding'] = intval($row['outstanding'] ?? 0);
                    $bulanan[$m]['prospek_target'] = intval($row['prospek_target'] ?? 7);
                    $bulanan[$m]['prospek_actual'] = intval($row['prospek_actual'] ?? 0);
                    $bulanan[$m]['hot_prospek_target'] = intval($row['hot_prospek_target'] ?? 4);
                    $bulanan[$m]['hot_prospek_actual'] = intval($row['hot_prospek_actual'] ?? 0);
                    $bulanan[$m]['is_manual_spk'] = intval($row['is_manual_spk'] ?? 0);
                    $bulanan[$m]['is_manual_do'] = intval($row['is_manual_do'] ?? 0);
                    $bulanan[$m]['plan_spk'] = $row['plan_spk'] ?? '';
                }
            }
        }

        // Aggregate real-time actuals from tabel_spk only if not manually overridden by SPV
        $q_dyn = $conn->query("SELECT 
            MONTH(created_at) as m,
            SUM(CASE WHEN status != 'Ditolak' THEN 1 ELSE 0 END) as dyn_spk,
            SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as dyn_do
            FROM tabel_spk 
            WHERE sales_account_id = $id_sales
            GROUP BY MONTH(created_at)");
        if ($q_dyn && $q_dyn->num_rows > 0) {
            while ($d_row = $q_dyn->fetch_assoc()) {
                $m = intval($d_row['m']);
                if ($m >= 1 && $m <= 12) {
                    if (empty($bulanan[$m]['is_manual_spk'])) {
                        $bulanan[$m]['realisasi_spk'] = max($bulanan[$m]['realisasi_spk'], intval($d_row['dyn_spk']));
                    }
                    if (empty($bulanan[$m]['is_manual_do'])) {
                        $bulanan[$m]['realisasi_do'] = max($bulanan[$m]['realisasi_do'], intval($d_row['dyn_do']));
                    }
                }
            }
        }
    }

    $target_spk_total = ($bulanan[$current_month]['target_spk'] > 0) ? $bulanan[$current_month]['target_spk'] : $perm_target_spk;
    $realisasi_spk_total = $bulanan[$current_month]['realisasi_spk'];
    $persentase_spk = ($target_spk_total > 0) ? round(($realisasi_spk_total / $target_spk_total) * 100) : 0;
    $sisa_spk = max(0, $target_spk_total - $realisasi_spk_total);

    $target_do_bulan_ini = ($bulanan[$current_month]['target_do'] > 0) ? $bulanan[$current_month]['target_do'] : $perm_target_do_arr[0];
    $realisasi_do_bulan_ini = $bulanan[$current_month]['realisasi_do'];
    $persentase_do_bulan_ini = ($target_do_bulan_ini > 0) ? round(($realisasi_do_bulan_ini / $target_do_bulan_ini) * 100) : 0;
    $sisa_do_bulan_ini = max(0, $target_do_bulan_ini - $realisasi_do_bulan_ini);

    $target_do_total = 0;
    $realisasi_do_total = 0;
    foreach ($active_cycle as $m) {
        $target_do_total += ($bulanan[$m]['target_do'] > 0) ? $bulanan[$m]['target_do'] : $perm_target_do_arr[0];
        $realisasi_do_total += $bulanan[$m]['realisasi_do'];
    }
    if ($target_do_total <= 0) $target_do_total = $perm_target_do_eval;
    $persentase_do = ($target_do_total > 0) ? round(($realisasi_do_total / $target_do_total) * 100) : 0;
    $sisa_do = max(0, $target_do_total - $realisasi_do_total);

    $prospek_target = intval($bulanan[$current_month]['prospek_target'] ?? 7);
    $prospek_actual = intval($bulanan[$current_month]['prospek_actual'] ?? 0);
    $hot_prospek_target = intval($bulanan[$current_month]['hot_prospek_target'] ?? 4);
    $hot_prospek_actual = intval($bulanan[$current_month]['hot_prospek_actual'] ?? 0);
    $outstanding = intval($bulanan[$current_month]['outstanding'] ?? 0);

    echo json_encode([
        "status" => "success",
        "periode" => $periode_str,
        "evaluasi_do_label" => $evaluasi_do_label,
        "persentase_spk" => $persentase_spk,
        "realisasi_spk_total" => $realisasi_spk_total,
        "target_spk_total" => $target_spk_total,
        "sisa_spk" => $sisa_spk,
        "persentase_do_bulan_ini" => $persentase_do_bulan_ini,
        "realisasi_do_bulan_ini" => $realisasi_do_bulan_ini,
        "target_do_bulan_ini" => $target_do_bulan_ini,
        "sisa_do_bulan_ini" => $sisa_do_bulan_ini,
        "persentase_do" => $persentase_do,
        "realisasi_do_total" => $realisasi_do_total,
        "target_do_total" => $target_do_total,
        "sisa_do" => $sisa_do,
        "prospek_target" => $prospek_target,
        "prospek_actual" => $prospek_actual,
        "hot_prospek_target" => $hot_prospek_target,
        "hot_prospek_actual" => $hot_prospek_actual,
        "outstanding" => $outstanding,
        "bulanan" => array_values($bulanan)
    ]);
    if ($conn) { @$conn->close(); }
    exit();
}

echo json_encode(["status" => "error", "message" => "Metode request tidak didukung!"]);
if ($conn) { @$conn->close(); }
?>
