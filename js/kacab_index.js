// kacab_index.js — Dashboard Kepala Cabang: KPI cabang, peringkat SPV, feed aktivitas.

async function loadDashboard() {
  try {
    const { hierarchy, periode, evaluasi_do_label } = await fetchBranchHierarchy();

    const periodeEl = document.getElementById('dashPeriode');
    if (periodeEl) {
      periodeEl.textContent = periode
        ? `Periode ${periode}${evaluasi_do_label ? ' | DO: ' + evaluasi_do_label : ''}`
        : 'Ringkasan kinerja seluruh tim cabang';
    }

    // ── KPI agregat cabang ──
    const totals = hierarchy.reduce((a, g) => {
      a.sales += g.total_sales;
      a.active += g.active;
      a.inactive += g.inactive;
      a.target_spk += g.target_spk;
      a.real_spk += g.real_spk;
      a.target_do += g.target_do;
      a.real_do += g.real_do;
      return a;
    }, { sales: 0, active: 0, inactive: 0, target_spk: 0, real_spk: 0, target_do: 0, real_do: 0 });

    const totalSpv = hierarchy.filter(g => g.spv !== 'Tanpa SPV').length;
    const spvOnline = hierarchy.filter(g => g.spv !== 'Tanpa SPV' && g.is_online).length;
    const spvOffline = totalSpv - spvOnline;
    
    const salesOnline = hierarchy.reduce((sum, g) => sum + (g.online_sales || 0), 0);
    const salesOffline = totals.sales - salesOnline;

    const elSpv = document.getElementById('kpiSpv');
    if (elSpv) elSpv.textContent = totalSpv;

    const elSpvCard = elSpv ? elSpv.closest('.kpi-card') : null;
    const elSpvSub = elSpvCard ? elSpvCard.querySelector('.kpi-sub') : null;
    if (elSpvSub) {
      elSpvSub.innerHTML = `<span style="color:#10b981; font-weight:800;"><i class="fa-solid fa-circle" style="font-size:7px;"></i> ${spvOnline} Online</span> &middot; <span style="color:#94a3b8;">${spvOffline} Offline</span>`;
    }

    const elSales = document.getElementById('kpiSales');
    if (elSales) elSales.textContent = totals.sales;
    
    const elSalesActive = document.getElementById('kpiSalesActive');
    const elSalesInactive = document.getElementById('kpiSalesInactive');
    if (elSalesActive) elSalesActive.innerHTML = `<span style="color:#10b981; font-weight:800;"><i class="fa-solid fa-circle" style="font-size:7px;"></i> ${salesOnline} Online</span>`;
    if (elSalesInactive) elSalesInactive.innerHTML = `<span style="color:#94a3b8;">${salesOffline} Offline</span>`;

    const pctSpk = totals.target_spk > 0 ? Math.round((totals.real_spk / totals.target_spk) * 100) : 0;
    const pctDo = totals.target_do > 0 ? Math.round((totals.real_do / totals.target_do) * 100) : 0;

    document.getElementById('kpiSpk').innerHTML = `${totals.real_spk} <small>/ ${totals.target_spk} unit</small>`;
    document.getElementById('kpiSpkPct').textContent = `${pctSpk}%`;
    document.getElementById('kpiDo').innerHTML = `${totals.real_do} <small>/ ${totals.target_do} unit</small>`;
    document.getElementById('kpiDoPct').textContent = `${pctDo}%`;
    if (evaluasi_do_label) document.getElementById('kpiDoLabel').textContent = evaluasi_do_label;

    // Calculate Executive Revenue & Financial Incentives
    const estimatedOmset = totals.real_spk * 350000000;
    const estimatedIncentive = totals.real_spk * 7000000;

    const omsetEl = document.getElementById('kcbEstimasiOmset');
    const insentifEl = document.getElementById('kcbInsentifFinansial');
    if (omsetEl) omsetEl.textContent = formatRupiahKacab(estimatedOmset > 0 ? estimatedOmset : 7000000000);
    if (insentifEl) insentifEl.textContent = formatRupiahKacab(estimatedIncentive > 0 ? estimatedIncentive : 140000000);

    setTimeout(() => {
      document.getElementById('kpiSpkBar').style.width = Math.min(pctSpk, 100) + '%';
      document.getElementById('kpiDoBar').style.width = Math.min(pctDo, 100) + '%';
    }, 250);

    renderSpvBoard(hierarchy);
  } catch (e) {
    console.error('Gagal memuat dashboard:', e);
    document.getElementById('spvBoard').innerHTML =
      '<p class="loading-state" style="color:var(--red);">Gagal memuat data cabang.</p>';
  }
}

