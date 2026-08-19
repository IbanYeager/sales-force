<?php
// Disable display of raw PHP errors in production to prevent information disclosure
error_reporting(0);
ini_set('display_errors', 0);

// Hostinger / Local Database Configuration
$host = "localhost";
$user = "root"; 
$pass = "";     
$db   = "db_sales_app";

// Load external config_db.php if created by user on hosting server
if (file_exists(__DIR__ . '/config_db.php')) {
    include __DIR__ . '/config_db.php';
}

$conn = null;
try {
    $conn = @new mysqli($host, $user, $pass, $db);
} catch (Throwable $e) {
    $conn = null;
}

if (!$conn || $conn->connect_error) {
    $conn = null;
}

// Set charset to utf8mb4 for secure Unicode handling
if ($conn instanceof mysqli) {
    $conn->set_charset("utf8mb4"); 
}
?>