<?php
// sync_accurate_customer_locations.php - Synchronizes all accurate customer locations to DB and Cache
@ini_set('memory_limit', '1024M');
@set_time_limit(600);

require_once __DIR__ . '/api_followup_db.php';
require_once __DIR__ . '/api_radar_gazetteer.php';

echo "=== SFT ACCURATE SPATIAL RESOLUTION PIPELINE ===\n";

$salesList = get_sales_list();
$salesMap = [];
foreach ($salesList as $s) {
    $salesMap[(int)$s['id']] = $s['name'];
}

$fuRows = followup_query("SELECT id, name, phone, district, car_model, last_car_model, car_age, priority, followup_status, cluster_name, outlet_do, notes, assigned_sales_id, sync_source, visit_photo, reason_followup, plate_number, vin FROM followup_customers WHERE (sync_source = 'pkb_excel_radar' OR sync_source LIKE '%radar%' OR followup_category LIKE '%radar%') ORDER BY id DESC");

echo "Total records to process: " . count($fuRows) . "\n";

$cacheToSave = [];
$updateCount = 0;
$dbUpdates = [];

$start = microtime(true);
foreach ($fuRows as $row) {
    $coords = getAccurateCoords($row['id'], $row['district'] ?? '', $row['notes'] ?? '', null, $row['plate_number'] ?? '', $row['vin'] ?? '');
    $phoneClean = clean_phone_number($row['phone'] ?? '');
    $car = $row['car_model'] ?: ($row['last_car_model'] ?: 'Toyota Unit');
    $sid = (int)($row['assigned_sales_id'] ?? 0);
    $salesName = isset($salesMap[$sid]) ? $salesMap[$sid] : 'Terbuka (Siapa Saja)';

    $newDistrict = $coords[2];
    $cleanAddr = $coords[3];
    $lat = $coords[0];
    $lng = $coords[1];

    if ($newDistrict && $newDistrict !== ($row['district'] ?? '')) {
        $dbUpdates[] = [
            'id' => (int)$row['id'],
            'district' => $newDistrict
        ];
    }

    $formattedItem = [
        'id' => (int)$row['id'],
        'source' => $row['sync_source'] ?: 'followup_db',
        'name' => $row['name'],
        'phone' => $phoneClean,
        'car_model' => $car,
        'last_car_model' => $row['last_car_model'] ?: '',
        'car_age' => $row['car_age'] ?: '',
        'district' => $newDistrict,
        'address' => $cleanAddr,
        'plate_number' => $row['plate_number'] ?? '',
        'priority' => $row['priority'] ?: 'Prioritas Trade-in (>2.5 Thn)',
        'status' => $row['followup_status'] ?: 'Belum Dihubungi',
        'sales_name' => $salesName,
        'visit_photo' => $row['visit_photo'] ?: '',
        'reason_followup' => $row['reason_followup'] ?: '',
        'lat' => $lat,
        'lng' => $lng
    ];

    $cacheToSave[] = $formattedItem;
}

// 1. Save Cache Files
$cacheJson = json_encode($cacheToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
file_put_contents(__DIR__ . '/cache_radar_customers.json', $cacheJson);
if (is_dir(__DIR__ . '/../public/api/')) {
    file_put_contents(__DIR__ . '/../public/api/cache_radar_customers.json', $cacheJson);
}
echo "Cache saved! (" . strlen($cacheJson) . " bytes, " . count($cacheToSave) . " items)\n";

// 2. Batch Update DB Districts
echo "Updating " . count($dbUpdates) . " records in DB...\n";
global $is_mysql, $conn;
if ($is_mysql && $conn) {
    // Fast MySQL CASE WHEN batch update
    $chunks = array_chunk($dbUpdates, 500);
    foreach ($chunks as $chunk) {
        $ids = [];
        $cases = [];
        foreach ($chunk as $item) {
            $id = (int)$item['id'];
            $dist = $conn->real_escape_string($item['district']);
            $ids[] = $id;
            $cases[] = "WHEN $id THEN '$dist'";
        }
        $idList = implode(',', $ids);
        $caseSql = implode(' ', $cases);
        $sql = "UPDATE followup_customers SET district = CASE id $caseSql END WHERE id IN ($idList)";
        $conn->query($sql);
        $updateCount += count($chunk);
    }
} else {
    foreach ($dbUpdates as $item) {
        followup_execute("UPDATE followup_customers SET district = ? WHERE id = ?", [$item['district'], $item['id']]);
        $updateCount++;
    }
}

$elapsed = round(microtime(true) - $start, 2);
echo "Completed in {$elapsed} seconds! Updated {$updateCount} records in DB.\n";
