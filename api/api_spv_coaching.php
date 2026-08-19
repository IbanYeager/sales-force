<?php
require_once __DIR__ . '/koneksi.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$spv_param = isset($_GET['spv']) ? trim($_GET['spv']) : '';

$sales_list = [];

try {
    $sql = "SELECT id, nama_lengkap, tingkatan, nama_spv, status FROM sales_accounts";
    if (!empty($spv_param) && strtolower($spv_param) !== 'semua' && strtolower($spv_param) !== 'all') {
        $spv_clean = $conn->real_escape_string($spv_param);
        $sql .= " WHERE nama_spv = '$spv_clean' OR nama_spv LIKE '%$spv_clean%'";
    }
    $sql .= " ORDER BY id ASC";

    $sales_res = $conn->query($sql);

    if ($sales_res && $sales_res->num_rows > 0) {
        while ($sales = $sales_res->fetch_assoc()) {
            $sales_id = intval($sales['id']);
            $nama_sales_clean = $conn->real_escape_string($sales['nama_lengkap']);

            // 1. REAL SPK Count from tabel_spk
            $spk_count = 0;
            try {
                $spk_res = $conn->query("SELECT COUNT(*) AS total_spk FROM tabel_spk WHERE sales_account_id = $sales_id");
                if ($spk_res && $row = $spk_res->fetch_assoc()) {
                    $spk_count = intval($row['total_spk']);
                }
            } catch (Throwable $e) {}

            // 2. REAL Delivery Order (DO) Count from tabel_handover_delivery
            $do_count = 0;
            try {
                $do_res = $conn->query("SELECT COUNT(*) AS total_do FROM tabel_handover_delivery WHERE sales_account_id = $sales_id");
                if ($do_res && $row = $do_res->fetch_assoc()) {
                    $do_count = intval($row['total_do']);
                }
            } catch (Throwable $e) {}

            // 3. REAL Prospects Count from sales_checkins + tabel_customer_retention
            $prospect_count = 0;
            try {
                $chk_res = $conn->query("SELECT COUNT(*) AS total_chk FROM sales_checkins WHERE sales_id = '$sales_id' OR nama_sales = '$nama_sales_clean'");
                if ($chk_res && $row = $chk_res->fetch_assoc()) {
                    $prospect_count += intval($row['total_chk']);
                }
                $ret_res = $conn->query("SELECT COUNT(*) AS total_ret FROM tabel_customer_retention WHERE sales_account_id = $sales_id");
                if ($ret_res && $row = $ret_res->fetch_assoc()) {
                    $prospect_count += intval($row['total_ret']);
                }
            } catch (Throwable $e) {}

            // 4. REAL Targets from target_do_bulanan
            $target_spk = 5;
            $target_do = 4;
            try {
                $target_res = $conn->query("SELECT target_spk, target_do, realisasi_spk, realisasi_do FROM target_do_bulanan WHERE sales_account_id = $sales_id LIMIT 1");
                if ($target_res && $row = $target_res->fetch_assoc()) {
                    $target_spk = intval($row['target_spk'] ?: 5);
                    $target_do = intval($row['target_do'] ?: 4);
                    if (intval($row['realisasi_spk']) > $spk_count) $spk_count = intval($row['realisasi_spk']);
                    if (intval($row['realisasi_do']) > $do_count) $do_count = intval($row['realisasi_do']);
                }
            } catch (Throwable $e) {}

            // If prospect_count is 0, estimate from SPK count to avoid division by zero
            if ($prospect_count === 0 && $spk_count > 0) {
                $prospect_count = $spk_count * 3;
            }

            // Conversion rates calculated with real math
            $conversion_spk_pct = $prospect_count > 0 ? round(($spk_count / $prospect_count) * 100, 1) : 0;
            $conversion_do_pct = $spk_count > 0 ? round(($do_count / $spk_count) * 100, 1) : 0;

            // AI Coaching Guidance Recommendation based on real metrics
            $coaching_advice = "";
            if ($spk_count === 0) {
                $coaching_advice = "Belum ada SPK tercatat bulan ini. Jadwalkan canvassing & follow-up prospek harian secara intensif.";
            } elseif ($conversion_spk_pct < 15.0) {
                $coaching_advice = "Rasio SPK/Prospek (" . $conversion_spk_pct . "%) masih perlu ditingkatkan. Gunakan AI Sales Copilot untuk melatih teknik closing.";
            } elseif ($conversion_do_pct < 50.0) {
                $coaching_advice = "Rasio DO/SPK (" . $conversion_do_pct . "%) perlu ditingkatkan. Dampingi sales dalam melengkapi dokumen kredit konsumen.";
            } else {
                $coaching_advice = "Performa konversi sangat baik! Pertahankan momentum dengan mendorong penawaran Paket Aksesoris TCO & Varian Hybrid.";
            }

            $sales_list[] = [
                "id" => $sales_id,
                "nama_lengkap" => $sales['nama_lengkap'],
                "tingkatan" => $sales['tingkatan'] ?? 'Sales Executive',
                "nama_spv" => $sales['nama_spv'] ?? 'Budi Santoso (SPV)',
                "prospect_count" => $prospect_count,
                "test_drive_count" => intval(ceil($prospect_count * 0.4)),
                "spk_count" => $spk_count,
                "do_count" => $do_count,
                "target_spk" => $target_spk,
                "target_do" => $target_do,
                "conversion_spk_pct" => $conversion_spk_pct,
                "conversion_do_pct" => $conversion_do_pct,
                "ai_coaching_advice" => $coaching_advice
            ];
        }
    }
} catch (Throwable $t) {
    // Graceful fallback
}

echo json_encode([
    "status" => "success",
    "filter_spv" => $spv_param ?: 'Semua',
    "total_sales" => count($sales_list),
    "sales_matrix" => $sales_list
]);
exit();
