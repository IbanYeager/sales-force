/**
 * kacab_winback_aftersales.js
 * Kaizen EVOLVE 2026 - Kircon After Sales Retention Win-Back & CARE-X Package (719 Unit)
 * Tunas Toyota Kiara Condong
 */

const WINBACK_CUSTOMERS_SAMPLE = [
  {
    id: "WB-001",
    nopol: "D 1829 TYA",
    nama: "Bpk. Aditya Pratama",
    telp: "081220112233",
    model: "Innova Reborn 2.4 G AT",
    tahun: 2021,
    lastServiceDate: "2025-08-14",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "69.500 KM",
    kategori: "P1", // 1x servis dealer lain
    kecamatan: "Antapani",
    alasan: "Macet parah di Kiara Condong & biaya servis reguler",
    solusi: "Toyota Home Service (THS) & Diskon CARE-X 20%",
    status: "Belum Dihubungi"
  },
  {
    id: "WB-002",
    nopol: "D 1450 ST",
    nama: "Ibu Dian Sastro",
    telp: "081390223344",
    model: "Veloz 1.5 Q CVT",
    tahun: 2022,
    lastServiceDate: "2025-09-02",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "62.000 KM",
    kategori: "P1",
    kecamatan: "Buah Batu",
    alasan: "Jarak & kemacetan akses By-pass Kircon",
    solusi: "Free Pick-Up & Delivery Service",
    status: "Dihubungi WA"
  },
  {
    id: "WB-003",
    nopol: "D 1902 KRC",
    nama: "Bpk. Rian Hidayat",
    telp: "081123445566",
    model: "Avanza 1.3 G MT",
    tahun: 2020,
    lastServiceDate: "2025-06-18",
    lastServiceKe: "Servis ke-8",
    nextServiceKe: "Servis ke-9",
    km: "78.400 KM",
    kategori: "P2", // 2x servis dealer lain
    kecamatan: "Bojongloa Kidul",
    alasan: "Servis di bengkel umum karena biaya lebih murah",
    solusi: "Paket CARE-X Servis 8-9 Hemat 25% + Free Nitrogen & Cuci",
    status: "Booking THS"
  },
  {
    id: "WB-004",
    nopol: "D 1288 BB",
    nama: "Bpk. H. Ahmad Fauzi",
    telp: "081233445566",
    model: "Fortuner 2.4 VRZ AT",
    tahun: 2019,
    lastServiceDate: "2025-05-10",
    lastServiceKe: "Servis ke-8",
    nextServiceKe: "Servis ke-9",
    km: "92.000 KM",
    kategori: "P2",
    kecamatan: "Arcamanik",
    alasan: "Pindah servis ke bengkel umum terdekat",
    solusi: "THS Kircon On-Call ke Rumah + Oli TMO Synthetic",
    status: "Won-Back"
  },
  {
    id: "WB-005",
    nopol: "D 1633 AC",
    nama: "Ibu Ratna Dewi",
    telp: "087812998877",
    model: "Yaris 1.5 G CVT",
    tahun: 2021,
    lastServiceDate: "2025-07-22",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "58.000 KM",
    kategori: "P1",
    kecamatan: "Kiara Condong",
    alasan: "Khawatir biaya servis ke-8 mahal setelah T-Care gratis habis",
    solusi: "Penjelasan Paket CARE-X & Free Car Wash Voucher",
    status: "Dihubungi WA"
  },
  {
    id: "WB-006",
    nopol: "D 1109 KL",
    nama: "Bpk. Dedi Kusnandar",
    telp: "085299887766",
    model: "Rush 1.5 S TRD AT",
    tahun: 2020,
    lastServiceDate: "2025-04-12",
    lastServiceKe: "Servis ke-8",
    nextServiceKe: "Servis ke-9",
    km: "81.200 KM",
    kategori: "P2",
    kecamatan: "Ujung Berung",
    alasan: "Kemacetan jalur timur Bandung ke Kiara Condong",
    solusi: "Toyota Home Service (THS) Unit Kircon",
    status: "Booking THS"
  },
  {
    id: "WB-007",
    nopol: "D 1744 CD",
    nama: "drg. Maya Novitasari",
    telp: "081188776655",
    model: "Raize 1.0T GR Sport",
    tahun: 2022,
    lastServiceDate: "2025-08-30",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "49.000 KM",
    kategori: "P1",
    kecamatan: "Cidadap",
    alasan: "Jarak terlalu jauh dari Setiabudi ke Kiara Condong",
    solusi: "THS On-Call Cidadap & Free Nitrogen 4 Roda",
    status: "Won-Back"
  },
  {
    id: "WB-008",
    nopol: "D 1055 PA",
    nama: "Bpk. Tatan Suwandi",
    telp: "085712233445",
    model: "Calya 1.2 G AT",
    tahun: 2021,
    lastServiceDate: "2025-06-05",
    lastServiceKe: "Servis ke-8",
    nextServiceKe: "Servis ke-9",
    km: "74.000 KM",
    kategori: "P2",
    kecamatan: "Andir",
    alasan: "Biaya servis rutin",
    solusi: "Paket CARE-X DP Servis & Cicilan Servis 0%",
    status: "Belum Dihubungi"
  },
  {
    id: "WB-009",
    nopol: "D 1399 EE",
    nama: "Bpk. Bambang Pamungkas",
    telp: "081299001122",
    model: "Corolla Cross HEV",
    tahun: 2021,
    lastServiceDate: "2025-07-15",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "55.000 KM",
    kategori: "P1",
    kecamatan: "Buah Batu",
    alasan: "Kesibukan kantor tidak sempat ke bengkel",
    solusi: "Free Pick-Up & Delivery Service Kircon",
    status: "Booking Bengkel"
  },
  {
    id: "WB-010",
    nopol: "D 1877 XY",
    nama: "Hj. Erna Wati",
    telp: "081377889900",
    model: "Innova Zenix G Hybrid",
    tahun: 2023,
    lastServiceDate: "2025-09-10",
    lastServiceKe: "Servis ke-7 (Akhir T-Care)",
    nextServiceKe: "Servis ke-8 (Wajib CARE-X)",
    km: "42.000 KM",
    kategori: "P1",
    kecamatan: "Antapani",
    alasan: "Jalur Kircon macet pada jam operasional kerja",
    solusi: "Toyota Home Service (THS) Sabtu/Minggu",
    status: "Won-Back"
  }
];

