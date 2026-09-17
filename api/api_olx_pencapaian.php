<?php
// api_olx_pencapaian.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'koneksi.php';

$month_filter = isset($_GET['month']) ? trim($_GET['month']) : 'all';

// Dataset rekap pencapaian trade-in OLX Januari 2026 s/d Agustus 2026
$raw_data = [
    // ════════════════════════════════════════════════════════════════
    // JANUARI 2026 (Alvin: 1 Deal, Ryan: 0, Riva: 0)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Januari 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Avanza G CVT', 'tahun' => 2022, 'warna' => 'Hitam', 'harga' => 210000000, 'km' => '35 RB', 'pajak' => 'Panjang', 'ket' => 'Deal Trade-In', 'hasil' => 'Deal'],
    ['month' => 'Januari 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Daihatsu', 'type' => 'Xenia R', 'tahun' => 2020, 'warna' => 'Silver', 'harga' => 155000000, 'km' => '50 RB', 'pajak' => 'ON', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Januari 2026', 'sales' => 'Rizal', 'spv' => 'Riva', 'merk' => 'Mitsubishi', 'type' => 'Xpander Ultimate', 'tahun' => 2021, 'warna' => 'Putih', 'harga' => 230000000, 'km' => '42 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],

    // ════════════════════════════════════════════════════════════════
    // FEBRUARI 2026 (Alvin: 1 Deal, Ryan: 0, Riva: 0)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Februari 2026', 'sales' => 'Intan', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'HR-V E CVT', 'tahun' => 2021, 'warna' => 'Abu-abu', 'harga' => 245000000, 'km' => '28 RB', 'pajak' => 'Panjang', 'ket' => 'Deal SPK', 'hasil' => 'Deal'],
    ['month' => 'Februari 2026', 'sales' => 'Erick', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Innova G Reborn', 'tahun' => 2019, 'warna' => 'Hitam', 'harga' => 285000000, 'km' => '65 RB', 'pajak' => 'ON', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],

    // ════════════════════════════════════════════════════════════════
    // MARET 2026 (Alvin: 2 Deal, Ryan: 0, Riva: 0)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Maret 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Raize 1.0 Turbo', 'tahun' => 2022, 'warna' => 'Kuning-Hitam', 'harga' => 205000000, 'km' => '22 RB', 'pajak' => 'Panjang', 'ket' => 'Deal Trade-In', 'hasil' => 'Deal'],
    ['month' => 'Maret 2026', 'sales' => 'Yeni', 'spv' => 'Alvin', 'merk' => 'Hyundai', 'type' => 'Creta Trend', 'tahun' => 2023, 'warna' => 'Putih', 'harga' => 260000000, 'km' => '15 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Maret 2026', 'sales' => 'Rahma', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Rush S TRD', 'tahun' => 2020, 'warna' => 'Putih', 'harga' => 215000000, 'km' => '45 RB', 'pajak' => 'ON', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],

    // ════════════════════════════════════════════════════════════════
    // APRIL 2026 (Alvin: 1 Deal, Ryan: 2 Deal, Riva: 1 Deal)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'April 2026', 'sales' => 'Topik', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'Brio RS MT', 'tahun' => 2021, 'warna' => 'Kuning', 'harga' => 150000000, 'km' => '30 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'April 2026', 'sales' => 'Rahma', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'VRZ Fortuner', 'tahun' => 2021, 'warna' => 'Hitam', 'harga' => 395000000, 'km' => '55 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'April 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Mazda', 'type' => 'Mazda 2 GT', 'tahun' => 2019, 'warna' => 'Merah', 'harga' => 180000000, 'km' => '40 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'April 2026', 'sales' => 'Galih', 'spv' => 'Riva', 'merk' => 'Toyota', 'type' => 'Calya G AT', 'tahun' => 2022, 'warna' => 'Silver', 'harga' => 125000000, 'km' => '18 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],

    // ════════════════════════════════════════════════════════════════
    // MEI 2026 (Alvin: 3 Deal, Ryan: 4 Deal, Riva: 0 Deal)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Mei 2026', 'sales' => 'Intan', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Avanza Veloz 1.5', 'tahun' => 2020, 'warna' => 'Putih', 'harga' => 195000000, 'km' => '48 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Mitsubishi', 'type' => 'Pajero Sport Dakar', 'tahun' => 2020, 'warna' => 'Hitam', 'harga' => 385000000, 'km' => '52 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Ahmad', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'CR-V 1.5 Turbo', 'tahun' => 2019, 'warna' => 'Hitam', 'harga' => 315000000, 'km' => '60 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Rahma', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Yaris TRD Sportivo', 'tahun' => 2020, 'warna' => 'Kuning', 'harga' => 190000000, 'km' => '38 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Innova Venturer 2.4', 'tahun' => 2018, 'warna' => 'Hitam', 'harga' => 330000000, 'km' => '72 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Erick', 'spv' => 'Ryan', 'merk' => 'Daihatsu', 'type' => 'Terios R Custom', 'tahun' => 2021, 'warna' => 'Putih', 'harga' => 195000000, 'km' => '32 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Mei 2026', 'sales' => 'Jajang', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Alphard 2.5 G', 'tahun' => 2017, 'warna' => 'Hitam', 'harga' => 670000000, 'km' => '85 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],

    // ════════════════════════════════════════════════════════════════
    // JUNI 2026 (Alvin: 2 Deal, Ryan: 4 Deal, Riva: 0 Deal)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Juni 2026', 'sales' => 'Jajang', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Zenix V Gassoline', 'tahun' => 2023, 'warna' => 'Silver', 'harga' => 350000000, 'km' => '51 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Yeni', 'spv' => 'Alvin', 'merk' => 'Hyundai', 'type' => 'Stargerzer X 1.5', 'tahun' => 2024, 'warna' => 'Silver', 'harga' => 255000000, 'km' => '11.757', 'pajak' => 'Panjang 2027', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Juni 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Mazda', 'type' => 'CX-3', 'tahun' => 2018, 'warna' => 'Grey', 'harga' => 190000000, 'km' => '65 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Erick', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Camry', 'tahun' => 2016, 'warna' => 'Hitam', 'harga' => 180000000, 'km' => '80 RB', 'pajak' => 'Mei 2026', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Juni 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Daihatsu', 'type' => 'Sigra M', 'tahun' => 2025, 'warna' => 'Putih', 'harga' => 125000000, 'km' => '17 RB', 'pajak' => 'Panjang 2026', 'ket' => 'Deal Trade-In', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Yeni', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Reborn', 'tahun' => 2021, 'warna' => 'Putih', 'harga' => 320000000, 'km' => '140 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Veloz Q CVT (Non TSS)', 'tahun' => 2022, 'warna' => 'Silver', 'harga' => 225000000, 'km' => '71 RB', 'pajak' => 'Juni 2026', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Rahma', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Veloz 1.5', 'tahun' => 2025, 'warna' => 'Putih', 'harga' => 235000000, 'km' => '7 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Juni 2026', 'sales' => 'Topik', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'HR-V', 'tahun' => 2024, 'warna' => 'Biru', 'harga' => 160000000, 'km' => '20 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Juni 2026', 'sales' => 'Syafal', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Yaris S MT', 'tahun' => 2016, 'warna' => 'Putih', 'harga' => 130000000, 'km' => '180 RB', 'pajak' => 'Panjang 2027', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],

    // ════════════════════════════════════════════════════════════════
    // JULI 2026 (Alvin: 2 Deal, Ryan: 1 Deal, Riva: 1 Deal)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Juli 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Avanza 1.5 G CVT', 'tahun' => 2023, 'warna' => 'Putih', 'harga' => 215000000, 'km' => '24 RB', 'pajak' => 'Panjang', 'ket' => 'Done Inspeksi (Deal)', 'hasil' => 'Deal'],
    ['month' => 'Juli 2026', 'sales' => 'Intan', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'Brio RS', 'tahun' => 2022, 'warna' => 'Abu-abu', 'harga' => 165000000, 'km' => '31 RB', 'pajak' => 'ON', 'ket' => 'Deal Trade-In', 'hasil' => 'Deal'],
    ['month' => 'Juli 2026', 'sales' => 'Jajang', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Rush 1.5 S TRD', 'tahun' => 2021, 'warna' => 'Putih', 'harga' => 210000000, 'km' => '39 RB', 'pajak' => 'ON', 'ket' => 'Done Inspeksi (Deal)', 'hasil' => 'Deal'],
    ['month' => 'Juli 2026', 'sales' => 'Galih', 'spv' => 'Riva', 'merk' => 'Toyota', 'type' => 'Avanza G MT', 'tahun' => 2021, 'warna' => 'Hitam', 'harga' => 160000000, 'km' => '64 RB', 'pajak' => 'ON', 'ket' => 'Done Inpeksi (Deal)', 'hasil' => 'Deal'],
    ['month' => 'Juli 2026', 'sales' => 'Deni A', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Voxy', 'tahun' => 2020, 'warna' => 'Putih', 'harga' => 300000000, 'km' => '49 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Daihatsu', 'type' => 'Ayla', 'tahun' => 2023, 'warna' => 'Hitam', 'harga' => 120000000, 'km' => '18 RB', 'pajak' => 'ON', 'ket' => 'Done Inpeksi (Nego Harga)', 'hasil' => 'Nego'],
    ['month' => 'Juli 2026', 'sales' => 'Rizal', 'spv' => 'Riva', 'merk' => 'Mitsubishi', 'type' => 'Pajero Dakar', 'tahun' => 2021, 'warna' => 'Hitam', 'harga' => 400000000, 'km' => '40 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Deni A', 'spv' => 'Ryan', 'merk' => 'Honda', 'type' => 'Brio E', 'tahun' => 2023, 'warna' => 'Hitam', 'harga' => 150000000, 'km' => '40 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Ahmad', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Avanza E MT', 'tahun' => 2023, 'warna' => 'Hitam', 'harga' => 165000000, 'km' => '28 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Deri', 'spv' => 'Riva', 'merk' => 'Toyota', 'type' => 'Hilux V AT', 'tahun' => 2022, 'warna' => 'Hitam', 'harga' => 400000000, 'km' => '74 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Topik', 'spv' => 'Alvin', 'merk' => 'Nissan', 'type' => 'Livina HWS', 'tahun' => 2012, 'warna' => 'Hitam', 'harga' => 100000000, 'km' => '146 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Raize GR Turbo', 'tahun' => 2021, 'warna' => 'Putih', 'harga' => 200000000, 'km' => '108', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Rizal', 'spv' => 'Riva', 'merk' => 'Toyota', 'type' => 'Veloz 1.5', 'tahun' => 2018, 'warna' => 'Putih', 'harga' => 175000000, 'km' => '108', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Juli 2026', 'sales' => 'Reni', 'spv' => 'Riva', 'merk' => 'Honda', 'type' => 'Brio RS', 'tahun' => 2022, 'warna' => 'Putih', 'harga' => 146000000, 'km' => '35 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],

    // ════════════════════════════════════════════════════════════════
    // AGUSTUS 2026 (Alvin: 2 Deal, Ryan: 3 Deal, Riva: 0 Deal)
    // ════════════════════════════════════════════════════════════════
    ['month' => 'Agustus 2026', 'sales' => 'Fadil', 'spv' => 'Alvin', 'merk' => 'Toyota', 'type' => 'Yaris Cross S GR CVT', 'tahun' => 2023, 'warna' => 'Putih-Hitam', 'harga' => 340000000, 'km' => '16 RB', 'pajak' => 'Panjang', 'ket' => 'Deal Trade-In', 'hasil' => 'Deal'],
    ['month' => 'Agustus 2026', 'sales' => 'Intan', 'spv' => 'Alvin', 'merk' => 'Honda', 'type' => 'HR-V 1.5 SE', 'tahun' => 2022, 'warna' => 'Hitam', 'harga' => 280000000, 'km' => '27 RB', 'pajak' => 'Panjang', 'ket' => 'Deal SPK', 'hasil' => 'Deal'],
    ['month' => 'Agustus 2026', 'sales' => 'Egy', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Innova Reborn V 2.4 Diesel', 'tahun' => 2020, 'warna' => 'Hitam', 'harga' => 315000000, 'km' => '62 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Agustus 2026', 'sales' => 'Jajang', 'spv' => 'Ryan', 'merk' => 'Mitsubishi', 'type' => 'Xpander Cross Premium', 'tahun' => 2022, 'warna' => 'Abu-abu', 'harga' => 245000000, 'km' => '33 RB', 'pajak' => 'ON', 'ket' => 'Deal SPK', 'hasil' => 'Deal'],
    ['month' => 'Agustus 2026', 'sales' => 'Rahma', 'spv' => 'Ryan', 'merk' => 'Honda', 'type' => 'CR-V 1.5 Prestige Turbo', 'tahun' => 2020, 'warna' => 'Putih', 'harga' => 330000000, 'km' => '54 RB', 'pajak' => 'Panjang', 'ket' => 'Deal', 'hasil' => 'Deal'],
    ['month' => 'Agustus 2026', 'sales' => 'Topik', 'spv' => 'Alvin', 'merk' => 'Suzuki', 'type' => 'XL7 Alpha AT', 'tahun' => 2021, 'warna' => 'Orange-Hitam', 'harga' => 215000000, 'km' => '41 RB', 'pajak' => 'ON', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Agustus 2026', 'sales' => 'Erick', 'spv' => 'Ryan', 'merk' => 'Toyota', 'type' => 'Corolla Cross Hybrid', 'tahun' => 2021, 'warna' => 'Merah', 'harga' => 360000000, 'km' => '38 RB', 'pajak' => 'ON', 'ket' => 'Masih Nego', 'hasil' => 'Nego'],
    ['month' => 'Agustus 2026', 'sales' => 'Rizal', 'spv' => 'Riva', 'merk' => 'Toyota', 'type' => 'Rush S TRD', 'tahun' => 2019, 'warna' => 'Putih', 'harga' => 185000000, 'km' => '58 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit'],
    ['month' => 'Agustus 2026', 'sales' => 'Deri', 'spv' => 'Riva', 'merk' => 'Daihatsu', 'type' => 'Terios R MT', 'tahun' => 2021, 'warna' => 'Hitam', 'harga' => 175000000, 'km' => '44 RB', 'pajak' => 'ON', 'ket' => 'Cek Unit', 'hasil' => 'Cek Unit']
];

// ════════════════════════════════════════════════════════════════
// DATABASE INTEGRATION & AUTO-SEEDING (MySQL & SQLite Fallback)
// ════════════════════════════════════════════════════════════════
$is_db_ready = false;
$sqlite_pdo = null;

if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
    try {
        $conn->query("
            CREATE TABLE IF NOT EXISTS tabel_olx_pencapaian (
                id INT AUTO_INCREMENT PRIMARY KEY,
                month VARCHAR(50) NOT NULL,
                sales VARCHAR(100) NOT NULL,
                spv VARCHAR(100) NOT NULL,
                merk VARCHAR(100) NOT NULL,
                type VARCHAR(150) NOT NULL,
                tahun INT NOT NULL,
                warna VARCHAR(50) DEFAULT '',
                harga BIGINT NOT NULL DEFAULT 0,
                km VARCHAR(50) DEFAULT '',
                pajak VARCHAR(50) DEFAULT 'ON',
                ket VARCHAR(255) DEFAULT '',
                hasil VARCHAR(50) NOT NULL DEFAULT 'Nego',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $chk = $conn->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian");
        if ($chk && ($cRow = $chk->fetch_assoc()) && intval($cRow['c']) === 0) {
            $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if ($stmt) {
                foreach ($raw_data as $rd) {
                    $stmt->bind_param("sssssisissss", 
                        $rd['month'], $rd['sales'], $rd['spv'], $rd['merk'], $rd['type'],
                        $rd['tahun'], $rd['warna'], $rd['harga'], $rd['km'], $rd['pajak'],
                        $rd['ket'], $rd['hasil']
                    );
                    $stmt->execute();
                }
                $stmt->close();
            }
        }
        $is_db_ready = true;
    } catch (Throwable $e) {}
}

if (!$is_db_ready) {
    try {
        $sqlite_path = __DIR__ . '/olx_pencapaian.sqlite';
        $sqlite_pdo = new PDO("sqlite:" . $sqlite_path);
        $sqlite_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlite_pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $sqlite_pdo->exec("
            CREATE TABLE IF NOT EXISTS tabel_olx_pencapaian (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL,
                sales TEXT NOT NULL,
                spv TEXT NOT NULL,
                merk TEXT NOT NULL,
                type TEXT NOT NULL,
                tahun INTEGER NOT NULL,
                warna TEXT DEFAULT '',
                harga INTEGER NOT NULL DEFAULT 0,
                km TEXT DEFAULT '',
                pajak TEXT DEFAULT 'ON',
                ket TEXT DEFAULT '',
                hasil TEXT NOT NULL DEFAULT 'Nego',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $cnt = $sqlite_pdo->query("SELECT COUNT(*) as c FROM tabel_olx_pencapaian")->fetch()['c'];
        if (intval($cnt) === 0) {
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sqlite_pdo->beginTransaction();
            foreach ($raw_data as $rd) {
                $stmt->execute([
                    $rd['month'], $rd['sales'], $rd['spv'], $rd['merk'], $rd['type'],
                    $rd['tahun'], $rd['warna'], $rd['harga'], $rd['km'], $rd['pajak'],
                    $rd['ket'], $rd['hasil']
                ]);
            }
            $sqlite_pdo->commit();
        }
        $is_db_ready = true;
    } catch (Throwable $e) {}
}

// ════════════════════════════════════════════════════════════════
// REST API ENDPOINTS: POST (CREATE, UPDATE, STATUS, DELETE)
// ════════════════════════════════════════════════════════════════
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input)) $input = $_POST;
    $action = $input['action'] ?? '';

    if ($action === 'add') {
        $month = trim($input['month'] ?? date('F Y'));
        $sales = trim($input['sales'] ?? '');
        $spv = trim($input['spv'] ?? '');
        $merk = trim($input['merk'] ?? 'Toyota');
        $type = trim($input['type'] ?? '');
        $tahun = intval($input['tahun'] ?? date('Y'));
        $warna = trim($input['warna'] ?? '');
        $harga = floatval($input['harga'] ?? 0);
        $km = trim($input['km'] ?? '');
        $pajak = trim($input['pajak'] ?? 'ON');
        $ket = trim($input['ket'] ?? '');
        $hasil = trim($input['hasil'] ?? 'Nego');

        if (!$sales || !$type) {
            echo json_encode(['status' => 'error', 'message' => 'Nama wiraniaga dan tipe kendaraan wajib diisi!']);
            exit;
        }

        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssisissss", $month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil);
            $stmt->execute();
            $newId = $conn->insert_id;
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil ditambahkan!', 'id' => $newId]);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("INSERT INTO tabel_olx_pencapaian (month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil]);
            $newId = $sqlite_pdo->lastInsertId();
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil ditambahkan!', 'id' => $newId]);
            exit;
        }
    }

    if ($action === 'update') {
        $id = intval($input['id'] ?? 0);
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID data tidak valid']);
            exit;
        }
        $month = trim($input['month'] ?? '');
        $sales = trim($input['sales'] ?? '');
        $spv = trim($input['spv'] ?? '');
        $merk = trim($input['merk'] ?? '');
        $type = trim($input['type'] ?? '');
        $tahun = intval($input['tahun'] ?? 0);
        $warna = trim($input['warna'] ?? '');
        $harga = floatval($input['harga'] ?? 0);
        $km = trim($input['km'] ?? '');
        $pajak = trim($input['pajak'] ?? 'ON');
        $ket = trim($input['ket'] ?? '');
        $hasil = trim($input['hasil'] ?? 'Nego');

        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("UPDATE tabel_olx_pencapaian SET month=?, sales=?, spv=?, merk=?, type=?, tahun=?, warna=?, harga=?, km=?, pajak=?, ket=?, hasil=? WHERE id=?");
            $stmt->bind_param("sssssisissssi", $month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil diperbarui!']);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("UPDATE tabel_olx_pencapaian SET month=?, sales=?, spv=?, merk=?, type=?, tahun=?, warna=?, harga=?, km=?, pajak=?, ket=?, hasil=? WHERE id=?");
            $stmt->execute([$month, $sales, $spv, $merk, $type, $tahun, $warna, $harga, $km, $pajak, $ket, $hasil, $id]);
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil diperbarui!']);
            exit;
        }
    }

    if ($action === 'update_status') {
        $id = intval($input['id'] ?? 0);
        $hasil = trim($input['hasil'] ?? 'Deal');
        $harga = isset($input['harga']) && $input['harga'] !== '' ? floatval($input['harga']) : null;
        $ket = isset($input['ket']) ? trim($input['ket']) : null;

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID data tidak valid']);
            exit;
        }

        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            if ($harga !== null && $ket !== null) {
                $stmt = $conn->prepare("UPDATE tabel_olx_pencapaian SET hasil=?, harga=?, ket=? WHERE id=?");
                $stmt->bind_param("sdsi", $hasil, $harga, $ket, $id);
            } elseif ($harga !== null) {
                $stmt = $conn->prepare("UPDATE tabel_olx_pencapaian SET hasil=?, harga=? WHERE id=?");
                $stmt->bind_param("sdi", $hasil, $harga, $id);
            } else {
                $stmt = $conn->prepare("UPDATE tabel_olx_pencapaian SET hasil=? WHERE id=?");
                $stmt->bind_param("si", $hasil, $id);
            }
            $stmt->execute();
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => "Status unit berhasil diubah menjadi '$hasil'!"]);
            exit;
        } elseif ($sqlite_pdo) {
            if ($harga !== null && $ket !== null) {
                $stmt = $sqlite_pdo->prepare("UPDATE tabel_olx_pencapaian SET hasil=?, harga=?, ket=? WHERE id=?");
                $stmt->execute([$hasil, $harga, $ket, $id]);
            } elseif ($harga !== null) {
                $stmt = $sqlite_pdo->prepare("UPDATE tabel_olx_pencapaian SET hasil=?, harga=? WHERE id=?");
                $stmt->execute([$hasil, $harga, $id]);
            } else {
                $stmt = $sqlite_pdo->prepare("UPDATE tabel_olx_pencapaian SET hasil=? WHERE id=?");
                $stmt->execute([$hasil, $id]);
            }
            echo json_encode(['status' => 'success', 'message' => "Status unit berhasil diubah menjadi '$hasil'!"]);
            exit;
        }
    }

    if ($action === 'delete') {
        $id = intval($input['id'] ?? 0);
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID data tidak valid']);
            exit;
        }
        if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
            $stmt = $conn->prepare("DELETE FROM tabel_olx_pencapaian WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil dihapus!']);
            exit;
        } elseif ($sqlite_pdo) {
            $stmt = $sqlite_pdo->prepare("DELETE FROM tabel_olx_pencapaian WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Data trade-in berhasil dihapus!']);
            exit;
        }
    }
}

