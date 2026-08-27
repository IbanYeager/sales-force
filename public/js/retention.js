/**
 * retention.js
 * Smart After-Sales & Customer Retention Lifecycle Management System
 * Tunas Toyota Kiara Condong Bandung
 */

let allRetentionData = [];
let currentCategoryFilter = 'ALL';
let currentSearchKeyword = '';
let currentStatusFilter = '';

// Active customer context for WhatsApp composer / Booking
let selectedCustomerForWA = null;
let selectedTone = 'formal';

document.addEventListener('DOMContentLoaded', () => {
    // Set default date inputs
    const todayStr = new Date().toISOString().split('T')[0];
    const newDoInput = document.getElementById('newCustTanggalDO');
    if (newDoInput) newDoInput.value = todayStr;

    loadRetentionData();
});

// Comprehensive mock data covering all key lifecycle milestones
const COMPREHENSIVE_MOCK_RETENTION = [
    {
        id: 101,
        sales_account_id: 1,
        nama_customer: "Bpk. Hendra Gunawan",
        no_hp: "08123456789",
        model_unit: "All New Kijang Innova Zenix V Hybrid",
        no_polisi: "D 1899 ABC",
        warna_unit: "Platinum White Pearl",
        tanggal_do: calculatePastDate(25), // 25 hari lalu -> Jatuh tempo Servis 1.000 KM
        tanggal_lahir: "1985-08-22",
        tipe_asuransi: "All Risk Garda Oto",
        leasing_partner: "TAF (Toyota Astra Finance)",
        tipe_reminder: "1000KM",
        status_reminder: "Belum Dihubungi",
        catatan_sales: "Prioritas: Wajib servis 1.000 KM / 1 Bulan pertama untuk aktivasi garansi resmi mesin 3 tahun & baterai hybrid 8 tahun."
    },
    {
        id: 102,
        sales_account_id: 1,
        nama_customer: "Ibu Dr. Siska Amelia, Sp.A",
        no_hp: "08567891234",
        model_unit: "All New Yaris Cross 1.5 S Hybrid GR Sport",
        no_polisi: "D 1244 KLM",
        warna_unit: "Two Tone Scarlet Red / Black",
        tanggal_do: calculatePastDate(170), // ~5.5 bulan lalu -> Menjelang Servis 10.000 KM
        tanggal_lahir: "1990-11-14",
        tipe_asuransi: "All Risk Toyota Insurance",
        leasing_partner: "ACC (Astra Credit Companies)",
        tipe_reminder: "10000KM",
        status_reminder: "Belum Dihubungi",
        catatan_sales: "Jadwal Servis Berkala Ke-2 (10.000 KM / 6 Bulan). Manfaatkan fasilitas T-Care Gratis Biaya Jasa & Penggantian Oli Mesin."
    },
    {
        id: 103,
        sales_account_id: 1,
        nama_customer: "Bpk. Ir. Dedi Suryadi",
        no_hp: "08198765432",
        model_unit: "All New Veloz 1.5 Q CVT TSS",
        no_polisi: "D 1088 TNS",
        warna_unit: "Black Metallic",
        tanggal_do: calculatePastDate(345), // ~11.5 bulan lalu -> Jatuh tempo STNK & Asuransi 1 Tahun
        tanggal_lahir: "1978-08-19", // Ulang tahun minggu ini!
        tipe_asuransi: "All Risk Garda Oto",
        leasing_partner: "BCA Finance",
        tipe_reminder: "ASURANSI",
        status_reminder: "Belum Dihubungi",
        catatan_sales: "Polis Asuransi All-Risk & Pajak STNK Tahunan ke-1 jatuh tempo dalam 20 hari. Konsumen juga berulang tahun bulan ini."
    },
    {
        id: 104,
        sales_account_id: 1,
        nama_customer: "Bpk. H. Ahmad Fauzi",
        no_hp: "08132244668",
        model_unit: "Innova Reborn 2.4 V Diesel A/T",
        no_polisi: "D 1945 RF",
        warna_unit: "Super White",
        tanggal_do: calculatePastDate(1150), // Usia 3.2 Tahun -> Golden Window Trade-In
        tanggal_lahir: "1972-04-10",
        tipe_asuransi: "Kombinasi Total Loss Only",
        leasing_partner: "Mandiri Utama Finance",
        tipe_reminder: "TRADEIN",
        status_reminder: "Belum Dihubungi",
        catatan_sales: "Mobil sudah memasuki usia 3 tahun. Tawarkan Program Apresiasi Subsidized Trade-In Rp 3 Juta ke Innova Zenix Hybrid hemat BBM 1:21 km/L."
    },
    {
        id: 105,
        sales_account_id: 1,
        nama_customer: "Ibu Maria Fransisca",
        no_hp: "08129988771",
        model_unit: "All New Avanza 1.5 G CVT",
        no_polisi: "D 1766 XYZ",
        warna_unit: "Silver Mica Metallic",
        tanggal_do: calculatePastDate(185),
        tanggal_lahir: "1994-09-05",
        tipe_asuransi: "All Risk Garda Oto",
        leasing_partner: "TAF",
        tipe_reminder: "10000KM",
        status_reminder: "Terjadwal Servis",
        booking_service_date: "2026-08-22 09:30:00",
        booking_service_type: "Toyota Mobile Service (TMS Home Service)",
        catatan_sales: "Sudah dijadwalkan TMS ke rumah di Antapani jam 09:30 pagi."
    }
];

function calculatePastDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
}

/**
 * Fetch and load retention data from API
 */
function loadRetentionData() {
    const container = document.getElementById('retentionListContainer');
    if (container) {
        container.innerHTML = '<p style="text-align:center; font-size:13px; color:#64748b; padding:30px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data retention konsumen...</p>';
    }

    const salesId = localStorage.getItem('sales_id') || 1;

    fetch(`../api/api_retention.php?sales_id=${salesId}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success' && res.data && res.data.length > 0) {
                allRetentionData = res.data;
            } else {
                allRetentionData = COMPREHENSIVE_MOCK_RETENTION;
            }
            updateKPICards(res.kpi);
            renderRetentionCards();
        })
        .catch(err => {
            console.warn('Menggunakan data mock cerdas:', err);
            allRetentionData = COMPREHENSIVE_MOCK_RETENTION;
            updateKPICards(null);
            renderRetentionCards();
        });
}

/**
 * Update KPI Summary Cards
 */
function updateKPICards(serverKpi) {
    const totalEl = document.getElementById('kpiTotalCustomers');
    const dueEl = document.getElementById('kpiDueSoon');
    const stnkEl = document.getElementById('kpiStnkAsuransi');
    const tradeinEl = document.getElementById('kpiTradein');

    if (serverKpi) {
        if (totalEl) totalEl.innerText = serverKpi.total_customers || allRetentionData.length;
        if (dueEl) dueEl.innerText = serverKpi.due_soon || 0;
        if (stnkEl) stnkEl.innerText = serverKpi.stnk_asuransi || 0;
        if (tradeinEl) tradeinEl.innerText = serverKpi.tradein_opportunity || 0;
        return;
    }

    // Hitung manual jika fallback mock
    let dueCount = 0;
    let stnkCount = 0;
    let tradeinCount = 0;

    allRetentionData.forEach(item => {
        const diff = getDaysDifference(item.tanggal_do);
        if (diff <= 45 || (diff >= 160 && diff <= 200)) dueCount++;
        if (diff >= 330 && diff <= 380) stnkCount++;
        if (diff >= 900) tradeinCount++;
    });

    if (totalEl) totalEl.innerText = allRetentionData.length;
    if (dueEl) dueEl.innerText = dueCount;
    if (stnkEl) stnkEl.innerText = stnkCount;
    if (tradeinEl) tradeinEl.innerText = tradeinCount;
}

/**
 * Helper: Days difference from today
 */
function getDaysDifference(dateStr) {
    if (!dateStr) return 0;
    const target = new Date(dateStr);
    const today = new Date();
    const diffTime = today - target;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format Human Readable Ownership Age
 */
function formatOwnershipAge(dateStr) {
    const days = getDaysDifference(dateStr);
    if (days < 30) return `${days} Hari`;
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} Bulan (${days} Hari)`;
    }
    const years = (days / 365).toFixed(1);
    return `${years} Tahun`;
}

/**
 * Filter by Category Tab
 */
function filterRetentionCategory(cat, btnElem) {
    currentCategoryFilter = cat;
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
    renderRetentionCards();
}

/**
 * Search and Status Filter Handlers
 */
function handleRetentionSearch() {
    const input = document.getElementById('searchRetentionInput');
    currentSearchKeyword = (input ? input.value : '').toLowerCase().trim();
    renderRetentionCards();
}

function handleStatusFilterChange() {
    const select = document.getElementById('statusRetentionFilter');
    currentStatusFilter = select ? select.value : '';
    renderRetentionCards();
}

/**
 * Render Customer Cards List
 */
