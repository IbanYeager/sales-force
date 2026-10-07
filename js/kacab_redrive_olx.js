/**
 * kacab_redrive_olx.js
 * Kaizen EVOLVE 2026 - ReDrive Trade-In Opportunity Dashboard (SA -> Sales -> OLXmobbi)
 * Tunas Toyota Kiara Condong
 */

const REDRIVE_LEADS_DATA = [
  {
    id: "RD-001",
    nopol: "B 1928 TYA",
    nama: "Bpk. Hendra Gunawan",
    telp: "081223456789",
    modelLama: "Innova Reborn 2.4 G AT Diesel",
    tahun: 2019,
    km: "68.000 KM",
    sa: "Didin",
    tglBooking: "2026-10-06",
    taksiranOlx: 285000000,
    modelBaru: "Innova Zenix V Hybrid",
    spv: "ALVIN",
    sales: "Rian Hidayat",
    status: "Deal SPK",
    grade: "Grade A",
    catatan: "Customer tertarik beralih ke Zenix Hybrid karena ingin efisiensi bahan bakar dan kabin lebih modern. SPK ditutup dengan diskon loyalty."
  },
  {
    id: "RD-002",
    nopol: "D 1432 AD",
    nama: "Ibu Ratna Sari",
    telp: "081398765432",
    modelLama: "Avanza Veloz 1.5 AT",
    tahun: 2018,
    km: "82.500 KM",
    sa: "Ficky",
    tglBooking: "2026-10-07",
    taksiranOlx: 155000000,
    modelBaru: "Veloz Q Hybrid (HEV)",
    spv: "FERYANTO / RYAN",
    sales: "Sandi Kurnia",
    status: "Inspeksi OLX",
    grade: "Grade B+",
    catatan: "Inspeksi OLXmobbi selesai di booth bengkel Kircon. Hasil appraisal Rp 155 Jt disetujui, sedang menunggu persetujuan kredit leasing."
  },
  {
    id: "RD-003",
    nopol: "D 1876 KCA",
    nama: "Bpk. Dedi Supriadi",
    telp: "081122334455",
    modelLama: "Rush S TRD AT",
    tahun: 2020,
    km: "54.200 KM",
    sa: "Acep",
    tglBooking: "2026-10-07",
    taksiranOlx: 198000000,
    modelBaru: "Yaris Cross HEV GR",
    spv: "MUHAMMAD CAISARIVA",
    sales: "Ilham Ramadhan",
    status: "Negosiasi Sales",
    grade: "Grade A",
    catatan: "Customer mencoba test drive Yaris Cross saat mobil diservis. SA Acep mendampingi perkenalan ke Sales Ilham."
  },
  {
    id: "RD-004",
    nopol: "D 1029 KRC",
    nama: "Bpk. Agus Setiawan",
    telp: "085211223344",
    modelLama: "Calya 1.2 G AT",
    tahun: 2019,
    km: "71.000 KM",
    sa: "Didin",
    tglBooking: "2026-10-08",
    taksiranOlx: 105000000,
    modelBaru: "Veloz Hybrid / Raize Turbo",
    spv: "ALVIN",
    sales: "Dimas Anggara",
    status: "Menunggu SA",
    grade: "Pending Inspeksi",
    catatan: "Mobil dijadwalkan servis berkala besok pagi. SA Didin ditugaskan melakukan profiling awal trade-in."
  },
  {
    id: "RD-005",
    nopol: "D 1654 BB",
    nama: "H. Rahmat Hidayat",
    telp: "081299887766",
    modelLama: "Fortuner 2.4 VRZ Diesel 4x2",
    tahun: 2018,
    km: "95.000 KM",
    sa: "Ficky",
    tglBooking: "2026-10-05",
    taksiranOlx: 360000000,
    modelBaru: "Fortuner 2.8 GR Sport 4x4",
    spv: "FERYANTO / RYAN",
    sales: "Sandy Pratama",
    status: "Deal SPK",
    grade: "Grade A-",
    catatan: "Deal trade-in selesai. Customer menukar Fortuner lama ke New Fortuner 2.8 GR Sport via Tunas Kircon."
  },
  {
    id: "RD-006",
    nopol: "D 1390 ST",
    nama: "Ibu Maya Anggraeni",
    telp: "087812345678",
    modelLama: "Yaris 1.5 S TRD CVT",
    tahun: 2018,
    km: "77.000 KM",
    sa: "Acep",
    tglBooking: "2026-10-06",
    taksiranOlx: 175000000,
    modelBaru: "Yaris Cross HEV",
    spv: "MUHAMMAD CAISARIVA",
    sales: "Fajar Nugraha",
    status: "Inspeksi OLX",
    grade: "Grade B",
    catatan: "Appraisal OLX selesai. Customer berminat upgrade ke SUV Hybrid dengan Panoramic Sunroof."
  },
  {
    id: "RD-007",
    nopol: "D 1742 XZ",
    nama: "Bpk. Budi Santoso",
    telp: "081333445566",
    modelLama: "Sienta 1.5 Q CVT",
    tahun: 2019,
    km: "62.000 KM",
    sa: "Didin",
    tglBooking: "2026-10-07",
    taksiranOlx: 180000000,
    modelBaru: "Innova Zenix G Hybrid",
    spv: "ALVIN",
    sales: "Arya Putra",
    status: "Negosiasi Sales",
    grade: "Grade A",
    catatan: "Sedang simulasi kredit tukar tambah. Taksiran OLX Rp 180 Jt dijadikan DP murni."
  },
  {
    id: "RD-008",
    nopol: "D 1205 KC",
    nama: "dr. Irfan Maulana",
    telp: "081177889900",
    modelLama: "Corolla Cross HEV",
    tahun: 2020,
    km: "48.000 KM",
    sa: "Ficky",
    tglBooking: "2026-10-04",
    taksiranOlx: 320000000,
    modelBaru: "Alphard 2.5 HEV Executive",
    spv: "FERYANTO / RYAN",
    sales: "Reza Pahlevi",
    status: "Deal SPK",
    grade: "Grade A+",
    catatan: "Pelanggan VIP. Menukar Corolla Cross lama untuk DP pembelian unit Alphard Hybrid baru."
  },
  {
    id: "RD-009",
    nopol: "D 1188 PA",
    nama: "Bpk. Taufik Hidayat",
    telp: "085712349988",
    modelLama: "Agya 1.2 G MT",
    tahun: 2019,
    km: "65.000 KM",
    sa: "Acep",
    tglBooking: "2026-10-08",
    taksiranOlx: 95000000,
    modelBaru: "All New Agya GR-S / Calya",
    spv: "MUHAMMAD CAISARIVA",
    sales: "Bima Sakti",
    status: "Menunggu SA",
    grade: "Pending Inspeksi",
    catatan: "Booking servis berkala 60.000 KM. SA Acep ditugaskan menawarkan program Trade-In Mudah."
  },
  {
    id: "RD-010",
    nopol: "D 1560 YR",
    nama: "Hj. Siti Aminah",
    telp: "081288991122",
    modelLama: "Innova Reborn 2.0 V Bensin",
    tahun: 2018,
    km: "88.000 KM",
    sa: "Didin",
    tglBooking: "2026-10-03",
    taksiranOlx: 235000000,
    modelBaru: "Innova Zenix V HEV",
    spv: "ALVIN",
    sales: "Rian Hidayat",
    status: "Deal SPK",
    grade: "Grade A",
    catatan: "Closing deal SPK! Customer puas dengan harga penawaran OLXmobbi yang lebih tinggi Rp 8 Jt dari showroom luar."
  },
  {
    id: "RD-011",
    nopol: "D 1993 KK",
    nama: "Bpk. Bambang Prasetyo",
    telp: "081344556677",
    modelLama: "Hilux Single Cabin Diesel",
    tahun: 2020,
    km: "85.000 KM",
    sa: "Ficky",
    tglBooking: "2026-10-07",
    taksiranOlx: 170000000,
    modelBaru: "Hilux Rangga Flatdeck",
    spv: "FERYANTO / RYAN",
    sales: "Sandi Kurnia",
    status: "Negosiasi Sales",
    grade: "Grade B",
    catatan: "Pelanggan pengusaha logistik. Tertarik menambah armada dengan Hilux Rangga baru bermesin 2GD."
  },
  {
    id: "RD-012",
    nopol: "D 1477 MN",
    nama: "Bpk. Denny Hermawan",
    telp: "081266778899",
    modelLama: "Avanza 1.3 G AT",
    tahun: 2019,
    km: "69.000 KM",
    sa: "Acep",
    tglBooking: "2026-10-06",
    taksiranOlx: 148000000,
    modelBaru: "Veloz Hybrid",
    spv: "MUHAMMAD CAISARIVA",
    sales: "Ilham Ramadhan",
    status: "Inspeksi OLX",
    grade: "Grade A-",
    catatan: "Mobil sedang diinspeksi di spot OLXmobbi dealer Kiaracondong. Hasil appraisal positif."
  },
  {
    id: "RD-013",
    nopol: "D 1823 QC",
    nama: "Bpk. Eko Purnomo",
    telp: "085611223344",
    modelLama: "Rush G MT",
    tahun: 2019,
    km: "73.000 KM",
    sa: "Didin",
    tglBooking: "2026-10-08",
    taksiranOlx: 168000000,
    modelBaru: "Yaris Cross Bensin",
    spv: "ALVIN",
    sales: "Dimas Anggara",
    status: "Menunggu SA",
    grade: "Pending Inspeksi",
    catatan: "Mobil booking servis via mToyota. Profiling Trade-In telah disiapkan di sistem."
  },
  {
    id: "RD-014",
    nopol: "D 1011 AA",
    nama: "Ir. Gunawan Wibisono",
    telp: "081199001122",
    modelLama: "Camry 2.5 V AT",
    tahun: 2018,
    km: "59.000 KM",
    sa: "Ficky",
    tglBooking: "2026-10-02",
    taksiranOlx: 385000000,
    modelBaru: "Camry 2.5 Hybrid / Zenix Q HEV",
    spv: "FERYANTO / RYAN",
    sales: "Sandy Pratama",
    status: "Deal SPK",
    grade: "Grade A+",
    catatan: "Closing trade-in eksekutif! Camry 2018 diserahterimakan dan customer mengambil unit Hybrid baru."
  }
];

