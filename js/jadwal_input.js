/**
 * Sales App - Kalender & Smart Follow-Up Reminder System
 * File: jadwal_input.js
 */

(function () {
  'use strict';

  // State
  let currentDate = new Date();
  let activeYear = currentDate.getFullYear();
  let activeMonth = currentDate.getMonth(); // 0-indexed (0 = Jan, 11 = Des)
  let selectedDateStr = formatDateKey(currentDate);
  let monthEvents = [];
  let currentCategoryPreset = 'prospek';

  const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const DAY_NAMES_ID = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];

  function getSalesId() {
    return localStorage.getItem('idSales') || 1;
  }

  function getSalesName() {
    return localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
  }

  function padZero(num) {
    return String(num).padStart(2, '0');
  }

  function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = padZero(dateObj.getMonth() + 1);
    const d = padZero(dateObj.getDate());
    return `${y}-${m}-${d}`;
  }

  function formatIndonesianFullDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    const dayName = DAY_NAMES_ID[dt.getDay()];
    const monthName = MONTH_NAMES_ID[m];
    return `${dayName}, ${d} ${monthName} ${y}`;
  }

  // Detect reminder category from title & description
  function detectCategory(item) {
    const text = ((item.judul || '') + ' ' + (item.deskripsi || '')).toLowerCase();
    if (text.includes('stnk') || text.includes('plat') || text.includes('bpkb') || text.includes('nopol')) {
      return { key: 'stnk', name: 'Follow Up STNK', icon: 'fa-file-lines', class: 'cat-stnk', dotClass: 'dot-stnk' };
    }
    if (text.includes('servis') || text.includes('service') || text.includes('1000') || text.includes('1.000') || text.includes('bengkel')) {
      return { key: 'servis', name: 'Reminder Servis Pertama', icon: 'fa-wrench', class: 'cat-servis', dotClass: 'dot-servis' };
    }
    if (text.includes('janji') || text.includes('temu') || text.includes('test drive') || text.includes('showroom')) {
      return { key: 'janjitemu', name: 'Janji Temu / Test Drive', icon: 'fa-handshake', class: 'cat-janjitemu', dotClass: 'dot-janjitemu' };
    }
    if (text.includes('do') || text.includes('serah terima') || text.includes('delivery') || text.includes('kirim')) {
      return { key: 'do', name: 'Serah Terima Unit (DO)', icon: 'fa-gift', class: 'cat-do', dotClass: 'dot-do' };
    }
    if (text.includes('prospek') || text.includes('spk') || text.includes('closing') || text.includes('follow up') || text.includes('si ')) {
      return { key: 'prospek', name: 'Follow Up Prospek', icon: 'fa-car', class: 'cat-prospek', dotClass: 'dot-prospek' };
    }
    return { key: 'other', name: 'Agenda Sales', icon: 'fa-calendar-check', class: 'cat-other', dotClass: 'dot-other' };
  }

  // Extract phone number from text if present
  function extractPhone(text) {
    if (!text) return '';
    const match = text.match(/(?:(?:\+62|62|0)[0-9]{8,13})/);
    if (match) {
      let clean = match[0].replace(/[^0-9]/g, '');
      if (clean.startsWith('0')) clean = '62' + clean.slice(1);
      return clean;
    }
    return '';
  }

  // Fetch reminders for active month & year
  async function loadMonthEvents() {
    const salesId = getSalesId();
    const month = activeMonth + 1;
    const year = activeYear;

    try {
      const res = await fetch(`../api/api_jadwal.php?sales_account_id=${salesId}&month=${month}&year=${year}&view=calendar`);
      const json = await res.json();

      if (json.status === 'success' && Array.isArray(json.data)) {
        monthEvents = json.data;
      } else {
        monthEvents = [];
      }
    } catch (err) {
      console.warn('Gagal memuat jadwal dari server, menggunakan cache/lokal:', err);
      monthEvents = [];
    }

    updateStatsBar();
    renderCalendar();
    renderSelectedDateAgenda();
  }

  // Update statistics bar
  function updateStatsBar() {
    const totalMonth = monthEvents.length;
    const todayStr = formatDateKey(new Date());
    const todayEvents = monthEvents.filter(e => e.tanggal === todayStr);
    const scheduledCount = monthEvents.filter(e => e.status !== 'Selesai').length;
    const doneCount = monthEvents.filter(e => e.status === 'Selesai').length;

    const elTotal = document.getElementById('statTotalBulan');
    const elToday = document.getElementById('statHariIni');
    const elTerjadwal = document.getElementById('statTerjadwal');
    const elSelesai = document.getElementById('statSelesai');

    if (elTotal) elTotal.textContent = totalMonth;
    if (elToday) elToday.textContent = todayEvents.length;
    if (elTerjadwal) elTerjadwal.textContent = scheduledCount;
    if (elSelesai) elSelesai.textContent = doneCount;
  }

  // Render Calendar Grid
  function renderCalendar() {
    const calTitle = document.getElementById('calMonthYear');
    if (calTitle) {
      calTitle.textContent = `${MONTH_NAMES_ID[activeMonth]} ${activeYear}`;
    }

    const gridEl = document.getElementById('calendarDaysGrid');
    if (!gridEl) return;

    gridEl.innerHTML = '';

    const firstDayIndex = new Date(activeYear, activeMonth, 1).getDay(); // 0 = Sun, 1 = Mon, ...
    // Convert to Monday-first (0 = Mon, 6 = Sun)
    const startOffset = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

    const todayStr = formatDateKey(new Date());

    // 1. Previous Month Days (Muted)
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDayNum = daysInPrevMonth - i;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<span class="cal-day-number">${prevDayNum}</span>`;
      gridEl.appendChild(cell);
    }

    // 2. Current Month Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${activeYear}-${padZero(activeMonth + 1)}-${padZero(day)}`;
      const dayEvents = monthEvents.filter(e => e.tanggal === dateKey);

      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      if (dateKey === todayStr) cell.classList.add('is-today');
      if (dateKey === selectedDateStr) cell.classList.add('is-selected');

      let dotsHtml = '';
      if (dayEvents.length > 0) {
        dotsHtml = '<div class="cal-event-dots">';
        const shownDots = dayEvents.slice(0, 3);
        shownDots.forEach(ev => {
          const cat = detectCategory(ev);
          dotsHtml += `<span class="cal-dot ${cat.dotClass}" title="${escapeHtml(ev.judul)}"></span>`;
        });
        if (dayEvents.length > 3) {
          dotsHtml += `<span class="cal-event-badge-count">+${dayEvents.length - 3}</span>`;
        }
        dotsHtml += '</div>';
      }

      cell.innerHTML = `
        <span class="cal-day-number">${day}</span>
        ${dotsHtml}
      `;

      cell.addEventListener('click', () => {
        selectDate(dateKey);
      });

      gridEl.appendChild(cell);
    }

    // 3. Next Month Days to fill grid
    const totalCells = startOffset + daysInMonth;
    const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<span class="cal-day-number">${nextDay}</span>`;
      gridEl.appendChild(cell);
    }
  }

  // Select Date in Calendar
  function selectDate(dateKey) {
    selectedDateStr = dateKey;

    // Highlight selected cell in calendar
    document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('is-selected'));
    const allCells = document.querySelectorAll('.cal-day-cell:not(.other-month)');
    const dayNum = parseInt(dateKey.split('-')[2], 10);
    if (allCells[dayNum - 1]) {
      allCells[dayNum - 1].classList.add('is-selected');
    }

    // Auto-fill form date input
    const inputTgl = document.getElementById('jadwalTanggal');
    if (inputTgl) inputTgl.value = selectedDateStr;

    // Render agenda list
    renderSelectedDateAgenda();
  }

  // Render Agenda for Selected Date
  function renderSelectedDateAgenda() {
    const headerTitle = document.getElementById('agendaSelectedDateTitle');
    const countPill = document.getElementById('agendaCountPill');
    const container = document.getElementById('agendaItemList');

    if (headerTitle) {
      headerTitle.textContent = formatIndonesianFullDate(selectedDateStr);
    }

    if (!container) return;

    const filtered = monthEvents.filter(e => e.tanggal === selectedDateStr);

    if (countPill) {
      countPill.textContent = `${filtered.length} Agenda`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="agenda-empty-state">
          <div class="agenda-empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
          <p>Belum ada jadwal follow-up pada tanggal ini.</p>
          <button type="button" class="btn-empty-add" onclick="focusFormWithSelectedDate()">
            <i class="fa-solid fa-plus"></i> Buat Reminder Tanggal Ini
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      const cat = detectCategory(item);
      const isDone = (item.status === 'Selesai');
      const timeStr = item.jam ? `${item.jam} WIB` : (item.waktu ? `${item.waktu}` : 'Sepanjang Hari');
      const customerText = item.deskripsi || 'Customer Tunas Toyota';
      const phone = extractPhone(item.deskripsi) || '';

      return `
        <div class="agenda-item-card ${isDone ? 'is-done' : ''}" id="agenda-card-${item.id}">
          <div class="agenda-item-top">
            <span class="agenda-time-pill">
              <i class="fa-regular fa-clock"></i> ${timeStr}
            </span>
            <span class="agenda-cat-badge ${cat.class}">
              <i class="fa-solid ${cat.icon}"></i> ${cat.name}
            </span>
          </div>

          <h4 class="agenda-item-title">${escapeHtml(item.judul)}</h4>
          
          <p class="agenda-item-customer">
            <i class="fa-solid fa-user-tag" style="color: var(--primary-red);"></i> ${escapeHtml(customerText)}
          </p>

          <div class="agenda-item-actions">
            <!-- 1-Click WhatsApp Follow-Up -->
            <button type="button" class="btn-action-wa" onclick="sendFollowUpWa('${item.id}', '${cat.key}')" title="Kirim Pesan Follow-Up ke WhatsApp Customer">
              <i class="fa-brands fa-whatsapp"></i> Chat WA
            </button>

            <!-- Toggle Selesai / Terjadwal -->
            <button type="button" class="btn-action-toggle ${isDone ? 'btn-done' : ''}" onclick="toggleStatusJadwal(${item.id}, '${isDone ? 'Terjadwal' : 'Selesai'}')">
              <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-check'}"></i> ${isDone ? 'Selesai' : 'Tandai Selesai'}
            </button>

            <!-- Hapus Jadwal -->
            <button type="button" class="btn-action-delete" onclick="hapusJadwal(${item.id})" title="Hapus Reminder">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Quick Action: WhatsApp Template Generator
  window.sendFollowUpWa = function (id, catKey) {
    const item = monthEvents.find(e => String(e.id) === String(id));
    if (!item) return;

    const salesName = getSalesName();
    const customerInfo = item.deskripsi || 'Bapak/Ibu';
    let targetPhone = extractPhone(customerInfo);

    if (!targetPhone) {
      const inputPhone = prompt('Masukkan nomor WhatsApp customer (contoh: 08123456789):');
      if (!inputPhone) return;
      targetPhone = inputPhone.replace(/[^0-9]/g, '');
      if (targetPhone.startsWith('0')) targetPhone = '62' + targetPhone.slice(1);
    }

    let text = '';
    if (catKey === 'stnk') {
      text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨.\n\nIzin menginformasikan terkait perkembangan berkas *STNK & Plat Nomor Resmi* kendaraan Toyota Anda.\n\n📌 *Detail Agenda:* ${item.judul}\nℹ️ *Catatan:* ${item.deskripsi}\n\nKapan ada waktu luang untuk kami jadwalkan serah terima atau konfirmasi pengambilannya ya Pak/Bu? Jika ada hal yang ingin ditanyakan, saya siap bantu. Terima kasih banyak! 🙏`;
    } else if (catKey === 'servis') {
      text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨.\n\nMengingatkan kembali jadwal penting untuk unit Toyota kesayangan Anda:\n🔧 *${item.judul}*\n\nServis berkala pertama (1.000 KM / 1 Bulan) sangat penting agar performa mesin, garansi resmi Toyota, dan kenyamanan berkendara tetap optimal & terawat 100% gratis.\n\nBoleh kami bantu bookingkan jadwal servisnya di bengkel resmi Tunas Toyota Kiara Condong ya Pak/Bu? Terima kasih! 🙏`;
    } else if (catKey === 'janjitemu') {
      text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨.\n\nKonfirmasi janji temu showroom / test drive resmi:\n📅 *${item.judul}*\n📍 *Lokasi:* Showroom Tunas Toyota Kiara Condong (Jl. Ibrahim Adjie No. 47, Bandung)\n\nUnit test drive siap kami siapkan khusus untuk Bapak/Ibu. Sampai bertemu nanti ya Pak/Bu, terima kasih! 🙏`;
    } else if (catKey === 'do') {
      text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨.\n\nSelamat atas pemesanan unit Toyota impian Anda! 🥳🎉\nIzin konfirmasi persiapan *Serah Terima Unit (Delivery Order)*:\n\n📋 *Agenda:* ${item.judul}\n🚗 *Keterangan:* ${item.deskripsi}\n\nKami siap mengantarkan unit dalam kondisi terbaik & bersih ke alamat Bapak/Ibu. Terima kasih atas kepercayaan Anda kepada kami! 🙏`;
    } else {
      text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨.\n\nIzin follow-up terkait rencana pemesanan unit Toyota Anda:\n📋 *Agenda:* ${item.judul}\n\nApakah ada info simulasi kredit DP ringan, promo weekend cashback, atau ketersediaan unit ready stock yang ingin saya bantu hitungkan kembali hari ini Pak/Bu? Terima kasih banyak! 🙏`;
    }

    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Toggle status Terjadwal / Selesai
  window.toggleStatusJadwal = async function (id, newStatus) {
    try {
      const res = await fetch('../api/api_jadwal.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const json = await res.json();
      if (json.status === 'success') {
        const item = monthEvents.find(e => e.id === id);
        if (item) item.status = newStatus;
        updateStatsBar();
        renderSelectedDateAgenda();
      } else {
        alert('Gagal memperbarui status: ' + (json.message || 'Terjadi kesalahan'));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal terhubung ke server.');
    }
  };

  // Hapus Jadwal
  window.hapusJadwal = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus reminder jadwal ini?')) return;

    try {
      const res = await fetch(`../api/api_jadwal.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.status === 'success') {
        monthEvents = monthEvents.filter(e => e.id !== id);
        updateStatsBar();
        renderCalendar();
        renderSelectedDateAgenda();
      } else {
        alert('Gagal menghapus jadwal: ' + (json.message || 'Terjadi kesalahan'));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal terhubung ke server.');
    }
  };

  // Focus form and autofill selected date
  window.focusFormWithSelectedDate = function () {
    const inputTgl = document.getElementById('jadwalTanggal');
    const inputJudul = document.getElementById('jadwalJudul');
    if (inputTgl) inputTgl.value = selectedDateStr;
    if (inputJudul) {
      inputJudul.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputJudul.focus();
    }
  };

  // Preset Chips Clicking
  function setupPresetChips() {
    const chips = document.querySelectorAll('.preset-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const preset = chip.getAttribute('data-preset');
        currentCategoryPreset = preset;

        const inputJudul = document.getElementById('jadwalJudul');
        const inputCust = document.getElementById('jadwalDeskripsi');
        const inputCatatan = document.getElementById('jadwalCatatan');

        if (preset === 'stnk') {
          if (inputJudul) inputJudul.value = 'Follow Up STNK & Plat Nomor';
          if (inputCust && !inputCust.value) inputCust.placeholder = 'Misal: Pak Budi - Calya G (STNK Jadi)';
          if (inputCatatan && !inputCatatan.value) inputCatatan.value = 'Konfirmasi penyerahan berkas STNK & Plat Asli ke konsumen.';
        } else if (preset === 'servis') {
          if (inputJudul) inputJudul.value = 'Reminder Servis Pertama (1.000 KM)';
          if (inputCust && !inputCust.value) inputCust.placeholder = 'Misal: Ibu Dewi - Innova Zenix';
          if (inputCatatan && !inputCatatan.value) inputCatatan.value = 'Ingatkan konsumen jadwal servis gratis 1.000 KM / 1 Bulan agar garansi terjaga.';
        } else if (preset === 'prospek') {
          if (inputJudul) inputJudul.value = 'Follow Up Prospek / SPK';
          if (inputCust && !inputCust.value) inputCust.placeholder = 'Misal: Pak Andi - Veloz Q';
          if (inputCatatan && !inputCatatan.value) inputCatatan.value = 'Follow up kelanjutan simulasi kredit DP ringan & ketersediaan warna unit.';
        } else if (preset === 'janjitemu') {
          if (inputJudul) inputJudul.value = 'Janji Temu Showroom & Test Drive';
          if (inputCust && !inputCust.value) inputCust.placeholder = 'Misal: Bapak Doni - Yaris Cross';
          if (inputCatatan && !inputCatatan.value) inputCatatan.value = 'Konsumen datang ke dealer Kircon untuk tes kenyamanan unit & negosiasi.';
        } else if (preset === 'do') {
          if (inputJudul) inputJudul.value = 'Serah Terima Unit (Delivery Order)';
          if (inputCust && !inputCust.value) inputCust.placeholder = 'Misal: Ibu Ratna - Fortuner GR';
          if (inputCatatan && !inputCatatan.value) inputCatatan.value = 'Delivery ceremony & serah terima kunci serta kelengkapan bonus unit.';
        } else {
          if (inputJudul) inputJudul.value = '';
          if (inputCust) inputCust.placeholder = 'Misal: Bapak Andi - Innova';
        }
      });
    });
  }

  // Status Chips Form
  function setupStatusChips() {
    const statusBtns = document.querySelectorAll('.status-chip-btn');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        statusBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const st = btn.getAttribute('data-status');
        const hiddenInput = document.getElementById('jadwalStatus');
        if (hiddenInput) hiddenInput.value = st;
      });
    });
  }

  // Save new schedule
  window.simpanJadwal = async function () {
    const form = document.getElementById('formJadwal');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const tanggal = document.getElementById('jadwalTanggal').value;
    const jam = document.getElementById('jadwalWaktu').value;
    const judul = document.getElementById('jadwalJudul').value.trim();
    const customerUnit = document.getElementById('jadwalDeskripsi').value.trim();
    const wa = (document.getElementById('jadwalWa')?.value || '').trim();
    const catatan = (document.getElementById('jadwalCatatan')?.value || '').trim();
    const status = document.getElementById('jadwalStatus').value;
    const salesId = getSalesId();

    if (!tanggal || !jam || !judul) {
      alert('Mohon lengkapi tanggal, jam, dan judul reminder!');
      return;
    }

    // Build combined description
    let deskripsiLengkap = customerUnit;
    if (wa) {
      deskripsiLengkap += ` (${wa})`;
    }
    if (catatan) {
      deskripsiLengkap += ` | ${catatan}`;
    }

    const saveBtn = document.querySelector('.btn-primary-submit');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
      const res = await fetch('../api/api_jadwal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sales_account_id: salesId,
          tanggal: tanggal,
          jam: jam,
          judul: judul,
          deskripsi: deskripsiLengkap,
          status: status
        })
      });

      const json = await res.json();

      if (json.status === 'success') {
        alert('🎉 Reminder jadwal berhasil disimpan!');

        // If the newly created event is in a different month, switch active month
        const parts = tanggal.split('-');
        if (parts.length === 3) {
          activeYear = parseInt(parts[0], 10);
          activeMonth = parseInt(parts[1], 10) - 1;
        }

        selectedDateStr = tanggal;

        // Reload events and refresh UI
        await loadMonthEvents();

        // Reset form inputs except date
        document.getElementById('jadwalJudul').value = '';
        document.getElementById('jadwalDeskripsi').value = '';
        if (document.getElementById('jadwalWa')) document.getElementById('jadwalWa').value = '';
        if (document.getElementById('jadwalCatatan')) document.getElementById('jadwalCatatan').value = '';

        // Scroll up to agenda list
        const agendaCard = document.getElementById('agendaCardSection');
        if (agendaCard) {
          agendaCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        alert('Gagal menyimpan jadwal: ' + (json.message || 'Terjadi kesalahan'));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal terhubung ke server.');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Simpan Jadwal & Reminder';
      }
    }
  };

  // Nav Month buttons
  function setupCalendarNav() {
    const btnPrev = document.getElementById('btnCalPrev');
    const btnNext = document.getElementById('btnCalNext');
    const btnToday = document.getElementById('btnCalToday');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        activeMonth--;
        if (activeMonth < 0) {
          activeMonth = 11;
          activeYear--;
        }
        loadMonthEvents();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        activeMonth++;
        if (activeMonth > 11) {
          activeMonth = 0;
          activeYear++;
        }
        loadMonthEvents();
      });
    }

    if (btnToday) {
      btnToday.addEventListener('click', () => {
        const now = new Date();
        activeYear = now.getFullYear();
        activeMonth = now.getMonth();
        selectDate(formatDateKey(now));
        loadMonthEvents();
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    // Set initial date & time in form
    const now = new Date();
    const inputTgl = document.getElementById('jadwalTanggal');
    const inputJam = document.getElementById('jadwalWaktu');

    if (inputTgl) inputTgl.value = selectedDateStr;
    if (inputJam) {
      inputJam.value = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
    }

    setupPresetChips();
    setupStatusChips();
    setupCalendarNav();
    loadMonthEvents();
  });

})();
