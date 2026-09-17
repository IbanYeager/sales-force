<?php
// api/wa_stock_updater.php
// AI Engine & Handler untuk Update Stok Unit Mobil via WhatsApp (Natural Language Processing + Auto DB Sync)

if (!defined('STOCK_UPDATER_LOADED')) {
    define('STOCK_UPDATER_LOADED', true);
}

/**
 * Normalisasi nomor telepon ke format numerik standar (contoh: 628123456789 atau 08123456789)
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
        'message' => "✅ *NOMOR ANDA BERHASIL DIAKTIFKAN SEBAGAI ADMIN T-STOCK!*\n\nNomor: *{$senderNorm}*\nSekarang Anda memiliki akses penuh untuk memperbarui, menambah, atau mengosongkan stok unit mobil langsung dari percakapan WhatsApp ini.\n\n💡 *Contoh Cara Update:*\nKetik pesan seperti:\n_\"Update stok: Zenix V Hybrid hitam 2 unit, Calya G MT putih 1 unit\"_\natau ketik *#bantuan* untuk melihat panduan lengkap."
    ];
}

/**
 * Deteksi apakah pesan pengguna mengindikasikan perintah/permintaan update stok
 */
function detectStockUpdateIntent($message) {
    $m = strtolower(trim($message));

    // Perintah khusus diawali hashtag atau slash
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

    // Pola kalimat: ada penyebutan nama mobil + kata "masuk" / "ada" / "tambah" / "ready" + angka unit
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
 * Ekstraksi entitas unit mobil menggunakan AI Gemini (jika API Key tersedia)
 */
function extractUnitsWithGemini($message, $apiKey) {
    if (empty($apiKey)) return null;

    $systemInstruction = <<<SYS
Anda adalah AI Data Extraction khusus Inventory Dealer Mobil Toyota Tunas.
Tugas Anda adalah membaca pesan WhatsApp dari pengguna dan mengekstrak rincian pembaruan stok mobil ke dalam format JSON.

PENTING:
- Kenali model mobil Toyota: Avanza, Veloz, Calya, Agya, Innova Zenix, Innova Reborn, Rush, Raize, Fortuner, Yaris Cross, Yaris, Alphard, Vellfire, Voxy, Hilux, Corolla Cross, dll.
- Standarkan nama Varian (contoh: 1.5 G CVT, 1.2 G M/T, 2.0 V HEV, 2.4 G AT Diesel, GR Sport, Modellista, dll.).
- Standarkan Warna (contoh: Putih, Hitam, Silver Metallic, Abu-abu / Gray, Merah, Kuning, Bronze, dll.).
- Qty adalah bilangan bulat positif.
- Action bernilai:
  - "add" jika dinyatakan masuk, bertambah, tanda +, atau unit baru
  - "reduce" jika dinyatakan terjual, keluar, tanda -
  - "empty" jika dinyatakan habis, kosong, atau 0
  - "set" jika dinyatakan stoknya menjadi sekian
- Status: jika qty > 0 atau action bukan empty maka "Tersedia", jika habis/kosong/0 maka "Inden / Kosong".
- Output HANYA berupa array JSON valid tanpa markdown backticks atau teks tambahan apa pun.

Format Contoh:
[
  {
    "model": "Innova Zenix",
    "varian": "2.0 V HEV",
    "warna": "Hitam",
    "qty": 2,
    "action": "add",
    "status": "Tersedia",
    "lokasi": "Kircon"
  }
]
SYS;

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $systemInstruction . "\n\nPesan WhatsApp Pengguna:\n" . $message]
                ]
            ]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "maxOutputTokens" => 1024,
            "responseMimeType" => "application/json"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 12
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
        // Jika return object membungkus array
        if (isset($parsed['items']) && is_array($parsed['items'])) {
            return $parsed['items'];
        }
        return $parsed;
    }

    return null;
}

