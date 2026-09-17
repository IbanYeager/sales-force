<?php
// api/wa_stock_updater.php
// AI Engine & Handler untuk Update Stok Unit Mobil via WhatsApp
// Mendukung: Teks Percakapan (NLP), Gambar/Foto (Gemini Vision AI), dan File Dokumen (Excel/CSV/PDF)

if (!defined('STOCK_UPDATER_LOADED')) {
    define('STOCK_UPDATER_LOADED', true);
}

/**
 * Mencari Gemini API Key dari berbagai sumber (config_ai.json, getenv, atau .env)
 */
function resolveGeminiApiKey() {
    // 1. Coba dari config_ai.json
    $configFile = __DIR__ . '/config_ai.json';
    if (file_exists($configFile)) {
        $cfg = json_decode(@file_get_contents($configFile), true);
        if (!empty($cfg['gemini_api_key'])) {
            return trim($cfg['gemini_api_key']);
        }
    }

    // 2. Coba dari environment variable
    $envKey = getenv('GEMINI_API_KEY') ?: ($_ENV['GEMINI_API_KEY'] ?? ($_SERVER['GEMINI_API_KEY'] ?? ''));
    if (!empty($envKey)) {
        return trim($envKey);
    }

    // 3. Coba baca langsung dari file .env
    $envPaths = [
        __DIR__ . '/../.env',
        __DIR__ . '/../../.env',
        __DIR__ . '/.env'
    ];
    foreach ($envPaths as $p) {
        if (file_exists($p)) {
            $content = @file_get_contents($p);
            if (preg_match('/GEMINI_API_KEY\s*=\s*["\']?([^"\'\s\r\n]+)/', $content, $m)) {
                if (!empty($m[1])) return trim($m[1]);
            }
        }
    }

    return '';
}

/**
 * Normalisasi nomor telepon ke format numerik standar
 */
function normalizePhoneNumber($phone) {
    $clean = preg_replace('/[^0-9]/', '', (string)$phone);
    if (strpos($clean, '62') === 0) {
        $clean = '0' . substr($clean, 2);
    }
    return $clean;
}

/**
 * Mendapatkan daftar nomor WhatsApp Admin yang diizinkan untuk mengubah stok
 */
function getAuthorizedStockAdmins($conn) {
    $admins = [];

    // 1. Ambil nomor Kepala Cabang dari tabel_sentinel_settings
    if ($conn) {
        $q = $conn->query("SELECT kacab_wa FROM tabel_sentinel_settings WHERE id = 1 LIMIT 1");
        if ($q && $r = $q->fetch_assoc()) {
            $num = normalizePhoneNumber($r['kacab_wa'] ?? '');
            if (!empty($num)) {
                $admins[] = $num;
            }
        }
    }

    // 2. Ambil dari file konfigurasi lokal jika ada
    $configFile = __DIR__ . '/config_stock_admins.json';
    if (file_exists($configFile)) {
        $json = @file_get_contents($configFile);
        $data = json_decode($json, true);
        if (is_array($data) && !empty($data['admin_numbers'])) {
            foreach ($data['admin_numbers'] as $n) {
                $norm = normalizePhoneNumber($n);
                if (!empty($norm) && !in_array($norm, $admins)) {
                    $admins[] = $norm;
                }
            }
        }
    }

    return array_unique($admins);
}

/**
 * Periksa apakah nomor pengirim adalah Admin/Pengelola Stok yang sah
 */
function isAuthorizedStockAdmin($conn, $sender) {
    $senderNorm = normalizePhoneNumber($sender);
    if (empty($senderNorm)) return false;

    $admins = getAuthorizedStockAdmins($conn);
    return in_array($senderNorm, $admins);
}

/**
 * Mendaftarkan nomor WhatsApp pengirim sebagai Admin baru menggunakan PIN verifikasi
 */
function registerStockAdmin($sender, $pin) {
    $validPin = '154'; // PIN otorisasi default Tunas Toyota Kiara Condong 154
    $senderNorm = normalizePhoneNumber($sender);

    if (trim($pin) !== $validPin) {
        return [
            'success' => false,
            'message' => "❌ *PIN Otorisasi Salah!*\nGunakan PIN resmi Tunas 154 untuk mendaftarkan nomor ini."
        ];
    }

    if (empty($senderNorm)) {
        return [
            'success' => false,
            'message' => "❌ Nomor pengirim tidak terdeteksi secara valid."
        ];
    }

    $configFile = __DIR__ . '/config_stock_admins.json';
    $data = ['admin_numbers' => [], 'updated_at' => date('Y-m-d H:i:s')];

    if (file_exists($configFile)) {
        $existing = json_decode(@file_get_contents($configFile), true);
        if (is_array($existing) && isset($existing['admin_numbers'])) {
            $data['admin_numbers'] = $existing['admin_numbers'];
        }
    }

    if (!in_array($senderNorm, $data['admin_numbers'])) {
        $data['admin_numbers'][] = $senderNorm;
    }
    $data['updated_at'] = date('Y-m-d H:i:s');

    file_put_contents($configFile, json_encode($data, JSON_PRETTY_PRINT));

    return [
        'success' => true,
        'message' => "✅ *NOMOR ANDA BERHASIL DIAKTIFKAN SEBAGAI ADMIN T-STOCK!*\n\nNomor: *{$senderNorm}*\nSekarang Anda memiliki akses penuh untuk memperbarui stok unit mobil melalui WhatsApp (bisa via Teks, Kirim Foto/Screenshot, atau Upload File Excel/PDF).\n\n💡 *Contoh Cara Update:*\n1. *Teks Bebas:* _\"Update stok: Zenix V Hybrid hitam 2 unit\"_\n2. *Kirim Foto:* Kirim screenshot tabel/foto papan tulis stok\n3. *Kirim File:* Forward file Excel/CSV stok unit\natau ketik *#bantuan* untuk panduan lengkap."
    ];
}

