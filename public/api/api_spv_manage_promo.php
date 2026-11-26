<?php
// api_spv_manage_promo.php
// Kelola Paket Kredit Promo & Simulasi Tenor untuk SPV & Kepala Cabang
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'koneksi.php';

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Koneksi database tidak tersedia"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $paket = isset($_GET['paket']) ? trim($_GET['paket']) : '';
        $tenor = isset($_GET['tenor']) ? intval($_GET['tenor']) : 0;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 500;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

        $where = [];
        $params = [];
        $types = '';

        if ($search !== '') {
            $where[] = "(nama_paket LIKE ? OR tipe_mobil LIKE ? OR skema_bayar LIKE ?)";
            $like = "%{$search}%";
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $types .= 'sss';
        }

        if ($paket !== '' && strtoupper($paket) !== 'ALL') {
            $where[] = "nama_paket = ?";
            $params[] = $paket;
            $types .= 's';
        }

        if ($tenor > 0) {
            $where[] = "tenor = ?";
            $params[] = $tenor;
            $types .= 'i';
        }

        $sql = "SELECT id, nama_paket, tipe_mobil, otr, tenor, skema_bayar, angsuran_per_bulan, tbp, angsuran_terakhir, jhj, extend_2_tahun, extend_3_tahun, extend_4_tahun FROM paket_kredit";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY nama_paket ASC, tipe_mobil ASC, tenor ASC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';

        $data = [];
        if (!empty($params)) {
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param($types, ...$params);
                $stmt->execute();
                $res = $stmt->get_result();
                while ($row = $res->fetch_assoc()) {
                    $data[] = $row;
                }
                $stmt->close();
            }
        } else {
            $res = $conn->query($sql);
            if ($res) {
                while ($row = $res->fetch_assoc()) {
                    $data[] = $row;
                }
            }
        }

        // Ambil daftar unique paket
        $pakets = [];
        $resP = $conn->query("SELECT DISTINCT nama_paket FROM paket_kredit WHERE nama_paket IS NOT NULL AND nama_paket != '' ORDER BY nama_paket ASC");
        if ($resP) {
            while ($r = $resP->fetch_assoc()) {
                $pakets[] = $r['nama_paket'];
            }
        }

        // Ambil daftar unique tenor
        $tenors = [];
        $resT = $conn->query("SELECT DISTINCT tenor FROM paket_kredit WHERE tenor IS NOT NULL ORDER BY tenor ASC");
        if ($resT) {
            while ($r = $resT->fetch_assoc()) {
                $tenors[] = intval($r['tenor']);
            }
        }

        // Total count
        $total = count($data);
        $countRes = $conn->query("SELECT COUNT(*) as total FROM paket_kredit");
        $totalAll = ($countRes && $rC = $countRes->fetch_assoc()) ? intval($rC['total']) : $total;

        echo json_encode([
            "status" => "success",
            "data" => $data,
            "total_filtered" => $total,
            "total_all" => $totalAll,
            "packages" => $pakets,
            "tenors" => $tenors
        ]);
        break;

    case 'POST':
        $raw = file_get_contents("php://input");
        $input = json_decode($raw, true);
        if (!$input) $input = $_POST;

        // Check if batch import
        if (isset($input['batch']) && is_array($input['batch'])) {
            $batch = $input['batch'];
            $overwrite = !empty($input['overwrite']);
            $targetPaket = isset($input['target_paket']) ? trim($input['target_paket']) : '';

            if ($overwrite) {
                if (!empty($targetPaket)) {
                    $stmtDel = $conn->prepare("DELETE FROM paket_kredit WHERE nama_paket = ?");
                    $stmtDel->bind_param("s", $targetPaket);
                    $stmtDel->execute();
                    $stmtDel->close();
                } else if (!empty($input['overwrite_all'])) {
                    $conn->query("TRUNCATE TABLE paket_kredit");
                }
            }

            $inserted = 0;
            $stmt = $conn->prepare("INSERT INTO paket_kredit (nama_paket, tipe_mobil, otr, tenor, skema_bayar, angsuran_per_bulan, tbp, angsuran_terakhir, jhj, extend_2_tahun, extend_3_tahun, extend_4_tahun) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            foreach ($batch as $item) {
                $nama_paket = trim($item['nama_paket'] ?? $targetPaket);
                $tipe_mobil = trim($item['tipe_mobil'] ?? '');
                $otr = intval($item['otr'] ?? 0);
                $tenor = intval($item['tenor'] ?? 12);
                $skema_bayar = trim($item['skema_bayar'] ?? 'REGULER');
                $angsuran_per_bulan = intval($item['angsuran_per_bulan'] ?? 0);
                $tbp = intval($item['tbp'] ?? 0);
                $angsuran_terakhir = intval($item['angsuran_terakhir'] ?? 0);
                $jhj = strval($item['jhj'] ?? '0');
                $extend_2_tahun = strval($item['extend_2_tahun'] ?? '0');
                $extend_3_tahun = strval($item['extend_3_tahun'] ?? '0');
                $extend_4_tahun = strval($item['extend_4_tahun'] ?? '0');

                if (!empty($nama_paket) && !empty($tipe_mobil)) {
                    $stmt->bind_param(
                        "ssiisiiissss",
                        $nama_paket,
                        $tipe_mobil,
                        $otr,
                        $tenor,
                        $skema_bayar,
                        $angsuran_per_bulan,
                        $tbp,
                        $angsuran_terakhir,
                        $jhj,
                        $extend_2_tahun,
                        $extend_3_tahun,
                        $extend_4_tahun
                    );
                    if ($stmt->execute()) {
                        $inserted++;
                    }
                }
            }
            $stmt->close();

            echo json_encode([
                "status" => "success",
                "message" => "Berhasil mengimpor {$inserted} baris data promo"
            ]);
            break;
        }

        // Single insert
        $nama_paket = trim($input['nama_paket'] ?? '');
        $tipe_mobil = trim($input['tipe_mobil'] ?? '');
        $otr = intval($input['otr'] ?? 0);
        $tenor = intval($input['tenor'] ?? 12);
        $skema_bayar = trim($input['skema_bayar'] ?? 'REGULER');
        $angsuran_per_bulan = intval($input['angsuran_per_bulan'] ?? 0);
        $tbp = intval($input['tbp'] ?? 0);
        $angsuran_terakhir = intval($input['angsuran_terakhir'] ?? 0);
        $jhj = strval($input['jhj'] ?? '0');
        $extend_2_tahun = strval($input['extend_2_tahun'] ?? '0');
        $extend_3_tahun = strval($input['extend_3_tahun'] ?? '0');
        $extend_4_tahun = strval($input['extend_4_tahun'] ?? '0');

        if (empty($nama_paket) || empty($tipe_mobil) || $tenor <= 0) {
            echo json_encode(["status" => "error", "message" => "Nama Paket, Tipe Mobil, dan Tenor wajib diisi"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO paket_kredit (nama_paket, tipe_mobil, otr, tenor, skema_bayar, angsuran_per_bulan, tbp, angsuran_terakhir, jhj, extend_2_tahun, extend_3_tahun, extend_4_tahun) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssiisiiissss",
            $nama_paket,
            $tipe_mobil,
            $otr,
            $tenor,
            $skema_bayar,
            $angsuran_per_bulan,
            $tbp,
            $angsuran_terakhir,
            $jhj,
            $extend_2_tahun,
            $extend_3_tahun,
            $extend_4_tahun
        );

        if ($stmt->execute()) {
            $newId = $stmt->insert_id;
            echo json_encode(["status" => "success", "message" => "Data promo berhasil ditambahkan", "id" => $newId]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        $raw = file_get_contents("php://input");
        $input = json_decode($raw, true);
        if (!$input) $input = $_POST;

        $id = intval($input['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(["status" => "error", "message" => "ID promo tidak valid"]);
            exit;
        }

        $nama_paket = trim($input['nama_paket'] ?? '');
        $tipe_mobil = trim($input['tipe_mobil'] ?? '');
        $otr = intval($input['otr'] ?? 0);
        $tenor = intval($input['tenor'] ?? 12);
        $skema_bayar = trim($input['skema_bayar'] ?? 'REGULER');
        $angsuran_per_bulan = intval($input['angsuran_per_bulan'] ?? 0);
        $tbp = intval($input['tbp'] ?? 0);
        $angsuran_terakhir = intval($input['angsuran_terakhir'] ?? 0);
        $jhj = strval($input['jhj'] ?? '0');
        $extend_2_tahun = strval($input['extend_2_tahun'] ?? '0');
        $extend_3_tahun = strval($input['extend_3_tahun'] ?? '0');
        $extend_4_tahun = strval($input['extend_4_tahun'] ?? '0');

        $stmt = $conn->prepare("UPDATE paket_kredit SET nama_paket = ?, tipe_mobil = ?, otr = ?, tenor = ?, skema_bayar = ?, angsuran_per_bulan = ?, tbp = ?, angsuran_terakhir = ?, jhj = ?, extend_2_tahun = ?, extend_3_tahun = ?, extend_4_tahun = ? WHERE id = ?");
        $stmt->bind_param(
            "ssiisiiissssi",
            $nama_paket,
            $tipe_mobil,
            $otr,
            $tenor,
            $skema_bayar,
            $angsuran_per_bulan,
            $tbp,
            $angsuran_terakhir,
            $jhj,
            $extend_2_tahun,
            $extend_3_tahun,
            $extend_4_tahun,
            $id
        );

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Data promo berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $raw = file_get_contents("php://input");
        $input = json_decode($raw, true);
        if (!$input) $input = $_GET;

        $id = intval($input['id'] ?? 0);
        $targetPaket = isset($input['nama_paket']) ? trim($input['nama_paket']) : '';
        $action = isset($input['action']) ? trim($input['action']) : '';

        if ($action === 'delete_package' && !empty($targetPaket)) {
            $stmt = $conn->prepare("DELETE FROM paket_kredit WHERE nama_paket = ?");
            $stmt->bind_param("s", $targetPaket);
            if ($stmt->execute()) {
                $affected = $stmt->affected_rows;
                echo json_encode(["status" => "success", "message" => "Berhasil menghapus seluruh paket ({$affected} baris)"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus paket: " . $stmt->error]);
            }
            $stmt->close();
        } else if ($id > 0) {
            $stmt = $conn->prepare("DELETE FROM paket_kredit WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Data promo berhasil dihapus"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Parameter ID atau paket tidak valid"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

$conn->close();
?>
