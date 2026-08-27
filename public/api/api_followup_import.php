<?php
// api_followup_import.php - Universal High-Performance Excel & CSV Importer for SFT Follow-Up CRM
@ini_set('memory_limit', '1024M');
@ini_set('max_execution_time', '300');
@ini_set('upload_max_filesize', '100M');
@ini_set('post_max_size', '100M');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/api_followup_db.php';

try {

// Helper clean phone
if (!function_exists('clean_phone_number')) {
    function clean_phone_number($phone) {
        $phone = preg_replace('/[^0-9]/', '', (string)$phone);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62' . $phone;
        }
        return $phone;
    }
}

// Check uploaded file
if (!isset($_FILES['file'])) {
    // Check if $_FILES is empty due to post_max_size
    echo json_encode([
        'success' => false,
        'message' => 'Tidak ada file yang diterima oleh server. Jika file berukuran besar, pastikan ukuran file tidak melebihi batas upload.'
    ]);
    exit;
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['file']['error'];
    $errMsg = 'Gagal mengunggah file (Error code: ' . $errCode . ').';
    if ($errCode === UPLOAD_ERR_INI_SIZE || $errCode === UPLOAD_ERR_FORM_SIZE) {
        $errMsg = 'Ukuran file terlalu besar untuk batas upload server PHP saat ini.';
    }
    echo json_encode(['success' => false, 'message' => $errMsg]);
    exit;
}

$fileTmpPath = $_FILES['file']['tmp_name'];
$fileName = $_FILES['file']['name'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Temporary storage for processing
$targetDir = __DIR__ . '/../uploads/';
if (!is_dir($targetDir)) {
    @mkdir($targetDir, 0777, true);
}
$savedFilePath = $targetDir . 'import_' . time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $fileName);
if (!@move_uploaded_file($fileTmpPath, $savedFilePath)) {
    @copy($fileTmpPath, $savedFilePath);
}

$parsedCustomers = [];
$sheetUsed = 'Data Utuh';