/**
 * Deteksi apakah pesan pengguna mengindikasikan perintah/permintaan update stok
 */
function detectStockUpdateIntent($message) {
    $m = strtolower(trim($message));

    if (strpos($m, '#admin') === 0 || strpos($m, '#daftar') === 0 || strpos($m, '#help') === 0 || strpos($m, '#bantuan') === 0 || strpos($m, '#list') === 0) {
        return true;
    }

    $triggers = [
        'update stok', 'update stock', 'tambah stok', 'tambah stock', 'stok masuk', 'stock masuk',
        'unit masuk', 'masuk unit', 'masuk stok', 'input stok', 'catat stok', 'kurang stok',
        'stok habis', 'stok kosong', 'habis stok', 'stok berkurang', 'update unit', 'tambah unit',
        '/update', '/tambah', '/stok', 'stok:'
    ];

    foreach ($triggers as $t) {
        if (strpos($m, $t) !== false) {
            return true;
        }
    }

    $hasCar = (strpos($m, 'zenix') !== false || strpos($m, 'innova') !== false || strpos($m, 'avanza') !== false || 
               strpos($m, 'veloz') !== false || strpos($m, 'calya') !== false || strpos($m, 'agya') !== false || 
               strpos($m, 'rush') !== false || strpos($m, 'fortuner') !== false || strpos($m, 'raize') !== false || 
               strpos($m, 'yaris') !== false || strpos($m, 'alphard') !== false || strpos($m, 'hilux') !== false);

    $hasAction = (strpos($m, 'masuk') !== false || strpos($m, 'tambah') !== false || strpos($m, 'habis') !== false || strpos($m, 'kosong') !== false || strpos($m, 'sisa') !== false);
    $hasQty = preg_match('/\d+\s*(unit|buah|pcs)/i', $m);

    if ($hasCar && $hasAction && $hasQty) {
        return true;
    }

    return false;
}

/**
 * Mengunduh media file dari URL atau membaca file lokal
 */
function downloadMediaFile($url) {
    if (empty($url)) return null;

    // Jika berupa path file lokal yang sudah ada
    if (file_exists($url) && is_file($url)) {
        $content = @file_get_contents($url);
        $ext = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        $mimes = [
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
            'webp' => 'image/webp', 'pdf' => 'application/pdf', 'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv' => 'text/csv'
        ];
        return [
            'data' => $content,
            'mime' => $mimes[$ext] ?? 'application/octet-stream',
            'ext' => $ext
        ];
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SFT-WhatsApp-Bot/1.0'
    ]);
    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300 && !empty($data)) {
        // Tentukan ekstensi & mime
        $mimeParts = explode(';', (string)$contentType);
        $mime = strtolower(trim($mimeParts[0]));
        $ext = '';

        if (strpos($mime, 'jpeg') !== false || strpos($mime, 'jpg') !== false) $ext = 'jpg';
        elseif (strpos($mime, 'png') !== false) $ext = 'png';
        elseif (strpos($mime, 'webp') !== false) $ext = 'webp';
        elseif (strpos($mime, 'pdf') !== false) $ext = 'pdf';
        elseif (strpos($mime, 'csv') !== false) $ext = 'csv';
        elseif (strpos($mime, 'spreadsheet') !== false || strpos($mime, 'excel') !== false) $ext = 'xlsx';
        else {
            $pathExt = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
            if (!empty($pathExt)) $ext = $pathExt;
        }

        return [
            'data' => $data,
            'mime' => $mime ?: 'application/octet-stream',
            'ext' => $ext
        ];
    }

    return null;
}

/**
 * Ekstraksi Data Stok dari Gambar menggunakan Google Gemini Vision 2.5 Flash
 */
function extractUnitsFromImageWithGeminiVision($imageData, $mimeType, $apiKey, $caption = '') {
    if (empty($imageData) || empty($apiKey)) return null;

    $base64 = base64_encode($imageData);
    $validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!in_array($mimeType, $validMimes)) {
        $mimeType = 'image/jpeg';
    }

    $systemInstruction = <<<SYS
