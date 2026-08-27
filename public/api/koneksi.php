<?php
// Set default timezone to Asia/Jakarta (WIB - UTC+7)
date_default_timezone_set('Asia/Jakarta');

// Disable display of raw PHP errors in production to prevent information disclosure
error_reporting(0);
ini_set('display_errors', 0);

// ── Deteksi Otomatis Lingkungan (Hosting Hostinger vs Localhost Laragon) ──
$serverName = $_SERVER['SERVER_NAME'] ?? $_SERVER['HTTP_HOST'] ?? '';
$dirPath = __DIR__;

// Jika dijalankan di server live Hostinger
$isLiveHosting = (
    strpos($serverName, 'salesforcetunassft.com') !== false ||
    strpos($dirPath, 'u253557905') !== false ||
    strpos($dirPath, 'public_html') !== false
);

if ($isLiveHosting) {
    // 🌐 SERVER LIVE HOSTINGER (Internal Connection)
    $host = "localhost";
    $user = "u253557905_kircon"; 
    $pass = "Kircon154";     
    $db   = "u253557905_db_sales";
} else {
    // 💻 KOMPUTER LOKAL / LARAGON (Tersambung Langsung ke Database Hostinger via Remote MySQL)
    $host = "srv1412.hstgr.io"; // Hostname Remote MySQL Hostinger (IP: 153.92.15.23)
    $user = "u253557905_kircon"; 
    $pass = "Kircon154";     
    $db   = "u253557905_db_sales";
}

// Load external config_db.php if created by user on hosting server
if (file_exists(__DIR__ . '/config_db.php')) {
    include __DIR__ . '/config_db.php';
}

$conn = null;
try {
    $conn = @new mysqli($host, $user, $pass, $db, 3306);
} catch (Throwable $e) {
    $conn = null;
}

// Fallback otomatis: Jika internet terputus di lokal, fallback ke database lokal Laragon
if (!$conn || $conn->connect_error) {
    // Coba fallback ke IP langsung Hostinger
    try {
        $altConn = @new mysqli("153.92.15.23", "u253557905_kircon", "Kircon154", "u253557905_db_sales", 3306);
        if ($altConn && !$altConn->connect_error) {
            $conn = $altConn;
        }
    } catch (Throwable $e) {}

    // Jika masih gagal (misal sedang offline total), gunakan DB offline lokal
    if (!$conn || $conn->connect_error) {
        try {
            $localConn = @new mysqli("localhost", "root", "", "db_sales_app");
            if ($localConn && !$localConn->connect_error) {
                $conn = $localConn;
            }
        } catch (Throwable $e) {}
    }
}

if (!$conn || $conn->connect_error) {
    $conn = null;
}

// Set charset to utf8mb4 and timezone for secure Unicode & accurate time handling
if ($conn instanceof mysqli) {
    $conn->set_charset("utf8mb4"); 
    @$conn->query("SET time_zone = '+07:00'");
}
?>