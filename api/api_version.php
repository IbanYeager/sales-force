<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');

$versionFile = __DIR__ . '/../version.json';
if (file_exists($versionFile)) {
    echo file_get_contents($versionFile);
} else {
    echo json_encode([
        'version' => '1.0.2',
        'buildNumber' => 3,
        'releaseDate' => date('Y-m-d'),
        'apkUrl' => 'https://salesforcetunassft.com/download/sft-mobile.apk',
        'webUrl' => 'https://salesforcetunassft.com/mobile/',
        'changeLog' => 'Pembaruan identitas visual resmi Sales Force (ikon aplikasi launcher & splash screen baru).',
        'forceUpdate' => false
    ]);
}
