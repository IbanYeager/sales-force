/**
 * wa_studio.js
 * WhatsApp Sales Fast-Reply, Broadcast Studio & T-STOCK AI Bot Hub
 */

const WA_TEMPLATES = {
  followup_testdrive: `Halo *{nama}*,\n\nBagaimana kesan berkendara Anda saat mencoba unit *{model}* kemarin bersama saya?\n\nSemoga sesuai dengan ekspektasi kenyamanan keluarga Anda! Khusus pendaftaran SPK minggu ini, kami ada bonus *Free Kaca Film V-Kool Original + Voucher Bensin Rp 1 Juta*.\n\nApakah besok ada waktu luang untuk kita bicarakan skema hitungan kredit terbaiknya?\n\nSalam hangat,\n*{sales}*\nTunas Toyota Kiara Condong`,
  
  promo_dp: `Halo *{nama}*,\n\nAda kabar gembira khusus untuk Anda! Bulan ini Tunas Toyota merilis *Program Flash Sale DP Ringan Paket Spektakuler* untuk varian *{model}*:\n\n✨ *DP Ringan mulai 15%*\n✨ *Bunga 0% Tenor 1 Tahun*\n✨ *Gratis Biaya Servis & Sparepart 4 Tahun / 50.000 KM*\n\nKuota unit promo ready stock sangat terbatas. Apakah saya bisa buatkan simulasi hitungannya hari ini?\n\nTerima kasih,\n*{sales}*\nTunas Toyota`,
  
  undangan_pameran: `Undangan Spesial Weekend Sales Tunas Toyota 🎈✨\n\nYth. *{nama}*,\n\nKami mengundang Anda dan keluarga untuk hadir dalam acara *Weekend Sales Showroom Tunas Toyota Kiara Condong* pada:\n\n📅 *Hari/Tgl*: Sabtu & Minggu Pekan Ini\n⏰ *Waktu*: 09.00 - 16.00 WIB\n📍 *Lokasi*: Showroom Tunas Toyota Kircon\n\nNikmati sajian kuliner gratis, *Test Drive Gift*, serta *Extra Cashback hingga Rp 10 Juta* khusus transaksi di tempat!\n\nKonfirmasi kehadiran Anda ke WhatsApp saya ya Pak/Bu.\n\nBest regards,\n*{sales}*`,
  
  ucapan_ultah: `Selamat Ulang Tahun *{nama}*! 🎉🎂✨\n\nSemoga senantiasa diberikan kesehatan, kebahagiaan, dan kelancaran rezeki di usia yang baru ini.\n\nSebagai bentuk apresiasi dari Tunas Toyota, kami menyiapkan *Special Loyalty Voucher Diskon Servis & Aksesoris 20%* khusus untuk Anda.\n\nSalam hangat dari keluarga besar Tunas Toyota! 🚗❤️`,
  
  servis_rutin: `Halo *{nama}*,\n\nTidak terasa unit *{model}* kesayangan Anda sudah menemani aktivitas selama 1 bulan / 1.000 KM pertama.\n\nKami ingatkan untuk melakukan *Servis Berkala Pertama (Gratis Biaya Jasa & Check 23 Komponen)* agar garansi resmi Toyota Anda tetap aktif penuh.\n\nApakah ingin saya bantu *Booking Service* di bengkel resmi Tunas Toyota untuk hari apa?\n\nTerima kasih,\n*{sales}*`
};

let currentTemplateId = 'followup_testdrive';

let currentSentinelStudioData = null;

