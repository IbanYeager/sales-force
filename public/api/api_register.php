<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "ok" => false,
    "message" => "Registrasi publik dinonaktifkan. Pembuatan akun baru hanya dilayani melalui Administrator Database secara langsung."
]);
exit;
?>
