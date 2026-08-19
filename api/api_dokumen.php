<?php
// api_dokumen.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $customer_id = isset($_GET['customer_id']) ? intval($_GET['customer_id']) : 0;
    $data = [];

    if ($customer_id <= 0) {
        echo json_encode(["status" => "no_customer", "message" => "Belum ada customer dipilih", "data" => []]);
        exit;
    }

    // Cek apakah customer_id ini valid di tabel_customer
    $cust_check = $conn->query("SELECT id, nama FROM tabel_customer WHERE id = $customer_id");
    if (!$cust_check || $cust_check->num_rows === 0) {
        echo json_encode(["status" => "no_customer", "message" => "Customer tidak ditemukan", "data" => []]);
        exit;
    }

    $cust_row = $cust_check->fetch_assoc();

    // Pastikan minimal ada baris checklist default untuk customer ini
    $check_query = "SELECT COUNT(*) as total FROM tabel_dokumen_customer WHERE customer_id = ?";
    $stmt = $conn->prepare($check_query);
    if ($stmt) {
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $res_obj = $stmt->get_result();
        $res = $res_obj ? $res_obj->fetch_assoc() : ['total' => 0];
        $stmt->close();
        
        if (!$res || (isset($res['total']) && $res['total'] == 0)) {
            $defaults = [
                ['KTP Customer', 'Belum Ada', NULL],
                ['NPWP', 'Belum Ada', NULL],
                ['Slip Gaji', 'Belum Ada', NULL],
                ['Rekening Koran', 'Opsional', NULL],
                ['Surat Keterangan Kerja', 'Opsional', NULL]
            ];
            $ins_query = "INSERT INTO tabel_dokumen_customer (customer_id, nama_dokumen, status, file_path) VALUES (?, ?, ?, ?)";
            $stmt_ins = $conn->prepare($ins_query);
            if ($stmt_ins) {
                foreach ($defaults as $d) {
                    $doc_name = $d[0];
                    $doc_status = $d[1];
                    $doc_file = $d[2];
                    try {
                        $stmt_ins->bind_param("isss", $customer_id, $doc_name, $doc_status, $doc_file);
                        $stmt_ins->execute();
                    } catch (\Throwable $e) {
                    }
                }
                $stmt_ins->close();
            }
        }
    }

    // Fetch data dari database
    $query = "SELECT id, nama_dokumen, status, file_path FROM tabel_dokumen_customer WHERE customer_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        $stmt->close();
    }

    echo json_encode(["status" => "success", "customer_nama" => $cust_row['nama'], "data" => $data]);

} elseif ($method === 'POST') {
    $customer_id = isset($_POST['customer_id']) ? intval($_POST['customer_id']) : 0;
    $nama_dokumen = $_POST['nama_dokumen'] ?? '';

    if (empty($nama_dokumen) || $customer_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Customer dan nama dokumen wajib diisi."]);
        exit;
    }

    $file_path = NULL;
    $status = 'Tersimpan';

    if (isset($_FILES['dokumen_file']) && $_FILES['dokumen_file']['error'] == 0) {
        $upload_dir = '../uploads/dokumen/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $file_name = time() . '_' . uniqid() . '_' . basename($_FILES['dokumen_file']['name']);
        $dest_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['dokumen_file']['tmp_name'], $dest_path)) {
            $file_path = 'uploads/dokumen/' . $file_name;
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengunggah file."]);
            exit;
        }
    }

    // Cek jika record sudah ada
    $check_rec = $conn->query("SELECT id FROM tabel_dokumen_customer WHERE customer_id = $customer_id AND nama_dokumen = '" . $conn->real_escape_string($nama_dokumen) . "'");
    if ($check_rec && $check_rec->num_rows > 0) {
        $query = "UPDATE tabel_dokumen_customer SET status = ?, file_path = COALESCE(?, file_path) WHERE customer_id = ? AND nama_dokumen = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("ssis", $status, $file_path, $customer_id, $nama_dokumen);
            $stmt->execute();
            $stmt->close();
        }
    } else {
        $query = "INSERT INTO tabel_dokumen_customer (customer_id, nama_dokumen, status, file_path) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("isss", $customer_id, $nama_dokumen, $status, $file_path);
            $stmt->execute();
            $stmt->close();
        }
    }

    echo json_encode(["status" => "success", "message" => "Dokumen " . $nama_dokumen . " berhasil diperbarui.", "file_path" => $file_path]);

} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak didukung."]);
}

$conn->close();
?>