if ($fileExt === 'csv') {
    // CSV Parser with delimiter detection
    if (($handle = fopen($savedFilePath, "r")) !== FALSE) {
        $firstLine = fgets($handle);
        rewind($handle);
        $delim = (strpos($firstLine, ';') !== false && substr_count($firstLine, ';') > substr_count($firstLine, ',')) ? ';' : ',';

        $headerRow = [];
        $rIdx = 0;
        while (($row = fgetcsv($handle, 5000, $delim)) !== FALSE) {
            if ($rIdx === 0) {
                $headerRow = array_map('strtolower', array_map('trim', $row));
            } else {
                $item = [];
                foreach ($row as $colIdx => $val) {
                    $key = $headerRow[$colIdx] ?? "col_$colIdx";
                    $item[$key] = trim($val);
                }
                $name = $item['nama'] ?? $item['nama_customer'] ?? $item['customer'] ?? $item['nama lengkap'] ?? '';
                $phone = clean_phone_number($item['no wa'] ?? $item['no_telepon_customer'] ?? $item['telepon'] ?? $item['no hp'] ?? $item['phone'] ?? '');
                
                if ($name && $name !== '-' && $phone) {
                    $carModel = $item['tipe mobil'] ?? $item['model'] ?? $item['mobil'] ?? $item['target upgrade'] ?? 'Toyota Unit';
                    $lastCar = $item['mobil saat ini'] ?? $item['unit saat ini'] ?? $item['tipe lama'] ?? '';
                    $carAge = $item['usia'] ?? $item['usia kendaraan'] ?? $item['tahun'] ?? '';
                    $cluster = $item['klaster'] ?? $item['cluster'] ?? $item['cluster_name'] ?? '';
                    $priority = $item['prioritas'] ?? $item['priority'] ?? '';
                    $district = $item['kecamatan'] ?? $item['wilayah'] ?? $item['district'] ?? '';

                    $category = $item['kategori'] ?? 'Trade-in / Repurchase (' . trim(str_replace('(Target Repurchase)', '', $carModel)) . ')';

                    $parsedCustomers[] = [
                        'name' => $name,
                        'phone' => $phone,
                        'car_model' => trim(str_replace('(Target Repurchase)', '', $carModel)),
                        'last_car_model' => $lastCar,
                        'car_age' => $carAge,
                        'recommended_model' => trim(str_replace('(Target Repurchase)', '', $carModel)),
                        'cluster_name' => $cluster,
                        'priority' => $priority,
                        'district' => $district,
                        'plate_number' => $item['no polisi'] ?? $item['plat'] ?? '',
                        'vin' => $item['vin'] ?? '',
                        'purchase_date' => $item['tgl beli'] ?? '',
                        'followup_category' => $category,
                        'followup_status' => 'Belum Dihubungi',
                        'notes' => $item['catatan'] ?? ''
                    ];
                }
            }
            $rIdx++;
        }
        fclose($handle);
    }
} else {
    // 100% Pure PHP Native High-Performance XLSX Parser with XMLReader streaming
    $zip = new ZipArchive();
    if ($zip->open($savedFilePath) === TRUE) {
        $sheetUsed = 'Excel Native Engine';

        // 1. Resolve worksheet relationship mapping from xl/_rels/workbook.xml.rels
        $relMap = [];
        $wbRels = $zip->getFromName('xl/_rels/workbook.xml.rels');
        if ($wbRels) {
            $relsObj = @simplexml_load_string($wbRels);
            if ($relsObj && isset($relsObj->Relationship)) {
                foreach ($relsObj->Relationship as $rel) {
                    $rId = (string)$rel['Id'];
                    $target = (string)$rel['Target'];
                    $relMap[$rId] = 'xl/' . ltrim($target, '/');
                }
            }
        }

        // 2. Identify target sheet prioritizing Attack List / Repurchase / 9 Clusters
        $sheetFile = 'xl/worksheets/sheet1.xml';
        $wbXml = $zip->getFromName('xl/workbook.xml');
        if ($wbXml) {
            $wbObj = @simplexml_load_string($wbXml);
            if ($wbObj && isset($wbObj->sheets->sheet)) {
                $maxWeight = -1;
                foreach ($wbObj->sheets->sheet as $s) {
                    $sName = (string)$s['name'];
                    $rId = (string)$s->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
                    if (!$rId) $rId = (string)$s['id'];
                    $targetPath = $relMap[$rId] ?? '';

                    $weight = 0;
                    if (preg_match('/attack\s*list/i', $sName)) $weight = 100;
                    elseif (preg_match('/data\s*repurchase/i', $sName)) $weight = 90;
                    elseif (preg_match('/database|customer|pelanggan/i', $sName)) $weight = 80;
                    elseif (preg_match('/9\s*cluster/i', $sName)) $weight = 70;

                    if ($weight > $maxWeight && $targetPath) {
                        $maxWeight = $weight;
                        $sheetFile = $targetPath;
                        $sheetUsed = $sName;
                    }
                }
            }
        }

        // Fallback: If no sheet matched or sheet not found in zip, find the largest worksheet XML
        if ($zip->locateName($sheetFile) === false) {
            $largestSize = 0;
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $stat = $zip->statIndex($i);
                if (str_starts_with($stat['name'], 'xl/worksheets/sheet') && $stat['size'] > $largestSize) {
                    $largestSize = $stat['size'];
                    $sheetFile = $stat['name'];
                }
            }
        }

        // 3. Read Shared Strings (xl/sharedStrings.xml) ultra fast using pure streaming XMLReader
        $sharedStrings = [];
        if ($zip->locateName('xl/sharedStrings.xml') !== false) {
            $tempShared = tempnam(sys_get_temp_dir(), 'sh_fast_');
            file_put_contents($tempShared, $zip->getFromName('xl/sharedStrings.xml'));
            
            $reader = new XMLReader();
            if ($reader->open($tempShared)) {
                $currText = '';
                $isInsideSi = false;
                while ($reader->read()) {
                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->name == 'si') {
                        $currText = '';
                        $isInsideSi = true;
                    } elseif ($isInsideSi && ($reader->nodeType == XMLReader::TEXT || $reader->nodeType == XMLReader::SIGNIFICANT_WHITESPACE)) {
                        $currText .= $reader->value;
                    } elseif ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'si') {
                        $sharedStrings[] = $currText;
                        $isInsideSi = false;
                    }
                }
                $reader->close();
            }
            @unlink($tempShared);
        }

        // 4. Stream and parse the target worksheet XML ultra fast using pure XMLReader
        $sheetXmlContent = $zip->getFromName($sheetFile);
        $zip->close();

        if ($sheetXmlContent) {
            $tempSheet = tempnam(sys_get_temp_dir(), 'sh_rows_');
            file_put_contents($tempSheet, $sheetXmlContent);

            $colLetterToIdx = function($letters) {
                $idx = 0;
                for ($l = 0; $l < strlen($letters); $l++) {
                    $idx = $idx * 26 + (ord($letters[$l]) - ord('A') + 1);
                }
                return $idx - 1;
            };

            $rawRows = [];
            $currentRow = [];
            $currentColIdx = 0;
            $currentCellType = '';
            $currentCellVal = '';
            $isInsideV = false;
            $isInsideIs = false;

            $reader = new XMLReader();
            if ($reader->open($tempSheet)) {
                while ($reader->read()) {
                    if ($reader->nodeType == XMLReader::ELEMENT) {
                        if ($reader->name == 'row') {
                            $currentRow = [];
                        } elseif ($reader->name == 'c') {
                            $cellRef = $reader->getAttribute('r') ?: 'A1';
                            $currentCellType = $reader->getAttribute('t') ?: '';
                            preg_match('/^([A-Z]+)([0-9]+)$/', $cellRef, $m);
                            $colLetters = $m[1] ?? 'A';
                            $currentColIdx = $colLetterToIdx($colLetters);
                            $currentCellVal = '';
                        } elseif ($reader->name == 'v') {
                            $isInsideV = true;
                        } elseif ($reader->name == 't' || $reader->name == 'is') {
                            $isInsideIs = true;
                        }
                    } elseif ($reader->nodeType == XMLReader::TEXT || $reader->nodeType == XMLReader::SIGNIFICANT_WHITESPACE) {
                        if ($isInsideV || $isInsideIs) {
                            $currentCellVal .= $reader->value;
                        }
                    } elseif ($reader->nodeType == XMLReader::END_ELEMENT) {
                        if ($reader->name == 'v') {
                            $isInsideV = false;
                        } elseif ($reader->name == 't' || $reader->name == 'is') {
                            $isInsideIs = false;
                        } elseif ($reader->name == 'c') {
                            $finalVal = trim($currentCellVal);
                            if ($currentCellType === 's' && is_numeric($finalVal)) {
                                $finalVal = $sharedStrings[(int)$finalVal] ?? '';
                            }
                            $currentRow[$currentColIdx] = $finalVal;
                        } elseif ($reader->name == 'row') {
                            if (!empty($currentRow)) {
                                $rawRows[] = $currentRow;
                            }
                        }
                    }
                }
                $reader->close();
            }
            @unlink($tempSheet);

            // 5. Map columns & extract records
            if (!empty($rawRows)) {
                $headerRowIdx = 0;
                $maxMatch = 0;
                $keywords = ['nama', 'customer', 'contact', 'telepon', 'phone', 'wa', 'mobil', 'model', 'vin', 'cluster', 'priority'];

                for ($r = 0; $r < min(10, count($rawRows)); $r++) {
                    $matches = 0;
                    if (is_array($rawRows[$r])) {
                        foreach ($rawRows[$r] as $cell) {
                            $s = strtolower(trim((string)$cell));
                            foreach ($keywords as $k) {
                                if (strpos($s, $k) !== false) {
                                    $matches++;
                                    break;
                                }
                            }
                        }
                    }
                    if ($matches > $maxMatch) {
                        $maxMatch = $matches;
                        $headerRowIdx = $r;
                    }
                }

                $headers = [];
                $rawHeaders = $rawRows[$headerRowIdx] ?? [];
                foreach ($rawHeaders as $i => $h) {
                    $clean = strtolower(trim(preg_replace('/[\r\n\t]+/', ' ', (string)$h)));
                    $headers[$i] = $clean ?: ('col_' . $i);
                }

                $findColIdx = function($patterns) use ($headers) {
                    foreach ($patterns as $pat) {
                        foreach ($headers as $idx => $h) {
                            if (preg_match($pat, $h)) return $idx;
                        }
                    }
                    return -1;
                };

                $nameIdx = $findColIdx(['/nama_customer/i', '/nama by single vin/i', '/nama lengkap/i', '/nama/i', '/customer/i', '/pelanggan/i']);
                $phoneIdx = $findColIdx(['/no_telepon_customer/i', '/contact person 1/i', '/contact/i', '/wa/i', '/telepon/i', '/phone/i', '/no_hp/i', '/hp/i']);
                $vFilterIdx = $findColIdx(['/vehicle filter/i']);
                $rec1Idx = $findColIdx(['/1\.\s*model/i', '/alternative_recommendation_model_1/i', '/model_rekomendasi/i']);
                $rec2Idx = $findColIdx(['/2\.\s*model/i', '/alternative_recommendation_model_2/i']);
                $rec3Idx = $findColIdx(['/3\.\s*model/i', '/alternative_recommendation_model_3/i']);
                $lastCarIdx = $findColIdx(['/model_kendaraan_terakhir/i', '/latest_model/i', '/mobil.*saat ini/i', '/unit.*saat ini/i', '/tipe lama/i']);
                $ageIdx = $findColIdx(['/usia_kendaraan_terakhir/i', '/vehicle age/i', '/usia.*kendaraan/i', '/usia/i', '/tahun/i']);
                $clusterIdx = $findColIdx(['/cluster_name/i', '/cluster/i', '/klaster/i']);
                $priorityIdx = $findColIdx(['/priority/i', '/prioritas/i']);
                $distIdx = $findColIdx(['/alamat_kecamatan/i', '/kecamatan/i', '/wilayah/i', '/domisili/i']);
                $plateIdx = $findColIdx(['/no_polisi/i', '/no.*polisi/i', '/plat/i']);
                $vinIdx = $findColIdx(['/vin_kendaraan_terakhir/i', '/latest_vin/i', '/vin/i', '/no_rangka/i']);
                $custTypeIdx = $findColIdx(['/cust\.\s*type/i', '/fleet_or_retail/i', '/tipe.*customer/i']);
                $doOutletIdx = $findColIdx(['/nama_outlet_do/i', '/do_oleh_tunas/i', '/outlet.*do/i']);
                $srvOutletIdx = $findColIdx(['/nama_outlet_service/i', '/service_di_tunas/i']);
                $srvComplianceIdx = $findColIdx(['/kepatuhan_service/i', '/rasio_kepatuhan_service/i']);
                $salesmanIdx = $findColIdx(['/salesman/i', '/sales/i', '/wiraniaga/i']);

                // Build sales lookup map if available
                $salesMap = [];
                if ($is_mysql && $conn) {
                    try {
                        $res = $conn->query("SELECT id, nama_lengkap FROM sales_accounts");
                        if ($res) {
                            while ($r = $res->fetch_assoc()) {
                                $cleanName = strtolower(preg_replace('/[^a-z0-9]/', '', (string)$r['nama_lengkap']));
                                if ($cleanName) $salesMap[$cleanName] = (int)$r['id'];
                            }
                        }
                    } catch (Throwable $e) {}
                }

                for ($r = $headerRowIdx + 1; $r < count($rawRows); $r++) {
                    $row = $rawRows[$r];
                    if (empty($row)) continue;

                    $name = $nameIdx !== -1 ? trim((string)($row[$nameIdx] ?? '')) : '';
                    $phone = $phoneIdx !== -1 ? clean_phone_number((string)($row[$phoneIdx] ?? '')) : '';

                    if (!$name || $name === '-' || !$phone) continue;

                    $lastCar = $lastCarIdx !== -1 ? trim((string)($row[$lastCarIdx] ?? '')) : '';
                    if ($lastCar === 'NO DATA' || $lastCar === '-') $lastCar = '';

                    $vFilter = $vFilterIdx !== -1 ? trim((string)($row[$vFilterIdx] ?? '')) : '';
                    if ($vFilter === 'OTHERS' || $vFilter === 'NO DATA') $vFilter = '';

                    $rec1 = $rec1Idx !== -1 ? trim(str_replace('(Target Repurchase)', '', (string)($row[$rec1Idx] ?? ''))) : '';
                    if ($rec1 === 'NO DATA' || $rec1 === '-') $rec1 = '';

                    $rec2 = $rec2Idx !== -1 ? trim((string)($row[$rec2Idx] ?? '')) : '';
                    if ($rec2 === 'NO DATA' || $rec2 === '-') $rec2 = '';

                    $rec3 = $rec3Idx !== -1 ? trim((string)($row[$rec3Idx] ?? '')) : '';
                    if ($rec3 === 'NO DATA' || $rec3 === '-') $rec3 = '';

                    $age = $ageIdx !== -1 ? trim((string)($row[$ageIdx] ?? '')) : '';
                    if ($age === 'NO DATA' || $age === '-') $age = '';
                    if ($age && is_numeric($age)) $age = number_format((float)$age, 1) . ' Tahun';

                    $cluster = $clusterIdx !== -1 ? trim((string)($row[$clusterIdx] ?? '')) : '';
                    $priority = $priorityIdx !== -1 ? trim((string)($row[$priorityIdx] ?? '')) : '';
                    $district = $distIdx !== -1 ? trim((string)($row[$distIdx] ?? '')) : '';
                    if ($district === 'NO DATA' || $district === '-') $district = '';

                    $plate = $plateIdx !== -1 ? trim((string)($row[$plateIdx] ?? '')) : '';
                    $vin = $vinIdx !== -1 ? trim((string)($row[$vinIdx] ?? '')) : '';
                    $custType = $custTypeIdx !== -1 ? trim((string)($row[$custTypeIdx] ?? 'RETAIL')) : 'RETAIL';
                    $outletDo = $doOutletIdx !== -1 ? trim((string)($row[$doOutletIdx] ?? '')) : '';
                    $outletSrv = $srvOutletIdx !== -1 ? trim((string)($row[$srvOutletIdx] ?? '')) : '';
                    $srvComp = $srvComplianceIdx !== -1 ? trim((string)($row[$srvComplianceIdx] ?? '')) : '';

                    $targetCar = $rec1 ?: ($vFilter ?: ($lastCar ?: 'Toyota Unit'));

                    $assignedSalesId = null;
                    if ($salesmanIdx !== -1) {
                        $salesNameRaw = strtolower(preg_replace('/[^a-z0-9]/', '', (string)($row[$salesmanIdx] ?? '')));
                        if ($salesNameRaw && isset($salesMap[$salesNameRaw])) {
                            $assignedSalesId = $salesMap[$salesNameRaw];
                        }
                    }

                    $parsedCustomers[] = [
                        'name' => $name,
                        'phone' => $phone,
                        'car_model' => $targetCar,
                        'last_car_model' => $lastCar,
                        'car_age' => $age,
                        'recommended_model' => $targetCar,
                        'alt_model_2' => $rec2,
                        'alt_model_3' => $rec3,
                        'cluster_name' => $cluster,
                        'priority' => $priority,
                        'district' => $district,
                        'plate_number' => $plate,
                        'vin' => $vin,
                        'customer_type' => $custType,
                        'outlet_do' => $outletDo,
                        'outlet_service' => $outletSrv,
                        'service_compliance' => $srvComp,
                        'assigned_sales_id' => $assignedSalesId,
                        'followup_category' => 'Trade-in / Repurchase (' . $targetCar . ')'
                    ];
                }
            }
        }
    }
}

