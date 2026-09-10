<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'koneksi.php';

$kecamatan = isset($_GET['kecamatan']) ? $_GET['kecamatan'] : '';
$tahun = isset($_GET['tahun']) ? $_GET['tahun'] : '2026';
$merk = isset($_GET['merk']) ? $_GET['merk'] : '';
$type = isset($_GET['type']) ? $_GET['type'] : '';

$where = "WHERE kecamatan = ? AND tahun = ?";
$params = [$kecamatan, $tahun];
$types = "ss";

if (!empty($merk) && $merk !== 'Teratas') {
    $where .= " AND merk = ?";
    $params[] = $merk;
    $types .= "s";
}

if (!empty($type)) {
    $where .= " AND type LIKE ?";
    $params[] = '%' . $type . '%';
    $types .= "s";
}

// Mengelompokkan berdasarkan alamat untuk keperluan geocoding presisi
$query = "SELECT alamat, kelurahan, kecamatan, lat, lng, 
          GROUP_CONCAT(CONCAT(merk, ' ', type) SEPARATOR '||') as cars, 
          COUNT(*) as unit_count 
          FROM tabel_polreg 
          $where 
          GROUP BY alamat, kelurahan, kecamatan, lat, lng";

$stmt = $conn->prepare($query);
if ($types) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["ok" => true, "data" => $data]);
$stmt->close();
$conn->close();
?>