function switchWaTab(tab) {
  const btnBroadcast = document.getElementById('tabBtnBroadcast');
  const btnAiBot = document.getElementById('tabBtnAiBot');
  const btnSentinel = document.getElementById('tabBtnSentinel');
  const secBroadcast = document.getElementById('sectionBroadcast');
  const secAiBot = document.getElementById('sectionAiBot');
  const secSentinel = document.getElementById('sectionSentinel');

  // Reset tab states
  [btnBroadcast, btnAiBot, btnSentinel].forEach(btn => {
    if (btn) {
      btn.style.background = '#f1f5f9';
      btn.style.color = '#475569';
    }
  });
  if (secBroadcast) secBroadcast.style.display = 'none';
  if (secAiBot) secAiBot.style.display = 'none';
  if (secSentinel) secSentinel.style.display = 'none';

  if (tab === 'broadcast') {
    if (btnBroadcast) {
      btnBroadcast.style.background = '#15803d';
      btnBroadcast.style.color = '#ffffff';
    }
    if (secBroadcast) secBroadcast.style.display = 'grid';
  } else if (tab === 'aibot') {
    if (btnAiBot) {
      btnAiBot.style.background = '#c8102e';
      btnAiBot.style.color = '#ffffff';
    }
    if (secAiBot) secAiBot.style.display = 'block';

    // Populate Webhook URL
    const urlInput = document.getElementById('waWebhookUrl');
    if (urlInput) {
      const currentOrigin = window.location.origin;
      const pathParts = window.location.pathname.split('/');
      pathParts.pop(); // remove wa_studio.html
      pathParts.pop(); // remove pages
      const rootPath = pathParts.join('/');
      urlInput.value = `${currentOrigin}${rootPath}/api/api_wa_bot.php`;
    }
  } else if (tab === 'sentinel') {
    if (btnSentinel) {
      btnSentinel.style.background = '#4338ca';
      btnSentinel.style.color = '#ffffff';
    }
    if (secSentinel) secSentinel.style.display = 'grid';

    // Populate Cron URL
    const cronEl = document.getElementById('sentinelCronUrl');
    if (cronEl) {
      const currentOrigin = window.location.origin;
      const pathParts = window.location.pathname.split('/');
      pathParts.pop();
      pathParts.pop();
      const rootPath = pathParts.join('/');
      cronEl.textContent = `${currentOrigin}${rootPath}/api/api_ai_kacab_sentinel.php`;
    }

    fetchSentinelStudioReport(19);
  }
}

