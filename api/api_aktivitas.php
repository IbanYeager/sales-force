<?php
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require 'koneksi.php';

// Filter parameter
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 200;
if ($limit <= 0) $limit = 200;

$sesi = isset($_GET['sesi']) ? $conn->real_escape_string($_GET['sesi']) : '';
$status = isset($_GET['status']) ? $conn->real_escape_string($_GET['status']) : '';
$sales_id = isset($_GET['sales_account_id']) ? intval($_GET['sales_account_id']) : (isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0);
$nama_sales = isset($_GET['nama_sales']) ? $conn->real_escape_string(trim($_GET['nama_sales'])) : '';

$exclude_status = isset($_GET['exclude_status']) ? $conn->real_escape_string($_GET['exclude_status']) : '';
$only_today = isset($_GET['only_today']) ? intval($_GET['only_today']) : 0;

function cleanActivityKeterangan($note, $custName = '', $carModel = '') {
    $note = trim($note ?? '');
    if (empty($note)) {
        $res = "Follow-Up Database CRM";
        if (!empty($custName)) $res .= " (Customer: $custName)";
        return $res;
    }

    if (strpos($note, 'Follow-Up TAM:') !== false || strpos($note, 'Connected=') !== false || strpos($note, 'Remarks=') !== false) {
        $remarks = '';
        $alasan = '';
        $connected = '';
        $contacted = '';

        if (preg_match('/Remarks=([^,\.]+)/i', $note, $m)) {
            $remarks = trim($m[1]);
        }
        if (preg_match('/Alasan:\s*([^\n\r]+)/i', $note, $m)) {
            $alasan = trim($m[1]);
        }
        if (preg_match('/Connected=([^,\.]+)/i', $note, $m)) {
            $connected = strtoupper(trim($m[1])) === 'TRUE' ? 'Terhubung' : 'Tidak Terhubung';
        }
        if (preg_match('/Contacted=([^,\.]+)/i', $note, $m)) {
            $contacted = strtoupper(trim($m[1])) === 'TRUE' ? 'Kontak Berhasil' : 'Tidak Berhasil Kontak';
        }

        $parts = [];
        if (!empty($custName)) {
            $custStr = "Customer: " . $custName;
            if (!empty($carModel)) $custStr .= " (" . $carModel . ")";
            $parts[] = $custStr;
        }

        if (!empty($remarks)) {
            $parts[] = "Hasil: " . $remarks;
        } elseif (!empty($connected)) {
            $parts[] = "Koneksi: " . $connected;
        }

        if (!empty($alasan) && $alasan !== $remarks) {
            $parts[] = "Catatan: " . $alasan;
        }

        if (!empty($parts)) {
            return implode(' | ', $parts);
        }
    }

    if (!empty($custName) && strpos($note, $custName) === false) {
        return "Customer: " . $custName . (!empty($carModel) ? " ($carModel) - " : " - ") . $note;
    }

    return $note;
}

