<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

// helper for deleting old finished/waiting games to keep DB clean
$conn->query("DELETE FROM tabel_catur WHERE last_update < (NOW() - INTERVAL 1 DAY)");

switch ($method) {
    case 'GET':
        // list lobby waiting games or get state of a specific game
        $action = $_GET['action'] ?? '';
        
        if ($action == 'state') {
            $id = (int)($_GET['id'] ?? 0);
            $sql = "SELECT * FROM tabel_catur WHERE id = $id";
            $res = $conn->query($sql);
            if ($res && $res->num_rows > 0) {
                echo json_encode(["status" => "success", "data" => $res->fetch_assoc()]);
            } else {
                echo json_encode(["status" => "error", "message" => "Game not found"]);
            }
        } else {
            // Default to list
            $sql = "SELECT * FROM tabel_catur WHERE status = 'waiting' ORDER BY id DESC LIMIT 20";
            $res = $conn->query($sql);
            $data = [];
            if ($res) {
                while($row = $res->fetch_assoc()) $data[] = $row;
            }
            echo json_encode(["status" => "success", "data" => $data]);
        }
        break;

    case 'POST':
        // create or join
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) $data = $_POST;

        $action = $data['action'] ?? '';

        if ($action == 'create') {
            $player = $data['player_name'] ?? 'Unknown';
            $color = $data['color'] ?? 'w';
            $initial_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // standard start
            
            if ($color === 'w') {
                $stmt = $conn->prepare("INSERT INTO tabel_catur (player_white, fen) VALUES (?, ?)");
            } else {
                $stmt = $conn->prepare("INSERT INTO tabel_catur (player_black, fen) VALUES (?, ?)");
            }
            
            $stmt->bind_param("ss", $player, $initial_fen);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "game_id" => $conn->insert_id]);
            } else {
                echo json_encode(["status" => "error", "message" => $stmt->error]);
            }
            $stmt->close();
        }
        else if ($action == 'join') {
            $id = (int)($data['id'] ?? 0);
            $player = $data['player_name'] ?? 'Unknown';
            
            // Check if game is waiting
            $res = $conn->query("SELECT status, player_white, player_black FROM tabel_catur WHERE id = $id");
            if ($res && $res->num_rows > 0) {
                $row = $res->fetch_assoc();
                if ($row['status'] == 'waiting') {
                    if (empty($row['player_white']) && $row['player_black'] != $player) {
                        $stmt = $conn->prepare("UPDATE tabel_catur SET player_white = ?, status = 'playing' WHERE id = ?");
                        $assigned_color = 'w';
                    } else if (empty($row['player_black']) && $row['player_white'] != $player) {
                        $stmt = $conn->prepare("UPDATE tabel_catur SET player_black = ?, status = 'playing' WHERE id = ?");
                        $assigned_color = 'b';
                    } else {
                        echo json_encode(["status" => "error", "message" => "Ruangan penuh atau Anda sudah bergabung."]);
                        exit;
                    }
                    
                    $stmt->bind_param("si", $player, $id);
                    if ($stmt->execute()) {
                        echo json_encode(["status" => "success", "color" => $assigned_color, "message" => "Joined successfully"]);
                    } else {
                        echo json_encode(["status" => "error", "message" => "Failed to join"]);
                    }
                    $stmt->close();
                } else {
                    echo json_encode(["status" => "error", "message" => "Game already started."]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Game not found"]);
            }
        }
        break;
        
    case 'PUT':
        // update FEN
        $data = json_decode(file_get_contents("php://input"), true);
        $id = (int)($data['id'] ?? 0);
        $fen = $data['fen'] ?? '';
        $game_status = $data['status'] ?? 'playing';
        $winner = $data['winner'] ?? null;

        if ($id > 0 && $fen != '') {
            $stmt = $conn->prepare("UPDATE tabel_catur SET fen = ?, status = ?, winner = ? WHERE id = ?");
            $stmt->bind_param("sssi", $fen, $game_status, $winner, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update state"]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid data"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = (int)($data['id'] ?? 0);
        
        if ($id > 0) {
            $stmt = $conn->prepare("DELETE FROM tabel_catur WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to delete room"]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid ID"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
