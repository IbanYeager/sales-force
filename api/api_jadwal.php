<?php
// api_jadwal.php - REST API for Sales Calendar & Follow-Up Reminders
error_reporting(E_ALL); 
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'GET') {
    $sales_id = (isset($_GET['sales_account_id']) && intval($_GET['sales_account_id']) > 0) ? intval($_GET['sales_account_id']) : 1;
    $dateParam = isset($_GET['date']) ? trim($_GET['date']) : '';
    $monthParam = isset($_GET['month']) ? intval($_GET['month']) : 0;
    $yearParam = isset($_GET['year']) ? intval($_GET['year']) : 0;
    $viewParam = isset($_GET['view']) ? trim($_GET['view']) : '';
    $statusParam = isset($_GET['status']) ? trim($_GET['status']) : '';

    $isLegacyCall = empty($dateParam) && empty($monthParam) && empty($yearParam) && empty($viewParam);

    $conditions = ["sales_account_id = ?"];
    $types = "i";
    $params = [$sales_id];

    if (!empty($dateParam)) {
        if ($dateParam === 'today') {
            $conditions[] = "DATE(waktu) = CURDATE()";
        } else {
            // Query specific date: YYYY-MM-DD
            $conditions[] = "DATE(waktu) = ?";
            $types .= "s";
            $params[] = $dateParam;
        }
    } elseif ($monthParam > 0 && $yearParam > 0) {
        // Query whole month for calendar view
        $conditions[] = "MONTH(waktu) = ? AND YEAR(waktu) = ?";
        $types .= "ii";
        $params[] = $monthParam;
        $params[] = $yearParam;
    } elseif ($viewParam === 'today_pending' || $viewParam === 'today_reminders') {
        // Today's pending schedules + overdue reminders not yet marked Selesai
        $conditions[] = "((DATE(waktu) = CURDATE()) OR (DATE(waktu) < CURDATE() AND status != 'Selesai'))";
        if (empty($statusParam) || $statusParam === 'pending' || $statusParam === 'Terjadwal') {
            $conditions[] = "status != 'Selesai'";
        }
    } elseif ($viewParam === 'upcoming' || $viewParam === 'all') {
        // All upcoming reminders from today onwards
        $conditions[] = "DATE(waktu) >= CURDATE()";
    } elseif ($viewParam === 'history') {
        // Past reminders
        $conditions[] = "DATE(waktu) < CURDATE()";
    } else {
        // Default legacy behavior: only today's scheduled tasks
        $conditions[] = "DATE(waktu) = CURDATE()";
        if (empty($statusParam)) {
            $conditions[] = "status = 'Terjadwal'";
        }
    }

    if (!empty($statusParam) && $statusParam !== 'all' && $statusParam !== 'pending') {
        $conditions[] = "status = ?";
        $types .= "s";
        $params[] = $statusParam;
    }

    $whereClause = implode(" AND ", $conditions);
    $query = "SELECT id, waktu, judul, deskripsi, status FROM tabel_jadwal WHERE $whereClause ORDER BY waktu ASC";
    
    $stmt = $conn->prepare($query);
    if ($stmt) {
        if (!empty($types)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $data = [];
        $pendingCount = 0;
        while ($row = $result->fetch_assoc()) {
            $row['id'] = intval($row['id']);
            $rawWaktu = $row['waktu'] ?? '';
            $row['waktu_full'] = $rawWaktu;
            $row['tanggal'] = (strlen($rawWaktu) >= 10) ? substr($rawWaktu, 0, 10) : '';
            $row['jam'] = (strlen($rawWaktu) >= 16) ? substr($rawWaktu, 11, 5) : '';

            if ($row['status'] !== 'Selesai') {
                $pendingCount++;
            }

            // For legacy caller (e.g. pages_index.js dashboard widget expecting hh:mm in waktu)
            if ($isLegacyCall) {
                $row['waktu'] = $row['jam'];
            } else {
                // If caller requested date/month/view, provide jam as waktu or keep full
                $row['waktu'] = $row['jam'] ?: $rawWaktu;
            }

            $data[] = $row;
        }
        echo json_encode([
            "status" => "success", 
            "data" => $data, 
            "total" => count($data),
            "pending_count" => $pendingCount
        ]);
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
    }
} elseif ($method === 'POST') {
    // Menerima data dalam format JSON atau x-www-form-urlencoded
    $payload = json_decode(file_get_contents('php://input'), true);
    
    $sales_id = isset($payload['sales_account_id']) ? intval($payload['sales_account_id']) : (isset($_POST['sales_account_id']) ? intval($_POST['sales_account_id']) : 1);
    
    $tanggal = $payload['tanggal'] ?? $_POST['tanggal'] ?? '';
    $jam = $payload['jam'] ?? $_POST['jam'] ?? '';
    $waktu = $payload['waktu'] ?? $_POST['waktu'] ?? '';

    // If separate tanggal & jam were provided
    if (!empty($tanggal)) {
        $jamClean = !empty($jam) ? $jam : '09:00';
        if (strlen($jamClean) === 5) $jamClean .= ':00';
        $waktu = trim($tanggal . ' ' . $jamClean);
    } elseif (!empty($waktu)) {
        $waktu = str_replace('T', ' ', $waktu);
        // If only time was provided (HH:mm), default to today
        if (strlen($waktu) <= 8 && strpos($waktu, '-') === false) {
            if (strlen($waktu) === 5) $waktu .= ':00';
            $waktu = date('Y-m-d') . ' ' . $waktu;
        } elseif (strlen($waktu) === 16) {
            $waktu .= ':00';
        }
    } else {
        $waktu = date('Y-m-d H:i:s');
    }

    $judul = trim($payload['judul'] ?? $_POST['judul'] ?? '');
    $deskripsi = trim($payload['deskripsi'] ?? $_POST['deskripsi'] ?? '');
    $status = trim($payload['status'] ?? $_POST['status'] ?? 'Terjadwal');

    if (empty($waktu) || empty($judul)) {
        echo json_encode(["status" => "error", "message" => "Parameter judul dan waktu wajib diisi."]);
        exit;
    }

    $query = "INSERT INTO tabel_jadwal (sales_account_id, waktu, judul, deskripsi, status) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("issss", $sales_id, $waktu, $judul, $deskripsi, $status);
        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success", 
                "message" => "Jadwal berhasil disimpan", 
                "id" => $stmt->insert_id,
                "waktu" => $waktu
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan jadwal: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
    }
} elseif ($method === 'PUT') {
    $payload = json_decode(file_get_contents('php://input'), true);
    if (!isset($payload['id'])) {
        echo json_encode(["status" => "error", "message" => "Parameter ID jadwal wajib disertakan."]);
        exit;
    }
    $id = intval($payload['id']);

    // Check if full edit or just status toggle
    if (isset($payload['judul']) && isset($payload['waktu'])) {
        $waktu = str_replace('T', ' ', $payload['waktu']);
        if (strlen($waktu) === 16) $waktu .= ':00';
        $judul = trim($payload['judul']);
        $deskripsi = trim($payload['deskripsi'] ?? '');
        $status = trim($payload['status'] ?? 'Terjadwal');

        $stmt = $conn->prepare("UPDATE tabel_jadwal SET waktu = ?, judul = ?, deskripsi = ?, status = ? WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("ssssi", $waktu, $judul, $deskripsi, $status, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Jadwal berhasil diperbarui."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui jadwal: " . $stmt->error]);
            }
            $stmt->close();
        }
    } elseif (isset($payload['status'])) {
        $status = $payload['status'];
        $stmt = $conn->prepare("UPDATE tabel_jadwal SET status = ? WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("si", $status, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Status jadwal berhasil diperbarui."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui status jadwal."]);
            }
            $stmt->close();
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Tidak ada data perubahan."]);
    }
} elseif ($method === 'DELETE') {
    $payload = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? intval($_GET['id']) : (isset($payload['id']) ? intval($payload['id']) : 0);

    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID jadwal tidak valid."]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM tabel_jadwal WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Jadwal berhasil dihapus."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus jadwal: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak didukung."]);
}

$conn->close();
?>
