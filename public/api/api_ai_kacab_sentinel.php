<?php
// api/api_ai_kacab_sentinel.php
// AI Daily Sentinel & Early Warning System for Kepala Cabang (Kacab)
// Aturan: Target akumulasi minimal SPK / DO dibagi per 5 hari:
// Hari 1-5: Min 1 | Hari 6-10: Min 2 | Hari 11-15: Min 3 | Hari 16-20: Min 4 | Hari 21-25: Min 5 | Hari 26-31: Min 6
// Sales yang aktualnya sudah mencapai target/standar minimal tidak dimasukkan ke laporan

error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/koneksi.php';

// Helper: Tentukan Periode Slice 5-harian & Minimal Target SPK/DO
function calculate5DayMilestone($day) {
    $day = intval($day);
    if ($day < 1) $day = 1;
    if ($day > 31) $day = 31;

    if ($day <= 5) {
        $slice = 1;
        $min = 1;
        $range = "Hari 1 - 5";
    } elseif ($day <= 10) {
        $slice = 2;
        $min = 2;
        $range = "Hari 6 - 10";
    } elseif ($day <= 15) {
        $slice = 3;
        $min = 3;
        $range = "Hari 11 - 15";
    } elseif ($day <= 20) {
        $slice = 4;
        $min = 4;
        $range = "Hari 16 - 20";
    } elseif ($day <= 25) {
        $slice = 5;
        $min = 5;
        $range = "Hari 21 - 25";
    } else {
        $slice = 6;
        $min = 6;
        $range = "Hari 26 - Akhir Bulan";
    }

    return [
        'day' => $day,
        'slice' => $slice,
        'min_target' => $min,
        'range_label' => $range
    ];
}

// Target baseline per sales (sesuai papan produktivitas cabang)
$whiteboard_targets = [
    'indah'      => ['target_spk' => 4, 'target_do' => 3],
    'dadi'       => ['target_spk' => 3, 'target_do' => 2],
    'topik'      => ['target_spk' => 5, 'target_do' => 4],
    'andri'      => ['target_spk' => 4, 'target_do' => 3],
    'abdian'     => ['target_spk' => 4, 'target_do' => 3],
    'fadhil'     => ['target_spk' => 4, 'target_do' => 3],
    'rizky'      => ['target_spk' => 3, 'target_do' => 2],
    'udu'        => ['target_spk' => 3, 'target_do' => 2],
    'nova'       => ['target_spk' => 4, 'target_do' => 3],
    'cici'       => ['target_spk' => 3, 'target_do' => 2],
    'galih_riva' => ['target_spk' => 4, 'target_do' => 3],
    'deni_rv'    => ['target_spk' => 4, 'target_do' => 3],
    'mustofa'    => ['target_spk' => 4, 'target_do' => 3],
    'sinta'      => ['target_spk' => 4, 'target_do' => 3],
    'rizal'      => ['target_spk' => 4, 'target_do' => 3],
    'reni'       => ['target_spk' => 3, 'target_do' => 2],
    'nuri'       => ['target_spk' => 3, 'target_do' => 2],
    'egy'        => ['target_spk' => 5, 'target_do' => 3],
    'deno'       => ['target_spk' => 4, 'target_do' => 3],
    'erik'       => ['target_spk' => 4, 'target_do' => 3],
    'denia'      => ['target_spk' => 4, 'target_do' => 3],
    'yani'       => ['target_spk' => 3, 'target_do' => 2],
    'jajang'     => ['target_spk' => 3, 'target_do' => 2],
    'juarna'     => ['target_spk' => 3, 'target_do' => 2],
    'galih_ryan' => ['target_spk' => 3, 'target_do' => 2],
    'reza'       => ['target_spk' => 3, 'target_do' => 2],
    'dadan'      => ['target_spk' => 3, 'target_do' => 2],
    'fani'       => ['target_spk' => 3, 'target_do' => 2],
    'igo'        => ['target_spk' => 3, 'target_do' => 2],
    'fia'        => ['target_spk' => 5, 'target_do' => 2],
    'rahma'      => ['target_spk' => 3, 'target_do' => 2],
];

// 1. Parameter Waktu
$current_month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
if ($current_month < 1 || $current_month > 12) {
    $current_month = intval(date('n'));
}
$current_year = date('Y');
$current_day = isset($_GET['hari']) ? intval($_GET['hari']) : intval(date('j'));
if ($current_day < 1 || $current_day > 31) {
    $current_day = intval(date('j'));
}

