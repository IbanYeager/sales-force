/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TUNAS TOYOTA - KALKULATOR SIMULASI KREDIT & MULTI-LEASING
 *  Logika Simulasi Cepat, Sinkronisasi Real-time & Integrasi WhatsApp / SPK
 * ═══════════════════════════════════════════════════════════════════════════
 */

let currentTenor = 3;
let currentMetode = 'flat';
let compareData = [];

const formatRp = (n) => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID');

function parseNum(str) {
    return Math.max(0, parseInt(String(str).replace(/\./g, '').replace(/[^0-9]/g, ''), 10) || 0);
}

function numToFormatted(n) {
    return Math.round(n || 0).toLocaleString('id-ID');
}

function formatInput(el) {
    const raw = el.value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (raw === '') { el.value = ''; return; }
    const num = parseInt(raw, 10);
    el.value = num.toLocaleString('id-ID');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text || '';
    return div.innerHTML;
}

// ── SYNC HARGA & TDP SLIDERS ──
function updateHarga(val) {
    const num = Number(val);
    document.getElementById('inputHarga').value = numToFormatted(num);
    // Auto adjust TDP slider max
    const rangeTdp = document.getElementById('rangeTdp');
    if (rangeTdp) rangeTdp.max = num;
    // Auto sync TDP with currently active DP Chip
    const activeChip = document.querySelector('.dp-chip-btn.active');
    const pct = activeChip ? parseInt(activeChip.getAttribute('data-pct'), 10) || 20 : 20;
    const tdpVal = Math.round(num * (pct / 100));
    document.getElementById('inputTdp').value = numToFormatted(tdpVal);
    syncTdp(tdpVal);
    hitung();
}

function syncHarga(val) {
    const v = parseNum(val);
    const clamped = Math.min(Math.max(v, 100000000), 2000000000);
    const rangeEl = document.getElementById('rangeHarga');
    if (rangeEl) rangeEl.value = clamped;
    hitung();
}

function updateTdp(val) {
    const num = Number(val);
    document.getElementById('inputTdp').value = numToFormatted(num);
    hitung();
}

function syncTdp(val) {
    const v = parseNum(val);
    const harga = getHarga();
    const clamped = Math.min(v, harga > 0 ? harga : 1000000000);
    const rangeEl = document.getElementById('rangeTdp');
    if (rangeEl) rangeEl.value = clamped;
    hitung();
}

// ── DP CHIP HANDLER ──
function setDpPersen(pct, btn) {
    const harga = getHarga();
    if (harga > 0) {
        const tdpVal = Math.round(harga * (pct / 100));
        document.getElementById('inputTdp').value = numToFormatted(tdpVal);
        syncTdp(tdpVal);
    }
    document.querySelectorAll('.dp-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    } else {
        document.querySelectorAll('.dp-chip-btn').forEach(b => {
            if (parseInt(b.getAttribute('data-pct'), 10) === pct) b.classList.add('active');
        });
    }
    hitung();
}

// ── TENOR SELECTION ──
function setTenor(th, el) {
    currentTenor = th;
    document.querySelectorAll('.tenor-card-btn').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    hitung();
}

// ── METODE BUNGA SELECTION ──
function setMetode(mode, el) {
    currentMetode = mode;
    document.querySelectorAll('.method-btn').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    hitung();
}

// ── MODEL PICKER ──
function pilihModel() {
    const sel = document.getElementById('selectModel');
    if (!sel || !sel.value) return;
    const parts = sel.value.split('|');
    const h = parseInt(parts[0], 10);
    if (!isNaN(h) && h > 0) {
        document.getElementById('inputHarga').value = numToFormatted(h);
        syncHarga(h);
        const activeChip = document.querySelector('.dp-chip-btn.active');
        const pct = activeChip ? parseInt(activeChip.getAttribute('data-pct'), 10) || 20 : 20;
        setDpPersen(pct);
    }
}

function updateBunga() {
    const sel = document.getElementById('selectProvinsi');
    if (!sel) return;
    const rate = Number(sel.value) || 0.0895;
    const pct = (rate * 100).toFixed(2).replace('.', ',');
    const badge = document.getElementById('bungaText');
    if (badge) badge.textContent = `Bunga Acuan ${pct}% p.a.`;
    hitung();
}

