<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leasing Approval Odds &amp; Comparison Matrix - Tunas Toyota</title>
    <meta name="description" content="Matriks Perbandingan Leasing & Kalkulator Skoring Peluang Persetujuan Kredit Nasabah Tunas Toyota Kiara Condong.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css?v=5.0">
    <script src="../js/sidebar_desktop.js"></script>

    <style>
        :root {
            --toyota-red: #c8102e;
            --toyota-navy: #0d1b3e;
            --surface: #ffffff;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #0f172a;
        }

        .matrix-hero {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #0284c7 100%);
            border-radius: 24px;
            padding: 26px 28px;
            color: white;
            margin-bottom: 24px;
            box-shadow: 0 12px 30px rgba(13, 27, 62, 0.15);
            position: relative;
            overflow: hidden;
        }

        .matrix-grid {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: 20px;
            align-items: start;
        }

        @media (max-width: 950px) {
            .matrix-grid {
                grid-template-columns: 1fr;
            }
        }

        .styled-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 22px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
            margin-bottom: 20px;
        }

        /* Leasing Table Matrix */
        .leasing-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
            margin-top: 14px;
        }

        .leasing-table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
        }

        .leasing-table td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            color: #1e293b;
        }

        .leasing-table tr:hover {
            background: #f8fafc;
        }

        .badge-partner {
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            display: inline-block;
        }

        .badge-taf { background: #fee2e2; color: #b91c1c; }
        .badge-acc { background: #dbeafe; color: #1e40af; }
        .badge-bca { background: #dcfce7; color: #15803d; }
        .badge-mtf { background: #fef3c7; color: #b45309; }
        .badge-maybank { background: #fae8ff; color: #86198f; }

        /* Score Meter Box */
        .odds-meter-box {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 20px;
            padding: 22px;
            text-align: center;
            margin-top: 18px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
        }

        .odds-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 6px solid #10b981;
            margin: 12px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(16, 185, 129, 0.1);
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
        }

        .odds-number {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 900;
            color: #34d399;
            line-height: 1;
        }

        .odds-label {
            font-size: 11px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
        }

        .styled-input {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: #f8fafc;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s;
            margin-bottom: 12px;
        }

        .styled-input:focus {
            border-color: #0284c7;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .form-label {
            font-size: 11.5px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            margin-bottom: 4px;
            display: block;
        }
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 1200px;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Leasing Approval Odds &amp; Comparison Matrix</h2>
        </header>

        <div class="container" style="margin-top: 18px;">
            
            <!-- HERO HEADER -->
            <div class="matrix-hero">
                <span style="background:rgba(255,255,255,0.2); color:#bae6fd; font-size:11px; font-weight:800; padding:4px 12px; border-radius:20px; text-transform:uppercase;">
                    <i class="fa-solid fa-scale-balanced"></i> Financial Intelligence Hub
                </span>
                <h2 style="font-family:'Outfit',sans-serif; font-size:24px; font-weight:900; margin:8px 0 4px; color:white;">Matriks Komparasi &amp; Prediktor Approval Leasing</h2>
                <p style="font-size:13px; color:#e0f2fe; margin:0;">Bandingkan rate bunga rekanan resmi Tunas Toyota dan hitung persentase kelayakan kredit nasabah sebelum pengajuan PO.</p>
            </div>

            <!-- MAIN GRID -->
            <div class="matrix-grid">
                
                <!-- LEFT: SCORING PREDICTOR FORM -->
                <div class="styled-card">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:18px;">
                            <i class="fa-solid fa-calculator"></i>
                        </div>
                        <div>
                            <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; margin:0; color:#0f172a;">Kalkulator Profil &amp; Peluang Approval Nasabah</h3>
                            <p style="font-size:11.5px; color:#64748b; margin:0;">Masukkan profil konsumen untuk mendapatkan estimasi kelayakan kredit.</p>
                        </div>
                    </div>

                    <label class="form-label">1. Pekerjaan / Sumber Penghasilan</label>
                    <select id="profesi" class="styled-input" onchange="calculateOdds()">
                        <option value="pns">PNS / BUMN / Dokter / Profesi Medis Tetap (Skor Tertinggi)</option>
                        <option value="swasta_tetap" selected>Karyawan Swasta Tetap (Masa Kerja > 2 Tahun)</option>
                        <option value="wiraswasta_lama">Pengusaha / Wiraswasta (Usaha > 2 Tahun + Mutasi Bank Aktif)</option>
                        <option value="wiraswasta_baru">Pengusaha Baru / Usaha Mandiri (< 1 Tahun)</option>
                        <option value="swasta_kontrak">Karyawan Kontrak / Freelance</option>
                        <option value="luar_kota">Domisili KTP Luar Bandung / Rumah Kontrak</option>
                    </select>

                    <label class="form-label">2. Riwayat BI Checking / SLIK OJK</label>
                    <select id="slik" class="styled-input" onchange="calculateOdds()">
                        <option value="bersih" selected>Kolektibilitas 1 (Lancar Bersih Tanpa Catatan)</option>
                        <option value="pernah_telat">Pernah Terlambat < 30 Hari (Sudah Lunas)</option>
                        <option value="fresh">Fresh (Belum Pernah Ambil Kredit Sama Sekali)</option>
                        <option value="macet">Ada Tunggakan Paylater / Kartu Kredit Aktif</option>
                    </select>

                    <label class="form-label">3. Rasio Angsuran vs Penghasilan Bulanan (DSR)</label>
                    <select id="dsr" class="styled-input" onchange="calculateOdds()">
                        <option value="dsr_rendah" selected>Angsuran Ringan (< 30% dari Total Gaji Bersih)</option>
                        <option value="dsr_sedang">Angsuran Sedang (30% - 45% dari Gaji Bersih)</option>
                        <option value="dsr_tinggi">Angsuran Cukup Berat (> 50% dari Gaji Bersih)</option>
                    </select>

                    <label class="form-label">4. Besaran Uang Muka (DP %)</label>
                    <select id="dp" class="styled-input" onchange="calculateOdds()">
                        <option value="dp_30" selected>DP Aman 25% - 30%+ (Peluang Sangat Tinggi)</option>
                        <option value="dp_20">DP Standar 20%</option>
                        <option value="dp_15">DP Minim 15%</option>
                        <option value="dp_10">DP Super Ringan 10%</option>
                    </select>

                    <label class="form-label">5. Status Kepemilikan Rumah Tinggal</label>
                    <select id="rumah" class="styled-input" onchange="calculateOdds()">
                        <option value="sendiri" selected>Rumah Milik Sendiri / Orang Tua (Atas Nama Pribadi/Keluarga)</option>
                        <option value="kpr">KPR Berjalan (Pembayaran Lancar)</option>
                        <option value="sewa">Rumah Kontrak / Sewa Tahunan</option>
                    </select>

                    <!-- ODDS METER RESULT BOX -->
                    <div class="odds-meter-box" id="oddsMeterBox">
                        <span style="font-size:11px; color:#94a3b8; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Prediksi Kelayakan Kredit</span>
                        <div class="odds-circle" id="oddsCircleElem">
                            <span class="odds-number" id="oddsValue">94%</span>
                            <span class="odds-label">Approval Odds</span>
                        </div>
                        <div style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; color:#34d399;" id="oddsStatusText">Peluang Sangat Tinggi</div>
                        <p style="font-size:12px; color:#cbd5e1; margin:8px 0 14px;" id="oddsSummaryDesc">Profil nasabah sangat kuat. Leasing prioritas utama disarankan melalui TAF atau BCA Finance.</p>
                        
                        <div style="background:rgba(255,255,255,0.08); border-radius:12px; padding:12px; text-align:left; font-size:12px;">
                            <strong style="color:#fde047;"><i class="fa-solid fa-list-check"></i> Leasing Rekomendasi Utama:</strong>
                            <div id="leasingRankList" style="margin-top:6px; color:#e2e8f0; line-height:1.6;">
                                1. <strong>TAF (Toyota Astra Financial)</strong> - Approval cepat &amp; paket bunga murah.<br>
                                2. <strong>BCA Finance</strong> - Cocok untuk payroll BCA &amp; tenor panjang.
                            </div>
                        </div>

                        <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px; background:#25D366;" onclick="shareRecommendationWa()">
                            <i class="fa-brands fa-whatsapp"></i> Bagikan Rekomendasi ke Konsumen
                        </button>
                    </div>
                </div>

                <!-- RIGHT: SIDE-BY-SIDE LEASING COMPARISON MATRIX -->
                <div>
                    <div class="styled-card">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
                            <div style="width:36px; height:36px; border-radius:10px; background:#fef2f2; color:#c8102e; display:flex; align-items:center; justify-content:center; font-size:18px;">
                                <i class="fa-solid fa-building-columns"></i>
                            </div>
                            <div>
                                <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; margin:0; color:#0f172a;">Matriks Partner Leasing Resmi</h3>
                                <p style="font-size:11.5px; color:#64748b; margin:0;">Perbandingan bunga dan keunggulan leasing Tunas Toyota.</p>
                            </div>
                        </div>

                        <div style="overflow-x:auto;">
                            <table class="leasing-table">
                                <thead>
                                    <tr>
                                        <th>Leasing</th>
                                        <th>Bunga Mulai</th>
                                        <th>DP Min</th>
                                        <th>Keunggulan Spesial</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span class="badge-partner badge-taf">TAF</span><br><small style="color:#64748b;">Astra Group</small></td>
                                        <td><strong>2.77%</strong> / thn</td>
                                        <td>15%</td>
                                        <td>Paket Bunga 0% (1 Thn), Integrasi Toyota Insurance, Proses 1 Hari.</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-acc">ACC</span><br><small style="color:#64748b;">Astra Group</small></td>
                                        <td><strong>2.88%</strong> / thn</td>
                                        <td>15%</td>
                                        <td>Fleksibel data wiraswasta, proses appraisal trade-in cepat.</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-bca">BCA Finance</span><br><small style="color:#64748b;">Bank BCA</small></td>
                                        <td><strong>2.99%</strong> / thn</td>
                                        <td>20%</td>
                                        <td>Tenor hingga 6 tahun Fix &amp; Cap, approval instan nasabah prioritas BCA.</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-mtf">MTF</span><br><small style="color:#64748b;">Bank Mandiri</small></td>
                                        <td><strong>3.15%</strong> / thn</td>
                                        <td>20%</td>
                                        <td>Promo nasabah BUMN, PNS, dan pemilik rekening payroll Mandiri.</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-maybank">Maybank</span><br><small style="color:#64748b;">Maybank Fin</small></td>
                                        <td><strong>3.25%</strong> / thn</td>
                                        <td>20%</td>
                                        <td>Paket kredit mobil mewah (Vellfire, Alphard, Land Cruiser) &amp; Komersial.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- TIPS APPROVAL BERKAS -->
                    <div class="styled-card" style="background:#f8fafc; border:1px dashed #cbd5e1;">
                        <h4 style="font-family:'Outfit',sans-serif; font-size:14px; font-weight:800; color:#0f172a; margin:0 0 8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-lightbulb" style="color:#eab308;"></i> Tips Sales Agar Aplikasi Cepat Approval
                        </h4>
                        <ul style="font-size:12px; color:#475569; padding-left:18px; line-height:1.6; margin:0;">
                            <li>Lampirkan <strong>Rekening Koran 3 Bulan Terakhir</strong> dengan saldo mengendap minimal 2x nilai angsuran bulanan.</li>
                            <li>Pastikan nomor telepon kantor &amp; kontak darurat (keluarga tidak serumah) aktif saat tim survey menghubungi.</li>
                            <li>Bagi pengusaha, sertakan foto tempat usaha / stok barang dagangan dan nota penjualan berjalan.</li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function calculateOdds() {
            const profesi = document.getElementById('profesi').value;
            const slik = document.getElementById('slik').value;
            const dsr = document.getElementById('dsr').value;
            const dp = document.getElementById('dp').value;
            const rumah = document.getElementById('rumah').value;

            let score = 50;

            // Profesi Weight
            if (profesi === 'pns') score += 25;
            else if (profesi === 'swasta_tetap') score += 20;
            else if (profesi === 'wiraswasta_lama') score += 18;
            else if (profesi === 'wiraswasta_baru') score += 8;
            else if (profesi === 'swasta_kontrak') score += 5;
            else if (profesi === 'luar_kota') score += 3;

            // SLIK Weight
            if (slik === 'bersih') score += 20;
            else if (slik === 'pernah_telat') score += 5;
            else if (slik === 'fresh') score += 10;
            else if (slik === 'macet') score -= 30;

            // DSR Weight
            if (dsr === 'dsr_rendah') score += 15;
            else if (dsr === 'dsr_sedang') score += 8;
            else if (dsr === 'dsr_tinggi') score -= 15;

            // DP Weight
            if (dp === 'dp_30') score += 15;
            else if (dp === 'dp_20') score += 10;
            else if (dp === 'dp_15') score += 4;
            else if (dp === 'dp_10') score -= 5;

            // Rumah Weight
            if (rumah === 'sendiri') score += 10;
            else if (rumah === 'kpr') score += 6;
            else if (rumah === 'sewa') score -= 5;

            score = Math.max(10, Math.min(98, score));

            document.getElementById('oddsValue').innerText = `${score}%`;

            const circle = document.getElementById('oddsCircleElem');
            const statusText = document.getElementById('oddsStatusText');
            const summaryDesc = document.getElementById('oddsSummaryDesc');
            const rankList = document.getElementById('leasingRankList');

            if (score >= 80) {
                circle.style.borderColor = '#10b981';
                statusText.style.color = '#34d399';
                statusText.innerText = 'Peluang Sangat Tinggi (Fast Approval)';
                summaryDesc.innerText = 'Profil nasabah prima. Disarankan menggunakan TAF atau BCA Finance dengan paket promo suku bunga terendah.';
                rankList.innerHTML = '1. <strong>TAF (Toyota Astra Financial)</strong> - Diskon provisi &amp; promo bunga rendah.<br>2. <strong>BCA Finance</strong> - Proses instan payroll &amp; tenor fleksibel.';
            } else if (score >= 60) {
                circle.style.borderColor = '#f59e0b';
                statusText.style.color = '#fbbf24';
                statusText.innerText = 'Peluang Sedang (Membutuhkan Data Tambahan)';
                summaryDesc.innerText = 'Peluang disetujui cukup baik. Pastikan melampirkan rekening koran 3 bulan & bukti kepemilikan usaha/slip gaji.';
                rankList.innerHTML = '1. <strong>ACC (Astra Credit Companies)</strong> - Fleksibel dalam verifikasi wiraswasta.<br>2. <strong>Mandiri Tunas Finance (MTF)</strong> - Cocok dengan tambahan data penjamin.';
            } else {
                circle.style.borderColor = '#ef4444';
                statusText.style.color = '#f87171';
                statusText.innerText = 'Peluang Berisiko (Disarankan Tambah DP)';
                summaryDesc.innerText = 'Aplikasi berpotensi membutuhkan jaminan tambahan atau penambahan DP minimal 30% agar disetujui komite leasing.';
                rankList.innerHTML = '1. <strong>ACC (Astra Credit Companies)</strong> - Dengan DP minimal 25-30%.<br>2. Opsi alternatif: Pembelian Cash Bertahap atau ganti atas nama keluarga inti.';
            }
        }

        function shareRecommendationWa() {
            const score = document.getElementById('oddsValue').innerText;
            const status = document.getElementById('oddsStatusText').innerText;
            const text = `*KONSULTASI FINANSIAL & LEASING TOYOTA*\nDealer: Tunas Toyota Kiara Condong Bandung\n\nHasil Analisis Skoring Kelayakan Kredit:\n📊 *Peluang Approval: ${score} (${status})*\n\nRekomendasi:\n${document.getElementById('oddsSummaryDesc').innerText}\n\nIngin kami bantu hitungkan simulasi cicilan resminya? Silakan hubungi kami untuk konsultasi gratis.`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }

        // Run on load
        calculateOdds();
    </script>
</body>

</html>
