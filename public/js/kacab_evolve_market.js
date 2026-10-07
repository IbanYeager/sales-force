/**
 * kacab_evolve_market.js
 * Kaizen EVOLVE 2026 - AI Market Potency, 8 Kecamatan Prioritas, Competitor Battle-Card & Funneling Accelerator
 * Tunas Toyota Kiara Condong (Kacab Executive Panel)
 */

// 8 Kecamatan Prioritas Database (Slide 7, 10, 14, 15)
const EVOLVE_DISTRICTS = [
  {
    id: "bojongloa_kidul",
    name: "Bojongloa Kidul",
    share: 30,
    targetShare: 35,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Stargazer, MG, Xpander",
    competitorSegment: "LMPV & Crossover",
    recommendedModel: "Veloz Hybrid",
    modelBadge: "Veloz HEV",
    priceRange: "Rp 305 Jt - Rp 340 Jt",
    fuelRatio: "1 : 26 KM/L (T-Hybrid)",
    usp: [
      "Konsumsi BBM super hemat 1:26 km/l berkat teknologi Hybrid Toyota Generasi Baru.",
      "Toyota Safety Sense (TSS 3.0) terlengkap di kelasnya.",
      "Resale value Tunas Toyota terkuat di kawasan niaga Kopo & Leuwipanjang.",
      "Akses bengkel Tunas Kircon via By-pass Soekarno Hatta hanya 10 menit."
    ],
    targetSegment: "Sentra UKM & Pedagang Grosir Cibaduyut/Kopo, Keluarga Muda Produktif",
    venueRecom: "Miko Mall Kopo, Ruko Sentra Kopo Mas, SPBU Kopo Cirangrang",
    funnelEstimate: { prospek: 65, hot: 40, spk: 16, do: 12 }
  },
  {
    id: "antapani",
    name: "Antapani",
    share: 29,
    targetShare: 35,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Stargazer, MG, Xpander",
    competitorSegment: "LMPV",
    recommendedModel: "Veloz Hybrid",
    modelBadge: "Veloz HEV",
    priceRange: "Rp 305 Jt - Rp 340 Jt",
    fuelRatio: "1 : 26 KM/L",
    usp: [
      "Kenyamanan kabin senyap dengan mode EV (Electric Vehicle) saat macet di Purwakarta/Antapani.",
      "Wireless Charger, Electric Parking Brake (EPB) with Auto Hold.",
      "Fitur T-Intouch: Find My Car, Geofencing, dan E-Care terhubung bengkel Kircon.",
      "Suspensi empuk dan kabin lega 7-seater untuk keluarga urban."
    ],
    targetSegment: "Pemukiman Menengah-Atas, Karyawan BUMN/Perbankan, Profesional Muda",
    venueRecom: "Lapangan Gasmin Antapani, Griya Antapani, Kompleks Puri Dago",
    funnelEstimate: { prospek: 60, hot: 36, spk: 15, do: 11 }
  },
  {
    id: "buah_batu",
    name: "Buah Batu",
    share: 28,
    targetShare: 35,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Honda HR-V, Jaecoo J5",
    competitorSegment: "Compact & Medium SUV",
    recommendedModel: "Yaris Cross",
    modelBadge: "Yaris Cross HEV",
    priceRange: "Rp 355 Jt - Rp 450 Jt",
    fuelRatio: "1 : 30 KM/L (Full Hybrid)",
    usp: [
      "Satu-satunya Compact SUV Full Hybrid dengan harga terjangkau di bawah Rp 450 Jt.",
      "Panoramic Glass Roof with Power Sunshade mewah, lebih lega dari HR-V.",
      "Power Backdoor with Kick Sensor praktis saat belanja.",
      "T-Care Bebas Biaya Servis Jasa & Part s/d Servis ke-7."
    ],
    targetSegment: "Eksekutif Korporat, Dokter, Hunian Elite Batununggal & Podomoro Park",
    venueRecom: "Trans Studio Mall (TSM) Atrium, Griya Buah Batu, Batununggal Sports Center",
    funnelEstimate: { prospek: 70, hot: 42, spk: 18, do: 14 }
  },
  {
    id: "ujung_berung",
    name: "Ujung Berung",
    share: 29,
    targetShare: 35,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Isuzu Traga, L-300",
    competitorSegment: "Light Commercial Vehicle (Pick Up)",
    recommendedModel: "Hilux Rangga",
    modelBadge: "Rangga Flatdeck / Cab",
    priceRange: "Rp 195 Jt - Rp 310 Jt",
    fuelRatio: "Mesin Diesel 2.4L 2GD-FTV",
    usp: [
      "Mesin Diesel 2GD-FTV (mesin legendaris Innova Reborn) bertenaga badak & teruji irit.",
      "Radius putar lincah 4.9 meter, manuver mudah di pasar tradisional Ujung Berung.",
      "Kenyamanan kabin bergaya mobil penumpang (AC dingin, posisi duduk ergonomis).",
      "Kapasitas muatan s/d 1.2 Ton dengan bak 3-Way terluas di kelasnya."
    ],
    targetSegment: "Pedagang Pasar Induk Ujung Berung, UMKM Distribusi Logistik, Kontraktor/Material",
    venueRecom: "Pasar Ujung Berung, Alun-alun Ujung Berung, Sentra Ruko AH Nasution",
    funnelEstimate: { prospek: 55, hot: 35, spk: 14, do: 10 }
  },
  {
    id: "kiara_condong",
    name: "Kiara Condong",
    share: 30,
    targetShare: 38,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Honda HR-V, Jaecoo J5",
    competitorSegment: "Medium SUV & Crossover",
    recommendedModel: "Yaris Cross",
    modelBadge: "Yaris Cross HEV",
    priceRange: "Rp 355 Jt - Rp 450 Jt",
    fuelRatio: "1 : 30 KM/L",
    usp: [
      "Home Base Dealer Tunas Toyota Kircon: Keuntungan booking servis prioritas & unit cepat.",
      "Bebas kemacetan Kiaracondong karena showroom & bengkel langsung di depan mata.",
      "TSS 3.0: Pre-Collision System, Lane Departure Alert, Adaptive Cruise Control.",
      "Pilihan Two-Tone Color sporty dan stylish."
    ],
    targetSegment: "Wirausahawan Lokal, Pegawai BUMN PT Pindad / KAI, Pemukiman Kircon Raya",
    venueRecom: "Showroom Event Tunas Kircon, Griya Kiara Condong, Car Free Day Batununggal",
    funnelEstimate: { prospek: 65, hot: 40, spk: 17, do: 13 }
  },
  {
    id: "cidadap",
    name: "Cidadap",
    share: 23,
    targetShare: 35,
    urgency: "Immediate Action",
    urgencyClass: "urgency-immediate",
    competitor: "Stargazer, MG, Xpander",
    competitorSegment: "LMPV",
    recommendedModel: "Veloz Hybrid",
    modelBadge: "Veloz HEV",
    priceRange: "Rp 305 Jt - Rp 340 Jt",
    fuelRatio: "1 : 26 KM/L",
    usp: [
      "Torsi instan motor listrik hybrid sangat bertenaga melibas tanjakan Setiabudi & Ciumbuleuit.",
      "Hill Start Assist (HSA) & Vehicle Stability Control (VSC) menjamin keselamatan di medan miring.",
      "Ground Clearance 205mm tinggi, aman dari jalan berbatu perbukitan.",
      "Kamera 360 All-Round Monitor memudahkan manuver di jalan sempit berliku."
    ],
    targetSegment: "Hunian Elit Setiabudi/Ciumbuleuit, Pengusaha Kuliner & Perhotelan Lereng",
    venueRecom: "Area Komersial Borma Setiabudi, Kawasan Cafe Ciumbuleuit, SPBU Setiabudi",
    funnelEstimate: { prospek: 45, hot: 26, spk: 10, do: 8 }
  },
  {
    id: "andir",
    name: "Andir",
    share: 27,
    targetShare: 35,
    urgency: "High Priority",
    urgencyClass: "urgency-high",
    competitor: "Daihatsu Sigra",
    competitorSegment: "LCGC 7-Seater",
    recommendedModel: "Calya",
    modelBadge: "Calya 1.2 G",
    priceRange: "Rp 170 Jt - Rp 195 Jt",
    fuelRatio: "1 : 20 KM/L (Dual VVT-i)",
    usp: [
      "Mobil 7-seater keluarga paling ekonomis dan tangguh dengan mesin 1.2L 4-Silinder Dual VVT-i.",
      "Nilai jual kembali (Resale Value) Toyota jauh lebih unggul dan dicari di pasar otomotif Bandung.",
      "Jaringan servis resmi Tunas terluas dengan suku cadang berlimpah dan murah.",
      "Paket kredit DP Ringan & Angsuran mulai Rp 2.9 Jt/bulan untuk pengusaha pasar Ciroyom."
    ],
    targetSegment: "Pedagang Grosir Pasar Andir, Armada Operasional Toko Ciroyom, First-Car Buyer",
    venueRecom: "Pasar Andir Trade Center, Pasar Ciroyom, Pusat Ruko Rajawali Barat",
    funnelEstimate: { prospek: 50, hot: 30, spk: 11, do: 8 }
  },
  {
    id: "arcamanik",
    name: "Arcamanik",
    share: 26,
    targetShare: 35,
    urgency: "High Priority",
    urgencyClass: "urgency-high",
    competitor: "Denza D9, Xpeng X9",
    competitorSegment: "Luxury MPV / EV Pendatang Baru",
    recommendedModel: "Alphard HEV",
    modelBadge: "Alphard 2.5 HEV",
    priceRange: "Rp 1.4 M - Rp 1.7 M",
    fuelRatio: "Toyota Self-Charging Hybrid",
    usp: [
      "Simbol kemewahan dan prestise nomor satu yang telah diakui oleh konglomerat & pejabat Indonesia.",
      "Toyota Self-Charging Hybrid: Tidak perlu pusing antre atau cari SPKLU saat dinas Bandung - Jakarta.",
      "Interior Ottoman Seats dengan Executive Lounge, meja lipat, dan wireless remote touchscreen.",
      "Resale value terbukti stabil puluhan tahun, berbeda dengan depresiasi curam mobil listrik baru."
    ],
    targetSegment: "Pejabat, Pengusaha Elit Arcamanik Endah, Dokter Spesialis & Eksekutif Puncak",
    venueRecom: "VIP Door-to-Door Test Drive, Lapangan Golf Arcamanik, Sport Jabar Hub",
    funnelEstimate: { prospek: 46, hot: 26, spk: 9, do: 7 }
  }
];

