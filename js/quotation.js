/**
 * quotation.js
 * Engine Surat Penawaran Harga (SPH) & Digital Quotation Studio
 * Tunas Toyota Kiara Condong Bandung
 */

const TOYOTA_MODELS = [
  { id: 'zenix-v-cvt', name: 'Innova Zenix 2.0 V CVT Gasoline', otr: 476200000, img: '../assets/img/mobil/zenix.webp', category: 'MPV' },
  { id: 'zenix-q-hv', name: 'Innova Zenix 2.0 Q HV Modellista TSS', otr: 633600000, img: '../assets/img/mobil/zenix.webp', category: 'Hybrid' },
  { id: 'zenix-g-cvt', name: 'Innova Zenix 2.0 G CVT Gasoline', otr: 436500000, img: '../assets/img/mobil/zenix.webp', category: 'MPV' },
  { id: 'avanza-g-cvt', name: 'All New Avanza 1.5 G CVT', otr: 279800000, img: '../assets/img/mobil/avanza.webp', category: 'MPV' },
  { id: 'veloz-q-tss', name: 'All New Veloz 1.5 Q CVT TSS', otr: 343400000, img: '../assets/img/mobil/veloz.webp', category: 'MPV' },
  { id: 'yaris-cross-hv', name: 'Yaris Cross 1.5 S HV GR Parts TSS', otr: 454400000, img: '../assets/img/mobil/yaris-cross.webp', category: 'Hybrid' },
  { id: 'rush-gr-at', name: 'All New Rush 1.5 S GR Sport A/T', otr: 316400000, img: '../assets/img/mobil/rush.webp', category: 'SUV' },
  { id: 'fortuner-vrz-gr', name: 'New Fortuner 2.8 VRZ GR-S 4x2 A/T', otr: 648500000, img: '../assets/img/mobil/fortuner.webp', category: 'SUV' },
  { id: 'agya-g-cvt', name: 'All New Agya 1.2 G CVT', otr: 198400000, img: '../assets/img/mobil/agya.webp', category: 'Hatchback' },
  { id: 'calya-g-at', name: 'New Calya 1.2 G A/T', otr: 193600000, img: '../assets/img/mobil/calya.webp', category: 'MPV' },
  { id: 'rangga-pu-dsl', name: 'Hilux Rangga Pick Up 2.4 DSL High A/T', otr: 309500000, img: '../assets/img/mobil/rangga.webp', category: 'Commercial' },
  { id: 'alphard-hev', name: 'All New Alphard 2.5 HEV', otr: 1710000000, img: '../assets/img/mobil/alphard.webp', category: 'Premium' }
];

let currentScheme = 'kredit'; // 'kredit' | 'cash'
let currentSphNumber = '';

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function formatNumber(val) {
  return new Intl.NumberFormat('id-ID').format(val);
}

function getRomawiBulan(monthIdx) {
  const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romawi[monthIdx] || 'I';
}

function generateSphNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const romawi = getRomawiBulan(now.getMonth());
  // Gunakan jam, menit dan random deterministik untuk nomor surat unik
  const randomSeq = String(Math.floor(100 + Math.random() * 900));
  return `${randomSeq}/SPH-SLS/TT-KC/${romawi}/${year}`;
}

