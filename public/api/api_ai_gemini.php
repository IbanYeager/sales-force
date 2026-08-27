<?php
// api/api_ai_gemini.php
// Endpoint Integrasi Google Gemini AI + Live Database SQL Engine untuk Sales Copilot Tunas Toyota

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/koneksi.php';

$configFile = __DIR__ . '/config_ai.json';

// Helper to get saved config
function getAiConfig($configFile) {
    if (file_exists($configFile)) {
        $json = @file_get_contents($configFile);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    return ['gemini_api_key' => '', 'model' => 'gemini-3.1-flash-lite'];
}

// Helper normalizer functions for ultra-clean responses
function cleanModelVariantName($raw) {
    $name = trim($raw);
    $unwanted = [
        '/-NON PREMIUM COLOR-TCO/i',
        '/-PREMIUM COLOR-TCO/i',
        '/-NON PREMIUM COLOR/i',
        '/-PREMIUM COLOR/i',
        '/-NON RSE-PREMIUM COLOR/i',
        '/-NON RSE/i',
        '/ - ONE TONE-NON PREMIUM COLOR/i',
        '/ - ONE TONE-PREMIUM COLOR/i',
        '/ - TWO TONE-PREMIUM COLOR/i',
        '/ - ONE TONE/i',
        '/ - TWO TONE/i',
        '/ - NON PREMIUM COLOR/i',
        '/ - PREMIUM COLOR/i',
        '/ TCO$/i',
        '/-TCO$/i'
    ];
    $name = preg_replace($unwanted, '', $name);
    
    $words = explode(' ', $name);
    $formattedWords = [];
    foreach ($words as $w) {
        $up = strtoupper($w);
        if (in_array($up, ['CVT', 'HV', 'TSS', 'A/T', 'M/T', 'AT', 'MT', 'GR', 'DSL', '4X2', '4X4', '4WD', '2WD', 'HEV', 'EV', 'Q', 'V', 'G', 'E', 'S', 'XE', 'VRZ', 'SRZ', 'TRD'])) {
            $formattedWords[] = $up;
        } elseif ($up === 'MODELLISTA' || $up === 'MODELISTA') {
            $formattedWords[] = 'Modellista';
        } else {
            $formattedWords[] = ucfirst(strtolower($w));
        }
    }
    $name = implode(' ', $formattedWords);
    $name = preg_replace('/\s+/', ' ', $name);
    return trim($name);
}

function cleanColorName($raw) {
    $raw = trim($raw);
    $words = explode(' ', strtolower($raw));
    $formatted = array_map(function($w) {
        if ($w === 'ii') return 'II';
        if ($w === 'iii') return 'III';
        if ($w === 'iv') return 'IV';
        if ($w === 'm.m.' || $w === 'mm') return 'M.M.';
        return ucfirst($w);
    }, $words);
    return implode(' ', $formatted);
}

function cleanSiteName($rawSite) {
    $parts = explode('-', $rawSite, 2);
    $str = count($parts) > 1 ? $parts[1] : $parts[0];
    $str = trim($str);
    if (stripos($str, 'TR ') === 0) {
        $rest = substr($str, 3);
        return 'TR ' . ucwords(strtolower(trim($rest)));
    }
    return ucwords(strtolower($str));
}

function cleanWarehouseName($rawWh) {
    $parts = explode('-', $rawWh);
    if (count($parts) >= 3) {
        return trim(end($parts));
    } elseif (count($parts) == 2) {
        return trim($parts[1]);
    }
    return trim($rawWh);
}

function getCarImageFilename($modelName) {
    $m = strtolower($modelName);
    if (strpos($m, 'supra') !== false) return 'supra.webp';
    if (strpos($m, 'gr 86') !== false || strpos($m, 'gr86') !== false || strpos($m, '86') !== false) return 'gr-86.webp';
    if (strpos($m, 'gr corolla') !== false) return 'gr-corolla.webp';
    if (strpos($m, 'gr yaris') !== false) return 'gr-yaris.webp';
    if (strpos($m, 'bz4x') !== false) return 'bz4x.webp';
    if (strpos($m, 'prius') !== false) return 'prius.webp';
    if (strpos($m, 'dyna') !== false) return 'dyna.webp';
    if (strpos($m, 'zenix') !== false) return 'zenix.webp';
    if (strpos($m, 'reborn') !== false || strpos($m, 'kijang') !== false || strpos($m, 'innova') !== false) return 'innova-reborn.webp';
    if (strpos($m, 'veloz') !== false) return (strpos($m, 'hybrid') !== false || strpos($m, 'hv') !== false) ? 'veloz-hybrid.webp' : 'veloz.webp';
    if (strpos($m, 'avanza') !== false) return 'avanza.webp';
    if (strpos($m, 'calya') !== false) return 'calya.webp';
    if (strpos($m, 'fortuner') !== false) return (strpos($m, 'gr') !== false || strpos($m, 'improvement') !== false) ? 'fortuner-improvement.webp' : 'fortuner.webp';
    if (strpos($m, 'rush') !== false) return 'rush.webp';
    if (strpos($m, 'raize') !== false) return (strpos($m, 'gr') !== false || strpos($m, 'improvement') !== false) ? 'raize-improvement.webp' : 'raize.webp';
    if (strpos($m, 'agya') !== false) return (strpos($m, 'gr') !== false || strpos($m, 'stylix') !== false) ? 'agya-gr-s.webp' : 'agya.webp';
    if (strpos($m, 'yaris cross') !== false) return 'yaris-cross.webp';
    if (strpos($m, 'yaris') !== false) return 'yaris.webp';
    if (strpos($m, 'alphard') !== false) return 'alphard.webp';
    if (strpos($m, 'vellfire') !== false) return 'vellfire.webp';
    if (strpos($m, 'voxy') !== false) return (strpos($m, 'improvement') !== false) ? 'voxy-improvement.webp' : 'voxy.webp';
    if (strpos($m, 'hiace') !== false || strpos($m, 'hi ace') !== false) return (strpos($m, 'premio') !== false) ? 'hi-ace-premio.webp' : 'hi-ace-comm.webp';
    if (strpos($m, 'rangga') !== false) return 'rangga.webp';
    if (strpos($m, 'single cabin') !== false || strpos($m, 'single cab') !== false) return 'single-cabin.webp';
    if (strpos($m, 'hilux') !== false || strpos($m, 'cabin') !== false || strpos($m, 'double') !== false) return 'double-cabin.webp';
    if (strpos($m, 'land cruiser') !== false || strpos($m, 'lc300') !== false) return 'land-cruiser.webp';
    if (strpos($m, 'urban cruiser') !== false) return 'urban-cruiser.webp';
    if (strpos($m, 'corolla cross') !== false || strpos($m, 'cross') !== false) return 'corolla-cross.webp';
    if (strpos($m, 'camry') !== false) return 'camry.webp';
    if (strpos($m, 'vios') !== false) return (strpos($m, 'hybrid') !== false || strpos($m, 'hv') !== false) ? 'vios-hybrid.webp' : 'vios.webp';
    if (strpos($m, 'altis') !== false || strpos($m, 'corolla') !== false) return 'altis.webp';
    return 'avanza.webp';
}

// Function to fetch Live Real-time SQL Database Context
function getLiveSqlContext($conn, $userQuery) {
    if (!$conn) return "";
    $q = strtolower($userQuery);
    $context = "";

    // 1. Detect Model keywords
    $modelKeywords = [
        'supra' => ['supra', 'gr supra'],
        'gr 86' => ['gr 86', 'gr86', 'toyota 86', 'ft 86'],
        'gr corolla' => ['gr corolla'],
        'gr yaris' => ['gr yaris'],
        'bz4x' => ['bz4x'],
        'prius' => ['prius'],
        'dyna' => ['dyna'],
        'zenix' => ['zenix'],
        'innova' => ['innova', 'kijang', 'reborn'],
        'veloz' => ['veloz'],
        'avanza' => ['avanza'],
        'calya' => ['calya'],
        'fortuner' => ['fortuner'],
        'rush' => ['rush'],
        'raize' => ['raize'],
        'agya' => ['agya', 'stylix'],
        'yaris cross' => ['yaris cross'],
        'yaris' => ['yaris'],
        'alphard' => ['alphard'],
        'vellfire' => ['vellfire'],
        'voxy' => ['voxy'],
        'hiace' => ['hiace', 'hi ace'],
        'rangga' => ['rangga'],
        'hilux' => ['hilux'],
        'land cruiser' => ['land cruiser', 'lc300', 'landcruiser'],
        'camry' => ['camry'],
        'vios' => ['vios'],
        'corolla' => ['corolla', 'altis'],
        'urban cruiser' => ['urban cruiser']
    ];

    // Detect color keywords
    $colorKeywords = [
        'putih' => 'white',
        'white' => 'white',
        'hitam' => 'black',
        'black' => 'black',
        'silver' => 'silver',
        'abu' => 'gray',
        'grey' => 'gray',
        'gray' => 'gray',
        'merah' => 'red',
        'red' => 'red',
        'kuning' => 'yellow',
        'yellow' => 'yellow',
        'bronze' => 'bronze'
    ];

    $matchedModels = [];
    foreach ($modelKeywords as $modelKey => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($q, $alias) !== false) {
                $matchedModels[] = $modelKey;
                break;
            }
        }
    }

    $matchedColors = [];
    foreach ($colorKeywords as $colorWord => $colorSql) {
        if (strpos($q, $colorWord) !== false) {
            $matchedColors[] = $colorSql;
        }
    }

    $isStockQuery = (
        strpos($q, 'stok') !== false || 
        strpos($q, 'stock') !== false || 
        strpos($q, 'ready') !== false || 
        strpos($q, 'unit') !== false || 
        strpos($q, 'gudang') !== false ||
        strpos($q, 'warna') !== false ||
        strpos($q, 'ada apa') !== false ||
        strpos($q, 'punya') !== false ||
        strpos($q, 'tersedia') !== false ||
        strpos($q, 'cek') !== false ||
        !empty($matchedModels)
    );

    if ($isStockQuery) {
        $whereClauses = ["(availability_status LIKE '%Available%' OR availability_status = 'Tersedia')"];

        if (!empty($matchedModels)) {
            $modelConditions = [];
            foreach ($matchedModels as $m) {
                if ($m === 'innova') {
                    $modelConditions[] = "(product_description LIKE '%INNOVA%' AND product_description NOT LIKE '%ZENIX%')";
                } elseif ($m === 'zenix') {
                    $modelConditions[] = "product_description LIKE '%ZENIX%'";
                } elseif ($m === 'yaris') {
                    $modelConditions[] = "(product_description LIKE '%YARIS%' AND product_description NOT LIKE '%CROSS%')";
                } elseif ($m === 'yaris cross') {
                    $modelConditions[] = "product_description LIKE '%YARIS CROSS%'";
                } elseif ($m === 'hilux' || $m === 'rangga') {
                    $modelConditions[] = "(product_description LIKE '%HILUX%' OR product_description LIKE '%RANGGA%')";
                } else {
                    $modelConditions[] = "product_description LIKE '%" . strtoupper($m) . "%'";
                }
            }
            $whereClauses[] = "(" . implode(" OR ", $modelConditions) . ")";
        }

        if (!empty($matchedColors)) {
            $colorConditions = [];
            foreach ($matchedColors as $col) {
                $colorConditions[] = "color_description LIKE '%" . strtoupper($col) . "%'";
            }
            $whereClauses[] = "(" . implode(" OR ", $colorConditions) . ")";
        }

        $whereSql = implode(" AND ", $whereClauses);

        $sql = "SELECT product_description, color_description, site, COUNT(*) as qty 
                FROM stock_inventory_essential 
                WHERE $whereSql 
                GROUP BY product_description, color_description, site 
                ORDER BY product_description ASC, qty DESC";

        $res = $conn->query($sql);

        if ($res && $res->num_rows > 0) {
            $tree = [];
            $totalAll = 0;

            while ($r = $res->fetch_assoc()) {
                $v = cleanModelVariantName($r['product_description']);
                $c = cleanColorName($r['color_description']);
                $s = cleanSiteName($r['site']);
                $qty = (int)$r['qty'];

                if (!isset($tree[$v])) {
                    $tree[$v] = [
                        'total' => 0,
                        'colors' => []
                    ];
                }

                if (!isset($tree[$v]['colors'][$c])) {
                    $tree[$v]['colors'][$c] = [
                        'total' => 0,
                        'sites' => []
                    ];
                }

                $tree[$v]['total'] += $qty;
                $tree[$v]['colors'][$c]['total'] += $qty;
                $tree[$v]['colors'][$c]['sites'][$s] = ($tree[$v]['colors'][$c]['sites'][$s] ?? 0) + $qty;
                $totalAll += $qty;
            }

            $modelTitle = !empty($matchedModels) ? ucwords(implode(' / ', $matchedModels)) : 'Toyota';
            $context .= "### DATA LIVE STOK GUDANG UNIT READY SPESIFIK (Tabel 'stock_inventory_essential'):\n";
            $context .= "Total Ready {$modelTitle}: {$totalAll} Unit\n\n";

            foreach ($tree as $vName => $vData) {
                $img = getCarImageFilename($vName);
                $context .= "###VAR_START:{$vName}:{$img}###\n";
                $context .= "📌 **{$vName}** • *{$vData['total']} unit*\n";

                uasort($vData['colors'], function($a, $b) { return $b['total'] - $a['total']; });

                foreach ($vData['colors'] as $cName => $cData) {
                    $context .= "• **{$cName}**: {$cData['total']} unit\n";
                    
                    arsort($cData['sites']);
                    $siteDetails = [];
                    $countSites = 0;
                    $totalSites = count($cData['sites']);
                    foreach ($cData['sites'] as $siteName => $siteQty) {
                        if ($countSites < 5) {
                            $siteDetails[] = "{$siteName} ({$siteQty})";
                        }
                        $countSites++;
                    }
                    $siteStr = implode(', ', $siteDetails);
                    if ($totalSites > 5) {
                        $siteStr .= " *(+" . ($totalSites - 5) . " cabang lain)*";
                    }
                    $context .= "📍 *Cabang: {$siteStr}*\n";
                }
                $context .= "###VAR_END###\n";
            }
        } else {
            if (!empty($matchedModels)) {
                $mCheck = strtoupper($matchedModels[0]);
                $resNonAvail = $conn->query("SELECT product_description, color_description, availability_status, COUNT(*) as qty FROM stock_inventory_essential WHERE product_description LIKE '%$mCheck%' GROUP BY product_description, color_description, availability_status LIMIT 10");
                if ($resNonAvail && $resNonAvail->num_rows > 0) {
                    $context .= "### INFORMASI STATUS UNIT DI DATABASE:\n";
                    $context .= "Unit " . ucwords($matchedModels[0]) . " saat ini tidak ada yang Ready Stock (Available). Status di database:\n";
                    while ($r = $resNonAvail->fetch_assoc()) {
                        $context .= "- **{$r['product_description']}** | Warna: {$r['color_description']} | Status: *{$r['availability_status']}* ({$r['qty']} unit)\n";
                    }
                    $context .= "\n";
                }
            }
        }
    }

    // 2. Pricelist OTR Jawa Barat
    if (strpos($q, 'harga') !== false || strpos($q, 'price') !== false || strpos($q, 'pricelist') !== false || strpos($q, 'otr') !== false || strpos($q, 'jual') !== false || strpos($q, 'biaya') !== false || strpos($q, 'murah') !== false) {
        $res = $conn->query("SELECT model, type, transmission, pricelist FROM pricelist_mobil WHERE otr_wilayah = 'JAWA BARAT' LIMIT 25");
        if ($res && $res->num_rows > 0) {
            $context .= "### DATA LIVE PRICELIST OTR JAWA BARAT (DARI TABEL SQL 'pricelist_mobil'):\n";
            while ($r = $res->fetch_assoc()) {
                $formattedPrice = "Rp " . number_format($r['pricelist'], 0, ',', '.');
                $context .= "- {$r['model']} {$r['type']} {$r['transmission']}: {$formattedPrice}\n";
            }
            $context .= "\n";
        }
    }

    // 3. SPK & Penjualan DO
    if (strpos($q, 'spk') !== false || strpos($q, 'penjualan') !== false || strpos($q, 'do') !== false || strpos($q, 'closing') !== false || strpos($q, 'deal') !== false || strpos($q, 'laku') !== false) {
        $res = $conn->query("SELECT model, status, COUNT(*) as total FROM tabel_spk GROUP BY model, status LIMIT 15");
        if ($res && $res->num_rows > 0) {
            $context .= "### DATA LIVE STATUS SPK & DO PENJUALAN (DARI TABEL SQL 'tabel_spk'):\n";
            while ($r = $res->fetch_assoc()) {
                $context .= "- {$r['model']} | Status: {$r['status']} | Total: {$r['total']} unit\n";
            }
            $context .= "\n";
        }
    }

    // 4. Customer & Prospek
    if (strpos($q, 'customer') !== false || strpos($q, 'prospek') !== false || strpos($q, 'konsumen') !== false || strpos($q, 'leads') !== false || strpos($q, 'hot') !== false) {
        $res = $conn->query("SELECT nama, alamat, status FROM tabel_customer ORDER BY id DESC LIMIT 10");
        if ($res && $res->num_rows > 0) {
            $context .= "### DATA LIVE PROSPEK KONSUMEN TERBARU (DARI TABEL SQL 'tabel_customer'):\n";
            while ($r = $res->fetch_assoc()) {
                $context .= "- {$r['nama']} ({$r['alamat']}) | Status: {$r['status']}\n";
            }
            $context .= "\n";
        }
    }

    // 5. Test Drive Unit
    if (strpos($q, 'test drive') !== false || strpos($q, 'testdrive') !== false || strpos($q, 'coba') !== false) {
        $res = $conn->query("SELECT nama_unit, plat_nomor, status FROM tabel_test_drive_unit LIMIT 10");
        if ($res && $res->num_rows > 0) {
            $context .= "### DATA LIVE UNIT TEST DRIVE READY (DARI TABEL SQL 'tabel_test_drive_unit'):\n";
            while ($r = $res->fetch_assoc()) {
                $context .= "- {$r['nama_unit']} ({$r['plat_nomor']}) | Status: {$r['status']}\n";
            }
            $context .= "\n";
        }
    }

    // 6. Aktivitas Sales & Canvassing
    if (strpos($q, 'aktivitas') !== false || strpos($q, 'kegiatan') !== false || strpos($q, 'canvassing') !== false || strpos($q, 'lapangan') !== false) {
        $res = $conn->query("SELECT nama_sales, tipe_aktivitas, keterangan, sesi_waktu, created_at FROM aktivitas ORDER BY id DESC LIMIT 8");
        if ($res && $res->num_rows > 0) {
            $context .= "### DATA LIVE DOKUMENTASI AKTIVITAS TERBARU (DARI TABEL SQL 'aktivitas'):\n";
            while ($r = $res->fetch_assoc()) {
                $context .= "- {$r['nama_sales']} | {$r['tipe_aktivitas']} ({$r['sesi_waktu']}) | {$r['keterangan']} [{$r['created_at']}]\n";
            }
            $context .= "\n";
        }
    }

    // Default System Stats if context is empty
    if (empty($context)) {
        $q1 = $conn->query("SELECT COUNT(*) as c FROM stock_inventory_essential WHERE availability_status LIKE '%Available%' OR availability_status = 'Tersedia'");
        $totalReady = ($q1 && $row = $q1->fetch_assoc()) ? $row['c'] : 0;

        $q2 = $conn->query("SELECT COUNT(*) as c FROM tabel_spk");
        $totalSpk = ($q2 && $row = $q2->fetch_assoc()) ? $row['c'] : 0;

        $q3 = $conn->query("SELECT COUNT(*) as c FROM tabel_customer");
        $totalCust = ($q3 && $row = $q3->fetch_assoc()) ? $row['c'] : 0;

        $context .= "### RINGKASAN DATABASE REAL-TIME TUNAS TOYOTA KIARA CONDONG:\n";
        $context .= "- Total Unit Mobil Ready Stock di Database: {$totalReady} unit\n";
        $context .= "- Total SPK Tercatat: {$totalSpk} SPK\n";
        $context .= "- Total Prospek Customer Terdata: {$totalCust} Konsumen\n\n";
    }

    return $context;
}