// Switch Main Tab in Peta Kunjungan Page
function switchMainPetaTab(tabName) {
  // Update nav tabs
  const tabBtnMap = document.getElementById('tabBtnMap');
  const tabBtnAiMarket = document.getElementById('tabBtnAiMarket');
  const tabBtnFunnel = document.getElementById('tabBtnFunnel');

  const secMap = document.getElementById('sectionMapTab');
  const secAi = document.getElementById('sectionAiMarketTab');
  const secFunnel = document.getElementById('sectionFunnelTab');

  if (!secMap || !secAi || !secFunnel) return;

  // Remove active classes
  [tabBtnMap, tabBtnAiMarket, tabBtnFunnel].forEach(btn => btn && btn.classList.remove('active'));

  // Hide all sections
  secMap.style.display = 'none';
  secAi.style.display = 'none';
  secFunnel.style.display = 'none';

  if (tabName === 'map') {
    if (tabBtnMap) tabBtnMap.classList.add('active');
    secMap.style.display = 'flex';
    // If Leaflet map exists, invalidate size so tiles align correctly
    if (typeof map !== 'undefined' && map) {
      setTimeout(() => { map.invalidateSize(); }, 250);
    }
  } else if (tabName === 'ai_market') {
    if (tabBtnAiMarket) tabBtnAiMarket.classList.add('active');
    secAi.style.display = 'block';
    renderEvolveDistricts();
  } else if (tabName === 'funnel') {
    if (tabBtnFunnel) tabBtnFunnel.classList.add('active');
    secFunnel.style.display = 'block';
    updateFunnelSimulation();
  }
}

