<?php
// api_notifikasi.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'koneksi.php';

if (!function_exists('resolveSalesId')) {
function resolveSalesId($conn, $raw_input, $nama_input = '') {
    $raw_input = trim((string)$raw_input);
    $nama_input = trim((string)$nama_input);

    // 1. If numeric ID provided, check if it actually exists in sales_accounts
    if (is_numeric($raw_input) && intval($raw_input) > 0) {
        $id = intval($raw_input);
        $res = $conn->query("SELECT id FROM sales_accounts WHERE id = $id LIMIT 1");
        if ($res && $res->num_rows > 0) {
            return $id;
        }
    }

    // 2. Try lookup by username or nama_lengkap with raw_input
    if (!empty($raw_input) && !is_numeric($raw_input)) {
        $esc = $conn->real_escape_string($raw_input);
        $res = $conn->query("SELECT id FROM sales_accounts WHERE username = '$esc' OR nama_lengkap LIKE '%$esc%' LIMIT 1");
        if ($res && $res->num_rows > 0) {
            $row = $res->fetch_assoc();
            return intval($row['id']);
        }
    }

    // 3. Try lookup with nama_input
    if (!empty($nama_input)) {
        $esc = $conn->real_escape_string($nama_input);
        $res = $conn->query("SELECT id FROM sales_accounts WHERE username = '$esc' OR nama_lengkap LIKE '%$esc%' LIMIT 1");
        if ($res && $res->num_rows > 0) {
            $row = $res->fetch_assoc();
            return intval($row['id']);
        }
    }

    // 4. Default to account ID of 'egy' or fallback to 10
    $resDef = $conn->query("SELECT id FROM sales_accounts WHERE username = 'egy' LIMIT 1");
    if ($resDef && $resDef->num_rows > 0) {
        $row = $resDef->fetch_assoc();
        return intval($row['id']);
    }

    return 10;
}
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sales_id = resolveSalesId($conn, $_GET['sales_account_id'] ?? $_GET['id'] ?? '', $_GET['nama_sales'] ?? '');

    $query = "SELECT id, title, body, time_label, unread, status_icon, created_at FROM tabel_notifikasi WHERE sales_account_id = ? ORDER BY id DESC";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("i", $sales_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $row['id'] = intval($row['id']);
            $row['unread'] = (bool)$row['unread'];
            $data[] = $row;
        }
        echo json_encode([
            "status" => "success",
            "sales_account_id" => $sales_id,
            "data" => $data
        ]);
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mengambil data: " . $conn->error]);
    }
} elseif ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $sales_id = resolveSalesId(
        $conn,
        $payload['sales_account_id'] ?? $_POST['sales_account_id'] ?? '',
        $payload['nama_sales'] ?? $_POST['nama_sales'] ?? ''
    );
    $action = $payload['action'] ?? $_POST['action'] ?? 'read_all';

    if ($action === 'read_all') {
        $query = "UPDATE tabel_notifikasi SET unread = 0 WHERE sales_account_id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("i", $sales_id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Semua notifikasi ditandai dibaca"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui notifikasi: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } elseif ($action === 'read_single') {
        $notif_id = isset($payload['id']) ? intval($payload['id']) : (isset($_POST['id']) ? intval($_POST['id']) : 0);
        $query = "UPDATE tabel_notifikasi SET unread = 0 WHERE id = ? AND sales_account_id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("ii", $notif_id, $sales_id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Notifikasi berhasil ditandai dibaca"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui notifikasi: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } elseif ($action === 'delete_read') {
        $query = "DELETE FROM tabel_notifikasi WHERE unread = 0 AND sales_account_id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("i", $sales_id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Riwayat notifikasi yang sudah dibaca berhasil dihapus"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus notifikasi: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak didukung."]);
}

if (isset($conn) && $conn) {
    $conn->close();
}
?>