if (empty($parsedCustomers)) {
    echo json_encode([
        'success' => false,
        'message' => 'Tidak dapat menemukan baris data customer yang memiliki Nama dan Nomor Telepon/WA valid pada file tersebut.'
    ]);
    exit;
}

// Save into Database (both MySQL & SQLite) with high performance chunked multi-row batch insert
$inserted = 0;
$updated = 0;

global $is_mysql, $conn;

if ($is_mysql && $conn) {
    $batchRows = [];
    foreach ($parsedCustomers as $c) {
        $code = $conn->real_escape_string('CUST-' . substr(time(), -5) . '-' . ($inserted + count($batchRows) + 1));
        $name = $conn->real_escape_string($c['name']);
        $phone = $conn->real_escape_string($c['phone']);
        $car = $conn->real_escape_string($c['car_model']);
        $lastCar = $conn->real_escape_string($c['last_car_model']);
        $age = $conn->real_escape_string($c['car_age']);
        $rec1 = $conn->real_escape_string($c['recommended_model']);
        $rec2 = $conn->real_escape_string($c['alt_model_2']);
        $rec3 = $conn->real_escape_string($c['alt_model_3']);
        $cluster = $conn->real_escape_string($c['cluster_name']);
        $priority = $conn->real_escape_string($c['priority']);
        $dist = $conn->real_escape_string($c['district']);
        $plate = $conn->real_escape_string($c['plate_number']);
        $vin = $conn->real_escape_string($c['vin']);
        $outletDo = $conn->real_escape_string($c['outlet_do']);
        $outletSrv = $conn->real_escape_string($c['outlet_service']);
        $srvComp = $conn->real_escape_string($c['service_compliance']);
        $cat = $conn->real_escape_string($c['followup_category']);
        $salesVal = !empty($c['assigned_sales_id']) ? (int)$c['assigned_sales_id'] : "NULL";

        $batchRows[] = "('$code', '$name', '$phone', '$car', '$lastCar', '$age', '$rec1', '$rec2', '$rec3', '$cluster', '$priority', '$dist', '$plate', '$vin', '$outletDo', '$outletSrv', '$srvComp', '$cat', $salesVal, 'Belum Dihubungi', 'excel_import')";
    }

    $chunks = array_chunk($batchRows, 150);
    foreach ($chunks as $chunk) {
        $sql = "INSERT INTO followup_customers (
            customer_code, name, phone, car_model, last_car_model, car_age,
            recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, plate_number, vin,
            outlet_do, outlet_service, service_compliance,
            followup_category, assigned_sales_id, followup_status, sync_source
        ) VALUES " . implode(',', $chunk);
        
        if ($conn->query($sql)) {
            $inserted += count($chunk);
        }
    }
} else {
    // SQLite insert
    foreach ($parsedCustomers as $c) {
        $code = 'CUST-' . substr(time(), -5) . '-' . ($inserted + 1);
        $salesId = !empty($c['assigned_sales_id']) ? (int)$c['assigned_sales_id'] : null;
        followup_execute("
            INSERT INTO followup_customers (
                customer_code, name, phone, car_model, last_car_model, car_age,
                recommended_model, alt_model_2, alt_model_3, cluster_name, priority, district, plate_number, vin,
                outlet_do, outlet_service, service_compliance,
                followup_category, assigned_sales_id, followup_status, sync_source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi', 'excel_import')
        ", [
            $code, $c['name'], $c['phone'], $c['car_model'], $c['last_car_model'], $c['car_age'],
            $c['recommended_model'], $c['alt_model_2'], $c['alt_model_3'], $c['cluster_name'], $c['priority'], $c['district'], $c['plate_number'], $c['vin'],
            $c['outlet_do'], $c['outlet_service'], $c['service_compliance'],
            $c['followup_category'], $salesId
        ]);
        $inserted++;
    }
}

// Clean up temporary upload file
if (file_exists($savedFilePath)) {
    @unlink($savedFilePath);
}

    echo json_encode([
        'success' => true,
        'message' => "Berhasil memproses file! $inserted data customer baru disimpan, $updated data diperbarui.",
        'inserted' => $inserted,
        'updated' => $updated,
        'total' => count($parsedCustomers),
        'sheet_used' => $sheetUsed
    ]);
} catch (Throwable $e) {
    if (isset($savedFilePath) && file_exists($savedFilePath)) {
        @unlink($savedFilePath);
    }
    echo json_encode([
        'success' => false,
        'message' => 'Gagal memproses file: ' . $e->getMessage()
    ]);
}