let winbackList = [];

function initWinbackData() {
  try {
    const saved = localStorage.getItem('EVOLVE_WINBACK_LIST');
    if (saved) {
      winbackList = JSON.parse(saved);
    } else {
      winbackList = [...WINBACK_CUSTOMERS_SAMPLE];
      localStorage.setItem('EVOLVE_WINBACK_LIST', JSON.stringify(winbackList));
    }
  } catch (err) {
    winbackList = [...WINBACK_CUSTOMERS_SAMPLE];
  }
}

// Switch between Bengkel Iframe and WinBack Tab
function switchAfterSalesTab(tabName) {
  const tabBtnIframe = document.getElementById('tabBtnAsIframe');
  const tabBtnWinback = document.getElementById('tabBtnAsWinback');
  const secIframe = document.getElementById('sectionAsIframe');
  const secWinback = document.getElementById('sectionAsWinback');

  if (!secIframe || !secWinback) return;

  if (tabName === 'iframe') {
    tabBtnIframe.classList.add('active');
    tabBtnWinback.classList.remove('active');
    secIframe.style.display = 'flex';
    secWinback.style.display = 'none';
  } else if (tabName === 'winback') {
    tabBtnIframe.classList.remove('active');
    tabBtnWinback.classList.add('active');
    secIframe.style.display = 'none';
    secWinback.style.display = 'block';
    renderWinbackList();
  }
}

