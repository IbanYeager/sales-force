<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

if (!$conn || $conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Pastikan tabel tabel_velg_ban ada
$checkTable = $conn->query("SHOW TABLES LIKE 'tabel_velg_ban'");
if ($checkTable && $checkTable->num_rows === 0) {
    $conn->query("CREATE TABLE IF NOT EXISTS tabel_velg_ban (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price INT NOT NULL DEFAULT 0,
        ring VARCHAR(20) DEFAULT '',
        pcd VARCHAR(30) DEFAULT '',
        lebar VARCHAR(30) DEFAULT '',
        status VARCHAR(50) DEFAULT 'Ready Stock',
        preorder TINYINT(1) DEFAULT 0,
        img TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed data resmi Velg & Ban Toyota OEM & Premium
    $conn->query("INSERT INTO tabel_velg_ban (brand, name, category, price, ring, pcd, lebar, status, preorder, img) VALUES 
    ('Toyota OEM', 'Innova Zenix Q Hybrid Alloy 18 Inch', 'standar', 9500000, '18 Inch', '5x114.3', '7.5J', 'Ready Stock', 0, ''),
    ('Toyota Gazoo Racing', 'GR Sport Alloy Rim 17 Inch Black Chrome', 'racing', 11200000, '17 Inch', '4x100', '7.0J', 'Ready Stock', 0, ''),
    ('Toyota OEM', 'Fortuner VRZ Two-Tone Rim 18 Inch', 'standar', 13500000, '18 Inch', '6x139.7', '7.5J', 'Pre-order 5 Hari', 1, ''),
    ('Enkei', 'RPF1 Racing Silver Original 17 Inch', 'racing', 14500000, '17 Inch', '5x114.3', '8.0J', 'Ready Stock', 0, ''),
    ('Michelin', 'Pilot Sport 5 SUV 225/50 R18', 'ban', 2450000, '18 Inch', '-', '225/50', 'Ready Stock', 0, ''),
    ('Bridgestone', 'Turanza T005A 215/60 R17', 'ban', 1650000, '16 Inch', '-', '215/60', 'Ready Stock', 0, ''),
    ('Dunlop', 'Enasave EC300+ 185/65 R15 (OEM Avanza)', 'ban', 980000, '15 Inch', '-', '185/65', 'Ready Stock', 0, '')");
}

$category = isset($_GET['category']) ? $conn->real_escape_string($_GET['category']) : 'semua';
$query = "SELECT * FROM tabel_velg_ban";
if ($category !== 'semua') {
    $query .= " WHERE category = '$category'";
}
$query .= " ORDER BY id ASC";

$result = $conn->query($query);
$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['price'] = (int)$row['price'];
        $row['preorder'] = (bool)$row['preorder'];

        if (empty($row['img'])) {
            if ($row['category'] === 'ban') {
                $row['img'] = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%231e293b' stroke='%230f172a' stroke-width='5'/><circle cx='50' cy='50' r='25' fill='%23f8fafc'/><path d='M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5 Z' fill='none' stroke='%23334155' stroke-width='8' stroke-dasharray='10 5'/></svg>";
            } elseif ($row['category'] === 'racing') {
                $row['img'] = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%230f172a' stroke='%23334155' stroke-width='4'/><circle cx='50' cy='50' r='16' fill='%23dc2626'/><path d='M50 32 L50 5 M35 58 L10 75 M65 58 L90 75 M25 40 L5 25 M75 40 L95 25 M50 68 L50 95' stroke='%2394a3b8' stroke-width='8'/><circle cx='50' cy='50' r='5' fill='%23ffffff'/></svg>";
            } else {
                $row['img'] = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23f1f5f9' stroke='%23cbd5e1' stroke-width='4'/><circle cx='50' cy='50' r='15' fill='%23e2e8f0'/><path d='M50 35 L40 5 L60 5 Z M50 65 L40 95 L60 95 Z M35 50 L5 40 L5 60 Z M65 50 L95 40 L95 60 Z' fill='%23cbd5e1'/><circle cx='50' cy='50' r='8' fill='%232563eb'/></svg>";
            }
        }
        $data[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $data]);
$conn->close();
