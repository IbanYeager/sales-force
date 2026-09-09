<?php
// api/api_ai_kacab_sentinel.php
// AI Daily Sentinel & Early Warning System for Kepala Cabang (Kacab)
// Aturan: Target akumulasi minimal SPK dibagi per 5 hari (STRICTLY FOR SPK):
// Hari 1-5: Min 1 SPK | Hari 6-10: Min 2 SPK | Hari 11-15: Min 3 SPK | Hari 16-20: Min 4 SPK | Hari 21-25: Min 5 SPK | Hari 26-31: Min 6 SPK
// Note: Realisasi DO dilaporkan untuk tracking progress, tetapi DO TIDAK memiliki batas minimal & tidak menyebabkan defisit penalty.
// Memiliki 3 Siklus Sesi Laporan: Pagi (Briefing 07:00), Siang (Update 12:00), Sore (Closing 17:00).
// Laporan WhatsApp dikelompokkan secara rapi per Tim SPV (tidak berulang per sales).

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

// Helper: Tentukan Periode Slice 5-harian & Minimal Target SPK
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

// 1. Parameter Waktu & Sesi
$current_month = isset($_GET['bulan']) ? intval($_GET['bulan']) : intval(date('n'));
if ($current_month < 1 || $current_month > 12) {
    $current_month = intval(date('n'));
}
$current_year = date('Y');
$current_day = isset($_GET['hari']) ? intval($_GET['hari']) : intval(date('j'));
if ($current_day < 1 || $current_day > 31) {
    $current_day = intval(date('j'));
}

