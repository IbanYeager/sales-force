<?php
/**
 * api_ocr_scanner.php
 * Smart AI OCR Scanner Endpoint for KTP & Kartu Keluarga (KK)
 * Tunas Toyota Sales Force Automation
 */

error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Metode request tidak didukung."]);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true) ?: [];

$imageData = $payload['image'] ?? '';
$docType = strtolower($payload['doc_type'] ?? 'ktp'); // 'ktp' atau 'kk'
$rawText = trim($payload['raw_text'] ?? '');
$clientKey = trim($payload['api_key'] ?? '');

// 1. Periksa ketersediaan Gemini API Key (Client payload, config_ai.json, atau .env)
$geminiKey = $clientKey;

if (empty($geminiKey)) {
    $configFile = __DIR__ . '/config_ai.json';
    if (file_exists($configFile)) {
        $cfg = json_decode(file_get_contents($configFile), true);
        $geminiKey = trim($cfg['gemini_api_key'] ?? '');
    }
}

if (empty($geminiKey) && file_exists(__DIR__ . '/../../.env')) {
    $envContent = file_get_contents(__DIR__ . '/../../.env');
    if (preg_match('/GEMINI_API_KEY\s*=\s*["\']?([^"\'\s\r\n]+)/', $envContent, $m)) {
        $geminiKey = trim($m[1]);
    }
} elseif (empty($geminiKey) && file_exists(__DIR__ . '/../.env')) {
    $envContent = file_get_contents(__DIR__ . '/../.env');
    if (preg_match('/GEMINI_API_KEY\s*=\s*["\']?([^"\'\s\r\n]+)/', $envContent, $m)) {
        $geminiKey = trim($m[1]);
    }
}

// 2. Jika Gemini key tersedia dan data gambar dikirimkan -> Gunakan Gemini AI Vision
if (!empty($geminiKey) && !empty($imageData) && strlen($imageData) > 100) {
    $cleanBase64 = $imageData;
    $mimeType = 'image/jpeg';
    if (preg_match('/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/', $imageData, $matches)) {
        $mimeType = $matches[1];
        $cleanBase64 = $matches[2];
    }

    $promptInstruction = ($docType === 'kk')
        ? "Ekstrak data dari gambar Kartu Keluarga (KK) Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari:
           - no_kk (Nomor KK 16 digit angka bersih)
           - nama (Nama Kepala Keluarga atau Nama Anggota)
           - nik (NIK 16 digit angka bersih)
           - alamat (Alamat lengkap jalan/dusun)
           - rt_rw (contoh: 002/005)
           - kelurahan (Desa / Kelurahan)
           - kecamatan (Kecamatan)
           - kota (Kabupaten / Kota)
           - provinsi (Provinsi)
           Jika tidak terbaca, kosongkan string-nya (\"\"). Berikan HANYA format JSON valid."
        : "Ekstrak data dari foto e-KTP Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari:
           - nik (Nomor Induk Kependudukan 16 digit angka bersih tanpa spasi)
           - nama (Nama lengkap sesuai KTP)
           - tempat_lahir (Tempat lahir saja, contoh: BANDUNG)
           - tanggal_lahir (Tanggal lahir, format DD-MM-YYYY)
           - jenis_kelamin (LAKI-LAKI atau PEREMPUAN)
           - alamat (Alamat nama jalan, nomor rumah, atau dusun)
           - rt_rw (contoh: 003/007)
           - kelurahan (Kelurahan / Desa)
           - kecamatan (Kecamatan)
           - kota (Kota / Kabupaten)
           - provinsi (Provinsi)
           - agama (ISLAM / KRISTEN / KATOLIK / HINDU / BUDDHA / KONGHUCU)
           - status_perkawinan (BELUM KAWIN / KAWIN / CERAI HIDUP / CERAI MATI)
           - pekerjaan (contoh: KARYAWAN SWASTA / WIRASWASTA / PNS / dll)
           Jika ada field yang tidak terbaca jelas, berikan string kosong (\"\"). Berikan HANYA output JSON valid tanpa teks tambahan.";

    $geminiPayload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $promptInstruction],
                    [
                        "inline_data" => [
                            "mime_type" => $mimeType,
                            "data" => $cleanBase64
                        ]
                    ]
                ]
            ]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "response_mime_type" => "application/json"
        ]
    ];

    // Model vision yang didukung secara resmi dengan fallback otomatis
    $visionModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];

    foreach ($visionModels as $visionModel) {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$visionModel}:generateContent?key=" . urlencode($geminiKey);
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($geminiPayload),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT => 20,
            CURLOPT_SSL_VERIFYPEER => true
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($response)) {
            $geminiRes = json_decode($response, true);
            $rawJsonText = $geminiRes['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Bersihkan backticks markdown jika ada
            $rawJsonText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawJsonText));
            $rawJsonText = preg_replace('/```$/', '', trim($rawJsonText));

            $parsedData = json_decode($rawJsonText, true);
            if (is_array($parsedData) && (!empty($parsedData['nik']) || !empty($parsedData['nama']) || !empty($parsedData['no_kk']))) {
                echo json_encode([
                    "status" => "success",
                    "engine" => "Gemini AI Vision (" . $visionModel . ")",
                    "doc_type" => $docType,
                    "data" => sanitizeExtractedData($parsedData, $docType)
                ]);
                exit;
            }
        }
    }
}

