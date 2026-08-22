<?php
require __DIR__ . '/koneksi.php';

echo "Memeriksa tabel spv_accounts di database ($db)...\n";
$cols = [];
$res = $conn->query("SHOW COLUMNS FROM spv_accounts");
while ($r = $res->fetch_assoc()) {
    $cols[] = $r['Field'];
}

if (!in_array('last_active', $cols)) {
    echo "Menambahkan kolom last_active ke spv_accounts...\n";
    $conn->query("ALTER TABLE spv_accounts ADD COLUMN last_active DATETIME DEFAULT NULL");
} else {
    echo "Kolom last_active sudah ada di spv_accounts.\n";
}

if (!in_array('is_online', $cols)) {
    echo "Menambahkan kolom is_online ke spv_accounts...\n";
    $conn->query("ALTER TABLE spv_accounts ADD COLUMN is_online TINYINT(1) DEFAULT 0");
} else {
    echo "Kolom is_online sudah ada di spv_accounts.\n";
}

echo "SUKSES! spv_accounts siap untuk online tracking.\n";
