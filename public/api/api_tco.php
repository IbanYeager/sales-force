<?php
require_once 'koneksi.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM tco_models";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["ok" => false, "message" => $conn->error]);
    exit;
}

$tcoData = [];

while ($model = $result->fetch_assoc()) {
    $model_id = $model['id'];
    
    // Fetch items for this model
    $sql_items = "SELECT id, name, part_number, icon, type, price, price_tpos, price_tls, applicable_grade, stock FROM tco_items WHERE model_id = $model_id ORDER BY id ASC";
    $result_items = $conn->query($sql_items);
    
    $items = [];
    if ($result_items) {
        while ($item = $result_items->fetch_assoc()) {
            // Typecast stock to integer just in case
            $item['stock'] = (int)$item['stock'];
            $items[] = $item;
        }
    }
    
    $tcoData[] = [
        "model" => $model['name'],
        "pdfPage" => (int)$model['pdfPage'],
        "items" => $items
    ];
}

echo json_encode($tcoData);
$conn->close();
?>