$subQuery = "
    SELECT 
        a.id, 
        a.sales_account_id, 
        a.nama_sales COLLATE utf8mb4_general_ci AS nama_sales, 
        a.tipe_aktivitas COLLATE utf8mb4_general_ci AS tipe_aktivitas, 
        a.keterangan COLLATE utf8mb4_general_ci AS keterangan, 
        a.lokasi COLLATE utf8mb4_general_ci AS lokasi, 
        a.foto COLLATE utf8mb4_general_ci AS foto, 
        a.status COLLATE utf8mb4_general_ci AS status, 
        a.sesi_waktu COLLATE utf8mb4_general_ci AS sesi_waktu, 
        a.waktu_pelaksanaan, 
        a.durasi COLLATE utf8mb4_general_ci AS durasi, 
        a.laporan_hasil COLLATE utf8mb4_general_ci AS laporan_hasil, 
        a.jumlah_prospek, 
        a.foto_laporan COLLATE utf8mb4_general_ci AS foto_laporan, 
        a.waktu_selesai, 
        a.created_at,
        '' COLLATE utf8mb4_general_ci AS customer_name,
        '' COLLATE utf8mb4_general_ci AS customer_car_model
    FROM aktivitas a

    UNION ALL

    SELECT 
        (100000 + f.id) AS id,
        f.sales_id AS sales_account_id,
        COALESCE(s.nama_lengkap, f.sales_name, 'Sales Consultant') COLLATE utf8mb4_general_ci AS nama_sales,
        'Follow Up Database' COLLATE utf8mb4_general_ci AS tipe_aktivitas,
        COALESCE(f.note, 'Follow up prospek CRM') COLLATE utf8mb4_general_ci AS keterangan,
        'Tunas Toyota Kiara Condong (CRM)' COLLATE utf8mb4_general_ci AS lokasi,
        '' COLLATE utf8mb4_general_ci AS foto,
        'Selesai' COLLATE utf8mb4_general_ci AS status,
        CASE 
            WHEN HOUR(f.created_at) < 12 THEN 'Pagi'
            WHEN HOUR(f.created_at) < 15 THEN 'Siang'
            ELSE 'Sore'
        END COLLATE utf8mb4_general_ci AS sesi_waktu,
        DATE_FORMAT(f.created_at, '%H:%i') AS waktu_pelaksanaan,
        '30 Menit' COLLATE utf8mb4_general_ci AS durasi,
        f.note COLLATE utf8mb4_general_ci AS laporan_hasil,
        1 AS jumlah_prospek,
        '' COLLATE utf8mb4_general_ci AS foto_laporan,
        DATE_FORMAT(f.created_at, '%H:%i') AS waktu_selesai,
        f.created_at,
        fc.name COLLATE utf8mb4_general_ci AS customer_name,
        fc.car_model COLLATE utf8mb4_general_ci AS customer_car_model
    FROM followup_logs f
    LEFT JOIN sales_accounts s ON (s.id = CAST(f.sales_id AS UNSIGNED) OR s.nama_lengkap COLLATE utf8mb4_general_ci = f.sales_name COLLATE utf8mb4_general_ci)
    LEFT JOIN followup_customers fc ON f.customer_id = fc.id
    WHERE f.action_type = 'sales_fu_submission' OR (f.note IS NOT NULL AND f.note LIKE '%Follow-Up%')

    UNION ALL

    SELECT 
        (200000 + c.id) AS id,
        c.sales_id AS sales_account_id,
        c.nama_sales COLLATE utf8mb4_general_ci AS nama_sales,
        COALESCE(c.jenis_kunjungan, 'Check-in Lapangan') COLLATE utf8mb4_general_ci AS tipe_aktivitas,
        COALESCE(NULLIF(c.keterangan, ''), c.nama_lokasi) COLLATE utf8mb4_general_ci AS keterangan,
        c.nama_lokasi COLLATE utf8mb4_general_ci AS lokasi,
        c.foto_bukti COLLATE utf8mb4_general_ci AS foto,
        'Selesai' COLLATE utf8mb4_general_ci AS status,
        CASE 
            WHEN HOUR(c.created_at) < 12 THEN 'Pagi'
            WHEN HOUR(c.created_at) < 15 THEN 'Siang'
            ELSE 'Sore'
        END COLLATE utf8mb4_general_ci AS sesi_waktu,
        DATE_FORMAT(c.created_at, '%H:%i') AS waktu_pelaksanaan,
        '45 Menit' COLLATE utf8mb4_general_ci AS durasi,
        c.keterangan COLLATE utf8mb4_general_ci AS laporan_hasil,
        1 AS jumlah_prospek,
        c.foto_bukti COLLATE utf8mb4_general_ci AS foto_laporan,
        DATE_FORMAT(c.created_at, '%H:%i') AS waktu_selesai,
        c.created_at,
        '' COLLATE utf8mb4_general_ci AS customer_name,
        '' COLLATE utf8mb4_general_ci AS customer_car_model
    FROM sales_checkins c
";

$where = ["1=1"];
if (!empty($sesi)) {
    $where[] = "sesi_waktu = '$sesi'";
}
if (!empty($status)) {
    $where[] = "status = '$status'";
}
if (!empty($exclude_status)) {
    $where[] = "status != '$exclude_status'";
}
if ($only_today == 1) {
    $where[] = "DATE(created_at) = CURDATE()";
}