Anda adalah AI Multimodal Vision khusus Dealer Mobil Toyota Tunas.
Tugas Anda adalah melihat foto/gambar yang dikirimkan pengguna (bisa berupa foto tabel Excel di monitor, foto coretan papan tulis, foto print-out surat jalan/DO, atau catatan stok) dan mengekstrak semua data ketersediaan unit mobil Toyota ke dalam format JSON murni.

ATURAN PENTING:
- Kenali model-model Toyota: Avanza, Veloz, Calya, Agya, Innova Zenix, Innova Reborn, Rush, Raize, Fortuner, Yaris Cross, Yaris, Alphard, Vellfire, Voxy, Hilux, Corolla Cross, Land Cruiser, dll.
- Standarkan nama Varian (contoh: 1.5 G CVT, 1.2 G M/T, 2.0 V HEV, 2.4 G AT Diesel, GR Sport, Modellista, dll.).
- Standarkan Warna (contoh: Putih, Hitam, Silver Metallic, Gray Metallic / Abu-abu, Merah, Kuning, Bronze, dll.).
- Qty adalah angka stok (integer >= 0). Jika tertulis habis/kosong/sold maka qty = 0.
- Action: "set" (atau "add" jika konteksnya unit baru masuk).
- Status: jika qty > 0 maka "Tersedia", jika qty = 0 maka "Inden / Kosong".
- Lokasi: default "TR Kiaracondong" kecuali tercantum cabang lain.
- Output HANYA berupa array JSON murni tanpa markdown backticks atau teks tambahan apa pun.

Format output yang wajib diikuti:
[
  {
    "model": "Innova Zenix",
    "varian": "2.0 V HEV",
    "warna": "Hitam",
    "qty": 2,
    "action": "set",
    "status": "Tersedia",
    "lokasi": "Kiaracondong"
  }
]
SYS;

    $promptText = $systemInstruction;
    if (!empty($caption)) {
        $promptText .= "\n\nCatatan tambahan/caption dari pengirim:\n" . $caption;
    }

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $promptText],
                    [
                        "inline_data" => [
                            "mime_type" => $mimeType,
                            "data" => $base64
                        ]
                    ]
                ]
            ]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "maxOutputTokens" => 2048,
            "responseMimeType" => "application/json"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 25,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0
    ]);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err || empty($response)) {
        return null;
    }

    $resData = json_decode($response, true);
    $text = $resData['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if (empty($text)) return null;

    $cleanJson = trim(preg_replace('/^```(?:json)?/i', '', trim($text)));
    $cleanJson = trim(preg_replace('/```$/i', '', $cleanJson));

    $parsed = json_decode($cleanJson, true);
    if (is_array($parsed) && !empty($parsed)) {
        if (isset($parsed['items']) && is_array($parsed['items'])) {
            return $parsed['items'];
        }
        return $parsed;
    }

    return null;
}

/**
 * Ekstraksi Data Stok dari File PDF menggunakan Gemini 2.5 Flash Multimodal
 */
function extractUnitsFromPdfWithGemini($pdfData, $apiKey, $caption = '') {
    if (empty($pdfData) || empty($apiKey)) return null;

    $base64 = base64_encode($pdfData);
    $systemInstruction = <<<SYS
Anda adalah AI Dokumen Analisis Dealer Mobil Toyota Tunas.
Tugas Anda adalah membaca seluruh tabel atau daftar mobil di dalam dokumen PDF ini dan mengekstrak data stok unit mobil Toyota ke dalam format JSON murni.

Format output yang wajib diikuti:
[
  {
    "model": "Nama Model (contoh: Innova Zenix / Calya / Avanza)",
    "varian": "Tipe Varian (contoh: 2.0 V HEV / 1.2 G M/T)",
    "warna": "Warna Mobil (contoh: Hitam / Putih / Silver)",
    "qty": 1,
    "action": "set",
    "status": "Tersedia",
    "lokasi": "Kiaracondong"
  }
]
Output HANYA array JSON tanpa markdown.
SYS;

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $systemInstruction . (!empty($caption) ? "\nCaption: " . $caption : "")],
                    [
                        "inline_data" => [
                            "mime_type" => "application/pdf",
                            "data" => $base64
                        ]
                    ]
                ]
            ]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "maxOutputTokens" => 3000,
            "responseMimeType" => "application/json"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0
    ]);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if (empty($response)) return null;

    $resData = json_decode($response, true);
    $text = $resData['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if (empty($text)) return null;

    $cleanJson = trim(preg_replace('/^```(?:json)?/i', '', trim($text)));
    $cleanJson = trim(preg_replace('/```$/i', '', $cleanJson));

    $parsed = json_decode($cleanJson, true);
    if (is_array($parsed) && !empty($parsed)) {
        if (isset($parsed['items']) && is_array($parsed['items'])) return $parsed['items'];
        return $parsed;
    }

    return null;
}

