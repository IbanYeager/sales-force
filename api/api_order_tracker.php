<?php
require_once 'koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-create table if not exists
if ($conn instanceof mysqli) {
    $createTableQuery = "CREATE TABLE IF NOT EXISTS tabel_order_tracker (
        id INT AUTO_INCREMENT PRIMARY KEY,
        no_spk VARCHAR(50) NOT NULL UNIQUE,
        nama_customer VARCHAR(150) NOT NULL,
        no_hp VARCHAR(30) NOT NULL,
        model_unit VARCHAR(150) NOT NULL,
        warna_unit VARCHAR(100) DEFAULT '',
        metode_pembayaran VARCHAR(50) DEFAULT 'Kredit',
        leasing VARCHAR(100) DEFAULT 'TAF / Toyota Astra Finance',
        no_rangka VARCHAR(100) DEFAULT '',
        no_mesin VARCHAR(100) DEFAULT '',
        no_polisi_sementara VARCHAR(50) DEFAULT '',
        tahap_progres INT DEFAULT 1,
        estimasi_delivery DATE,
        sales_name VARCHAR(100) DEFAULT 'Indra Gunawan',
        sales_phone VARCHAR(30) DEFAULT '08122334455',
        catatan_terakhir TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    @$conn->query($createTableQuery);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $spk = $_GET['spk'] ?? '';
    $id = intval($_GET['id'] ?? 0);

    if (!empty($spk) || $id > 0) {
        if ($conn instanceof mysqli) {
            $where = $id > 0 ? "id = $id" : "no_spk = '" . $conn->real_escape_string($spk) . "'";
            $res = $conn->query("SELECT * FROM tabel_order_tracker WHERE $where LIMIT 1");
            if ($res && $row = $res->fetch_assoc()) {
                echo json_encode(["status" => "success", "data" => $row]);
                exit();
            }
        }
        // Fallback default mock jika DB belum memiliki data
        echo json_encode([
            "status" => "success",
            "data" => [
                "id" => 1,
                "no_spk" => $spk ?: "SPK-2026-08-019",
                "nama_customer" => "Budi Santoso, S.T.",
                "no_hp" => "08123456789",
                "model_unit" => "All New Kijang Innova Zenix 2.0 V Hybrid Modellista",
                "warna_unit" => "Platinum White Pearl",
                "metode_pembayaran" => "Kredit (DP 30%)",
                "leasing" => "TAF (Toyota Astra Financial Services)",
                "no_rangka" => "MHFV1234567890",
                "no_mesin" => "M20A-FXS-987654",
                "no_polisi_sementara" => "D 1928 TNS",
                "tahap_progres" => 4,
                "estimasi_delivery" => date('Y-m-d', strtotime('+3 days')),
                "sales_name" => "Indra Gunawan",
                "sales_phone" => "08122334455",
                "catatan_terakhir" => "Unit telah selesai inspeksi PDI & pemasangan Kaca Film 3M + Karpet Dasar TCO. Menunggu proses cetak STNK / Plat.",
                "created_at" => date('Y-m-d H:i:s', strtotime('-5 days')),
                "updated_at" => date('Y-m-d H:i:s')
            ]
        ]);
        exit();
    }

    // List all
    $list = [];
    if ($conn instanceof mysqli) {
        $res = $conn->query("SELECT * FROM tabel_order_tracker ORDER BY updated_at DESC LIMIT 50");
        if ($res) {
            while ($r = $res->fetch_assoc()) {
                $list[] = $r;
            }
        }
    }

    if (empty($list)) {
        $list = [
            [
                "id" => 1,
                "no_spk" => "SPK-2026-08-019",
                "nama_customer" => "Budi Santoso, S.T.",
                "no_hp" => "08123456789",
                "model_unit" => "All New Kijang Innova Zenix 2.0 V Hybrid Modellista",
                "warna_unit" => "Platinum White Pearl",
                "tahap_progres" => 4,
                "estimasi_delivery" => date('Y-m-d', strtotime('+3 days')),
                "sales_name" => "Indra Gunawan",
                "catatan_terakhir" => "Selesai PDI & Pemasangan Aksesoris TCO."
            ],
            [
                "id" => 2,
                "no_spk" => "SPK-2026-08-024",
                "nama_customer" => "Ibu Rina Kartika",
                "no_hp" => "08567891234",
                "model_unit" => "All New Yaris Cross 1.5 S Hybrid GR Sport",
                "warna_unit" => "Attitude Black Metallic",
                "tahap_progres" => 2,
                "estimasi_delivery" => date('Y-m-d', strtotime('+7 days')),
                "sales_name" => "Indra Gunawan",
                "catatan_terakhir" => "Berkas PO Leasing BCA Finance disetujui, menunggu jadwal alokasi unit."
            ],
            [
                "id" => 3,
                "no_spk" => "SPK-2026-08-008",
                "nama_customer" => "PT. Makmur Abadi Logistik",
                "no_hp" => "08198765432",
                "model_unit" => "Toyota Hilux Rangga Flat Deck Cab",
                "warna_unit" => "Super White",
                "tahap_progres" => 6,
                "estimasi_delivery" => date('Y-m-d', strtotime('-1 day')),
                "sales_name" => "Indra Gunawan",
                "catatan_terakhir" => "Unit telah diterima konsumen di lokasi (Serah Terima Selesai)."
            ]
        ];
    }

    echo json_encode(["status" => "success", "data" => $list]);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $action = $data['action'] ?? 'update_milestone';

    if ($action === 'create') {
        $no_spk = $conn ? $conn->real_escape_string($data['no_spk'] ?? '') : ($data['no_spk'] ?? '');
        $nama_customer = $conn ? $conn->real_escape_string($data['nama_customer'] ?? '') : ($data['nama_customer'] ?? '');
        $no_hp = $conn ? $conn->real_escape_string($data['no_hp'] ?? '') : ($data['no_hp'] ?? '');
        $model_unit = $conn ? $conn->real_escape_string($data['model_unit'] ?? '') : ($data['model_unit'] ?? '');
        $warna_unit = $conn ? $conn->real_escape_string($data['warna_unit'] ?? '') : ($data['warna_unit'] ?? '');
        $metode_pembayaran = $conn ? $conn->real_escape_string($data['metode_pembayaran'] ?? 'Kredit') : ($data['metode_pembayaran'] ?? 'Kredit');
        $leasing = $conn ? $conn->real_escape_string($data['leasing'] ?? 'TAF') : ($data['leasing'] ?? 'TAF');
        $estimasi_delivery = $conn ? $conn->real_escape_string($data['estimasi_delivery'] ?? date('Y-m-d', strtotime('+5 days'))) : ($data['estimasi_delivery'] ?? date('Y-m-d', strtotime('+5 days')));
        $sales_name = $conn ? $conn->real_escape_string($data['sales_name'] ?? 'Indra Gunawan') : ($data['sales_name'] ?? 'Indra Gunawan');
        $sales_phone = $conn ? $conn->real_escape_string($data['sales_phone'] ?? '08122334455') : ($data['sales_phone'] ?? '08122334455');
        $catatan_terakhir = $conn ? $conn->real_escape_string($data['catatan_terakhir'] ?? 'SPK berhasil dibuat, menunggu proses approval leasing.') : ($data['catatan_terakhir'] ?? '');

        if ($conn instanceof mysqli) {
            $sql = "INSERT INTO tabel_order_tracker (no_spk, nama_customer, no_hp, model_unit, warna_unit, metode_pembayaran, leasing, tahap_progres, estimasi_delivery, sales_name, sales_phone, catatan_terakhir)
                    VALUES ('$no_spk', '$nama_customer', '$no_hp', '$model_unit', '$warna_unit', '$metode_pembayaran', '$leasing', 1, '$estimasi_delivery', '$sales_name', '$sales_phone', '$catatan_terakhir')
                    ON DUPLICATE KEY UPDATE model_unit='$model_unit', warna_unit='$warna_unit', estimasi_delivery='$estimasi_delivery', updated_at=NOW()";
            $conn->query($sql);
        }

        echo json_encode(["status" => "success", "message" => "Tracking pesanan unit berhasil dibuat!"]);
        exit();
    }

    if ($action === 'update_milestone') {
        $id = intval($data['id'] ?? 0);
        $no_spk = $data['no_spk'] ?? '';
        $tahap_progres = intval($data['tahap_progres'] ?? 1);
        $no_rangka = $conn ? $conn->real_escape_string($data['no_rangka'] ?? '') : ($data['no_rangka'] ?? '');
        $no_mesin = $conn ? $conn->real_escape_string($data['no_mesin'] ?? '') : ($data['no_mesin'] ?? '');
        $no_polisi_sementara = $conn ? $conn->real_escape_string($data['no_polisi_sementara'] ?? '') : ($data['no_polisi_sementara'] ?? '');
        $estimasi_delivery = $conn ? $conn->real_escape_string($data['estimasi_delivery'] ?? '') : ($data['estimasi_delivery'] ?? '');
        $catatan_terakhir = $conn ? $conn->real_escape_string($data['catatan_terakhir'] ?? '') : ($data['catatan_terakhir'] ?? '');

        if ($conn instanceof mysqli) {
            $where = $id > 0 ? "id = $id" : "no_spk = '" . $conn->real_escape_string($no_spk) . "'";
            $sql = "UPDATE tabel_order_tracker SET 
                    tahap_progres = $tahap_progres,
                    no_rangka = '$no_rangka',
                    no_mesin = '$no_mesin',
                    no_polisi_sementara = '$no_polisi_sementara',
                    estimasi_delivery = '$estimasi_delivery',
                    catatan_terakhir = '$catatan_terakhir',
                    updated_at = NOW()
                    WHERE $where";
            $conn->query($sql);
        }

        echo json_encode(["status" => "success", "message" => "Tahapan progres pengiriman berhasil diperbarui!"]);
        exit();
    }
}
?>
