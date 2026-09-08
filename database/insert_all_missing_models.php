<?php
require_once __DIR__ . '/../public/api/koneksi.php';

$rows = [
    // GR SUPRA (Sedan / Sports)
    ['JAWA BARAT', 'REGULAR ORDER', 'GR SUPRA', '3.0L TURBO 8-SPEED A/T', 'A/T', 'A9030AT0001', 2237600000, '3.0L Inline-6 Twin Scroll Turbo 387 PS', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'GR SUPRA', '3.0L TURBO 8-SPEED A/T', 'A/T', 'A9030AT0001', 2237600000, '3.0L Inline-6 Twin Scroll Turbo 387 PS', 'KF, LP'],

    // PRIUS (Sedan / Hybrid)
    ['JAWA BARAT', 'REGULAR ORDER', 'PRIUS', '2.0L HEV HYBRID EV', 'CVT', 'XW6020HEV01', 698000000, '2.0L 4-Silinder Hybrid EV, TSS 3.0', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'PRIUS', '2.0L HEV HYBRID EV', 'CVT', 'XW6020HEV01', 698000000, '2.0L 4-Silinder Hybrid EV, TSS 3.0', 'KF, LP'],

    // DYNA (Commercial Truck)
    ['JAWA BARAT', 'REGULAR ORDER', 'DYNA', '136 HT HI-GEAR 4X2 6 M/T', 'M/T', 'D136HTHG001', 465000000, '4.0L Turbo Diesel 136 PS Heavy Duty', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'DYNA', '136 HT 4X2 6 M/T', 'M/T', 'D136HT00001', 455000000, '4.0L Turbo Diesel 136 PS Heavy Duty', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'DYNA', '115 TT 4X2 5 M/T', 'M/T', 'D115TT00001', 398000000, '4.0L Turbo Diesel 115 PS', 'KF, LP'],

    ['BANDUNG', 'REGULAR ORDER', 'DYNA', '136 HT HI-GEAR 4X2 6 M/T', 'M/T', 'D136HTHG001', 465000000, '4.0L Turbo Diesel 136 PS Heavy Duty', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'DYNA', '136 HT 4X2 6 M/T', 'M/T', 'D136HT00001', 455000000, '4.0L Turbo Diesel 136 PS Heavy Duty', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'DYNA', '115 TT 4X2 5 M/T', 'M/T', 'D115TT00001', 398000000, '4.0L Turbo Diesel 115 PS', 'KF, LP']
];

$stmt = $conn->prepare('INSERT INTO pricelist_mobil (otr_wilayah, order_type, model, type, transmission, kode_tipe, pricelist, additional, accessories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

foreach ($rows as $r) {
    $chk = $conn->prepare('SELECT id FROM pricelist_mobil WHERE otr_wilayah = ? AND order_type = ? AND model = ? AND type = ? AND transmission = ?');
    $chk->bind_param('sssss', $r[0], $r[1], $r[2], $r[3], $r[4]);
    $chk->execute();
    if ($chk->get_result()->num_rows == 0) {
        $stmt->bind_param('ssssssiss', $r[0], $r[1], $r[2], $r[3], $r[4], $r[5], $r[6], $r[7], $r[8]);
        $stmt->execute();
        echo "Inserted pricelist: {$r[0]} | {$r[2]} {$r[3]} ({$r[4]})\n";
    } else {
        echo "Already exists: {$r[0]} | {$r[2]} {$r[3]} ({$r[4]})\n";
    }
}

// Ensure tabel_brosur has GR Supra, Prius, and Dyna
$brosurs = [
    ['GR Supra', 'Brosur GR Supra - Spesifikasi & Fitur Lengkap', 'Sedan', 'assets/img/mobil/supra.webp', '../uploads/brosur/gr-86.pdf'],
    ['Prius', 'Brosur All New Prius HEV - Spesifikasi & Fitur Lengkap', 'Sedan', 'assets/img/mobil/prius.webp', '../uploads/brosur/corolla-altis.pdf'],
    ['Dyna', 'Brosur Dyna - Spesifikasi & Fitur Lengkap', 'Commercial', 'assets/img/mobil/dyna.webp', '../uploads/brosur/dyna.pdf']
];

foreach ($brosurs as $b) {
    $chkBro = $conn->query("SELECT id FROM tabel_brosur WHERE nama = '{$b[0]}'");
    if ($chkBro && $chkBro->num_rows == 0) {
        $ins = $conn->prepare("INSERT INTO tabel_brosur (nama, deskripsi, kategori, gambar_url, pdf_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $ins->bind_param('sssss', $b[0], $b[1], $b[2], $b[3], $b[4]);
        $ins->execute();
        echo "Inserted tabel_brosur: {$b[0]}\n";
    } else {
        echo "Brosur already exists: {$b[0]}\n";
    }
}

echo "All missing models populated successfully!\n";
