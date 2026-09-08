<?php
// api/proxy_pdf.php
// High Performance PDF Streaming with HTTP 206 Range support
error_reporting(0);
if (function_exists('session_write_close')) {
    session_write_close();
}
while (ob_get_level()) {
    ob_end_clean();
}

$file = isset($_GET['file']) ? trim($_GET['file']) : '';
if (empty($file)) {
    http_response_code(400);
    die("File parameter required");
}

$filename = basename($file);
if (!preg_match('/\.pdf$/i', $filename)) {
    http_response_code(403);
    die("Akses ditolak");
}

// Search locations
$candidates = [
    __DIR__ . '/../uploads/brosur/' . $filename,
    __DIR__ . '/../../uploads/brosur/' . $filename,
    __DIR__ . '/../uploads/' . $filename,
    dirname(__DIR__) . '/uploads/brosur/' . $filename,
    dirname(__DIR__) . '/public/uploads/brosur/' . $filename,
    dirname(__DIR__, 2) . '/uploads/brosur/' . $filename
];

$filepath = null;
foreach ($candidates as $cand) {
    if (file_exists($cand) && is_file($cand)) {
        $filepath = realpath($cand);
        break;
    }
}

if (!$filepath || !file_exists($filepath)) {
    http_response_code(404);
    die("File tidak ditemukan");
}

$filesize = filesize($filepath);
$offset = 0;
$length = $filesize;

// Headers default
header('Content-Type: application/pdf');
header('Accept-Ranges: bytes');
header('Cache-Control: public, max-age=86400');
header('Access-Control-Allow-Origin: *');
header('Content-Disposition: inline; filename="' . $filename . '"');

// Support Range requests (HTTP 206) for instant PDF.js page rendering
if (isset($_SERVER['HTTP_RANGE'])) {
    if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
        $offset = intval($matches[1]);
        if (!empty($matches[2])) {
            $end = intval($matches[2]);
        } else {
            $end = $filesize - 1;
        }
        $length = ($end - $offset) + 1;

        header('HTTP/1.1 206 Partial Content');
        header('Content-Range: bytes ' . $offset . '-' . $end . '/' . $filesize);
        header('Content-Length: ' . $length);
    }
} else {
    header('Content-Length: ' . $filesize);
}

$handle = fopen($filepath, 'rb');
if ($handle) {
    if ($offset > 0) {
        fseek($handle, $offset);
    }
    $bytesRemaining = $length;
    while (!feof($handle) && $bytesRemaining > 0 && !connection_aborted()) {
        $bytesToRead = ($bytesRemaining > 1048576) ? 1048576 : $bytesRemaining;
        echo fread($handle, $bytesToRead);
        flush();
        $bytesRemaining -= $bytesToRead;
    }
    fclose($handle);
}
exit;