/**
 * Ekstraksi Data Stok dari File Spreadsheet (CSV / Excel .xlsx)
 */
function extractUnitsFromSpreadsheet($fileData, $ext, $apiKey = '', $caption = '') {
    if (empty($fileData)) return null;

    $rawText = "";

    if ($ext === 'csv' || $ext === 'txt') {
        $rawText = $fileData;
    } elseif ($ext === 'xlsx' || $ext === 'xls') {
        // Simpan sementara untuk diuraikan
        $tempFile = sys_get_temp_dir() . '/wa_stock_' . uniqid() . '.' . $ext;
        file_put_contents($tempFile, $fileData);

        // Coba gunakan node script xlsx yang sudah ada di sistem
        $nodeScript = "const xlsx = require('c:/laragon/www/followup-sales/server/node_modules/xlsx'); const wb = xlsx.readFile(process.argv[1]); const s = wb.Sheets[wb.SheetNames[0]]; console.log(xlsx.utils.sheet_to_csv(s));";
        $cmd = 'node -e ' . escapeshellarg($nodeScript) . ' ' . escapeshellarg($tempFile);
        $output = @shell_exec($cmd);

        if (!empty($output)) {
            $rawText = $output;
        }
        @unlink($tempFile);
    }

    if (empty($rawText)) return null;

    // Jika Gemini API Key tersedia, gunakan Gemini untuk parsing tabel CSV dengan sangat akurat
    if (!empty($apiKey)) {
        $prompt = "Berikut adalah data tabel spreadsheet stok mobil Toyota:\n\n" . substr($rawText, 0, 8000) . "\n\nEkstrak seluruh baris data mobil menjadi JSON format array: [{\"model\":\"...\",\"varian\":\"...\",\"warna\":\"...\",\"qty\":1,\"action\":\"set\",\"status\":\"Tersedia\",\"lokasi\":\"Kiaracondong\"}]";
        return extractUnitsWithGemini($prompt, $apiKey);
    }

    // Fallback: Smart local line-by-line parser
    return extractUnitsLocalSmartParser($rawText);
}

/**
 * Ekstraksi entitas unit mobil menggunakan AI Gemini dari teks
 */
function extractUnitsWithGemini($message, $apiKey) {
    if (empty($apiKey)) return null;

    $systemInstruction = <<<SYS
Anda adalah AI Data Extraction khusus Inventory Dealer Mobil Toyota Tunas.
Tugas Anda adalah membaca teks dari pengguna dan mengekstrak rincian pembaruan stok mobil ke dalam format JSON.

PENTING:
- Kenali model mobil Toyota: Avanza, Veloz, Calya, Agya, Innova Zenix, Innova Reborn, Rush, Raize, Fortuner, Yaris Cross, Yaris, Alphard, Vellfire, Voxy, Hilux, Corolla Cross, dll.
- Standarkan nama Varian (contoh: 1.5 G CVT, 1.2 G M/T, 2.0 V HEV, 2.4 G AT Diesel, GR Sport, Modellista, dll.).
- Standarkan Warna (contoh: Putih, Hitam, Silver Metallic, Abu-abu / Gray, Merah, Kuning, Bronze, dll.).
- Qty adalah bilangan bulat positif.
- Action bernilai: "add", "reduce", "empty", atau "set".
- Status: jika qty > 0 maka "Tersedia", jika 0 maka "Inden / Kosong".
- Output HANYA berupa array JSON valid tanpa markdown backticks atau teks tambahan apa pun.
SYS;

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $systemInstruction . "\n\nPesan:\n" . $message]
                ]
            ]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "maxOutputTokens" => 2048,
            "responseMimeType" => "application/json"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0
    ]);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if (empty($response)) return null;

    $resData = json_decode($response, true);
    $text = $resData['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if (empty($text)) return null;

    $cleanJson = trim(preg_replace('/^```(?:json)?/i', '', trim($text)));
    $cleanJson = trim(preg_replace('/```$/i', '', $cleanJson));

    $parsed = json_decode($cleanJson, true);
    if (is_array($parsed) && !empty($parsed)) {
        if (isset($parsed['items']) && is_array($parsed['items'])) {
            return $parsed['items'];
        }
        return $parsed;
    }

    return null;
}

/**
 * Ekstraksi Cerdas Berbasis Pola/Regex Toyota (Offline Fallback)
 */