// Isolasi Aktivitas per Sales
$salesFilter = "";
if ($sales_id > 0 && !empty($nama_sales)) {
    $salesFilter = "((sales_account_id = $sales_id AND (LOWER(TRIM(nama_sales)) LIKE LOWER(TRIM('%$nama_sales%')) OR nama_sales IS NULL OR nama_sales = '')) OR (sales_account_id IS NULL AND LOWER(TRIM(nama_sales)) = LOWER(TRIM('$nama_sales'))))";
} elseif ($sales_id > 0) {
    $salesFilter = "sales_account_id = $sales_id";
} elseif (!empty($nama_sales)) {
    $salesFilter = "LOWER(TRIM(nama_sales)) = LOWER(TRIM('$nama_sales'))";
}

if (!empty($salesFilter)) {
    $where[] = $salesFilter;
}

$whereSql = implode(" AND ", $where);

$query = "SELECT id, sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, waktu_pelaksanaan, durasi, laporan_hasil, jumlah_prospek, foto_laporan, waktu_selesai, created_at, customer_name, customer_car_model FROM ($subQuery) AS combined_aktivitas WHERE $whereSql ORDER BY created_at DESC LIMIT $limit";

$result = $conn->query($query);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        if (empty($row['sesi_waktu'])) {
            $time = strtotime($row['created_at']);
            $hour = intval(date('H', $time));
            if ($hour < 12) $row['sesi_waktu'] = 'Pagi';
            else if ($hour < 15.5) $row['sesi_waktu'] = 'Siang';
            else $row['sesi_waktu'] = 'Sore';
        }
        $row['keterangan'] = cleanActivityKeterangan($row['keterangan'], $row['customer_name'] ?? '', $row['customer_car_model'] ?? '');
        $row['laporan_hasil'] = cleanActivityKeterangan($row['laporan_hasil'], $row['customer_name'] ?? '', $row['customer_car_model'] ?? '');
        $data[] = $row;
    }

    // Summary counts by session for today (filtered by sales if provided)
    $summaryWhere = ["DATE(created_at) = CURDATE()"];
    if (!empty($salesFilter)) {
        $summaryWhere[] = $salesFilter;
    }
    $summaryWhereSql = implode(" AND ", $summaryWhere);

    $resSummary = $conn->query("SELECT 
        SUM(CASE WHEN sesi_waktu = 'Pagi' OR (sesi_waktu IS NULL AND HOUR(created_at) < 12) THEN 1 ELSE 0 END) AS total_pagi,
        SUM(CASE WHEN sesi_waktu = 'Siang' OR (sesi_waktu IS NULL AND HOUR(created_at) >= 12 AND HOUR(created_at) < 15) THEN 1 ELSE 0 END) AS total_siang,
        SUM(CASE WHEN sesi_waktu = 'Sore' OR (sesi_waktu IS NULL AND HOUR(created_at) >= 15) THEN 1 ELSE 0 END) AS total_sore,
        SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS total_selesai,
        SUM(CASE WHEN status = 'Rencana' OR status = 'Sedang Dilakukan' THEN 1 ELSE 0 END) AS total_pending
    FROM ($subQuery) AS combined_summary WHERE $summaryWhereSql");

    $summary = [
        "total_pagi" => 0,
        "total_siang" => 0,
        "total_sore" => 0,
        "total_selesai" => 0,
        "total_pending" => 0
    ];

    if ($resSummary && $rowS = $resSummary->fetch_assoc()) {
        $summary["total_pagi"] = intval($rowS['total_pagi']);
        $summary["total_siang"] = intval($rowS['total_siang']);
        $summary["total_sore"] = intval($rowS['total_sore']);
        $summary["total_selesai"] = intval($rowS['total_selesai']);
        $summary["total_pending"] = intval($rowS['total_pending']);
    }

    echo json_encode(["status" => "success", "summary" => $summary, "data" => $data]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal mengambil data: " . $conn->error]);
}

$conn->close();
?>
