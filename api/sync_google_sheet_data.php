<?php
// api/sync_google_sheet_data.php - Replaces customer database in MySQL / SQLite with Google Sheet PKB Dataset
header('Content-Type: application/json; charset=utf-8');
@ini_set('memory_limit', '1024M');
@set_time_limit(900);

require_once __DIR__ . '/api_followup_db.php';

// Locate prepared DB customers file
$dataFile = __DIR__ . '/prepared_db_customers.json';
if (!file_exists($dataFile)) {
    $dataFile = dirname(__DIR__) . '/public/api/prepared_db_customers.json';
}
if (!file_exists($dataFile)) {
    $dataFile = dirname(__DIR__) . '/scratch/prepared_db_customers.json';
}

if (!file_exists($dataFile)) {
    echo json_encode(['success' => false, 'message' => 'File prepared_db_customers.json not found']);
    exit;
}

$customers = json_decode(file_get_contents($dataFile), true);
if (empty($customers) || !is_array($customers)) {
    echo json_encode(['success' => false, 'message' => 'Invalid or empty customer payload']);
    exit;
}

global $is_mysql, $conn;

$totalRows = count($customers);
$insertedCount = 0;

$statusCounts = [
    'deal' => 0,
    'tertarik' => 0,
    'menunggu' => 0,
    'belum' => 0,
    'tidak' => 0
];