$milestone = calculate5DayMilestone($current_day);
$min_required = $milestone['min_target'];
$slice_index = $milestone['slice'];
$range_label = $milestone['range_label'];

$nama_bulan_list = [
    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
    5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
    9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
];
$periode_str = $current_day . " " . $nama_bulan_list[$current_month] . " " . $current_year;

// 2. Ambil Data Sales yang AKTIF dari Google Spreadsheet
$q_sales = $conn->query("SELECT id, username, nama_lengkap, tingkatan, nama_spv FROM sales_accounts WHERE is_active = 1 ORDER BY nama_spv ASC, nama_lengkap ASC");

// BATCH PRE-FETCH TARGET & DYNAMIC DATA (Eliminates 92 loop queries)
$target_map = [];
$q_tgt = $conn->query("SELECT sales_account_id, target_spk, target_do, realisasi_spk, realisasi_do FROM target_do_bulanan WHERE periode_bulan = $current_month");
if ($q_tgt) {
    while ($t = $q_tgt->fetch_assoc()) {
        $target_map[intval($t['sales_account_id'])] = $t;
    }
}

$dyn_map = [];
$q_dyn = $conn->query("SELECT sales_account_id, 
    SUM(CASE WHEN status != 'Ditolak' THEN 1 ELSE 0 END) as dyn_spk,
    SUM(CASE WHEN status = 'DO' THEN 1 ELSE 0 END) as dyn_do
    FROM tabel_spk WHERE (MONTH(created_at) = $current_month OR created_at IS NULL OR created_at = '') GROUP BY sales_account_id");
if ($q_dyn) {
    while ($d = $q_dyn->fetch_assoc()) {
        $dyn_map[intval($d['sales_account_id'])] = $d;
    }
}

$underperforming = [];
$on_track = [];

if ($q_sales && $q_sales->num_rows > 0) {
    while ($row = $q_sales->fetch_assoc()) {
        $sales_id = intval($row['id']);
        $sales_name = $row['nama_lengkap'];
        $spv_name = $row['nama_spv'] ?: 'Supervisor';
        $tingkatan = $row['tingkatan'] ?: 'Executive';

        // Tentukan target baseline langsung dari Google Spreadsheet
        $tgt_spk = 3;
        $tgt_do = 3;
        $real_spk = 0;
        $real_do = 0;
        $t_row = $target_map[$sales_id] ?? null;

        if ($t_row) {
            $tgt_spk = intval($t_row['target_spk']) > 0 ? intval($t_row['target_spk']) : 3;
            $tgt_do = intval($t_row['target_do']) > 0 ? intval($t_row['target_do']) : 3;
            $real_spk = intval($t_row['realisasi_spk']);
            $real_do = intval($t_row['realisasi_do']);
        }

        // Jika dynamic SPK belum terisi manual dan nilai masih 0, ambil dari dyn_map
        if ($real_spk === 0 && $real_do === 0) {
            $d = $dyn_map[$sales_id] ?? null;
            if ($d) {
                $real_spk = max($real_spk, intval($d['dyn_spk'] ?? 0));
                $real_do = max($real_do, intval($d['dyn_do'] ?? 0));
            }
        }

        // Target bulanan sales individu
        $sales_target = max($tgt_spk, $tgt_do);
        if ($sales_target <= 0) $sales_target = 3;

        // Standar minimal 5-harian untuk sales bersangkutan (tidak melebihi target sales itu sendiri)
        $sales_min_required = min($min_required, $sales_target);

        $highest_actual = max($real_spk, $real_do);

        // ATURAN: Jika aktual sales sudah mencapai target bulanan (misal target 3 dan aktual >= 3),
        // atau sudah mencapai target minimal 5-harian saat ini, maka sales dinyatakan ON TRACK (TIDAK MASUK LAPORAN REVIEW)
        $is_passed = ($highest_actual >= $sales_target) || ($highest_actual >= $sales_min_required);
        $deficit = max(0, $sales_min_required - $highest_actual);

        // Rekomendasi Coaching AI
        $ai_advice = "";
        if ($highest_actual == 0) {
            $ai_advice = "Belum ada SPK / DO (0 Unit). Wajib pendampingan co-closing bersama SPV $spv_name.";
        } elseif ($deficit > 0) {
            $ai_advice = "Kurang $deficit unit dari target minimal $sales_min_required unit. SPV disarankan evaluasi database Hot Prospect & percepat test drive.";
        } else {
            $ai_advice = "Target terpenuhi / on-track.";
        }

        $sales_entry = [
            'sales_account_id' => $sales_id,
            'username' => $row['username'],
            'nama_sales' => $sales_name,
            'nama_spv' => $spv_name,
            'tingkatan' => $tingkatan,
            'realisasi_spk' => $real_spk,
            'realisasi_do' => $real_do,
            'target_spk' => $tgt_spk,
            'target_do' => $tgt_do,
            'sales_target' => $sales_target,
            'highest_actual' => $highest_actual,
            'min_required' => $sales_min_required,
            'deficit' => $deficit,
            'status' => $is_passed ? 'On Track' : 'Perlu Review',
            'ai_advice' => $ai_advice
        ];

        if ($is_passed) {
            $on_track[] = $sales_entry;
        } else {
            $underperforming[] = $sales_entry;
        }
    }
}

// Urutkan underperforming dari defisit tertinggi ke terendah, lalu berdasarkan SPV
usort($underperforming, function($a, $b) {
    if ($b['deficit'] !== $a['deficit']) {
        return $b['deficit'] - $a['deficit'];
    }
    return strcmp($a['nama_spv'], $b['nama_spv']);
});

$total_sales_count = count($underperforming) + count($on_track);
$needs_alert = (count($underperforming) > 0);

// 3. Susun Format Pesan WhatsApp Khusus untuk Kepala Cabang (Kacab) - Tanpa Tingkatan, Hanya Sales Yang Defisit
$wa_message = "";
if ($needs_alert) {
    $wa_message .= "🚨 *LAPORAN HARIAN AI SENTINEL KACAB* 🚨\n";
    $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
    $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
    $wa_message .= "🎯 *Standar Minimal 5-Harian*: Minimal *{$min_required} SPK / DO*\n";
    $wa_message .= "📊 *Kondisi Cabang*: *" . count($underperforming) . " dari {$total_sales_count} Sales* belum mencapai target minimal\n";
    $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $wa_message .= "📋 *DAFTAR WIRANIAGA PERLU REVIEW SPV:*\n\n";

    $no = 1;
    foreach ($underperforming as $u) {
        $wa_message .= "{$no}. 👤 *{$u['nama_sales']}* ({$u['nama_spv']})\n";
        $wa_message .= "   • Target: {$u['target_spk']} SPK / {$u['target_do']} DO (Min. Hari Ini: {$u['min_required']} Unit)\n";
        $wa_message .= "   • Aktual: *{$u['realisasi_spk']} SPK* | *{$u['realisasi_do']} DO*\n";
        $wa_message .= "   • Defisit: *-{$u['deficit']} Unit*\n";
        $wa_message .= "   • Saran AI: {$u['ai_advice']}\n\n";
        $no++;
    }

    $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    if (count($on_track) > 0) {
        $wa_message .= "✅ *Sales Capai Target / On-Track*: " . count($on_track) . " Wiraniaga aman (tidak perlu review).\n\n";
    }

    $wa_message .= "📌 *Rekomendasi Tindakan Kepala Cabang:*\n";
    $wa_message .= "1. Instruksikan SPV untuk melakukan review harian dan mendampingi closing (Co-Closing).\n";
    $wa_message .= "2. Percepat proses approval diskon dan kredit untuk prospek yang sedang berjalan.";
} else {
    $wa_message .= "✅ *LAPORAN HARIAN AI SENTINEL KACAB: SEMUA ON-TRACK* ✅\n";
    $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
    $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
    $wa_message .= "🎯 *Standar Minimal 5-Harian*: Minimal *{$min_required} SPK / DO*\n";
    $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $wa_message .= "Yth. Bapak Kepala Cabang,\n";
    $wa_message .= "Seluruh *{$total_sales_count} Wiraniaga Cabang* telah berhasil mencapai target minimal pada periode ini. Kinerja operasional cabang berjalan optimal. 💪🔥";
}

$wa_url = "https://api.whatsapp.com/send?text=" . urlencode($wa_message);

// Response JSON
echo json_encode([
    "status" => "success",
    "milestone" => [
        "current_day" => $current_day,
        "periode_bulan" => $current_month,
        "periode_slice" => $slice_index,
        "range_label" => $range_label,
        "min_required_spk_do" => $min_required,
        "periode_str" => $periode_str
    ],
    "summary" => [
        "total_sales" => $total_sales_count,
        "underperforming_count" => count($underperforming),
        "on_track_count" => count($on_track),
        "needs_alert" => $needs_alert
    ],
    "underperforming_sales" => $underperforming,
    "on_track_sales" => $on_track,
    "wa_report_message" => $wa_message,
    "wa_share_url" => $wa_url
]);

if ($conn) {
    $conn->close();
}
exit();