// 3. Fallback: Jika client menyertakan raw_text (dari Tesseract.js client OCR)
if (!empty($rawText)) {
    $extracted = parseIndonesianIdCardText($rawText, $docType);
    $hasContent = !empty($extracted['nik']) || !empty($extracted['nama']) || !empty($extracted['no_kk']);

    echo json_encode([
        "status" => $hasContent ? "success" : "partial",
        "engine" => "Smart Local OCR Parser",
        "doc_type" => $docType,
        "data" => $extracted,
        "raw_length" => strlen($rawText)
    ]);
    exit;
}

// 4. Jika tidak ada Gemini Key dan client belum menjalankan OCR lokal:
// Beritahu frontend agar menjalankan client-side OCR Tesseract lokal!
echo json_encode([
    "status" => "need_client_ocr",
    "engine" => "client-fallback-required",
    "doc_type" => $docType,
    "message" => "Gemini AI Key belum disetel. Menjalankan Tesseract OCR lokal di browser..."
]);
exit;

/**
 * Sanitizes and fills missing keys
 */
function sanitizeExtractedData($data, $docType) {
    return [
        'nik' => preg_replace('/[^0-9]/', '', $data['nik'] ?? ''),
        'no_kk' => preg_replace('/[^0-9]/', '', $data['no_kk'] ?? ''),
        'nama' => strtoupper(trim(preg_replace('/[^a-zA-Z\s\.,\']/', '', $data['nama'] ?? ''))),
        'tempat_lahir' => strtoupper(trim($data['tempat_lahir'] ?? '')),
        'tanggal_lahir' => trim($data['tanggal_lahir'] ?? ''),
        'jenis_kelamin' => strtoupper(trim($data['jenis_kelamin'] ?? '')),
        'alamat' => trim($data['alamat'] ?? ''),
        'rt_rw' => trim($data['rt_rw'] ?? ''),
        'kelurahan' => strtoupper(trim($data['kelurahan'] ?? '')),
        'kecamatan' => strtoupper(trim($data['kecamatan'] ?? '')),
        'kota' => strtoupper(trim($data['kota'] ?? '')),
        'provinsi' => strtoupper(trim($data['provinsi'] ?? '')),
        'agama' => strtoupper(trim($data['agama'] ?? '')),
        'status_perkawinan' => strtoupper(trim($data['status_perkawinan'] ?? '')),
        'pekerjaan' => strtoupper(trim($data['pekerjaan'] ?? ''))
    ];
}

/**
 * Smart Regex Parser for Indonesian KTP & Kartu Keluarga (KK)
 */