function populateModelDropdown() {
  const select = document.getElementById('sphModelSelect');
  if (!select) return;

  select.innerHTML = '';
  TOYOTA_MODELS.forEach((m, idx) => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name} - ${formatRupiah(m.otr)}`;
    opt.dataset.otr = m.otr;
    opt.dataset.name = m.name;
    opt.dataset.img = m.img;
    if (idx === 0) opt.selected = true;
    select.appendChild(opt);
  });
}

function onModelChanged() {
  const select = document.getElementById('sphModelSelect');
  const selectedOpt = select.options[select.selectedIndex];
  if (!selectedOpt) return;

  const otr = parseFloat(selectedOpt.dataset.otr) || 0;
  const otrInput = document.getElementById('sphOtrInput');
  if (otrInput) otrInput.value = otr;

  updateSphLive();
}

function setScheme(scheme) {
  currentScheme = scheme;

  const btnKredit = document.getElementById('btnSchemeKredit');
  const btnCash = document.getElementById('btnSchemeCash');
  const sectionKredit = document.getElementById('sectionBuilderKredit');
  const sectionCash = document.getElementById('sectionBuilderCash');

  if (scheme === 'cash') {
    btnCash?.classList.add('active');
    btnKredit?.classList.remove('active');
    if (sectionCash) sectionCash.style.display = 'block';
    if (sectionKredit) sectionKredit.style.display = 'none';
  } else {
    btnKredit?.classList.add('active');
    btnCash?.classList.remove('active');
    if (sectionKredit) sectionKredit.style.display = 'block';
    if (sectionCash) sectionCash.style.display = 'none';
  }

  updateSphLive();
}

function updateSphLive() {
  // 1. Data Dokumen & Konsumen
  const customerType = document.getElementById('sphCustomerType')?.value || 'Perorangan';
  const customerName = document.getElementById('sphCustomerName')?.value.trim() || 'Bapak/Ibu Calon Konsumen';
  const customerPhone = document.getElementById('sphCustomerPhone')?.value.trim() || '-';
  const customerCompany = document.getElementById('sphCustomerCompany')?.value.trim() || '';
  const customerCity = document.getElementById('sphCustomerCity')?.value.trim() || 'Bandung';

  const sphDate = document.getElementById('sphDate')?.value || new Date().toISOString().split('T')[0];
  const validityDays = parseInt(document.getElementById('sphValidity')?.value) || 7;

  // Format tanggal Indonesia
  const d = new Date(sphDate);
  const optDate = { day: 'numeric', month: 'long', year: 'numeric' };
  const strDate = d.toLocaleDateString('id-ID', optDate);

  const expDate = new Date(d);
  expDate.setDate(expDate.getDate() + validityDays);
  const strExpDate = expDate.toLocaleDateString('id-ID', optDate);

  // Sync to SPH Paper Meta
  document.getElementById('docSphNumber').textContent = currentSphNumber;
  document.getElementById('docSphDate').textContent = strDate;
  document.getElementById('docSphValidity').textContent = `${strExpDate} (${validityDays} Hari)`;

  let recipientHtml = `<strong>${customerName}</strong>`;
  if (customerCompany) {
    recipientHtml += `<br><span style="color:#475569; font-weight:600;">${customerCompany}</span>`;
  }
  document.getElementById('docRecipientName').innerHTML = recipientHtml;
  document.getElementById('docRecipientPhone').textContent = customerPhone;
  document.getElementById('docRecipientCity').textContent = customerCity;

  // 2. Data Unit & Banner
  const modelSelect = document.getElementById('sphModelSelect');
  const selectedOpt = modelSelect ? modelSelect.options[modelSelect.selectedIndex] : null;
  const modelName = selectedOpt ? selectedOpt.dataset.name : 'Toyota Unit';
  const modelImg = selectedOpt ? selectedOpt.dataset.img : '../assets/img/mobil/zenix.webp';

  const colorChoice = document.getElementById('sphColorChoice')?.value.trim() || 'Pilihan Bebas (Sesuai Ketersediaan Unit)';
  const unitYear = document.getElementById('sphUnitYear')?.value || '2026';

  document.getElementById('docUnitModel').textContent = modelName;
  document.getElementById('docUnitColor').textContent = `Warna: ${colorChoice} | Tahun Perakitan: ${unitYear} (100% Baru OTR Jawa Barat)`;
  document.getElementById('docUnitImg').src = modelImg;

  // 3. Data Finansial
  const otr = parseFloat(document.getElementById('sphOtrInput')?.value) || 0;
  const diskon = parseFloat(document.getElementById('sphDiskonInput')?.value) || 0;
  const bookingFee = parseFloat(document.getElementById('sphBookingFeeInput')?.value) || 5000000;
  const hargaNett = Math.max(0, otr - diskon);

  const tableBody = document.getElementById('docFinancialTableBody');
  if (!tableBody) return;

  if (currentScheme === 'cash') {
    const sisaPelunasan = Math.max(0, hargaNett - bookingFee);

    tableBody.innerHTML = `
      <tr>
        <td>1</td>
        <td><strong>Harga Kendaraan On The Road (OTR Bandung)</strong></td>
        <td class="text-right">${formatRupiah(otr)}</td>
      </tr>
      <tr class="row-highlight">
        <td>2</td>
        <td>Potongan Diskon / Cashback Resmi Dealer</td>
        <td class="text-right">- ${formatRupiah(diskon)}</td>
      </tr>
      <tr style="background:#f8fafc; font-weight:700;">
        <td>3</td>
        <td><strong>Harga Bersih / Netto Kendaraan</strong></td>
        <td class="text-right"><strong>${formatRupiah(hargaNett)}</strong></td>
      </tr>
      <tr>
        <td>4</td>
        <td>Tanda Jadi Pemesanan / Booking Fee Unit</td>
        <td class="text-right">${formatRupiah(bookingFee)}</td>
      </tr>
      <tr class="row-total">
        <td colspan="2">SISA PELUNASAN TUNAI SEBELUM DELIVERY ORDER (DO)</td>
        <td class="text-right">${formatRupiah(sisaPelunasan)}</td>
      </tr>
    `;
    document.getElementById('docFinancialNotes').textContent =
      '* Pelunasan dapat dilakukan setelah unit dialokasikan nomor rangka & mesin, serta sebelum proses faktur STNK diterbitkan.';
  } else {
    // Skema Kredit
    const dpPercent = parseFloat(document.getElementById('sphDpPercent')?.value) || 20;
    const tenorMonths = parseInt(document.getElementById('sphTenor')?.value) || 60;
    const leasingName = document.getElementById('sphLeasingSelect')?.value || 'TAF (Toyota Astra Financial)';
    const insuranceType = document.getElementById('sphInsuranceType')?.value || 'Comprehensive (All Risk)';

    // Perhitungan Kredit Realistis
    const dpMurni = hargaNett * (dpPercent / 100);
    const pokokHutang = hargaNett - dpMurni;

    // Suku bunga acuan berdasarkan tenor
    let bungaPerTahun = 0.045; // 4.5% flat
    if (tenorMonths === 12) bungaPerTahun = 0.025;
    else if (tenorMonths === 24) bungaPerTahun = 0.035;
    else if (tenorMonths === 36) bungaPerTahun = 0.042;
    else if (tenorMonths === 48) bungaPerTahun = 0.048;
    else if (tenorMonths === 60) bungaPerTahun = 0.055;
    else if (tenorMonths === 72) bungaPerTahun = 0.062;

    const totalBunga = pokokHutang * bungaPerTahun * (tenorMonths / 12);
    const angsuranBulanan = Math.round((pokokHutang + totalBunga) / tenorMonths);

    // Total DP (Termasuk admin, asuransi, dan cicilan pertama)
    const biayaAdminAsuransi = Math.round(hargaNett * 0.035);
    const totalDpNett = Math.round(dpMurni + biayaAdminAsuransi - (diskon > 0 ? diskon * 0.25 : 0));
    const sisaDpBayar = Math.max(0, totalDpNett - bookingFee);

    tableBody.innerHTML = `
      <tr>
        <td>1</td>
        <td><strong>Harga On The Road (OTR Bandung)</strong></td>
        <td class="text-right">${formatRupiah(otr)}</td>
      </tr>
      <tr class="row-highlight">
        <td>2</td>
        <td>Subsidi Diskon / Pengurang DP dari Dealer</td>
        <td class="text-right">- ${formatRupiah(diskon)}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Mitra Pembiayaan & Asuransi</td>
        <td class="text-right">${leasingName.split(' ')[0]} &bull; ${insuranceType}</td>
      </tr>
      <tr style="background:#f8fafc; font-weight:700;">
        <td>4</td>
        <td><strong>Total Uang Muka (TDP Nett)</strong></td>
        <td class="text-right"><strong>${formatRupiah(totalDpNett)}</strong></td>
      </tr>
      <tr>
        <td>5</td>
        <td>Booking Fee (Tanda Jadi Pengurang TDP)</td>
        <td class="text-right">${formatRupiah(bookingFee)}</td>
      </tr>
      <tr class="row-highlight" style="background:#f0fdf4; color:#15803d;">
        <td>6</td>
        <td>Sisa TDP yang Dibayarkan Saat ACC Leasing</td>
        <td class="text-right"><strong>${formatRupiah(sisaDpBayar)}</strong></td>
      </tr>
      <tr class="row-total">
        <td colspan="2">ANGSURAN PER BULAN (${tenorMonths} Bulan / ${tenorMonths / 12} Tahun)</td>
        <td class="text-right">${formatRupiah(angsuranBulanan)} /bln</td>
      </tr>
    `;
    document.getElementById('docFinancialNotes').textContent =
      `* Skema pembiayaan via ${leasingName}. Paket termasuk Asuransi ${insuranceType}, Polis, Biaya Administrasi & Fidusia. Perhitungan mengikat saat aplikasi disetujui.`;
  }

  // 4. Bonus & Paket Fasilitas
  const bonusCheckboxes = document.querySelectorAll('.sph-bonus-checkbox');
  const bonusListContainer = document.getElementById('docBonusList');
  if (bonusListContainer) {
    let items = [];
    bonusCheckboxes.forEach(chk => {
      if (chk.checked) {
        items.push(`<div class="sph-bonus-item"><i class="fa-solid fa-circle-check"></i> ${chk.dataset.label}</div>`);
      }
    });

    if (items.length === 0) {
      items.push(`<div class="sph-bonus-item"><i class="fa-solid fa-circle-check"></i> Standard Factory Equipment & Tool Kit Resmi</div>`);
    }

    bonusListContainer.innerHTML = items.join('');
  }

  // 5. Data Sales & Tanda Tangan
  const salesName = localStorage.getItem('namaSales') || localStorage.getItem('user_nama') || 'Egy Pratama';
  const salesPhone = localStorage.getItem('noHpSales') || localStorage.getItem('user_telepon') || '0812-2154-1540';
  const salesRole = localStorage.getItem('user_role') || 'Senior Sales Executive';

  document.getElementById('docSalesName').textContent = salesName;
  document.getElementById('docSalesContact').textContent = `HP/WA: ${salesPhone} | Tunas Toyota Kiara Condong`;
  document.getElementById('docSignSalesName').textContent = salesName;
  document.getElementById('docSignSalesRole').textContent = salesRole;
  document.getElementById('docSignCustomerName').textContent = customerName;
}

function printQuotation() {
  updateSphLive();
  window.print();
}

function shareQuotationWA() {
  updateSphLive();

  const customerName = document.getElementById('sphCustomerName')?.value.trim() || 'Bapak/Ibu';
  const customerPhone = document.getElementById('sphCustomerPhone')?.value.trim() || '';
  const modelSelect = document.getElementById('sphModelSelect');
  const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].dataset.name : 'Toyota Unit';
  const otr = parseFloat(document.getElementById('sphOtrInput')?.value) || 0;
  const diskon = parseFloat(document.getElementById('sphDiskonInput')?.value) || 0;
  const bookingFee = parseFloat(document.getElementById('sphBookingFeeInput')?.value) || 5000000;
  const hargaNett = Math.max(0, otr - diskon);

  const salesName = document.getElementById('docSalesName').textContent;
  const salesPhone = localStorage.getItem('noHpSales') || '0812-2154-1540';

  let msg = `📄 *SURAT PENAWARAN HARGA RESMI TUNAS TOYOTA* 📄\n` +
            `Nomor: *${currentSphNumber}*\n\n` +
            `Kepada Yth.\n` +
            `*${customerName}*\n\n` +
            `Terima kasih atas minat dan kepercayaan Bapak/Ibu kepada Tunas Toyota Kiara Condong Bandung. Berikut kami lampirkan rincian penawaran harga spesial:\n\n` +
            `🚘 *Unit*: ${modelName}\n` +
            `🏷️ *Harga OTR*: ${formatRupiah(otr)}\n` +
            `🎁 *Diskon Khusus*: - ${formatRupiah(diskon)}\n` +
            `✨ *Harga Netto*: *${formatRupiah(hargaNett)}*\n\n`;

  if (currentScheme === 'cash') {
    const sisa = Math.max(0, hargaNett - bookingFee);
    msg += `💳 *SKEMA PEMBELIAN TUNAI (CASH)*:\n` +
           `• Tanda Jadi / Booking Fee: ${formatRupiah(bookingFee)}\n` +
           `• Sisa Pelunasan Sebelum DO: *${formatRupiah(sisa)}*\n\n`;
  } else {
    const dpPercent = document.getElementById('sphDpPercent')?.value || 20;
    const tenorMonths = document.getElementById('sphTenor')?.value || 60;
    const leasingName = document.getElementById('sphLeasingSelect')?.value || 'TAF';

    const dpMurni = hargaNett * (dpPercent / 100);
    const biayaAdminAsuransi = Math.round(hargaNett * 0.035);
    const totalDpNett = Math.round(dpMurni + biayaAdminAsuransi - (diskon > 0 ? diskon * 0.25 : 0));
    const pokokHutang = hargaNett - dpMurni;
    const bungaPerTahun = 0.055;
    const totalBunga = pokokHutang * bungaPerTahun * (tenorMonths / 12);
    const angsuran = Math.round((pokokHutang + totalBunga) / tenorMonths);

    msg += `💳 *SKEMA KREDIT (${leasingName.split(' ')[0]})*:\n` +
           `• Total DP Nett: *${formatRupiah(totalDpNett)}*\n` +
           `• Angsuran: *${formatRupiah(angsuran)} / bulan*\n` +
           `• Tenor: ${tenorMonths} Bulan (${tenorMonths / 12} Tahun)\n` +
           `• Tanda Jadi Booking: ${formatRupiah(bookingFee)}\n\n`;
  }

  msg += `🎁 *BONUS & FASILITAS RESMI*:\n` +
         `• Free Kaca Film Bergaransi Resmi\n` +
         `• Free Service & Oli s/d 50.000 KM (T-Care)\n` +
         `• Karpet Dasar Original & APAR Tabung\n` +
         `• Layanan Derek Emergency Toyota 24 Jam\n\n` +
         `🛡️ *REKENING RESMI DEALER (KEAMANAN TRANSAKSI)*:\n` +
         `BCA Cabang Sudirman Bandung\n` +
         `No. Rekening: *008-303-9999*\n` +
         `Atas Nama: *PT TUNAS RIDEAN TBK*\n` +
         `_(Pembayaran hanya sah melalui rekening resmi dealer di atas)_\n\n` +
         `Untuk penguncian alokasi unit dan berkas faktur hari ini, silakan hubungi:\n` +
         `👤 *${salesName}*\n` +
         `📞 WhatsApp: ${salesPhone}\n` +
         `🏢 *PT Tunas Ridean Tbk - Tunas Toyota Kiara Condong Bandung*`;

  let targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  if (customerPhone && customerPhone.replace(/[^0-9]/g, '').length >= 9) {
    let cleanNumber = customerPhone.replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('0')) cleanNumber = '62' + cleanNumber.substring(1);
    targetUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(msg)}`;
  }

  window.open(targetUrl, '_blank');
}

