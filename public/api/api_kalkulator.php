<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

try {
    $leasing = [];
    $resL = $conn->query("SELECT id, nama_leasing FROM tabel_leasing WHERE status = 'Aktif' ORDER BY nama_leasing ASC");
    if ($resL) {
        while($row = $resL->fetch_assoc()) $leasing[] = $row;
    }

    $provinsi = [];
    $resP = $conn->query("SELECT id, nama_provinsi, suku_bunga FROM tabel_bunga_provinsi WHERE status = 'Aktif' ORDER BY nama_provinsi ASC");
    if ($resP) {
        while($row = $resP->fetch_assoc()) $provinsi[] = $row;
    }

    $mobil = [];
    $resM = $conn->query("SELECT id, model, type, transmission, pricelist FROM pricelist_mobil WHERE pricelist > 0 ORDER BY model ASC, pricelist ASC");
    if ($resM) {
        while($row = $resM->fetch_assoc()) {
            $model = trim($row['model']);
            $type = trim($row['type']);
            $trans = trim($row['transmission']);
            $otr = (int)$row['pricelist'];
            $mobil[] = [
                'id' => (int)$row['id'],
                'model' => $model,
                'type' => $type,
                'trans' => $trans,
                'otr' => $otr,
                'value' => $otr . '|' . $model . ' ' . $type . ' ' . $trans,
                'label' => $model . ' ' . $type . ' ' . $trans . ' (Rp ' . number_format($otr, 0, ',', '.') . ')'
            ];
        }
    }

    echo json_encode([
        'status' => 'success',
        'leasing' => $leasing,
        'provinsi' => $provinsi,
        'mobil' => $mobil
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
