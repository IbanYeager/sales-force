<?php
// api_inventory.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require 'koneksi.php';

$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';

// 1. Ambil data penyesuaian stok dari tabel_inventory (dikelola SPV)
$spv_stocks = [];
$res_spv = $conn->query("SELECT * FROM tabel_inventory");
if ($res_spv) {
    while ($r = $res_spv->fetch_assoc()) {
        $key = strtolower(trim($r['model'] . ' ' . $r['varian']));
        $spv_stocks[$key] = [
            'stok' => intval($r['stok']),
            'status' => $r['status']
        ];
    }
}

// 2. Ambil seluruh katalog dari stock_inventory_essential
$query_ess = "SELECT * FROM stock_inventory_essential WHERE 1=1";
if (!empty($search)) {
    $query_ess .= " AND (product_description LIKE '%$search%' OR product_code LIKE '%$search%' OR color_description LIKE '%$search%')";
}
$query_ess .= " ORDER BY product_description ASC";

$res_ess = $conn->query($query_ess);
$data = [];
$matched_spv_keys = [];

if ($res_ess) {
    while ($row = $res_ess->fetch_assoc()) {
        $desc = strtolower(trim($row['product_description'] . ' ' . $row['product_code']));
        
        $status_lower = strtolower(trim($row['availability_status'] ?? ''));
        $is_available = (stripos($status_lower, 'available') !== false || $status_lower === 'tersedia');
        $stok_val = $is_available ? 1 : 0;
        $status_val = $row['availability_status'];

        foreach ($spv_stocks as $spv_key => $spv_val) {
            if (stripos($desc, $spv_key) !== false || stripos($spv_key, strtolower(trim($row['product_description']))) !== false) {
                $stok_val = $spv_val['stok'];
                if ($stok_val <= 0) {
                    $status_val = 'Inden / Kosong';
                } else {
                    $status_val = $spv_val['status'] ? $spv_val['status'] : 'Tersedia';
                }
                $matched_spv_keys[] = $spv_key;
                break;
            }
        }

        $row['stok'] = $stok_val;
        $row['stock'] = $stok_val;
        $row['availability_status'] = $status_val;
        $data[] = $row;
    }
}

// 3. Sertakan unit dari tabel_inventory yang belum ada di katalog utama
if ($res_spv) {
    $res_spv->data_seek(0);
    while ($r = $res_spv->fetch_assoc()) {
        $key = strtolower(trim($r['model'] . ' ' . $r['varian']));
        if (!in_array($key, $matched_spv_keys)) {
            $stok_val = intval($r['stok']);
            $data[] = [
                'id' => $r['id'],
                'product_description' => $r['model'] . ' ' . $r['varian'],
                'product_code' => $r['varian'],
                'color_description' => $r['warna'],
                'stok' => $stok_val,
                'stock' => $stok_val,
                'availability_status' => ($stok_val <= 0) ? 'Inden / Kosong' : ($r['status'] ? $r['status'] : 'Tersedia'),
                'chassis_no' => 'INV-' . str_pad($r['id'], 4, '0', STR_PAD_LEFT),
                'site' => 'Tunas Kiara Condong',
                'warehouse' => 'Main Stock'
            ];
        }
    }
}

echo json_encode(["status" => "success", "data" => $data]);
$conn->close();
?>
