<?php
// api_olx_pencapaian.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'koneksi.php';

$month_filter = isset($_GET['month']) ? trim($_GET['month']) : 'all';

// Dataset rekap pencapaian trade-in OLX Januari 2026 s/d Juli 2026
$raw_data = [
    // Januari 2026 (Alvin: 1 Deal, Ryan: 0, Riva: 0)
    [
        'month' => 'Januari 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Avanza G CVT',
        'tahun' => 2022,
        'warna' => 'Hitam',
        'harga' => 210000000,
        'km' => '35 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Januari 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Daihatsu',
        'type' => 'Xenia R',
        'tahun' => 2020,
        'warna' => 'Silver',
        'harga' => 155000000,
        'km' => '50 RB',
        'pajak' => 'ON',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Januari 2026',
        'sales' => 'Rizal',
        'spv' => 'Riva',
        'merk' => 'Mitsubishi',
        'type' => 'Xpander Ultimate',
        'tahun' => 2021,
        'warna' => 'Putih',
        'harga' => 230000000,
        'km' => '42 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],

    // Februari 2026 (Alvin: 1 Deal, Ryan: 0, Riva: 0)
    [
        'month' => 'Februari 2026',
        'sales' => 'Yeni',
        'spv' => 'Alvin',
        'merk' => 'Honda',
        'type' => 'HR-V E CVT',
        'tahun' => 2021,
        'warna' => 'Abu-abu',
        'harga' => 245000000,
        'km' => '28 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Februari 2026',
        'sales' => 'Erick',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Innova G Reborn',
        'tahun' => 2019,
        'warna' => 'Hitam',
        'harga' => 285000000,
        'km' => '65 RB',
        'pajak' => 'ON',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],

    // Maret 2026 (Alvin: 2 Deal, Ryan: 0, Riva: 0)
    [
        'month' => 'Maret 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Raize 1.0 Turbo',
        'tahun' => 2022,
        'warna' => 'Kuning-Hitam',
        'harga' => 205000000,
        'km' => '22 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Maret 2026',
        'sales' => 'Yeni',
        'spv' => 'Alvin',
        'merk' => 'Hyundai',
        'type' => 'Creta Trend',
        'tahun' => 2023,
        'warna' => 'Putih',
        'harga' => 260000000,
        'km' => '15 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Maret 2026',
        'sales' => 'Rahma',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Rush S TRD',
        'tahun' => 2020,
        'warna' => 'Putih',
        'harga' => 215000000,
        'km' => '45 RB',
        'pajak' => 'ON',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],

    // April 2026 (Alvin: 1 Deal, Ryan: 2 Deal, Riva: 1 Deal)
    [
        'month' => 'April 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Honda',
        'type' => 'Brio RS MT',
        'tahun' => 2021,
        'warna' => 'Kuning',
        'harga' => 150000000,
        'km' => '30 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'April 2026',
        'sales' => 'Rahma',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'VRZ Fortuner',
        'tahun' => 2021,
        'warna' => 'Hitam',
        'harga' => 395000000,
        'km' => '55 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'April 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Mazda',
        'type' => 'Mazda 2 GT',
        'tahun' => 2019,
        'warna' => 'Merah',
        'harga' => 180000000,
        'km' => '40 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'April 2026',
        'sales' => 'Galih',
        'spv' => 'Riva',
        'merk' => 'Toyota',
        'type' => 'Calya G AT',
        'tahun' => 2022,
        'warna' => 'Silver',
        'harga' => 125000000,
        'km' => '18 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],

    // Mei 2026 (Alvin: 3 Deal, Ryan: 4 Deal, Riva: 0 Deal)
    [
        'month' => 'Mei 2026',
        'sales' => 'Yeni',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Avanza Veloz 1.5',
        'tahun' => 2020,
        'warna' => 'Putih',
        'harga' => 195000000,
        'km' => '48 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Mitsubishi',
        'type' => 'Pajero Sport Dakar',
        'tahun' => 2020,
        'warna' => 'Hitam',
        'harga' => 385000000,
        'km' => '52 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Ahmad',
        'spv' => 'Alvin',
        'merk' => 'Honda',
        'type' => 'CR-V 1.5 Turbo',
        'tahun' => 2019,
        'warna' => 'Hitam',
        'harga' => 315000000,
        'km' => '60 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Rahma',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Yaris TRD Sportivo',
        'tahun' => 2020,
        'warna' => 'Kuning',
        'harga' => 190000000,
        'km' => '38 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Innova Venturer 2.4',
        'tahun' => 2018,
        'warna' => 'Hitam',
        'harga' => 330000000,
        'km' => '72 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Erick',
        'spv' => 'Ryan',
        'merk' => 'Daihatsu',
        'type' => 'Terios R Custom',
        'tahun' => 2021,
        'warna' => 'Putih',
        'harga' => 195000000,
        'km' => '32 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Mei 2026',
        'sales' => 'Janjang',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Alphard 2.5 G',
        'tahun' => 2017,
        'warna' => 'Hitam',
        'harga' => 670000000,
        'km' => '85 RB',
        'pajak' => 'Panjang',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],

    // Juni 2026 (Alvin: 2 Deal, Ryan: 4 Deal, Riva: 0 Deal)
    [
        'month' => 'Juni 2026',
        'sales' => 'Janjang',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Zenix V Gassoline',
        'tahun' => 2023,
        'warna' => 'Silver',
        'harga' => 350000000,
        'km' => '51 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Yeni',
        'spv' => 'Alvin',
        'merk' => 'Hyundai',
        'type' => 'Stargerzer X 1.5',
        'tahun' => 2024,
        'warna' => 'Silver',
        'harga' => 255000000,
        'km' => '11.757',
        'pajak' => 'Panjang 2027',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Mazda',
        'type' => 'CX-3',
        'tahun' => 2018,
        'warna' => 'Grey',
        'harga' => 190000000,
        'km' => '65 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Erick',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Camry',
        'tahun' => 2016,
        'warna' => 'Hitam',
        'harga' => 180000000,
        'km' => '80 RB',
        'pajak' => 'Mei 2026',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Rahma',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'VRZ Fortuner',
        'tahun' => 2022,
        'warna' => 'Putih',
        'harga' => 410000000,
        'km' => '77 RB',
        'pajak' => 'Mei 2026',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Yeni',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Reborn',
        'tahun' => 2021,
        'warna' => 'Putih',
        'harga' => 320000000,
        'km' => '140 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Daihatsu',
        'type' => 'Sigra M',
        'tahun' => 2025,
        'warna' => 'Putih',
        'harga' => 125000000,
        'km' => '17 RB',
        'pajak' => 'Panjang 2026',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Veloz Q CVT (Non TSS)',
        'tahun' => 2022,
        'warna' => 'Silver',
        'harga' => 225000000,
        'km' => '71 RB',
        'pajak' => 'Juni 2026',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Rahma',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Veloz 1.5',
        'tahun' => 2025,
        'warna' => 'Putih',
        'harga' => 235000000,
        'km' => '7 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Deal',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Honda',
        'type' => 'HR-V',
        'tahun' => 2024,
        'warna' => 'Biru',
        'harga' => 160000000,
        'km' => '20 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Juni 2026',
        'sales' => 'Syafal',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Yaris S MT',
        'tahun' => 2016,
        'warna' => 'Putih',
        'harga' => 130000000,
        'km' => '180 RB',
        'pajak' => 'Panjang 2027',
        'ket' => 'Masih Nego',
        'hasil' => 'Nego'
    ],

    // Juli 2026 (Alvin: 0 Deal, Ryan: 0 Deal, Riva: 1 Deal)
    [
        'month' => 'Juli 2026',
        'sales' => 'Deni A',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Voxy',
        'tahun' => 2020,
        'warna' => 'Putih',
        'harga' => 300000000,
        'km' => '49 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Daihatsu',
        'type' => 'Ayla',
        'tahun' => 2023,
        'warna' => 'Hitam',
        'harga' => 120000000,
        'km' => '18 RB',
        'pajak' => 'ON',
        'ket' => 'Done Inpeksi (Nego Harga)',
        'hasil' => 'Nego'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Galih',
        'spv' => 'Riva',
        'merk' => 'Toyota',
        'type' => 'Avanza G MT',
        'tahun' => 2021,
        'warna' => 'Hitam',
        'harga' => 160000000,
        'km' => '64 RB',
        'pajak' => 'ON',
        'ket' => 'Done Inpeksi (Deal)',
        'hasil' => 'Deal'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Rizal',
        'spv' => 'Riva',
        'merk' => 'Mitsubishi',
        'type' => 'Pajero Dakar',
        'tahun' => 2021,
        'warna' => 'Hitam',
        'harga' => 400000000,
        'km' => '40 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Deni A',
        'spv' => 'Ryan',
        'merk' => 'Honda',
        'type' => 'Brio E',
        'tahun' => 2023,
        'warna' => 'Hitam',
        'harga' => 150000000,
        'km' => '40 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Ahmad',
        'spv' => 'Alvin',
        'merk' => 'Toyota',
        'type' => 'Avanza E MT',
        'tahun' => 2023,
        'warna' => 'Hitam',
        'harga' => 0,
        'km' => '28 EB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Deri',
        'spv' => 'Riva',
        'merk' => 'Toyota',
        'type' => 'Hilux V AT',
        'tahun' => 2022,
        'warna' => 'Hitam',
        'harga' => 400000000,
        'km' => '74 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Topik',
        'spv' => 'Alvin',
        'merk' => 'Nissan',
        'type' => 'Livina HWS',
        'tahun' => 2012,
        'warna' => 'Hitam',
        'harga' => 100000000,
        'km' => '146 RB',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Egy',
        'spv' => 'Ryan',
        'merk' => 'Toyota',
        'type' => 'Raize GR Turbo',
        'tahun' => 2021,
        'warna' => 'Putih',
        'harga' => 200000000,
        'km' => '108',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Rizal',
        'spv' => 'Riva',
        'merk' => 'Toyota',
        'type' => 'Veloz 1.5',
        'tahun' => 2018,
        'warna' => 'Putih',
        'harga' => 0,
        'km' => '108',
        'pajak' => 'ON',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ],
    [
        'month' => 'Juli 2026',
        'sales' => 'Reni',
        'spv' => 'Riva',
        'merk' => 'Honda',
        'type' => 'Brio RS',
        'tahun' => 2022,
        'warna' => 'Putih',
        'harga' => 146000000,
        'km' => '-',
        'pajak' => '-',
        'ket' => 'Cek Unit',
        'hasil' => 'Cek Unit'
    ]
];

// Opsi bulan yang tersedia
$available_months = [
    'Januari 2026',
    'Februari 2026',
    'Maret 2026',
    'April 2026',
    'Mei 2026',
    'Juni 2026',
    'Juli 2026'
];

// Filter data berdasar bulan
$filtered_data = [];
if ($month_filter !== 'all' && in_array($month_filter, $available_months)) {
    foreach ($raw_data as $row) {
        if ($row['month'] === $month_filter) {
            $filtered_data[] = $row;
        }
    }
} else {
    $filtered_data = $raw_data;
}

// Grouping per SPV
$spv_groups = [];
$total_unit_all = 0;
$total_deal_all = 0;
$total_nominal_deal_all = 0;
$total_estimasi_all = 0;

foreach ($filtered_data as $item) {
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
    
    // Convert sales_summary to array
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
    'spv_data' => $spv_list
]);