function getHarga() {
    const el = document.getElementById('inputHarga');
    return el ? parseNum(el.value) : 263500000;
}

function getTdp() {
    const el = document.getElementById('inputTdp');
    return el ? parseNum(el.value) : 52700000;
}

// ── FORMULA PERHITUNGAN ──
function hitungFlat(pokok, bungaPA, tahun) {
    const bulan = tahun * 12;
    const totalBunga = pokok * bungaPA * tahun;
    const cicilan = (pokok + totalBunga) / bulan;
    return { cicilan, totalBunga };
}

function hitungEfektif(pokok, bungaPA, tahun) {
    const bulan = tahun * 12;
    const rateBulan = bungaPA / 12;
    let saldo = pokok;
    let totalBunga = 0;
    const cicilanPokok = pokok / bulan;
    let cicilanPertama = 0;
    for (let i = 1; i <= bulan; i++) {
        const bungaBulanIni = saldo * rateBulan;
        totalBunga += bungaBulanIni;
        if (i === 1) cicilanPertama = cicilanPokok + bungaBulanIni;
        saldo -= cicilanPokok;
    }
    const cicilanRata = (pokok + totalBunga) / bulan;
    return { cicilan: cicilanRata, totalBunga, cicilanPertama };
}

function hitungAnuitas(pokok, bungaPA, tahun) {
    const bulan = tahun * 12;
    const r = bungaPA / 12;
    let cicilan;
    if (r === 0) {
        cicilan = pokok / bulan;
    } else {
        cicilan = pokok * r * Math.pow(1 + r, bulan) / (Math.pow(1 + r, bulan) - 1);
    }
    const totalBunga = (cicilan * bulan) - pokok;
    return { cicilan, totalBunga };
}

// ── SIMULASI UTAMA ──
function hitung() {
    const harga = getHarga();
    let tdp = getTdp();
    
    if (harga <= 0) return;
    if (tdp >= harga) {
        tdp = Math.round(harga * 0.2);
        document.getElementById('inputTdp').value = numToFormatted(tdp);
    }

    const admin = document.getElementById('inputAdmin') ? parseNum(document.getElementById('inputAdmin').value) : 2500000;
    const asuransi = document.getElementById('inputAsuransi') ? parseNum(document.getElementById('inputAsuransi').value) : 0;
    
    const leasingEl = document.getElementById('selectLeasing');
    const leasing = leasingEl && leasingEl.selectedIndex >= 0 ? leasingEl.options[leasingEl.selectedIndex].text : 'TAF (Toyota Astra Financial)';
    
    const tahun = currentTenor || 3;
    const bulan = tahun * 12;
    
    const provEl = document.getElementById('selectProvinsi');
    const bungaPA = provEl && provEl.value ? Number(provEl.value) : 0.0895;

    const pokok = harga - tdp;
    let cicilan, totalBunga;
    let metodeLabel = 'Flat Rate';

    if (currentMetode === 'efektif') {
        ({ cicilan, totalBunga } = hitungEfektif(pokok, bungaPA, tahun));
        metodeLabel = 'Efektif (Avg)';
    } else if (currentMetode === 'anuitas') {
        ({ cicilan, totalBunga } = hitungAnuitas(pokok, bungaPA, tahun));
        metodeLabel = 'Anuitas';
    } else {
        ({ cicilan, totalBunga } = hitungFlat(pokok, bungaPA, tahun));
        metodeLabel = 'Flat Rate';
    }

    const totalBayar = (cicilan * bulan) + tdp + admin + asuransi;
    const tdpFinal = tdp + admin + asuransi + cicilan; // TDP Total / First Payment

    const pctStr = (bungaPA * 100).toFixed(2).replace('.', ',') + '% p.a.';
    const provLabel = provEl && provEl.selectedOptions[0] ? provEl.selectedOptions[0].text.split('(')[0].trim() : 'Jawa Barat';

    // Update Elements
    const resAmount = document.getElementById('resultAmount');
    if (resAmount) resAmount.textContent = formatRp(cicilan);

    const resPeriod = document.getElementById('resultPeriod');
    if (resPeriod) resPeriod.textContent = `${bulan} bulan (${tahun} tahun)`;

    const resRate = document.getElementById('resultRateText');
    if (resRate) resRate.textContent = `${pctStr} · ${provLabel} · ${metodeLabel}`;

    const brkH = document.getElementById('brkHarga');
    if (brkH) brkH.textContent = formatRp(harga);

    const brkT = document.getElementById('brkTdp');
    if (brkT) brkT.textContent = formatRp(tdpFinal);

    const brkTdpMurni = document.getElementById('brkTdpMurni');
    if (brkTdpMurni) brkTdpMurni.textContent = formatRp(tdp);

    const brkP = document.getElementById('brkPokok');
    if (brkP) brkP.textContent = formatRp(pokok);

    const brkB = document.getElementById('brkBunga');
    if (brkB) brkB.textContent = formatRp(totalBunga);

    const brkTot = document.getElementById('brkTotal');
    if (brkTot) brkTot.textContent = formatRp(totalBayar);

    const brkM = document.getElementById('brkMetode');
    if (brkM) brkM.textContent = metodeLabel;

    const brkL = document.getElementById('brkLeasing');
    if (brkL) brkL.textContent = leasing.split('-')[0].trim();

    const brkAdm = document.getElementById('brkAdmin');
    if (brkAdm) brkAdm.textContent = formatRp(admin);

    const brkAsr = document.getElementById('brkAsuransi');
    if (brkAsr) brkAsr.textContent = formatRp(asuransi);

    // Multi-Leasing Calculation
    renderMultiLeasingMatrix(harga, tdp, tahun, admin, asuransi);
}

