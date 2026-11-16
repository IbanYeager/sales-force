<?php
/**
 * api_nominatim_geocoder.php - Nominatim OpenStreetMap Geocoder with MySQL Cache
 * 
 * Provides accurate street-level geocoding for customer addresses using
 * the free Nominatim API (OpenStreetMap) with aggressive caching to:
 * 1. Respect rate limits (1 request/second)
 * 2. Avoid redundant lookups for same addresses
 * 3. Provide instant results for previously geocoded addresses
 * 
 * Cache is stored in MySQL table `geocode_cache`.
 * Falls back gracefully if Nominatim is unavailable.
 */

require_once __DIR__ . '/api_followup_db.php';

// Initialize the geocode_cache table
function init_geocode_cache_table() {
    global $is_mysql, $conn;
    if (!$is_mysql || !$conn) return false;

    $check = followup_query("SHOW TABLES LIKE 'geocode_cache'");
    if (empty($check)) {
        followup_execute("
            CREATE TABLE IF NOT EXISTS geocode_cache (
                id INT AUTO_INCREMENT PRIMARY KEY,
                address_key VARCHAR(500) NOT NULL,
                query_text VARCHAR(1000) NOT NULL,
                lat DECIMAL(10, 7) NULL,
                lng DECIMAL(10, 7) NULL,
                display_name VARCHAR(500) NULL,
                osm_type VARCHAR(50) NULL,
                importance DECIMAL(5,4) NULL,
                district_resolved VARCHAR(150) NULL,
                source VARCHAR(50) DEFAULT 'nominatim',
                hit_count INT DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY idx_address_key (address_key(255))
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }
    return true;
}

/**
 * Normalize address string into a cache key
 */
function normalizeAddressKey($address) {
    $key = strtolower(trim($address));
    // Remove common noise: RT/RW patterns, NO., extra spaces
    $key = preg_replace('/\s+/', ' ', $key);
    $key = preg_replace('/[,\.]+/', ' ', $key);
    $key = preg_replace('/\s+/', ' ', $key);
    $key = trim($key);
    return $key;
}

/**
 * Build a smart Nominatim query from raw Indonesian address
 * Extracts the most geocodable parts (street name, kelurahan, kecamatan)
 */
function buildNominatimQuery($rawAddress, $district = '', $city = '') {
    $addr = trim($rawAddress);
    
    // Remove noise prefixes
    $addr = preg_replace('/^(JL\.|JLN\.|JALAN)\s*/i', 'Jalan ', $addr);
    $addr = preg_replace('/^(GG\.|GANG)\s*/i', 'Gang ', $addr);
    $addr = preg_replace('/^(KOMP\.|KOMPLEK)\s*/i', 'Komplek ', $addr);
    $addr = preg_replace('/^(PERUM\.|PERUMAHAN)\s*/i', 'Perumahan ', $addr);
    $addr = preg_replace('/^(DSN\.|DUSUN)\s*/i', '', $addr);
    
    // Remove RT/RW
    $addr = preg_replace('/\bRT\.?\s*\d+\s*\/?\s*RW\.?\s*\d+/i', '', $addr);
    $addr = preg_replace('/\bRT\.?\s*\d+/i', '', $addr);
    $addr = preg_replace('/\bRW\.?\s*\d+/i', '', $addr);
    
    // Remove NO/house number patterns but keep street name
    $addr = preg_replace('/\bNO\.?\s*\d+[A-Z]?\b/i', '', $addr);
    $addr = preg_replace('/\bBLOK\s*[A-Z0-9]+/i', '', $addr);
    $addr = preg_replace('/\bKAV\.?\s*\d+/i', '', $addr);
    
    $addr = preg_replace('/\s+/', ' ', trim($addr));
    
    // Build the query with district and city context
    $parts = [$addr];
    if ($district && strtolower($district) !== 'bandung area' && strtolower($district) !== 'bandung') {
        $cleanDist = preg_replace('/^(kecamatan|kec\.|kec)\s+/i', '', $district);
        $parts[] = trim($cleanDist);
    }
    if ($city && strtolower($city) !== '-') {
        $parts[] = trim($city);
    } else {
        $parts[] = 'Bandung';
    }
    $parts[] = 'Jawa Barat';
    $parts[] = 'Indonesia';
    
    return implode(', ', array_filter($parts));
}

/**
 * Check cache for previously geocoded address
 */
function getCachedGeocode($addressKey) {
    global $is_mysql, $conn;
    if (!$is_mysql || !$conn) return null;

    $escaped = $conn->real_escape_string($addressKey);
    $rows = followup_query("SELECT lat, lng, display_name, district_resolved FROM geocode_cache WHERE address_key = '$escaped' LIMIT 1");
    
    if (!empty($rows) && $rows[0]['lat'] !== null) {
        // Increment hit count
        followup_execute("UPDATE geocode_cache SET hit_count = hit_count + 1, updated_at = NOW() WHERE address_key = '$escaped'");
        return [
            'lat' => (float)$rows[0]['lat'],
            'lng' => (float)$rows[0]['lng'],
            'display_name' => $rows[0]['display_name'],
            'district' => $rows[0]['district_resolved']
        ];
    }
    return null;
}

/**
 * Save geocoding result to cache
 */
function saveCachedGeocode($addressKey, $queryText, $lat, $lng, $displayName, $osmType, $importance, $district) {
    global $is_mysql, $conn;
    if (!$is_mysql || !$conn) return false;

    $escapedKey = $conn->real_escape_string($addressKey);
    $escapedQuery = $conn->real_escape_string($queryText);
    $escapedDisplay = $conn->real_escape_string($displayName ?: '');
    $escapedDist = $conn->real_escape_string($district ?: '');
    $escapedOsm = $conn->real_escape_string($osmType ?: '');
    $latVal = $lat !== null ? $lat : 'NULL';
    $lngVal = $lng !== null ? $lng : 'NULL';
    $impVal = $importance !== null ? $importance : 'NULL';

    $sql = "INSERT INTO geocode_cache (address_key, query_text, lat, lng, display_name, osm_type, importance, district_resolved)
            VALUES ('$escapedKey', '$escapedQuery', $latVal, $lngVal, '$escapedDisplay', '$escapedOsm', $impVal, '$escapedDist')
            ON DUPLICATE KEY UPDATE lat=$latVal, lng=$lngVal, display_name='$escapedDisplay', 
            osm_type='$escapedOsm', importance=$impVal, district_resolved='$escapedDist', 
            hit_count=hit_count+1, updated_at=NOW()";
    
    return followup_execute($sql);
}

/**
 * Query Nominatim API for address geocoding
 * Respects rate limit: max 1 request per second
 * @param string $query - The address query string
 * @return array|null - [lat, lng, display_name, osm_type, importance] or null on failure
 */
function queryNominatim($query) {
    $url = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
        'q' => $query,
        'format' => 'json',
        'limit' => 3,
        'countrycodes' => 'id',
        'addressdetails' => 1,
        'accept-language' => 'id'
    ]);

    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: TunasToyotaSFT/1.0 (sales-force-tool@tunastoyota.com)\r\n",
            'timeout' => 5
        ]
    ];
    $ctx = stream_context_create($opts);
    
    // Rate limiter: ensure at least 1.1 seconds between requests
    static $lastRequestTime = 0;
    $now = microtime(true);
    $elapsed = $now - $lastRequestTime;
    if ($elapsed < 1.1 && $lastRequestTime > 0) {
        usleep((int)((1.1 - $elapsed) * 1000000));
    }
    
    $response = @file_get_contents($url, false, $ctx);
    $lastRequestTime = microtime(true);
    
    if ($response === false) return null;
    
    $data = json_decode($response, true);
    if (empty($data) || !is_array($data)) return null;
    
    // Pick the best result - prefer results in Bandung area
    $best = null;
    foreach ($data as $result) {
        $lat = (float)$result['lat'];
        $lng = (float)$result['lon'];
        
        // Check if result is in Bandung metro area (-7.2 to -6.8 lat, 107.3 to 107.9 lng)
        $inBandung = ($lat >= -7.2 && $lat <= -6.8 && $lng >= 107.3 && $lng <= 107.9);
        
        if ($inBandung) {
            $best = $result;
            break;
        }
        if (!$best) {
            $best = $result; // Keep first result as fallback
        }
    }
    
    if (!$best) return null;
    
    return [
        'lat' => (float)$best['lat'],
        'lng' => (float)$best['lon'],
        'display_name' => $best['display_name'] ?? '',
        'osm_type' => $best['type'] ?? '',
        'importance' => (float)($best['importance'] ?? 0),
        'address' => $best['address'] ?? []
    ];
}

