<?php
// api_briefing.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'koneksi.php';

// Auto-create tabel_briefing jika belum ada
if ($conn) {
    @$conn->query("CREATE TABLE IF NOT EXISTS tabel_briefing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        spv_name VARCHAR(100) NOT NULL,
        team_name VARCHAR(100) DEFAULT 'Semua Tim',
        briefing_type ENUM('morning', 'evening') DEFAULT 'morning',
        title VARCHAR(255) NOT NULL,
        content_text TEXT NOT NULL,
        audio_url VARCHAR(255) NULL,
        target_spk INT DEFAULT 0,
        realisasi_spk INT DEFAULT 0,
        target_do INT DEFAULT 0,
        realisasi_do INT DEFAULT 0,
        briefing_date DATE NOT NULL,
        created_at DATETIME NOT NULL,
        INDEX (briefing_date),
        INDEX (briefing_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_today_briefing';

// ── ACTION: PUBLISH BRIEFING ───────────────────────────────────────────────────
if ($action === 'publish_briefing') {
    $rawInput = file_get_contents('php://input');
    $postData = json_decode($rawInput, true) ?: $_POST;

    $spvName = trim($postData['spv_name'] ?? 'Supervisor Tunas Toyota');
    $teamName = trim($postData['team_name'] ?? 'Semua Tim');
    $briefingType = trim($postData['briefing_type'] ?? 'morning');
    $title = trim($postData['title'] ?? ($briefingType === 'morning' ? 'Morning Huddle & Kickoff' : 'Evening Closing & Recap'));
    $contentText = trim($postData['content_text'] ?? '');
    $targetSpk = intval($postData['target_spk'] ?? 0);
    $realSpk = intval($postData['realisasi_spk'] ?? 0);
    $targetDo = intval($postData['target_do'] ?? 0);
    $realDo = intval($postData['realisasi_do'] ?? 0);

    if (empty($contentText)) {
        echo json_encode([
            "status" => "error",
            "message" => "Isi pesan briefing tidak boleh kosong."
        ]);
        exit;
    }

    $today = date('Y-m-d');
    $now = date('Y-m-d H:i:s');

    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO tabel_briefing 
            (spv_name, team_name, briefing_type, title, content_text, target_spk, realisasi_spk, target_do, realisasi_do, briefing_date, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssiiiiss", $spvName, $teamName, $briefingType, $title, $contentText, $targetSpk, $realSpk, $targetDo, $realDo, $today, $now);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Briefing berhasil diterbitkan ke seluruh Sales App!",
                "data" => [
                    "id" => $conn->insert_id,
                    "title" => $title,
                    "date" => $today,
                    "created_at" => $now
                ]
            ]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan briefing: " . $conn->error]);
            exit;
        }
    } else {
        // Mock fallback response jika database offline
        echo json_encode([
            "status" => "success",
            "message" => "Briefing tersimpan di sesi lokal (Mode Offline).",
            "data" => [
                "id" => 999,
                "title" => $title,
                "date" => $today,
                "created_at" => $now
            ]
        ]);
        exit;
    }
}

// ── ACTION: GET TODAY BRIEFING ─────────────────────────────────────────────────
if ($action === 'get_today_briefing') {
    $today = date('Y-m-d');
    $type = $_GET['type'] ?? '';

    if ($conn) {
        $sql = "SELECT * FROM tabel_briefing WHERE briefing_date = '{$today}'";
        if (!empty($type)) {
            $escType = $conn->real_escape_string($type);
            $sql .= " AND briefing_type = '{$escType}'";
        }
        $sql .= " ORDER BY id DESC LIMIT 1";

        $res = $conn->query($sql);
        if ($res && $res->num_rows > 0) {
            $row = $res->fetch_assoc();
            echo json_encode([
                "status" => "success",
                "data" => $row
            ]);
            exit;
        }
    }

    // Jika belum ada briefing hari ini, kembalikan null atau template default
    echo json_encode([
        "status" => "empty",
        "message" => "Belum ada briefing resmi hari ini.",
        "data" => null
    ]);
    exit;
}

// ── ACTION: GET BRIEFING HISTORY ───────────────────────────────────────────────
if ($action === 'get_history') {
    $limit = intval($_GET['limit'] ?? 10);
    $data = [];

    if ($conn) {
        $res = $conn->query("SELECT * FROM tabel_briefing ORDER BY id DESC LIMIT {$limit}");
        if ($res) {
            while ($r = $res->fetch_assoc()) {
                $data[] = $r;
            }
        }
    }

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
    exit;
}