// Tentukan sesi: pagi (07:00 / briefing), siang (12:00 / update), sore (17:00 / closing)
$current_hour = intval(date('G'));
$session = isset($_GET['session']) ? strtolower(trim($_GET['session'])) : '';
if (!in_array($session, ['pagi', 'siang', 'sore'])) {
    if ($current_hour < 11) {
        $session = 'pagi';
    } elseif ($current_hour < 16) {
        $session = 'siang';
    } else {
        $session = 'sore';
    }
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

// 2. Ambil Data Sales yang AKTIF dari Google Spreadsheet / DB
$q_sales = $conn->query("SELECT id, username, nama_lengkap, tingkatan, nama_spv FROM sales_accounts WHERE is_active = 1 ORDER BY nama_spv ASC, nama_lengkap ASC");

// BATCH PRE-FETCH TARGET & DYNAMIC DATA
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
$total_spk_cabang = 0;
$total_do_cabang = 0;

if ($q_sales && $q_sales->num_rows > 0) {
    while ($row = $q_sales->fetch_assoc()) {
        $sales_id = intval($row['id']);
        $sales_name = $row['nama_lengkap'];
        $spv_name = $row['nama_spv'] ?: 'Supervisor';
        $tingkatan = $row['tingkatan'] ?: 'Executive';

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

        if ($real_spk === 0 && $real_do === 0) {
            $d = $dyn_map[$sales_id] ?? null;
            if ($d) {
                $real_spk = max($real_spk, intval($d['dyn_spk'] ?? 0));
                $real_do = max($real_do, intval($d['dyn_do'] ?? 0));
            }
        }

        $total_spk_cabang += $real_spk;
        $total_do_cabang += $real_do;

        // Standar minimal 5-harian DITERAPKAN KHUSUS UNTUK SPK
        $sales_min_required = min($min_required, $tgt_spk);

        $is_passed = ($real_spk >= $tgt_spk) || ($real_spk >= $sales_min_required);
        $deficit = max(0, $sales_min_required - $real_spk);

        // Individual AI advice (for Web UI card view)
        $ai_advice = "";
        if ($session === 'pagi') {
            if ($real_spk == 0) {
                $ai_advice = "Fokus Pagi: Belum ada SPK (0 Unit). Evaluasi list prospek & jadwalkan min 3 canvassing/test-drive hari ini. Wajib pendampingan SPV $spv_name.";
            } elseif ($deficit > 0) {
                $ai_advice = "Fokus Pagi: Defisit -$deficit SPK dari min. $sales_min_required SPK. SPV $spv_name mohon dorong penutupan SPK dari database Hot Prospect hari ini.";
            } else {
                $ai_advice = "Pagi: Target SPK aman ($real_spk SPK). Fokus pendampingan closing sales lain & dorong penyelesaian DO ($real_do DO).";
            }
        } elseif ($session === 'siang') {
            if ($real_spk == 0) {
                $ai_advice = "Update Siang: Belum ada SPK (0 Unit). SPV $spv_name mohon cek hasil follow-up prospek pagi ini.";
            } elseif ($deficit > 0) {
                $ai_advice = "Update Siang: Kurang $deficit SPK dari min. $sales_min_required SPK. Dorong penutupan transaksi prospek hangat siang ini.";
            } else {
                $ai_advice = "Update Siang: SPK On-track ($real_spk SPK | $real_do DO). Pertahankan ritme hingga sore.";
            }
        } else {
            if ($real_spk == 0) {
                $ai_advice = "Closing Sore: 0 SPK. Wajib evaluasi komprehensif bersama SPV $spv_name untuk penyusunan strategi esok hari.";
            } elseif ($deficit > 0) {
                $ai_advice = "Closing Sore: Masih defisit -$deficit SPK. Siapkan daftar konsumen prioritas untuk di-follow up besok pagi.";
            } else {
                $ai_advice = "Closing Sore: Kinerja SPK tercapai ($real_spk SPK | $real_do DO). Siapkan pengiriman unit DO selanjutnya.";
            }
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

// Group underperforming sales by SPV team
$under_by_spv = [];
foreach ($underperforming as $u) {
    $spv = $u['nama_spv'] ?: 'Supervisor';
    if (!isset($under_by_spv[$spv])) {
        $under_by_spv[$spv] = [];
    }
    $under_by_spv[$spv][] = $u;
}

// Sort each SPV team's sales by deficit descending
foreach ($under_by_spv as $spv_key => &$s_list) {
    usort($s_list, function($a, $b) {
        if ($b['deficit'] !== $a['deficit']) {
            return $b['deficit'] - $a['deficit'];
        }
        return strcmp($a['nama_sales'], $b['nama_sales']);
    });
}
unset($s_list);

$total_sales_count = count($underperforming) + count($on_track);
$needs_alert = (count($underperforming) > 0);

// 3. Susun Format Pesan WhatsApp Terstruktur & Rapi Per Tim SPV
$wa_message = "";

if ($session === 'pagi') {
    // ── SESI PAGI (07:00 WIB) - SARAN BRIEFING PAGI ──
    if ($needs_alert) {
        $wa_message .= "🌅 *SARAN BRIEFING PAGI KACAB - AI SENTINEL* 🌅\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🎯 *Target Minimal SPK*: Minimal *{$min_required} SPK* (s.d. hari ini)\n";
        $wa_message .= "📊 *Status Tim*: *" . count($underperforming) . " dari {$total_sales_count} Sales* belum mencapai target minimal SPK\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "📋 *FOKUS BRIEFING PER TIM SUPERVISOR (SPV):*\n\n";

        foreach ($under_by_spv as $spv_name => $sales_list) {
            $cnt_spv = count($sales_list);
            $wa_message .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Perlu Review):\n";

            $no_spv = 1;
            $zero_spk_cnt = 0;
            foreach ($sales_list as $u) {
                if ($u['realisasi_spk'] == 0) $zero_spk_cnt++;
                $wa_message .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']}/{$u['target_spk']}* (Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']}/{$u['target_do']}*\n";
                $no_spv++;
            }

            $team_advice = "";
            if ($zero_spk_cnt == $cnt_spv) {
                $team_advice = "Seluruh {$cnt_spv} sales tim {$spv_name} belum mencatat SPK (0 Unit). SPV {$spv_name} wajib evaluasi ulang list prospek & lakukan pendampingan co-closing harian.";
            } elseif ($zero_spk_cnt > 0) {
                $team_advice = "{$zero_spk_cnt} dari {$cnt_spv} sales tim {$spv_name} masih 0 SPK. SPV {$spv_name} mohon prioritaskan pendampingan closing & pastikan min. 3 canvassing/test-drive per sales hari ini.";
            } else {
                $team_advice = "{$cnt_spv} sales tim {$spv_name} masih defisit SPK. SPV {$spv_name} mohon dorong penutupan SPK dari database Hot Prospect tim hari ini.";
            }

            $wa_message .= "   💡 *Saran Briefing Tim {$spv_name}*: {$team_advice}\n\n";
        }

        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        if (count($on_track) > 0) {
            $wa_message .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales aman (tidak perlu review).\n\n";
        }

        $wa_message .= "📌 *REKOMENDASI ARAHAN UTAMA KECABANGAN (BRIEFING PAGI):*\n";
        $wa_message .= "1. Instruksikan setiap SPV untuk melakukan review harian dan mendampingi closing (Co-Closing) sales yang defisit SPK.\n";
        $wa_message .= "2. Evaluasi daftar Hot Prospect & pastikan jadwal test drive harian terdaftar.\n";
        $wa_message .= "3. Percepat proses approval diskon dan permohonan kredit pending.";
    } else {
        $wa_message .= "✅ *BRIEFING PAGI KACAB: SELURUH SALES ON-TRACK* ✅\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🎯 *Target Minimal SPK*: Minimal *{$min_required} SPK*\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "Yth. Bapak Kepala Cabang,\n";
        $wa_message .= "Seluruh *{$total_sales_count} Wiraniaga Cabang* telah berhasil mencapai target minimal SPK pada periode ini. Briefing pagi dapat difokuskan pada dorongan akselerasi DO dan perolehan SPK tambahan! 💪🔥";
    }

} elseif ($session === 'siang') {
    // ── SESI SIANG (12:00 WIB) - UPDATE SPK & DO ──
    if ($needs_alert) {
        $wa_message .= "☀️ *UPDATE SPK & DO SIANG (12:00 WIB) - AI SENTINEL* ☀️\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🎯 *Target Minimal SPK*: Minimal *{$min_required} SPK*\n";
        $wa_message .= "📊 *Capaian Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "📋 *PROGRESS MONITORING PER TIM SPV:*\n\n";

        foreach ($under_by_spv as $spv_name => $sales_list) {
            $cnt_spv = count($sales_list);
            $wa_message .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Monitoring SPK):\n";

            $no_spv = 1;
            foreach ($sales_list as $u) {
                $wa_message .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']} SPK* (Min: {$u['min_required']} | Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']} DO*\n";
                $no_spv++;
            }

            $wa_message .= "   💡 *Status Siang Tim {$spv_name}*: SPV {$spv_name} mohon pantau progress follow-up siang. Dorong penutupan transaksi prospek hangat sebelum sore.\n\n";
        }

        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        if (count($on_track) > 0) {
            $wa_message .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales aman.\n\n";
        }

        $wa_message .= "📌 *REKOMENDASI SIANG KEPALA CABANG:*\n";
        $wa_message .= "1. Cek progress follow-up siang tim SPV terhadap konsumen prospek hangat.\n";
        $wa_message .= "2. Pastikan pengiriman unit DO yang dijadwalkan hari ini berjalan lancar.";
    } else {
        $wa_message .= "✅ *UPDATE SPK & DO SIANG: PERFORMA OPTIMAL* ✅\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🎯 *Target Minimal SPK*: Minimal *{$min_required} SPK*\n";
        $wa_message .= "📊 *Capaian Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "Yth. Bapak Kepala Cabang,\n";
        $wa_message .= "Performa cabang hingga siang ini sangat baik. Seluruh sales telah memenuhi standar ritme SPK. Kinerja operasional cabang berjalan lancar! 👍🔥";
    }

} else {
    // ── SESI SORE (17:00 WIB) - UPDATE CLOSING SORE ──
    if ($needs_alert) {
        $wa_message .= "🌆 *UPDATE CLOSING SPK & DO SORE (17:00 WIB) - AI SENTINEL* 🌆\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🎯 *Target Minimal SPK*: Minimal *{$min_required} SPK*\n";
        $wa_message .= "🏆 *Hasil Closing Cabang*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "📋 *REKAP CLOSING SORE PER TIM SPV:*\n\n";

        foreach ($under_by_spv as $spv_name => $sales_list) {
            $cnt_spv = count($sales_list);
            $wa_message .= "👔 *TIM {$spv_name}* ({$cnt_spv} Sales Perlu Perhatian Besok):\n";

            $no_spv = 1;
            foreach ($sales_list as $u) {
                $wa_message .= "   {$no_spv}. *{$u['nama_sales']}* — SPK: *{$u['realisasi_spk']} SPK* (Defisit: -{$u['deficit']}) | DO: *{$u['realisasi_do']} DO*\n";
                $no_spv++;
            }

            $wa_message .= "   💡 *Evaluasi Sore Tim {$spv_name}*: Wajib evaluasi komprehensif bersama tim {$spv_name} untuk menyusun prioritas prospek esok pagi.\n\n";
        }

        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        if (count($on_track) > 0) {
            $wa_message .= "✅ *Wiraniaga SPK On-Track*: " . count($on_track) . " Sales tuntas.\n\n";
        }

        $wa_message .= "📌 *REKOMENDASI CLOSING SORE KEPALA CABANG:*\n";
        $wa_message .= "1. Rekap hasil perolehan SPK harian & evaluasi hambatan penutupan prospek bersama SPV.\n";
        $wa_message .= "2. Pastikan input SPK baru dan jadwal serah terima unit DO esok hari terverifikasi.";
    } else {
        $wa_message .= "✅ *UPDATE CLOSING SORE: TARGET MINIMAL TERPENUHI* ✅\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $wa_message .= "📅 *Tanggal*: {$periode_str}\n";
        $wa_message .= "⏱️ *Siklus*: {$range_label} (Periode Ke-{$slice_index})\n";
        $wa_message .= "🏆 *Hasil Closing Hari Ini*: Total *{$total_spk_cabang} SPK* & *{$total_do_cabang} DO*\n";
        $wa_message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $wa_message .= "Yth. Bapak Kepala Cabang,\n";
        $wa_message .= "Closing harian cabang berjalan sukses! Seluruh wiraniaga berhasil memenuhi standar ritme SPK untuk periode ini. Terima kasih atas kepemimpinan Anda! 🎉💪";
    }
}

$wa_url = "https://api.whatsapp.com/send?text=" . urlencode($wa_message);

// Response JSON
echo json_encode([
    "status" => "success",
    "session" => $session,
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
        "total_spk_cabang" => $total_spk_cabang,
        "total_do_cabang" => $total_do_cabang,
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