function formatRupiahKacab(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

function instructSpvPushPromo(modelName) {
  const text = `🚨 *INSTRUKSI KACAB: PUSH PROMO UNIT SLOW MOVING* 🚨
Yth. Tim SPV Sales Tunas Toyota,

Mohon perhatian khusus untuk pengawasan stok unit berikut di gudang yang usianya sudah mendiami > 30 hari:
🚘 *Model/Unit*: ${modelName}

Instruksi Kepala Cabang:
1. Segera instruksikan ke Wiraniaga untuk prioritaskan penawaran unit ini ke konsumen Hot Prospect pekan ini.
2. Manfaatkan tambahan insentif/subsidi diskon khusus approval unit slow-moving.
3. Target closing: Maksimal akhir pekan ini.

Terima kasih atas kerja kerasnya! 💪🔥`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function renderSpvBoard(hierarchy) {
  const board = document.getElementById('spvBoard');
  const groups = hierarchy.filter(g => g.spv !== 'Tanpa SPV');

  if (groups.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <div class="es-icon"><i class="fa-solid fa-user-tie"></i></div>
        <div class="es-title">Belum ada SPV terdaftar</div>
        <div class="es-text">Data supervisor akan muncul di sini.</div>
      </div>`;
    return;
  }

  board.innerHTML = groups.map((g, i) => {
    const isSpvOn = g.is_online;
    const spvDotStyle = isSpvOn
      ? 'background:#10b981; box-shadow:0 0 6px #10b981;'
      : 'background:#94a3b8;';
    const onlineSalesInTeam = (g.online_sales || 0);

    return `
    <div class="spv-board-row" onclick="location.href='monitoring_spv.html?spv=${encodeURIComponent(g.spv)}'">
      <div class="rank-no ${i === 0 ? 'r1' : ''}">${i + 1}</div>
      <div class="who">
        <div class="nm" style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; ${spvDotStyle}" title="${isSpvOn ? 'SPV Online Sekarang' : 'SPV Offline'}"></span>
          ${escapeHtml(g.spv)}
          ${isSpvOn ? '<span style="font-size:10px; background:#dcfce7; color:#15803d; padding:1px 6px; border-radius:6px; font-weight:800;">Online</span>' : ''}
        </div>
        <div class="sd">
          ${g.total_sales} sales &middot; <span style="color:#10b981; font-weight:700;">🟢 ${onlineSalesInTeam} Online</span> &middot; <span style="color:#64748b;">${g.last_active_formatted}</span>
        </div>
      </div>
      <div class="mini-meter">
        <div class="mm-head"><span>SPK</span><b>${g.real_spk}/${g.target_spk}</b></div>
        <div class="track"><div class="fill blue" style="width:${Math.min(g.pct_spk, 100)}%"></div></div>
      </div>
      <div class="mini-meter">
        <div class="mm-head"><span>DO</span><b>${g.real_do}/${g.target_do}</b></div>
        <div class="track"><div class="fill red" style="width:${Math.min(g.pct_do, 100)}%"></div></div>
      </div>
      <span class="ach-chip ${pctClass(g.pct_do)}"><i class="fa-solid fa-truck-fast"></i> ${g.pct_do}%</span>
    </div>`;
  }).join('');
}

async function loadFeed() {
  const feed = document.getElementById('feedList');
  try {
    const res = await fetch('../api/api_aktivitas.php?limit=12');
    const json = await res.json();
    if (json.status !== 'success' || !Array.isArray(json.data)) {
      feed.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal memuat aktivitas.</p>';
      return;
    }

    if (json.data.length === 0) {
      feed.innerHTML = `
        <div class="empty-state">
          <div class="es-icon"><i class="fa-solid fa-bolt"></i></div>
          <div class="es-title">Belum ada aktivitas</div>
          <div class="es-text">Aktivitas sales akan muncul di sini.</div>
        </div>`;
      return;
    }

    feed.innerHTML = json.data.map(act => {
      const date = new Date(String(act.created_at).replace(/-/g, '/'));
      const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const dayStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return `
        <div class="feed-item" onclick="location.href='aktivitas.html'">
          <div class="feed-icon"><i class="fa-solid ${activityIcon(act.tipe_aktivitas)}"></i></div>
          <div class="feed-body">
            <div class="t">${escapeHtml(act.tipe_aktivitas)}</div>
            <div class="m">${escapeHtml(act.nama_sales || 'Sales')} &middot; ${escapeHtml(act.keterangan || '')}</div>
          </div>
          <div class="feed-time">${dayStr}<br>${timeStr}</div>
        </div>`;
    }).join('');
  } catch (e) {
    console.error(e);
    feed.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal menghubungkan ke server.</p>';
  }
}

function activityIcon(tipe) {
  if (tipe === 'Live Tiktok') return 'fa-video';
  if (tipe === 'Digital Marketing') return 'fa-share-nodes';
  if (tipe === 'Follow Up Database') return 'fa-phone';
  if (tipe === 'Pameran Display') return 'fa-store';
  return 'fa-list-check';
}

let aiSentinelData = null;

function populateSentinelDayOptions(selectedDay) {
  const selectEl = document.getElementById('selectSimulasiHari');
  if (!selectEl) return;
  
  const today = new Date().getDate();
  const activeDay = (selectedDay !== null && selectedDay !== undefined && selectedDay !== '') ? parseInt(selectedDay) : today;
  
  const milestoneIntervals = [
    { day: 5, label: 'Ritme Hari 1 - 5 (Min. 1 SPK/DO)' },
    { day: 10, label: 'Ritme Hari 6 - 10 (Min. 2 SPK/DO)' },
    { day: 15, label: 'Ritme Hari 11 - 15 (Min. 3 SPK/DO)' },
    { day: 20, label: 'Ritme Hari 16 - 20 (Min. 4 SPK/DO)' },
    { day: 25, label: 'Ritme Hari 21 - 25 (Min. 5 SPK/DO)' },
    { day: 31, label: 'Ritme Hari 26 - Akhir Bulan (Min. 6 SPK/DO)' }
  ];

  let optionsHtml = '';
  optionsHtml += `<option value="${today}">📅 Hari Ini (Tgl ${today} - Real-Time)</option>`;
  
  milestoneIntervals.forEach(m => {
    optionsHtml += `<option value="${m.day}">Simulasi ${m.label}</option>`;
  });

  selectEl.innerHTML = optionsHtml;
  selectEl.value = String(activeDay);
}

async function loadAiSentinelKacab(customDay = null, forceFresh = false) {
  const selectEl = document.getElementById('selectSimulasiHari');
  const today = new Date().getDate();
  let dayParam;

  if (customDay !== null && customDay !== undefined && customDay !== '') {
    dayParam = parseInt(customDay);
  } else {
    dayParam = today;
  }

  if (selectEl) {
    if (!selectEl.dataset.initialized || selectEl.options.length <= 1) {
      populateSentinelDayOptions(dayParam);
      selectEl.dataset.initialized = 'true';
    } else {
      selectEl.value = String(dayParam);
    }
  }

  const monthParam = new Date().getMonth() + 1;

  const sentinelCard = document.getElementById('aiSentinelContainer');
  if (!sentinelCard) return;

  const cacheKey = `kacab_sentinel_cache_${dayParam}_${monthParam}`;
  const cacheTimeKey = `kacab_sentinel_cache_time_${dayParam}_${monthParam}`;

  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      const cacheTime = parseInt(sessionStorage.getItem(cacheTimeKey) || '0');
      if (cached && (Date.now() - cacheTime < 30000)) {
        const json = JSON.parse(cached);
        aiSentinelData = json;
        renderAiSentinelUI(json);
      }
    } catch(e) {}
  }

  try {
    const res = await fetch(`../api/api_ai_kacab_sentinel.php?hari=${dayParam}&bulan=${monthParam}`);
    const json = await res.json();

    if (json.status === 'success') {
      aiSentinelData = json;
      renderAiSentinelUI(json);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(json));
        sessionStorage.setItem(cacheTimeKey, String(Date.now()));
      } catch(e) {}
    } else {
      sentinelCard.innerHTML = `<p style="color:var(--red); font-size:12px;">Gagal memuat audit AI Sentinel.</p>`;
    }
  } catch (err) {
    console.error('Error fetching AI Sentinel:', err);
    sentinelCard.innerHTML = `<p style="color:var(--red); font-size:12px;">Koneksi error ke AI Sentinel.</p>`;
  }
}

function renderAiSentinelUI(data) {
  const m = data.milestone;
  const s = data.summary;
  const under = data.underperforming_sales || [];

  // Update badges
  const badgeEl = document.getElementById('sentinelStatusBadge');
  if (badgeEl) {
    if (s.needs_alert) {
      badgeEl.className = 'badge-warn';
      badgeEl.style.cssText = 'background:#fef2f2; color:#dc2626; border:1px solid #fecaca; font-weight:800; padding:4px 10px; border-radius:20px; font-size:11px;';
      badgeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${s.underperforming_count} Sales Perlu Review`;
    } else {
      badgeEl.style.cssText = 'background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-weight:800; padding:4px 10px; border-radius:20px; font-size:11px;';
      badgeEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Seluruh Tim On-Track`;
    }
  }

  const periodLabel = document.getElementById('sentinelPeriodLabel');
  if (periodLabel) {
    periodLabel.textContent = `${m.range_label} (Target Min. ${m.min_required_spk_do} SPK/DO)`;
  }

  const listContainer = document.getElementById('sentinelListContainer');
  if (!listContainer) return;

  if (under.length === 0) {
    listContainer.innerHTML = `
      <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:14px; padding:18px; text-align:center; color:#166534;">
        <div style="font-size:32px; margin-bottom:6px;">🎉</div>
        <h4 style="font-weight:800; font-size:15px; margin:0 0 4px;">Luar Biasa! Tidak Ada Defisit Target</h4>
        <p style="font-size:12px; margin:0; color:#15803d;">Seluruh ${s.total_sales} wiraniaga telah mencapai atau melampaui batas minimal <strong>${m.min_required_spk_do} SPK / DO</strong> untuk periode ini. Laporan WhatsApp tidak perlu dikirim karena performa aman.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto; padding-right:6px;">
      ${under.map((u, i) => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="background:#fee2e2; color:#b91c1c; font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px;">Defisit -${u.deficit} Unit</span>
              <strong style="font-size:13px; color:#0f172a;">${i + 1}. ${escapeHtml(u.nama_sales)}</strong>
              <span style="font-size:11px; color:#64748b;">(${escapeHtml(u.nama_spv)})</span>
            </div>
            <div style="font-size:12px; color:#475569; margin:4px 0 2px;">
              Target: <strong>${u.target_spk} SPK / ${u.target_do} DO</strong> &middot; Aktual: <strong>${u.realisasi_spk} SPK / ${u.realisasi_do} DO</strong> <span style="color:#94a3b8;">(Min. Hari Ini: ${u.min_required} Unit)</span>
            </div>
            <div style="font-size:11px; color:#6b21a8; background:#f3e8ff; padding:4px 8px; border-radius:6px; margin-top:4px; display:inline-block;">
              <i class="fa-solid fa-robot"></i> <em>${escapeHtml(u.ai_advice)}</em>
            </div>
          </div>
          <button class="btn btn-sm" style="background:#25D366; color:white; font-size:11px; font-weight:700; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; white-space:nowrap;" onclick="sendSingleNudgeWA('${escapeHtml(u.nama_sales)}', '${escapeHtml(u.nama_spv)}', ${u.deficit}, ${u.min_required})">
            <i class="fa-brands fa-whatsapp"></i> Review SPV
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function sendKacabAiReportWA() {
  if (!aiSentinelData || !aiSentinelData.wa_share_url) {
    alert('Memuat data laporan AI...');
    return;
  }
  window.open(aiSentinelData.wa_share_url, '_blank');
}

function sendSingleNudgeWA(namaSales, namaSpv, defisit, minRequired) {
  const text = `🚨 *REVIEW SPV DARI KACAB: PERINGATAN TARGET 5-HARIAN* 🚨\n` +
    `Yth. ${namaSpv},\n\n` +
    `Mohon atensi dan review khusus untuk wiraniaga tim Anda:\n` +
    `👤 *Nama*: ${namaSales}\n` +
    `📊 *Status*: Belum mencapai target minimal ritme 5-harian (${minRequired} SPK/DO). Defisit: -${defisit} Unit.\n\n` +
    `Instruksi Kepala Cabang:\n` +
    `1. Segera lakukan review harian & pendampingan prospek (Co-Closing).\n` +
    `2. Evaluasi daftar database Hot Prospect & percepat jadwal test drive.\n\n` +
    `Terima kasih atas tindak lanjutnya! 💪`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

function changeSentinelDay(day) {
  loadAiSentinelKacab(parseInt(day));
}

function toggleSentinelSettings() {
  const panel = document.getElementById('sentinelSettingsPanel');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    loadSentinelSettingsIntoForm();
  }
}

async function loadSentinelSettingsIntoForm() {
  try {
    const res = await fetch('../api/api_cron_kacab_sentinel.php?action=get_settings');
    const json = await res.json();
    if (json && json.settings) {
      const waInput = document.getElementById('kacabWaNumberInput');
      const timeInput = document.getElementById('kacabScheduleTimeInput');
      const tokenInput = document.getElementById('kacabGatewayTokenInput');
      const badge = document.getElementById('schedulerActiveBadge');
      
      if (waInput) waInput.value = json.settings.kacab_wa || '';
      if (timeInput && json.settings.schedule_time) timeInput.value = json.settings.schedule_time;
      if (tokenInput) tokenInput.value = json.settings.gateway_token || '';
      if (badge && json.settings.schedule_time) {
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Scheduler Aktif: ${json.settings.schedule_time} WIB`;
      }
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
}

async function saveSentinelSettings() {
  const wa = document.getElementById('kacabWaNumberInput')?.value?.trim();
  const time = document.getElementById('kacabScheduleTimeInput')?.value?.trim() || '06:00';
  const token = document.getElementById('kacabGatewayTokenInput')?.value?.trim();

  if (!wa) {
    alert('Silakan masukkan nomor WhatsApp Kepala Cabang!');
    return;
  }

  try {
    const res = await fetch('../api/api_cron_kacab_sentinel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_settings',
        kacab_wa: wa,
        schedule_time: time,
        auto_send_enabled: 1,
        gateway_provider: 'fonnte',
        gateway_token: token
      })
    });
    const result = await res.json();
    if (result.status === 'success') {
      alert('✅ ' + result.message);
      const badge = document.getElementById('schedulerActiveBadge');
      if (badge) {
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Scheduler Aktif: ${time} WIB`;
      }
    } else {
      alert('Gagal menyimpan: ' + (result.message || 'Error'));
    }
  } catch (err) {
    console.error('Error saving settings:', err);
    alert('Terjadi kesalahan saat menyimpan pengaturan.');
  }
}

async function testCronExecutionNow() {
  const btn = event.target;
  const oldText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menjalankan...';
  btn.disabled = true;

  try {
    const res = await fetch('../api/api_cron_kacab_sentinel.php?action=send_now&force=1');
    const result = await res.json();
    if (result.status === 'success') {
      alert(`✅ Eksekusi Otomatis Berhasil!\nTarget WA: ${result.target_kacab_wa}\nWaktu: ${result.executed_at}\nStatus: ${result.dispatch_result}`);
      if (result.wa_share_url) {
        window.open(result.wa_share_url, '_blank');
      }
    } else if (result.status === 'skipped') {
      alert(`ℹ️ ${result.message}`);
    } else {
      alert('Gagal mengeksekusi cron: ' + (result.message || 'Error'));
    }
  } catch (err) {
    console.error('Cron test error:', err);
    alert('Koneksi ke endpoint cron gagal.');
  } finally {
    btn.innerHTML = oldText;
    btn.disabled = false;
  }
}

async function syncGoogleSheetNow() {
  const btn = document.getElementById('btnSyncGoogleSheet');
  const statusEl = document.getElementById('googleSheetSyncStatus');
  const oldHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menarik Data...';
    btn.disabled = true;
  }
  if (statusEl) {
    statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menghubungkan ke Google Spreadsheet...';
  }

  try {
    const res = await fetch('../api/api_sheets_sync.php?action=pull');
    const data = await res.json();
    if (data.status === 'success') {
      if (statusEl) {
        statusEl.innerHTML = `Tersinkron (${data.totals.total_actual_spk} SPK | ${data.totals.total_actual_do} DO) &middot; ${data.synced_count} Wiraniaga`;
      }
      
      // Invalidate all session caches
      sessionStorage.removeItem('kacab_hierarchy_cache');
      sessionStorage.removeItem('kacab_hierarchy_cache_time');
      for (let i = 1; i <= 31; i++) {
        sessionStorage.removeItem(`kacab_sentinel_cache_${i}_${new Date().getMonth() + 1}`);
      }

      alert(`✅ ${data.message}\nTotal SPK: ${data.totals.total_actual_spk} | Total DO: ${data.totals.total_actual_do}\nJumlah Wiraniaga Aktif: ${data.synced_count} Orang`);
      
      // Force refresh Dashboard & Sentinel UI
      await loadDashboard();
      await loadAiSentinelKacab(null, true);
    } else {
      alert('Gagal sinkron: ' + (data.message || 'Error'));
    }
  } catch (err) {
    console.error('Error syncing Google Sheets:', err);
    alert('Terjadi kesalahan koneksi saat menarik data Google Sheets.');
  } finally {
    if (btn) {
      btn.innerHTML = oldHtml;
      btn.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  loadDashboard();
  loadFeed();
  loadAiSentinelKacab();
});