// Active state
let redriveLeads = [];

function initRedriveData() {
  try {
    const saved = localStorage.getItem('EVOLVE_REDRIVE_LEADS');
    if (saved) {
      redriveLeads = JSON.parse(saved);
    } else {
      redriveLeads = [...REDRIVE_LEADS_DATA];
      localStorage.setItem('EVOLVE_REDRIVE_LEADS', JSON.stringify(redriveLeads));
    }
  } catch (err) {
    redriveLeads = [...REDRIVE_LEADS_DATA];
  }
}

// Switch between Rekap SPV and ReDrive Pipeline Tab
function switchOlxTab(tabName) {
  const tabRekap = document.getElementById('tabBtnOlxRekap');
  const tabRedrive = document.getElementById('tabBtnOlxRedrive');
  const secRekap = document.getElementById('sectionOlxRekap');
  const secRedrive = document.getElementById('sectionOlxRedrive');

  if (!secRekap || !secRedrive) return;

  if (tabName === 'rekap') {
    tabRekap.classList.add('active');
    tabRedrive.classList.remove('active');
    secRekap.style.display = 'block';
    secRedrive.style.display = 'none';
  } else if (tabName === 'redrive') {
    tabRekap.classList.remove('active');
    tabRedrive.classList.add('active');
    secRekap.style.display = 'none';
    secRedrive.style.display = 'block';
    renderRedrivePipeline();
  }
}

