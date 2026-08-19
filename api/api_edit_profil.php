<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sales_id = isset($_GET['sales_id']) ? intval($_GET['sales_id']) : 0;
    if ($sales_id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID Sales tidak valid."]);
        exit;
    }

    $query = "SELECT id, username, nama_lengkap, foto, nama_spv, tingkatan, no_hp, email FROM sales_accounts WHERE id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("i", $sales_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode(["status" => "success", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Sales tidak ditemukan."]);
        }
        $stmt->close();
    }
} elseif ($method === 'POST') {
    $sales_id = isset($_POST['sales_id']) ? intval($_POST['sales_id']) : 0;
    if ($sales_id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID Sales tidak valid."]);
        exit;
    }

    $nama = $_POST['nama_lengkap'] ?? '';
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $no_hp = $_POST['no_hp'] ?? '';
    $email = $_POST['email'] ?? '';

    // Handle File Upload
    $fotoPath = '';
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
        $target_dir = "../uploads/lokasi/";
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $filename = time() . '_' . basename($_FILES["foto"]["name"]);
        $target_file = $target_dir . $filename;
        if (move_uploaded_file($_FILES["foto"]["tmp_name"], $target_file)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $domain = $_SERVER['HTTP_HOST'];
            $base_dir = rtrim(dirname(dirname($_SERVER['REQUEST_URI'])), '/\\');
            $fotoPath = $protocol . "://" . $domain . $base_dir . "/uploads/lokasi/" . $filename;
        }
    }

    $query = "UPDATE sales_accounts SET nama_lengkap = ?, username = ?, no_hp = ?, email = ?";
    $types = "ssss";
    $params = [&$nama, &$username, &$no_hp, &$email];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $types .= "s";
        $params[] = &$hashed_password;
    }

    if (!empty($fotoPath)) {
        $query .= ", foto = ?";
        $types .= "s";
        $params[] = &$fotoPath;
    }

    $query .= " WHERE id = ?";
    $types .= "i";
    $params[] = &$sales_id;

    $stmt = $conn->prepare($query);
    if ($stmt) {
        // dynamic bind
        $bind_names[] = $types;
        for ($i=0; $i<count($params);$i++) {
            $bind_names[] = &$params[$i];
        }
        call_user_func_array([$stmt, 'bind_param'], $bind_names);

        if ($stmt->execute()) {
            // Fetch updated data to send back
            $q2 = "SELECT id, username, nama_lengkap, foto, no_hp, email FROM sales_accounts WHERE id = $sales_id";
            $r2 = $conn->query($q2);
            $updated = $r2->fetch_assoc();
            echo json_encode(["status" => "success", "message" => "Profil berhasil diperbarui", "data" => $updated]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal memperbarui: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Query Error"]);
    }
}
$conn->close();
?>
