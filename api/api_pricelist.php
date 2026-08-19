<?php
// Set header agar output dibaca sebagai JSON dan mengizinkan request API
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Panggil koneksi database
require_once 'koneksi.php';

$dataMobil = [];
$sql = "SELECT * FROM pricelist_mobil ORDER BY order_type ASC, model ASC, type ASC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    // We will aggregate rows with the same order_type, model, and type
    // Because the new schema splits MT and AT into separate rows.
    $aggregated = [];
    
    while ($row = $result->fetch_assoc()) {
        $order_type = trim($row['order_type'] ?? '');
        $model = trim($row['model'] ?? '');
        $type = trim($row['type'] ?? '');
        
        $key = $order_type . '|' . $model . '|' . $type;
        
        if (!isset($aggregated[$key])) {
            $aggregated[$key] = [
                'order_type' => $order_type,
                'model' => $model,
                'type' => $type,
                'harga_mt' => 0,
                'harga_at' => 0,
                'kode_tipe_mt' => '',
                'kode_tipe_at' => '',
                'additional_mt' => '',
                'additional_at' => '',
                'accessories_mt' => '',
                'accessories_at' => '',
                'gambar' => isset($row['gambar']) ? $row['gambar'] : '' // handle if gambar doesn't exist in new schema
            ];
        }
        
        $trans = trim($row['transmission'] ?? '');
        $price = (int)$row['pricelist'];
        $kode_tipe = trim($row['kode_tipe'] ?? '');
        $additional = trim($row['additional'] ?? '');
        $accessories = trim($row['accessories'] ?? '');
        
        if (strtoupper($trans) === 'M/T' || strtoupper($trans) === 'MT') {
            $aggregated[$key]['harga_mt'] = $price;
            $aggregated[$key]['kode_tipe_mt'] = $kode_tipe;
            $aggregated[$key]['additional_mt'] = $additional;
            $aggregated[$key]['accessories_mt'] = $accessories;
        } else if (strtoupper($trans) === 'A/T' || strtoupper($trans) === 'AT' || strtoupper($trans) === 'CVT') {
            $aggregated[$key]['harga_at'] = $price;
            $aggregated[$key]['kode_tipe_at'] = $kode_tipe;
            $aggregated[$key]['additional_at'] = $additional;
            $aggregated[$key]['accessories_at'] = $accessories;
        } else {
            // Default to MT if unknown
            $aggregated[$key]['harga_mt'] = $price;
            $aggregated[$key]['kode_tipe_mt'] = $kode_tipe;
            $aggregated[$key]['additional_mt'] = $additional;
            $aggregated[$key]['accessories_mt'] = $accessories;
        }
    }
    
    foreach ($aggregated as $key => $item) {
        $h_mt = $item['harga_mt'];
        $h_at = $item['harga_at'];
        $harga_mulai = 0;
        
        if ($h_mt > 0 && $h_at > 0) {
            $harga_mulai = min($h_mt, $h_at);
        } else if ($h_mt > 0) {
            $harga_mulai = $h_mt;
        } else if ($h_at > 0) {
            $harga_mulai = $h_at;
        }

        // Logika Gambar (Otomatis deteksi dari nama model)
        $modelClean = strtolower(trim($item['model']));
        // Ubah spasi dan karakter non-alfanumerik menjadi tanda strip (-)
        $modelClean = preg_replace('/[^a-z0-9]+/', '-', $modelClean); 
        
        $pathLocal = "../assets/img/mobil/" . $modelClean . ".webp";
        $pathUrl = "../assets/img/mobil/" . $modelClean . ".webp";

        if (!empty($item['gambar'])) {
            $urlGambar = "../assets/img/mobil/" . $item['gambar'];
        } else if (file_exists($pathLocal)) {
            $urlGambar = $pathUrl;
        } else {
            $urlGambar = "https://placehold.co/400x250/f8f9fa/c8102e?text=" . urlencode(trim($item['model']));
        }

        $dataMobil[] = [
            "kategori_order" => $item['order_type'],
            "model"          => $item['model'],
            "tipe_paket"     => $item['type'],
            "nama"           => $item['model'] . " " . $item['type'],
            "tipe"           => $item['model'],
            "harga_mt"       => $h_mt,
            "harga_at"       => $h_at,
            "kode_tipe_mt"   => $item['kode_tipe_mt'],
            "kode_tipe_at"   => $item['kode_tipe_at'],
            "additional_mt"  => $item['additional_mt'],
            "additional_at"  => $item['additional_at'],
            "accessories_mt" => $item['accessories_mt'],
            "accessories_at" => $item['accessories_at'],
            "harga"          => $harga_mulai,
            "img"            => $urlGambar
        ];
    }
}

$conn->close();

echo json_encode([
    "ok"   => true,
    "data" => $dataMobil
]);
?>