function extractUnitsLocalSmartParser($message) {
    $modelsMap = [
        'innova zenix' => ['zenix', 'innova zenix', 'kijang zenix'],
        'innova reborn' => ['reborn', 'innova reborn', 'kijang reborn', 'innova 2.4'],
        'avanza' => ['avanza'],
        'veloz' => ['veloz'],
        'calya' => ['calya'],
        'agya' => ['agya', 'agya gr', 'stylix'],
        'rush' => ['rush', 'rush gr'],
        'raize' => ['raize', 'raize gr', 'raize turbo'],
        'fortuner' => ['fortuner', 'fortuner vrz', 'fortuner gr'],
        'yaris cross' => ['yaris cross', 'ycross'],
        'yaris' => ['yaris'],
        'alphard' => ['alphard'],
        'vellfire' => ['vellfire'],
        'voxy' => ['voxy'],
        'hilux' => ['hilux', 'rangga', 'hilux rangga'],
        'corolla cross' => ['corolla cross'],
        'camry' => ['camry']
    ];

    $colorsMap = [
        'putih' => 'Putih', 'white' => 'Putih', 'hitam' => 'Hitam', 'black' => 'Hitam',
        'silver' => 'Silver Metallic', 'abu' => 'Gray Metallic', 'grey' => 'Gray Metallic',
        'gray' => 'Gray Metallic', 'merah' => 'Merah', 'red' => 'Merah', 'kuning' => 'Kuning',
        'yellow' => 'Kuning', 'bronze' => 'Bronze Mica'
    ];

    $lines = preg_split('/[\r\n;,]+/', $message);
    $items = [];

    foreach ($lines as $line) {
        $l = trim($line);
        if (empty($l) || strlen($l) < 4) continue;
        $l_lower = strtolower($l);

        $matchedModel = null;
        foreach ($modelsMap as $modelName => $keywords) {
            foreach ($keywords as $kw) {
                if (strpos($l_lower, $kw) !== false) {
                    $matchedModel = ucwords($modelName);
                    break 2;
                }
            }
        }
        if (!$matchedModel) continue;

        $matchedColor = 'Semua Warna';
        foreach ($colorsMap as $ckw => $cName) {
            if (strpos($l_lower, $ckw) !== false) {
                $matchedColor = $cName;
                break;
            }
        }

        $varian = '';
        if (preg_match('/\b(v\s*hv|v\s*hybrid|q\s*hv|q\s*hybrid|g\s*hv|g\s*hybrid|hev|hybrid)\b/i', $l, $vm)) {
            $varian .= strtoupper($vm[1]) . ' ';
        } elseif (preg_match('/\b(2\.0\s*v|2\.0\s*g|2\.0\s*q|1\.5\s*g|1\.5\s*s|1\.3\s*e|1\.2\s*g|1\.2\s*e|2\.8\s*vrz|2\.4\s*vrz|2\.4\s*g)\b/i', $l, $vm)) {
            $varian .= strtoupper($vm[1]) . ' ';
        }

        if (preg_match('/\b(cvt|m\/t|a\/t|mt|at|manual|matic)\b/i', $l, $tm)) {
            $trans = strtoupper($tm[1]);
            if ($trans === 'MT' || $trans === 'MANUAL') $trans = 'M/T';
            if ($trans === 'AT' || $trans === 'MATIC') $trans = 'A/T';
            $varian .= $trans . ' ';
        }

        if (preg_match('/\b(gr\s*sport|gr|tss|modellista|modelista)\b/i', $l, $gm)) {
            $varian .= ucwords(strtolower($gm[1])) . ' ';
        }

        $varian = trim($varian);
        if (empty($varian)) $varian = 'Standar';

        $action = 'set';
        $qty = 1;
        $status = 'Tersedia';

        if (preg_match('/\b(habis|kosong|sold|terjual habis|0)\b/i', $l)) {
            $action = 'empty';
            $qty = 0;
            $status = 'Inden / Kosong';
        } else {
            if (preg_match('/(\+|-)?\s*(\d+)\s*(?:unit|buah|pcs|mobil)?/i', $l, $qm)) {
                $sign = $qm[1] ?? '';
                $num = intval($qm[2]);
                if ($sign === '+') {
                    $action = 'add';
                    $qty = $num;
                } elseif ($sign === '-') {
                    $action = 'reduce';
                    $qty = $num;
                } else {
                    $action = (strpos($l_lower, 'tambah') !== false || strpos($l_lower, 'masuk') !== false) ? 'add' : 'set';
                    $qty = $num;
                }
            } elseif (strpos($l_lower, 'tambah') !== false || strpos($l_lower, 'masuk') !== false) {
                $action = 'add';
                $qty = 1;
            }
        }

        $items[] = [
            'model' => $matchedModel,
            'varian' => $varian,
            'warna' => $matchedColor,
            'qty' => $qty,
            'action' => $action,
            'status' => $status,
            'lokasi' => 'Kiaracondong'
        ];
    }

    return $items;
}

