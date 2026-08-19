<?php
// api_olx.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['spv'])) {
        $spv = $_GET['spv'];
        $query = "SELECT t.id, t.sales_account_id, sa.nama_lengkap as nama_sales, sa.no_hp as hp_sales, t.nama_kendaraan, t.jenis_type, t.tahun, t.warna, t.harga_estimasi, t.lokasi_kecamatan, t.deskripsi_kondisi, t.foto_paths, t.created_at, t.status 
                  FROM tabel_trade_in t 
                  JOIN sales_accounts sa ON t.sales_account_id = sa.id 
                  WHERE sa.nama_spv = ? 
                  ORDER BY t.id DESC";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("s", $spv);
        }
    } elseif (isset($_GET['all'])) {
        $query = "SELECT t.id, t.sales_account_id, sa.nama_lengkap as nama_sales, sa.no_hp as hp_sales, t.nama_kendaraan, t.jenis_type, t.tahun, t.warna, t.harga_estimasi, t.lokasi_kecamatan, t.deskripsi_kondisi, t.foto_paths, t.created_at, t.status 
                  FROM tabel_trade_in t 
                  JOIN sales_accounts sa ON t.sales_account_id = sa.id 
                  ORDER BY t.id DESC LIMIT 20"; // limit to recent 20 for dashboard
        $stmt = $conn->prepare($query);
    } else {
        $sales_id = isset($_GET['sales_account_id']) ? intval($_GET['sales_account_id']) : 1;
        $query = "SELECT t.id, t.nama_kendaraan, t.jenis_type, t.tahun, t.warna, t.harga_estimasi, t.lokasi_kecamatan, t.deskripsi_kondisi, t.foto_paths, t.created_at, t.status, sa.nama_lengkap as nama_sales, sa.no_hp as hp_sales 
                  FROM tabel_trade_in t
                  JOIN sales_accounts sa ON t.sales_account_id = sa.id
                  WHERE t.sales_account_id = ? 
                  ORDER BY t.id DESC";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("i", $sales_id);
        }
    }

    if ($stmt) {
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            if ($row['foto_paths']) {
                $row['foto_paths'] = json_decode($row['foto_paths'], true);
            } else {
                $row['foto_paths'] = [];
            }
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mengambil data: " . $conn->error]);
    }
} elseif ($method === 'POST') {
    // Check if it's a JSON action or normal FormData action
    $payload = json_decode(file_get_contents('php://input'), true);
    $action = $payload['action'] ?? $_POST['action'] ?? 'submit';

    if ($action === 'approve') {
        $id = isset($payload['id']) ? intval($payload['id']) : (isset($_POST['id']) ? intval($_POST['id']) : 0);
        $status = $payload['status'] ?? $_POST['status'] ?? 'Approved';
        $harga = isset($payload['harga_estimasi']) ? intval($payload['harga_estimasi']) : (isset($_POST['harga_estimasi']) ? intval($_POST['harga_estimasi']) : 0);

        if ($id <= 0 || !in_array($status, ['Approved', 'Rejected'])) {
            echo json_encode(["status" => "error", "message" => "Parameter tidak valid."]);
            exit;
        }

        $query = "UPDATE tabel_trade_in SET status = ?, harga_estimasi = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("sii", $status, $harga, $id);
            if ($stmt->execute()) {
                // Tambahkan notifikasi untuk Sales Consultant
                $q_sales = "SELECT sales_account_id, nama_kendaraan FROM tabel_trade_in WHERE id = ?";
                $st_sales = $conn->prepare($q_sales);
                if ($st_sales) {
                    $st_sales->bind_param("i", $id);
                    $st_sales->execute();
                    $res_sales = $st_sales->get_result()->fetch_assoc();
                    $sales_id = $res_sales['sales_account_id'];
                    $car_name = $res_sales['nama_kendaraan'];
                    $st_sales->close();

                    if ($sales_id) {
                        $notif_title = "Trade-In " . ($status === 'Approved' ? 'Disetujui' : 'Ditolak');
                        $formatted_price = number_format($harga, 0, ',', '.');
                        $notif_body = $status === 'Approved' 
                            ? "Listing " . $car_name . " telah disetujui SPV dengan harga Rp " . $formatted_price
                            : "Listing " . $car_name . " ditolak oleh SPV.";
                        $notif_query = "INSERT INTO tabel_notifikasi (sales_account_id, title, body, time_label, status_icon) VALUES (?, ?, ?, 'Baru saja', 'exchange-alt')";
                        $n_stmt = $conn->prepare($notif_query);
                        if ($n_stmt) {
                            $n_stmt->bind_param("iss", $sales_id, $notif_title, $notif_body);
                            $n_stmt->execute();
                            $n_stmt->close();
                        }
                    }
                }
                echo json_encode(["status" => "success", "message" => "Listing Trade-In berhasil diperbarui!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui status: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
        exit;
    }

    $sales_id = isset($_POST['sales_account_id']) ? intval($_POST['sales_account_id']) : 1;
    $nama = $_POST['nama_kendaraan'] ?? '';
    $jenis = $_POST['jenis_type'] ?? '';
    $tahun = isset($_POST['tahun']) ? intval($_POST['tahun']) : 0;
    $warna = $_POST['warna'] ?? '';
    $harga = isset($_POST['harga_estimasi']) ? intval($_POST['harga_estimasi']) : 0;
    $lokasi = $_POST['lokasi_kecamatan'] ?? '';
    $deskripsi = $_POST['deskripsi_kondisi'] ?? '';

    if (empty($nama) || empty($jenis) || empty($lokasi) || empty($deskripsi)) {
        echo json_encode(["status" => "error", "message" => "Harap lengkapi semua kolom yang wajib diisi."]);
        exit;
    }

    // Menangani Upload Multi Foto
    $uploaded_files = [];
    $upload_dir = '../uploads/olx/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (isset($_FILES['foto'])) {
        $jumlah_foto = count($_FILES['foto']['name']);
        for ($i = 0; $i < $jumlah_foto; $i++) {
            if ($_FILES['foto']['error'][$i] == 0) {
                $file_name = time() . '_' . uniqid() . '_' . basename($_FILES['foto']['name'][$i]);
                $file_path = $upload_dir . $file_name;
                if (move_uploaded_file($_FILES['foto']['tmp_name'][$i], $file_path)) {
                    $uploaded_files[] = 'uploads/olx/' . $file_name;
                }
            }
        }
    }

    $foto_json = json_encode($uploaded_files);

    $query = "INSERT INTO tabel_trade_in (sales_account_id, nama_kendaraan, jenis_type, tahun, warna, harga_estimasi, lokasi_kecamatan, deskripsi_kondisi, foto_paths, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("issisisss", $sales_id, $nama, $jenis, $tahun, $warna, $harga, $lokasi, $deskripsi, $foto_json);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Listing Trade-In OLX berhasil diajukan ke Supervisor!", "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . $stmt->error]);
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