/**
 * Main geocode function: Check cache first, then query Nominatim
 * @param string $rawAddress - Raw address text from Excel/DB
 * @param string $district - District/kecamatan name (optional)
 * @param string $city - City name (optional)
 * @return array|null - [lat, lng, display_name, district] or null
 */
function geocodeAddress($rawAddress, $district = '', $city = '') {
    if (empty(trim($rawAddress))) return null;
    
    // Build cache key from normalized address
    $addressKey = normalizeAddressKey($rawAddress . ' ' . $district . ' ' . $city);
    
    // Check cache first
    $cached = getCachedGeocode($addressKey);
    if ($cached) return $cached;
    
    // Build the Nominatim query
    $query = buildNominatimQuery($rawAddress, $district, $city);
    
    // Query Nominatim
    $result = queryNominatim($query);
    
    if ($result && $result['lat'] && $result['lng']) {
        // Extract district from Nominatim response
        $resolvedDistrict = '';
        $addr = $result['address'] ?? [];
        if (!empty($addr['suburb'])) {
            $resolvedDistrict = $addr['suburb'];
        } elseif (!empty($addr['city_district'])) {
            $resolvedDistrict = $addr['city_district'];
        } elseif (!empty($addr['village'])) {
            $resolvedDistrict = $addr['village'];
        }
        
        // Save to cache
        saveCachedGeocode(
            $addressKey, $query,
            $result['lat'], $result['lng'],
            $result['display_name'],
            $result['osm_type'],
            $result['importance'],
            $resolvedDistrict ?: $district
        );
        
        return [
            'lat' => $result['lat'],
            'lng' => $result['lng'],
            'display_name' => $result['display_name'],
            'district' => $resolvedDistrict ?: $district
        ];
    }
    
    // Save negative result to cache (with null lat/lng) to avoid re-querying
    saveCachedGeocode($addressKey, $query, null, null, 'NOT_FOUND', '', null, $district);
    
    return null;
}

/**
 * Batch geocode addresses (for import/sync jobs)
 * Processes addresses sequentially with rate limiting
 * @param array $addresses - Array of ['address' => '', 'district' => '', 'city' => '', 'id' => '']
 * @param int $maxBatch - Maximum addresses to geocode per batch (default 50)
 * @return array - Results keyed by input id
 */
function batchGeocodeAddresses($addresses, $maxBatch = 50) {
    $results = [];
    $processed = 0;
    
    foreach ($addresses as $item) {
        if ($processed >= $maxBatch) break;
        
        $result = geocodeAddress(
            $item['address'] ?? '',
            $item['district'] ?? '',
            $item['city'] ?? ''
        );
        
        $key = $item['id'] ?? $processed;
        $results[$key] = $result;
        $processed++;
    }
    
    return $results;
}

// Auto-initialize cache table when included
init_geocode_cache_table();