function normalizeExtractedItem($item) {
    $rawModel = trim($item['model'] ?? ($item['nama_mobil'] ?? ($item['unit'] ?? '')));
    $varian = trim($item['varian'] ?? ($item['variant'] ?? ($item['tipe'] ?? '')));
    $warna = trim($item['warna'] ?? ($item['color'] ?? 'Semua Warna'));
    $qty = intval($item['qty'] ?? ($item['stok'] ?? ($item['qty_ready'] ?? ($item['jumlah'] ?? 0))));
    $action = trim($item['action'] ?? 'set');
    $lokasi = trim($item['lokasi'] ?? ($item['cabang'] ?? 'TR Kiaracondong'));

    // Bersihkan warna dari kata garing / garis miring (contoh: "HITAM / ATTITUDE BLACK" -> "Hitam")
    if (strpos($warna, '/') !== false) {
        $parts = explode('/', $warna);
        $warna = trim($parts[0]);
    }

    // Jika varian kosong, pisahkan nama model dan varian
    $modelKeywords = ['innova zenix', 'innova reborn', 'kijang zenix', 'kijang reborn', 'yaris cross', 'corolla cross', 'land cruiser', 'hilux rangga', 'avanza', 'veloz', 'calya', 'agya', 'rush', 'raize', 'fortuner', 'alphard', 'vellfire', 'voxy', 'hilux', 'camry'];

    $modelClean = $rawModel;
    foreach ($modelKeywords as $mk) {
        if (stripos($rawModel, $mk) === 0) {
            $modelClean = ucwords($mk);
            $rest = trim(substr($rawModel, strlen($mk)));
            if (empty($varian) && !empty($rest)) {
                $varian = $rest;
            }
            break;
        }
    }

    if (empty($varian)) {
        $varian = 'Standar';
    }

    $status = ($qty > 0) ? 'Tersedia' : 'Inden / Kosong';

    return [
        'model' => ucwords($modelClean),
        'varian' => trim($varian),
        'warna' => ucwords(strtolower($warna)),
        'qty' => $qty,
        'action' => $action,
        'status' => $status,
        'lokasi' => $lokasi
    ];
}

/**
 * Menyimpan data hasil ekstraksi ke database (tabel_inventory)
 */
function applyStockUpdatesToDatabase($conn, $items) {
    if (!$conn || empty($items)) {
        return [
            'success' => false,
            'results' => [],
            'message' => 'Koneksi database terputus atau tidak ada data yang valid.'
        ];
    }

    $results = [];

    foreach ($items as $rawItem) {
        $norm = normalizeExtractedItem($rawItem);
        $model = $conn->real_escape_string($norm['model']);
        $varian = $conn->real_escape_string($norm['varian']);
        $warna = $conn->real_escape_string($norm['warna']);
        $qtyInput = intval($norm['qty']);
        $action = $norm['action'];
        $lokasi = $conn->real_escape_string($norm['lokasi']);

        if (empty($model)) continue;

        // Cek apakah item sudah ada di tabel_inventory
        $checkSql = "SELECT id, stok, status, varian, warna FROM tabel_inventory WHERE LOWER(model) LIKE '%" . strtolower($model) . "%' AND LOWER(varian) LIKE '%" . strtolower($varian) . "%'";
        if (!empty($warna) && $warna !== 'Semua Warna') {
            $checkSql .= " AND (LOWER(warna) LIKE '%" . strtolower($warna) . "%' OR warna = 'Semua Warna' OR warna = '' OR warna IS NULL)";
        }
        $checkSql .= " LIMIT 1";

        $resCheck = $conn->query($checkSql);
        $existing = ($resCheck && $resCheck->num_rows > 0) ? $resCheck->fetch_assoc() : null;

        $newStok = $qtyInput;
        $statusStr = 'Tersedia';

        if ($existing) {
            $id = intval($existing['id']);
            $currentStok = intval($existing['stok'] ?? 0);

            if ($action === 'add') {
                $newStok = $currentStok + $qtyInput;
            } elseif ($action === 'reduce') {
                $newStok = max(0, $currentStok - $qtyInput);
            } elseif ($action === 'empty') {
                $newStok = 0;
            } else {
                $newStok = $qtyInput;
            }

            $statusStr = ($newStok > 0) ? 'Tersedia' : 'Inden / Kosong';

            $updSql = "UPDATE tabel_inventory SET stok = $newStok, status = '$statusStr', last_updated = NOW() WHERE id = $id";
            $conn->query($updSql);

            $results[] = [
                'operation' => 'UPDATE',
                'model' => $model,
                'varian' => !empty($existing['varian']) ? $existing['varian'] : $varian,
                'warna' => !empty($existing['warna']) ? $existing['warna'] : $warna,
                'prev_stok' => $currentStok,
                'stok' => $newStok,
                'status' => $statusStr,
                'action' => $action
            ];
        } else {
            if ($action === 'empty') {
                $newStok = 0;
                $statusStr = 'Inden / Kosong';
            } else {
                $newStok = max(0, $qtyInput);
                $statusStr = ($newStok > 0) ? 'Tersedia' : 'Inden / Kosong';
            }

            $insSql = "INSERT INTO tabel_inventory (model, varian, warna, stok, status, lokasi_1, last_updated) VALUES ('$model', '$varian', '$warna', $newStok, '$statusStr', '$lokasi', NOW())";
            $conn->query($insSql);

            $results[] = [
                'operation' => 'INSERT',
                'model' => $model,
                'varian' => $varian,
                'warna' => $warna,
                'prev_stok' => 0,
                'stok' => $newStok,
                'status' => $statusStr,
                'action' => $action
            ];
        }
    }

    return [
        'success' => true,
        'results' => $results
    ];
}