// ════════════════════════════════════════════════════════════════
// REST API: GET (LIST DATA & AGGREGATED METRICS)
// ════════════════════════════════════════════════════════════════
$available_months = [];
$db_rows = [];

if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
    // Distinct months
    $resM = $conn->query("SELECT DISTINCT month FROM tabel_olx_pencapaian ORDER BY id ASC");
    if ($resM) {
        while ($rm = $resM->fetch_assoc()) {
            if (!empty($rm['month']) && !in_array($rm['month'], $available_months)) {
                $available_months[] = $rm['month'];
            }
        }
    }

    // Build query filters
    $where = [];
    $params = [];
    $types = "";

    if ($month_filter !== 'all' && $month_filter !== '') {
        $where[] = "month = ?";
        $params[] = $month_filter;
        $types .= "s";
    }

    $spv_filter = isset($_GET['spv']) ? trim($_GET['spv']) : 'all';
    if ($spv_filter !== 'all' && $spv_filter !== '' && strtolower($spv_filter) !== 'semua') {
        $cleanSpv = str_replace(['Pak ', 'Bu '], '', $spv_filter);
        $where[] = "(spv = ? OR spv LIKE ?)";
        $params[] = $cleanSpv;
        $params[] = "%$cleanSpv%";
        $types .= "ss";
    }

    $status_filter = isset($_GET['status']) ? trim($_GET['status']) : 'all';
    if ($status_filter !== 'all' && $status_filter !== '') {
        $where[] = "hasil = ?";
        $params[] = $status_filter;
        $types .= "s";
    }

    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(sales LIKE ? OR merk LIKE ? OR type LIKE ? OR ket LIKE ? OR warna LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
        $types .= "sssss";
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT id, month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id DESC";

    if (empty($params)) {
        $res = $conn->query($sql);
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['tahun'] = (int)$row['tahun'];
                $row['harga'] = (float)$row['harga'];
                $db_rows[] = $row;
            }
        }
    } else {
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['tahun'] = (int)$row['tahun'];
                $row['harga'] = (float)$row['harga'];
                $db_rows[] = $row;
            }
            $stmt->close();
        }
    }
} elseif ($sqlite_pdo) {
    $stmtM = $sqlite_pdo->query("SELECT DISTINCT month FROM tabel_olx_pencapaian ORDER BY id ASC");
    $available_months = array_column($stmtM->fetchAll(), 'month');

    $where = [];
    $params = [];
    if ($month_filter !== 'all' && $month_filter !== '') {
        $where[] = "month = ?";
        $params[] = $month_filter;
    }
    $spv_filter = isset($_GET['spv']) ? trim($_GET['spv']) : 'all';
    if ($spv_filter !== 'all' && $spv_filter !== '' && strtolower($spv_filter) !== 'semua') {
        $cleanSpv = str_replace(['Pak ', 'Bu '], '', $spv_filter);
        $where[] = "(spv = ? OR spv LIKE ?)";
        $params[] = $cleanSpv;
        $params[] = "%$cleanSpv%";
    }
    $status_filter = isset($_GET['status']) ? trim($_GET['status']) : 'all';
    if ($status_filter !== 'all' && $status_filter !== '') {
        $where[] = "hasil = ?";
        $params[] = $status_filter;
    }
    $search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
    if ($search_query !== '') {
        $sTerm = "%$search_query%";
        $where[] = "(sales LIKE ? OR merk LIKE ? OR type LIKE ? OR ket LIKE ? OR warna LIKE ?)";
        $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm; $params[] = $sTerm;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $stmt = $sqlite_pdo->prepare("SELECT id, month, sales, spv, merk, type, tahun, warna, harga, km, pajak, ket, hasil, created_at FROM tabel_olx_pencapaian $whereSql ORDER BY id DESC");
    $stmt->execute($params);
    $db_rows = $stmt->fetchAll();
    foreach ($db_rows as &$row) {
        $row['id'] = (int)$row['id'];
        $row['tahun'] = (int)$row['tahun'];
        $row['harga'] = (float)$row['harga'];
    }
}

// Fallback if DB completely unavailable
if (empty($db_rows) && !$is_db_ready) {
    $db_rows = $raw_data;
}

if (empty($available_months)) {
    $available_months = ['Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026', 'Mei 2026', 'Juni 2026', 'Juli 2026', 'Agustus 2026', 'September 2026'];
}

// Grouping per SPV
$spv_groups = [];
$total_unit_all = 0;
$total_deal_all = 0;
$total_nominal_deal_all = 0;
$total_estimasi_all = 0;

foreach ($db_rows as $item) {
    $spv = $item['spv'];
    if (!isset($spv_groups[$spv])) {
        $spv_groups[$spv] = [
            'spv_name' => $spv,
            'total_unit' => 0,
            'deal_count' => 0,
            'nego_count' => 0,
            'total_nominal_deal' => 0,
            'total_estimasi_nilai' => 0,
            'sales_summary' => [],
            'items' => []
        ];
    }

    $spv_groups[$spv]['total_unit']++;
    $spv_groups[$spv]['total_estimasi_nilai'] += $item['harga'];
    $spv_groups[$spv]['items'][] = $item;

    $is_deal = ($item['hasil'] === 'Deal');
    if ($is_deal) {
        $spv_groups[$spv]['deal_count']++;
        $spv_groups[$spv]['total_nominal_deal'] += $item['harga'];
    } else {
        $spv_groups[$spv]['nego_count']++;
    }

    // Rekap per Sales under SPV
    $sales = $item['sales'];
    if (!isset($spv_groups[$spv]['sales_summary'][$sales])) {
        $spv_groups[$spv]['sales_summary'][$sales] = [
            'nama_sales' => $sales,
            'total_unit' => 0,
            'deal_count' => 0,
            'total_nominal_deal' => 0
        ];
    }
    $spv_groups[$spv]['sales_summary'][$sales]['total_unit']++;
    if ($is_deal) {
        $spv_groups[$spv]['sales_summary'][$sales]['deal_count']++;
        $spv_groups[$spv]['sales_summary'][$sales]['total_nominal_deal'] += $item['harga'];
    }

    // Global summary
    $total_unit_all++;
    $total_estimasi_all += $item['harga'];
    if ($is_deal) {
        $total_deal_all++;
        $total_nominal_deal_all += $item['harga'];
    }
}

// Ensure all main SPVs (Alvin, Ryan, Riva) are present even if count is 0
$main_spvs = ['Alvin', 'Ryan', 'Riva'];
foreach ($main_spvs as $spv_name) {
    if (!isset($spv_groups[$spv_name])) {
        $spv_groups[$spv_name] = [
            'spv_name' => $spv_name,
            'total_unit' => 0,
            'deal_count' => 0,
            'nego_count' => 0,
            'total_nominal_deal' => 0,
            'total_estimasi_nilai' => 0,
            'sales_summary' => [],
            'items' => []
        ];
    }
}

// Convert associative arrays to indexed array and calc win rates
$spv_list = [];
foreach ($spv_groups as $spv_key => $spv_data) {
    $spv_data['win_rate'] = $spv_data['total_unit'] > 0 
        ? round(($spv_data['deal_count'] / $spv_data['total_unit']) * 100, 1) 
        : 0;
    
    $spv_data['sales_summary'] = array_values($spv_data['sales_summary']);
    $spv_list[] = $spv_data;
}

// Sort SPV by total_nominal_deal DESC then total_unit DESC
usort($spv_list, function($a, $b) {
    if ($a['total_nominal_deal'] !== $b['total_nominal_deal']) {
        return $b['total_nominal_deal'] <=> $a['total_nominal_deal'];
    }
    if ($a['deal_count'] !== $b['deal_count']) {
        return $b['deal_count'] <=> $a['deal_count'];
    }
    return $b['total_unit'] <=> $a['total_unit'];
});

$win_rate_all = $total_unit_all > 0 ? round(($total_deal_all / $total_unit_all) * 100, 1) : 0;

// ════════════════════════════════════════════════════════════════
// 1. REKAP BULANAN DEAL PER SPV (PAPAN FISIK DEALER MATRIX)
// ════════════════════════════════════════════════════════════════
$month_names = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
$matrix_rows = [];
$tot_m_alvin = 0;
$tot_m_ryan = 0;
$tot_m_riva = 0;

foreach ($month_names as $mn) {
    $matrix_rows[$mn] = [
        'month' => $mn,
        'alvin' => 0,
        'ryan' => 0,
        'riva' => 0,
        'total' => 0
    ];
}

if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
    $resMatrix = $conn->query("SELECT month, spv, COUNT(*) as c FROM tabel_olx_pencapaian WHERE hasil='Deal' GROUP BY month, spv");
    if ($resMatrix) {
        while ($r = $resMatrix->fetch_assoc()) {
            $mFull = $r['month'];
            $spv = $r['spv'];
            $cnt = (int)$r['c'];
            foreach ($month_names as $mn) {
                if (stripos($mFull, $mn) !== false) {
                    if (stripos($spv, 'alvin') !== false) {
                        $matrix_rows[$mn]['alvin'] += $cnt;
                        $tot_m_alvin += $cnt;
                    } elseif (stripos($spv, 'ryan') !== false) {
                        $matrix_rows[$mn]['ryan'] += $cnt;
                        $tot_m_ryan += $cnt;
                    } elseif (stripos($spv, 'riva') !== false) {
                        $matrix_rows[$mn]['riva'] += $cnt;
                        $tot_m_riva += $cnt;
                    }
                    $matrix_rows[$mn]['total'] += $cnt;
                    break;
                }
            }
        }
    }
} elseif ($sqlite_pdo) {
    $stmtMatrix = $sqlite_pdo->query("SELECT month, spv, COUNT(*) as c FROM tabel_olx_pencapaian WHERE hasil='Deal' GROUP BY month, spv");
    if ($stmtMatrix) {
        while ($r = $stmtMatrix->fetch()) {
            $mFull = $r['month'];
            $spv = $r['spv'];
            $cnt = (int)$r['c'];
            foreach ($month_names as $mn) {
                if (stripos($mFull, $mn) !== false) {
                    if (stripos($spv, 'alvin') !== false) {
                        $matrix_rows[$mn]['alvin'] += $cnt;
                        $tot_m_alvin += $cnt;
                    } elseif (stripos($spv, 'ryan') !== false) {
                        $matrix_rows[$mn]['ryan'] += $cnt;
                        $tot_m_ryan += $cnt;
                    } elseif (stripos($spv, 'riva') !== false) {
                        $matrix_rows[$mn]['riva'] += $cnt;
                        $tot_m_riva += $cnt;
                    }
                    $matrix_rows[$mn]['total'] += $cnt;
                    break;
                }
            }
        }
    }
}

