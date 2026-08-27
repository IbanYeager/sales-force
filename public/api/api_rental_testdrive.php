<?php
require_once __DIR__ . '/koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// REAL Pricelist 24 Jam - FR Group Braga & Astra Fleet Partners
$rentalPartners = [
    [
        "id" => "fr_group_hybrid_suv",
        "name" => "FR Group Braga (Toyota & Premium SUV Fleet)",
        "badge" => "Pricelist 24 Jam Official Partner",
        "wa_number" => "6281234567890",
        "fleet_available" => [
            ["model" => "Zenix Q Hybrid", "type" => "Hybrid Premium MPV", "rate" => "Rp 1.200.000 / 24 Jam", "plat" => "D 1888 FRG", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Zenix G Hybrid", "type" => "Hybrid MPV", "rate" => "Rp 900.000 / 24 Jam", "plat" => "D 1688 FRG", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Zenix GR Sport", "type" => "Sport Hybrid MPV", "rate" => "Rp 1.300.000 / 24 Jam", "plat" => "D 1999 FRG", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Fortuner GR", "type" => "High SUV", "rate" => "Rp 1.200.000 / 24 Jam", "plat" => "D 777 FRG", "status" => "Ready", "transmission" => "Automatic"],
            ["model" => "GR Sport (Fortuner)", "type" => "High SUV 4x4", "rate" => "Rp 1.300.000 / 24 Jam", "plat" => "D 888 FRG", "status" => "Ready", "transmission" => "Automatic"],
            ["model" => "New Camry", "type" => "Executive Hybrid Sedan", "rate" => "Rp 2.000.000 / 24 Jam", "plat" => "D 1 FRG", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Innova Reborn", "type" => "Family MPV", "rate" => "Rp 650.000 / 24 Jam", "plat" => "D 1555 FRG", "status" => "Ready", "transmission" => "Automatic"],
            ["model" => "Veloz Q", "type" => "Modern MPV", "rate" => "Rp 500.000 / 24 Jam", "plat" => "D 1234 FRG", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "Avanza TSS", "type" => "Popular MPV TSS", "rate" => "Rp 450.000 / 24 Jam", "plat" => "D 1111 FRG", "status" => "Ready", "transmission" => "CVT Automatic"]
        ]
    ],
    [
        "id" => "fr_group_compact_multimerk",
        "name" => "FR Group Braga (Multi-Brand & Offroad Fleet)",
        "badge" => "Pricelist 24 Jam Official Partner",
        "wa_number" => "6281987654321",
        "fleet_available" => [
            ["model" => "Brio", "type" => "City Hatchback", "rate" => "Rp 350.000 / 24 Jam", "plat" => "D 350 FRG", "status" => "Ready", "transmission" => "Automatic"],
            ["model" => "Stargazer Essential", "type" => "Modern MPV", "rate" => "Rp 500.000 / 24 Jam", "plat" => "D 500 FRG", "status" => "Ready", "transmission" => "IVT Automatic"],
            ["model" => "Stargazer Prime", "type" => "Prime MPV", "rate" => "Rp 550.000 / 24 Jam", "plat" => "D 550 FRG", "status" => "Ready", "transmission" => "IVT Automatic"],
            ["model" => "Xpander", "type" => "Crossover MPV", "rate" => "Rp 550.000 / 24 Jam", "plat" => "D 551 FRG", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "City Hatchback", "type" => "Sporty Hatchback", "rate" => "Rp 600.000 / 24 Jam", "plat" => "D 600 FRG", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "HR-V Panoramic", "type" => "Panoramic SUV", "rate" => "Rp 800.000 / 24 Jam", "plat" => "D 800 FRG", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "Jimny 3 Doors", "type" => "Iconic 4x4 Mini SUV", "rate" => "Rp 1.200.000 / 24 Jam", "plat" => "D 333 FRG", "status" => "Ready", "transmission" => "Automatic 4x4"],
            ["model" => "Pajero Sport", "type" => "High SUV", "rate" => "Rp 1.300.000 / 24 Jam", "plat" => "D 1300 FRG", "status" => "Ready", "transmission" => "Automatic"],
            ["model" => "Ranger 4x4", "type" => "Double Cabin Pickup 4x4", "rate" => "Rp 600.000 / 24 Jam", "plat" => "D 601 FRG", "status" => "Ready", "transmission" => "Manual 4x4"],
            ["model" => "BMW M4320i", "type" => "Luxury Sport Coupe", "rate" => "Rp 8.000.000 / 24 Jam", "plat" => "D 8888 FRG", "status" => "Ready", "transmission" => "Steptronic Automatic"]
        ]
    ],
    [
        "id" => "fr_group_all_in_driver",
        "name" => "FR Group Luxury & Commercial (All-in Driver + BBM)",
        "badge" => "All-in Driver & BBM Dalam Kota",
        "wa_number" => "6281112223334",
        "fleet_available" => [
            ["model" => "Alphard Hybrid", "type" => "Luxury Hybrid MPV", "rate" => "Rp 3.500.000 / 24 Jam (All-in)", "plat" => "D 3500 FRG", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Alphard Transformer", "type" => "Luxury MPV VIP", "rate" => "Rp 2.500.000 / 24 Jam (All-in)", "plat" => "D 2500 FRG", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "Land Cruiser", "type" => "Ultra Luxury SUV 4x4", "rate" => "Rp 15.000.000 / 24 Jam (All-in)", "plat" => "D 15000 FRG", "status" => "Ready", "transmission" => "10-Speed Automatic"],
            ["model" => "Hiace Premio", "type" => "Executive Commercial Van", "rate" => "Rp 1.500.000 / 24 Jam (All-in)", "plat" => "D 1501 FRG", "status" => "Ready", "transmission" => "Manual"],
            ["model" => "Hiace Commuter", "type" => "Passenger Commercial Van", "rate" => "Rp 1.200.000 / 24 Jam (All-in)", "plat" => "D 1201 FRG", "status" => "Ready", "transmission" => "Manual"]
        ]
    ],
    [
        "id" => "trac",
        "name" => "TRAC Astra Rent a Car (Bandung Branch)",
        "badge" => "Official Astra Fleet Partner",
        "wa_number" => "6281234567890",
        "fleet_available" => [
            ["model" => "Innova Zenix 2.0 V HEV Modelista", "type" => "Hybrid MPV", "rate" => "Rp 1.100.000 / 24 Jam", "plat" => "D 1888 TRC", "status" => "Ready", "transmission" => "CVT Automatic"],
            ["model" => "Fortuner 2.8 VRZ GR Sport 4x4", "type" => "High SUV", "rate" => "Rp 1.250.000 / 24 Jam", "plat" => "D 777 TRC", "status" => "Ready", "transmission" => "6-Speed Automatic"],
            ["model" => "Yaris Cross 1.5 S HEV GR Sport", "type" => "Compact Hybrid SUV", "rate" => "Rp 750.000 / 24 Jam", "plat" => "D 555 TRC", "status" => "Ready", "transmission" => "CVT Automatic"]
        ]
    ],
    [
        "id" => "kinto",
        "name" => "KINTO One Fleet Service (Toyota Astra Financial)",
        "badge" => "Official Subscription & Rental Partner",
        "wa_number" => "6281987654321",
        "fleet_available" => [
            ["model" => "Alphard 2.5 HEV Executive Lounge", "type" => "Luxury MPV HEV", "rate" => "Rp 3.200.000 / 24 Jam", "plat" => "D 1 KNT", "status" => "Ready", "transmission" => "e-CVT Automatic"],
            ["model" => "Corolla Cross 1.8 HEV GR Sport", "type" => "Crossover HEV", "rate" => "Rp 850.000 / 24 Jam", "plat" => "D 999 KNT", "status" => "Ready", "transmission" => "e-CVT Automatic"]
        ]
    ]
];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'all';
    $sales_id = intval($_GET['sales_id'] ?? 0);

    $sql = "SELECT * FROM tabel_rental_testdrive";
    if ($sales_id > 0) {
        $sql .= " WHERE sales_account_id = $sales_id";
    }
    $sql .= " ORDER BY created_at DESC LIMIT 50";

    $bookings = [];
    try {
        $res = $conn->query($sql);
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $bookings[] = $row;
            }
        }
    } catch (Throwable $e) {}

    echo json_encode([
        "status" => "success",
        "partners" => $rentalPartners,
        "bookings" => $bookings
    ]);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    $sales_account_id = intval($data['sales_account_id'] ?? 7);
    $nama_sales = $conn->real_escape_string(trim($data['nama_sales'] ?? 'Sales Consultant'));
    $nama_customer = $conn->real_escape_string(trim($data['nama_customer'] ?? ''));
    $no_hp_customer = $conn->real_escape_string(trim($data['no_hp_customer'] ?? ''));
    $mitra_rental = $conn->real_escape_string(trim($data['mitra_rental'] ?? 'FR Group Braga (Toyota & Premium SUV Fleet)'));
    $model_unit = $conn->real_escape_string(trim($data['model_unit'] ?? ''));
    $durasi = $conn->real_escape_string(trim($data['durasi'] ?? '1 Hari (24 Jam)'));
    $tanggal_testdrive = $conn->real_escape_string(trim($data['tanggal_testdrive'] ?? date('Y-m-d H:i:s')));
    $lokasi_penjemputan = $conn->real_escape_string(trim($data['lokasi_penjemputan'] ?? 'Showroom Tunas Toyota Kiara Condong'));
    $alasan_pengajuan = $conn->real_escape_string(trim($data['alasan_pengajuan'] ?? 'Unit Showroom Kosong / VIP Customer Trial'));

    if (empty($nama_customer) || empty($model_unit)) {
        echo json_encode(["status" => "error", "message" => "Nama Konsumen dan Model Unit Test Drive wajib diisi!"]);
        exit();
    }

    $plat_nomor = "D " . rand(1000, 9999) . " FRG";
    $status = "Menunggu Konfirmasi";
    $catatan_mitra = "Pengajuan armada rental 24 Jam telah diteruskan ke tim operasional FR Group.";

    $stmt = $conn->prepare("INSERT INTO tabel_rental_testdrive 
        (sales_account_id, nama_sales, nama_customer, no_hp_customer, mitra_rental, model_unit, plat_nomor, durasi, tanggal_testdrive, lokasi_penjemputan, alasan_pengajuan, status, catatan_mitra) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("issssssssssss", 
        $sales_account_id, $nama_sales, $nama_customer, $no_hp_customer, 
        $mitra_rental, $model_unit, $plat_nomor, $durasi, 
        $tanggal_testdrive, $lokasi_penjemputan, $alasan_pengajuan, $status, $catatan_mitra
    );

    if ($stmt->execute()) {
        $new_id = $stmt->insert_id;

        // Generate WA Confirmation Dispatch text for Sales
        $wa_text = "🚗 *PENGAJUAN UNIT RENTAL TEST DRIVE (FR GROUP / PARTNER)* 📋\n"
                 . "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                 . "Kepada Tim Armada: *{$mitra_rental}*\n\n"
                 . "Halo, mohon bantuan konfirmasi ketersediaan armada Test Drive dengan rincian berikut:\n\n"
                 . "👤 *Sales Consultant*: {$nama_sales}\n"
                 . "👥 *Nama Konsumen*: {$nama_customer}\n"
                 . "📞 *No. Telp Konsumen*: {$no_hp_customer}\n"
                 . "🚘 *Model Unit*: {$model_unit}\n"
                 . "⏱️ *Durasi Trial*: {$durasi}\n"
                 . "📅 *Jadwal*: {$tanggal_testdrive}\n"
                 . "📍 *Lokasi*: {$lokasi_penjemputan}\n"
                 . "💡 *Kebutuhan/Alasan*: {$alasan_pengajuan}\n\n"
                 . "Mohon dikonfirmasi ketersediaan unit armada. Terima kasih! 🙏";

        echo json_encode([
            "status" => "success",
            "message" => "Pengajuan unit test drive rekanan rental berhasil dikirim!",
            "id" => $new_id,
            "wa_link" => "https://api.whatsapp.com/send?text=" . urlencode($wa_text)
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan pengajuan: " . $conn->error]);
    }
    exit();
}
