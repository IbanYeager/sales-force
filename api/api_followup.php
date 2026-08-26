<?php
// api_followup.php - Main REST API for Follow-Up CRM in SFT
date_default_timezone_set('Asia/Jakarta');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/api_followup_db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Helper to get JSON payload
function get_json_input() {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    return is_array($json) ? $json : $_POST;
}

// Clean phone number helper
function clean_phone_number($phone) {
    if (!$phone) return '';
    $clean = preg_replace('/[^0-9]/', '', (string)$phone);
    if (strpos($clean, '0') === 0) {
        $clean = '62' . substr($clean, 1);
    } elseif (strpos($clean, '8') === 0) {
        $clean = '628' . substr($clean, 1);
    }
    return $clean;
}

// Helper to fetch list of sales from SFT database or defaults
function get_sales_list($spv = '') {
    global $is_mysql, $conn;
    $salesList = [];

    // Try fetching from SFT sales_accounts if MySQL is active
    if ($is_mysql && $conn) {
        try {
            $where = "1=1";
            if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
                $spvClean = str_replace('Pak ', '', $conn->real_escape_string($spv));
                $where .= " AND (nama_spv = '" . $conn->real_escape_string($spv) . "' OR nama_spv LIKE '%$spvClean%')";
            }
            $res = $conn->query("SELECT id, nama_lengkap as name, no_hp as phone, tingkatan as role, nama_spv FROM sales_accounts WHERE $where ORDER BY nama_spv ASC, nama_lengkap ASC");
            if ($res && $res->num_rows > 0) {
                while ($r = $res->fetch_assoc()) {
                    $salesList[] = [
                        'id' => (int)$r['id'],
                        'name' => $r['name'],
                        'phone' => clean_phone_number($r['phone'] ?: '6281223344551'),
                        'role' => $r['role'] ?: 'Sales Consultant',
                        'spv' => $r['nama_spv'] ?: 'Umum',
                        'target_monthly' => 30
                    ];
                }
            }
        } catch (Throwable $e) {
            // Silently fallback if table doesn't exist
        }
    }

    // Fallback default Tunas Toyota Kiara Condong sales team
    if (empty($salesList)) {
        $salesList = [
            ['id' => 1, 'name' => 'Rian Pratama', 'phone' => '6281223344551', 'role' => 'Senior Sales Executive', 'spv' => 'Pak Riva', 'target_monthly' => 35],
            ['id' => 2, 'name' => 'Siti Nurhaliza', 'phone' => '6281399887766', 'role' => 'Sales Executive', 'spv' => 'Pak Ryan', 'target_monthly' => 30],
            ['id' => 3, 'name' => 'Dimas Anggoro', 'phone' => '6285712345678', 'role' => 'Sales Executive', 'spv' => 'Bu Rahma', 'target_monthly' => 25],
            ['id' => 4, 'name' => 'Agus Setiawan', 'phone' => '6287811223344', 'role' => 'Sales Counter & CRM', 'spv' => 'Pak Alvin', 'target_monthly' => 40],
            ['id' => 5, 'name' => 'Putri Maharani', 'phone' => '6282155667788', 'role' => 'Sales Executive', 'spv' => 'Pak Riva', 'target_monthly' => 30]
        ];
    }

    return $salesList;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup.php?action=customers