async function fetchSentinelStudioReport(day = 19) {
  const bubble = document.getElementById('sentinelWaBubble');
  if (bubble) bubble.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memuat laporan AI Sentinel hari ke-${day}...`;

  try {
    const res = await fetch(`../api/api_ai_kacab_sentinel.php?hari=${day}&bulan=8`);
    const json = await res.json();
    if (json.status === 'success') {
      currentSentinelStudioData = json;
      if (bubble) bubble.innerText = json.wa_report_message;
    } else {
      if (bubble) bubble.innerText = '⚠️ Gagal memuat audit AI Sentinel.';
    }
  } catch (err) {
    if (bubble) bubble.innerText = '⚠️ Koneksi gagal ke endpoint AI Sentinel.';
  }
}

function copySentinelWaReport() {
  if (currentSentinelStudioData && currentSentinelStudioData.wa_report_message) {
    navigator.clipboard.writeText(currentSentinelStudioData.wa_report_message);
    alert('✅ Laporan WhatsApp AI Kacab berhasil disalin!');
  }
}

function sendSentinelWaDirect() {
  if (currentSentinelStudioData && currentSentinelStudioData.wa_share_url) {
    window.open(currentSentinelStudioData.wa_share_url, '_blank');
  } else {
    alert('Memuat data laporan...');
  }
}

function selectWaTemplate(id) {
  currentTemplateId = id;
  document.querySelectorAll('.template-card').forEach(el => el.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  renderWaPreview();
}

function renderWaPreview() {
  const nama = document.getElementById('waNamaInput').value.trim() || 'Bapak/Ibu';
  const model = document.getElementById('waModelInput').value.trim() || 'Toyota Unit';
  const sales = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Egy (Sales Consultant)';

  const rawTpl = WA_TEMPLATES[currentTemplateId] || WA_TEMPLATES['followup_testdrive'];
  const formatted = rawTpl.replace(/\{nama\}/g, nama).replace(/\{model\}/g, model).replace(/\{sales\}/g, sales);

  document.getElementById('waBodyTextarea').value = formatted;
  const bubble = document.getElementById('waBubblePreview');
  if (bubble) bubble.innerText = formatted;
}

function copyWaText() {
  const text = document.getElementById('waBodyTextarea').value;
  navigator.clipboard.writeText(text);
  alert('Teks pesan WhatsApp berhasil disalin!');
}

function sendWaDirect() {
  const text = document.getElementById('waBodyTextarea').value;
  const phone = document.getElementById('waPhoneInput').value.trim();

  let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  if (phone && phone.length > 5) {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    url = `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(text)}`;
  }

  window.open(url, '_blank');
}

function copyWebhookUrl() {
  const urlInput = document.getElementById('waWebhookUrl');
  if (urlInput) {
    navigator.clipboard.writeText(urlInput.value);
    alert('✅ Endpoint Webhook WhatsApp berhasil disalin:\n' + urlInput.value);
  }
}

function simQuick(text) {
  const input = document.getElementById('waBotSimInput');
  if (input) {
    input.value = text;
    sendSimulatedWaMessage();
  }
}

async function sendSimulatedWaMessage() {
  const input = document.getElementById('waBotSimInput');
  const history = document.getElementById('waBotSimulatorHistory');
  if (!input || !history || !input.value.trim()) return;

  const msg = input.value.trim();
  input.value = '';

  // 1. User WhatsApp Bubble
  const userBubble = document.createElement('div');
  userBubble.style.cssText = "background: #d9fdd3; color: #111b21; padding: 10px 14px; border-radius: 12px 12px 0 12px; font-size: 12px; max-width: 80%; align-self: flex-end; box-shadow: 0 1px 3px rgba(0,0,0,0.1); word-break: break-word;";
  userBubble.innerText = msg;
  history.appendChild(userBubble);
  history.scrollTop = history.scrollHeight;

  // 2. Typing Indicator
  const typingBubble = document.createElement('div');
  typingBubble.style.cssText = "background: white; border-radius: 12px 12px 12px 0; padding: 8px 12px; font-size: 11.5px; color: #64748b; align-self: flex-start; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);";
  typingBubble.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #25D366;"></i> <span>T-STOCK Bot sedang memproses data...</span>`;
  history.appendChild(typingBubble);
  history.scrollTop = history.scrollHeight;

  try {
    const res = await fetch('../api/api_wa_bot.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: '08123456789 (Konsumen)',
        message: msg
      })
    });

    const json = await res.json();
    if (typingBubble.parentNode) typingBubble.parentNode.removeChild(typingBubble);

    const replyText = json.reply || json.response || 'Maaf, bot tidak dapat memberikan balasan saat ini.';

    // 3. AI Bot WhatsApp Bubble
    const botBubble = document.createElement('div');
    botBubble.style.cssText = "background: white; border-radius: 12px 12px 12px 0; padding: 12px 14px; font-size: 12px; color: #111b21; max-width: 88%; align-self: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.1); line-height: 1.55; white-space: pre-wrap; font-family: inherit;";
    botBubble.innerText = replyText;

    // Add 1-click share to real WhatsApp button below bubble
    const shareBtn = document.createElement('div');
    shareBtn.style.cssText = "margin-top: 8px; padding-top: 6px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: flex-end;";
    shareBtn.innerHTML = `
      <a href="${json.wa_share_url || 'https://wa.me/?text=' + encodeURIComponent(replyText)}" target="_blank" style="font-size: 11px; font-weight: 800; color: #15803d; background: #ecfdf5; border: 1px solid #86efac; padding: 3px 8px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-brands fa-whatsapp" style="font-size: 12px;"></i> Teruskan ke WhatsApp Konsumen
      </a>
    `;
    botBubble.appendChild(shareBtn);

    history.appendChild(botBubble);
  } catch(err) {
    if (typingBubble.parentNode) typingBubble.parentNode.removeChild(typingBubble);
    const botBubble = document.createElement('div');
    botBubble.style.cssText = "background: white; border-radius: 12px 12px 12px 0; padding: 10px 14px; font-size: 12px; color: #dc2626; max-width: 85%; align-self: flex-start;";
    botBubble.innerText = '⚠️ Gagal terhubung ke endpoint T-STOCK WhatsApp Bot.';
    history.appendChild(botBubble);
  }

  history.scrollTop = history.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  renderWaPreview();
  // Initialize webhook url
  const urlInput = document.getElementById('waWebhookUrl');
  if (urlInput) {
    const currentOrigin = window.location.origin;
    const pathParts = window.location.pathname.split('/');
    pathParts.pop(); // remove wa_studio.html
    pathParts.pop(); // remove pages
    const rootPath = pathParts.join('/');
    urlInput.value = `${currentOrigin}${rootPath}/api/api_wa_bot.php`;
  }
});