// Direct SQL Intelligent Response Generator (Offline / Local Database Engine - No API Key Needed)
function generateDirectSqlResponse($conn, $userQuery) {
    if (!$conn) {
        return "⚠️ Tidak dapat terhubung ke database lokal.";
    }

    $q = strtolower(trim($userQuery));
    if (empty($q)) {
        return "Silakan ketik pertanyaan seputar stok unit atau data mobil.";
    }

    // 1. Model Dictionary
    $modelKeywords = [
        'zenix' => ['zenix'],
        'innova' => ['innova', 'kijang', 'reborn'],
        'veloz' => ['veloz'],
        'avanza' => ['avanza'],
        'calya' => ['calya'],
        'fortuner' => ['fortuner'],
        'rush' => ['rush'],
        'raize' => ['raize'],
        'agya' => ['agya', 'stylix'],
        'yaris cross' => ['yaris cross'],
        'yaris' => ['yaris'],
        'alphard' => ['alphard'],
        'vellfire' => ['vellfire'],
        'voxy' => ['voxy'],
        'hiace' => ['hiace', 'hi ace'],
        'rangga' => ['rangga'],
        'hilux' => ['hilux'],
        'land cruiser' => ['land cruiser', 'lc300', 'landcruiser'],
        'camry' => ['camry'],
        'vios' => ['vios'],
        'corolla' => ['corolla', 'altis'],
        'urban cruiser' => ['urban cruiser']
    ];

    // Color Dictionary
    $colorKeywords = [
        'putih' => 'white',
        'white' => 'white',
        'hitam' => 'black',
        'black' => 'black',
        'silver' => 'silver',
        'abu' => 'gray',
        'grey' => 'gray',
        'gray' => 'gray',
        'merah' => 'red',
        'red' => 'red',
        'kuning' => 'yellow',
        'yellow' => 'yellow',
        'bronze' => 'bronze'
    ];

    $matchedModels = [];
    foreach ($modelKeywords as $modelKey => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($q, $alias) !== false) {
                $matchedModels[] = $modelKey;
                break;
            }
        }
    }

    $matchedColors = [];
    foreach ($colorKeywords as $colorWord => $colorSql) {
        if (strpos($q, $colorWord) !== false) {
            $matchedColors[] = $colorSql;
        }
    }

    $isStockQuery = (
        strpos($q, 'stok') !== false || 
        strpos($q, 'stock') !== false || 
        strpos($q, 'ready') !== false || 
        strpos($q, 'unit') !== false || 
        strpos($q, 'gudang') !== false ||
        strpos($q, 'warna') !== false ||
        strpos($q, 'ada apa') !== false ||
        strpos($q, 'punya') !== false ||
        strpos($q, 'tersedia') !== false ||
        strpos($q, 'cek') !== false ||
        !empty($matchedModels)
    );

    // ========================================================
    // CASE A: STOK / INVENTORY
    // ========================================================
    if ($isStockQuery) {
        $whereClauses = ["(availability_status LIKE '%Available%' OR availability_status = 'Tersedia')"];

        if (!empty($matchedModels)) {
            $modelConditions = [];
            foreach ($matchedModels as $m) {
                if ($m === 'innova') {
                    $modelConditions[] = "(product_description LIKE '%INNOVA%' AND product_description NOT LIKE '%ZENIX%')";
                } elseif ($m === 'zenix') {
                    $modelConditions[] = "product_description LIKE '%ZENIX%'";
                } elseif ($m === 'yaris') {
                    $modelConditions[] = "(product_description LIKE '%YARIS%' AND product_description NOT LIKE '%CROSS%')";
                } elseif ($m === 'yaris cross') {
                    $modelConditions[] = "product_description LIKE '%YARIS CROSS%'";
                } elseif ($m === 'hilux' || $m === 'rangga') {
                    $modelConditions[] = "(product_description LIKE '%HILUX%' OR product_description LIKE '%RANGGA%')";
                } else {
                    $modelConditions[] = "product_description LIKE '%" . strtoupper($m) . "%'";
                }
            }
            $whereClauses[] = "(" . implode(" OR ", $modelConditions) . ")";
        }

        if (!empty($matchedColors)) {
            $colorConditions = [];
            foreach ($matchedColors as $col) {
                $colorConditions[] = "color_description LIKE '%" . strtoupper($col) . "%'";
            }
            $whereClauses[] = "(" . implode(" OR ", $colorConditions) . ")";
        }

        $whereSql = implode(" AND ", $whereClauses);

        $sql = "SELECT product_description, color_description, site, warehouse, COUNT(*) as qty 
                FROM stock_inventory_essential 
                WHERE $whereSql 
                GROUP BY product_description, color_description, site, warehouse 
                ORDER BY product_description ASC, qty DESC";

        $res = $conn->query($sql);

        if ($res && $res->num_rows > 0) {
            $tree = [];
            $totalAll = 0;

            while ($r = $res->fetch_assoc()) {
                $v = cleanModelVariantName($r['product_description']);
                $c = cleanColorName($r['color_description']);
                $s = cleanSiteName($r['site']);
                $wh = cleanWarehouseName($r['warehouse']);
                $qty = (int)$r['qty'];

                if (!isset($tree[$v])) {
                    $tree[$v] = [
                        'total' => 0,
                        'colors' => []
                    ];
                }

                if (!isset($tree[$v]['colors'][$c])) {
                    $tree[$v]['colors'][$c] = [
                        'total' => 0,
                        'locations' => []
                    ];
                }

                $locKey = $s . ($wh ? " ($wh)" : "");
                $tree[$v]['total'] += $qty;
                $tree[$v]['colors'][$c]['total'] += $qty;
                $tree[$v]['colors'][$c]['locations'][$locKey] = ($tree[$v]['colors'][$c]['locations'][$locKey] ?? 0) + $qty;
                $totalAll += $qty;
            }

            $modelTitle = !empty($matchedModels) ? ucwords(implode(' / ', $matchedModels)) : 'Toyota';
            $reply = "🚗 **Stok Ready {$modelTitle}** (Total: **{$totalAll} Unit**)\n";

            foreach ($tree as $vName => $vData) {
                $img = getCarImageFilename($vName);
                $reply .= "###VAR_START:{$vName}:{$img}###\n";
                $reply .= "📌 **{$vName}** • *{$vData['total']} unit*\n";

                uasort($vData['colors'], function($a, $b) { return $b['total'] - $a['total']; });

                foreach ($vData['colors'] as $cName => $cData) {
                    $reply .= "• **{$cName}**: {$cData['total']} unit\n";
                    
                    arsort($cData['locations']);
                    $locDetails = [];
                    $countSites = 0;
                    $totalSites = count($cData['locations']);
                    foreach ($cData['locations'] as $locName => $lQty) {
                        if ($countSites < 4) {
                            $locDetails[] = "{$locName} ({$lQty})";
                        }
                        $countSites++;
                    }
                    $locStr = implode(', ', $locDetails);
                    if ($totalSites > 4) {
                        $locStr .= " *(+" . ($totalSites - 4) . " lokasi lain)*";
                    }
                    $reply .= "📍 *Cabang: {$locStr}*\n";
                }
                $reply .= "###VAR_END###\n";
            }

            return trim($reply);
        } else {
            // Check non-available status
            if (!empty($matchedModels)) {
                $mCheck = strtoupper($matchedModels[0]);
                $resNonAvail = $conn->query("SELECT product_description, color_description, availability_status, COUNT(*) as qty FROM stock_inventory_essential WHERE product_description LIKE '%$mCheck%' GROUP BY product_description, color_description, availability_status LIMIT 10");
                if ($resNonAvail && $resNonAvail->num_rows > 0) {
                    $reply = "⚠️ **Unit " . ucwords($matchedModels[0]) . " saat ini tidak ada yang Ready Stock (Available).**\n\nCatatan status di database:\n";
                    while ($r = $resNonAvail->fetch_assoc()) {
                        $reply .= "- **{$r['product_description']}** | Warna: {$r['color_description']} | Status: *{$r['availability_status']}* ({$r['qty']} unit)\n";
                    }
                    $reply .= "\n💡 *Silakan tawarkan varian sekelas lainnya atau hubungi SPV untuk pengajuan unit.*";
                    return $reply;
                }
            }

            return "Maaf, data unit mobil yang Anda cari tidak ditemukan di database gudang saat ini.";
        }
    }

    // ========================================================
    // CASE B: HARGA / PRICELIST
    // ========================================================
    if (strpos($q, 'harga') !== false || strpos($q, 'price') !== false || strpos($q, 'pricelist') !== false || strpos($q, 'otr') !== false) {
        $whereModel = "";
        if (!empty($matchedModels)) {
            $whereModel = "AND model LIKE '%" . strtoupper($matchedModels[0]) . "%'";
        }
        $res = $conn->query("SELECT model, type, transmission, pricelist FROM pricelist_mobil WHERE otr_wilayah = 'JAWA BARAT' $whereModel LIMIT 15");
        if ($res && $res->num_rows > 0) {
            $reply = "🏷️ **Pricelist OTR Jawa Barat (Terbaru):**\n\n";
            while ($r = $res->fetch_assoc()) {
                $formattedPrice = "Rp " . number_format($r['pricelist'], 0, ',', '.');
                $reply .= "- **{$r['model']} {$r['type']} {$r['transmission']}**: {$formattedPrice}\n";
            }
            return trim($reply);
        }
    }

    // Default Overview
    $qReady = $conn->query("SELECT COUNT(*) as c FROM stock_inventory_essential WHERE availability_status LIKE '%Available%' OR availability_status = 'Tersedia'");
    $totReady = $qReady ? $qReady->fetch_assoc()['c'] : 0;

    return "🚗 **T-STOCK - Asisten Live Stok Toyota**\n\nSaat ini terdapat total **" . number_format($totReady, 0, ',', '.') . " Unit Mobil Ready Stock** di gudang dealer.\n\nSilakan tanyakan langsung ketersediaan stok mobil atau warna, contoh:\n- *\"Stok Alphard ready apa aja?\"*\n- *\"Cek stok Veloz putih\"*\n- *\"Ada stok Zenix warna apa aja?\"*\n- *\"Stok Fortuner hitam\"*\n- *\"Cek stok Calya ready\"*";
}

