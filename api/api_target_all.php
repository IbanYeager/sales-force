<?php
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

require_once __DIR__ . '/koneksi.php';

// Check table structure
$checkTable = $conn->query("SHOW TABLES LIKE 'target_do_bulanan'");
if ($checkTable && $checkTable->num_rows === 0) {
    $conn->query("CREATE TABLE IF NOT EXISTS target_do_bulanan (
        id_target_bulanan INT AUTO_INCREMENT PRIMARY KEY,
        sales_account_id INT NOT NULL,
        periode_bulan INT NOT NULL,
        periode_tahun INT DEFAULT 2026,
        target_spk INT NOT NULL DEFAULT 0,
        target_do INT NOT NULL DEFAULT 0,
        realisasi_spk INT NOT NULL DEFAULT 0,
        realisasi_do INT NOT NULL DEFAULT 0,
        plan_spk VARCHAR(255) DEFAULT '',
        target_total INT NOT NULL DEFAULT 0,
        UNIQUE KEY sales_month_year (sales_account_id, periode_bulan, periode_tahun)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $spv = isset($_GET['spv']) ? $conn->real_escape_string(trim($_GET['spv'])) : '';
    $current_month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
    if ($current_month < 1 || $current_month > 12) {
        $current_month = intval(date('n'));
    }
    $current_year = date('Y');
    $nama_bulan_list = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
    ];
    $periode_str = $nama_bulan_list[$current_month] . " " . $current_year;

    // Active Sales Consultants (Semua Sales Tim Ryan, Alvin, Riva)
    $active_usernames = [
        'reza','egy','erick','erik','deno','yani','denia','jajang','juarna','galih_ryan','fanny','fani','dadan','igo','denis','hady','tama','agus_ryan','irvan','wendy','rahma','aji','aghti','fia',
        'dadi','topik','indah','andri','rizky','ardian','abdian','fadil','fadhil','ahmad','arif','arief','udil','andrius','luvita','kurnia','intan','erlan','yeni','nova','dean','hingki','yoni','novi','cici',
        'galih_riva','dery','giono','giyono','rizal','gugum','shovia','mustofa','reni','nuri','uki','ridwan','agus','dian','debi','wawan','syahril','wulan','sinta','deni_rv'
    ];
    $user_filter_sql = "'" . implode("','", $active_usernames) . "'";

    $where_clause = "WHERE username IN ($user_filter_sql)";
    if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
        $spv_clean = str_replace('Pak ', '', $spv);
        $where_clause .= " AND (nama_spv = '$spv' OR nama_spv LIKE '%$spv_clean%')";
    }

    $whiteboard_targets = [
        'indah'      => ['target_spk' => 5, 'target_do' => 3],
        'dadi'       => ['target_spk' => 4, 'target_do' => 3],
        'topik'      => ['target_spk' => 4, 'target_do' => 3],
        'taufik'     => ['target_spk' => 4, 'target_do' => 3],
        'andri'      => ['target_spk' => 5, 'target_do' => 4],
        'abdian'     => ['target_spk' => 4, 'target_do' => 3],
        'fadhil'     => ['target_spk' => 4, 'target_do' => 3],
        'rizky'      => ['target_spk' => 4, 'target_do' => 3],
        'udu'        => ['target_spk' => 5, 'target_do' => 4],
        'nova'       => ['target_spk' => 4, 'target_do' => 3],
        'cici'       => ['target_spk' => 5, 'target_do' => 4],
        'galih_riva' => ['target_spk' => 6, 'target_do' => 5],
        'deni_rv'    => ['target_spk' => 6, 'target_do' => 5],
        'mustofa'    => ['target_spk' => 5, 'target_do' => 3],
        'sinta'      => ['target_spk' => 5, 'target_do' => 3],
        'rizal'      => ['target_spk' => 4, 'target_do' => 3],
        'reni'       => ['target_spk' => 4, 'target_do' => 3],
        'nuri'       => ['target_spk' => 4, 'target_do' => 3],
        'egy'        => ['target_spk' => 5, 'target_do' => 4],
        'deno'       => ['target_spk' => 4, 'target_do' => 1],
        'erik'       => ['target_spk' => 5, 'target_do' => 4],
        'denia'      => ['target_spk' => 4, 'target_do' => 3],
        'yani'       => ['target_spk' => 4, 'target_do' => 3],
        'jajang'     => ['target_spk' => 4, 'target_do' => 3],
        'juarna'     => ['target_spk' => 3, 'target_do' => 2],
        'galih_ryan' => ['target_spk' => 3, 'target_do' => 2],
        'reza'       => ['target_spk' => 3, 'target_do' => 2],
        'dadan'      => ['target_spk' => 3, 'target_do' => 2],
        'fani'       => ['target_spk' => 3, 'target_do' => 2],
        'igo'        => ['target_spk' => 3, 'target_do' => 2],
        'fia'        => ['target_spk' => 5, 'target_do' => 2],
        'rahma'      => ['target_spk' => 3, 'target_do' => 2],
    ];

    $q_sales = $conn->query("SELECT id as sales_account_id, username, nama_lengkap as nama_sales, tingkatan, nama_spv, created_at FROM sales_accounts $where_clause ORDER BY nama_lengkap ASC");

    $data = [];
    if ($q_sales && $q_sales->num_rows > 0) {
        while ($row = $q_sales->fetch_assoc()) {
            $sales_id = intval($row['sales_account_id']);
            $username_clean = strtolower(trim($row['username']));
            $tingkatan = $row['tingkatan'] ?? 'Executive';
            $created_at = $row['created_at'] ?? '2026-01-01';

            // Determine default targets per tingkatan
            $default_tgt_spk = 7;
            $default_tgt_do = 5;
            $default_do_eval = 20;

            if (stripos($tingkatan, 'magang') !== false) {
                $default_tgt_spk = 3;
                $default_tgt_do = 2;
                $default_do_eval = 8;
            } elseif (stripos($tingkatan, 'junior') !== false) {
                $default_tgt_spk = 5;
                $default_tgt_do = 3;
                $default_do_eval = 12;
            } elseif (stripos($tingkatan, 'executive') !== false) {
                $default_tgt_spk = 7;
                $default_tgt_do = 5;
                $default_do_eval = 20;
            } elseif (stripos($tingkatan, 'senior') !== false) {
                $default_tgt_spk = 8;
                $default_tgt_do = 7;
                $default_do_eval = 28;
            }

            if (isset($whiteboard_targets[$username_clean])) {
                $default_tgt_spk = $whiteboard_targets[$username_clean]['target_spk'];
                $default_tgt_do = $whiteboard_targets[$username_clean]['target_do'];
            }

            // Calculate active 4-month evaluation cycle
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

            // Read target & realisasi strictly PER BULAN for the requested $current_month
            $q_target = $conn->query("SELECT id_target_bulanan, target_spk, target_do, realisasi_spk, realisasi_do, plan_spk, is_manual_target_spk, is_manual_target_do, is_manual_spk, is_manual_do FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan = $current_month");
            
            $tgt_spk = 0;
            $tgt_do = 0;
            $real_spk = 0;
            $real_do = 0;
            $plan = '';
            $id_tgt = 0;
            $is_manual_spk = 0;
            $is_manual_do = 0;
            $is_manual_target_spk = 0;
            $is_manual_target_do = 0;

            if ($q_target && $q_target->num_rows > 0) {
                $t_row = $q_target->fetch_assoc();
                $tgt_spk = intval($t_row['target_spk']);
                $tgt_do = intval($t_row['target_do']);
                $real_spk = intval($t_row['realisasi_spk']);
                $real_do = intval($t_row['realisasi_do']);
                $plan = $t_row['plan_spk'] ?? '';
                $id_tgt = intval($t_row['id_target_bulanan']);
                $is_manual_spk = intval($t_row['is_manual_spk'] ?? 0);
                $is_manual_do = intval($t_row['is_manual_do'] ?? 0);
                $is_manual_target_spk = intval($t_row['is_manual_target_spk'] ?? 0);
                $is_manual_target_do = intval($t_row['is_manual_target_do'] ?? 0);
            }

            if ($tgt_spk === 0) $tgt_spk = $default_tgt_spk;
            if ($tgt_do === 0) $tgt_do = $default_tgt_do;

            if (empty($is_manual_spk) && $real_spk === 0) {
                $q_dyn_spk = $conn->query("SELECT 
                    SUM(CASE WHEN status != 'Ditolak' THEN 1 ELSE 0 END) as dyn_spk,
                    SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as dyn_do
                    FROM tabel_spk WHERE sales_account_id = $sales_id AND (MONTH(created_at) = $current_month OR created_at IS NULL OR created_at = '')");

                if ($q_dyn_spk && $d_row = $q_dyn_spk->fetch_assoc()) {
                    $real_spk = max($real_spk, intval($d_row['dyn_spk'] ?? 0));
                    if (empty($is_manual_do) && $real_do === 0) {
                        $real_do = max($real_do, intval($d_row['dyn_do'] ?? 0));
                    }
                }
            }

            // Calculate 4-month evaluation sums
            $cycle_sql = implode(',', $active_cycle);
            $q_eval = $conn->query("SELECT SUM(target_do) as tot_target_do, SUM(realisasi_do) as tot_real_do, SUM(target_spk) as tot_target_spk, SUM(realisasi_spk) as tot_real_spk FROM target_do_bulanan WHERE sales_account_id = $sales_id AND periode_bulan IN ($cycle_sql)");

            $target_do_eval = 0;
            $realisasi_do_eval = 0;
            $target_spk_eval = 0;
            $realisasi_spk_eval = 0;

            if ($q_eval && $e_row = $q_eval->fetch_assoc()) {
                $target_do_eval = intval($e_row['tot_target_do']);
                $realisasi_do_eval = intval($e_row['tot_real_do']);
                $target_spk_eval = intval($e_row['tot_target_spk']);
                $realisasi_spk_eval = intval($e_row['tot_real_spk']);
            }

            $q_dyn_eval = $conn->query("SELECT 
                SUM(CASE WHEN status != 'Ditolak' THEN 1 ELSE 0 END) as dyn_spk,
                SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as dyn_do
                FROM tabel_spk WHERE sales_account_id = $sales_id AND (MONTH(created_at) IN ($cycle_sql) OR created_at IS NULL OR created_at = '')");
            if ($q_dyn_eval && $d_eval = $q_dyn_eval->fetch_assoc()) {
                $realisasi_spk_eval = max($realisasi_spk_eval, intval($d_eval['dyn_spk'] ?? 0));
                $realisasi_do_eval = max($realisasi_do_eval, intval($d_eval['dyn_do'] ?? 0));
            }

            if ($target_do_eval <= 0) {
                $target_do_eval = $default_do_eval;
            }

            $row['target_spk_bulan'] = $tgt_spk;
            $row['target_do_bulan'] = $tgt_do;
            $row['realisasi_spk_bulan'] = $real_spk;
            $row['realisasi_do_bulan'] = $real_do;
            
            $row['target_spk_eval'] = $target_spk_eval > 0 ? $target_spk_eval : ($default_tgt_spk * 4);
            $row['target_do_eval'] = $target_do_eval;
            $row['realisasi_spk_eval'] = $realisasi_spk_eval;
            $row['realisasi_do_eval'] = $realisasi_do_eval;

            $row['is_manual_target_spk'] = $is_manual_spk;
            $row['is_manual_target_do'] = $is_manual_do;

            $row['target_spk'] = $tgt_spk;
            $row['target_do'] = $tgt_do;
            $row['realisasi_spk'] = $real_spk;
            $row['realisasi_do'] = $real_do;
            $row['plan_spk'] = $plan;
            $row['id_target_bulanan'] = $id_tgt;
            $row['periode_label'] = $periode_str;

            $data[] = $row;
        }
    }

    echo json_encode([
        "status" => "success",
        "periode" => $periode_str,
        "evaluasi_do_label" => "Per Evaluasi (4 Bulan)",
        "data" => $data
    ]);
    if ($conn) { $conn->close(); }
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action'] : '';

    if ($action === 'save_target_single') {
        $sales_account_id = intval($data['sales_account_id'] ?? 0);
        $periode_bulan = intval($data['periode_bulan'] ?? date('n'));
        $target_spk = intval($data['target_spk'] ?? 0);
        $target_do = intval($data['target_do'] ?? 0);
        $realisasi_spk = intval($data['realisasi_spk'] ?? 0);
        $realisasi_do = intval($data['realisasi_do'] ?? 0);
        $plan_spk = $conn->real_escape_string(trim($data['plan_spk'] ?? ''));

        if ($sales_account_id === 0) {
            echo json_encode(["status" => "error", "message" => "ID sales tidak valid!"]);
            $conn->close();
            exit();
        }

        $check = $conn->query("SELECT id_target_bulanan FROM target_do_bulanan WHERE sales_account_id = $sales_account_id AND periode_bulan = $periode_bulan");
        if ($check && $check->num_rows > 0) {
            $row = $check->fetch_assoc();
            $id = $row['id_target_bulanan'];
            $sql = "UPDATE target_do_bulanan SET target_spk = $target_spk, target_do = $target_do, realisasi_spk = $realisasi_spk, realisasi_do = $realisasi_do, plan_spk = '$plan_spk', is_manual_spk = 1, is_manual_do = 1, is_manual_target_spk = 1, is_manual_target_do = 1 WHERE id_target_bulanan = $id";
        } else {
            $periode_tahun = date('Y');
            $sql = "INSERT INTO target_do_bulanan (sales_account_id, periode_bulan, periode_tahun, target_spk, target_do, realisasi_spk, realisasi_do, plan_spk, is_manual_spk, is_manual_do, is_manual_target_spk, is_manual_target_do) 
                    VALUES ($sales_account_id, $periode_bulan, $periode_tahun, $target_spk, $target_do, $realisasi_spk, $realisasi_do, '$plan_spk', 1, 1, 1, 1)";
        }

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Target & Actual bulanan berhasil disimpan!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan: " . $conn->error]);
        }
        $conn->close();
        exit();
    }

    if ($action === 'update_tingkatan') {
        $sales_account_id = intval($data['sales_account_id'] ?? 0);
        $tingkatan = $conn->real_escape_string(trim($data['tingkatan'] ?? 'Executive'));

        if ($sales_account_id > 0) {
            $conn->query("UPDATE sales_accounts SET tingkatan = '$tingkatan' WHERE id = $sales_account_id");
            
            $tgt_spk = 7; $tgt_do = 5;
            if (stripos($tingkatan, 'magang') !== false) { $tgt_spk = 3; $tgt_do = 2; }
            elseif (stripos($tingkatan, 'junior') !== false) { $tgt_spk = 5; $tgt_do = 3; }
            elseif (stripos($tingkatan, 'executive') !== false) { $tgt_spk = 7; $tgt_do = 5; }
            elseif (stripos($tingkatan, 'senior') !== false) { $tgt_spk = 8; $tgt_do = 7; }

            $cur_m = intval(date('n'));
            $conn->query("UPDATE target_do_bulanan SET target_spk = $tgt_spk, target_do = $tgt_do WHERE sales_account_id = $sales_account_id AND periode_bulan = $cur_m AND (is_manual_target_spk = 0 OR is_manual_target_spk IS NULL)");

            echo json_encode(["status" => "success", "message" => "Tingkatan wiraniaga dan target berhasil diperbarui!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "ID sales tidak valid!"]);
        }
        $conn->close();
        exit();
    }

    echo json_encode(["status" => "error", "message" => "Aksi tidak dikenali!"]);
    $conn->close();
    exit();
}
