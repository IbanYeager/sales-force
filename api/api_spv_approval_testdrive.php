<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $spv = isset($_GET['spv']) ? $_GET['spv'] : '';
        if (!empty($spv)) {
            $sql = "SELECT r.*, u.model, u.type, u.warna, u.tahun 
                    FROM tabel_test_drive_request r 
                    LEFT JOIN tabel_test_drive_unit u ON r.id_unit = u.id
                    LEFT JOIN sales_accounts sa ON r.nama_sales = sa.nama_lengkap
                    WHERE sa.nama_spv = '" . $conn->real_escape_string($spv) . "'
                    ORDER BY r.created_at DESC";
        } else {
            $sql = "SELECT r.*, u.model, u.type, u.warna, u.tahun 
                    FROM tabel_test_drive_request r 
                    LEFT JOIN tabel_test_drive_unit u ON r.id_unit = u.id
                    ORDER BY r.created_at DESC";
        }
        $result = $conn ? $conn->query($sql) : false;
        $data = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        if (empty($data)) {
            // Fallback Data Demo Test Drive untuk SPV & Kacab Monitoring
            $data = [
                [
                    "id" => 101,
                    "nama_sales" => "Egy",
                    "nama_spv" => "Pak Ryan",
                    "nama_customer" => "Bpk. Hendra Wijaya",
                    "no_hp" => "081234567890",
                    "id_unit" => 1,
                    "model" => "Innova Zenix",
                    "type" => "V Hybrid CVT",
                    "warna" => "White Pearl",
                    "tahun" => "2024",
                    "jadwal" => "2026-08-09 10:00:00",
                    "rute" => "Rute Kiara Condong - Buah Batu (Luar Kota / Highway)",
                    "status" => "Menunggu",
                    "created_at" => "2026-08-08 09:30:00"
                ],
                [
                    "id" => 102,
                    "nama_sales" => "Ahmad",
                    "nama_spv" => "Pak Alvin",
                    "nama_customer" => "Ibu Ratna Suminar",
                    "no_hp" => "081987654321",
                    "id_unit" => 2,
                    "model" => "Yaris Cross",
                    "type" => "S GR Sport Hybrid",
                    "warna" => "Black Mica",
                    "tahun" => "2024",
                    "jadwal" => "2026-08-09 14:00:00",
                    "rute" => "Rute Showroom Event Tunas Toyota Kiara Condong",
                    "status" => "Disetujui",
                    "created_at" => "2026-08-08 08:15:00"
                ],
                [
                    "id" => 103,
                    "nama_sales" => "Ridwan",
                    "nama_spv" => "Pak Riva",
                    "nama_customer" => "PT Borwita Citra (Bpk. Denny)",
                    "no_hp" => "081322334455",
                    "id_unit" => 3,
                    "model" => "Fortuner",
                    "type" => "2.8 VRZ GR Sport 4x2",
                    "warna" => "Attitude Black",
                    "tahun" => "2024",
                    "jadwal" => "2026-08-10 11:00:00",
                    "rute" => "Rute Test Drive Executive Fleet & Toll Pasteur",
                    "status" => "Disetujui",
                    "created_at" => "2026-08-07 16:45:00"
                ]
            ];
        }

        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id']) || !isset($data['status'])) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        $id = (int)$data['id'];
        $spv_approval_status = $data['status']; // 'Approved' or 'Rejected'
        $db_status = ($spv_approval_status === 'Approved') ? 'Disetujui' : 'Ditolak';
        $spv_nama = $data['spv_nama'] ?? 'SPV System';

        $stmt = $conn->prepare("UPDATE tabel_test_drive_request SET status=?, spv_approval=? WHERE id=?");
        $stmt->bind_param("ssi", $db_status, $spv_approval_status, $id);
        
        if ($stmt->execute()) {
            if ($spv_approval_status === 'Approved') {
                // Update ketersediaan unit menjadi 'tidak tersedia'
                $update_unit = $conn->prepare("UPDATE tabel_test_drive_unit u JOIN tabel_test_drive_request r ON u.id = r.id_unit SET u.ketersediaan = 'tidak tersedia' WHERE r.id = ?");
                $update_unit->bind_param("i", $id);
                $update_unit->execute();
                
                // Get Sales phone to send WA
                $q_data = $conn->query("SELECT r.nama_sales, r.nama_customer, u.model, sa.no_hp as hp_sales 
                                        FROM tabel_test_drive_request r 
                                        LEFT JOIN sales_accounts sa ON r.nama_sales = sa.nama_lengkap 
                                        LEFT JOIN tabel_test_drive_unit u ON r.id_unit = u.id 
                                        WHERE r.id = $id");
                if ($q_data && $q_data->num_rows > 0) {
                    $row = $q_data->fetch_assoc();
                    $hp_sales = $row['hp_sales'];
                    $cust = $row['nama_customer'];
                    $model = $row['model'];

                    if (!empty($hp_sales)) {
                        $wa_msg = "Halo! Pengajuan Test Drive untuk customer *" . $cust . "* (Unit: " . $model . ") telah *DISETUJUI* oleh SPV. Segera siapkan unit!";
                        $wa_url = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api_wa_gateway.php";
                        $ch = curl_init($wa_url);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['phone' => $hp_sales, 'message' => $wa_msg]));
                        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
                        curl_exec($ch);
                        curl_close($ch);
                    }
                }
            }
            echo json_encode(["status" => "success", "message" => "Status berhasil diupdate"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update data: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            exit;
        }

        $id = (int)$data['id'];
        
        $stmt = $conn->prepare("DELETE FROM tabel_test_drive_request WHERE id=?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Test Drive berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal hapus data: " . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
$conn->close();
?>
