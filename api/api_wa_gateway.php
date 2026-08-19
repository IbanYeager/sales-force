<?php
// api_wa_gateway.php
// Simulasi Gateway API WhatsApp
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['phone']) || !isset($data['message'])) {
    echo json_encode(["status" => "error", "message" => "Phone and message required"]);
    exit;
}

$phone = preg_replace('/[^0-9]/', '', $data['phone']);
if (substr($phone, 0, 1) === '0') {
    $phone = '62' . substr($phone, 1);
}

$message = $data['message'];

// CREATE TABLE IF NOT EXISTS tabel_wa_logs (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     phone VARCHAR(20),
//     message TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// )
$stmt = $conn->prepare("CREATE TABLE IF NOT EXISTS tabel_wa_logs (id INT AUTO_INCREMENT PRIMARY KEY, phone VARCHAR(20), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
if($stmt) { $stmt->execute(); $stmt->close(); }

$stmt = $conn->prepare("INSERT INTO tabel_wa_logs (phone, message) VALUES (?, ?)");
if ($stmt) {
    $stmt->bind_param("ss", $phone, $message);
    $stmt->execute();
    $stmt->close();
}

// Prepare manual wa.me link fallback
$wa_link = "https://wa.me/" . $phone . "?text=" . urlencode($message);

// Simulate API delay
// usleep(500000); 

echo json_encode([
    "status" => "success", 
    "message" => "WhatsApp message logged successfully",
    "wa_link" => $wa_link
]);
$conn->close();
?>
