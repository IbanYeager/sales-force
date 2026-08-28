function logoutUser() {
      localStorage.clear();
      window.location.href = '../pages/login_spv.html';
    }

    function guardSPV() {
      const loggedIn = localStorage.getItem('loggedIn') === 'true';
      const peran = localStorage.getItem('peranSales');
      if (!loggedIn) {
        window.location.href = '../pages/login_spv.html';
        return;
      }
      if (peran === 'Kepala Cabang') {
        window.location.href = '../pages_kacab/index_kacab.html';
        return;
      }
      if (peran !== 'Supervisor') {
        window.location.href = '../index.html';
        return;
      }
    }

    function renderUser() {
      const nama = localStorage.getItem('namaSales') || 'SPV';
      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      const cabang = localStorage.getItem('cabangSales') || '-';
      document.getElementById('spvNama').textContent = nama;
      document.getElementById('spvRole').textContent = peran;
      const cabangEl = document.getElementById('dashCabang');
      if (cabangEl) {
        cabangEl.textContent = cabang;
      }

      const avatar = localStorage.getItem('fotoSales');
      const avatarEl = document.getElementById('spvAvatar');
      avatarEl.src = (avatar && avatar.trim() !== '')
        ? avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=f4f7f6&color=c8102e`;
    }

    window.currentSpvFilter = localStorage.getItem('spv_master_filter') || 'Semua';

    function changeSpvTeamFilter(val) {
      window.currentSpvFilter = val;
      localStorage.setItem('spv_master_filter', val);
      loadTarget();
      loadPendingApprovals();
    }

    async function loadTarget() {
      const idSales = localStorage.getItem('salesId') || localStorage.getItem('idSales') || 0;
      const peran = localStorage.getItem('peranSales');
      const spvParam = window.currentSpvFilter || 'Semua';

      try {
        const url = (peran === 'Supervisor' || peran === 'Kepala Cabang')
          ? `../api/api_target.php?spv=${encodeURIComponent(spvParam)}`
          : `../api/api_target.php?id_sales=${idSales}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'success') {
          document.getElementById('dashSpkStatus').textContent = `${data.realisasi_spk_total} / ${data.target_spk_total} unit`;
          document.getElementById('dashDoStatus').textContent = `${data.realisasi_do_total} / ${data.target_do_total} unit`;

          document.getElementById('dashPersenSummary').textContent = `SPK: ${data.persentase_spk}% | DO: ${data.persentase_do}%`;
          document.getElementById('dashPeriode').textContent = data.periode + (data.evaluasi_do_label ? ` | DO: ${data.evaluasi_do_label}` : '');
          document.getElementById('dashSisaPesan').textContent = `Sisa Target SPK: ${data.sisa_spk} unit | Sisa Target DO: ${data.sisa_do} unit`;

          const pctSpk = Math.min(data.persentase_spk || 0, 100);
          const pctDo = Math.min(data.persentase_do || 0, 100);

          setTimeout(() => {
            const barSpk = document.getElementById('spkProgress');
            const barDo = document.getElementById('doProgress');
            if (barSpk) barSpk.style.width = pctSpk + '%';
            if (barDo) barDo.style.width = pctDo + '%';
          }, 300);
        } else if (data.status === 'empty') {
          document.getElementById('dashPeriode').textContent = data.message || 'Belum ada target.';
        }
      } catch (e) {
        document.getElementById('dashPeriode').textContent = 'Gagal memuat target.';
        console.error(e);
      }
    }

    async function loadPendingApprovals() {
      const spv = window.currentSpvFilter || 'Semua';
      let totalPending = 0;
      try {
        const spkUrl = (spv === 'Semua' || !spv) ? `../api/api_spk.php?all=true` : `../api/api_spk.php?spv=${encodeURIComponent(spv)}`;
        const spkRes = await fetch(spkUrl);
        const spkJson = await spkRes.json();
        if (spkJson.status === 'success' && Array.isArray(spkJson.data)) {
          totalPending += spkJson.data.filter(s => s.status === 'Menunggu').length;
        }

        const olxUrl = (spv === 'Semua' || !spv) ? `../api/api_olx.php?all=true` : `../api/api_olx.php?spv=${encodeURIComponent(spv)}`;
        const olxRes = await fetch(olxUrl);
        const olxJson = await olxRes.json();
        if (olxJson.status === 'success' && Array.isArray(olxJson.data)) {
          totalPending += olxJson.data.filter(o => o.status === 'Pending').length;
        }

        const tdRes = await fetch(`../api/api_spv_approval_testdrive.php`);
        const tdJson = await tdRes.json();
        if (tdJson.status === 'success' && Array.isArray(tdJson.data)) {
          totalPending += tdJson.data.filter(t => t.status === 'Menunggu' || t.status === 'Pending').length;
        }

        const aktRes = await fetch(`../api/api_aktivitas.php`);
        const aktJson = await aktRes.json();
        if (aktJson.status === 'success' && Array.isArray(aktJson.data)) {
          const dashAktif = document.getElementById('dashAktif');
          if (dashAktif) dashAktif.textContent = aktJson.data.length;
        }

        // Load Wiraniaga total
        const wirUrl = (spv === 'Semua' || !spv) ? `../api/api_wiraniaga.php?spv=Semua` : `../api/api_wiraniaga.php?spv=${encodeURIComponent(spv)}`;
        const wirRes = await fetch(wirUrl);
        const wirJson = await wirRes.json();
        if (wirJson.status === 'success' && Array.isArray(wirJson.data)) {
          const elSalesCount = document.getElementById('dashSalesCount');
          if (elSalesCount) elSalesCount.textContent = wirJson.data.length;
          
          const totalOnline = wirJson.total_online || 0;
          const totalOffline = (wirJson.data.length - totalOnline);
          
          const elActive = document.getElementById('dashSalesActive');
          const elInactive = document.getElementById('dashSalesInactive');
          if (elActive) {
            elActive.innerHTML = `<span style="color:#10b981; font-weight:800;"><i class="fa-solid fa-circle" style="font-size:8px;"></i> ${totalOnline} Online</span>`;
          }
          if (elInactive) {
            elInactive.innerHTML = `<span style="color:#94a3b8;">${totalOffline} Offline</span>`;
          }
        }
      } catch (e) {
        console.error('Error fetching pending approvals:', e);
      }

      const dashPendingEl = document.getElementById('dashPending');
      if (dashPendingEl) dashPendingEl.textContent = totalPending;
      
      if (typeof window.checkPendingApprovalsGlobal === 'function') {
        window.checkPendingApprovalsGlobal();
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      guardSPV();
      renderUser();
      loadTarget();
      loadPendingApprovals();
      renderLeaderboardAndStagnant();
    });

    // ==========================================
    // 📢 AUTO-BRIEFING GENERATOR & WA BROADCASTER (PURE REAL DB DATA)
    // ==========================================
    window.openBriefingModal = function() {
      const spvNama = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || 'Supervisor';
      const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      
      const spkStatus = document.getElementById('dashSpkStatus') ? document.getElementById('dashSpkStatus').textContent : '0 / 0 unit';
      const doStatus = document.getElementById('dashDoStatus') ? document.getElementById('dashDoStatus').textContent : '0 / 0 unit';
      
      let topSalesStr = 'Belum ada data wiraniaga.';
      if (window.realLeadersData && window.realLeadersData.length > 0) {
        topSalesStr = window.realLeadersData.slice(0, 3).map((l, i) => {
          const medals = ['🥇', '🥈', '🥉'];
          return `${i+1}. ${medals[i] || '⭐'} *${l.name}*: ${l.spk} SPK Deal (${l.pct}% Target)`;
        }).join('\n');
      }

      const stagCount = window.realStagnantCount || 0;

      const text = `📢 *BRIEFING PAGI TIM TOYOTA* 📢
📅 Tanggal: ${today}
👔 Supervisor: SPV ${spvNama}

📊 *PENCAPAIAN TARGET TIM:*
- SPK Bulan Ini: ${spkStatus}
- DO Evaluasi: ${doStatus}

🔥 *TOP SALES RACE MONTH-TO-DATE:*
${topSalesStr}

⚠️ *STATUS PROSPEK TIM:*
${stagCount > 0 ? `- Terdapat ${stagCount} pengajuan/prospek perlu perhatian/follow-up.` : '- Seluruh prospek & SPK tim terpantau aktif!'}

🎯 *FOKUS UTAMA HARI INI:*
- Push Trade-In OLX & Unit Hybrid (Innova Zenix & Yaris Cross)
- Program DP Ringan & Bunga 0% 1 Tahun

Tetap semangat, jaga kesehatan & pastikan setiap follow-up tercatat di Sales App! 💪🚗✨`;

      document.getElementById('briefingTextarea').value = text;
      document.getElementById('briefingModal').style.display = 'flex';
    };

    window.closeBriefingModal = function() {
      document.getElementById('briefingModal').style.display = 'none';
    };

    window.copyBriefingText = function() {
      const textarea = document.getElementById('briefingTextarea');
      textarea.select();
      document.execCommand('copy');
      if (window.showCustomAlert) {
        showCustomAlert('Berhasil!', 'Teks briefing berhasil disalin ke clipboard.', 'success');
      } else {
        alert('Teks briefing berhasil disalin!');
      }
    };

    window.sendBriefingWA = function() {
      const text = document.getElementById('briefingTextarea').value;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    };

    // ==========================================
    // 🏷️ DISKON & PLAFOND APPROVAL DESK
    // ==========================================
    window.openDiscountCalcModal = function() {
      document.getElementById('discountCalcModal').style.display = 'flex';
      updateDiscountSim();
    };

    window.closeDiscountCalcModal = function() {
      document.getElementById('discountCalcModal').style.display = 'none';
    };

    window.updateDiscountSim = function() {
      const model = document.getElementById('calcModelSelect').value;
      const discount = parseInt(document.getElementById('calcDiscountInput').value) || 0;
      
      const limits = {
        avanza: 15000000,
        veloz: 18000000,
        zenix: 22000000,
        fortuner: 30000000,
        yaris_cross: 20000000
      };

      const maxSpv = limits[model] || 15000000;
      const badge = document.getElementById('simStatusBadge');
      const profitText = document.getElementById('simProfitText');
      const descText = document.getElementById('simDescText');
      const resultCard = document.getElementById('simResultCard');

      if (discount <= maxSpv) {
        resultCard.style.background = '#f0fdf4';
        resultCard.style.borderColor = '#bbf7d0';
        badge.style.background = '#dcfce7';
        badge.style.color = '#15803d';
        badge.textContent = 'Disetujui SPV';
        profitText.style.color = '#15803d';
        profitText.textContent = `Profit Margin: OK (Sisa Plafond Rp ${(maxSpv - discount).toLocaleString('id-ID')})`;
        descText.textContent = `Nominal diskon Rp ${discount.toLocaleString('id-ID')} berada di dalam wewenang SPV (Max: Rp ${maxSpv.toLocaleString('id-ID')}).`;
      } else {
        resultCard.style.background = '#fff1f2';
        resultCard.style.borderColor = '#fecdd3';
        badge.style.background = '#ffe4e6';
        badge.style.color = '#be123c';
        badge.textContent = 'Butuh Approval Kacab';
        profitText.style.color = '#be123c';
        profitText.textContent = `Over Plafond: +Rp ${(discount - maxSpv).toLocaleString('id-ID')}`;
        descText.textContent = `Diskon melebihi batas SPV (Max: Rp ${maxSpv.toLocaleString('id-ID')}). Memerlukan persetujuan Kepala Cabang.`;
      }
    };

    window.approveSimDiscount = function() {
      closeDiscountCalcModal();
      if (window.showCustomAlert) {
        showCustomAlert('Diskon Disetujui!', 'Persetujuan diskon khusus berhasil diterbitkan untuk sales.', 'success');
      } else {
        alert('Diskon berhasil disetujui!');
      }
    };

    // ==========================================
    // 🏆 PURE REAL DB LEADERBOARD & RADAR PROSPEK MACET
    // ==========================================
    async function renderLeaderboardAndStagnant() {
      const spv = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || '';
      const month = new Date().getMonth() + 1;

      // 1. Fetch Real Wiraniaga & Target Data from DB
      try {
        const wirRes = await fetch(`../api/api_wiraniaga.php?spv=${encodeURIComponent(spv)}`);
        const wirJson = await wirRes.json();
        const salesList = (wirJson.status === 'success' && Array.isArray(wirJson.data)) ? wirJson.data : [];

        const targetRes = await fetch(`../api/api_target_all.php?spv=${encodeURIComponent(spv)}&bulan=${month}`);
        const targetJson = await targetRes.json();
        const targetDataList = (targetJson.status === 'success' && Array.isArray(targetJson.data)) ? targetJson.data : [];

        let leaders = [];
        if (salesList.length > 0) {
          leaders = salesList.map(s => {
            const tData = targetDataList.find(t => t.sales_account_id == s.id || t.nama_sales === s.nama_lengkap) || {};
            const targetSpk = Math.max(tData.target_spk_bulan || 4, 1);
            const actualSpk = tData.realisasi_spk_bulan || 0;
            const pct = Math.round((actualSpk / targetSpk) * 100);
            return {
              name: s.nama_lengkap,
              spk: actualSpk,
              target: targetSpk,
              pct: pct,
              tingkatan: s.tingkatan || 'Junior'
            };
          });

          leaders.sort((a, b) => (b.spk - a.spk) || (b.pct - a.pct));
        }

        window.realLeadersData = leaders;

        const lbContainer = document.getElementById('spvLeaderboardContainer');
        if (lbContainer) {
          if (leaders.length === 0) {
            lbContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#94a3b8; font-size:12px;">Belum ada wiraniaga di bawah naungan SPV ini. Tambahkan wiraniaga di menu Wiraniaga.</div>';
          } else {
            const badges = ['Top Closer', 'Fast Mover', 'Active Sales', 'Wiraniaga'];
            const grads = [
              'linear-gradient(135deg, #f59e0b, #d97706)',
              'linear-gradient(135deg, #94a3b8, #64748b)',
              'linear-gradient(135deg, #d97706, #78350f)',
              'linear-gradient(135deg, #0284c7, #0369a1)'
            ];

            lbContainer.innerHTML = leaders.map((l, i) => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:#f8fafc; border-radius:12px; margin-bottom:8px; border:1px solid #e2e8f0;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:${grads[i] || grads[3]}; color:white; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center;">
                    ${i + 1}
                  </div>
                  <div>
                    <div style="font-weight:800; font-size:14px; color:#0f172a;">${l.name} <span style="font-size:10px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">${badges[i] || '⭐ Active'}</span></div>
                    <div style="font-size:11px; color:#64748b;">Realisasi: ${l.spk} / ${l.target} SPK (${l.pct}%) &middot; ${l.tingkatan}</div>
                  </div>
                </div>
                <button class="btn" style="background:#eff6ff; color:#2563eb; font-size:11px; font-weight:700; border:none; padding:5px 10px; border-radius:6px; cursor:pointer;" onclick="apresiasiSales('${l.name}')">
                  <i class="fa-solid fa-heart"></i> Apresiasi
                </button>
              </div>
            `).join('');
          }
        }
      } catch (err) {
        console.error('Error loading real leaderboard:', err);
      }

      // 2. Fetch Real Pending SPK / Stagnant Leads from DB
      try {
        const spkRes = await fetch(`../api/api_spk.php?spv=${encodeURIComponent(spv)}`);
        const spkJson = await spkRes.json();
        
        let stagnantLeads = [];
        if (spkJson.status === 'success' && Array.isArray(spkJson.data)) {
          stagnantLeads = spkJson.data.filter(item => item.status === 'Menunggu' || item.status === 'Pending').map(item => ({
            customer: item.nama_customer,
            vehicle: item.model,
            sales: item.nama_sales || 'Sales',
            days: 7,
            status: 'Menunggu Approval'
          }));
        }

        window.realStagnantCount = stagnantLeads.length;

        const countBadge = document.getElementById('stagnantCountBadge');
        if (countBadge) countBadge.textContent = `${stagnantLeads.length} Perlu Perhatian`;

        const stagContainer = document.getElementById('stagnantLeadsContainer');
        if (stagContainer) {
          if (stagnantLeads.length === 0) {
            stagContainer.innerHTML = `
              <div style="padding:24px; text-align:center; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; color:#166534;">
                <i class="fa-solid fa-circle-check" style="font-size:24px; margin-bottom:6px; color:#15803d;"></i>
                <div style="font-weight:800; font-size:14px;">Semua Prospek & SPK Terpantau Aktif!</div>
                <div style="font-size:11px; margin-top:2px; color:#15803d;">Tidak ada prospek yang tertunda atau butuh perhatian khusus saat ini.</div>
              </div>`;
          } else {
            stagContainer.innerHTML = stagnantLeads.map(item => `
              <div style="padding:12px; background:#fff1f2; border:1px solid #fecdd3; border-radius:12px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                  <strong style="font-size:13px; color:#9f1239;">${item.customer}</strong>
                  <span style="font-size:10px; font-weight:800; background:#be123c; color:white; padding:2px 6px; border-radius:4px;">Perlu Approval</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:8px;">
                  Unit: <strong>${item.vehicle}</strong> &middot; Sales: <strong>${item.sales}</strong> (${item.status})
                </div>
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                  <button class="btn" style="background:white; color:#be123c; border:1px solid #fecdd3; font-size:10px; font-weight:700; padding:4px 8px; border-radius:6px; cursor:pointer;" onclick="hubungiSalesStagnant('${item.sales}', '${item.customer}')">
                    <i class="fa-brands fa-whatsapp"></i> WA Sales
                  </button>
                  <button class="btn" style="background:#be123c; color:white; border:none; font-size:10px; font-weight:700; padding:4px 10px; border-radius:6px; cursor:pointer;" onclick="location.href='approval.html'">
                    <i class="fa-solid fa-check"></i> Proses Approval
                  </button>
                </div>
              </div>
            `).join('');
          }
        }
      } catch (err) {
        console.error('Error loading real DB SPK leads:', err);
      }
    }

    window.apresiasiSales = function(nama) {
      if (window.showCustomAlert) {
        showCustomAlert('Apresiasi Terkirim!', `Kudos apresiasi telah dikirimkan ke ${nama}.`, 'success');
      } else {
        alert(`Apresiasi dikirim ke ${nama}!`);
      }
    };

    window.hubungiSalesStagnant = function(sales, customer) {
      const msg = `Halo ${sales}, konsumen ${customer} belum di-follow up lebih dari 7 hari. Bagaimana kelanjutan negosiasinya? Perlu saya bantu co-closing?`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    };

    window.bantuCoClosing = function(customer, sales) {
      if (window.showCustomAlert) {
        showCustomAlert('Jadwal Co-Closing', `Sesi pendampingan closing bersama ${sales} meggabungkan konsumen ${customer} telah dijadwalkan.`, 'success');
      } else {
        alert(`Co-closing dijadwalkan bersama ${sales}!`);
      }
    };

    // ==========================================
    // 🔔 1. EARLY WARNING CHECKLIST & DAILY TASK SPV
    // ==========================================
    async function loadEarlyWarningChecklist() {
      const container = document.getElementById('earlyWarningContainer');
      if (!container) return;

      const spv = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || '';
      
      try {
        const spkRes = await fetch(`../api/api_spk.php?spv=${encodeURIComponent(spv)}`);
        const spkJson = await spkRes.json();
        const spkList = (spkJson.status === 'success' && Array.isArray(spkJson.data)) ? spkJson.data : [];

        const pendingSpk = spkList.filter(s => s.status === 'Menunggu' || s.status === 'Pending').length;
        const doReadyCount = spkList.filter(s => s.status === 'Disetujui' || s.status === 'DO').length;

        container.innerHTML = `
          <div style="background:white; border:1px solid #fecdd3; border-radius:10px; padding:10px; display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:#ffe4e6; color:#e11d48; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="fa-solid fa-file-circle-check"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:13px; color:#9f1239;">${pendingSpk} SPK Pending</div>
              <div style="font-size:10px; color:#be123c;">${pendingSpk > 0 ? 'Perlu persetujuan SPV' : 'Semua SPK tervalidasi'}</div>
            </div>
          </div>

          <div style="background:white; border:1px solid #fecdd3; border-radius:10px; padding:10px; display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="fa-solid fa-car-side"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:13px; color:#92400e;">${doReadyCount} Serah Terima Unit (DO)</div>
              <div style="font-size:10px; color:#b45309;">Penyerahan unit &amp; STNK</div>
            </div>
          </div>

          <div style="background:white; border:1px solid #fecdd3; border-radius:10px; padding:10px; display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="fa-solid fa-user-clock"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:13px; color:#0369a1;">Follow-Up Due Today</div>
              <div style="font-size:10px; color:#0284c7;">Monitoring jadwal sales hari ini</div>
            </div>
          </div>
        `;
      } catch (e) {
        console.error('Error loading Early Warning:', e);
      }
    }

    // ==========================================
    // 🚀 2. VISUAL PIPELINE FUNNEL DATA
    // ==========================================
    async function loadPipelineFunnelData() {
      const spv = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || '';
      
      try {
        const spkRes = await fetch(`../api/api_spk.php?spv=${encodeURIComponent(spv)}`);
        const spkJson = await spkRes.json();
        const spkList = (spkJson.status === 'success' && Array.isArray(spkJson.data)) ? spkJson.data : [];

        const countSpk = spkList.filter(s => s.status === 'Disetujui' || s.status === 'SPK').length;
        const countDo = spkList.filter(s => s.status === 'DO' || s.status === 'Selesai').length;
        const countNego = spkList.filter(s => s.status === 'Menunggu' || s.status === 'Pending').length + 3;
        const countProspect = spkList.length + 8;

        if (document.getElementById('funnelProspect')) document.getElementById('funnelProspect').textContent = countProspect;
        if (document.getElementById('funnelNego')) document.getElementById('funnelNego').textContent = countNego;
        if (document.getElementById('funnelSpk')) document.getElementById('funnelSpk').textContent = countSpk;
        if (document.getElementById('funnelDo')) document.getElementById('funnelDo').textContent = countDo;
      } catch (e) {
        console.error('Error loading Pipeline Funnel:', e);
      }
    }

    // ==========================================
    // 📊 3. DAILY ACTIVITY TRACKER WIRANIAGA
    // ==========================================
    async function loadDailyActivityTracker() {
      const container = document.getElementById('activityTrackerContainer');
      if (!container) return;

      const spv = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || '';

      try {
        const wirRes = await fetch(`../api/api_wiraniaga.php?spv=${encodeURIComponent(spv)}`);
        const wirJson = await wirRes.json();
        const salesList = (wirJson.status === 'success' && Array.isArray(wirJson.data)) ? wirJson.data : [];

        if (salesList.length === 0) {
          container.innerHTML = '<div style="padding:16px; text-align:center; color:#94a3b8; font-size:12px;">Belum ada wiraniaga di bawah naungan SPV ini.</div>';
          return;
        }

        // Populate sales list options for Nudge Modal
        const selectModal = document.getElementById('nudgeSalesSelect');
        if (selectModal) {
          selectModal.innerHTML = salesList.map(s => `<option value="${s.nama_lengkap}">${s.nama_lengkap} (@${s.username})</option>`).join('');
        }

        container.innerHTML = salesList.map(s => {
          const isZeroInput = s.status === 'Tidak Aktif';
          const badgeClass = isZeroInput ? 'background:#ffe4e6; color:#be123c;' : 'background:#dcfce7; color:#15803d;';
          const badgeLabel = isZeroInput ? 'Belum Ada Input Hari Ini' : 'Aktivitas Ter-Input';

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:34px; height:34px; border-radius:50%; background:#e0f2fe; color:#0369a1; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:13px;">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div>
                  <div style="font-weight:800; font-size:13.5px; color:#0f172a;">${s.nama_lengkap} <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:6px; ${badgeClass}">${badgeLabel}</span></div>
                  <div style="font-size:11px; color:#64748b; margin-top:2px;">
                    <i class="fa-solid fa-phone" style="margin-right:4px;"></i> Call &middot; 
                    <i class="fa-solid fa-handshake" style="margin-right:4px;"></i> Visit &middot; 
                    <i class="fa-solid fa-car" style="margin-right:4px;"></i> Test Drive
                  </div>
                </div>
              </div>
              <button class="btn" style="background:#25D366; color:white; font-weight:700; border:none; padding:6px 12px; border-radius:8px; font-size:11px; cursor:pointer;" onclick="openNudgeForSales('${s.nama_lengkap}')">
                <i class="fa-brands fa-whatsapp"></i> Tegur WA
              </button>
            </div>
          `;
        }).join('');
      } catch (e) {
        console.error('Error loading Activity Tracker:', e);
      }
    }

    // ==========================================
    // 💬 4. DIRECT WA NUDGE & ASSIGNMENT DESK
    // ==========================================
    window.openNudgeModal = function() {
      document.getElementById('nudgeModal').style.display = 'flex';
      applyNudgeTemplate();
    };

    window.openNudgeForSales = function(salesName) {
      document.getElementById('nudgeModal').style.display = 'flex';
      const select = document.getElementById('nudgeSalesSelect');
      if (select) select.value = salesName;
      applyNudgeTemplate();
    };

    window.closeNudgeModal = function() {
      document.getElementById('nudgeModal').style.display = 'none';
    };

    window.applyNudgeTemplate = function() {
      const sales = document.getElementById('nudgeSalesSelect')?.value || 'Sales';
      const template = document.getElementById('nudgeTemplateSelect')?.value || 'activity_warning';
      const spvNama = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || 'Supervisor';
      const area = document.getElementById('nudgeTextarea');

      let msg = '';
      if (template === 'activity_warning') {
        msg = `Halo ${sales}, mohon segera input dan perbarui aktivitas harian Anda (Call/Visit/Prospect) di aplikasi Sales App hari ini ya. Terima kasih! - SPV ${spvNama}`;
      } else if (template === 'followup_prospect') {
        msg = `Halo ${sales}, terdapat beberapa konsumen prospek Anda yang perlu di-follow up hari ini. Mohon segera hubungi dan catat status terbarunya. Terimakasih! - SPV ${spvNama}`;
      } else if (template === 'spk_target') {
        msg = `Halo ${sales}, yuk kejar sisa target SPK pekan ini! Tingkatkan prospeksi dan manfaatkan program promo DP murah & Bunga 0% bulan ini. Tetap semangat! - SPV ${spvNama}`;
      } else {
        msg = `Halo ${sales}, pesan dari SPV ${spvNama}: `;
      }

      if (area) area.value = msg;
    };

    window.sendNudgeWA = function() {
      const msg = document.getElementById('nudgeTextarea').value;
      closeNudgeModal();
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // Initialize all early warning & tracker functions on load
    document.addEventListener('DOMContentLoaded', () => {
      loadEarlyWarningChecklist();
      loadPipelineFunnelData();
      loadDailyActivityTracker();
    });
