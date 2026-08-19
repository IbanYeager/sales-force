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

    echo json_encode([
        'status' => 'success',
        'leasing' => $leasing,
        'provinsi' => $provinsi
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