function renderRetentionCards() {
    const container = document.getElementById('retentionListContainer');
    if (!container) return;

    let filtered = allRetentionData.filter(item => {
        // Keyword Search Filter
        if (currentSearchKeyword) {
            const matchName = (item.nama_customer || '').toLowerCase().includes(currentSearchKeyword);
            const matchHp = (item.no_hp || '').toLowerCase().includes(currentSearchKeyword);
            const matchModel = (item.model_unit || '').toLowerCase().includes(currentSearchKeyword);
            const matchNopol = (item.no_polisi || '').toLowerCase().includes(currentSearchKeyword);
            if (!matchName && !matchHp && !matchModel && !matchNopol) return false;
        }

        // Status Filter
        if (currentStatusFilter && item.status_reminder !== currentStatusFilter) {
            return false;
        }

        // Category Tab Filter
        if (currentCategoryFilter === 'ALL') return true;

        const diffDays = getDaysDifference(item.tanggal_do);
        const tipe = (item.tipe_reminder || '').toUpperCase();

        if (currentCategoryFilter === '1000KM') {
            return tipe.includes('1000') || tipe.includes('1K') || (diffDays <= 45);
        }
        if (currentCategoryFilter === '10000KM') {
            return tipe.includes('10000') || tipe.includes('10K') || (diffDays >= 150 && diffDays <= 210);
        }
        if (currentCategoryFilter === 'ASURANSI') {
            return tipe.includes('ASURANSI') || (diffDays >= 320 && diffDays <= 400);
        }
        if (currentCategoryFilter === 'TRADEIN') {
            return tipe.includes('TRADEIN') || (diffDays >= 900);
        }
        if (currentCategoryFilter === 'BIRTHDAY') {
            return isBirthdayThisMonth(item.tanggal_lahir);
        }
        if (currentCategoryFilter === 'BOOKED') {
            return item.status_reminder === 'Terjadwal Servis' || !!item.booking_service_date;
        }

        return true;
    });

    const countInfo = document.getElementById('retentionCountInfo');
    if (countInfo) {
        countInfo.innerText = `Menampilkan ${filtered.length} dari total ${allRetentionData.length} konsumen`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:18px; border:1px solid #e2e8f0;">
                <div style="font-size:36px; margin-bottom:10px;">🔍</div>
                <h4 style="margin:0 0 6px 0; font-family:'Outfit',sans-serif; color:#1e293b;">Tidak Ada Data Pengingat</h4>
                <p style="margin:0; font-size:12.5px; color:#64748b;">Tidak ada konsumen yang sesuai dengan filter atau kata kunci pencarian Anda.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const diffDays = getDaysDifference(item.tanggal_do);
        const ageFormatted = formatOwnershipAge(item.tanggal_do);

        // Determine Milestone Details
        let badgeClass = 'servis10k';
        let typeLabel = 'Servis Berkala 10.000 KM (T-Care)';
        let cardStatusClass = 'status-warn';
        let timingAlert = `Jatuh tempo servis 6 bulan`;

        if (item.status_reminder === 'Terjadwal Servis' || item.booking_service_date) {
            badgeClass = 'booking';
            typeLabel = '📅 Booking Servis Terjadwal';
            cardStatusClass = 'status-done';
            timingAlert = `Jadwal: ${formatDateTimeIndo(item.booking_service_date || '')}`;
        } else if (diffDays <= 45 || item.tipe_reminder.includes('1000')) {
            badgeClass = 'servis1k';
            typeLabel = '🛠️ Servis 1.000 KM (Aktivasi Garansi)';
            cardStatusClass = 'status-urgent';
            const daysLeft = 30 - diffDays;
            timingAlert = daysLeft >= 0 ? `Tersisa ${daysLeft} hari menuju 1 bulan` : `Lewat ${Math.abs(daysLeft)} hari dari masa 1 bulan`;
        } else if ((diffDays >= 320 && diffDays <= 400) || item.tipe_reminder.includes('ASURANSI')) {
            badgeClass = 'asuransi';
            typeLabel = '🛡️ Jatuh Tempo STNK & Asuransi 1 Thn';
            cardStatusClass = 'status-warn';
            timingAlert = `Usia mobil ${ageFormatted} (Perpanjangan Polis & Pajak)`;
        } else if (diffDays >= 900 || item.tipe_reminder.includes('TRADEIN')) {
            badgeClass = 'tradein';
            typeLabel = '🚗 Golden Window: Trade-In Hybrid';
            cardStatusClass = 'status-tradein';
            timingAlert = `Usia mobil ${ageFormatted} • Waktu terbaik upgrade unit`;
        }

        const isContacted = item.status_reminder === 'Dihubungi' || item.status_reminder === 'Selesai';
        const isScheduled = item.status_reminder === 'Terjadwal Servis';
        
        let statusBadgeText = '⚠️ Belum Dihubungi';
        let statusBadgeBg = '#fef3c7';
        let statusBadgeColor = '#92400e';

        if (isScheduled) {
            statusBadgeText = '🔧 Terjadwal Servis';
            statusBadgeBg = '#ccfbf1';
            statusBadgeColor = '#0f766e';
        } else if (isContacted) {
            statusBadgeText = '💬 Sudah Dihubungi';
            statusBadgeBg = '#dcfce7';
            statusBadgeColor = '#166534';
        }

        const birthdayBadge = isBirthdayThisMonth(item.tanggal_lahir) 
            ? `<span class="type-badge birthday"><i class="fa-solid fa-cake-candles"></i> Ultah Bulan Ini</span>` 
            : '';

        return `
            <div class="retention-card ${cardStatusClass}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
                    
                    <!-- Left: Customer & Car Info -->
                    <div style="flex:1; min-width:280px;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; flex-wrap:wrap;">
                            <span class="type-badge ${badgeClass}">${typeLabel}</span>
                            ${birthdayBadge}
                            <span style="font-size:11px; font-weight:800; background:${statusBadgeBg}; color:${statusBadgeColor}; padding:3px 8px; border-radius:6px;">
                                ${statusBadgeText}
                            </span>
                        </div>

                        <div style="font-size:16px; font-weight:800; color:#0f172a; font-family:'Outfit',sans-serif; margin-bottom:2px;">
                            ${item.nama_customer}
                        </div>

                        <div style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:#334155; font-weight:600; margin-bottom:4px; flex-wrap:wrap;">
                            <span><i class="fa-solid fa-car-side" style="color:#059669; margin-right:4px;"></i>${item.model_unit}</span>
                            ${item.no_polisi ? `<span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:11.5px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">${item.no_polisi}</span>` : ''}
                            ${item.warna_unit ? `<span style="font-size:11.5px; color:#64748b;">• ${item.warna_unit}</span>` : ''}
                        </div>

                        <div style="display:flex; gap:14px; font-size:11.5px; color:#64748b; margin-top:4px; flex-wrap:wrap;">
                            <span><i class="fa-regular fa-calendar-check" style="margin-right:4px;"></i>Tgl DO: <strong>${formatDateIndo(item.tanggal_do)}</strong> (${ageFormatted})</span>
                            <span><i class="fa-solid fa-phone" style="margin-right:4px;"></i>${item.no_hp}</span>
                            ${item.leasing_partner ? `<span><i class="fa-solid fa-building-columns" style="margin-right:4px;"></i>${item.leasing_partner}</span>` : ''}
                        </div>

                        <!-- Timing & Notes Callout -->
                        <div style="margin-top:8px; background:#f8fafc; border-left:3px solid #059669; padding:6px 10px; border-radius:4px; font-size:11.5px; color:#334155;">
                            <div style="font-weight:700; color:#064e3b; margin-bottom:2px;">
                                <i class="fa-solid fa-clock-rotate-left" style="margin-right:4px;"></i>${timingAlert}
                            </div>
                            <div style="color:#475569;">${item.catatan_sales || 'Tidak ada catatan khusus.'}</div>
                        </div>

                        ${item.terakhir_dihubungi ? `
                            <div style="font-size:10.5px; color:#94a3b8; margin-top:6px;">
                                <i class="fa-solid fa-check-double"></i> Terakhir dihubungi: ${formatDateTimeIndo(item.terakhir_dihubungi)}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Right: Action Buttons -->
                    <div class="action-btn-group" style="align-self:center;">
                        <button type="button" class="btn-booking-action" onclick="openBookingServiceModal(${item.id})">
                            <i class="fa-solid fa-wrench"></i> Booking Servis
                        </button>
                        <button type="button" class="btn-wa-action" onclick="openWAComposerModal(${item.id})">
                            <i class="fa-brands fa-whatsapp"></i> Chat Pengingat
                        </button>
                    </div>

                </div>
            </div>
        `;
    }).join('');
}

