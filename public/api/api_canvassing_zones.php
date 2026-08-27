<?php
// api_canvassing_zones.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $type = isset($_GET['type']) ? $conn->real_escape_string($_GET['type']) : '';

    $where = "1=1";
    if (!empty($type) && $type !== 'all') {
        $where = "type = '$type'";
    }

    $res = $conn->query("SELECT * FROM `tabel_canvassing_zones` WHERE $where ORDER BY id ASC");
    $data = [];

    if ($res) {
        while ($r = $res->fetch_assoc()) {
            $data[] = [
                'id' => $r['zone_code'],
                'db_id' => intval($r['id']),
                'name' => $r['name'],
                'sub' => $r['sub'],
                'type' => $r['type'],
                'lat' => floatval($r['lat']),
                'lng' => floatval($r['lng']),
                'share' => $r['market_share'],
                'income' => $r['income_level'],
                'models' => json_decode($r['models_json'], true) ?: [],
                'spots' => json_decode($r['spots_json'], true) ?: []
            ];
        }
    }

    echo json_encode([
        "status" => "success",
        "count" => count($data),
        "data" => $data
    ]);
    exit();
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true) ?: $_POST;

    $name = trim($input['name'] ?? '');
    $sub = trim($input['sub'] ?? '');
    $type = trim($input['type'] ?? 'red');
    $lat = floatval($input['lat'] ?? 0);
    $lng = floatval($input['lng'] ?? 0);
    $share = trim($input['market_share'] ?? $input['share'] ?? '');
    $income = trim($input['income_level'] ?? $input['income'] ?? '');
    $models = is_array($input['models'] ?? null) ? json_encode($input['models']) : '[]';
    $spots = is_array($input['spots'] ?? null) ? json_encode($input['spots']) : '[]';
    $zone_code = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $name));

    if (empty($name) || $lat == 0 || $lng == 0) {
        echo json_encode(["status" => "error", "message" => "Nama zona, Latitude, dan Longitude wajib diisi"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO `tabel_canvassing_zones` (`zone_code`, `name`, `sub`, `type`, `lat`, `lng`, `market_share`, `income_level`, `models_json`, `spots_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssssddssss", $zone_code, $name, $sub, $type, $lat, $lng, $share, $income, $models, $spots);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Zona canvassing berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Prepare error"]);
    }
    exit();
}