$spv_matrix = [
    'rows' => array_values($matrix_rows),
    'totals' => [
        'alvin' => $tot_m_alvin,
        'ryan' => $tot_m_ryan,
        'riva' => $tot_m_riva,
        'dealer_total' => $tot_m_alvin + $tot_m_ryan + $tot_m_riva
    ]
];

// ════════════════════════════════════════════════════════════════
// 2. PODIUM TOP SALES (URUTAN WAJIB DARI KIRI: FADIL, EGY, JAJANG, INTAN)
// ════════════════════════════════════════════════════════════════
$target_sales = [
    [
        'key' => 'fadil',
        'display_name' => 'Fadil',
        'full_name' => 'Muhammad Fadil Fahmi',
        'spv' => 'Alvin',
        'photo' => '../images/olx_top/fadil.jpg'
    ],
    [
        'key' => 'egy',
        'display_name' => 'Egy',
        'full_name' => 'Egy',
        'spv' => 'Ryan',
        'photo' => '../images/olx_top/egy.jpg'
    ],
    [
        'key' => 'jajang',
        'display_name' => 'Jajang',
        'full_name' => 'Jajang',
        'spv' => 'Ryan',
        'photo' => '../images/olx_top/jajang.jpg'
    ],
    [
        'key' => 'intan',
        'display_name' => 'Intan',
        'full_name' => 'Intan',
        'spv' => 'Alvin',
        'photo' => '../images/olx_top/intan.jpg'
    ]
];