/**
 * Ekstraksi Cerdas Berbasis Pola/Regex Toyota (Offline Fallback - 100% Berfungsi Tanpa Kuota AI)
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
        'putih' => 'Putih',
        'white' => 'Putih',
        'hitam' => 'Hitam',
        'black' => 'Hitam',
        'silver' => 'Silver Metallic',
        'abu' => 'Gray Metallic',
        'grey' => 'Gray Metallic',
        'gray' => 'Gray Metallic',
        'merah' => 'Merah',
        'red' => 'Merah',
        'kuning' => 'Kuning',
        'yellow' => 'Kuning',
        'bronze' => 'Bronze Mica'
    ];

    // Pecah pesan jika user memasukkan beberapa unit (misal via baris baru, koma, titik koma, atau bullet)
    $lines = preg_split('/[\r\n;,]+/', $message);
    $items = [];

    foreach ($lines as $line) {
        $l = trim($line);
        if (empty($l) || strlen($l) < 4) continue;
        $l_lower = strtolower($l);

        // Cari Model
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

        // Cari Warna
        $matchedColor = 'Semua Warna';
        foreach ($colorsMap as $ckw => $cName) {
            if (strpos($l_lower, $ckw) !== false) {
                $matchedColor = $cName;
                break;
            }
        }

        // Cari Varian
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
        if (empty($varian)) {
            $varian = 'Standar';
        }

        // Cari Action & Quantity
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

    foreach ($items as $item) {
        $model = $conn->real_escape_string(trim($item['model'] ?? ''));
        $varian = $conn->real_escape_string(trim($item['varian'] ?? ''));
        $warna = $conn->real_escape_string(trim($item['warna'] ?? 'Semua Warna'));
        $qtyInput = intval($item['qty'] ?? 0);
        $action = $item['action'] ?? 'set';
        $lokasi = $conn->real_escape_string(trim($item['lokasi'] ?? 'TR Kiaracondong'));

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
            // Insert baru
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
function formatStockUpdateWhatsAppReply($results) {
    if (empty($results)) {
        return "⚠️ *Tidak ada unit mobil yang berhasil diproses.*\nPastikan pesan menyertakan nama tipe mobil Toyota dan jumlah unitnya.\nContoh: _\"Update stok: Zenix V Hybrid hitam 2 unit\"_";
    }

    $text = "✅ *UPDATE STOK BERHASIL DISIMPAN KE DATABASE!* 🚗💨\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "📋 *Rincian Pembaruan Data Unit:*\n\n";

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
 * Handle Utama untuk Permintaan Update Stok via WhatsApp
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
               "Anda dapat memperbarui stok unit mobil hanya dengan mengirimkan teks obrolan santai ke bot ini.\n\n" .
               "📌 *Contoh Format Bebas yang Dipahami AI:*\n" .
               "1. *Tambah Stok:*\n" .
               "   _\"Update stok masuk: Zenix V Hybrid hitam 2 unit, Calya G MT putih 1 unit\"_\n\n" .
               "2. *Stok Terjual / Habis:*\n" .
               "   _\"Avanza G CVT silver sudah habis / inden ya\"_\n\n" .
               "3. *Update Cepat / Singkat:*\n" .
               "   _\"Tambah stok: Rush GR AT putih +2\"_\n\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "🔑 *Perintah Khusus Admin:*\n" .
               "• *#admin <pin>*: Daftarkan nomor WA ini sebagai Admin Stok.\n" .
               "• *#bantuan*: Menampilkan petunjuk ini.";
    }

    // 3. Verifikasi Otorisasi Nomor Pengirim
    if (!isAuthorizedStockAdmin($conn, $sender)) {
        $senderNorm = normalizePhoneNumber($sender);
        return "⛔ *AKSES DITOLAK: FITUR KHUSUS ADMIN / SPV*\n" .
               "━━━━━━━━━━━━━━━━━━━━\n" .
               "Nomor WhatsApp Anda (*{$senderNorm}*) belum terdaftar sebagai pengelola stok database T-Stock.\n\n" .
               "Jika Anda adalah Admin / Supervisor resmi, silakan daftarkan nomor ini dengan mengetik:\n" .
               "*#admin 154*\n" .
               "_(154 adalah kode otorisasi resmi Tunas Toyota Kiara Condong)_";
    }

    // 4. Ekstraksi Entitas Unit Mobil
    // Prioritas 1: AI Gemini (jika API Key tersedia)
    $items = null;
    if (!empty($geminiApiKey)) {
        $items = extractUnitsWithGemini($m, $geminiApiKey);
    }

    // Prioritas 2 / Fallback: Smart Local Regex Parser
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

    // 6. Kembalikan Pesan Konfirmasi Rapi
    return formatStockUpdateWhatsAppReply($dbRes['results']);
}