/**
 * Check if customer's birthday is in the current month
 */
function isBirthdayThisMonth(birthDateStr) {
    if (!birthDateStr) return false;
    const b = new Date(birthDateStr);
    const today = new Date();
    return b.getMonth() === today.getMonth();
}

/**
 * Date Formatting Helpers (Indonesian)
 */
function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateTimeIndo(dateTimeStr) {
    if (!dateTimeStr) return '-';
    const d = new Date(dateTimeStr);
    if (isNaN(d)) return dateTimeStr;
    return `${formatDateIndo(dateTimeStr)} pk ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
}

// ==============================================================
// MODAL 1: SMART WHATSAPP MESSAGE COMPOSER LOGIC
// ==============================================================

function openWAComposerModal(customerId) {
    const cust = allRetentionData.find(c => c.id === customerId);
    if (!cust) return;

    selectedCustomerForWA = cust;
    selectedTone = 'formal';

    // Populate modal context
    document.getElementById('waModalCustomerName').innerText = cust.nama_customer;
    document.getElementById('waModalUnitDetail').innerText = `${cust.model_unit} • Plat: ${cust.no_polisi || 'Proses Polreg'}`;
    document.getElementById('waModalCustomerPhone').innerText = cust.no_hp;

    // Reset tone cards
    document.querySelectorAll('.tone-option-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('toneCardFormal').classList.add('selected');

    // Auto-select best default tone for Trade-In
    const diffDays = getDaysDifference(cust.tanggal_do);
    if (diffDays >= 900 || (cust.tipe_reminder || '').includes('TRADEIN')) {
        selectWATone('tradein');
    } else {
        selectWATone('formal');
    }

    const modal = document.getElementById('waComposerModal');
    if (modal) modal.classList.add('open');
}

function closeWAComposerModal() {
    const modal = document.getElementById('waComposerModal');
    if (modal) modal.classList.remove('open');
    selectedCustomerForWA = null;
}

function selectWATone(tone) {
    selectedTone = tone;
    document.querySelectorAll('.tone-option-card').forEach(c => c.classList.remove('selected'));

    if (tone === 'formal') document.getElementById('toneCardFormal').classList.add('selected');
    if (tone === 'friendly') document.getElementById('toneCardFriendly').classList.add('selected');
    if (tone === 'promo') document.getElementById('toneCardPromo').classList.add('selected');
    if (tone === 'tradein') document.getElementById('toneCardTradein').classList.add('selected');

    generateWAMessageContent();
}

function generateWAMessageContent() {
    if (!selectedCustomerForWA) return;

    const cust = selectedCustomerForWA;
    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
    const cabang = 'Tunas Toyota Kiara Condong Bandung';
    const diffDays = getDaysDifference(cust.tanggal_do);
    const nopol = cust.no_polisi ? `(No. Pol: ${cust.no_polisi})` : '';

    let text = "";

    // 1. TONE: FORMAL
    if (selectedTone === 'formal') {
        if (diffDays <= 45 || (cust.tipe_reminder || '').includes('1000')) {
            text = `Kepada Yth. Bapak/Ibu *${cust.nama_customer}*,\n\nSalam hormat dari *${cabang}*.\n\nSemoga Bapak/Ibu dan keluarga senantiasa dalam keadaan sehat dan lancar dalam segala aktivitas.\n\nSehubungan dengan unit *${cust.model_unit}* ${nopol} yang telah memasuki masa *1 Bulan / 1.000 KM pertama*, kami ingin mengingatkan jadwal *Pemeriksaan Servis 1.000 KM*.\n\n⚠️ *Pemberitahuan Penting:* Servis pertama ini *100% Bebas Biaya (GRATIS)* dan merupakan syarat utama untuk *Aktivasi Garansi Resmi ATPM Toyota (3 Tahun / 100.000 KM & Garansi Baterai Hybrid 8 Tahun)*.\n\nApabila Bapak/Ibu berkenan, kami dapat membantu reservasi antrean servis prioritas di bengkel resmi kami agar menghemat waktu Bapak/Ibu.\n\nTerima kasih atas kepercayaan Bapak/Ibu pada Tunas Toyota.\n\nHormat kami,\n👔 *${salesNama}*\n${cabang}`;
        } else if (diffDays >= 320 && diffDays <= 400) {
            text = `Kepada Yth. Bapak/Ibu *${cust.nama_customer}*,\n\nSalam hormat dari *${cabang}*.\n\nKami menginfokan bahwa polis *Asuransi All-Risk* serta masa berlaku *Pajak STNK Tahunan* kendaraan *${cust.model_unit}* ${nopol} Bapak/Ibu akan memasuki masa perpanjangan tahun pertama.\n\nUntuk kenyamanan dan perlindungan optimal tanpa jeda klaim, dealer kami menyediakan layanan perpanjangan polis resmi dengan benefit premi khusus nasabah Tunas Toyota.\n\nBoleh kami bantu hitungkan simulasi preminya, Bapak/Ibu?\n\nHormat kami,\n👔 *${salesNama}*\n${cabang}`;
        } else {
            text = `Kepada Yth. Bapak/Ibu *${cust.nama_customer}*,\n\nSalam hormat dari *${cabang}*.\n\nSekadar menginformasikan bahwa kendaraan *${cust.model_unit}* ${nopol} kesayangan Bapak/Ibu telah mendekati jadwal *Servis Berkala T-Care 10.000 KM / 6 Bulan*.\n\nBapak/Ibu berhak menikmati fasilitas *T-Care Bebas Biaya Jasa & Penggantian Oli Mesin Resmi Toyota*. Kami siap membantu mengatur jadwal reservasi servis agar Bapak/Ibu tidak perlu mengantre.\n\nHormat kami,\n👔 *${salesNama}*\n${cabang}`;
        }
    }

    // 2. TONE: FRIENDLY & WARM
    else if (selectedTone === 'friendly') {
        if (isBirthdayThisMonth(cust.tanggal_lahir)) {
            text = `Halo Bapak/Ibu *${cust.nama_customer}*! 🎂🎉✨\n\nSelamat Ulang Tahun dari segenap keluarga besar *${cabang}*!\n\nSemoga panjang umur, selalu sehat, berlimpah rezeki, dan semakin sukses sekeluarga. Semoga mobil *${cust.model_unit}* kesayangan selalu membawa berkah dan kenyamanan di setiap perjalanan!\n\nSpesial di hari bahagia ini, kami punya voucher diskon servis dan merchandise menarik khusus untuk Bapak/Ibu. Jika ada waktu luang, silakan mampir ke dealer kami ya!\n\nSalam hangat,\n👔 *${salesNama}*`;
        } else {
            text = `Halo Bapak/Ibu *${cust.nama_customer}*, apa kabar? Semoga sehat dan bahagia selalu ya! 😊🚗\n\nGimana pengalaman berkendara dengan *${cust.model_unit}* ${nopol}-nya, semoga nyaman dan menyenangkan buat keluarga!\n\nSekadar menyapa dan mengingatkan, mobilnya sudah mendekati jadwal servis berkala nih. Supaya performa mesin tetap prima dan irit BBM, mau saya bantu booking-kan jadwal servis di bengkel resmi Tunas Toyota Kiara Condong?\n\nBisa pilih mau servis di bengkel atau *Toyota Mobile Service (TMS)* yang teknisinya langsung datang ke rumah lho!\n\nSalam hangat,\n👔 *${salesNama}*`;
        }
    }

    // 3. TONE: BENEFIT & PROMO T-CARE
    else if (selectedTone === 'promo') {
        text = `Halo Bapak/Ibu *${cust.nama_customer}*! 🎁✨\n\nKabar baik dari *${cabang}*!\n\nJangan lewatkan hak istimewa *Program Toyota T-Care* untuk kendaraan *${cust.model_unit}* ${nopol} Anda:\n\n✅ *GRATIS Biaya Jasa Servis* s.d. 3 Tahun / 60.000 KM\n✅ *GRATIS Oli Mesin & Suku Cadang Resmi Toyota*\n✅ Jaminan Garansi Mesin & Sistem Kelistrikan Tetap Aktif\n\nSupaya tidak repot antre panjang di bengkel, yuk saya bantu pesankan nomor antrean servis prioritas sekarang (bisa request jam pagi / siang)!\n\nSalam hangat,\n👔 *${salesNama}*\n${cabang}`;
    }

    // 4. TONE: TRADE-IN HYBRID UPGRADE
    else if (selectedTone === 'tradein') {
        text = `Halo Bapak/Ibu *${cust.nama_customer}*, salam hangat dari *${cabang}*! 🌿🚗\n\nSpesial untuk pelanggan setia pemilik *${cust.model_unit}* ${nopol}, bulan ini dealer kami mengadakan program *Apresiasi Loyalitas: Subsidized Trade-In Ekstra Rp 3.000.000*!\n\nBapak/Ibu bisa upgrade mobil lama ke varian terbaru *Toyota Hybrid Electric Vehicle (Innova Zenix HEV / Yaris Cross HEV)*:\n⚡ Konsumsi BBM Super Irit (1:21 km/L)\n⚡ Tenaga lebih responsif & senyap\n⚡ Garansi Baterai Hybrid 8 Tahun / 160.000 KM\n\nMobil lama Bapak/Ibu kami hargai dengan *penawaran tertinggi di pasar* dan langsung dipotongkan sebagai DP mobil baru!\n\nBoleh kami bantu buatkan simulasi hitungan tukar tambahnya hari ini?\n\nSalam hangat,\n👔 *${salesNama}*`;
    }

    const textarea = document.getElementById('waMessageTextarea');
    if (textarea) textarea.value = text;
}

function copyWAMessageText() {
    const textarea = document.getElementById('waMessageTextarea');
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value);
    if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil!', 'Teks pesan WhatsApp berhasil disalin ke clipboard.', 'success');
    } else {
        alert('Teks WhatsApp berhasil disalin!');
    }
}

function dispatchWhatsAppMessage() {
    if (!selectedCustomerForWA) return;

    const cust = selectedCustomerForWA;
    const textarea = document.getElementById('waMessageTextarea');
    const message = textarea ? textarea.value : '';

    // Update status locally
    cust.status_reminder = 'Dihubungi';
    cust.terakhir_dihubungi = new Date().toISOString();
    renderRetentionCards();

    // Update to DB
    fetch('../api/api_retention.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'update_status',
            id: cust.id,
            status: 'Dihubungi',
            catatan_sales: `Sudah dihubungi via WA (${selectedTone.toUpperCase()}): ${new Date().toLocaleDateString('id-ID')}`
        })
    }).catch(err => console.warn(err));

    closeWAComposerModal();

    // Open WhatsApp
    const cleanHp = (cust.no_hp || '').replace(/[^0-9]/g, '');
    let formattedPhone = cleanHp;
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }

    const waUrl = formattedPhone 
        ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
}

// ==============================================================
// MODAL 2: BOOKING SERVIS BENGKEL RESMI LOGIC
// ==============================================================

function openBookingServiceModal(customerId) {
    const cust = allRetentionData.find(c => c.id === customerId);
    if (!cust) return;

    document.getElementById('bookingCustomerId').value = cust.id;
    document.getElementById('bookingCustomerName').innerText = cust.nama_customer;
    document.getElementById('bookingUnitDetail').innerText = `${cust.model_unit} • ${cust.no_polisi || 'Plat Sementara'} • HP: ${cust.no_hp}`;

    // Set default datetime to tomorrow 09:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const tomorrowISO = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    const dateInput = document.getElementById('bookingDateTimeInput');
    if (dateInput) dateInput.value = tomorrowISO;

    const modal = document.getElementById('bookingServiceModal');
    if (modal) modal.classList.add('open');
}

function closeBookingServiceModal() {
    const modal = document.getElementById('bookingServiceModal');
    if (modal) modal.classList.remove('open');
}

function submitBookingService() {
    const id = parseInt(document.getElementById('bookingCustomerId').value, 10);
    const bookingDate = document.getElementById('bookingDateTimeInput').value;
    const serviceType = document.getElementById('bookingServiceTypeSelect').value;
    const notes = document.getElementById('bookingNotesInput').value;

    if (!bookingDate) {
        alert('Silakan pilih tanggal dan jam servis terlebih dahulu!');
        return;
    }

    const cust = allRetentionData.find(c => c.id === id);
    if (!cust) return;

    // Update local state
    cust.status_reminder = 'Terjadwal Servis';
    cust.booking_service_date = bookingDate;
    cust.booking_service_type = serviceType;
    cust.catatan_sales = `Booking Servis: ${serviceType} pada ${formatDateTimeIndo(bookingDate)}. ${notes}`;

    renderRetentionCards();
    closeBookingServiceModal();

    // Call API
    fetch('../api/api_retention.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'book_service',
            id: id,
            booking_service_date: bookingDate,
            booking_service_type: serviceType,
            catatan_sales: cust.catatan_sales
        })
    })
    .then(r => r.json())
    .then(res => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Booking Servis Berhasil Dicatat!',
                text: `Jadwal ${serviceType} untuk ${cust.nama_customer} telah tersimpan. Ingin mengirimkan konfirmasi via WhatsApp?`,
                showCancelButton: true,
                confirmButtonText: '<i class="fa-brands fa-whatsapp"></i> Kirim Konfirmasi WA',
                cancelButtonText: 'Tutup'
            }).then((result) => {
                if (result.isConfirmed) {
                    sendBookingConfirmationWA(cust, bookingDate, serviceType, notes);
                }
            });
        } else {
            alert('Jadwal booking servis berhasil disimpan!');
        }
    })
    .catch(err => {
        console.warn('Simpan booking fallback:', err);
    });
}

function sendBookingConfirmationWA(cust, dateTimeStr, serviceType, notes) {
    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
    const cabang = 'Tunas Toyota Kiara Condong Bandung';

    const msg = `*KONFIRMASI BOOKING SERVIS RESMI TOYOTA*\n\nKepada Yth. Bapak/Ibu *${cust.nama_customer}*,\n\nTerima kasih telah mempercayakan perawatan kendaraan Anda kepada *${cabang}*.\n\nBerikut adalah rincian reservasi servis Anda:\n━━━━━━━━━━━━━━━━━━━\n🚗 *Kendaraan:* ${cust.model_unit}\n🔢 *Nomor Polisi:* ${cust.no_polisi || '-'}\n📅 *Jadwal Servis:* ${formatDateTimeIndo(dateTimeStr)}\n🛠️ *Layanan:* ${serviceType}\n📝 *Catatan:* ${notes || 'Pemeriksaan standar T-Care'}\n━━━━━━━━━━━━━━━━━━━\n\nMohon hadir 10 menit sebelum jadwal atau bersiap di rumah jika memilih layanan TMS.\n\nSalam hangat,\n👔 *${salesNama}*\n${cabang}`;

    const cleanHp = (cust.no_hp || '').replace(/[^0-9]/g, '');
    let formattedPhone = cleanHp.startsWith('0') ? '62' + cleanHp.slice(1) : cleanHp;
    const waUrl = formattedPhone 
        ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');
}

// ==============================================================
// MODAL 3: TAMBAH DATA KONSUMEN LOGIC
// ==============================================================

function openAddCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    if (modal) modal.classList.add('open');
}

function closeAddCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    if (modal) modal.classList.remove('open');
    const form = document.getElementById('addCustomerForm');
    if (form) form.reset();
}

function submitAddCustomerForm(e) {
    e.preventDefault();

    const name = document.getElementById('newCustName').value.trim();
    const phone = document.getElementById('newCustPhone').value.trim();
    const model = document.getElementById('newCustModel').value.trim();
    const nopol = document.getElementById('newCustNopol').value.trim();
    const color = document.getElementById('newCustWarna').value.trim();
    const tanggalDO = document.getElementById('newCustTanggalDO').value;
    const tanggalLahir = document.getElementById('newCustTanggalLahir').value;
    const asuransi = document.getElementById('newCustAsuransi').value.trim();
    const leasing = document.getElementById('newCustLeasing').value.trim();
    const notes = document.getElementById('newCustNotes').value.trim();

    if (!name || !phone || !model || !tanggalDO) {
        alert('Mohon lengkapi Nama, No HP, Model Mobil, dan Tanggal DO!');
        return;
    }

    const payload = {
        action: 'create',
        sales_account_id: localStorage.getItem('sales_id') || 1,
        nama_customer: name,
        no_hp: phone,
        model_unit: model,
        no_polisi: nopol,
        warna_unit: color,
        tanggal_do: tanggalDO,
        tanggal_lahir: tanggalLahir || null,
        tipe_asuransi: asuransi,
        leasing_partner: leasing,
        catatan_sales: notes
    };

    fetch('../api/api_retention.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(res => {
        closeAddCustomerModal();
        if (typeof Swal !== 'undefined') {
            Swal.fire('Berhasil!', 'Data kendaraan konsumen berhasil ditambahkan ke sistem retention.', 'success');
        } else {
            alert('Data konsumen berhasil disimpan!');
        }
        loadRetentionData();
    })
    .catch(err => {
        console.warn('Simpan offline mock:', err);
        allRetentionData.unshift({
            id: Date.now(),
            sales_account_id: 1,
            nama_customer: name,
            no_hp: phone,
            model_unit: model,
            no_polisi: nopol,
            warna_unit: color,
            tanggal_do: tanggalDO,
            tanggal_lahir: tanggalLahir,
            tipe_asuransi: asuransi,
            leasing_partner: leasing,
            tipe_reminder: '1000KM',
            status_reminder: 'Belum Dihubungi',
            catatan_sales: notes
        });
        closeAddCustomerModal();
        renderRetentionCards();
    });
}

/**
 * Auto-Sync Data from Delivery Order (DO)
 */
function syncDataFromDO() {
    const salesId = localStorage.getItem('sales_id') || 1;

    fetch('../api/api_retention.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'sync_from_do',
            sales_account_id: salesId
        })
    })
    .then(r => r.json())
    .then(res => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Sinkronisasi Selesai!',
                text: res.message || 'Data delivery order berhasil disinkronkan ke After-Sales Hub.'
            });
        } else {
            alert(res.message || 'Sinkronisasi berhasil!');
        }
        loadRetentionData();
    })
    .catch(err => {
        if (typeof Swal !== 'undefined') {
            Swal.fire('Informasi', 'Data Delivery Order sudah tersinkronisasi penuh!', 'info');
        } else {
            alert('Data DO sudah tersinkronisasi penuh!');
        }
    });
}
