<?php
// api_sync_wa_aktivitas.php
// Endpoint untuk sinkronisasi, upload, dan parsing log chat WhatsApp ke database aktivitas

error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'koneksi.php';

$dir = dirname(__DIR__) . '/aktivitas';

function determineSessionTime($timeStr) {
    $hour = intval(substr($timeStr, 0, 2));
    if ($hour >= 5 && $hour < 12) return 'Pagi';
    if ($hour >= 12 && $hour < 15) return 'Siang';
    if ($hour >= 15 && $hour < 18) return 'Sore';
    return 'Malam';
}

$action = $_POST['action'] ?? $_GET['action'] ?? 'list';

if ($action === 'list') {
    // List all photos and check which ones are already synced to DB
    $photos = [];
    $syncedMap = [];

    if ($conn) {
        $res = $conn->query("SELECT id, foto, nama_sales, tipe_aktivitas, keterangan, created_at FROM aktivitas WHERE foto LIKE 'aktivitas/%'");
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $fName = basename($row['foto']);
                $syncedMap[$fName] = $row;
            }
        }
    }

    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $f) {
            if ($f === '.' || $f === '..') continue;
            $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

            $filePath = $dir . '/' . $f;
            $fileSize = filesize($filePath);

            if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $f, $m)) {
                $dateStr = "{$m[1]}-{$m[2]}-{$m[3]}";
                $timeStr = "{$m[4]}:{$m[5]}:{$m[6]}";
                $timestamp = strtotime("$dateStr $timeStr");
            } else {
                $mtime = filemtime($filePath);
                $dateStr = date('Y-m-d', $mtime);
                $timeStr = date('H:i:s', $mtime);
                $timestamp = $mtime;
            }

            $isSynced = isset($syncedMap[$f]);
            $syncedData = $isSynced ? $syncedMap[$f] : null;

            $photos[] = [
                'file_name' => $f,
                'file_url' => 'aktivitas/' . rawurlencode($f),
                'date' => $dateStr,
                'time' => substr($timeStr, 0, 5),
                'time_full' => $timeStr,
                'session' => determineSessionTime($timeStr),
                'size_kb' => round($fileSize / 1024, 1),
                'timestamp' => $timestamp,
                'is_synced' => $isSynced,
                'synced_data' => $syncedData
            ];
        }
    }

    usort($photos, function ($a, $b) {
        return $b['timestamp'] - $a['timestamp'];
    });

    echo json_encode([
        'status' => 'success',
        'total_photos' => count($photos),
        'total_synced' => count($syncedMap),
        'photos' => $photos
    ]);
    exit();
}

if ($action === 'sync_single') {
    if (!$conn) {
        echo json_encode(['status' => 'error', 'message' => 'Koneksi database tidak tersedia']);
        exit();
    }

    $fileName = trim($_POST['file_name'] ?? '');
    $namaSales = trim($_POST['nama_sales'] ?? 'Egy');
    $salesAccountId = intval($_POST['sales_account_id'] ?? 10);
    $tipeAktivitas = trim($_POST['tipe_aktivitas'] ?? 'Canvassing Lapangan');
    $keterangan = trim($_POST['keterangan'] ?? 'Dokumentasi kegiatan grup WhatsApp');
    $lokasi = trim($_POST['lokasi'] ?? 'Bandung & Sekitarnya');

    if (empty($fileName)) {
        echo json_encode(['status' => 'error', 'message' => 'Nama file foto wajib diisi']);
        exit();
    }

    $fotoPath = 'aktivitas/' . $fileName;

    if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $fileName, $m)) {
        $createdAt = "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}";
        $session = determineSessionTime("{$m[4]}:{$m[5]}:{$m[6]}");
    } else {
        $createdAt = date('Y-m-d H:i:s');
        $session = 'Pagi';
    }

    // Check if already exists in database
    $check = $conn->prepare("SELECT id FROM aktivitas WHERE foto = ?");
    $check->bind_param("s", $fotoPath);
    $check->execute();
    $resCheck = $check->get_result();

    if ($resCheck && $resCheck->num_rows > 0) {
        $row = $resCheck->fetch_assoc();
        $stmt = $conn->prepare("UPDATE aktivitas SET nama_sales = ?, tipe_aktivitas = ?, keterangan = ?, lokasi = ?, sesi_waktu = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $namaSales, $tipeAktivitas, $keterangan, $lokasi, $session, $row['id']);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Aktivitas berhasil diperbarui di database!']);
    } else {
        $stmt = $conn->prepare("INSERT INTO aktivitas (sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, durasi, created_at) VALUES (?, ?, ?, ?, ?, ?, 'Selesai', ?, '60 Menit', ?)");
        $stmt->bind_param("isssssss", $salesAccountId, $namaSales, $tipeAktivitas, $keterangan, $lokasi, $fotoPath, $session, $createdAt);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Foto grup WA berhasil disinkronkan ke database aktivitas!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal insert: ' . $stmt->error]);
        }
    }
    exit();
}

