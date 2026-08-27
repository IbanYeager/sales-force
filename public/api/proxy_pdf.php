<?php
// api/proxy_pdf.php
error_reporting(0);

$file = isset($_GET['file']) ? $_GET['file'] : '';

// Validasi path untuk memastikan hanya membaca dari folder uploads
if (empty($file) || strpos($file, '../uploads/') !== 0) {
    http_response_code(403);
    die("Akses ditolak");
}

// Lokasi relatif: script ini ada di folder api/
// file url aslinya adalah '../uploads/...', berarti relatif dari api/ adalah dirname(__DIR__) . '/uploads/...'
$filepath = __DIR__ . '/../uploads/' . substr($file, 11);

if (!file_exists($filepath)) {
    http_response_code(404);
    die("File tidak ditemukan");
}

// Bypass IDM dengan header
header('Content-Type: application/pdf');
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: public, max-age=3600');
header('Access-Control-Allow-Origin: *');
header('Content-Disposition: inline; filename="brosur.pdf"'); // Force inline rendering

readfile($filepath);
exit;
