<?php
require_once __DIR__ . '/../public/api/koneksi.php';

echo "=== PRICELIST MOBIL MODELS ===\n";
$res = $conn->query("SELECT DISTINCT model FROM pricelist_mobil ORDER BY model ASC");
while ($r = $res->fetch_assoc()) {
    echo "- " . $r['model'] . "\n";
}

echo "\n=== TABEL BROSUR MODELS ===\n";
$res2 = $conn->query("SELECT nama, kategori FROM tabel_brosur ORDER BY kategori, nama ASC");
while ($r = $res2->fetch_assoc()) {
    echo "- [" . $r['kategori'] . "] " . $r['nama'] . "\n";
}
