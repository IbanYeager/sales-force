<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $kecamatan = isset($_GET['kecamatan']) ? $_GET['kecamatan'] : '';
    $stmt = $conn->prepare("SELECT kelurahan, geojson FROM tabel_kelurahan_geo WHERE kecamatan = ?");
    $stmt->bind_param("s", $kecamatan);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = [];
    while($row = $res->fetch_assoc()) {
        $data[$row['kelurahan']] = json_decode($row['geojson'], true);
    }
    echo json_encode(["ok" => true, "data" => $data]);
    $stmt->close();
} else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (is_array($data)) {
        $stmt = $conn->prepare("INSERT INTO tabel_kelurahan_geo (kecamatan, kelurahan, geojson) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE geojson = VALUES(geojson)");
        foreach ($data as $item) {
            if (isset($item['kecamatan']) && isset($item['kelurahan']) && isset($item['geojson'])) {
                $geoJsonStr = json_encode($item['geojson']);
                $stmt->bind_param("sss", $item['kecamatan'], $item['kelurahan'], $geoJsonStr);
                $stmt->execute();
            }
        }
        $stmt->close();
        echo json_encode(["ok" => true]);
    } else {
        echo json_encode(["ok" => false, "msg" => "Invalid payload"]);
    }
}
$conn->close();
?>