if (!defined('AI_ENGINE_ONLY')) {

$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true) ?? $_POST;

$action = $input['action'] ?? ($_GET['action'] ?? 'chat');

if ($action === 'save_key') {
    $apiKey = trim($input['apiKey'] ?? '');
    $model = trim($input['model'] ?? 'gemini-3.1-flash-lite');

    $config = ['gemini_api_key' => $apiKey, 'model' => $model, 'updated_at' => date('Y-m-d H:i:s')];
    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));

    echo json_encode(['status' => 'success', 'message' => 'API Key Gemini berhasil disimpan!']);
    exit;
}

if ($action === 'get_config') {
    $config = getAiConfig($configFile);
    $hasKey = !empty($config['gemini_api_key']);
    $maskedKey = '';
    if ($hasKey) {
        $k = $config['gemini_api_key'];
        $maskedKey = strlen($k) > 10 ? substr($k, 0, 6) . '...' . substr($k, -4) : '******';
    }

    echo json_encode([
        'status' => 'success',
        'has_key' => $hasKey,
        'masked_key' => $maskedKey,
        'model' => $config['model'] ?? 'gemini-3.1-flash-lite'
    ]);
    exit;
}

// Action: Chat with Gemini AI
$prompt = trim($input['prompt'] ?? '');
$history = $input['history'] ?? [];
$clientKey = trim($input['apiKey'] ?? '');
$model = trim($input['model'] ?? '');