function copyQuotationText() {
  updateSphLive();

  const customerName = document.getElementById('sphCustomerName')?.value.trim() || 'Bapak/Ibu';
  const modelSelect = document.getElementById('sphModelSelect');
  const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].dataset.name : 'Toyota Unit';
  const otr = parseFloat(document.getElementById('sphOtrInput')?.value) || 0;
  const diskon = parseFloat(document.getElementById('sphDiskonInput')?.value) || 0;
  const hargaNett = Math.max(0, otr - diskon);

  const text = `Penawaran Resmi Tunas Toyota Kiara Condong\nNo: ${currentSphNumber}\nKonsumen: ${customerName}\nUnit: ${modelName}\nOTR: ${formatRupiah(otr)}\nDiskon: ${formatRupiah(diskon)}\nNetto: ${formatRupiah(hargaNett)}\nHubungi: ${document.getElementById('docSalesName').textContent}`;

  navigator.clipboard.writeText(text).then(() => {
    alert('Teks ringkasan penawaran berhasil disalin ke clipboard!');
  }).catch(() => {
    prompt('Salin teks penawaran:', text);
  });
}

function switchMobileTab(view) {
  const workspace = document.querySelector('.sph-workspace');
  const tabBuilder = document.getElementById('tabMobileBuilder');
  const tabPreview = document.getElementById('tabMobilePreview');

  if (view === 'preview') {
    workspace.classList.remove('view-builder');
    workspace.classList.add('view-preview');
    tabPreview.classList.add('active');
    tabBuilder.classList.remove('active');
    updateSphLive();
  } else {
    workspace.classList.remove('view-preview');
    workspace.classList.add('view-builder');
    tabBuilder.classList.add('active');
    tabPreview.classList.remove('active');
  }
}

