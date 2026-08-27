<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'koneksi.php';

$kecamatan = isset($_GET['kecamatan']) ? $_GET['kecamatan'] : '';
$tahun = isset($_GET['tahun']) ? $_GET['tahun'] : '';
$merk = isset($_GET['merk']) ? $_GET['merk'] : '';
$type = isset($_GET['type']) ? $_GET['type'] : '';
$sort = (isset($_GET['sort']) && $_GET['sort'] === 'asc') ? 'ASC' : 'DESC';

$query = "SELECT alamat, kelurahan, COUNT(*) as unit 
          FROM tabel_polreg 
          WHERE kecamatan = ? AND tahun = ? AND merk = ? AND type = ? 
          GROUP BY alamat, kelurahan 
          ORDER BY unit $sort";

$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $kecamatan, $tahun, $merk, $type);
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
