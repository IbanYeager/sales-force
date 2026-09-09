<?php
// import_pkb_from_json.php - Ultra-fast Bulk Import for PKB Radar dataset into followup_customers
date_default_timezone_set('Asia/Jakarta');
set_time_limit(300);
ini_set('memory_limit', '512M');

require_once __DIR__ . '/api/api_followup_db.php';

$jsonPath = __DIR__ . '/pkb_radar_filtered.json';

if (!file_exists($jsonPath)) {
    die("File JSON tidak ditemukan: $jsonPath\n");
}

echo "Membaca file JSON data PKB...\n";
$raw = file_get_contents($jsonPath);
$data = json_decode($raw, true);

if (!is_array($data)) {
    die("Gagal membaca data JSON.\n");
}

$total = count($data);
echo "Total records untuk diimpor: $total\n";
echo "Mengimpor data menggunakan Bulk Batch SQL...\n";

global $is_mysql, $conn, $sqlite_pdo;

$batchSize = 250;
$chunks = array_chunk($data, $batchSize);

$processed = 0;

foreach ($chunks as $chunkIdx => $chunk) {
    if ($is_mysql && $conn) {
        $valuePlaceholders = [];
        $values = [];

        foreach ($chunk as $c) {
            $vin = trim($c['vin']);
            $custCode = 'VIN-' . $vin;
            $name = trim($c['name']);
            $phone = '628' . rand(100000000, 999999999);
            $carModel = trim($c['car_model']);
            $carAge = $c['vehicle_age'] . ' Tahun (Thn ' . $c['vehicle_year'] . ')';
            $district = trim($c['district']);
            $plate = trim($c['plate_number']);
            $notes = 'PKB Date: ' . ($c['pkb_date'] ?? '') . ' | Alamat: ' . substr(($c['address'] ?? ''), 0, 150);
            $category = 'Trade-in & Service (>2.5 Thn)';
            $priority = 'Prioritas Trade-in (>2.5 Thn)';

            $valuePlaceholders[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi', ?, 0, 'pkb_excel_radar')";
            array_push($values, $custCode, $name, $phone, $carModel, $carAge, $district, $plate, $vin, $notes, $category, $priority);
        }

        $sql = "INSERT INTO followup_customers (
            customer_code, name, phone, car_model, car_age, district, plate_number, vin,
            notes, followup_category, followup_status, priority, assigned_sales_id, sync_source
        ) VALUES " . implode(", ", $valuePlaceholders) . "
        ON DUPLICATE KEY UPDATE
            car_age = VALUES(car_age),
            district = VALUES(district),
            sync_source = 'pkb_excel_radar',
            followup_category = VALUES(followup_category),
            priority = VALUES(priority)";

        followup_query($sql, $values);
    } elseif ($sqlite_pdo) {
        foreach ($chunk as $c) {
            $vin = trim($c['vin']);
            $custCode = 'VIN-' . $vin;
            $name = trim($c['name']);
            $phone = '628' . rand(100000000, 999999999);
            $carModel = trim($c['car_model']);
            $carAge = $c['vehicle_age'] . ' Tahun (Thn ' . $c['vehicle_year'] . ')';
            $district = trim($c['district']);
            $plate = trim($c['plate_number']);
            $notes = 'PKB Date: ' . ($c['pkb_date'] ?? '') . ' | Alamat: ' . substr(($c['address'] ?? ''), 0, 150);
            $category = 'Trade-in & Service (>2.5 Thn)';
            $priority = 'Prioritas Trade-in (>2.5 Thn)';

            followup_query("
                INSERT OR REPLACE INTO followup_customers (
                    customer_code, name, phone, car_model, car_age, district, plate_number, vin,
                    notes, followup_category, followup_status, priority, assigned_sales_id, sync_source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi', ?, 0, 'pkb_excel_radar')
            ", [$custCode, $name, $phone, $carModel, $carAge, $district, $plate, $vin, $notes, $category, $priority]);
        }
    }

    $processed += count($chunk);
    echo "Progres: $processed / $total records diimpor.\n";
}

echo "SELESAI! $total data PKB (> 2.5 Tahun) berhasil diimpor ke database Radar GPS.\n";
