<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        
        if ($action === 'get_models') {
            $data = [];
            $res = $conn->query("SELECT * FROM tco_models ORDER BY name ASC");
            if($res) { while($row = $res->fetch_assoc()) $data[] = $row; }
            echo json_encode(['status' => 'success', 'data' => $data]);
            exit;
        }
        
        if ($action === 'get_items') {
            $data = [];
            // JOIN with tco_models to get the model name
            $res = $conn->query("
                SELECT i.*, m.name as model_name 
                FROM tco_items i 
                LEFT JOIN tco_models m ON i.model_id = m.id 
                ORDER BY m.name ASC, i.name ASC
            ");
            if($res) { while($row = $res->fetch_assoc()) $data[] = $row; }
            echo json_encode(['status' => 'success', 'data' => $data]);
            exit;
        }
    }
    
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';

        // --- MODELS ---
        if ($action === 'save_model') {
            $id = intval($input['id'] ?? 0);
            $name = trim($input['name'] ?? '');
            $pdfPage = intval($input['pdfPage'] ?? 1);

            if (empty($name)) throw new Exception('Nama Model wajib diisi');

            if ($id > 0) {
                $stmt = $conn->prepare("UPDATE tco_models SET name = ?, pdfPage = ? WHERE id = ?");
                $stmt->bind_param("sii", $name, $pdfPage, $id);
                $stmt->execute();
            } else {
                $stmt = $conn->prepare("INSERT INTO tco_models (name, pdfPage) VALUES (?, ?)");
                $stmt->bind_param("si", $name, $pdfPage);
                $stmt->execute();
            }
            echo json_encode(['status' => 'success', 'message' => 'Model TCO berhasil disimpan']);
            exit;
        }

        if ($action === 'delete_model') {
            $id = intval($input['id'] ?? 0);
            // Delete items first
            $conn->query("DELETE FROM tco_items WHERE model_id = $id");
            $stmt = $conn->prepare("DELETE FROM tco_models WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['status' => 'success']);
            exit;
        }

        // --- ITEMS ---
        if ($action === 'save_item') {
            $id = intval($input['id'] ?? 0);
            $model_id = intval($input['model_id'] ?? 0);
            $name = trim($input['name'] ?? '');
            $part_number = trim($input['part_number'] ?? '');
            $type = trim($input['type'] ?? 'TCO');
            $price = trim($input['price'] ?? '');
            $price_tpos = trim($input['price_tpos'] ?? '');
            $price_tls = trim($input['price_tls'] ?? '');
            $applicable_grade = trim($input['applicable_grade'] ?? '');
            $stock = intval($input['stock'] ?? 0);
            $icon = trim($input['icon'] ?? 'fa-solid fa-gem');

            if (empty($name) || $model_id === 0) throw new Exception('Nama item dan Model wajib diisi');

            if ($id > 0) {
                $stmt = $conn->prepare("UPDATE tco_items SET model_id = ?, name = ?, part_number = ?, type = ?, price = ?, price_tpos = ?, price_tls = ?, applicable_grade = ?, stock = ?, icon = ? WHERE id = ?");
                $stmt->bind_param("isssssssisi", $model_id, $name, $part_number, $type, $price, $price_tpos, $price_tls, $applicable_grade, $stock, $icon, $id);
                $stmt->execute();
            } else {
                $stmt = $conn->prepare("INSERT INTO tco_items (model_id, name, part_number, type, price, price_tpos, price_tls, applicable_grade, stock, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("isssssssis", $model_id, $name, $part_number, $type, $price, $price_tpos, $price_tls, $applicable_grade, $stock, $icon);
                $stmt->execute();
            }
            echo json_encode(['status' => 'success', 'message' => 'Item TCO berhasil disimpan']);
            exit;
        }

        if ($action === 'order_item') {
            $item_name = trim($input['name'] ?? '');
            $item_id = intval($input['id'] ?? 0);
            
            if ($item_id > 0) {
                $stmt = $conn->prepare("UPDATE tco_items SET stock = GREATEST(0, stock - 1) WHERE id = ?");
                $stmt->bind_param("i", $item_id);
                $stmt->execute();
            } elseif (!empty($item_name)) {
                $stmt = $conn->prepare("UPDATE tco_items SET stock = GREATEST(0, stock - 1) WHERE name = ?");
                $stmt->bind_param("s", $item_name);
                $stmt->execute();
            }
            echo json_encode(['status' => 'success', 'message' => 'Stok TCO berhasil dikurangi']);
            exit;
        }

        if ($action === 'delete_item') {
            $id = intval($input['id'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM tco_items WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['status' => 'success']);
            exit;
        }
    }
    
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
