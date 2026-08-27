<?php
// api_brosur.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require 'koneksi.php';

$search   = isset($_GET['search'])   ? trim($_GET['search'])   : '';
$kategori = isset($_GET['kategori']) ? trim($_GET['kategori']) : '';

// Base query
$where  = [];
$params = [];
$types  = '';

if ($search !== '') {
    $where[]  = "(nama LIKE ? OR deskripsi LIKE ?)";
    $like     = "%{$search}%";
    $params[] = $like;
    $params[] = $like;
    $types   .= 'ss';
}

if ($kategori !== '' && strtoupper($kategori) !== 'ALL') {
    $where[]  = "kategori = ?";
    $params[] = strtoupper($kategori);
    $types   .= 's';
}

$sql = "SELECT id, nama, deskripsi, kategori, gambar_url, pdf_url FROM tabel_brosur";
if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY kategori ASC, nama ASC";

if (!empty($params)) {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

if ($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Ambil daftar kategori unik untuk filter
    $katResult = $conn->query("SELECT DISTINCT kategori FROM tabel_brosur ORDER BY kategori ASC");
    $kategoriList = [];
    if ($katResult) {
        while ($kr = $katResult->fetch_assoc()) {
            $kategoriList[] = $kr['kategori'];
        }
    }

    echo json_encode([
        "status"    => "success",
        "data"      => $data,
        "kategori"  => $kategoriList,
        "total"     => count($data)
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal mengambil data: " . $conn->error]);
}

$conn->close();
?>
