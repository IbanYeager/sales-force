<?php
require_once __DIR__ . '/../public/api/koneksi.php';

$rows = [
    // YARIS
    ['JAWA BARAT', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 3 AIRBAGS', 'CVT', 'N150SCVT300', 341400000, 'GR Aero Package, 3 Airbags', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 3 AIRBAGS', 'M/T', 'N150SMT300', 329400000, 'GR Aero Package, 3 Airbags', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 7 AIRBAGS', 'CVT', 'N150SCVT700', 348200000, 'GR Aero Package, 7 Airbags', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'YARIS', '1.5 G', 'CVT', 'N150GCVT000', 312500000, 'Standard Package', 'KF, LP'],

    ['BANDUNG', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 3 AIRBAGS', 'CVT', 'N150SCVT300', 341400000, 'GR Aero Package, 3 Airbags', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 3 AIRBAGS', 'M/T', 'N150SMT300', 329400000, 'GR Aero Package, 3 Airbags', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'YARIS', '1.5 S GR SPORT 7 AIRBAGS', 'CVT', 'N150SCVT700', 348200000, 'GR Aero Package, 7 Airbags', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'YARIS', '1.5 G', 'CVT', 'N150GCVT000', 312500000, 'Standard Package', 'KF, LP'],

    // GR YARIS
    ['JAWA BARAT', 'REGULAR ORDER', 'GR YARIS', '1.6 TURBO 4WD M/T', 'M/T', 'G16EM/T0001', 1150000000, 'GR-FOUR 4WD Turbo 261 PS', 'KF, LP'],
    ['JAWA BARAT', 'REGULAR ORDER', 'GR YARIS', '1.6 TURBO 4WD A/T', 'A/T', 'G16EA/T0001', 1198000000, 'GR-FOUR 4WD Turbo 280 PS Direct Shift AT', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'GR YARIS', '1.6 TURBO 4WD M/T', 'M/T', 'G16EM/T0001', 1150000000, 'GR-FOUR 4WD Turbo 261 PS', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'GR YARIS', '1.6 TURBO 4WD A/T', 'A/T', 'G16EA/T0001', 1198000000, 'GR-FOUR 4WD Turbo 280 PS Direct Shift AT', 'KF, LP'],

    // GR COROLLA
    ['JAWA BARAT', 'REGULAR ORDER', 'GR COROLLA', '1.6 TURBO GR-FOUR 4WD M/T', 'M/T', 'G16CM/T0001', 1360000000, 'Gazoo Racing GR-FOUR AWD 304 PS', 'KF, LP'],
    ['BANDUNG', 'REGULAR ORDER', 'GR COROLLA', '1.6 TURBO GR-FOUR 4WD M/T', 'M/T', 'G16CM/T0001', 1360000000, 'Gazoo Racing GR-FOUR AWD 304 PS', 'KF, LP']
];

$stmt = $conn->prepare('INSERT INTO pricelist_mobil (otr_wilayah, order_type, model, type, transmission, kode_tipe, pricelist, additional, accessories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

foreach ($rows as $r) {
    $chk = $conn->prepare('SELECT id FROM pricelist_mobil WHERE otr_wilayah = ? AND order_type = ? AND model = ? AND type = ? AND transmission = ?');
    $chk->bind_param('sssss', $r[0], $r[1], $r[2], $r[3], $r[4]);
    $chk->execute();
    if ($chk->get_result()->num_rows == 0) {
        $stmt->bind_param('ssssssiss', $r[0], $r[1], $r[2], $r[3], $r[4], $r[5], $r[6], $r[7], $r[8]);
        $stmt->execute();
        echo "Inserted: {$r[0]} | {$r[2]} {$r[3]} ({$r[4]})\n";
    } else {
        echo "Already exists: {$r[0]} | {$r[2]} {$r[3]} ({$r[4]})\n";
    }
}

// Also check tabel_brosur for GR Corolla
$chkBro = $conn->query("SELECT id FROM tabel_brosur WHERE nama = 'GR Corolla'");
if ($chkBro && $chkBro->num_rows == 0) {
    $conn->query("INSERT INTO tabel_brosur (nama, deskripsi, kategori, gambar_url, pdf_url, created_at) VALUES ('GR Corolla', 'Brosur GR Corolla - Spesifikasi & Fitur Lengkap', 'Hatchback', 'assets/img/mobil/gr-corolla.webp', '../uploads/brosur/gr-yaris.pdf', NOW())");
    echo "Inserted GR Corolla into tabel_brosur\n";
}

echo "Done!\n";