/**
 * Format Pesan Balasan WhatsApp Hasil Pembaruan Stok
 */
function formatStockUpdateWhatsAppReply($results, $sourceType = 'text') {
    if (empty($results)) {
        return "⚠️ *Tidak ada unit mobil yang berhasil diproses.*\nPastikan gambar/dokumen/teks menyertakan nama tipe mobil Toyota dan jumlah unitnya.";
    }

    $headerIcon = ($sourceType === 'image') ? "📸 *FOTO / GAMBAR BERHASIL DIPINDAI & DISIMPAN!*" : (($sourceType === 'document') ? "📄 *FILE DOKUMEN BERHASIL DIIMPOR & DISIMPAN!*" : "✅ *UPDATE STOK BERHASIL DISIMPAN KE DATABASE!*");

    $text = "{$headerIcon} 🚗💨\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "📋 *Rincian Data Unit Terdeteksi:*\n\n";

    $no = 1;
    foreach ($results as $r) {
        $badgeStatus = ($r['stok'] > 0) ? "🟢 Tersedia" : "🔴 Inden / Kosong";
        $actText = "";
        if ($r['action'] === 'add') {
            $diff = $r['stok'] - $r['prev_stok'];
            $actText = "Tambah (+{$diff} Unit)";
        } elseif ($r['action'] === 'reduce') {
            $diff = $r['prev_stok'] - $r['stok'];
            $actText = "Kurang (-{$diff} Unit)";
        } elseif ($r['action'] === 'empty') {
            $actText = "Set Habis / Kosong";
        } else {
            $actText = "Set Stok";
        }

        $text .= "*{$no}. {$r['model']} {$r['varian']}*\n";
        $text .= "   • Warna: *{$r['warna']}*\n";
        $text .= "   • Aksi: _{$actText}_\n";
        $text .= "   • Total Stok Sekarang: *{$r['stok']} Unit* ({$badgeStatus})\n\n";
        $no++;
    }

    $text .= "━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "💡 *Knowledge Base T-Stock Langsung Aktif!*\n";
    $text .= "_Jika sales atau customer lain bertanya ketersediaan unit di atas, bot akan langsung memberikan informasi stok terbaru ini._";

    return $text;
}

/**
 * Handler Utama untuk Permintaan Update Stok via Lampiran Media (Gambar / File Dokumen)
 */
function handleWhatsAppMediaStockUpdate($conn, $sender, $mediaUrl, $caption = '', $filename = '', $mimeType = '') {
    // 1. Verifikasi Otorisasi Nomor Pengirim
    if (!isAuthorizedStockAdmin($conn, $sender)) {
        $senderNorm = normalizePhoneNumber($sender);
        return "⛔ *AKSES DITOLAK: FITUR KHUSUS ADMIN / SPV*\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "Nomor WhatsApp Anda (*{$senderNorm}*) belum terdaftar sebagai pengelola stok database T-Stock.\n\n" .
               "Jika Anda adalah Admin / Supervisor resmi, silakan daftarkan nomor ini dengan mengetik:\n" .
               "*#admin 154*";
    }

    // 2. Unduh file media
    $media = downloadMediaFile($mediaUrl);
    if (!$media || empty($media['data'])) {
        return "❌ *Gagal mengunduh file lampiran WhatsApp.*\nPastikan file atau gambar terkirim secara utuh.";
    }

    $ext = !empty($filename) ? strtolower(pathinfo($filename, PATHINFO_EXTENSION)) : $media['ext'];
    $detectedMime = !empty($mimeType) ? strtolower($mimeType) : $media['mime'];
    $apiKey = resolveGeminiApiKey();

    $items = null;
    $sourceType = 'image';

    // 3. Cabang Pemrosesan Berdasarkan Jenis File
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'heic']) || strpos($detectedMime, 'image/') === 0) {
        $sourceType = 'image';
        if (empty($apiKey)) {
            return "⚠️ *Kunci Google Gemini AI belum terpasang.*\nFitur analisis gambar memerlukan API Key aktif untuk membaca foto.";
        }
        $items = extractUnitsFromImageWithGeminiVision($media['data'], $detectedMime, $apiKey, $caption);
    } elseif ($ext === 'pdf' || strpos($detectedMime, 'pdf') !== false) {
        $sourceType = 'document';
        if (empty($apiKey)) {
            return "⚠️ *Kunci Google Gemini AI belum terpasang.*\nFitur analisis PDF memerlukan API Key aktif.";
        }
        $items = extractUnitsFromPdfWithGemini($media['data'], $apiKey, $caption);
    } elseif (in_array($ext, ['xlsx', 'xls', 'csv', 'txt']) || strpos($detectedMime, 'spreadsheet') !== false || strpos($detectedMime, 'csv') !== false) {
        $sourceType = 'document';
        $items = extractUnitsFromSpreadsheet($media['data'], $ext, $apiKey, $caption);
    } else {
        // Coba deteksi gambar secara default jika mime tidak jelas
        if (!empty($apiKey)) {
            $items = extractUnitsFromImageWithGeminiVision($media['data'], 'image/jpeg', $apiKey, $caption);
        }
    }

    if (empty($items)) {
        return "⚠️ *AI belum dapat mendeteksi data unit mobil dari lampiran tersebut.*\n\n" .
               "Pastikan:\n" .
               "1. Foto tabel/tulisan terlihat terang, jelas, dan tidak buram.\n" .
               "2. Terdapat nama model mobil Toyota (misal: Zenix, Calya, Avanza) beserta jumlah unitnya.\n" .
               "3. Anda juga dapat menambahkan teks keterangan di caption saat mengirim foto.";
    }

    // 4. Terapkan ke Database (tabel_inventory)
    $dbRes = applyStockUpdatesToDatabase($conn, $items);
    if (!$dbRes['success']) {
        return "❌ *Gagal menyimpan ke database:* " . ($dbRes['message'] ?? 'Kesalahan internal.');
    }

    return formatStockUpdateWhatsAppReply($dbRes['results'], $sourceType);
}

