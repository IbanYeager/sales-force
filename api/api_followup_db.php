<?php
// api_followup_db.php - Database connection & migration engine for Follow-Up CRM in SFT
date_default_timezone_set('Asia/Jakarta');
error_reporting(0);
ini_set('display_errors', 0);

// Try MySQL connection first (from sft/api/koneksi.php)
$is_mysql = false;
$conn = null;

if (file_exists(__DIR__ . '/koneksi.php')) {
    include __DIR__ . '/koneksi.php';
    if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
        $is_mysql = true;
    }
}

// If MySQL is offline or not available, use SQLite PDO fallback
$sqlite_pdo = null;
if (!$is_mysql) {
    try {
        $sqlite_path = __DIR__ . '/followup_database.sqlite';
        $sqlite_pdo = new PDO("sqlite:" . $sqlite_path);
        $sqlite_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlite_pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $sqlite_pdo = null;
    }
}

/**
 * Universal query helper that works seamlessly on MySQL ($conn) or SQLite ($sqlite_pdo)
 */
function followup_query($sql, $params = []) {
    global $is_mysql, $conn, $sqlite_pdo;

    if ($is_mysql && $conn) {
        if (empty($params)) {
            $res = $conn->query($sql);
            if (!$res) return [];
            if ($res === true) return true;
            $data = [];
            while ($row = $res->fetch_assoc()) {
                $data[] = $row;
            }
            return $data;
        } else {
            $stmt = $conn->prepare($sql);
            if (!$stmt) return false;
            
            $types = "";
            $bindParams = [];
            foreach ($params as &$val) {
                if (is_int($val)) $types .= "i";
                elseif (is_double($val)) $types .= "d";
                else $types .= "s";
                $bindParams[] = &$val;
            }
            array_unshift($bindParams, $types);
            call_user_func_array([$stmt, 'bind_param'], $bindParams);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result) {
                $data = [];
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                $stmt->close();
                return $data;
            }
            $last_id = $stmt->insert_id;
            $affected = $stmt->affected_rows;
            $stmt->close();
            return ['lastID' => $last_id, 'affected' => $affected];
        }
    } elseif ($sqlite_pdo) {
        $stmt = $sqlite_pdo->prepare($sql);
        $stmt->execute($params);
        if (stripos(trim($sql), 'SELECT') === 0 || stripos(trim($sql), 'PRAGMA') === 0 || stripos(trim($sql), 'SHOW') === 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return ['lastID' => $sqlite_pdo->lastInsertId(), 'affected' => $stmt->rowCount()];
    }
    return [];
}

/**
 * Execute single statement
 */
function followup_execute($sql, $params = []) {
    global $is_mysql, $conn, $sqlite_pdo;
    if ($is_mysql && $conn) {
        if (empty($params)) {
            return $conn->query($sql);
        }
        return followup_query($sql, $params);
    } elseif ($sqlite_pdo) {
        $stmt = $sqlite_pdo->prepare($sql);
        return $stmt->execute($params);
    }
    return false;
}

if (!function_exists('clean_phone_number')) {
    function clean_phone_number($phone) {
        if (!$phone) return '';
        $clean = preg_replace('/[^0-9]/', '', (string)$phone);
        if (str_starts_with($clean, '0')) {
            $clean = '62' . substr($clean, 1);
        } elseif (str_starts_with($clean, '8')) {
            $clean = '62' . $clean;
        }
        return $clean;
    }
}

/**
 * Auto-initialize database tables
 */