// -------------------------------------------------------------
if ($action === 'customers') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $sales_id = isset($_GET['sales_id']) ? trim($_GET['sales_id']) : '';
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $spv = isset($_GET['spv']) ? trim($_GET['spv']) : '';

    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = "(name LIKE ? OR phone LIKE ? OR plate_number LIKE ? OR car_model LIKE ? OR vin LIKE ? OR last_car_model LIKE ? OR district LIKE ?)";
        $sTerm = "%$search%";
        $params = array_merge($params, [$sTerm, $sTerm, $sTerm, $sTerm, $sTerm, $sTerm, $sTerm]);
    }

    if ($sales_id === 'all') {
        // If specific SPV view, show their team's leads + unassigned leads
        if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
            $spvSales = get_sales_list($spv);
            $spvSalesIds = array_map(fn($s) => (int)$s['id'], $spvSales);
            if (!empty($spvSalesIds)) {
                $idList = implode(',', $spvSalesIds);
                $where[] = "(assigned_sales_id IN ($idList) OR assigned_sales_id IS NULL OR assigned_sales_id = 0)";
            }
        }
    } elseif ($sales_id === 'unassigned') {
        $where[] = "(assigned_sales_id IS NULL OR assigned_sales_id = 0)";
    } elseif ($sales_id !== '') {
        $where[] = "assigned_sales_id = ?";
        $params[] = (int)$sales_id;
    } else {
        // Default if sales_id is empty: only show assigned_sales_id = 0 (empty)
        $where[] = "assigned_sales_id = 0";
    }

    if ($status !== '' && $status !== 'all') {
        if ($status === 'belum_fu' || $status === 'Belum Dihubungi') {
            $where[] = "(followup_status = 'Belum Dihubungi' OR followup_status IS NULL OR followup_status = '')";
        } elseif ($status === 'sudah_fu') {
            $where[] = "(followup_status != 'Belum Dihubungi' AND followup_status IS NOT NULL AND followup_status != '')";
        } else {
            $where[] = "followup_status = ?";
            $params[] = $status;
        }
    }

    if ($category !== '' && $category !== 'all') {
        $where[] = "followup_category = ?";
        $params[] = $category;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT * FROM followup_customers $whereSql ORDER BY id DESC LIMIT 5000";
    
    $customers = followup_query($sql, $params);
    $salesList = get_sales_list();
    $salesMap = [];
    foreach ($salesList as $s) {
        $salesMap[$s['id']] = $s;
    }

    // Attach sales name
    foreach ($customers as &$c) {
        $sid = (int)($c['assigned_sales_id'] ?? 0);
        $c['sales_name'] = isset($salesMap[$sid]) ? $salesMap[$sid]['name'] : 'Belum Ditugaskan';
        $c['sales_phone'] = isset($salesMap[$sid]) ? $salesMap[$sid]['phone'] : '';
    }

    echo json_encode([
        'success' => true,
        'count' => count($customers),
        'data' => $customers
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup.php?action=stats
// -------------------------------------------------------------
if ($action === 'stats') {
    $sales_id = isset($_GET['sales_id']) ? trim($_GET['sales_id']) : '';

    $whereSql = "";
    $params = [];
    if ($sales_id !== '' && $sales_id !== 'all') {
        $whereSql = "WHERE assigned_sales_id = ?";
        $params[] = (int)$sales_id;
    }

    $allCust = followup_query("SELECT id, followup_status, followup_category, assigned_sales_id FROM followup_customers $whereSql", $params);

    $total = count($allCust);
    $unassigned = 0;
    $byStatus = [
        'Belum Dihubungi' => 0,
        'Menunggu Respon' => 0,
        'Tertarik / Jadwal Servis' => 0,
        'Deal / Selesai' => 0,
        'Tidak Tertarik' => 0
    ];
    $byCategory = [];

    foreach ($allCust as $c) {
        if (empty($c['assigned_sales_id'])) $unassigned++;
        $st = $c['followup_status'] ?: 'Belum Dihubungi';
        if (isset($byStatus[$st])) $byStatus[$st]++;
        else $byStatus[$st] = 1;

        $cat = $c['followup_category'] ?: 'Servis Berkala';
        if (!isset($byCategory[$cat])) $byCategory[$cat] = 0;
        $byCategory[$cat]++;
    }

    $salesList = get_sales_list();
    $salesPerformance = [];
    $readyForRefillSales = [];

    foreach ($salesList as $s) {
        $sid = $s['id'];
        $assigned = array_filter($allCust, fn($x) => (int)($x['assigned_sales_id'] ?? 0) === $sid);
        $totalAssigned = count($assigned);
        $pending = array_filter($assigned, fn($x) => ($x['followup_status'] ?? '') === 'Belum Dihubungi');
        $pendingCount = count($pending);
        $processedCount = $totalAssigned - $pendingCount;
        $success = array_filter($assigned, fn($x) => ($x['followup_status'] ?? '') === 'Deal / Selesai');
        $successCount = count($success);

        $completionRate = $totalAssigned > 0 ? round(($processedCount / $totalAssigned) * 100) : 0;
        $needsRefill = ($totalAssigned > 0 && ($pendingCount <= 5 || $completionRate >= 80));

        $item = [
            'id' => $s['id'],
            'name' => $s['name'],
            'phone' => $s['phone'],
            'role' => $s['role'],
            'spv' => $s['spv'] ?? 'Umum',
            'target_monthly' => $s['target_monthly'],
            'total_assigned' => $totalAssigned,
            'pending_count' => $pendingCount,
            'processed_count' => $processedCount,
            'success_count' => $successCount,
            'completion_rate' => $completionRate,
            'needs_refill' => $needsRefill
        ];

        $salesPerformance[] = $item;
        if ($needsRefill) {
            $readyForRefillSales[] = $item;
        }
    }

    echo json_encode([
        'success' => true,
        'stats' => [
            'total' => $total,
            'unassigned' => $unassigned,
            'byStatus' => $byStatus,
            'byCategory' => $byCategory,
            'salesPerformance' => $salesPerformance,
            'readyForRefillSales' => $readyForRefillSales
        ]
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup.php?action=sales
// -------------------------------------------------------------
if ($action === 'sales') {
    $spv = isset($_GET['spv']) ? trim($_GET['spv']) : '';
    $salesList = get_sales_list($spv);
    $allCust = followup_query("SELECT assigned_sales_id, followup_status FROM followup_customers");

    foreach ($salesList as &$s) {
        $sid = $s['id'];
        $assigned = array_filter($allCust, fn($x) => (int)($x['assigned_sales_id'] ?? 0) === $sid);
        $totalAssigned = count($assigned);
        $pending = array_filter($assigned, fn($x) => ($x['followup_status'] ?? '') === 'Belum Dihubungi');
        $pendingCount = count($pending);
        $processedCount = $totalAssigned - $pendingCount;
        $deal = array_filter($assigned, fn($x) => ($x['followup_status'] ?? '') === 'Deal / Selesai');

        $completionRate = $totalAssigned > 0 ? round(($processedCount / $totalAssigned) * 100) : 0;
        $needsRefill = ($totalAssigned > 0 && ($pendingCount <= 5 || $completionRate >= 80));

        $s['total_customers'] = $totalAssigned;
        $s['pending_customers'] = $pendingCount;
        $s['processed_customers'] = $processedCount;
        $s['deal_customers'] = count($deal);
        $s['completion_rate'] = $completionRate;
        $s['needs_refill'] = $needsRefill;
    }

    echo json_encode([
        'success' => true,
        'data' => $salesList
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup.php?action=templates
// -------------------------------------------------------------
if ($action === 'templates') {
    $templates = followup_query("SELECT * FROM followup_templates ORDER BY is_default DESC, id ASC");
    echo json_encode([
        'success' => true,
        'data' => $templates
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=save_template
// -------------------------------------------------------------
if ($action === 'save_template') {
    $input = get_json_input();
    $id = (int)($input['id'] ?? 0);
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? 'kustom');
    $content = trim($input['content'] ?? '');
    $sales_id = !empty($input['sales_id']) ? (int)$input['sales_id'] : null;
    $created_by = trim($input['created_by'] ?? '');

    if (!$title || !$content) {
        echo json_encode(['success' => false, 'message' => 'Judul template dan isi pesan tidak boleh kosong']);
        exit;
    }

    if ($id > 0) {
        // Update existing template
        $existing = followup_query("SELECT * FROM followup_templates WHERE id = ? LIMIT 1", [$id]);
        if (empty($existing)) {
            echo json_encode(['success' => false, 'message' => 'Template tidak ditemukan']);
            exit;
        }

        followup_execute("
            UPDATE followup_templates 
            SET title = ?, category = ?, content = ?, sales_id = ?, created_by = ?
            WHERE id = ?
        ", [$title, $category, $content, $sales_id, $created_by, $id]);

        $savedId = $id;
        $msg = 'Template berhasil diperbarui!';
    } else {
        // Insert new custom template
        followup_execute("
            INSERT INTO followup_templates (title, category, content, is_default, sales_id, created_by)
            VALUES (?, ?, ?, 0, ?, ?)
        ", [$title, $category, $content, $sales_id, $created_by]);

        $newRow = followup_query("SELECT id FROM followup_templates ORDER BY id DESC LIMIT 1");
        $savedId = !empty($newRow) ? (int)$newRow[0]['id'] : 0;
        $msg = 'Template kustom berhasil disimpan!';
    }

    $allTemplates = followup_query("SELECT * FROM followup_templates ORDER BY is_default DESC, id ASC");
    $savedTemplate = null;
    foreach ($allTemplates as $t) {
        if ((int)$t['id'] === $savedId) {
            $savedTemplate = $t;
            break;
        }
    }

    echo json_encode([
        'success' => true,
        'message' => $msg,
        'saved_id' => $savedId,
        'template' => $savedTemplate,
        'data' => $allTemplates
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=delete_template
// -------------------------------------------------------------
if ($action === 'delete_template') {
    $input = get_json_input();
    $id = (int)($input['id'] ?? 0);

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID template tidak valid']);
        exit;
    }

    $existing = followup_query("SELECT * FROM followup_templates WHERE id = ? LIMIT 1", [$id]);
    if (empty($existing)) {
        echo json_encode(['success' => false, 'message' => 'Template tidak ditemukan']);
        exit;
    }

    if ((int)$existing[0]['is_default'] === 1) {
        echo json_encode(['success' => false, 'message' => 'Template standar sistem tidak dapat dihapus']);
        exit;
    }

    followup_execute("DELETE FROM followup_templates WHERE id = ?", [$id]);
    $allTemplates = followup_query("SELECT * FROM followup_templates ORDER BY is_default DESC, id ASC");

    echo json_encode([
        'success' => true,
        'message' => 'Template kustom berhasil dihapus!',
        'data' => $allTemplates
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=create_customer
// -------------------------------------------------------------
if ($action === 'create_customer') {
    $input = get_json_input();
    $name = trim($input['name'] ?? '');
    $phone = clean_phone_number($input['phone'] ?? '');
    $car_model = trim($input['car_model'] ?? 'All New Kijang Innova Zenix');

    if (!$name || !$phone) {
        echo json_encode(['success' => false, 'message' => 'Nama dan Nomor WhatsApp wajib diisi']);
        exit;
    }

    $code = 'CUST-' . substr(time(), -6);
    $res = followup_execute("
        INSERT INTO followup_customers (
            customer_code, name, phone, email, car_model,
            last_car_model, car_age, recommended_model, alt_model_2, alt_model_3,
            cluster_name, priority, district, service_compliance, outlet_do, outlet_service,
            plate_number, vin, purchase_date, service_due_date, stnk_due_date, insurance_due_date,
            assigned_sales_id, followup_category, followup_status, notes, sync_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'web')
    ", [
        $code, $name, $phone, $input['email'] ?? '', $car_model,
        $input['last_car_model'] ?? '', $input['car_age'] ?? '', $input['recommended_model'] ?? '',
        $input['alt_model_2'] ?? '', $input['alt_model_3'] ?? '',
        $input['cluster_name'] ?? '', $input['priority'] ?? '', $input['district'] ?? '',
        $input['service_compliance'] ?? '', $input['outlet_do'] ?? '', $input['outlet_service'] ?? '',
        $input['plate_number'] ?? '', $input['vin'] ?? '', $input['purchase_date'] ?? '',
        $input['service_due_date'] ?? '', $input['stnk_due_date'] ?? '', $input['insurance_due_date'] ?? '',
        !empty($input['assigned_sales_id']) ? (int)$input['assigned_sales_id'] : null,
        $input['followup_category'] ?? 'Servis Berkala',
        $input['followup_status'] ?? 'Belum Dihubungi',
        $input['notes'] ?? ''
    ]);

    echo json_encode(['success' => true, 'message' => 'Customer baru berhasil ditambahkan']);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=update_customer
// -------------------------------------------------------------
if ($action === 'update_customer') {
    $input = get_json_input();
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID Customer tidak valid']);
        exit;
    }

    $phone = clean_phone_number($input['phone'] ?? '');

    followup_execute("
        UPDATE followup_customers SET
            name = ?, phone = ?, email = ?, car_model = ?,
            last_car_model = ?, car_age = ?, recommended_model = ?,
            cluster_name = ?, priority = ?, district = ?,
            plate_number = ?, vin = ?, purchase_date = ?,
            service_due_date = ?, stnk_due_date = ?,
            assigned_sales_id = ?, followup_category = ?, followup_status = ?, notes = ?
        WHERE id = ?
    ", [
        $input['name'] ?? '', $phone, $input['email'] ?? '', $input['car_model'] ?? '',
        $input['last_car_model'] ?? '', $input['car_age'] ?? '', $input['recommended_model'] ?? '',
        $input['cluster_name'] ?? '', $input['priority'] ?? '', $input['district'] ?? '',
        $input['plate_number'] ?? '', $input['vin'] ?? '', $input['purchase_date'] ?? '',
        $input['service_due_date'] ?? '', $input['stnk_due_date'] ?? '',
        !empty($input['assigned_sales_id']) ? (int)$input['assigned_sales_id'] : null,
        $input['followup_category'] ?? 'Servis Berkala',
        $input['followup_status'] ?? 'Belum Dihubungi',
        $input['notes'] ?? '',
        $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Data customer berhasil diperbarui']);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=bulk_assign
// -------------------------------------------------------------
if ($action === 'bulk_assign') {
    $input = get_json_input();
    $customer_ids = $input['customer_ids'] ?? [];
    $sales_id = $input['sales_id'] ?? null;
    $auto_distribute = !empty($input['auto_distribute']);

    if (empty($customer_ids) || !is_array($customer_ids)) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada customer yang dipilih']);
        exit;
    }

    $salesList = get_sales_list();
    if (empty($salesList)) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada tim sales aktif']);
        exit;
    }

    if ($auto_distribute) {
        $numSales = count($salesList);
        for ($i = 0; $i < count($customer_ids); $i++) {
            $cid = (int)$customer_ids[$i];
            $assignedSales = $salesList[$i % $numSales];
            followup_execute("UPDATE followup_customers SET assigned_sales_id = ? WHERE id = ?", [$assignedSales['id'], $cid]);
            followup_execute("INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note) VALUES (?, ?, ?, 'assigned', 'Auto-distribusi ke sales')", [$cid, $assignedSales['id'], $assignedSales['name']]);
        }
        echo json_encode(['success' => true, 'message' => count($customer_ids) . " customer berhasil dibagi rata ke $numSales wiraniaga."]);
        exit;
    }

    $targetSales = null;
    foreach ($salesList as $s) {
        if ((int)$s['id'] === (int)$sales_id) {
            $targetSales = $s;
            break;
        }
    }

    if (!$targetSales) {
        echo json_encode(['success' => false, 'message' => 'Sales target tidak ditemukan']);
        exit;
    }

    foreach ($customer_ids as $cid) {
        $cid = (int)$cid;
        followup_execute("UPDATE followup_customers SET assigned_sales_id = ? WHERE id = ?", [$targetSales['id'], $cid]);
        followup_execute("INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note) VALUES (?, ?, ?, 'assigned', ?)", [$cid, $targetSales['id'], $targetSales['name'], "Ditugaskan ke " . $targetSales['name']]);
    }

    echo json_encode(['success' => true, 'message' => count($customer_ids) . " customer berhasil ditugaskan ke " . $targetSales['name']]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: GET /api_followup.php?action=orphan_leads
// Pool Rebutan Prospek (Ex-Sales / Unassigned Leads)
// -------------------------------------------------------------
if ($action === 'orphan_leads') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';

    $where = ["is_orphan = 1", "(assigned_sales_id IS NULL OR assigned_sales_id = 0)", "(followup_status != 'Deal / Selesai' OR followup_status IS NULL)"];
    $params = [];

    if ($search !== '') {
        $where[] = "(name LIKE ? OR phone LIKE ? OR plate_number LIKE ? OR car_model LIKE ? OR vin LIKE ? OR last_car_model LIKE ? OR district LIKE ?)";
        $sTerm = "%$search%";
        $params = array_merge($params, [$sTerm, $sTerm, $sTerm, $sTerm, $sTerm, $sTerm, $sTerm]);
    }

    if ($category !== '' && $category !== 'all') {
        $where[] = "followup_category = ?";
        $params[] = $category;
    }

    $whereSql = "WHERE " . implode(" AND ", $where);
    // Order by records that have prior notes/progress first, then newest
    $sql = "SELECT * FROM followup_customers $whereSql ORDER BY (CASE WHEN (remarks IS NOT NULL AND remarks != '') OR (reason_followup IS NOT NULL AND reason_followup != '') THEN 1 ELSE 0 END) DESC, id DESC LIMIT 100";

    $orphans = followup_query($sql, $params);

    echo json_encode([
        'success' => true,
        'count' => count($orphans),
        'data' => $orphans
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=claim_orphan_lead
// Rebut Prospek Terbengkalai (Atomic First-Come First-Served)
// -------------------------------------------------------------
if ($action === 'claim_orphan_lead') {
    $input = get_json_input();
    $customer_id = (int)($input['customer_id'] ?? 0);
    $sales_id = (int)($input['sales_id'] ?? 0);

    if (!$customer_id || !$sales_id) {
        echo json_encode(['success' => false, 'message' => 'ID Customer atau ID Sales tidak valid']);
        exit;
    }

    // 1. Check current lead status
    $stmt = followup_query("SELECT id, name, assigned_sales_id, connected, contacted, prospect, spk, remarks, reason_followup, followup_date FROM followup_customers WHERE id = ? LIMIT 1", [$customer_id]);
    if (empty($stmt)) {
        echo json_encode(['success' => false, 'message' => 'Data prospek tidak ditemukan']);
        exit;
    }

    $c = $stmt[0];
    $currentAssigned = (int)($c['assigned_sales_id'] ?? 0);

    // If already taken by someone else (not 0 and not current sales)
    if ($currentAssigned !== 0 && $currentAssigned !== $sales_id) {
        echo json_encode([
            'success' => false,
            'message' => 'Yah! Prospek ' . $c['name'] . ' baru saja diambil alih oleh rekan sales lain. Silakan pilih prospek lainnya di Pool Rebutan.'
        ]);
        exit;
    }

    // 2. Atomic Claim: Update assigned_sales_id to the new claiming sales and clear is_orphan
    $affected = followup_execute("UPDATE followup_customers SET assigned_sales_id = ?, is_orphan = 0 WHERE id = ? AND (assigned_sales_id IS NULL OR assigned_sales_id = 0 OR assigned_sales_id = ?)", [$sales_id, $customer_id, $sales_id]);

    $salesList = get_sales_list();
    $salesName = "Sales #$sales_id";
    foreach ($salesList as $s) {
        if ((int)$s['id'] === $sales_id) {
            $salesName = $s['name'];
            break;
        }
    }

    // 3. Record Audit Log
    followup_execute("INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note) VALUES (?, ?, ?, 'claimed', ?)", [
        $customer_id,
        $sales_id,
        $salesName,
        "Prospek ex-sales berhasil diambil alih oleh $salesName (Pool Rebutan)"
    ]);

    // 4. Return updated customer record
    $updatedCust = followup_query("SELECT * FROM followup_customers WHERE id = ? LIMIT 1", [$customer_id]);

    echo json_encode([
        'success' => true,
        'message' => "🏆 Selamat! Prospek {$c['name']} berhasil Anda ambil alih. Database ini kini masuk ke daftar tugas Anda.",
        'customer' => !empty($updatedCust) ? $updatedCust[0] : null
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=release_to_pool
// SPV Melepas Customer ke Pool Rebutan
// -------------------------------------------------------------
if ($action === 'release_to_pool') {
    $input = get_json_input();
    $customer_ids = $input['customer_ids'] ?? [];
    if (empty($customer_ids) || !is_array($customer_ids)) {
        echo json_encode(['success' => false, 'message' => 'Pilih customer yang ingin dilepas ke Pool Rebutan']);
        exit;
    }

    foreach ($customer_ids as $cid) {
        $cid = (int)$cid;
        followup_execute("UPDATE followup_customers SET assigned_sales_id = NULL, is_orphan = 1, released_at = NOW() WHERE id = ?", [$cid]);
        followup_execute("INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note) VALUES (?, NULL, 'SPV', 'released', 'Dilepas ke Pool Rebutan oleh SPV')", [$cid]);
    }

    echo json_encode([
        'success' => true,
        'message' => count($customer_ids) . " customer berhasil dilepas ke Pool Rebutan Prospek."
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=update_status
// -------------------------------------------------------------
if ($action === 'update_status' || $action === 'save_sales_followup') {
    $input = get_json_input();
    $id = (int)($input['id'] ?? 0);
    $sales_id = (int)($input['sales_id'] ?? 0);

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID customer tidak valid']);
        exit;
    }

    $current = followup_query("SELECT followup_status, connected, contacted, prospect, spk, remarks, sales_fu_status, reason_followup, notes, assigned_sales_id, followup_date FROM followup_customers WHERE id = ? LIMIT 1", [$id]);
    $curr = !empty($current) ? $current[0] : [];

    // 1. Connected (No. Aktif / Tersambung)
    if (isset($input['connected']) && $input['connected'] !== '') {
        $cRaw = strtoupper(trim($input['connected']));
        $connected = ($cRaw === 'IYA' || $cRaw === 'YA' || $cRaw === '1' || $cRaw === 'TRUE') ? 'TRUE' : 'FALSE';
    } else {
        if (!empty($input['status']) && $input['status'] !== 'Belum Dihubungi') {
            $connected = 'TRUE';
        } else {
            $connected = !empty($curr['connected']) ? $curr['connected'] : 'FALSE';
        }
    }

    // 2. Contacted (Respon / Komunikasi Terkirim)
    if (isset($input['contacted']) && $input['contacted'] !== '') {
        $cRaw = strtoupper(trim($input['contacted']));
        $contacted = ($cRaw === 'IYA' || $cRaw === 'YA' || $cRaw === '1' || $cRaw === 'TRUE') ? 'TRUE' : 'FALSE';
    } else {
        if (!empty($input['status']) && $input['status'] !== 'Belum Dihubungi') {
            $contacted = 'TRUE';
        } else {
            $contacted = !empty($curr['contacted']) ? $curr['contacted'] : 'FALSE';
        }
    }

    // 3. Prospect (Minat Beli / Upgrade)
    if (isset($input['prospect']) && $input['prospect'] !== '') {
        $pRaw = strtoupper(trim($input['prospect']));
        $prospect = ($pRaw === 'IYA' || $pRaw === 'YA' || $pRaw === '1' || $pRaw === 'TRUE') ? 'TRUE' : 'FALSE';
    } else {
        $prospect = !empty($curr['prospect']) ? $curr['prospect'] : 'FALSE';
    }

    // 4. SPK (Closing Transaksi)
    if (isset($input['spk']) && $input['spk'] !== '') {
        $sRaw = strtoupper(trim($input['spk']));
        $spk = ($sRaw === 'IYA' || $sRaw === 'YA' || $sRaw === '1' || $sRaw === 'TRUE') ? 'TRUE' : 'FALSE';
    } else {
        $spk = !empty($curr['spk']) ? $curr['spk'] : 'FALSE';
    }

    // Smart Cascading logic
    if ($spk === 'TRUE') {
        $prospect = 'TRUE';
        $contacted = 'TRUE';
        $connected = 'TRUE';
    } elseif ($prospect === 'TRUE') {
        $contacted = 'TRUE';
        $connected = 'TRUE';
    } elseif ($contacted === 'TRUE') {
        $connected = 'TRUE';
    }

    $reason_followup = trim($input['reason_followup'] ?? ($input['reason'] ?? ($input['notes'] ?? '')));
    if ($reason_followup === '') {
        $reason_followup = $curr['reason_followup'] ?? '';
    }

    $template_used = trim($input['template_used'] ?? '');

    // Remarks
    $remarks = trim($input['remarks'] ?? '');
    if ($remarks === '') {
        if ($spk === 'TRUE') $remarks = 'SPK berhasil';
        elseif ($prospect === 'TRUE') $remarks = 'Customer tertarik';
        elseif ($contacted === 'TRUE' || $connected === 'TRUE') $remarks = 'Customer pending';
        elseif ($connected === 'FALSE' && $contacted === 'FALSE' && (isset($input['connected']) || isset($input['contacted']))) $remarks = 'Customer tidak diangkat';
        else $remarks = $curr['remarks'] ?? '';
    }

    // Status Determination:
    $status = trim($input['status'] ?? '');
    if (!$status || $status === 'Belum Dihubungi') {
        if ($spk === 'TRUE' || $remarks === 'SPK berhasil') {
            $status = 'Deal / Selesai';
        } elseif ($prospect === 'TRUE' || $remarks === 'Customer tertarik') {
            $status = 'Tertarik / Jadwal Servis';
        } elseif ($remarks === 'Customer menolak' || $remarks === 'Customer tidak aktif' || ($connected === 'FALSE' && $contacted === 'FALSE' && (isset($input['connected']) || isset($input['contacted'])))) {
            $status = 'Tidak Tertarik';
        } elseif ($connected === 'TRUE' || $contacted === 'TRUE' || $remarks === 'Customer janjian' || $remarks === 'Customer pending' || !empty($reason_followup)) {
            $status = 'Menunggu Respon';
        } else {
            if ($action === 'save_sales_followup') {
                $status = 'Menunggu Respon';
            } else {
                $status = !empty($curr['followup_status']) ? $curr['followup_status'] : 'Belum Dihubungi';
            }
        }
    }

    // Sales FU Status (Open vs Closed)
    $sales_fu_status = trim($input['sales_fu_status'] ?? ($input['status_fu'] ?? ''));
    if ($sales_fu_status === '') {
        if ($status === 'Deal / Selesai' || $status === 'Tidak Tertarik' || $remarks === 'SPK berhasil' || $remarks === 'Customer menolak' || $remarks === 'Customer tidak aktif') {
            $sales_fu_status = 'Closed';
        } else {
            $sales_fu_status = 'Open';
        }
    }

    $now = date('Y-m-d H:i:s');
    $current = followup_query("SELECT followup_status, notes, assigned_sales_id FROM followup_customers WHERE id = ? LIMIT 1", [$id]);
    $oldStatus = !empty($current) ? $current[0]['followup_status'] : '';

    followup_execute("
        UPDATE followup_customers SET
            connected = ?,
            contacted = ?,
            prospect = ?,
            spk = ?,
            remarks = ?,
            sales_fu_status = ?,
            reason_followup = ?,
            followup_date = ?,
            followup_status = ?,
            notes = CASE WHEN ? != '' THEN ? ELSE notes END,
            last_contacted_at = ?,
            last_template_used = CASE WHEN ? != '' THEN ? ELSE last_template_used END
        WHERE id = ?
    ", [
        $connected, $contacted, $prospect, $spk, $remarks,
        $sales_fu_status, $reason_followup, $now,
        $status,
        $reason_followup, $reason_followup,
        $now,
        $template_used, $template_used,
        $id
    ]);

    followup_execute("
        INSERT INTO followup_logs (customer_id, sales_id, action_type, old_status, new_status, note)
        VALUES (?, ?, 'sales_fu_submission', ?, ?, ?)
    ", [
        $id,
        $sales_id ?: ($current[0]['assigned_sales_id'] ?? null),
        $oldStatus,
        $status,
        "Follow-Up TAM: Connected=$connected, Contacted=$contacted, Prospect=$prospect, SPK=$spk, Remarks=$remarks, Status=$sales_fu_status. Alasan: $reason_followup"
    ]);

    // Push to Google Apps Script Webhook if configured (2-Way Realtime Sync)
    try {
        $webhookRows = followup_query("SELECT setting_value FROM followup_settings WHERE setting_key = 'google_apps_script_url' LIMIT 1");
        if (!empty($webhookRows) && !empty($webhookRows[0]['setting_value'])) {
            $scriptUrl = trim($webhookRows[0]['setting_value']);
            if (filter_var($scriptUrl, FILTER_VALIDATE_URL)) {
                $salesList = get_sales_list();
                $salesName = "Sales #$sales_id";
                foreach ($salesList as $s) {
                    if ((int)$s['id'] === $sales_id) {
                        $salesName = $s['name'];
                        break;
                    }
                }
                $cCust = followup_query("SELECT vin, phone, name FROM followup_customers WHERE id = ? LIMIT 1", [$id]);
                $vin = !empty($cCust) ? $cCust[0]['vin'] : '';
                $phone = !empty($cCust) ? $cCust[0]['phone'] : '';

                $webhookPayload = [
                    'customer_id' => $id,
                    'vin' => $vin,
                    'phone' => $phone,
                    'name' => !empty($cCust) ? $cCust[0]['name'] : '',
                    'connected' => $connected,
                    'contacted' => $contacted,
                    'prospect' => $prospect,
                    'spk' => $spk,
                    'remarks' => $remarks,
                    'reason_followup' => $reason_followup,
                    'followup_date' => $now,
                    'sales_name' => $salesName,
                    'status' => $status
                ];

                $opts = [
                    'http' => [
                        'method' => 'POST',
                        'header' => "Content-Type: application/json\r\n",
                        'content' => json_encode($webhookPayload),
                        'timeout' => 3
                    ],
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false
                    ]
                ];
                @file_get_contents($scriptUrl, false, stream_context_create($opts));
            }
        }
    } catch (Exception $e) {
        // Silently continue so CRM operation is not blocked
    }

    echo json_encode([
        'success' => true,
        'message' => 'Data respon follow-up berhasil disimpan secara otomatis.',
        'followup_date' => $now,
        'status' => $status,
        'sales_fu_status' => $sales_fu_status
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=format_template
// -------------------------------------------------------------
if ($action === 'format_template') {
    $input = get_json_input();
    $customer_id = (int)($input['customer_id'] ?? 0);
    $template_id = (int)($input['template_id'] ?? 0);
    $raw_content = $input['raw_content'] ?? '';
    $sales_id = (int)($input['sales_id'] ?? 0);

    $custRows = followup_query("SELECT * FROM followup_customers WHERE id = ? LIMIT 1", [$customer_id]);
    if (empty($custRows)) {
        echo json_encode(['success' => false, 'message' => 'Customer tidak ditemukan']);
        exit;
    }
    $c = $custRows[0];

    $content = $raw_content;
    if ($template_id) {
        $tmplRows = followup_query("SELECT content FROM followup_templates WHERE id = ? LIMIT 1", [$template_id]);
        if (!empty($tmplRows)) $content = $tmplRows[0]['content'];
    }

    $salesList = get_sales_list();
    $salesName = !empty($input['sales_name']) ? trim($input['sales_name']) : 'Sales Tunas Toyota';
    $salesPhone = '';
    foreach ($salesList as $s) {
        if ($sales_id && (int)$s['id'] === $sales_id) {
            if (empty($input['sales_name'])) $salesName = $s['name'];
            $salesPhone = $s['phone'];
            break;
        } elseif (!$sales_id && (int)$s['id'] === (int)($c['assigned_sales_id'] ?? 0)) {
            if (empty($input['sales_name'])) $salesName = $s['name'];
            $salesPhone = $s['phone'];
            break;
        }
    }
    if (!empty($input['sales_name'])) {
        $salesName = trim($input['sales_name']);
    }

    $formatted = format_whatsapp_followup_text($content, $c, $salesName, $salesPhone);

    $cleanPhone = clean_phone_number($c['phone']);
    $waUrl = "https://wa.me/{$cleanPhone}?text=" . rawurlencode($formatted);

    echo json_encode([
        'success' => true,
        'formatted_text' => $formatted,
        'wa_url' => $waUrl,
        'customer_phone' => $cleanPhone,
        'customer_name' => $c['name']
    ]);
    exit;
}

/**
 * Universal Intelligent WhatsApp Follow-Up Text Formatter
 * Distinguishes between Mobil Saat Ini (Current Car) and Target Upgrade (Recommended Model)
 */
function format_whatsapp_followup_text($content, $c, $salesName = '', $salesPhone = '') {
    $custName = trim($c['name'] ?? '');

    // 1. Current Vehicle Owned by Customer (Mobil Saat Ini)
    $lastCarRaw = trim($c['last_car_model'] ?? '');
    if ($lastCarRaw === '-' || $lastCarRaw === 'NO DATA' || strtolower($lastCarRaw) === 'null') {
        $lastCarRaw = '';
    }

    // 2. Target Upgrade Model from TAM
    $recModelRaw = trim($c['recommended_model'] ?? '');
    if (!$recModelRaw || $recModelRaw === '-' || $recModelRaw === 'NO DATA' || strtolower($recModelRaw) === 'null') {
        $recModelRaw = trim($c['car_model'] ?? '');
    }
    if (!$recModelRaw || $recModelRaw === '-' || $recModelRaw === 'NO DATA' || strtolower($recModelRaw) === 'null') {
        $recModelRaw = 'Toyota Terbaru';
    }

    $carAgeRaw = trim($c['car_age'] ?? '');
    if ($carAgeRaw === '-' || $carAgeRaw === 'NO DATA' || strtolower($carAgeRaw) === 'null') {
        $carAgeRaw = '';
    }

    $districtRaw = trim($c['district'] ?? '');
    if ($districtRaw === '-' || $districtRaw === 'NO DATA' || strtolower($districtRaw) === 'null') {
        $districtRaw = '';
    }

    $plateRaw = trim($c['plate_number'] ?? '');
    if ($plateRaw === '-' || $plateRaw === 'NO DATA' || strtolower($plateRaw) === 'null') {
        $plateRaw = '';
    }

    $stnkDueRaw = trim($c['stnk_due_date'] ?? '');
    if (!$stnkDueRaw || $stnkDueRaw === '-' || $stnkDueRaw === 'NO DATA') {
        $stnkDueRaw = 'bulan ini';
    }

    // 3. Smart Phrasing construction based on whether last_car_model exists
    if ($lastCarRaw !== '') {
        $mobilSaatIniTeks = "*{$lastCarRaw}*";
        $teksKendaraanLama = " *{$lastCarRaw}*" . ($carAgeRaw ? " ({$carAgeRaw})" : "");
        $tanyaPengalaman = "Bagaimana pengalaman berkendara dengan mobil *{$lastCarRaw}* Bpk/Ibu selama ini? Apakah semuanya berjalan nyaman dan memuaskan?";
        $teksStnkUnit = " *{$lastCarRaw}*" . ($plateRaw ? " (*{$plateRaw}*)" : "");
    } else {
        $mobilSaatIniTeks = "mobil Toyota Bpk/Ibu";
        $teksKendaraanLama = "";
        $tanyaPengalaman = "Bagaimana pengalaman berkendara dengan mobil Toyota Bpk/Ibu selama ini? Apakah semuanya berjalan nyaman dan memuaskan?";
        $teksStnkUnit = $plateRaw ? " (*{$plateRaw}*)" : "";
    }

    $teksKecamatan = $districtRaw ? " di Kec. {$districtRaw}" : "";

    $salesNameDisplay = $salesName ?: 'Sales Tunas Toyota';
    $dealerName = 'Tunas Toyota Kiara Condong';

    // Handle asterisk-wrapped tags first to prevent double asterisks
    $replacementsWrapped = [
        '*{mobil_saat_ini}*'     => $mobilSaatIniTeks,
        '*{kendaraan_terakhir}*' => $mobilSaatIniTeks,
        '*{tipe_mobil}*'         => $mobilSaatIniTeks,
        '*{model_rekomendasi}*'  => "*{$recModelRaw}*",
        '*{target_upgrade}*'     => "*{$recModelRaw}*",
    ];
    $content = str_ireplace(array_keys($replacementsWrapped), array_values($replacementsWrapped), $content);

    // 4. Replacement Map
    $replacements = [
        '{tanya_pengalaman_berkendara}' => $tanyaPengalaman,
        '{teks_kendaraan_lama}'         => $teksKendaraanLama,
        '{teks_mobil_saat_ini}'         => ($lastCarRaw !== '' ? " *{$lastCarRaw}*" : ""),
        '{teks_stnk_unit}'              => $teksStnkUnit,
        '{teks_kecamatan}'              => $teksKecamatan,
        
        '{nama_customer}'               => $custName,
        '{mobil_saat_ini}'              => $mobilSaatIniTeks,
        '{kendaraan_terakhir}'          => $mobilSaatIniTeks,
        '{tipe_mobil}'                  => $mobilSaatIniTeks, // Guarantees current car, never upgrade target
        '{model_rekomendasi}'           => "*{$recModelRaw}*",
        '{target_upgrade}'              => "*{$recModelRaw}*",
        '{model_alternatif}'            => trim($c['alt_model_2'] ?? ''),
        '{usia_kendaraan}'              => ($carAgeRaw ?: '3 Tahun'),
        '{cluster}'                     => trim($c['cluster_name'] ?? ''),
        '{prioritas}'                   => trim($c['priority'] ?? ''),
        '{kecamatan}'                   => $districtRaw,
        '{kepatuhan_servis}'            => trim($c['service_compliance'] ?? ''),
        '{nopol}'                       => ($plateRaw ?: '-'),
        '{vin}'                         => trim($c['vin'] ?? '-'),
        '{tgl_beli}'                    => trim($c['purchase_date'] ?? '-'),
        '{jatuh_tempo_servis}'          => trim($c['service_due_date'] ?? '-'),
        '{jatuh_tempo_stnk}'            => $stnkDueRaw,
        '{nama_sales}'                  => $salesNameDisplay,
        '{no_wa_sales}'                 => $salesPhone,
        '{dealer}'                      => $dealerName
    ];

    $formatted = str_ireplace(array_keys($replacements), array_values($replacements), $content);
    $formatted = preg_replace('/\\*{2,}/', '*', $formatted);

    return $formatted;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=notify_sales_task
// -------------------------------------------------------------
if ($action === 'notify_sales_task') {
    $input = get_json_input();
    $sales_id = (int)($input['sales_id'] ?? 0);

    $salesList = get_sales_list();
    $targetSales = null;
    foreach ($salesList as $s) {
        if ((int)$s['id'] === $sales_id) {
            $targetSales = $s;
            break;
        }
    }

    if (!$targetSales) {
        echo json_encode(['success' => false, 'message' => 'Sales tidak ditemukan']);
        exit;
    }

    $assignedCust = followup_query("
        SELECT name, phone, car_model, followup_category, followup_status
        FROM followup_customers
        WHERE assigned_sales_id = ?
        ORDER BY id DESC LIMIT 10
    ", [$sales_id]);

    $totalAssigned = count($assignedCust);
    $text = "Halo *{$targetSales['name']}*,\n\nBerikut daftar instruksi tugas Follow-Up Customer terbaru dari Supervisor *Tunas Toyota Kiara Condong*:\n\n";
    $i = 1;
    foreach ($assignedCust as $c) {
        $text .= "$i. *{$c['name']}* ({$c['phone']})\n   🚗 Unit: {$c['car_model']}\n   📌 Kategori: {$c['followup_category']}\n   ⚙️ Status: {$c['followup_status']}\n\n";
        $i++;
    }
    $text .= "Mohon segera lakukan follow-up dan perbarui status di aplikasi Sales ya. Terima kasih! Semangat closing! 🚀";

    $cleanSalesPhone = clean_phone_number($targetSales['phone']);
    $waUrl = "https://wa.me/{$cleanSalesPhone}?text=" . rawurlencode($text);

    echo json_encode([
        'success' => true,
        'wa_url' => $waUrl,
        'sales_name' => $targetSales['name'],
        'total_task' => $totalAssigned
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=delete_customer
// -------------------------------------------------------------
if ($action === 'delete_customer') {
    $input = get_json_input();
    $id = (int)($input['id'] ?? 0);

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID customer tidak valid']);
        exit;
    }

    $cust = followup_query("SELECT name FROM followup_customers WHERE id = ? LIMIT 1", [$id]);
    $name = !empty($cust) ? $cust[0]['name'] : "ID #$id";

    followup_execute("DELETE FROM followup_customers WHERE id = ?", [$id]);
    followup_execute("DELETE FROM followup_logs WHERE customer_id = ?", [$id]);

    echo json_encode(['success' => true, 'message' => "Customer '$name' berhasil dihapus dari database."]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=bulk_delete
// -------------------------------------------------------------
if ($action === 'bulk_delete') {
    $input = get_json_input();
    $customer_ids = $input['customer_ids'] ?? [];

    if (empty($customer_ids) || !is_array($customer_ids)) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada customer yang dipilih untuk dihapus']);
        exit;
    }

    $deletedCount = 0;
    foreach ($customer_ids as $cid) {
        $cid = (int)$cid;
        if ($cid > 0) {
            followup_execute("DELETE FROM followup_customers WHERE id = ?", [$cid]);
            followup_execute("DELETE FROM followup_logs WHERE customer_id = ?", [$cid]);
            $deletedCount++;
        }
    }

    echo json_encode(['success' => true, 'message' => "$deletedCount data customer berhasil dihapus secara massal."]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=reset_database
// -------------------------------------------------------------
if ($action === 'reset_database') {
    followup_execute("DELETE FROM followup_customers");
    followup_execute("DELETE FROM followup_logs");

    echo json_encode(['success' => true, 'message' => 'Seluruh database customer berhasil dikosongkan.']);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=distribute_quota
// -------------------------------------------------------------
if ($action === 'distribute_quota') {
    $input = get_json_input();
    $selected_sales_ids = $input['sales_ids'] ?? [];
    $quota_per_sales = (int)($input['quota_per_sales'] ?? 50); // 50, 100, etc. (or 0 for divide evenly)
    $category = trim($input['category'] ?? 'all');
    $only_unassigned = !isset($input['only_unassigned']) || !empty($input['only_unassigned']);

    if (empty($selected_sales_ids) || !is_array($selected_sales_ids)) {
        echo json_encode(['success' => false, 'message' => 'Pilih minimal 1 wiraniaga penerima leads']);
        exit;
    }

    $salesList = get_sales_list();
    $salesMap = [];
    foreach ($salesList as $s) {
        $salesMap[$s['id']] = $s;
    }

    // Filter only valid selected sales
    $targetSalesList = [];
    foreach ($selected_sales_ids as $sid) {
        $sid = (int)$sid;
        if (isset($salesMap[$sid])) {
            $targetSalesList[] = $salesMap[$sid];
        }
    }

    if (empty($targetSalesList)) {
        echo json_encode(['success' => false, 'message' => 'Sales terpilih tidak valid atau tidak aktif']);
        exit;
    }

    // Build query for available leads
    $where = [];
    $params = [];

    if ($only_unassigned) {
        $where[] = "(assigned_sales_id IS NULL OR assigned_sales_id = 0)";
    }

    if ($category !== '' && $category !== 'all') {
        $where[] = "followup_category = ?";
        $params[] = $category;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $availableLeads = followup_query("SELECT id, name, phone, car_model, followup_category FROM followup_customers $whereSql ORDER BY id DESC", $params);

    $totalAvailable = count($availableLeads);
    if ($totalAvailable === 0) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada data leads yang tersedia untuk dibagikan']);
        exit;
    }

    $numSales = count($targetSalesList);
    
    // Calculate quota
    if ($quota_per_sales <= 0) {
        // Divide all available evenly
        $quota_per_sales = (int)ceil($totalAvailable / $numSales);
    }

    $totalAssigned = 0;
    $leadIndex = 0;
    $breakdown = [];

    foreach ($targetSalesList as $sales) {
        $salesId = $sales['id'];
        $assignedForThisSales = 0;
        $leadsForThisSales = [];

        for ($k = 0; $k < $quota_per_sales && $leadIndex < $totalAvailable; $k++) {
            $lead = $availableLeads[$leadIndex];
            $leadId = (int)$lead['id'];

            followup_execute("UPDATE followup_customers SET assigned_sales_id = ? WHERE id = ?", [$salesId, $leadId]);
            followup_execute("
                INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note)
                VALUES (?, ?, ?, 'quota_assigned', ?)
            ", [$leadId, $salesId, $sales['name'], "Ditugaskan via Smart Quota ($quota_per_sales per sales)"]);

            $leadsForThisSales[] = $lead;
            $assignedForThisSales++;
            $leadIndex++;
            $totalAssigned++;
        }

        // Generate WhatsApp recap link for this sales
        $waText = "Halo *{$sales['name']}*,\n\nAnda baru saja ditugaskan *{$assignedForThisSales} leads customer* untuk segera di-follow up:\n\n";
        $previewCount = min(5, count($leadsForThisSales));
        for ($p = 0; $p < $previewCount; $p++) {
            $l = $leadsForThisSales[$p];
            $waText .= ($p + 1) . ". *{$l['name']}* (+{$l['phone']})\n   🚗 Unit: {$l['car_model']}\n\n";
        }
        if (count($leadsForThisSales) > 5) {
            $waText .= "... dan *" . (count($leadsForThisSales) - 5) . " customer lainnya* di aplikasi SFT.\n\n";
        }
        $waText .= "Silakan buka aplikasi Sales CRM untuk melihat detail lengkap & follow up via WhatsApp sekarang! 🚀";

        $cleanPhone = clean_phone_number($sales['phone']);
        $waUrl = "https://wa.me/{$cleanPhone}?text=" . rawurlencode($waText);

        $breakdown[] = [
            'sales_id' => $salesId,
            'sales_name' => $sales['name'],
            'sales_phone' => $sales['phone'],
            'assigned_count' => $assignedForThisSales,
            'wa_url' => $waUrl
        ];
    }

    echo json_encode([
        'success' => true,
        'message' => "Berhasil membagikan total $totalAssigned leads kepada $numSales wiraniaga terpilih (masing-masing hingga $quota_per_sales leads).",
        'total_assigned' => $totalAssigned,
        'sales_count' => $numSales,
        'quota_per_sales' => $quota_per_sales,
        'breakdown' => $breakdown
    ]);
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST /api_followup.php?action=add_more_leads_to_sales
// -------------------------------------------------------------
if ($action === 'add_more_leads_to_sales') {
    $input = get_json_input();
    $sales_id = (int)($input['sales_id'] ?? 0);
    $quota = (int)($input['quota'] ?? 50);
    $category = trim($input['category'] ?? 'all');

    if (!$sales_id) {
        echo json_encode(['success' => false, 'message' => 'Sales ID tidak valid']);
        exit;
    }

    $salesList = get_sales_list();
    $targetSales = null;
    foreach ($salesList as $s) {
        if ($s['id'] === $sales_id) {
            $targetSales = $s;
            break;
        }
    }

    if (!$targetSales) {
        echo json_encode(['success' => false, 'message' => 'Sales tidak ditemukan']);
        exit;
    }

    // Get unassigned leads
    $where = ["(assigned_sales_id IS NULL OR assigned_sales_id = 0)"];
    $params = [];

    if ($category !== '' && $category !== 'all') {
        $where[] = "followup_category = ?";
        $params[] = $category;
    }

    $whereSql = "WHERE " . implode(" AND ", $where);
    $unassignedLeads = followup_query("SELECT id, name, phone, car_model, followup_category FROM followup_customers $whereSql ORDER BY id DESC LIMIT ?", array_merge($params, [$quota]));

    $totalFound = count($unassignedLeads);
    if ($totalFound === 0) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada sisa leads unassigned di database. Silakan impor data baru terlebih dahulu.']);
        exit;
    }

    foreach ($unassignedLeads as $lead) {
        $leadId = (int)$lead['id'];
        followup_execute("UPDATE followup_customers SET assigned_sales_id = ? WHERE id = ?", [$sales_id, $leadId]);
        followup_execute("
            INSERT INTO followup_logs (customer_id, sales_id, sales_name, action_type, note)
            VALUES (?, ?, ?, 'quota_refill', ?)
        ", [$leadId, $sales_id, $targetSales['name'], "Penambahan batch +$totalFound leads"]);
    }

    // WA Recap URL
    $waText = "Halo *{$targetSales['name']}*,\n\nSelamat atas progres follow-up Anda! Supervisor baru saja menambahkan *+{$totalFound} leads customer baru* ke akun Anda:\n\n";
    $previewCount = min(5, count($unassignedLeads));
    for ($p = 0; $p < $previewCount; $p++) {
        $l = $unassignedLeads[$p];
        $waText .= ($p + 1) . ". *{$l['name']}* (+{$l['phone']})\n   🚗 Unit: {$l['car_model']}\n\n";
    }
    if (count($unassignedLeads) > 5) {
        $waText .= "... dan *" . (count($unassignedLeads) - 5) . " customer lainnya* di aplikasi SFT.\n\n";
    }
    $waText .= "Silakan buka aplikasi Sales CRM untuk melihat detail & follow up via WhatsApp sekarang! 🚀";

    $cleanPhone = clean_phone_number($targetSales['phone']);
    $waUrl = "https://wa.me/{$cleanPhone}?text=" . rawurlencode($waText);

    echo json_encode([
        'success' => true,
        'message' => "Berhasil menambahkan +$totalFound leads baru ke {$targetSales['name']}.",
        'sales_name' => $targetSales['name'],
        'added_count' => $totalFound,
        'wa_url' => $waUrl
    ]);
    exit;
}

// Default response (only if called directly)
if (!$action && basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'api_followup.php') {
    echo json_encode([
        'success' => true,
        'message' => 'SFT Follow-Up CRM API is operational',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

