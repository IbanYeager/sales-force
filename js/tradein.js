/**
 * tradein.js
 * Instant Trade-In & Early Settlement Calculator Logic
 */

function formatRupiahTrade(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

let activeTradeMode = 'appraisal'; // 'appraisal' or 'settlement'

function switchTradeTab(mode) {
  activeTradeMode = mode;
  document.getElementById('tabBtnAppraisal').classList.toggle('active', mode === 'appraisal');
  document.getElementById('tabBtnSettlement').classList.toggle('active', mode === 'settlement');
  
  const boxEarly = document.getElementById('boxEarlySettlement');
  const rowPelunasan = document.getElementById('rowPelunasanLama');
  const formTitle = document.getElementById('formTitleText');

  if (mode === 'settlement') {
    boxEarly.style.display = 'block';
    rowPelunasan.style.display = 'flex';
    formTitle.textContent = 'Data Mobil Lama & Sisa Kredit Leasing';
  } else {
    boxEarly.style.display = 'none';
    rowPelunasan.style.display = 'none';
    formTitle.textContent = 'Data Mobil Lama Konsumen';
  }

  calcTradeInValuation();
}

const MARKET_BASE_PRICES = {
  'Avanza': 130000000,
  'Veloz': 160000000,
  'Innova': 210000000,
  'Fortuner': 320000000,
  'Calya': 95000000,
  'Agya': 90000000,
  'Rush': 170000000,
  'Brio': 115000000,
  'HR-V': 210000000,
  'Jazz': 140000000,
  'Xpander': 175000000,
  'Pajero': 330000000,
  'Xenia': 110000000,
  'Sigra': 90000000,
  'Ertiga': 135000000,
  'Almaz': 180000000,
  'Rangga': 160000000
};

function calcTradeInValuation() {
  const merk = document.getElementById('trMerk').value;
  const modelText = document.getElementById('trModel').value.trim() || 'Avanza 1.3 G M/T';
  const tahun = parseInt(document.getElementById('trTahun').value) || 2018;
  const kondisiFactor = parseFloat(document.getElementById('trKondisi').value) || 0.95;

  const targetVal = document.getElementById('trTargetModel').value;
  const targetParts = targetVal.split('|');
  const targetOtr = parseFloat(targetParts[0]) || 315300000;
  const targetModelName = targetParts[1] || 'All New Veloz 1.5 Q CVT';

  const dpTargetPct = parseFloat(document.getElementById('trDpTargetPct').value) || 20;
  const subsidiTradeIn = parseFloat(document.getElementById('trSubsidiTradeIn').value) || 3000000;

  // Base price matching
  let basePrice = 135000000;
  for (let key in MARKET_BASE_PRICES) {
    if (modelText.toLowerCase().includes(key.toLowerCase())) {
      basePrice = MARKET_BASE_PRICES[key];
      break;
    }
  }

  // Depreciation / Appreciation by year (base year 2018)
  const diffYear = tahun - 2018;
  let yearMultiplier = 1.0 + (diffYear * 0.06);
  if (yearMultiplier < 0.3) yearMultiplier = 0.3;

  const estimatedMarketPrice = Math.round(basePrice * yearMultiplier * kondisiFactor);
  
  let totalHutangPelunasan = 0;
  if (activeTradeMode === 'settlement') {
    const sisaBulan = parseInt(document.getElementById('trSisaBulan').value) || 0;
    const angsuranLama = parseFloat(document.getElementById('trAngsuranLama').value) || 0;
    const penaltiPct = parseFloat(document.getElementById('trPenaltiPct').value) || 0.02;

    // Estimasi pokok hutang pelunasan dipercepat (diskon bunga berjalan ~40% dari total sisa angsuran)
    const grossTotalSisa = sisaBulan * angsuranLama;
    const estimasiPokok = grossTotalSisa * 0.82; // perkiraan pokok bersih
    const penalti = estimasiPokok * penaltiPct;
    totalHutangPelunasan = Math.round(estimasiPokok + penalti);

    document.getElementById('lblHutangPelunasan').textContent = `- ${formatRupiahTrade(totalHutangPelunasan)}`;
  }

  const netMobilLamaValuation = Math.max(0, estimatedMarketPrice - totalHutangPelunasan);
  const totalValuationWithSubsidi = netMobilLamaValuation + subsidiTradeIn;
  const dpRequired = Math.round(targetOtr * (dpTargetPct / 100));
  const diffAmount = totalValuationWithSubsidi - dpRequired;

  // Update UI
  document.getElementById('lblMobilLamaHarga').textContent = formatRupiahTrade(estimatedMarketPrice);
  document.getElementById('lblMobilLamaDesc').textContent = `${merk} ${modelText} (Tahun ${tahun})`;
  document.getElementById('lblDpBaruDibutuhkan').textContent = formatRupiahTrade(dpRequired);
  document.getElementById('lblTotalValuationWithSubsidi').textContent = formatRupiahTrade(totalValuationWithSubsidi);

  const titleEl = document.getElementById('lblSummaryTitle');
  const valEl = document.getElementById('lblSisaDanaVal');

  if (diffAmount >= 0) {
    titleEl.textContent = 'SISA DANA DITERIMA KONSUMEN (CASHBACK):';
    titleEl.style.color = '#4ade80';
    valEl.textContent = formatRupiahTrade(diffAmount);
    valEl.style.color = '#4ade80';
  } else {
    titleEl.textContent = 'KEKURANGAN UNTUK DP UNIT BARU:';
    titleEl.style.color = '#f87171';
    valEl.textContent = formatRupiahTrade(Math.abs(diffAmount));
    valEl.style.color = '#f87171';
  }
}

function shareTradeInWA() {
  calcTradeInValuation();

  const mobilLamaDesc = document.getElementById('lblMobilLamaDesc').textContent;
  const hargaMobilLama = document.getElementById('lblMobilLamaHarga').textContent;
  const targetVal = document.getElementById('trTargetModel').value;
  const targetModelName = targetVal.split('|')[1] || 'Unit Toyota Baru';
  const totalValuation = document.getElementById('lblTotalValuationWithSubsidi').textContent;
  const dpRequired = document.getElementById('lblDpBaruDibutuhkan').textContent;
  const summaryTitle = document.getElementById('lblSummaryTitle').textContent;
  const summaryVal = document.getElementById('lblSisaDanaVal').textContent;

  let extraNote = '';
  if (activeTradeMode === 'settlement') {
    const sisaBulan = document.getElementById('trSisaBulan').value;
    const angsuran = formatRupiahTrade(document.getElementById('trAngsuranLama').value);
    const hutang = document.getElementById('lblHutangPelunasan').textContent;
    extraNote = `\n🔄 *Status Over-Kredit & Pelunasan:* Sisa ${sisaBulan} bln @ ${angsuran}\n📉 *Estimasi Pelunasan Pokok Hutang:* ${hutang}`;
  }

  const text = `🚗 *SIMULASI TUKAR TAMBAH (TRADE-IN) TUNAS TOYOTA* 🚗
Dealer: Tunas Toyota Kiara Condong Bandung

📌 *Data Mobil Lama Konsumen:*
• Unit: ${mobilLamaDesc}
• Estimasi Nilai Taksiran Pasar: *${hargaMobilLama}*${extraNote}
• Subsidi Program Trade-In Tunas: +Rp 3.000.000

✨ *Target Pembelian Mobil Baru:*
• Model: *${targetModelName}*
• Kebutuhan DP: *${dpRequired}*

📊 *Hasil Simulasi Tukar Tambah:*
• Nilai Bersih Mobil Lama: *${totalValuation}*
• ${summaryTitle} *${summaryVal}*

Unit lama kami jemput langsung ke rumah dan berkas dibantu sampai selesai! Hubungi kami untuk jadwal appraisal fisik gratis.`;

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Initial calculation
calcTradeInValuation();