if ($is_mysql && $conn) {
    // 1. Clean existing radar & TSINDO records to make room for full new Google Sheet PKB database
    $conn->query("DELETE FROM followup_customers WHERE sync_source = 'pkb_excel_radar' OR sync_source = 'tsindo_sales_radar' OR followup_category LIKE '%Radar%' OR followup_category LIKE '%PKB%'");

    // 2. Insert in high-speed multi-row chunks of 150 records
    $chunks = array_chunk($customers, 150);

    foreach ($chunks as $chunk) {
        $values = [];
        foreach ($chunk as $c) {
            $id = (int)$c['id'];
            $code = $conn->real_escape_string($c['customer_code'] ?? "CUST-$id");
            $name = $conn->real_escape_string($c['name'] ?? '');
            $phone = $conn->real_escape_string($c['phone'] ?? '');
            $carModel = $conn->real_escape_string($c['car_model'] ?? 'TOYOTA');
            $lastCarModel = $conn->real_escape_string($c['last_car_model'] ?? $carModel);
            $carAge = $conn->real_escape_string($c['car_age'] ?? '');
            $recModel = $conn->real_escape_string($c['recommended_model'] ?? $carModel);
            $cluster = $conn->real_escape_string($c['cluster_name'] ?? 'PKB Service Radar');
            $priority = $conn->real_escape_string($c['priority'] ?? 'Prioritas Servis Berkala');
            $district = $conn->real_escape_string($c['district'] ?? 'Kiaracondong');
            $compliance = $conn->real_escape_string($c['service_compliance'] ?? 'Rutin Servis');
            $outletDo = $conn->real_escape_string($c['outlet_do'] ?? 'TUNAS TOYOTA KIARA CONDONG');
            $outletService = $conn->real_escape_string($c['outlet_service'] ?? 'TUNAS TOYOTA KIARA CONDONG');
            $plate = $conn->real_escape_string($c['plate_number'] ?? '');
            $vin = $conn->real_escape_string($c['vin'] ?? '');
            $purchaseDate = $conn->real_escape_string($c['purchase_date'] ?? '');
            $serviceDueDate = $conn->real_escape_string($c['service_due_date'] ?? '');
            $stnkDueDate = $conn->real_escape_string($c['stnk_due_date'] ?? '');
            $insDueDate = $conn->real_escape_string($c['insurance_due_date'] ?? '');
            $salesId = !empty($c['assigned_sales_id']) ? (int)$c['assigned_sales_id'] : "NULL";
            $fuCategory = $conn->real_escape_string($c['followup_category'] ?? 'Database Radar GPS (PKB Excel)');
            $fuStatus = $conn->real_escape_string($c['followup_status'] ?? 'Menunggu Respon');
            $contactedAt = !empty($c['last_contacted_at']) ? ("'" . $conn->real_escape_string($c['last_contacted_at']) . "'") : "NULL";
            $templateUsed = !empty($c['last_template_used']) ? ("'" . $conn->real_escape_string($c['last_template_used']) . "'") : "NULL";
            $notes = $conn->real_escape_string($c['notes'] ?? '');
            $connected = $conn->real_escape_string($c['connected'] ?? 'FALSE');
            $contacted = $conn->real_escape_string($c['contacted'] ?? 'FALSE');
            $prospect = $conn->real_escape_string($c['prospect'] ?? 'FALSE');
            $spk = $conn->real_escape_string($c['spk'] ?? 'FALSE');
            $remarks = $conn->real_escape_string($c['remarks'] ?? '');
            $salesFuStatus = $conn->real_escape_string($c['sales_fu_status'] ?? 'Open');
            $reasonFu = $conn->real_escape_string($c['reason_followup'] ?? '');
            $fuDate = !empty($c['followup_date']) ? ("'" . $conn->real_escape_string($c['followup_date']) . "'") : "NULL";
            $syncSrc = 'pkb_excel_radar';

            $values[] = "($id, '$code', '$name', '$phone', NULL, '$carModel', '$lastCarModel', '$carAge', '$recModel', '', '', '$cluster', '$priority', '$district', '$compliance', '$outletDo', '$outletService', '$plate', '$vin', '$purchaseDate', '$serviceDueDate', '$stnkDueDate', '$insDueDate', $salesId, '$fuCategory', '$fuStatus', $contactedAt, $templateUsed, '$notes', '$connected', '$contacted', '$prospect', '$spk', '$remarks', '$salesFuStatus', '$reasonFu', $fuDate, '$syncSrc', NOW(), NOW())";

            if ($fuStatus === 'Deal / Selesai') $statusCounts['deal']++;
            elseif ($fuStatus === 'Tertarik / Jadwal Servis') $statusCounts['tertarik']++;
            elseif ($fuStatus === 'Menunggu Respon') $statusCounts['menunggu']++;
            elseif ($fuStatus === 'Belum Dihubungi') $statusCounts['belum']++;
            else $statusCounts['tidak']++;
        }

        $sql = "INSERT INTO followup_customers (
            id, customer_code, name, phone, email, car_model, last_car_model, car_age,
            recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district,
            service_compliance, outlet_do, outlet_service, plate_number, vin, purchase_date,
            service_due_date, stnk_due_date, insurance_due_date, assigned_sales_id,
            followup_category, followup_status, last_contacted_at, last_template_used,
            notes, connected, contacted, prospect, spk, remarks, sales_fu_status,
            reason_followup, followup_date, sync_source, created_at, updated_at
        ) VALUES " . implode(",\n", $values) . "
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            phone = VALUES(phone),
            district = VALUES(district),
            followup_status = VALUES(followup_status),
            sales_fu_status = VALUES(sales_fu_status),
            assigned_sales_id = VALUES(assigned_sales_id),
            remarks = VALUES(remarks),
            notes = VALUES(notes),
            updated_at = NOW()";

        if ($conn->query($sql)) {
            $insertedCount += count($chunk);
        } else {
            error_log("MySQL Insert Error: " . $conn->error);
        }
    }
} else {
    // SQLite Fallback
    followup_execute("DELETE FROM followup_customers WHERE sync_source = 'pkb_excel_radar' OR sync_source = 'tsindo_sales_radar' OR followup_category LIKE '%Radar%' OR followup_category LIKE '%PKB%'");

    foreach ($customers as $c) {
        $id = (int)$c['id'];
        $code = $c['customer_code'] ?? "CUST-$id";
        $fuStatus = $c['followup_status'] ?? 'Menunggu Respon';

        followup_execute("
            INSERT OR REPLACE INTO followup_customers (
                id, customer_code, name, phone, email, car_model, last_car_model, car_age,
                recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district,
                service_compliance, outlet_do, outlet_service, plate_number, vin, purchase_date,
                service_due_date, stnk_due_date, insurance_due_date, assigned_sales_id,
                followup_category, followup_status, last_contacted_at, last_template_used,
                notes, connected, contacted, prospect, spk, remarks, sales_fu_status,
                reason_followup, followup_date, sync_source
            ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, '', '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pkb_excel_radar')
        ", [
            $id, $code, $c['name'], $c['phone'], $c['car_model'], $c['last_car_model'], $c['car_age'],
            $c['recommended_model'], $c['cluster_name'], $c['priority'], $c['district'],
            $c['service_compliance'], $c['outlet_do'], $c['outlet_service'], $c['plate_number'], $c['vin'],
            $c['purchase_date'], $c['service_due_date'], $c['stnk_due_date'], $c['insurance_due_date'],
            $c['assigned_sales_id'] ?: null, $c['followup_category'], $fuStatus,
            $c['last_contacted_at'], $c['last_template_used'], $c['notes'],
            $c['connected'], $c['contacted'], $c['prospect'], $c['spk'], $c['remarks'],
            $c['sales_fu_status'], $c['reason_followup'], $c['followup_date']
        ]);
        $insertedCount++;

        if ($fuStatus === 'Deal / Selesai') $statusCounts['deal']++;
        elseif ($fuStatus === 'Tertarik / Jadwal Servis') $statusCounts['tertarik']++;
        elseif ($fuStatus === 'Menunggu Respon') $statusCounts['menunggu']++;
        elseif ($fuStatus === 'Belum Dihubungi') $statusCounts['belum']++;
        else $statusCounts['tidak']++;
    }
}

echo json_encode([
    'success' => true,
    'database_type' => $is_mysql ? 'MySQL' : 'SQLite',
    'total_payload' => $totalRows,
    'total_inserted' => $insertedCount,
    'status_breakdown' => $statusCounts
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