$config = getAiConfig($configFile);
$apiKey = !empty($clientKey) ? $clientKey : ($config['gemini_api_key'] ?? '');
if (empty($model)) {
    $model = $config['model'] ?? 'gemini-3.1-flash-lite';
}

if (empty($prompt)) {
    echo json_encode(['status' => 'error', 'message' => 'Pertanyaan tidak boleh kosong.']);
    exit;
}

// IF NO API KEY IS CONFIGURED -> USE DIRECT LIVE SQL DATABASE ENGINE
if (empty($apiKey)) {
    $directReply = generateDirectSqlResponse($conn, $prompt);
    echo json_encode([
        'status' => 'success',
        'reply' => $directReply,
        'model_used' => 'local-sql-engine',
        'has_sql_context' => true
    ]);
    exit;
}

// Extract Live Database SQL Data relevant to user question
$sqlContext = getLiveSqlContext($conn, $prompt);

// System Instruction for Dedicated Live Stock Assistant
$systemPrompt = <<<SYS
Anda adalah "T-STOCK" (Tunas Live Stock AI), asisten khusus pengecekan LIVE STOK UNIT MOBIL TOYOTA untuk Sales Consultant Tunas Toyota Kiara Condong (Bandung).

Fokus & Tugas Utama:
1. Menyediakan informasi ketersediaan STOK MOBIL READY, PILIHAN WARNA, JUMLAH UNIT, dan LOKASI CABANG DEALER secara SANGAT RAPI, AKURAT, dan LANGSUNG TO-THE-POINT dari data DATABASE SQL di bawah ini.
2. Jika pengguna menanyakan hal di luar stok mobil, arahkan kembali dengan sopan untuk mengecek stok unit mobil Toyota yang ready.