// Render ReDrive Pipeline Table & Funnel Metrics
function renderRedrivePipeline() {
  initRedriveData();

  // Calculate Funnel Counts
  const totalLeads = redriveLeads.length; // 14
  const saVerified = redriveLeads.filter(i => i.status !== 'Menunggu SA').length + redriveLeads.filter(i => i.status === 'Menunggu SA').length; // All 14
  const olxInspected = redriveLeads.filter(i => i.status === 'Inspeksi OLX' || i.status === 'Negosiasi Sales' || i.status === 'Deal SPK').length; // 9
  const dealSpk = redriveLeads.filter(i => i.status === 'Deal SPK').length; // 5

  const elTotal = document.getElementById('rdMetTotal');
  const elSa = document.getElementById('rdMetSa');
  const elOlx = document.getElementById('rdMetOlx');
  const elDeal = document.getElementById('rdMetDeal');

  if (elTotal) elTotal.innerText = totalLeads;
  if (elSa) elSa.innerText = saVerified;
  if (elOlx) elOlx.innerText = olxInspected;
  if (elDeal) elDeal.innerText = dealSpk;

  // Filter Table
  const filterStatus = document.getElementById('filterRdStatus')?.value || 'Semua';
  const filterSa = document.getElementById('filterRdSa')?.value || 'Semua';
  const searchKey = document.getElementById('searchRdInput')?.value.toLowerCase().trim() || '';

  const filtered = redriveLeads.filter(item => {
    const matchStatus = (filterStatus === 'Semua') || (item.status === filterStatus);
    const matchSa = (filterSa === 'Semua') || (item.sa === filterSa);
    const matchSearch = (!searchKey) ||
      (item.nopol.toLowerCase().includes(searchKey)) ||
      (item.nama.toLowerCase().includes(searchKey)) ||
      (item.modelLama.toLowerCase().includes(searchKey)) ||
      (item.modelBaru.toLowerCase().includes(searchKey)) ||
      (item.sales.toLowerCase().includes(searchKey));
    return matchStatus && matchSa && matchSearch;
  });

  const tbody = document.getElementById('redriveTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:30px; text-align:center; color:#94a3b8;">
          <i class="fa-solid fa-car-tunnel" style="font-size:32px; margin-bottom:8px; display:block;"></i>
          Tidak ada data unit booking servis yang cocok dengan kriteria filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    let statusBadge = '';
    if (item.status === 'Deal SPK') {
      statusBadge = `<span class="rd-badge rd-badge-deal"><i class="fa-solid fa-circle-check"></i> Deal SPK</span>`;
    } else if (item.status === 'Negosiasi Sales') {
      statusBadge = `<span class="rd-badge rd-badge-nego"><i class="fa-solid fa-comments"></i> Negosiasi Sales</span>`;
    } else if (item.status === 'Inspeksi OLX') {
      statusBadge = `<span class="rd-badge rd-badge-olx"><i class="fa-solid fa-magnifying-glass-chart"></i> Inspeksi OLX</span>`;
    } else {
      statusBadge = `<span class="rd-badge rd-badge-wait"><i class="fa-solid fa-clock"></i> Menunggu SA</span>`;
    }

    const taksiranFormatted = (item.taksiranOlx > 0)
      ? 'Rp ' + (item.taksiranOlx / 1000000).toFixed(0) + ' Jt'
      : 'Estimasi Awal';

    return `
      <tr>
        <td style="font-weight:800; color:#64748b; text-align:center;">${idx + 1}</td>
        <td>
          <div style="font-weight:900; color:#0f172a; font-size:13.5px;">${item.nopol}</div>
          <div style="font-size:11.5px; color:#475569; font-weight:700;">${item.modelLama} (${item.tahun})</div>
          <div style="font-size:10.5px; color:#94a3b8;">${item.km} &bull; Tgl: ${item.tglBooking}</div>
        </td>
        <td>
          <div style="font-weight:800; color:#1e293b; font-size:13px;">${item.nama}</div>
          <div style="font-size:11px; color:#64748b;">${item.telp}</div>
          <div style="font-size:10.5px; color:#0284c7; font-weight:700; margin-top:2px;">SA: <strong>${item.sa}</strong></div>
        </td>
        <td>
          <div style="font-weight:900; color:#b45309; font-size:13.5px;">${taksiranFormatted}</div>
          <span style="font-size:10.5px; background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-weight:800;">${item.grade}</span>
        </td>
        <td>
          <div style="font-weight:900; color:#15803d; font-size:13px;"><i class="fa-solid fa-star" style="color:#eab308; font-size:11px;"></i> ${item.modelBaru}</div>
          <div style="font-size:11px; color:#64748b;">Sales: <strong>${item.sales}</strong> (${item.spv})</div>
        </td>
        <td style="text-align:center;">
          ${statusBadge}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; justify-content:center;">
            <button class="rd-action-btn rd-btn-wa" onclick="contactCustomerWa('${item.id}')" title="Kirim Pesan WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button class="rd-action-btn rd-btn-edit" onclick="openEditRedriveModal('${item.id}')" title="Update Status / Assign Sales">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="rd-action-btn rd-btn-view" onclick="openDetailRedriveModal('${item.id}')" title="Lihat Hasil Inspeksi Lengkap">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Contact Customer via WhatsApp
function contactCustomerWa(id) {
  const item = redriveLeads.find(i => i.id === id);
  if (!item) return;

  const phone = item.telp.replace(/^0/, '62');
  const message = encodeURIComponent(
    `Halo Selamat Siang ${item.nama},\n\nTerima kasih telah mempercayakan perawatan servis kendaraan ${item.modelLama} (${item.nopol}) di Tunas Toyota Kiara Condong.\n\nKami menginformasikan bahwa saat ini unit Anda mendapatkan fasilitas *FREE INSPECTION & APPRAISAL TRADE-IN* dari OLXmobbi di dealer kami dengan taksiran resmi hingga Rp ${(item.taksiranOlx / 1000000).toFixed(0)} Juta.\n\nSpesial bulan ini, dapatkan subsidi tukar tambah s/d Rp 10 Juta untuk upgrade ke unit baru *${item.modelBaru}*.\n\nApakah kami dapat bantu jadwalkan estimasi penawaran terbaiknya bersama Sales Consultant kami? Terima kasih!`
  );

  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Edit Modal
function openEditRedriveModal(id) {
  const item = redriveLeads.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('redriveEditModal');
  if (!modal) return;

  document.getElementById('editRdId').value = item.id;
  document.getElementById('editRdNopol').value = `${item.nopol} - ${item.nama}`;
  document.getElementById('editRdStatus').value = item.status;
  document.getElementById('editRdSales').value = item.sales;
  document.getElementById('editRdSpv').value = item.spv;
  document.getElementById('editRdModelBaru').value = item.modelBaru;
  document.getElementById('editRdNotes').value = item.catatan;

  modal.style.display = 'flex';
}

// Save Edit
function saveRedriveEdit(e) {
  if (e) e.preventDefault();

  const id = document.getElementById('editRdId').value;
  const item = redriveLeads.find(i => i.id === id);
  if (!item) return;

  item.status = document.getElementById('editRdStatus').value;
  item.sales = document.getElementById('editRdSales').value;
  item.spv = document.getElementById('editRdSpv').value;
  item.modelBaru = document.getElementById('editRdModelBaru').value;
  item.catatan = document.getElementById('editRdNotes').value;

  localStorage.setItem('EVOLVE_REDRIVE_LEADS', JSON.stringify(redriveLeads));
  closeRedriveModal('redriveEditModal');

  if (typeof customAlert === 'function') {
    customAlert(`Data ReDrive untuk <strong>${item.nopol} (${item.nama})</strong> berhasil diperbarui!`, 'success');
  } else {
    alert(`Data ReDrive ${item.nopol} berhasil diperbarui!`);
  }

  renderRedrivePipeline();
}

// Detail Modal
function openDetailRedriveModal(id) {
  const item = redriveLeads.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('redriveDetailModal');
  const body = document.getElementById('redriveDetailBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:white; padding:18px; border-radius:14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:11px; background:rgba(255,255,255,0.2); padding:3px 8px; border-radius:6px; font-weight:800; letter-spacing:0.5px;">OLXMOBBI INSPECTION REPORT</span>
          <h3 style="font-size:20px; font-weight:900; margin:6px 0 2px;">${item.nopol}</h3>
          <div style="font-size:12.5px; opacity:0.9;">${item.modelLama} &bull; Tahun ${item.tahun} &bull; ${item.km}</div>
        </div>
        <div style="background:#ffffff; color:#0369a1; padding:8px 16px; border-radius:12px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.15);">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase;">Hasil Grade</div>
          <div style="font-size:22px; font-weight:900; color:#0284c7;">${item.grade}</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px;">
        <span style="font-size:11px; color:#64748b; font-weight:700; display:block;">Nilai Taksiran OLXmobbi:</span>
        <div style="font-size:18px; font-weight:900; color:#b45309; margin-top:2px;">Rp ${item.taksiranOlx.toLocaleString('id-ID')}</div>
        <div style="font-size:11px; color:#10b981; font-weight:700; margin-top:4px;"><i class="fa-solid fa-circle-check"></i> Sudah termasuk insentif Astra</div>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px;">
        <span style="font-size:11px; color:#64748b; font-weight:700; display:block;">Target Mobil Baru:</span>
        <div style="font-size:16px; font-weight:900; color:#15803d; margin-top:2px;">${item.modelBaru}</div>
        <div style="font-size:11px; color:#64748b; margin-top:4px;">Sales: <strong>${item.sales}</strong> (${item.spv})</div>
      </div>
    </div>

    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:14px; margin-bottom:16px;">
      <h5 style="font-size:12px; font-weight:800; color:#1e40af; margin:0 0 4px;">Service Advisor Profiling Notes:</h5>
      <p style="font-size:12px; color:#1e3a8a; margin:0; line-height:1.45;">
        "${item.catatan}" &mdash; <em>SA ${item.sa}</em>
      </p>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:8px;">
      <button type="button" onclick="contactCustomerWa('${item.id}')" style="padding:9px 16px; border-radius:10px; border:none; background:#25d366; color:white; font-weight:800; cursor:pointer;">
        <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp Customer
      </button>
      <button type="button" onclick="closeRedriveModal('redriveDetailModal')" style="padding:9px 16px; border-radius:10px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:700; cursor:pointer;">
        Tutup
      </button>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeRedriveModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
  initRedriveData();
});
