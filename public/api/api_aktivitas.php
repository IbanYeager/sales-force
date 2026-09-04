<?php
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require 'koneksi.php';

// Filter parameter
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
if ($limit <= 0) $limit = 50;

$sesi = isset($_GET['sesi']) ? $conn->real_escape_string($_GET['sesi']) : '';
$status = isset($_GET['status']) ? $conn->real_escape_string($_GET['status']) : '';
$sales_id = isset($_GET['sales_account_id']) ? intval($_GET['sales_account_id']) : (isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0);
$nama_sales = isset($_GET['nama_sales']) ? $conn->real_escape_string(trim($_GET['nama_sales'])) : '';

$exclude_status = isset($_GET['exclude_status']) ? $conn->real_escape_string($_GET['exclude_status']) : '';
$only_today = isset($_GET['only_today']) ? intval($_GET['only_today']) : 0;

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

// Isolasi Aktivitas per Sales: Sales hanya melihat aktivitas miliknya sendiri
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

// Query data aktivitas
$query = "SELECT id, sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, waktu_pelaksanaan, durasi, laporan_hasil, jumlah_prospek, foto_laporan, waktu_selesai, created_at FROM aktivitas WHERE $whereSql ORDER BY id DESC LIMIT ?";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
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
        FROM aktivitas WHERE $summaryWhereSql");

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
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
}

$conn->close();
?>