// ── MULTI-LEASING RATE MATRIX ──
function renderMultiLeasingMatrix(harga, tdp, tahun, admin, asuransi) {
    const container = document.getElementById('multiLeasingCard');
    const list = document.getElementById('multiLeasingList');
    if (!container || !list) return;

    const pokok = harga - tdp;
    const bulan = tahun * 12;

    const LEASING_PROVIDERS = [
        { name: 'TAF (Toyota Astra Financial)', rate: 0.0785, adminCost: 2200000, badge: '⭐ Resmi Toyota', color: '#b91c1c', bg: '#fee2e2' },
        { name: 'ACC (Astra Credit Companies)', rate: 0.0795, adminCost: 2250000, badge: '🏆 Approval 24 Jam', color: '#15803d', bg: '#dcfce7' },
        { name: 'BCA Finance', rate: 0.0725, adminCost: 2000000, badge: '🔥 Bunga Terendah', color: '#1e40af', bg: '#dbeafe' },
        { name: 'Mandiri Utama Finance (MUF)', rate: 0.0815, adminCost: 2100000, badge: '💎 Skema Fleksibel', color: '#6b21a8', bg: '#f3e8ff' },
        { name: 'Adira Finance', rate: 0.0860, adminCost: 1750000, badge: '✨ DP Paling Ringan', color: '#b45309', bg: '#fef3c7' }
    ];

    let html = '';
    LEASING_PROVIDERS.forEach(provider => {
        const totalBunga = pokok * provider.rate * tahun;
        const cicilan = (pokok + totalBunga) / bulan;
        const tdpFinal = tdp + provider.adminCost + asuransi + cicilan;

        html += `
            <div class="leasing-rate-item">
                <div>
                    <div class="l-name">
                        <span>${provider.name}</span>
                        <span class="l-badge" style="background:${provider.bg}; color:${provider.color};">${provider.badge}</span>
                    </div>
                    <div class="l-meta">
                        Bunga: <strong>${(provider.rate * 100).toFixed(2)}% p.a.</strong> · Est. TDP Total: <strong>${formatRp(tdpFinal)}</strong>
                    </div>
                </div>
                <div class="l-price-box">
                    <div class="l-price">${formatRp(cicilan)}</div>
                    <div class="l-price-unit">/ bulan (${bulan}x)</div>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    container.style.display = 'block';
}

// ── TRANSFER KE FORM SPK ──
window.proceedSimulationToSpk = function() {
    const amountText = document.getElementById('resultAmount')?.innerText || 'Rp 0';
    if (amountText === 'Rp 0') {
        alert('Silakan lakukan simulasi terlebih dahulu.');
        return;
    }

    const modelSelect = document.getElementById('selectModel');
    let mobilName = modelSelect && modelSelect.selectedIndex > 0 ? modelSelect.options[modelSelect.selectedIndex].text : '';
    if (mobilName.includes('(')) {
        mobilName = mobilName.split('(')[0].trim();
    }

    const hargaVal = getHarga();
    const tdpVal = getTdp();
    const cicilan = amountText.replace(/\D/g, '');
    const leasingSelect = document.getElementById('selectLeasing');
    const leasingName = leasingSelect && leasingSelect.selectedIndex >= 0 ? leasingSelect.options[leasingSelect.selectedIndex].text : '';
    const custName = window.currentSimCustomer || '';

    const url = `spk.html?customer=${encodeURIComponent(custName)}&model=${encodeURIComponent(mobilName)}&harga=${hargaVal}&dp=${tdpVal}&cicilan=${cicilan}&tenor=${currentTenor}&leasing=${encodeURIComponent(leasingName)}`;
    window.location.href = url;
};

// ── SHARE WHATSAPP RESMI ──
window.shareToWhatsApp = function() {
    const amountText = document.getElementById('resultAmount')?.innerText || 'Rp 0';
    if (amountText === 'Rp 0') {
        alert('Silakan lakukan simulasi terlebih dahulu.');
        return;
    }

    const modelSelect = document.getElementById('selectModel');
    let mobilName = modelSelect && modelSelect.selectedIndex > 0 ? modelSelect.options[modelSelect.selectedIndex].text : 'Mobil Toyota';
    if (mobilName.includes('(')) {
        mobilName = mobilName.split('(')[0].trim();
    }

    const hargaOTR = document.getElementById('brkHarga')?.innerText || 'Rp 0';
    const tdpMurni = document.getElementById('brkTdpMurni')?.innerText || 'Rp 0';
    const tdpFinal = document.getElementById('brkTdp')?.innerText || 'Rp 0';
    const cicilan = amountText;
    const bulan = currentTenor * 12;
    const leasingSelect = document.getElementById('selectLeasing');
    const leasingName = leasingSelect && leasingSelect.selectedIndex >= 0 ? leasingSelect.options[leasingSelect.selectedIndex].text : 'TAF / ACC';
    const metode = currentMetode.toUpperCase();

    let text = `🚗 *SIMULASI KREDIT RESMI TUNAS TOYOTA* 🚗\n` +
               `Cabang: Tunas Toyota Kiara Condong - Bandung\n\n` +
               `🚘 *Unit Pilihan*: *${mobilName}*\n` +
               `🏷️ *Harga OTR*: ${hargaOTR}\n\n` +
               `💳 *DETAIL SKEMA PEMBIAYAAN*:\n` +
               `• *Tenor*: ${bulan} Bulan (${currentTenor} Tahun)\n` +
               `• *Uang Muka (DP Murni)*: *${tdpMurni}*\n` +
               `• *Estimasi Total TDP Awal*: *${tdpFinal}* (Termasuk Angsuran 1 & Admin)\n` +
               `• *Cicilan per Bulan*: *${cicilan}*\n` +
               `• *Leasing Rekanan*: ${leasingName}\n` +
               `• *Metode Perhitungan*: ${metode}\n\n` +
               `_Catatan: Perhitungan di atas merupakan estimasi resmi. Suku bunga dan persetujuan kredit mengacu pada approval komite pembiayaan saat PO terbit._\n\n` +
               `Konsultasikan promo cashback dan diskon spesial hari ini bersama saya! 😊`;

    if (typeof window.injectSocialSignature === 'function') {
        text = window.injectSocialSignature(text);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
};

// ── COMPARISON LOGIC ──
window.addToCompare = function() {
    const amountText = document.getElementById('resultAmount')?.innerText || 'Rp 0';
    if (amountText === 'Rp 0') {
        alert('Silakan lakukan simulasi terlebih dahulu.');
        return;
    }

    const mobilSelect = document.getElementById('selectModel');
    let mobilName = mobilSelect && mobilSelect.selectedIndex > 0 ? mobilSelect.options[mobilSelect.selectedIndex].text : 'Toyota';
    if (mobilName.includes('(')) mobilName = mobilName.split('(')[0].trim();

    const tdpEl = document.getElementById('brkTdp');
    const tdpStr = tdpEl ? tdpEl.innerText.trim() : '-';

    const leasingSelect = document.getElementById('selectLeasing');
    const leasingName = leasingSelect && leasingSelect.selectedIndex >= 0 ? leasingSelect.options[leasingSelect.selectedIndex].text.split('-')[0].trim() : 'Leasing';

    const newItem = {
        mobil: mobilName,
        cicilan: amountText,
        tenor: `${currentTenor} Thn (${currentTenor * 12}x)`,
        tdp: tdpStr,
        leasing: leasingName,
        metode: currentMetode.toUpperCase()
    };

    compareData.push(newItem);
    renderCompare();
};

window.clearCompare = function() {
    compareData = [];
    renderCompare();
};

function renderCompare() {
    const container = document.getElementById('comparisonContainer');
    const list = document.getElementById('compareList');
    if (!container || !list) return;

    if (compareData.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    let html = '';
    compareData.forEach((item, index) => {
        html += `
            <div class="compare-card-mini">
                <div style="font-size:10px; font-weight:800; color:var(--text-muted); margin-bottom:2px;">Opsi ${index + 1}</div>
                <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; line-height:1.2;">${escapeHtml(item.mobil)}</div>
                <div style="font-size:14px; font-weight:900; color:var(--toyota-red); margin-bottom:2px;">${item.cicilan}</div>
                <div style="font-size:10.5px; color:#64748b; margin-bottom:6px;">${item.tenor}</div>
                <div style="font-size:10px; color:#334155;"><strong>TDP:</strong> ${item.tdp}</div>
                <div style="font-size:10px; color:#334155;"><strong>Leasing:</strong> ${item.leasing}</div>
            </div>
        `;
    });
    list.innerHTML = html;
}

// ── LOAD API DATA & URL PARAMS ──
async function loadKalkulatorData() {
    try {
        const res = await fetch('../api/api_kalkulator.php');
        const data = await res.json();
        if (data.status === 'success') {
            const selectLeasing = document.getElementById('selectLeasing');
            const selectProvinsi = document.getElementById('selectProvinsi');
            
            if (selectLeasing && Array.isArray(data.leasing) && data.leasing.length > 0) {
                selectLeasing.innerHTML = '';
                data.leasing.forEach(l => {
                    selectLeasing.innerHTML += `<option value="${l.nama_leasing}">${l.nama_leasing}</option>`;
                });
            }

            if (selectProvinsi && Array.isArray(data.provinsi) && data.provinsi.length > 0) {
                selectProvinsi.innerHTML = '';
                data.provinsi.forEach(p => {
                    const decimal = parseFloat(p.suku_bunga) / 100;
                    const formattedPct = parseFloat(p.suku_bunga).toString().replace('.', ',');
                    const isSelected = p.nama_provinsi.toLowerCase().includes('barat') ? 'selected' : '';
                    selectProvinsi.innerHTML += `<option value="${decimal}" ${isSelected}>${p.nama_provinsi} (${formattedPct}%)</option>`;
                });
            }

            updateBunga();
        }
    } catch (e) {
        console.warn('API Kalkulator offline/fallback mode:', e);
    }

    // Parse URL parameters from CRM / PriceList
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const pCustomer = urlParams.get('customer');
        const pMobil = urlParams.get('mobil') || urlParams.get('model');
        const pHarga = urlParams.get('harga');
        const pDp = urlParams.get('dp') || urlParams.get('tdp');

        if (pCustomer) {
            window.currentSimCustomer = pCustomer;
            const banner = document.getElementById('simCustBanner');
            if (banner) {
                banner.style.display = 'flex';
                document.getElementById('simCustName').textContent = pCustomer;
            }
        }

        if (pHarga) {
            const h = parseInt(pHarga, 10);
            if (!isNaN(h) && h > 0) {
                document.getElementById('inputHarga').value = numToFormatted(h);
                syncHarga(h);
            }
        }
        if (pDp) {
            const d = parseInt(pDp, 10);
            if (!isNaN(d) && d > 0) {
                document.getElementById('inputTdp').value = numToFormatted(d);
                syncTdp(d);
            }
        }
        if (pMobil) {
            const sel = document.getElementById('selectModel');
            if (sel) {
                for (let i = 0; i < sel.options.length; i++) {
                    if (sel.options[i].text.toLowerCase().includes(pMobil.toLowerCase())) {
                        sel.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    } catch (e) {
        console.error('URL parse error:', e);
    }

    // Jalankan hitung pertama kali
    hitung();
}

document.addEventListener('DOMContentLoaded', loadKalkulatorData);
