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

document.addEventListener('DOMContentLoaded', () => {
    guardSPV();
    initSpvUser();
    loadSpvCoachingData();
});

function initSpvUser() {
    const spvNama = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Supervisor';
    const spvRole = localStorage.getItem('peranSales') || 'Supervisor';
    
    const elNama = document.getElementById('spvNama');
    const elRole = document.getElementById('spvRole');
    const elAvatar = document.getElementById('spvAvatar');

    if (elNama) elNama.textContent = spvNama;
    if (elRole) elRole.textContent = spvRole;
    if (elAvatar) {
        const initials = spvNama.split(' ').slice(0, 2).map(w => w[0]).join('');
        elAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || spvNama)}&background=f4f7f6&color=c8102e&bold=true`;
    }
}

function loadSpvCoachingData() {
    const container = document.getElementById('spvCoachingListContainer');
    if (!container) return;

    const selectEl = document.getElementById('filterSpvSelect');
    let selectedSpv = selectEl ? selectEl.value : 'auto';

    if (selectedSpv === 'auto') {
        selectedSpv = localStorage.getItem('spvSales') || localStorage.getItem('namaSales') || '';
    }

    container.innerHTML = '<p style="text-align:center; font-size:12px; color:#64748b; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data analisis tim wiraniaga...</p>';

    fetch(`../api/api_spv_coaching.php?spv=${encodeURIComponent(selectedSpv)}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success' && res.sales_matrix && res.sales_matrix.length > 0) {
                container.innerHTML = res.sales_matrix.map(sales => {
                    return `
                        <div class="sales-coaching-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                <div>
                                    <div style="font-size:15px; font-weight:800; color:#0f172a;">${sales.nama_lengkap}</div>
                                    <div style="display:flex; gap:6px; align-items:center; margin-top:4px;">
                                        <span class="metric-badge">Tingkatan: ${sales.tingkatan || 'Executive'}</span>
                                        <span class="metric-badge" style="background:#eff6ff; color:#1d4ed8;"><i class="fa-solid fa-user-tie"></i> SPV: ${sales.nama_spv || '-'}</span>
                                    </div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:11px; color:#64748b; font-weight:700;">Target DO / SPK</div>
                                    <div style="font-size:13px; font-weight:900; color:#2563eb;">${sales.do_count} / ${sales.target_do} DO (${sales.spk_count} SPK)</div>
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; background:#f8fafc; padding:10px; border-radius:10px; border:1px solid #e2e8f0; text-align:center; margin-bottom:10px;">
                                <div>
                                    <div style="font-size:10px; font-weight:700; color:#64748b;">PROSPEK</div>
                                    <div style="font-size:14px; font-weight:800; color:#0f172a;">${sales.prospect_count}</div>
                                </div>
                                <div>
                                    <div style="font-size:10px; font-weight:700; color:#64748b;">SPK CONV.</div>
                                    <div style="font-size:14px; font-weight:800; color:#059669;">${sales.conversion_spk_pct}%</div>
                                </div>
                                <div>
                                    <div style="font-size:10px; font-weight:700; color:#64748b;">DO CONV.</div>
                                    <div style="font-size:14px; font-weight:800; color:#d97706;">${sales.conversion_do_pct}%</div>
                                </div>
                            </div>

                            <div class="ai-coaching-box">
                                <strong>💡 Panduan AI Coaching SPV:</strong><br>
                                ${sales.ai_coaching_advice}
                            </div>

                            <div style="margin-top:12px; text-align:right;">
                                <button type="button" class="btn-main" onclick="sendCoachingWA('${escapeQuotes(sales.nama_lengkap)}', '${escapeQuotes(sales.ai_coaching_advice)}')" style="padding:8px 14px; background:#2563eb; color:white; border:none; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">
                                    <i class="fa-brands fa-whatsapp"></i> Kirim Catatan Coaching ke WA Sales
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                container.innerHTML = `<p style="text-align:center; font-size:12px; color:#64748b; padding:24px; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;"><i class="fa-solid fa-users-slash" style="font-size:24px; color:#94a3b8; display:block; margin-bottom:8px;"></i> Tidak ada wiraniaga di bawah naungan tim <strong>${selectedSpv || 'SPV ini'}</strong>.</p>`;
            }
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p style="text-align:center; font-size:12px; color:#ef4444; padding:20px;">Gagal memuat data analisis tim wiraniaga.</p>';
        });
}

function onSpvFilterChange() {
    loadSpvCoachingData();
}

function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function sendCoachingWA(namaSales, saranCoaching) {
    const spvNama = localStorage.getItem('namaSales') || 'Supervisor';

    const text = `📋 *PANDUAN BRIEFING & COACHING INDIVIDUAL SALES* 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo *${namaSales}*,

Berikut adalah poin evaluasi & rekomendasi strategi untuk meningkatkan performa penjualan minggu ini:

💡 *CATATAN REKOMENDASI SPV:*
"${saranCoaching}"

Mari manfaatkan fitur *AI Sales Copilot*, *Kalkulator Trade-In*, & *Eco-Savings Calculator* di Sales App untuk membantu mempermudah transaksi konsumen di lapangan!

Semangat mencapai target bulanan! 🔥

Salam hangat,
👔 *${spvNama}* (Supervisor)`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}
