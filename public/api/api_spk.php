<?php
// api_spk.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'koneksi.php';

function triggerSheetsPush($conn, $sales_id, $tambah_spk = 0, $tambah_do = 0) {
    if (!$conn || ($tambah_spk == 0 && $tambah_do == 0)) return;
    $res_sales = $conn->query("SELECT nama_lengkap, username FROM sales_accounts WHERE id = " . intval($sales_id) . " LIMIT 1");
    if (!$res_sales || $res_sales->num_rows === 0) return;
    $sales_row = $res_sales->fetch_assoc();
    $sales_name = $sales_row['nama_lengkap'];

    $res_cfg = $conn->query("SELECT apps_script_webhook_url FROM tabel_sheets_sync_config WHERE id = 1 LIMIT 1");
    if (!$res_cfg || $res_cfg->num_rows === 0) return;
    $webhook_url = $res_cfg->fetch_assoc()['apps_script_webhook_url'];
    if (empty($webhook_url)) return;

    $payload = [
        'nama_sales' => $sales_name,
        'tambah_spk' => $tambah_spk,
        'tambah_do' => $tambah_do
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $webhook_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 5
    ]);
    @curl_exec($ch);
    @curl_close($ch);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check if spv name filter is passed
    $spv = isset($_GET['spv']) ? $_GET['spv'] : '';
    $all = isset($_GET['all']) && $_GET['all'] === 'true';
    $raw_sales = isset($_GET['sales_account_id']) ? trim($_GET['sales_account_id']) : 10;
    $sales_id = 10;
    if (is_numeric($raw_sales)) {
        $sales_id = intval($raw_sales);
    } else {
        $u_esc = $conn->real_escape_string($raw_sales);
        $q_find = $conn->query("SELECT id FROM sales_accounts WHERE username = '$u_esc' OR nama_lengkap LIKE '%$u_esc%' LIMIT 1");
        if ($q_find && $q_find->num_rows > 0) {
            $r = $q_find->fetch_assoc();
            $sales_id = intval($r['id']);
        }
    }

    if (!empty($spv) && strtolower($spv) !== 'semua' && strtolower($spv) !== 'all' && strtolower($spv) !== 'master') {
        $spv_clean = str_replace('Pak ', '', $spv);
        $query = "SELECT s.id, s.sales_account_id, sa.nama_lengkap as nama_sales, s.nama_customer, s.no_hp, s.model, s.nominal, s.tipe_pembelian, s.status, s.created_at 
                  FROM tabel_spk s
                  LEFT JOIN sales_accounts sa ON s.sales_account_id = sa.id
                  WHERE (sa.nama_spv = ? OR sa.nama_spv LIKE ?)
                  ORDER BY s.id DESC";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $likeSpv = "%$spv_clean%";
            $stmt->bind_param("ss", $spv, $likeSpv);
        }
    } elseif ($all || !empty($spv)) {
        $query = "SELECT s.id, s.sales_account_id, sa.nama_lengkap as nama_sales, s.nama_customer, s.no_hp, s.model, s.nominal, s.tipe_pembelian, s.status, s.created_at 
                  FROM tabel_spk s
                  LEFT JOIN sales_accounts sa ON s.sales_account_id = sa.id
                  ORDER BY s.id DESC";
        $stmt = $conn->prepare($query);
    } else {
        $query = "SELECT id, nama_customer, no_hp, model, nominal, tipe_pembelian, status, created_at 
                  FROM tabel_spk 
                  WHERE sales_account_id = ? 
                  ORDER BY id DESC";
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
            $row['nominal_jt'] = round($row['nominal'] / 1000000);
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
    }
} elseif ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    
    $action = $payload['action'] ?? $_POST['action'] ?? 'submit';

    if ($action === 'submit') {
        $sales_id = isset($payload['sales_account_id']) ? intval($payload['sales_account_id']) : (isset($_POST['sales_account_id']) ? intval($_POST['sales_account_id']) : 1);
        $nama = $payload['nama_customer'] ?? $_POST['nama_customer'] ?? '';
        $hp = $payload['no_hp'] ?? $_POST['no_hp'] ?? '';
        $model = $payload['model'] ?? $_POST['model'] ?? '';
        $tipe_pembelian = $payload['tipe_pembelian'] ?? $_POST['tipe_pembelian'] ?? 'Kredit';
        
        $nominal = isset($payload['nominal']) ? intval($payload['nominal']) : (isset($_POST['nominal']) ? intval($_POST['nominal']) : 0);
        if ($nominal == 0) {
            if (stripos($model, 'avanza') !== false) $nominal = 285000000;
            elseif (stripos($model, 'calya') !== false) $nominal = 185000000;
            elseif (stripos($model, 'raize') !== false) $nominal = 248000000;
            else $nominal = 312000000;
        }

        if (empty($nama) || empty($hp) || empty($model)) {
            echo json_encode(["status" => "error", "message" => "Nama customer, No HP, dan Model mobil harus diisi."]);
            exit;
        }

        $jenis_input = $payload['jenis_input'] ?? $_POST['jenis_input'] ?? 'SPK';
        $status = ($jenis_input === 'DO') ? 'Disetujui' : 'Menunggu';

        $query = "INSERT INTO tabel_spk (sales_account_id, nama_customer, no_hp, model, nominal, tipe_pembelian, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("isssiss", $sales_id, $nama, $hp, $model, $nominal, $tipe_pembelian, $status);
            if ($stmt->execute()) {
                $spk_id = $stmt->insert_id;
                
                if ($jenis_input === 'DO') {
                    // Masukkan ke transaksi_do
                    $tgl = date('Y-m-d');
                    $check_do = $conn->query("SELECT id_transaksi FROM transaksi_do WHERE sales_account_id = $sales_id AND nama_customer = '$nama' AND tipe_mobil = '$model'");
                    if ($check_do && $check_do->num_rows === 0) {
                        $conn->query("INSERT INTO transaksi_do (sales_account_id, nama_customer, tipe_mobil, tanggal_do, status_do) VALUES ($sales_id, '$nama', '$model', '$tgl', 'Selesai')");
                    }
                    
                    // Potong stok mobil di inventory
                    $first_word = explode(' ', trim($model))[0];
                    $first_word_esc = $conn->real_escape_string($first_word);
                    $conn->query("UPDATE tabel_inventory SET stok = GREATEST(0, stok - 1), status = IF(stok - 1 <= 0, 'Inden / Kosong', status) WHERE (LOWER(model) LIKE LOWER('%$first_word_esc%') OR LOWER(varian) LIKE LOWER('%$first_word_esc%')) AND stok > 0 ORDER BY id ASC LIMIT 1");
                    $conn->query("UPDATE stock_inventory_essential SET availability_status = 'Sold' WHERE (LOWER(product_description) LIKE LOWER('%$first_word_esc%')) AND LOWER(availability_status) = 'available' ORDER BY id ASC LIMIT 1");
                    
                    // Notifikasi DO
                    $notif_title = "DO Baru — " . $nama;
                    $notif_body = "Sales mencatatkan DO baru untuk unit " . $model . " seharga " . round($nominal / 1000000) . " Jt.";
                    $notif_query = "INSERT INTO tabel_notifikasi (sales_account_id, title, body, time_label, status_icon) VALUES (?, ?, ?, 'Baru saja', 'truck-ramp-box')";
                } else {
                    // Notifikasi SPK
                    $notif_title = "SPK Baru — " . $nama;
                    $notif_body = "Sales mengajukan SPK unit " . $model . " seharga " . round($nominal / 1000000) . " Jt (" . $tipe_pembelian . ").";
                    $notif_query = "INSERT INTO tabel_notifikasi (sales_account_id, title, body, time_label, status_icon) VALUES (?, ?, ?, 'Baru saja', 'check-to-slot')";
                }
                
                $n_stmt = $conn->prepare($notif_query);
                if ($n_stmt) {
                    $n_stmt->bind_param("iss", $sales_id, $notif_title, $notif_body);
                    $n_stmt->execute();
                    $n_stmt->close();
                }

                // Auto Push ke Google Spreadsheet jika Webhook terhubung
                $tambah_spk = ($jenis_input === 'SPK') ? 1 : 0;
                $tambah_do = ($jenis_input === 'DO') ? 1 : 0;
                triggerSheetsPush($conn, $sales_id, $tambah_spk, $tambah_do);

                $msg = ($jenis_input === 'DO') ? "DO berhasil ditambahkan!" : "SPK berhasil diajukan ke Supervisor!";
                echo json_encode(["status" => "success", "message" => $msg, "id" => $spk_id]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } elseif ($action === 'convert_to_do') {
        $spk_id = $payload['spk_id'] ?? intval($_POST['spk_id']);
        
        if ($spk_id == 0) {
            echo json_encode(["status" => "error", "message" => "Parameter tidak valid."]);
            exit;
        }

        $query = "UPDATE tabel_spk SET status = 'DO' WHERE id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("i", $spk_id);
            if ($stmt->execute()) {
                // Ambil data SPK
                $q_data = $conn->query("SELECT s.sales_account_id, s.nama_customer, s.model, s.nominal FROM tabel_spk s WHERE s.id = $spk_id");
                if ($q_data && $q_data->num_rows > 0) {
                    $spk_row = $q_data->fetch_assoc();
                    $s_id = intval($spk_row['sales_account_id']);
                    $cust = $conn->real_escape_string($spk_row['nama_customer']);
                    $model = $conn->real_escape_string($spk_row['model']);
                    $nominal = intval($spk_row['nominal']);
                    $tgl = date('Y-m-d');
                    
                    // Masukkan ke transaksi_do jika belum ada
                    $check_do = $conn->query("SELECT id_transaksi FROM transaksi_do WHERE sales_account_id = $s_id AND nama_customer = '$cust' AND tipe_mobil = '$model'");
                    if ($check_do && $check_do->num_rows === 0) {
                        $conn->query("INSERT INTO transaksi_do (sales_account_id, nama_customer, tipe_mobil, tanggal_do, status_do) VALUES ($s_id, '$cust', '$model', '$tgl', 'Selesai')");
                    }

                    // Potong stok mobil di inventory
                    $first_word = explode(' ', trim($model))[0];
                    $first_word_esc = $conn->real_escape_string($first_word);
                    $conn->query("UPDATE tabel_inventory SET stok = GREATEST(0, stok - 1), status = IF(stok - 1 <= 0, 'Inden / Kosong', status) WHERE (LOWER(model) LIKE LOWER('%$first_word_esc%') OR LOWER(varian) LIKE LOWER('%$first_word_esc%')) AND stok > 0 ORDER BY id ASC LIMIT 1");
                    $conn->query("UPDATE stock_inventory_essential SET availability_status = 'Sold' WHERE (LOWER(product_description) LIKE LOWER('%$first_word_esc%')) AND LOWER(availability_status) = 'available' ORDER BY id ASC LIMIT 1");

                    // Notifikasi DO
                    $notif_title = "DO Baru — " . $cust;
                    $notif_body = "Sales mencatatkan DO baru untuk unit " . $model . " seharga " . round($nominal / 1000000) . " Jt.";
                    $notif_query = "INSERT INTO tabel_notifikasi (sales_account_id, title, body, time_label, status_icon) VALUES (?, ?, ?, 'Baru saja', 'truck-ramp-box')";
                    $n_stmt = $conn->prepare($notif_query);
                    if ($n_stmt) {
                        $n_stmt->bind_param("iss", $s_id, $notif_title, $notif_body);
                        $n_stmt->execute();
                        $n_stmt->close();
                    }

                    // Auto Push DO ke Google Spreadsheet
                    triggerSheetsPush($conn, $s_id, 0, 1);
                }
                echo json_encode(["status" => "success", "message" => "SPK berhasil dikonversi menjadi DO (Disetujui)."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal mengkonversi SPK ke DO: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } elseif ($action === 'spv_approve') {
        $spk_id = isset($payload['spk_id']) ? intval($payload['spk_id']) : (isset($_POST['spk_id']) ? intval($_POST['spk_id']) : 0);
        $status = $payload['status'] ?? $_POST['status'] ?? ''; // Disetujui / Ditolak

        if ($spk_id == 0 || !in_array($status, ['Disetujui', 'Ditolak'])) {
            echo json_encode(["status" => "error", "message" => "Parameter tidak valid."]);
            exit;
        }

        $query = "UPDATE tabel_spk SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("si", $status, $spk_id);
            if ($stmt->execute()) {
                if ($status === 'Disetujui') {
                    // Ambil data SPK untuk diinput otomatis ke transaksi_do
                    $q_data = $conn->query("SELECT s.sales_account_id, s.nama_customer, s.model, sa.no_hp as hp_sales FROM tabel_spk s LEFT JOIN sales_accounts sa ON s.sales_account_id = sa.id WHERE s.id = $spk_id");
                    if ($q_data && $q_data->num_rows > 0) {
                        $spk_row = $q_data->fetch_assoc();
                        $s_id = intval($spk_row['sales_account_id']);
                        $cust = $conn->real_escape_string($spk_row['nama_customer']);
                        $model = $conn->real_escape_string($spk_row['model']);
                        $hp_sales = $spk_row['hp_sales']; // get sales phone number
                        $tgl = date('Y-m-d');
                        // Masukkan ke transaksi_do jika belum ada
                        $check_do = $conn->query("SELECT id_transaksi FROM transaksi_do WHERE sales_account_id = $s_id AND nama_customer = '$cust' AND tipe_mobil = '$model'");
                        if ($check_do && $check_do->num_rows === 0) {
                            $conn->query("INSERT INTO transaksi_do (sales_account_id, nama_customer, tipe_mobil, tanggal_do, status_do) VALUES ($s_id, '$cust', '$model', '$tgl', 'Selesai')");
                        }

                        // POTONG STOK MOBIL DI INVENTORY KETIKA SPK DISETUJUI
                        $first_word = explode(' ', trim($model))[0];
                        $first_word_esc = $conn->real_escape_string($first_word);
                        $conn->query("UPDATE tabel_inventory SET stok = GREATEST(0, stok - 1), status = IF(stok - 1 <= 0, 'Inden / Kosong', status) WHERE (LOWER(model) LIKE LOWER('%$first_word_esc%') OR LOWER(varian) LIKE LOWER('%$first_word_esc%')) AND stok > 0 ORDER BY id ASC LIMIT 1");
                        $conn->query("UPDATE stock_inventory_essential SET availability_status = 'Sold' WHERE (LOWER(product_description) LIKE LOWER('%$first_word_esc%')) AND LOWER(availability_status) = 'available' ORDER BY id ASC LIMIT 1");

                        // Kirim WA Notifikasi ke Sales
                        if (!empty($hp_sales)) {
                            $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
                            $wa_url = $scheme . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api_wa_gateway.php";
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
                echo json_encode(["status" => "success", "message" => "Status SPK berhasil diperbarui menjadi " . $status]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal memperbarui status SPK: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } elseif ($action === 'delete_spk') {
        $spk_id = isset($payload['spk_id']) ? intval($payload['spk_id']) : (isset($_POST['spk_id']) ? intval($_POST['spk_id']) : 0);

        if ($spk_id == 0) {
            echo json_encode(["status" => "error", "message" => "Parameter tidak valid."]);
            exit;
        }

        $query = "DELETE FROM tabel_spk WHERE id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt) {
            $stmt->bind_param("i", $spk_id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "SPK berhasil dihapus."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus SPK: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mempersiapkan query: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Action tidak valid."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak didukung."]);
}

$conn->close();
?>