// Render Win-Back Customer Table
function renderWinbackList() {
  initWinbackData();

  const filterKategori = document.getElementById('filterWbKategori')?.value || 'Semua';
  const filterKecamatan = document.getElementById('filterWbKecamatan')?.value || 'Semua';
  const searchKey = document.getElementById('searchWbInput')?.value.toLowerCase().trim() || '';

  const filtered = winbackList.filter(item => {
    const matchKat = (filterKategori === 'Semua') || (item.kategori === filterKategori);
    const matchKec = (filterKecamatan === 'Semua') || (item.kecamatan === filterKecamatan);
    const matchSearch = (!searchKey) ||
      (item.nopol.toLowerCase().includes(searchKey)) ||
      (item.nama.toLowerCase().includes(searchKey)) ||
      (item.model.toLowerCase().includes(searchKey)) ||
      (item.kecamatan.toLowerCase().includes(searchKey));
    return matchKat && matchKec && matchSearch;
  });

  const tbody = document.getElementById('winbackTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:30px; text-align:center; color:#94a3b8;">
          <i class="fa-solid fa-car-on" style="font-size:32px; margin-bottom:8px; display:block;"></i>
          Tidak ada data unit pelanggan yang sesuai dengan filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    let katBadge = (item.kategori === 'P1')
      ? `<span class="wb-badge wb-badge-p1" title="Pindah 1x ke bengkel lain (Likelihood Win-Back Tinggi)"><i class="fa-solid fa-bolt"></i> Prioritas P1 (110 Unit)</span>`
      : `<span class="wb-badge wb-badge-p2" title="Pindah 2x ke bengkel lain"><i class="fa-solid fa-repeat"></i> Prioritas P2 (463 Unit)</span>`;

    let statusBadge = '';
    if (item.status === 'Won-Back') {
      statusBadge = `<span class="wb-badge wb-badge-won"><i class="fa-solid fa-circle-check"></i> Won-Back!</span>`;
    } else if (item.status === 'Booking THS' || item.status === 'Booking Bengkel') {
      statusBadge = `<span class="wb-badge wb-badge-booked"><i class="fa-solid fa-calendar-check"></i> ${item.status}</span>`;
    } else if (item.status === 'Dihubungi WA') {
      statusBadge = `<span class="wb-badge wb-badge-contacted"><i class="fa-solid fa-paper-plane"></i> Dihubungi WA</span>`;
    } else {
      statusBadge = `<span class="wb-badge wb-badge-wait"><i class="fa-solid fa-clock"></i> Belum Dihubungi</span>`;
    }

    return `
      <tr>
        <td style="font-weight:800; color:#64748b; text-align:center;">${idx + 1}</td>
        <td>
          <div style="font-weight:900; color:#0f172a; font-size:13.5px;">${item.nopol}</div>
          <div style="font-size:12px; color:#334155; font-weight:700;">${item.model} (${item.tahun})</div>
          <div style="font-size:10.5px; color:#94a3b8;">${item.km} &bull; Wilayah: <strong style="color:#0284c7;">${item.kecamatan}</strong></div>
        </td>
        <td>
          <div style="font-weight:800; color:#1e293b; font-size:13px;">${item.nama}</div>
          <div style="font-size:11px; color:#64748b;">${item.telp}</div>
          <div style="margin-top:3px;">${katBadge}</div>
        </td>
        <td>
          <div style="font-size:11.5px; color:#dc2626; font-weight:800;">
            <i class="fa-solid fa-flag-checkered"></i> ${item.lastServiceKe}
          </div>
          <div style="font-size:12px; color:#15803d; font-weight:900; margin-top:2px;">
            <i class="fa-solid fa-shield-halved"></i> ${item.nextServiceKe}
          </div>
          <div style="font-size:10.5px; color:#64748b; margin-top:2px;">Tgl Terakhir: ${item.lastServiceDate}</div>
        </td>
        <td>
          <div style="font-size:11.5px; color:#b45309; font-weight:800;">
            <i class="fa-solid fa-wrench"></i> ${item.solusi}
          </div>
          <div style="font-size:10.5px; color:#64748b; margin-top:2px; line-height:1.35;">
            Kendala: <em>${item.alasan}</em>
          </div>
        </td>
        <td style="text-align:center;">
          ${statusBadge}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; justify-content:center;">
            <button class="wb-action-btn wb-btn-wa" onclick="sendWinbackWa('${item.id}')" title="Kirim Voucher THS & CARE-X via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button class="wb-action-btn wb-btn-edit" onclick="openEditWinbackModal('${item.id}')" title="Ubah Status Follow-Up">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Send Win-Back WhatsApp
function sendWinbackWa(id) {
  const item = winbackList.find(i => i.id === id);
  if (!item) return;

  const phone = item.telp.replace(/^0/, '62');
  const message = encodeURIComponent(
    `Halo Selamat Siang Bpk/Ibu ${item.nama},\n\nSemoga selalu dalam keadaan sehat. Kami dari Bengkel Resmi Tunas Toyota Kiara Condong memperhatikan bahwa kendaraan ${item.model} (${item.nopol}) Anda telah memasuki jadwal perawatan berkala *${item.nextServiceKe}*.\n\nUntuk menghindari kendala macet di jalur Kiara Condong, kami menyediakan layanan spesial untuk Anda:\n1. 🚗 *Toyota Home Service (THS)*: Teknisi kami servis langsung di rumah/kantor Anda TANPA BIAYA KUNJUNGAN.\n2. 🛡️ *Paket Hemat CARE-X*: Potongan harga s/d 25% untuk penggantian oli TMO Synthetic, tune-up & sparepart.\n3. 🎁 *GRATIS*: Cuci Mobil & Pengisian Nitrogen 4 Roda.\n\nApakah kami dapat bantu jadwalkan kunjungan teknisi THS ke lokasi Anda minggu ini? Terima kasih!`
  );

  // Update status to Contacted
  if (item.status === 'Belum Dihubungi') {
    item.status = 'Dihubungi WA';
    localStorage.setItem('EVOLVE_WINBACK_LIST', JSON.stringify(winbackList));
    renderWinbackList();
  }

  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Edit Modal
function openEditWinbackModal(id) {
  const item = winbackList.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('winbackEditModal');
  if (!modal) return;

  document.getElementById('wbEditId').value = item.id;
  document.getElementById('wbEditNopol').value = `${item.nopol} - ${item.nama} (${item.model})`;
  document.getElementById('wbEditStatus').value = item.status;
  document.getElementById('wbEditSolusi').value = item.solusi;
  document.getElementById('wbEditAlasan').value = item.alasan;

  modal.style.display = 'flex';
}

function saveWinbackEdit(e) {
  if (e) e.preventDefault();

  const id = document.getElementById('wbEditId').value;
  const item = winbackList.find(i => i.id === id);
  if (!item) return;

  item.status = document.getElementById('wbEditStatus').value;
  item.solusi = document.getElementById('wbEditSolusi').value;
  item.alasan = document.getElementById('wbEditAlasan').value;

  localStorage.setItem('EVOLVE_WINBACK_LIST', JSON.stringify(winbackList));
  closeWinbackModal('winbackEditModal');

  if (typeof customAlert === 'function') {
    customAlert(`Status Retensi untuk <strong>${item.nopol} (${item.nama})</strong> diperbarui menjadi: <strong>${item.status}</strong>!`, 'success');
  } else {
    alert(`Status ${item.nopol} berhasil diperbarui!`);
  }

  renderWinbackList();
}

function closeWinbackModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
  initWinbackData();
});
