<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Battle Card &amp; Objection Handling</title>
  <meta name="description" content="Contekan Cepat Sales & Komparasi Produk vs Kompetitor Tunas Toyota">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v=5.0">
  <link rel="stylesheet" href="../css/sales_tools.css?v=1.0">
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#0d1b3e">
  <style>
    .battle-tab-nav {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .battle-tab-btn {
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 800;
      border: 1.5px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .battle-tab-btn.active {
      background: #0d1b3e;
      color: white;
      border-color: #0d1b3e;
      box-shadow: 0 4px 12px rgba(13, 27, 62, 0.15);
    }
    .badge-win {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
    }
    .badge-lose {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
    }
    .btn-copy-script {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      margin-top: 10px;
    }
    .btn-copy-script:hover {
      background: #dbeafe;
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1100px;">

    <!-- HEADER -->
    <header class="header-page" style="background:#0d1b3e;">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Battle Card &amp; Objection Handling</h2>
    </header>

    <div class="container" style="margin-top:18px;">

      <!-- HERO BANNER -->
      <div style="background:linear-gradient(135deg, #8b0519 0%, #d7123a 100%); border-radius:18px; padding:22px 24px; color:white; margin-bottom:20px; box-shadow:0 10px 25px rgba(215,18,58,0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:9999px; font-size:11px; font-weight:800; text-transform:uppercase;">
              <i class="fa-solid fa-shield-halved"></i> Sales Armor &amp; Closing Kit
            </span>
            <h3 style="font-size:20px; font-weight:900; margin:6px 0 2px;">Contekan Kilat Negosiasi &amp; Kompetitor</h3>
            <p style="font-size:12.5px; color:rgba(255,255,255,0.85); margin:0;">Senjata sales saat customer membandingkan produk atau mengajukan keberatan harga.</p>
          </div>
          <div style="background:white; color:#0d1b3e; padding:8px 16px; border-radius:12px; font-size:12px; font-weight:800;">
            <i class="fa-solid fa-bolt" style="color:#d7123a;"></i> Update Q3 2026
          </div>
        </div>
      </div>

      <!-- MAIN TABS -->
      <div class="battle-tab-nav">
        <button class="battle-tab-btn active" id="tabBtnObjection" onclick="switchBattleTab('objection')">
          <i class="fa-solid fa-comments"></i> 🥊 Menjawab Keberatan Customer (Objections)
        </button>
        <button class="battle-tab-btn" id="tabBtnVs" onclick="switchBattleTab('vs')">
          <i class="fa-solid fa-scale-unbalanced-flip"></i> 🚗 Battle Card vs Kompetitor
        </button>
      </div>

      <!-- SEARCH BAR -->
      <div class="card" style="padding:14px; margin-bottom:18px;">
        <div style="display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:4px 14px;">
          <i class="fa-solid fa-magnifying-glass" style="color:#94a3b8;"></i>
          <input type="text" id="searchBattleInput" placeholder="Cari skrip alasan (diskon, inden, baterai hybrid, bunga, dll)..." style="width:100%; border:none; background:transparent; font-size:13px; font-weight:600; padding:8px 0; outline:none;" oninput="filterBattleContent(this.value)">
        </div>
      </div>

      <!-- SECTION 1: OBJECTION HANDLING ACCORDIONS -->
      <div id="sectionObjection" style="display:block;">

        <!-- ITEM 1 -->
        <div class="objection-accordion battle-item">
          <div class="objection-trigger" onclick="toggleAccordion(this)">
            <span><i class="fa-solid fa-circle-question" style="color:#d7123a; margin-right:8px;"></i> 1. "Di dealer sebelah / sales lain diskonnya lebih besar Rp 5–10 Juta!"</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="objection-answer">
            <p><b>🎯 Pola Pikir Sales:</b> Jangan langsung panik atau ikut potong harga tanpa dasar. Bawa customer ke total <i>Value of Ownership</i> dan kepastian alokasi unit.</p>
            <div style="background:white; padding:12px; border-radius:10px; border-left:3px solid #10b981; margin-top:8px;">
              <b>🗣️ Contoh Skrip Bicara ke Customer:</b><br>
              <i>"Bapak/Ibu, penawaran diskon besar memang sangat menarik di awal. Namun izinkan saya pastikan: apakah diskon tersebut sudah mengikat unit ready stock dengan nomor rangka resmi (bukan PHP inden berbulan-bulan)? Di Tunas Toyota Kiara Condong, kami memberikan jaminan kepastian alokasi unit tercepat, gratis paket T-Care (gratis oli &amp; servis sampai 3 tahun / 60.000 KM), serta layanan darurat 24 jam gratis langsung dari bengkel resmi kami di Soekarno-Hatta. Jika ada selisih sedikit, kami bisa imbangi dengan subsidi asuransi atau aksesoris resmi senilai jutaan rupiah."</i>
            </div>
            <button class="btn-copy-script" onclick="copyScriptText(this)">
              <i class="fa-regular fa-copy"></i> Salin Skrip Bicara
            </button>
          </div>
        </div>

        <!-- ITEM 2 -->
        <div class="objection-accordion battle-item">
          <div class="objection-trigger" onclick="toggleAccordion(this)">
            <span><i class="fa-solid fa-circle-question" style="color:#d7123a; margin-right:8px;"></i> 2. "Saya mau nunggu diskon akhir tahun saja / nunggu pameran GIIAS."</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="objection-answer">
            <p><b>🎯 Pola Pikir Sales:</b> Edukasi risiko kenaikan BBNKB (pajak tahunan) dan kelangkaan unit menjelang akhir tahun.</p>
            <div style="background:white; padding:12px; border-radius:10px; border-left:3px solid #10b981; margin-top:8px;">
              <b>🗣️ Contoh Skrip Bicara ke Customer:</b><br>
              <i>"Memang biasanya akhir tahun ada promo cuci gudang Pak, namun ada 2 hal penting: Pertama, mendekati akhir tahun biasanya pilihan warna dan tipe unit sangat terbatas, dan pengiriman sering menyeberang ke tahun baru sehingga terkena selisih kenaikan BBNKB (harga faktur naik 5-10jt). Kedua, promo paket bunga rendah &amp; subsidi DP bulan ini dari kami sebenarnya nilainya sudah setara dengan promo akhir tahun, dan Bapak sekeluarga sudah bisa langsung menikmati mobil barunya sekarang tanpa antre."</i>
            </div>
            <button class="btn-copy-script" onclick="copyScriptText(this)">
              <i class="fa-regular fa-copy"></i> Salin Skrip Bicara
            </button>
          </div>
        </div>

        <!-- ITEM 3 -->
        <div class="objection-accordion battle-item">
          <div class="objection-trigger" onclick="toggleAccordion(this)">
            <span><i class="fa-solid fa-circle-question" style="color:#d7123a; margin-right:8px;"></i> 3. "Saya ragu ambil Hybrid (Zenix / Yaris Cross), takut baterainya mahal &amp; rusak!"</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="objection-answer">
            <p><b>🎯 Pola Pikir Sales:</b> Tekankan garansi resmi 8 tahun Toyota dan kalkulasi penghematan bensin harian.</p>
            <div style="background:white; padding:12px; border-radius:10px; border-left:3px solid #10b981; margin-top:8px;">
              <b>🗣️ Contoh Skrip Bicara ke Customer:</b><br>
              <i>"Kekhawatiran itu sangat wajar Pak. Namun Toyota memberikan garansi resmi baterai Hybrid selama **8 Tahun atau 160.000 KM**. Jika ada penurunan performa sebelum 8 tahun, diganti baru 100% gratis oleh Toyota Astra Motor. Selain itu, konsumsi BBM Zenix/Yaris Cross Hybrid mencapai **1 : 22–24 km/liter**. Pemakaian normal dalam 3–4 tahun saja penghematan bensinnya sudah lebih dari 40–50 juta rupiah!"</i>
            </div>
            <button class="btn-copy-script" onclick="copyScriptText(this)">
              <i class="fa-regular fa-copy"></i> Salin Skrip Bicara
            </button>
          </div>
        </div>

        <!-- ITEM 4 -->
        <div class="objection-accordion battle-item">
          <div class="objection-trigger" onclick="toggleAccordion(this)">
            <span><i class="fa-solid fa-circle-question" style="color:#d7123a; margin-right:8px;"></i> 4. "Bunga kredit leasing mahal / angsuran bulanan terlalu berat."</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="objection-answer">
            <p><b>🎯 Pola Pikir Sales:</b> Tawarkan skema alternatif seperti EZ Deal (cicilan bertingkat) atau Paket Bunga 0%.</p>
            <div style="background:white; padding:12px; border-radius:10px; border-left:3px solid #10b981; margin-top:8px;">
              <b>🗣️ Contoh Skrip Bicara ke Customer:</b><br>
              <i>"Kami memiliki kerjasama eksklusif dengan Astra Credit Companies (ACC), TAF, dan Mandiri Tunas Finance dengan paket khusus: Jika ingin angsuran ringan di 3 tahun awal, ada program **EZ Deal** yang cicilannya 30% lebih murah. Atau jika Bapak punya dana tunai, ada paket **Bunga 0% tenor 1 tahun** tanpa biaya provisi berlebih. Mari kita simulasikan sekarang agar pas dengan budget bulanan Bapak."</i>
            </div>
            <button class="btn-copy-script" onclick="copyScriptText(this)">
              <i class="fa-regular fa-copy"></i> Salin Skrip Bicara
            </button>
          </div>
        </div>

        <!-- ITEM 5 -->
        <div class="objection-accordion battle-item">
          <div class="objection-trigger" onclick="toggleAccordion(this)">
            <span><i class="fa-solid fa-circle-question" style="color:#d7123a; margin-right:8px;"></i> 5. "Saya takut aplikasi kredit tidak disetujui / ada riwayat SLIK OJK."</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="objection-answer">
            <p><b>🎯 Pola Pikir Sales:</b> Berikan rasa aman bahwa tim sales &amp; leasing akan membantu pendampingan berkas secara profesional.</p>
            <div style="background:white; padding:12px; border-radius:10px; border-left:3px solid #10b981; margin-top:8px;">
              <b>🗣️ Contoh Skrip Bicara ke Customer:</b><br>
              <i>"Jangan khawatir Bapak/Ibu, tugas kami di Tunas Toyota adalah membantu mempermudah sampai mobil terparkir di rumah. Kami memiliki banyak mitra leasing dengan kriteria fleksibel. Nanti bisa kita siapkan opsi joint income dengan pasangan, penguatan rekening koran, atau skema DP yang tepat agar persetujuannya 100% aman dan cepat."</i>
            </div>
            <button class="btn-copy-script" onclick="copyScriptText(this)">
              <i class="fa-regular fa-copy"></i> Salin Skrip Bicara
            </button>
          </div>
        </div>

      </div>

      <!-- SECTION 2: BATTLE CARDS VS COMPETITORS -->
      <div id="sectionVs" style="display:none;">

        <!-- CARD 1: INNOVA ZENIX vs HONDA CR-V / WULING CORTEZ -->
        <div class="battle-card-box battle-item">
          <div class="battle-header">
            <div>
              <h4 style="margin:0; font-size:16px; font-weight:800;">Innova Zenix Hybrid vs Honda CR-V Turbo / Cortez</h4>
              <p style="font-size:11.5px; color:rgba(255,255,255,0.8); margin:0;">Segmen Medium MPV &amp; Family SUV</p>
            </div>
            <span class="badge-win">Kelebihan Telak Toyota</span>
          </div>
          <div class="battle-vs-grid">
            <div class="battle-item-toyota">
              <h5 style="color:#d7123a; font-size:14px; font-weight:800; margin-bottom:8px;">🏆 Keunggulan Zenix:</h5>
              <ul style="font-size:12px; color:#334155; line-height:1.7; padding-left:18px;">
                <li>Platform TNGA-C (Kabin jauh lebih senyap &amp; lega).</li>
                <li>Efisiensi BBM 1:21 km/L vs CRV Turbo (1:11 km/L).</li>
                <li>Captain Seat Ottoman dengan Power Recline.</li>
                <li>Biaya servis &amp; depresiasi harga bekas jauh lebih kuat.</li>
              </ul>
            </div>
            <div class="battle-item-rival">
              <h5 style="color:#64748b; font-size:14px; font-weight:800; margin-bottom:8px;">❌ Kelemahan Kompetitor:</h5>
              <ul style="font-size:12px; color:#64748b; line-height:1.7; padding-left:18px;">
                <li>CR-V Turbo harga tembus Rp 740 Juta+ (Zenix mulai Rp 430 Juta).</li>
                <li>Wuling resale value turun drastis (penurunan s/d 40% thn ke-2).</li>
                <li>Baris ketiga sempit pada rival SUV 7-seater.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CARD 2: VELOZ vs MITSUBISHI XPANDER / HYUNDAI STARGAZER -->
        <div class="battle-card-box battle-item">
          <div class="battle-header">
            <div>
              <h4 style="margin:0; font-size:16px; font-weight:800;">All New Veloz vs Mitsubishi Xpander &amp; Stargazer</h4>
              <p style="font-size:11.5px; color:rgba(255,255,255,0.8); margin:0;">Segmen Low MPV Keluarga Indonesia</p>
            </div>
            <span class="badge-win">Kelebihan Telak Toyota</span>
          </div>
          <div class="battle-vs-grid">
            <div class="battle-item-toyota">
              <h5 style="color:#d7123a; font-size:14px; font-weight:800; margin-bottom:8px;">🏆 Keunggulan Veloz:</h5>
              <ul style="font-size:12px; color:#334155; line-height:1.7; padding-left:18px;">
                <li>Fitur Keselamatan Aktif <b>Toyota Safety Sense (TSS)</b> + 6 Airbags.</li>
                <li>Rem Cakram 4 Roda (All-Round Disc Brake) + EPB &amp; Auto Hold.</li>
                <li>Wireless Charger &amp; Rear Seat Entertainment terintegrasi.</li>
                <li>Jaringan 350+ bengkel resmi di seluruh nusantara.</li>
              </ul>
            </div>
            <div class="battle-item-rival">
              <h5 style="color:#64748b; font-size:14px; font-weight:800; margin-bottom:8px;">❌ Kelemahan Kompetitor:</h5>
              <ul style="font-size:12px; color:#64748b; line-height:1.7; padding-left:18px;">
                <li>Xpander rem belakang masih tromol &amp; tidak ada TSS.</li>
                <li>Stargazer desain eksterior polarisasi (selera khusus) &amp; harga jual bekas belum teruji.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CARD 3: YARIS CROSS HYBRID vs HONDA HR-V / WR-V / CRETA -->
        <div class="battle-card-box battle-item">
          <div class="battle-header">
            <div>
              <h4 style="margin:0; font-size:16px; font-weight:800;">Yaris Cross Hybrid vs Honda HR-V &amp; Hyundai Creta</h4>
              <p style="font-size:11.5px; color:rgba(255,255,255,0.8); margin:0;">Segmen Compact Urban SUV</p>
            </div>
            <span class="badge-win">Kelebihan Telak Toyota</span>
          </div>
          <div class="battle-vs-grid">
            <div class="battle-item-toyota">
              <h5 style="color:#d7123a; font-size:14px; font-weight:800; margin-bottom:8px;">🏆 Keunggulan Yaris Cross:</h5>
              <ul style="font-size:12px; color:#334155; line-height:1.7; padding-left:18px;">
                <li>Satu-satunya SUV Compact Hybrid di harga Rp 440 Jutaan!</li>
                <li>BBM super irit 1:28 km/liter di dalam kota.</li>
                <li>Panoramic Glassroof with Power Sunshade (HR-V masih manual klip).</li>
                <li>Power Tailgate dengan Kick Sensor.</li>
              </ul>
            </div>
            <div class="battle-item-rival">
              <h5 style="color:#64748b; font-size:14px; font-weight:800; margin-bottom:8px;">❌ Kelemahan Kompetitor:</h5>
              <ul style="font-size:12px; color:#64748b; line-height:1.7; padding-left:18px;">
                <li>HR-V RS harga tembus Rp 540 Juta+ dan boros bensin (1:10 km/L).</li>
                <li>Sunroof HR-V harus copot pasang penutup manual di bagasi.</li>
                <li>Creta suspensi belakang agak keras &amp; belum ada opsi hybrid.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>

  <script>
    function switchBattleTab(tab) {
      document.getElementById('tabBtnObjection').classList.toggle('active', tab === 'objection');
      document.getElementById('tabBtnVs').classList.toggle('active', tab === 'vs');
      document.getElementById('sectionObjection').style.display = tab === 'objection' ? 'block' : 'none';
      document.getElementById('sectionVs').style.display = tab === 'vs' ? 'block' : 'none';
    }

    function toggleAccordion(el) {
      const parent = el.parentElement;
      const answer = parent.querySelector('.objection-answer');
      const icon = el.querySelector('.fa-chevron-down') || el.querySelector('.fa-chevron-up');

      if (answer.style.display === 'none' || !answer.style.display) {
        answer.style.display = 'block';
        if (icon) icon.className = 'fa-solid fa-chevron-up';
      } else {
        answer.style.display = 'none';
        if (icon) icon.className = 'fa-solid fa-chevron-down';
      }
    }

    function filterBattleContent(query) {
      const q = query.toLowerCase().trim();
      const items = document.querySelectorAll('.battle-item');
      items.forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
      });
    }

    function copyScriptText(btn) {
      const box = btn.parentElement.querySelector('div');
      if (!box) return;
      const cleanText = box.innerText.replace(/🗣️ Contoh Skrip Bicara ke Customer:\s*/g, '');
      navigator.clipboard.writeText(cleanText).then(() => {
        const old = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check" style="color:#10b981;"></i> Tersalin ke Clipboard!`;
        setTimeout(() => { btn.innerHTML = old; }, 2000);
      });
    }
  </script>
</body>

</html>