if ($action === 'sync_all_bulk') {
    if (!$conn) {
        echo json_encode(['status' => 'error', 'message' => 'Koneksi database tidak tersedia']);
        exit();
    }

    $namaSales = trim($_POST['nama_sales'] ?? 'Egy');
    $salesAccountId = intval($_POST['sales_account_id'] ?? 10);
    $defaultTipe = trim($_POST['tipe_aktivitas'] ?? 'Canvassing & Prospek Lapangan');

    $syncedCount = 0;
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $f) {
            if ($f === '.' || $f === '..') continue;
            $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

            $fotoPath = 'aktivitas/' . $f;

            $chk = $conn->prepare("SELECT id FROM aktivitas WHERE foto = ?");
            $chk->bind_param("s", $fotoPath);
            $chk->execute();
            $chkRes = $chk->get_result();

            if ($chkRes && $chkRes->num_rows === 0) {
                if (preg_match('/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})\.(\d{2})/i', $f, $m)) {
                    $createdAt = "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}";
                    $session = determineSessionTime("{$m[4]}:{$m[5]}:{$m[6]}");
                } else {
                    $createdAt = date('Y-m-d H:i:s');
                    $session = 'Pagi';
                }

                $ket = "Dokumentasi kegiatan WhatsApp {$session} ({$createdAt})";
                $ins = $conn->prepare("INSERT INTO aktivitas (sales_account_id, nama_sales, tipe_aktivitas, keterangan, lokasi, foto, status, sesi_waktu, durasi, created_at) VALUES (?, ?, ?, ?, 'Wilayah Bandung', ?, 'Selesai', ?, '60 Menit', ?)");
                $ins->bind_param("isssssss", $salesAccountId, $namaSales, $defaultTipe, $ket, $fotoPath, $session, $createdAt);
                if ($ins->execute()) {
                    $syncedCount++;
                }
            }
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => "Berhasil mensinkronkan {$syncedCount} foto baru ke tabel database aktivitas!",
        'synced_count' => $syncedCount
    ]);
    exit();
}

if ($action === 'parse_chat_log') {
    $chatText = trim($_POST['chat_text'] ?? '');
    if (empty($chatText)) {
        echo json_encode(['status' => 'error', 'message' => 'Teks riwayat chat WhatsApp kosong']);
        exit();
    }

    $lines = preg_split('/\r\n|\r|\n/', $chatText);
    $parsedMessages = [];

    // Parse standard WA chat lines
    // Pattern 1: [14/08/26, 09.57.01] Egy: message / <attached: file>
    // Pattern 2: 14/08/2026, 09:57 - Egy: message
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;

        // Match: [DD/MM/YY HH.MM.SS] Sender: Text
        if (preg_match('/^\[?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})[,\s]+(\d{1,2}[\.:]\d{1,2}(?:[\.:]\d{1,2})?)(?:\s*(?:AM|PM|WIB))?\]?\s*[-:]?\s*([^:]+):\s*(.*)$/i', $line, $m)) {
            $rawDate = $m[1];
            $rawTime = $m[2];
            $sender = trim($m[3]);
            $msg = trim($m[4]);

            $parsedMessages[] = [
                'raw_line' => $line,
                'date' => $rawDate,
                'time' => $rawTime,
                'sender' => $sender,
                'message' => $msg
            ];
        }
    }

    echo json_encode([
        'status' => 'success',
        'total_parsed' => count($parsedMessages),
        'parsed_messages' => $parsedMessages
    ]);
    exit();
}

if ($action === 'upload_new_photo') {
    if (!isset($_FILES['photo_file'])) {
        echo json_encode(['status' => 'error', 'message' => 'Tidak ada file yang diunggah']);
        exit();
    }

    $file = $_FILES['photo_file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Gagal upload file, kode error: ' . $file['error']]);
        exit();
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        echo json_encode(['status' => 'error', 'message' => 'Format file harus JPG, JPEG, PNG, atau WEBP']);
        exit();
    }

    $targetName = $file['name'];
    if (!preg_match('/WhatsApp/i', $targetName)) {
        $now = date('Y-m-d \a\t H.i.s');
        $targetName = "WhatsApp Image {$now}.{$ext}";
    }

    $targetPath = $dir . '/' . $targetName;
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Foto aktivitas berhasil disimpan ke folder aktivitas/',
            'file_name' => $targetName
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal memindahkan file ke folder aktivitas']);
    }
    exit();
}

echo json_encode(['status' => 'error', 'message' => 'Action tidak dikenali']);
?>
