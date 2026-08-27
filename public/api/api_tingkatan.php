<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'koneksi.php';

$tingkatan_list = [];
$allowed_tingkatan = ['Magang', 'Junior', 'Executive', 'Senior'];

// Ambil dari tabel_tingkatan
$res1 = $conn->query("SELECT nama_tingkatan FROM tabel_tingkatan ORDER BY id ASC");
if ($res1 && $res1->num_rows > 0) {
    while ($row = $res1->fetch_assoc()) {
        if (in_array($row['nama_tingkatan'], $allowed_tingkatan)) {
            $tingkatan_list[] = $row['nama_tingkatan'];
        }
    }
}

// Ambil juga distinct tingkatan dari sales_accounts, tetapi pastikan hanya sampai S3
$res2 = $conn->query("SELECT DISTINCT tingkatan FROM sales_accounts WHERE tingkatan IS NOT NULL AND tingkatan != ''");
if ($res2 && $res2->num_rows > 0) {
    while ($row = $res2->fetch_assoc()) {
        if (in_array($row['tingkatan'], $allowed_tingkatan) && !in_array($row['tingkatan'], $tingkatan_list)) {
            $tingkatan_list[] = $row['tingkatan'];
        }
    }
}

// Jika kosong, berikan default Magang, Junior, Executive, Senior
if (empty($tingkatan_list)) {
    $tingkatan_list = $allowed_tingkatan;
}

echo json_encode([
    "ok" => true,
    "data" => $tingkatan_list
]);

$conn->close();
?>