DATA DATABASE SQL REAL-TIME:
{$sqlContext}

ATURAN FORMAT MENJAWAB STOK / UNIT MOBIL (SANGAT WAJIB DIIKUTI):
1. **STRUKTUR JAWABAN YANG RAPI**:
   - Tampilkan judul ringkasan stok: `🚗 **Stok Ready [Nama Model]** (Total: **X Unit**)`
   - Beri garis pemisah: `─────────────────────────────`
   - Untuk setiap varian, gunakan format:
     📌 **[Nama Varian Model]** • *[Jumlah] unit*
     • **[Nama Warna 1]**: [Jumlah] unit
     • **[Nama Warna 2]**: [Jumlah] unit
     📍 *Lokasi: [Nama Cabang]*
2. **JANGAN MENGULANG VARIAN DENGAN SUFFIX ANEH**:
   - Kelompokkan warna-warna di bawah varian yang sama secara terpadu.
3. **LANGSUNG KE DATA (TO-THE-POINT)**:
   - Tanpa basa-basi pembuka yang bertele-tele.
SYS;

// Build Gemini API payload
$contents = [];

// Add history if present
if (is_array($history)) {
    foreach ($history as $h) {
        $role = ($h['role'] === 'user') ? 'user' : 'model';
        $text = $h['text'] ?? ($h['content'] ?? '');
        if (!empty($text)) {
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $text]]
            ];
        }
    }
}

