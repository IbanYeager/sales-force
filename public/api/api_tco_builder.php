<?php
require_once 'koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$model_id = intval($_GET['model_id'] ?? 0);

// Get all models
$models_res = $conn->query("SELECT id, name FROM tco_models ORDER BY name ASC");
$models = [];
if ($models_res) {
    while ($m = $models_res->fetch_assoc()) {
        $models[] = $m;
    }
}

// Get items for selected model or default first model
if ($model_id === 0 && !empty($models)) {
    $model_id = intval($models[0]['id']);
}

$items_query = "SELECT id, model_id, name, part_number, icon, type, price, applicable_grade, stock 
               FROM tco_items 
               WHERE model_id = $model_id 
               ORDER BY name ASC";
$items_res = $conn->query($items_query);
$items = [];
if ($items_res) {
    while ($item = $items_res->fetch_assoc()) {
        // Clean price number
        $clean_price = preg_replace('/[^0-9]/', '', $item['price']);
        $item['numeric_price'] = intval($clean_price);
        $items[] = $item;
    }
}

echo json_encode([
    "status" => "success",
    "selected_model_id" => $model_id,
    "models" => $models,
    "items" => $items
]);
exit();