// Render 8 Kecamatan Cards
function renderEvolveDistricts() {
  const container = document.getElementById('districtGridContainer');
  if (!container) return;

  const urgencyFilter = document.getElementById('filterUrgency') ? document.getElementById('filterUrgency').value : 'Semua';
  const modelFilter = document.getElementById('filterModel') ? document.getElementById('filterModel').value : 'Semua';
  const searchKeyword = document.getElementById('searchDistrict') ? document.getElementById('searchDistrict').value.toLowerCase().trim() : '';

  let filtered = EVOLVE_DISTRICTS.filter(item => {
    let matchUrgency = (urgencyFilter === 'Semua') || (item.urgency === urgencyFilter);
    let matchModel = (modelFilter === 'Semua') || (item.recommendedModel.toLowerCase().includes(modelFilter.toLowerCase()));
    let matchSearch = (!searchKeyword) ||
      (item.name.toLowerCase().includes(searchKeyword)) ||
      (item.competitor.toLowerCase().includes(searchKeyword)) ||
      (item.recommendedModel.toLowerCase().includes(searchKeyword));
    return matchUrgency && matchModel && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full empty-state-box">
        <i class="fa-solid fa-map-location-dot" style="font-size:36px; color:#cbd5e1; margin-bottom:12px;"></i>
        <h4 style="font-size:15px; font-weight:800; color:#334155;">Tidak Ada Kecamatan Ditemukan</h4>
        <p style="font-size:12px; color:#64748b;">Silakan ubah filter urgensi atau kata kunci pencarian Anda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(dist => {
    const gap = dist.targetShare - dist.share;
    return `
      <div class="evolve-district-card">
        <div class="edc-header">
          <div>
            <div class="edc-urgency-pill ${dist.urgencyClass}">
              <i class="fa-solid fa-bolt-lightning"></i> ${dist.urgency}
            </div>
            <h3 class="edc-name">${dist.name}</h3>
          </div>
          <div class="edc-share-badge">
            <span class="share-val">${dist.share}%</span>
            <span class="share-lbl">Toyota Share</span>
          </div>
        </div>

        <!-- Share Progress Bar -->
        <div class="edc-progress-wrap">
          <div class="edc-progress-meta">
            <span>Pangsa Pasar: <strong>${dist.share}%</strong></span>
            <span>Target Benchmark: <strong>${dist.targetShare}%</strong> (Gap -${gap}%)</span>
          </div>
          <div class="edc-progress-track">
            <div class="edc-progress-fill" style="width: ${(dist.share / dist.targetShare) * 100}%;"></div>
          </div>
        </div>

        <!-- Competitor vs Recommendation -->
        <div class="edc-matchup-box">
          <div class="edc-competitor-side">
            <span class="edc-side-lbl"><i class="fa-solid fa-triangle-exclamation"></i> Pesaing Dominan</span>
            <div class="edc-competitor-name">${dist.competitor}</div>
            <div class="edc-competitor-sub">Segmen: ${dist.competitorSegment}</div>
          </div>
          <div class="edc-vs-badge">VS</div>
          <div class="edc-toyota-side">
            <span class="edc-side-lbl"><i class="fa-solid fa-star"></i> Rekomendasi EVOLVE</span>
            <div class="edc-toyota-name">${dist.recommendedModel}</div>
            <div class="edc-toyota-sub">${dist.priceRange}</div>
          </div>
        </div>

        <!-- Target Segment & Venue -->
        <div class="edc-insights">
          <div class="edc-insight-row">
            <i class="fa-solid fa-users-viewfinder"></i>
            <div><strong>Target Segmen:</strong> ${dist.targetSegment}</div>
          </div>
          <div class="edc-insight-row">
            <i class="fa-solid fa-location-pin"></i>
            <div><strong>Lokasi Pameran Unggulan:</strong> ${dist.venueRecom}</div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="edc-footer-actions">
          <button class="btn-battle-card" onclick="openBattleCardModal('${dist.id}')">
            <i class="fa-solid fa-shield-halved"></i> Battle-Card
          </button>
          <button class="btn-assign-exhibition" onclick="openExhibitionModal('${dist.name}', '${dist.recommendedModel}')">
            <i class="fa-solid fa-calendar-plus"></i> Tugaskan Pameran
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Open Battle Card Modal
function openBattleCardModal(districtId) {
  const dist = EVOLVE_DISTRICTS.find(d => d.id === districtId);
  if (!dist) return;

  const modal = document.getElementById('evolveBattleModal');
  const title = document.getElementById('battleModalTitle');
  const body = document.getElementById('battleModalBody');
  if (!modal || !title || !body) return;

  title.innerHTML = `<i class="fa-solid fa-shield-halved" style="color:#d8a437;"></i> Battle-Card Strategi: ${dist.recommendedModel} vs ${dist.competitor}`;

  body.innerHTML = `
    <div style="background: linear-gradient(135deg, #1e1014 0%, #3b141d 100%); color:white; padding:18px 20px; border-radius:14px; margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; color:#f3c96a; text-transform:uppercase; letter-spacing:0.8px;">Wilayah Analisis: Kecamatan ${dist.name}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-size:18px; font-weight:900;">${dist.recommendedModel} <span style="font-size:13px; color:#a7f3d0; font-weight:700;">(Market Buster)</span></div>
          <div style="font-size:12px; color:#cbd5e1;">Target Mengambil Alih Dominasi: ${dist.competitor}</div>
        </div>
        <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; text-align:right;">
          <div style="font-size:11px; color:#94a3b8;">Konsumsi BBM / Mesin</div>
          <div style="font-size:14px; font-weight:900; color:#fbbf24;">${dist.fuelRatio}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <h4 style="font-size:14px; font-weight:800; color:#1e293b; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> 4 Keunggulan Mutlak Toyota Menghadapi Kompetitor:
      </h4>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${dist.usp.map((point, idx) => `
          <div style="display:flex; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px;">
            <div style="width:24px; height:24px; border-radius:50%; background:#e0f2fe; color:#0284c7; font-weight:900; font-size:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${idx + 1}
            </div>
            <div style="font-size:12.5px; color:#334155; line-height:1.45;">
              ${point}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:14px; margin-top:14px;">
      <div style="font-size:12px; font-weight:800; color:#1e40af; margin-bottom:4px;">
        <i class="fa-solid fa-lightbulb"></i> Instruksi Kepala Cabang ke Sales Consultant:
      </div>
      <p style="font-size:12px; color:#1e3a8a; margin:0; line-height:1.4;">
        "Saat melakukan pameran atau canvassing di ${dist.name}, fokuskan presentasi pada efisiensi biaya kepemilikan (TCO), layanan servis gratis T-Care di bengkel Tunas Kircon, dan promo cicilan DP ringan. Jangan terpancing perang diskon mentah, tonjolkan resale value dan prestise Toyota."
      </p>
    </div>
  `;

  modal.style.display = 'flex';
}

// Open Exhibition Assignment Modal
function openExhibitionModal(districtName, recommendedModel) {
  const modal = document.getElementById('evolveAssignModal');
  if (!modal) return;

  const inputDist = document.getElementById('assignDistrictInput');
  const inputModel = document.getElementById('assignModelInput');

  if (inputDist) inputDist.value = districtName;
  if (inputModel) inputModel.value = recommendedModel;

  modal.style.display = 'flex';
}

// Close Modal
function closeEvolveModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Save Exhibition Assignment
function saveExhibitionAssignment(e) {
  if (e) e.preventDefault();

  const district = document.getElementById('assignDistrictInput')?.value || '';
  const model = document.getElementById('assignModelInput')?.value || '';
  const spv = document.getElementById('assignSpvSelect')?.value || 'Semua SPV';
  const date = document.getElementById('assignDateInput')?.value || new Date().toISOString().split('T')[0];
  const targetLead = document.getElementById('assignLeadTarget')?.value || '25';
  const notes = document.getElementById('assignNotesInput')?.value || '';

  const newAssignment = {
    id: 'EVL-' + Date.now(),
    district,
    model,
    spv,
    date,
    targetLead,
    notes,
    createdAt: new Date().toLocaleString('id-ID')
  };

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('EVOLVE_EXHIBITION_ASSIGNMENTS') || '[]');
  } catch (err) {
    list = [];
  }
  list.unshift(newAssignment);
  localStorage.setItem('EVOLVE_EXHIBITION_ASSIGNMENTS', JSON.stringify(list));

  closeEvolveModal('evolveAssignModal');

  if (typeof customAlert === 'function') {
    customAlert(`Penugasan Pameran & Canvassing untuk Kecamatan <strong>${district}</strong> (Fokus: ${model}) berhasil diterbitkan ke Tim SPV!`, 'success');
  } else {
    alert(`Penugasan Pameran berhasil diterbitkan untuk Kecamatan ${district}!`);
  }

  renderAssignedList();
}

// Render Assigned List in Panel
function renderAssignedList() {
  const container = document.getElementById('assignedExhibitionsList');
  if (!container) return;

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('EVOLVE_EXHIBITION_ASSIGNMENTS') || '[]');
  } catch (err) {
    list = [];
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:18px; color:#94a3b8; font-size:12px;">
        <i class="fa-solid fa-clipboard-list" style="font-size:24px; margin-bottom:6px; display:block;"></i>
        Belum ada surat tugas pameran aktif. Klik tombol <strong>"Tugaskan Pameran"</strong> pada kartu kecamatan di atas.
      </div>
    `;
    return;
  }

  container.innerHTML = list.slice(0, 5).map(item => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <div style="font-size:13px; font-weight:800; color:#0f172a;">
          <i class="fa-solid fa-location-dot" style="color:#cc1426;"></i> ${item.district} &bull; <span style="color:#d8a437;">${item.model}</span>
        </div>
        <div style="font-size:11px; color:#64748b; margin-top:2px;">
          SPV: <strong>${item.spv}</strong> | Tanggal: <strong>${item.date}</strong> | Target: <strong>${item.targetLead} Prospek</strong>
        </div>
      </div>
      <span style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:800;">
        <i class="fa-solid fa-circle-check"></i> Ditugaskan
      </span>
    </div>
  `).join('');
}

// Interactive Funnel Simulation (Slide 15)
function updateFunnelSimulation() {
  const prospekInput = document.getElementById('simProspekInput');
  const baseProspek = prospekInput ? parseInt(prospekInput.value) || 456 : 456;

  // Ratios from EVOLVE 2026 Presentation:
  // Prospek -> Hot: 60.3% (275 / 456)
  // Hot -> SPK: 40.0% (110 / 275)
  // SPK -> DO: 75.5% (83 / 110)
  const calcHot = Math.round(baseProspek * 0.603);
  const calcSpk = Math.round(calcHot * 0.400);
  const calcDo = Math.round(calcSpk * 0.755);

  const elProspek = document.getElementById('funnelValProspek');
  const elHot = document.getElementById('funnelValHot');
  const elSpk = document.getElementById('funnelValSpk');
  const elDo = document.getElementById('funnelValDo');

  if (elProspek) elProspek.innerText = baseProspek.toLocaleString('id-ID');
  if (elHot) elHot.innerText = calcHot.toLocaleString('id-ID');
  if (elSpk) elSpk.innerText = calcSpk.toLocaleString('id-ID');
  if (elDo) elDo.innerText = calcDo.toLocaleString('id-ID');
}

// Global initialization
document.addEventListener('DOMContentLoaded', function () {
  // Check if initial tab setup is needed
  renderAssignedList();
});
