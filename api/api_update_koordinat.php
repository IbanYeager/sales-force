<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST");

require 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);
if (is_array($data)) {
    $stmt = $conn->prepare("UPDATE tabel_polreg SET lat = ?, lng = ? WHERE alamat = ? AND kelurahan = ? AND kecamatan = ?");
    $updated = 0;
    foreach ($data as $item) {
        if (isset($item['lat']) && isset($item['lng']) && isset($item['alamat'])) {
            $stmt->bind_param("ddsss", $item['lat'], $item['lng'], $item['alamat'], $item['kelurahan'], $item['kecamatan']);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $updated += $stmt->affected_rows;
            }
        }
    }
    echo json_encode(["status" => "success", "updated" => $updated]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid payload"]);
}
$conn->close();
?>
