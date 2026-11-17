<?php
// api/sync_mysql_districts.php - Calibrates and synchronizes customer districts in MySQL / SQLite
header('Content-Type: application/json; charset=utf-8');
@ini_set('memory_limit', '1024M');
@set_time_limit(600);

require_once __DIR__ . '/api_followup_db.php';
require_once __DIR__ . '/api_radar_gazetteer.php';

// 1. Load pre-computed high-precision ArcGIS radar dataset
$cacheFile = __DIR__ . '/cache_radar_customers.json';
if (!file_exists($cacheFile)) {
    $cacheFile = dirname(__DIR__) . '/public/api/cache_radar_customers.json';
}

$cacheByName = [];
$cacheByVin = [];
$cacheByPhone = [];

if (file_exists($cacheFile)) {
    $cachedData = json_decode(file_get_contents($cacheFile), true);
    if (is_array($cachedData)) {
        foreach ($cachedData as $c) {
            $n = strtolower(preg_replace('/[^a-z0-9]/', '', (string)($c['name'] ?? '')));
            if ($n && !isset($cacheByName[$n])) {
                $cacheByName[$n] = $c;
            }
            $v = strtoupper(trim((string)($c['vin'] ?? '')));
            if ($v && !isset($cacheByVin[$v])) {
                $cacheByVin[$v] = $c;
            }
            $p = clean_phone_number($c['phone'] ?? '');
            if ($p && !isset($cacheByPhone[$p])) {
                $cacheByPhone[$p] = $c;
            }
        }
    }
}

// 2. Helper to extract true administrative district from notes
function extractDistrictFromNotes($notes, $fallbackDist = '') {
    if (empty($notes)) return $fallbackDist;

    // Pattern 1: ... Kec. <Kecamatan>, <Kab/Kota> <City> ...
    if (preg_match('/(?:Kecamatan|Kec\.?|Kec)\s+([^,;\n|]+?)(?:[,.]|\s+)\s*(KAB\.|KABUPATEN|KOTA|KAB)\s+([^,;\n|]+)/i', $notes, $m)) {
        $kec = ucwords(strtolower(trim(preg_replace('/^(kecamatan|kec\.?|kelurahan|kel\.?)\s+/i', '', $m[1]))));
        $prefix = strtoupper(trim($m[2]));
        $city = ucwords(strtolower(trim(preg_replace('/^(kabupaten|kab\.?|kota)\s+/i', '', $m[3]))));

        // Clean up trailing punctuation
        $kec = trim(preg_replace('/[-–—,.;|].*$/', '', $kec));
        $city = trim(preg_replace('/[-–—,.;|].*$/', '', $city));

        if (strtolower($city) === 'bandung' || strtolower($city) === 'kota bandung') {
            return $kec;
        }
        $kabPrefix = (strpos($prefix, 'KAB') !== false) ? 'Kab. ' : '';
        return "$kec, {$kabPrefix}$city";
    }

    // Pattern 2: ... Kec. <Kecamatan> ...
    if (preg_match('/(?:Kecamatan|Kec\.?|Kec)\s+([^,;\n|]+)/i', $notes, $m)) {
        $kec = ucwords(strtolower(trim(preg_replace('/^(kecamatan|kec\.?|kelurahan|kel\.?)\s+/i', '', $m[1]))));
        $kec = trim(preg_replace('/[-–—,.;|].*$/', '', $kec));
        $kec = trim(preg_replace('/\b(RT|RW|NO|BLOK|KEL|DESA)\b.*$/i', '', $kec));
        if (strlen($kec) >= 3) {
            return $kec;
        }
    }

    return $fallbackDist;
}

// 3. Query all customers from database
$rows = followup_query("SELECT id, name, district, notes, vin, phone FROM followup_customers");
if (empty($rows) || !is_array($rows)) {
    echo json_encode(['success' => false, 'message' => 'No customer records found']);
    exit;
}

$updatedCount = 0;
$updates = [];
$sampleUpdated = [];

foreach ($rows as $r) {
    $id = (int)$r['id'];
    $name = trim($r['name'] ?? '');
    $currentDist = trim($r['district'] ?? '');
    $notes = $r['notes'] ?? '';
    $vin = strtoupper(trim($r['vin'] ?? ''));
    $phone = clean_phone_number($r['phone'] ?? '');

    $targetDist = null;

    // A. Priority 1: Check cache_radar_customers.json (ArcGIS verified)
    $cleanName = strtolower(preg_replace('/[^a-z0-9]/', '', $name));
    if ($vin && isset($cacheByVin[$vin]) && !empty($cacheByVin[$vin]['district']) && $cacheByVin[$vin]['district'] !== 'Bandung Area') {
        $targetDist = $cacheByVin[$vin]['district'];
    } elseif ($cleanName && isset($cacheByName[$cleanName]) && !empty($cacheByName[$cleanName]['district']) && $cacheByName[$cleanName]['district'] !== 'Bandung Area') {
        $targetDist = $cacheByName[$cleanName]['district'];
    } elseif ($phone && isset($cacheByPhone[$phone]) && !empty($cacheByPhone[$phone]['district']) && $cacheByPhone[$phone]['district'] !== 'Bandung Area') {
        $targetDist = $cacheByPhone[$phone]['district'];
    }

    // B. Priority 2: Extract directly from address/notes
    $fromNotes = extractDistrictFromNotes($notes);
    if ($fromNotes && ($fromNotes !== $currentDist || empty($targetDist))) {
        // If notes has explicit outside-Bandung city (e.g. Blanakan, Kab. Subang), prefer it
        if (strpos($fromNotes, ',') !== false || empty($targetDist)) {
            $targetDist = $fromNotes;
        }
    }

    // Format cleanup: Ensure no trailing punctuation
    if ($targetDist) {
        $targetDist = trim(preg_replace('/[-–—\.,;]+$/', '', $targetDist));
    }

    if ($targetDist && $targetDist !== $currentDist) {
        $updates[] = [
            'id' => $id,
            'name' => $name,
            'old_district' => $currentDist,
            'new_district' => $targetDist
        ];
    }
}

// 4. Execute batch updates in MySQL / SQLite
global $is_mysql, $conn;

if ($is_mysql && $conn && !empty($updates)) {
    $chunks = array_chunk($updates, 200);
    foreach ($chunks as $chunk) {
        $ids = [];
        $cases = [];
        foreach ($chunk as $item) {
            $uId = (int)$item['id'];
            $uDist = $conn->real_escape_string($item['new_district']);
            $ids[] = $uId;
            $cases[] = "WHEN $uId THEN '$uDist'";
        }
        $idList = implode(',', $ids);
        $caseSql = implode(' ', $cases);
        $sql = "UPDATE followup_customers SET district = CASE id $caseSql END WHERE id IN ($idList)";
        if ($conn->query($sql)) {
            $updatedCount += count($chunk);
        }
    }
} else {
    foreach ($updates as $u) {
        followup_execute("UPDATE followup_customers SET district = ? WHERE id = ?", [$u['new_district'], $u['id']]);
        $updatedCount++;
    }
}

$sampleUpdated = array_slice($updates, 0, 15);

echo json_encode([
    'success' => true,
    'database_type' => $is_mysql ? 'MySQL' : 'SQLite',
    'total_checked' => count($rows),
    'districts_updated' => $updatedCount,
    'sample_updates' => $sampleUpdated
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