/**
 * Handle Utama untuk Permintaan Update Stok via WhatsApp (Teks)
 */
function handleWhatsAppStockUpdate($conn, $sender, $message, $geminiApiKey = '') {
    $m = trim($message);

    // 1. Cek Perintah Pendaftaran Admin via PIN (#admin 154)
    if (preg_match('/^#(?:admin|daftar)\s*(.*)$/i', $m, $regMatches)) {
        $pin = trim($regMatches[1] ?? '');
        $regResult = registerStockAdmin($sender, $pin);
        return $regResult['message'];
    }

    // 2. Cek Perintah Panduan Bantuan (#bantuan / #help)
    if (preg_match('/^#(?:bantuan|help)/i', $m)) {
        return "📖 *PANDUAN UPDATE STOK VIA WHATSAPP (T-STOCK AI)*\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "Anda dapat memperbarui stok unit mobil dengan 3 cara praktis:\n\n" .
               "1. 💬 *Kirim Teks Santai:*\n" .
               "   _\"Update stok masuk: Zenix V Hybrid hitam 2 unit, Calya G MT putih 1 unit\"_\n\n" .
               "2. 📸 *Kirim Foto / Screenshot:*\n" .
               "   Cukup foto coretan papan tulis, surat jalan DO, atau screenshot tabel Excel di monitor lalu kirim ke bot ini.\n\n" .
               "3. 📄 *Kirim File Dokumen:*\n" .
               "   Kirim atau forward file Excel (.xlsx), CSV, atau PDF stok mingguan.\n\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "🔑 *Perintah Admin:*\n" .
               "• *#admin 154*: Daftarkan nomor WA ini sebagai Admin Stok.\n" .
               "• *#bantuan*: Menampilkan petunjuk ini.";
    }

    // 3. Verifikasi Otorisasi Nomor Pengirim
    if (!isAuthorizedStockAdmin($conn, $sender)) {
        $senderNorm = normalizePhoneNumber($sender);
        return "⛔ *AKSES DITOLAK: FITUR KHUSUS ADMIN / SPV*\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "Nomor WhatsApp Anda (*{$senderNorm}*) belum terdaftar sebagai pengelola stok database T-Stock.\n\n" .
               "Jika Anda adalah Admin / Supervisor resmi, silakan daftarkan nomor ini dengan mengetik:\n" .
               "*#admin 154*";
    }

    // 4. Ekstraksi Entitas Unit Mobil
    if (empty($geminiApiKey)) {
        $geminiApiKey = resolveGeminiApiKey();
    }

    $items = null;
    if (!empty($geminiApiKey)) {
        $items = extractUnitsWithGemini($m, $geminiApiKey);
    }

    if (empty($items)) {
        $items = extractUnitsLocalSmartParser($m);
    }

    if (empty($items)) {
        return "⚠️ *Data mobil tidak terbaca secara jelas.*\n\n" .
               "Pastikan menyebutkan nama model Toyota (misal: *Zenix, Avanza, Calya, Reborn, Rush*) serta jumlah unitnya.\n\n" .
               "Contoh:\n_\"Update stok: Zenix V Hybrid Hitam 2 unit\"_";
    }

    // 5. Terapkan ke Database (tabel_inventory)
    $dbRes = applyStockUpdatesToDatabase($conn, $items);
    if (!$dbRes['success']) {
        return "❌ *Gagal menyimpan ke database:* " . ($dbRes['message'] ?? 'Kesalahan internal.');
    }

    return formatStockUpdateWhatsAppReply($dbRes['results'], 'text');
}