// Add current prompt
$contents[] = [
    'role' => 'user',
    'parts' => [['text' => $prompt]]
];

$payload = [
    'contents' => $contents,
    'systemInstruction' => [
        'parts' => [['text' => $systemPrompt]]
    ],
    'generationConfig' => [
        'temperature' => 0.3,
        'topK' => 30,
        'topP' => 0.85,
        'maxOutputTokens' => 800,
    ]
];

// Models to try with automatic fallback
$modelsToTry = [$model, 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];
$modelsToTry = array_unique($modelsToTry);

$responseSuccess = false;
$finalReply = '';
$lastError = '';

foreach ($modelsToTry as $tryModel) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$tryModel}:generateContent?key=" . urlencode($apiKey);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 25);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        $lastError = "Koneksi cURL Error: " . $curlErr;
        continue;
    }

    $resJson = json_decode($response, true);

    if ($httpCode === 200 && isset($resJson['candidates'][0]['content']['parts'][0]['text'])) {
        $finalReply = $resJson['candidates'][0]['content']['parts'][0]['text'];
        $responseSuccess = true;
        break;
    } else {
        $errMsg = $resJson['error']['message'] ?? "HTTP $httpCode response error";
        $lastError = $errMsg;
    }
}

if ($responseSuccess) {
    echo json_encode([
        'status' => 'success',
        'reply' => $finalReply,
        'model_used' => $tryModel,
        'has_sql_context' => !empty($sqlContext)
    ]);
} else {
    // If Gemini API fails (rate limit / network / quota) -> Fallback seamlessly to Direct SQL Database Engine!
    $directReply = generateDirectSqlResponse($conn, $prompt);
    echo json_encode([
        'status' => 'success',
        'reply' => $directReply,
        'model_used' => 'fallback-sql-engine',
        'has_sql_context' => true
    ]);
}
}
?>