function init_followup_tables() {
    global $is_mysql;

    if ($is_mysql) {
        // MySQL Tables
        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_code VARCHAR(100) UNIQUE,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                email VARCHAR(150),
                car_model VARCHAR(255) NOT NULL,
                last_car_model VARCHAR(255),
                car_age VARCHAR(100),
                recommended_model VARCHAR(255),
                alt_model_2 VARCHAR(255),
                alt_model_3 VARCHAR(255),
                cluster_name VARCHAR(150),
                priority VARCHAR(100),
                district VARCHAR(150),
                service_compliance VARCHAR(100),
                outlet_do VARCHAR(255),
                outlet_service VARCHAR(255),
                plate_number VARCHAR(50),
                vin VARCHAR(100),
                purchase_date VARCHAR(50),
                service_due_date VARCHAR(50),
                stnk_due_date VARCHAR(50),
                insurance_due_date VARCHAR(50),
                assigned_sales_id INT,
                followup_category VARCHAR(150) DEFAULT 'Servis Berkala',
                followup_status VARCHAR(100) DEFAULT 'Belum Dihubungi',
                last_contacted_at DATETIME,
                last_template_used VARCHAR(255),
                notes TEXT,
                connected VARCHAR(20) DEFAULT 'FALSE',
                contacted VARCHAR(20) DEFAULT 'FALSE',
                prospect VARCHAR(20) DEFAULT 'FALSE',
                spk VARCHAR(20) DEFAULT 'FALSE',
                remarks VARCHAR(100) DEFAULT '',
                sales_fu_status VARCHAR(50) DEFAULT 'Open',
                reason_followup TEXT,
                followup_date DATETIME,
                custom_fields TEXT,
                sync_source VARCHAR(50) DEFAULT 'system',
                sheet_row_index INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // Safe column migration for MySQL
        $cols = [
            'connected' => "VARCHAR(20) DEFAULT 'FALSE'",
            'contacted' => "VARCHAR(20) DEFAULT 'FALSE'",
            'prospect' => "VARCHAR(20) DEFAULT 'FALSE'",
            'spk' => "VARCHAR(20) DEFAULT 'FALSE'",
            'remarks' => "VARCHAR(100) DEFAULT ''",
            'sales_fu_status' => "VARCHAR(50) DEFAULT 'Open'",
            'reason_followup' => "TEXT",
            'followup_date' => "DATETIME",
            'is_orphan' => "TINYINT(1) DEFAULT 0",
            'ex_sales_name' => "VARCHAR(150) NULL",
            'released_at' => "DATETIME NULL"
        ];
        foreach ($cols as $colName => $colDef) {
            $check = followup_query("SHOW COLUMNS FROM followup_customers LIKE '$colName'");
            if (empty($check)) {
                followup_execute("ALTER TABLE followup_customers ADD COLUMN $colName $colDef");
            }
        }

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                is_default INT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                sales_id INT,
                sales_name VARCHAR(150),
                action_type VARCHAR(100) NOT NULL,
                old_status VARCHAR(100),
                new_status VARCHAR(100),
                note TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    } else {
        // SQLite Tables Fallback
        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_code TEXT UNIQUE,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                car_model TEXT NOT NULL,
                last_car_model TEXT,
                car_age TEXT,
                recommended_model TEXT,
                alt_model_2 TEXT,
                alt_model_3 TEXT,
                cluster_name TEXT,
                priority TEXT,
                district TEXT,
                service_compliance TEXT,
                outlet_do TEXT,
                outlet_service TEXT,
                plate_number TEXT,
                vin TEXT,
                purchase_date TEXT,
                service_due_date TEXT,
                stnk_due_date TEXT,
                insurance_due_date TEXT,
                assigned_sales_id INTEGER,
                followup_category TEXT DEFAULT 'Servis Berkala',
                followup_status TEXT DEFAULT 'Belum Dihubungi',
                last_contacted_at DATETIME,
                last_template_used TEXT,
                notes TEXT,
                connected TEXT DEFAULT 'FALSE',
                contacted TEXT DEFAULT 'FALSE',
                prospect TEXT DEFAULT 'FALSE',
                spk TEXT DEFAULT 'FALSE',
                remarks TEXT DEFAULT '',
                sales_fu_status TEXT DEFAULT 'Open',
                reason_followup TEXT,
                followup_date DATETIME,
                custom_fields TEXT,
                sync_source TEXT DEFAULT 'system',
                sheet_row_index INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                is_default INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                sales_id INTEGER,
                sales_name TEXT,
                action_type TEXT NOT NULL,
                old_status TEXT,
                new_status TEXT,
                note TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        followup_execute("
            CREATE TABLE IF NOT EXISTS followup_settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    // Seed default settings if empty
    $chkSet = followup_query("SELECT setting_key FROM followup_settings LIMIT 1");
    if (empty($chkSet)) {
        $settings = [
            ['dealer_name', 'Tunas Toyota Kiara Condong'],
            ['dealer_address', 'Jl. Kiaracondong No. 440, Bandung, Jawa Barat'],
            ['dealer_phone', '(022) 731-8888'],
            ['google_sheet_url', ''],
            ['google_apps_script_url', ''],
            ['auto_sync_interval', '15'],
            ['last_sync_time', ''],
            ['sync_status', 'Siap Digunakan']
        ];
        foreach ($settings as $s) {
            followup_execute("INSERT INTO followup_settings (setting_key, setting_value) VALUES (?, ?)", [$s[0], $s[1]]);
        }
    }

    // Seed default templates if empty
    $chkTmpl = followup_query("SELECT id FROM followup_templates LIMIT 1");
    if (empty($chkTmpl)) {
        $templates = [
            [
                'Servis Berkala 1.000 KM (Gratis Cek Awal)',
                'servis',
                "Halo Bpk/Ibu *{nama_customer}*,\n\nSalam hangat dari saya *{nama_sales}* - *{dealer}* 🚗✨\n\nSemoga mobil kesayangan *{tipe_mobil}* selalu memberikan kenyamanan bagi Bpk/Ibu dan keluarga.\n\nKami menginfokan bahwa kendaraan Bpk/Ibu sudah memasuki masa *Servis Berkala 1.000 KM* (Free Biaya Jasa & Pengecekan 100% Gratis).\n\nApakah kami bantu jadwalkan Booking Servis di bengkel resmi Tunas Toyota Kiaracondong agar tidak perlu antre?\n\nMohon kabari kami jika ingin dijadwalkan ya Bpk/Ibu. Terima kasih! 🙏😊",
                0
            ],
            [
                'Follow Up Repurchase & Upgrade Unit (Attack List)',
                'tradein',
                "Halo Bpk/Ibu *{nama_customer}*,\n\nSalam hormat dari saya *{nama_sales}* - *{dealer}* 🚗✨\n\nSemoga mobil kesayangan Bpk/Ibu *{kendaraan_terakhir}* ({usia_kendaraan}) selalu nyaman digunakan bersama keluarga.\n\nBulan ini dealer kami memiliki *Special Loyalty Upgrade Program* khusus pelanggan setia Toyota. Kami menyiapkan penawaran trade-in spesial dengan taksiran harga tertinggi untuk upgrade ke unit *{model_rekomendasi}*.\n\nKeuntungan Spesial:\n✅ Subsidi Trade-in & Ekstra Cashback\n✅ Bunga Spesial 0% / DP Ringan\n✅ Layanan appraisal gratis ke rumah Bpk/Ibu di {kecamatan}\n\nBoleh saya kirimkan detail promo & simulasi perhitungannya Bpk/Ibu? Terima kasih! 🙏",
                1
            ],
            [
                'Pengingat Perpanjangan STNK & Pajak Tahunan',
                'stnk',
                "Halo Bpk/Ibu *{nama_customer}*,\n\nSaya *{nama_sales}* dari *{dealer}*.\n\nSekadar info pengingat ramah, STNK kendaraan *{tipe_mobil}* (*{nopol}*) diperkirakan akan jatuh tempo pada *{jatuh_tempo_stnk}*.\n\nJika Bpk/Ibu membutuhkan bantuan perpanjangan STNK / Pajak tanpa antre di Samsat, kami dari Tunas Toyota Kiaracondong siap membantu prosesnya.\n\nSilakan hubungi saya untuk info berkas yang diperlukan ya Bpk/Ibu. Terima kasih! 🚘",
                0
            ],
            [
                'Customer Satisfaction (CSAT) & Tanya Kabar',
                'csat',
                "Selamat pagi/siang Bpk/Ibu *{nama_customer}*,\n\nSaya *{nama_sales}*, konsultan sales Bpk/Ibu di *{dealer}*.\n\nBagaimana pengalaman berkendara dengan *{tipe_mobil}* selama ini? Apakah semuanya berjalan nyaman dan memuaskan? 🥰\n\nJika ada pertanyaan mengenai fitur kendaraan atau layanan aftersales lainnya, jangan ragu untuk kontak saya ya Bpk/Ibu.\n\nSalam hormat untuk keluarga tercinta!",
                0
            ]
        ];

        foreach ($templates as $t) {
            followup_execute("INSERT INTO followup_templates (title, category, content, is_default) VALUES (?, ?, ?, ?)", [$t[0], $t[1], $t[2], $t[3]]);
        }
    }
}

// Run table initialization once if not yet initialized
if (!file_exists(__DIR__ . '/.followup_db_migrated')) {
    init_followup_tables();
    @touch(__DIR__ . '/.followup_db_migrated');
}