function parseIndonesianIdCardText($text, $docType = 'ktp') {
    $textClean = str_replace(["\r\n", "\r"], "\n", $text);
    $lines = array_values(array_filter(array_map('trim', explode("\n", $textClean))));

    $result = [
        'nik' => '',
        'no_kk' => '',
        'nama' => '',
        'tempat_lahir' => '',
        'tanggal_lahir' => '',
        'jenis_kelamin' => '',
        'alamat' => '',
        'rt_rw' => '',
        'kelurahan' => '',
        'kecamatan' => '',
        'kota' => '',
        'provinsi' => '',
        'agama' => '',
        'status_perkawinan' => '',
        'pekerjaan' => ''
    ];

    // Helper: Normalize common OCR character confusions in numbers (O -> 0, I -> 1, etc.)
    $numCleanText = strtr($text, [
        'O' => '0', 'o' => '0', 'D' => '0',
        'I' => '1', 'l' => '1', '|' => '1',
        'Z' => '2', 'z' => '2',
        'S' => '5', 's' => '5',
        'B' => '8'
    ]);

    // Bersihkan spasi antar angka berdekatan (misal "3273 1612 0590 0003" -> "3273161205900003")
    $numCondensed = preg_replace('/(\d)\s+(\d)/', '$1$2', $numCleanText);
    $numCondensed = preg_replace('/(\d)\s+(\d)/', '$1$2', $numCondensed);

    // 1. Extract NIK (16 digits)
    if (preg_match('/N[I1l|][Kk]\D*([0-9\s]{16,24})/i', $numCleanText, $m)) {
        $digits = preg_replace('/\D/', '', $m[1]);
        if (strlen($digits) >= 16) {
            $result['nik'] = substr($digits, 0, 16);
        }
    }
    if (empty($result['nik']) && preg_match('/\b([1-9][0-9]{15})\b/', $numCondensed, $m)) {
        $result['nik'] = $m[1];
    }
    if (empty($result['nik']) && preg_match('/\b([0-9]{16})\b/', $numCondensed, $m)) {
        $result['nik'] = $m[1];
    }

    // 2. Extract No KK (16 digits)
    if ($docType === 'kk') {
        if (preg_match('/(?:NO|NOMOR)\D*K(?:ARTU)?\D*K(?:ELUARGA)?\D*([0-9\s]{16,24})/i', $numCleanText, $m)) {
            $digits = preg_replace('/\D/', '', $m[1]);
            if (strlen($digits) >= 16) $result['no_kk'] = substr($digits, 0, 16);
        } elseif (preg_match('/(?:NO|NOMOR)\D*([1-9][0-9]{15})/i', $numCondensed, $m)) {
            $result['no_kk'] = $m[1];
        } elseif (preg_match('/\b([1-9][0-9]{15})\b/', $numCondensed, $m)) {
            $result['no_kk'] = $m[1];
        }
    }

    // 3. Extract Nama
    foreach ($lines as $idx => $line) {
        if (preg_match('/nama\b/i', $line)) {
            $val = preg_replace('/.*nama\s*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i', '', $line);
            $val = preg_replace('/[^a-zA-Z\s\.,\']/', '', $val);
            if (!empty(trim($val))) {
                $result['nama'] = strtoupper(trim($val));
                break;
            } elseif (isset($lines[$idx + 1]) && !preg_match('/nik|tempat|tgl|lahir|alamat|jenis|kelamin|agama|status/i', $lines[$idx + 1])) {
                $val = preg_replace('/.*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i', '', $lines[$idx + 1]);
                $val = preg_replace('/[^a-zA-Z\s\.,\']/', '', $val);
                $result['nama'] = strtoupper(trim($val));
                break;
            }
        }
    }

    // Fallback Nama jika baris berlabel Nama tidak terbaca: Cari baris huruf kapital setelah baris NIK
    if (empty($result['nama'])) {
        $foundNikLine = false;
        foreach ($lines as $line) {
            if ($foundNikLine) {
                $cleanLine = preg_replace('/[^a-zA-Z\s]/', '', $line);
                $cleanLine = trim(preg_replace('/\s+/', ' ', $cleanLine));
                if (strlen($cleanLine) >= 3 && !preg_match('/provinsi|republik|indonesia|nik|tempat|lahir|jakarta|bandung/i', $cleanLine)) {
                    $result['nama'] = strtoupper($cleanLine);
                    break;
                }
            }
            if (preg_match('/nik\b/i', $line) || (!empty($result['nik']) && strpos($line, $result['nik']) !== false)) {
                $foundNikLine = true;
            }
        }
    }

    // 4. Extract Tempat / Tanggal Lahir
    foreach ($lines as $line) {
        if (preg_match('/(?:tempat|tgl|lahir)/i', $line)) {
            $val = preg_replace('/.*(?:tempat|tgl|lahir)\s*[:=\-]?\s*/i', '', $line);
            // Contoh: BANDUNG, 17-08-1990 atau JAKARTA, 12/05/1985
            if (preg_match('/([a-zA-Z\s]+)[,\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/', $val, $m)) {
                $result['tempat_lahir'] = strtoupper(trim($m[1]));
                $result['tanggal_lahir'] = trim($m[2]);
            } elseif (preg_match('/([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/', $val, $m)) {
                $result['tanggal_lahir'] = trim($m[1]);
                $place = preg_replace('/[0-9\/\-\.,:]/', '', $val);
                if (!empty(trim($place))) $result['tempat_lahir'] = strtoupper(trim($place));
            }
            break;
        }
    }

    // 5. Extract Jenis Kelamin
    if (preg_match('/(LAKI[\-\s]*LAKI|PRIA)/i', $text)) {
        $result['jenis_kelamin'] = 'LAKI-LAKI';
    } elseif (preg_match('/(PEREMPUAN|WANITA)/i', $text)) {
        $result['jenis_kelamin'] = 'PEREMPUAN';
    }

    // 6. Extract RT / RW
    if (preg_match('/RT[\/\.]?RW\D*([0-9]{1,3})\s*[\/\-]\s*([0-9]{1,3})/i', $numCleanText, $m)) {
        $result['rt_rw'] = sprintf("%03d/%03d", intval($m[1]), intval($m[2]));
    }

    // 7. Extract Alamat
    foreach ($lines as $idx => $line) {
        if (preg_match('/alamat\b/i', $line)) {
            $val = preg_replace('/.*alamat\s*[:=\-]?\s*/i', '', $line);
            if (!empty(trim($val))) {
                $result['alamat'] = trim($val);
            } elseif (isset($lines[$idx + 1]) && !preg_match('/rt|rw|kel|kec|agama|status/i', $lines[$idx + 1])) {
                $result['alamat'] = trim($lines[$idx + 1]);
            }
            break;
        }
    }

    // 8. Extract Kelurahan / Desa
    foreach ($lines as $line) {
        if (preg_match('/(?:kelurahan|kel|desa)\b/i', $line)) {
            $val = preg_replace('/.*(?:kelurahan|kel|desa)\s*[:=\-]?\s*/i', '', $line);
            $val = preg_replace('/[^a-zA-Z\s]/', '', $val);
            if (!empty(trim($val))) {
                $result['kelurahan'] = strtoupper(trim($val));
                break;
            }
        }
    }

    // 9. Extract Kecamatan
    foreach ($lines as $line) {
        if (preg_match('/kecamatan\b/i', $line)) {
            $val = preg_replace('/.*kecamatan\s*[:=\-]?\s*/i', '', $line);
            $val = preg_replace('/[^a-zA-Z\s]/', '', $val);
            if (!empty(trim($val))) {
                $result['kecamatan'] = strtoupper(trim($val));
                break;
            }
        }
    }

    // 9b. Extract Kota / Kabupaten
    if (preg_match('/(?:KOTA|KABUPATEN|KAB\.?)\s+([A-Z\s]+)/i', $text, $m)) {
        $firstLine = trim(explode("\n", $m[1])[0]);
        $firstLine = preg_replace('/[^a-zA-Z\s]/', '', $firstLine);
        if (!empty($firstLine)) {
            $prefix = (stripos($m[0], 'KAB') !== false) ? 'KABUPATEN ' : 'KOTA ';
            $result['kota'] = strtoupper(trim($prefix . $firstLine));
        }
    }

    // 9c. Extract Provinsi
    if (preg_match('/PROVINSI\s+([A-Z\s]+)/i', $text, $m)) {
        $firstLine = trim(explode("\n", $m[1])[0]);
        $firstLine = preg_replace('/[^a-zA-Z\s]/', '', $firstLine);
        if (!empty($firstLine)) {
            $result['provinsi'] = strtoupper(trim($firstLine));
        }
    }

    // 10. Extract Agama
    if (preg_match('/\b(ISLAM)\b/i', $text)) $result['agama'] = 'ISLAM';
    elseif (preg_match('/\b(KRISTEN|PROTESTAN)\b/i', $text)) $result['agama'] = 'KRISTEN';
    elseif (preg_match('/\b(KATOLIK)\b/i', $text)) $result['agama'] = 'KATOLIK';
    elseif (preg_match('/\b(HINDU)\b/i', $text)) $result['agama'] = 'HINDU';
    elseif (preg_match('/\b(BUDDHA|BUDHA)\b/i', $text)) $result['agama'] = 'BUDDHA';
    elseif (preg_match('/\b(KONGHUCU)\b/i', $text)) $result['agama'] = 'KONGHUCU';

    // 11. Extract Status Perkawinan
    if (preg_match('/BELUM\s*KAWIN/i', $text)) $result['status_perkawinan'] = 'BELUM KAWIN';
    elseif (preg_match('/CERAI\s*HIDUP/i', $text)) $result['status_perkawinan'] = 'CERAI HIDUP';
    elseif (preg_match('/CERAI\s*MATI/i', $text)) $result['status_perkawinan'] = 'CERAI MATI';
    elseif (preg_match('/KAWIN/i', $text)) $result['status_perkawinan'] = 'KAWIN';

    // 12. Extract Pekerjaan
    foreach ($lines as $line) {
        if (preg_match('/pekerjaan\b/i', $line)) {
            $val = preg_replace('/.*pekerjaan\s*[:=\-]?\s*/i', '', $line);
            $val = preg_replace('/[^a-zA-Z\s]/', '', $val);
            if (!empty(trim($val))) {
                $result['pekerjaan'] = strtoupper(trim($val));
                break;
            }
        }
    }

    return $result;
}
?>
