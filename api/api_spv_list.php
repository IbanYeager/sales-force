<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'koneksi.php';

$spv_list = [];

// Ambil daftar nama lengkap SPV dari tabel spv_accounts
$res1 = $conn->query("SELECT nama_lengkap FROM spv_accounts WHERE nama_lengkap IS NOT NULL AND nama_lengkap != '' ORDER BY nama_lengkap ASC");
if ($res1 && $res1->num_rows > 0) {
    while ($row = $res1->fetch_assoc()) {
        $spv_list[] = $row['nama_lengkap'];
    }
}

// Ambil juga distinct nama_spv dari sales_accounts (sebagai backup jika ada SPV yang belum tercatat di spv_accounts)
$res2 = $conn->query("SELECT DISTINCT nama_spv FROM sales_accounts WHERE nama_spv IS NOT NULL AND nama_spv != ''");
if ($res2 && $res2->num_rows > 0) {
    while ($row = $res2->fetch_assoc()) {
        if (!in_array($row['nama_spv'], $spv_list)) {
            $spv_list[] = $row['nama_spv'];
        }
    }
}

// Jika daftar SPV masih kosong sama sekali, sediakan nilai default
if (empty($spv_list)) {
    $spv_list[] = "Supervisor Utama";
}

echo json_encode([
    "ok" => true,
    "data" => $spv_list
]);

$conn->close();
?>