$top_podium = [];
foreach ($target_sales as $ts) {
    $k = $ts['key'];
    $deals = 0;
    $omset = 0;

    if ($conn && $conn instanceof mysqli && !$conn->connect_error) {
        $q = $conn->query("SELECT COUNT(*) as deals, SUM(harga) as omset FROM tabel_olx_pencapaian WHERE hasil='Deal' AND (sales LIKE '%$k%')");
        if ($q && ($d = $q->fetch_assoc())) {
            $deals = (int)($d['deals'] ?? 0);
            $omset = (float)($d['omset'] ?? 0);
        }
    } elseif ($sqlite_pdo) {
        $stmt = $sqlite_pdo->prepare("SELECT COUNT(*) as deals, SUM(harga) as omset FROM tabel_olx_pencapaian WHERE hasil='Deal' AND (sales LIKE ?)");
        $stmt->execute(["%$k%"]);
        if ($d = $stmt->fetch()) {
            $deals = (int)($d['deals'] ?? 0);
            $omset = (float)($d['omset'] ?? 0);
        }
    }

    $ts['deal_count'] = $deals;
    $ts['total_omset'] = $omset;
    $top_podium[] = $ts;
}

// Return comprehensive JSON
echo json_encode([
    'status' => 'success',
    'selected_month' => $month_filter,
    'available_months' => $available_months,
    'summary' => [
        'total_unit' => $total_unit_all,
        'total_deal' => $total_deal_all,
        'total_nego' => $total_unit_all - $total_deal_all,
        'total_nominal_deal' => $total_nominal_deal_all,
        'total_estimasi' => $total_estimasi_all,
        'win_rate' => $win_rate_all
    ],
    'top_sales_podium' => $top_podium,
    'spv_matrix' => $spv_matrix,
    'spv_data' => $spv_list,
    'items' => $db_rows
]);
