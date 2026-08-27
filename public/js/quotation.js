/**
 * quotation.js
 * Smart Digital Quotation Logic & WA Share
 */

function formatRupiahQuote(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

function updateQuotationCalc() {
  const modelVal = document.getElementById('qModelSelect').value;
  const parts = modelVal.split('|');
  const otr = parseFloat(parts[0]) || 0;
  const modelName = parts[1] || 'Toyota Unit';

  const namaKonsumen = document.getElementById('qNamaKonsumen').value.trim() || 'Bapak/Ibu Calon Konsumen';
  const noWa = document.getElementById('qNoWa').value.trim() || '-';
  const diskon = parseFloat(document.getElementById('qDiskon').value) || 0;
  const dpPersen = parseFloat(document.getElementById('qDpPersen').value) || 20;
  const tenor = parseInt(document.getElementById('qTenor').value) || 60;
  const leasing = document.getElementById('qLeasing').value || 'ACC';

  const hargaNett = Math.max(0, otr - diskon);
  const dpNett = Math.round(hargaNett * (dpPersen / 100));
  const sisaPlafond = hargaNett - dpNett;

  // Calculate monthly installment estimate with interest (approx 5.5% flat p.a.)
  const annualInterest = tenor === 12 ? 0.0 : 0.055;
  const totalDebt = sisaPlafond + (sisaPlafond * annualInterest * (tenor / 12));
  const angsuran = Math.round(totalDebt / tenor);

  // Update preview DOM elements
  document.getElementById('previewNamaKonsumen').textContent = namaKonsumen;
  document.getElementById('previewNoWa').textContent = 'WA: ' + noWa;
  document.getElementById('previewModel').textContent = modelName;
  document.getElementById('previewOtr').textContent = formatRupiahQuote(otr);
  document.getElementById('previewDiskon').textContent = '- ' + formatRupiahQuote(diskon);
  document.getElementById('previewHargaNett').textContent = formatRupiahQuote(hargaNett);
  document.getElementById('previewDpNett').textContent = formatRupiahQuote(dpNett);
  document.getElementById('previewTenor').textContent = tenor;
  document.getElementById('previewLeasing').textContent = leasing.split(' ')[0];
  document.getElementById('previewAngsuran').textContent = formatRupiahQuote(angsuran) + ' /bln';
  document.getElementById('previewTotalDpBottom').textContent = formatRupiahQuote(dpNett);

  const salesNama = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Egy (Sales Consultant)';
  document.getElementById('previewSalesName').textContent = salesNama;

  // Bonus items
  let bonuses = [];
  if (document.getElementById('chkVkool').checked) bonuses.push('&bull; Free Kaca Film V-Kool / 3M');
  if (document.getElementById('chkService').checked) bonuses.push('&bull; Free Service 4 Tahun / 50.000 KM');
  if (document.getElementById('chkKarpet').checked) bonuses.push('&bull; Karpet Dasar Original Toyota');
  if (document.getElementById('chkVoucher').checked) bonuses.push('&bull; Voucher Bensin Rp 1 Juta');

  document.getElementById('previewBonusList').innerHTML = bonuses.length > 0 ? bonuses.join('<br>') : '&bull; Standard Factory Package';
}

function shareQuotationWA() {
  updateQuotationCalc();

  const namaKonsumen = document.getElementById('previewNamaKonsumen').textContent;
  const noWa = document.getElementById('qNoWa').value.trim();
  const modelName = document.getElementById('previewModel').textContent;
  const otr = document.getElementById('previewOtr').textContent;
  const diskon = document.getElementById('previewDiskon').textContent;
  const hargaNett = document.getElementById('previewHargaNett').textContent;
  const dpNett = document.getElementById('previewDpNett').textContent;
  const tenor = document.getElementById('previewTenor').textContent;
  const leasing = document.getElementById('qLeasing').value;
  const angsuran = document.getElementById('previewAngsuran').textContent;
  const salesNama = document.getElementById('previewSalesName').textContent;

  const text = `📄 *SURAT PENAWARAN HARGA RESMI TUNAS TOYOTA* 📄
Yth. *${namaKonsumen}*,

Berikut kami sampaikan rincian penawaran harga spesial unit impian Anda:

🚘 *Model*: ${modelName}
🏷️ *Harga OTR Bandung*: ${otr}
🎁 *Potongan Cashback/Diskon*: ${diskon}
✨ *Harga Netto*: ${hargaNett}

💳 *SKEMA KREDIT ESTIMASI*:
• *Uang Muka (Total DP Nett)*: *${dpNett}*
• *Angsuran*: *${angsuran}* (${tenor} Bulan via ${leasing})

🎁 *BONUS INCLUDED*:
• Free Kaca Film V-Kool / 3M Original
• Free Service & Sparepart 4 Thn / 50.000 KM
• Karpet Dasar Original Toyota
• Priority Unit Ready Stock

Untuk pemesanan / kunci unit warna impian hari ini, silakan balas pesan ini. Terima kasih!

Salam hangat,
*${salesNama}*
Tunas Toyota Kiara Condong`;

  let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  if (noWa && noWa.length > 5) {
    let cleanPhone = noWa.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  }

  window.open(waUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuotationCalc();
});