// Inisialisasi awal saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  currentSphNumber = generateSphNumber();
  populateModelDropdown();

  // Cek parameter URL dari kalkulator atau halaman lain
  const params = new URLSearchParams(window.location.search);
  const paramModel = params.get('model');
  const paramOtr = params.get('otr');
  const paramDiskon = params.get('diskon');
  const paramScheme = params.get('scheme');
  const paramTenor = params.get('tenor');
  const paramDp = params.get('dp');

  if (paramModel) {
    const select = document.getElementById('sphModelSelect');
    for (let opt of select.options) {
      if (opt.value.toLowerCase().includes(paramModel.toLowerCase()) || opt.dataset.name.toLowerCase().includes(paramModel.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }

  if (paramOtr && !isNaN(paramOtr)) {
    document.getElementById('sphOtrInput').value = paramOtr;
  } else {
    onModelChanged();
  }

  if (paramDiskon && !isNaN(paramDiskon)) {
    document.getElementById('sphDiskonInput').value = paramDiskon;
  }

  if (paramScheme === 'cash') {
    setScheme('cash');
  } else {
    setScheme('kredit');
  }

  if (paramTenor) {
    const tSelect = document.getElementById('sphTenor');
    if (tSelect) tSelect.value = paramTenor;
  }

  if (paramDp) {
    const dpSelect = document.getElementById('sphDpPercent');
    if (dpSelect) dpSelect.value = paramDp;
  }

  // Set tanggal hari ini
  const dateInput = document.getElementById('sphDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  updateSphLive();
});
