/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TUNAS TOYOTA - KALKULATOR SIMULASI KREDIT & MULTI-LEASING
 *  Logika Simulasi Cepat, Sinkronisasi Real-time & Integrasi WhatsApp / SPK
 * ═══════════════════════════════════════════════════════════════════════════
 */

let currentTenor = 3;
let currentMetode = 'flat';
let compareData = [];
let allVehicleData = [];

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
    const rangeTdp = document.getElementById('rangeTdp');
    if (rangeTdp) rangeTdp.max = num;
    
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

// ── MODEL PICKER & DYNAMIC RENDER ──
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
        hitung();
    }
}

function renderModelOptions(items) {
    const sel = document.getElementById('selectModel');
    if (!sel) return;
    if (!items || items.length === 0) {
        sel.innerHTML = '<option value="">-- Tidak ada model yang cocok --</option>';
        return;
    }

    const groups = {};
    items.forEach(m => {
        const groupName = (m.model || 'TOYOTA').toUpperCase();
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(m);
    });

    let optionsHtml = '<option value="">-- Pilih Model Kendaraan --</option>';
    for (const groupName in groups) {
        optionsHtml += `<optgroup label="TOYOTA ${groupName}">`;
        groups[groupName].forEach(m => {
            optionsHtml += `<option value="${m.value}">${m.label}</option>`;
        });
        optionsHtml += `</optgroup>`;
    }
    sel.innerHTML = optionsHtml;
}

function filterModelDropdown(keyword) {
    const sel = document.getElementById('selectModel');
    if (!sel || !allVehicleData || allVehicleData.length === 0) return;
    const query = (keyword || '').toLowerCase().trim();

    if (!query) {
        renderModelOptions(allVehicleData);
        return;
    }

    const filtered = allVehicleData.filter(m => {
        return (m.model && m.model.toLowerCase().includes(query)) ||
               (m.type && m.type.toLowerCase().includes(query)) ||
               (m.trans && m.trans.toLowerCase().includes(query)) ||
               (m.label && m.label.toLowerCase().includes(query));
    });

    renderModelOptions(filtered);
    if (filtered.length > 0) {
        sel.selectedIndex = 1;
        pilihModel();
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

    // Update Trade-In Target DP if present
    const tiReqDp = document.getElementById('tiDpBaruDibutuhkanText');
    if (tiReqDp) tiReqDp.textContent = formatRp(tdp);
    if (document.getElementById('checkTradeInEnable') && document.getElementById('checkTradeInEnable').checked) {
        if (typeof calcTradeInAppraisal === 'function') calcTradeInAppraisal();
    }

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

            // Populate all 260+ vehicle models from database
            if (Array.isArray(data.mobil) && data.mobil.length > 0) {
                allVehicleData = data.mobil;
                const currentVal = document.getElementById('selectModel') ? document.getElementById('selectModel').value : '';
                renderModelOptions(allVehicleData);
                const badge = document.getElementById('modelCountBadge');
                if (badge) badge.innerHTML = `<i class="fa-solid fa-car"></i> ${allVehicleData.length} Varian Siap Dihitung`;
                
                if (currentVal) {
                    const sel = document.getElementById('selectModel');
                    if (sel) sel.value = currentVal;
                } else {
                    const sel = document.getElementById('selectModel');
                    if (sel && sel.options.length > 1) {
                        sel.selectedIndex = 1;
                        pilihModel();
                    }
                }
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
                        pilihModel();
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
    if (typeof calcTradeInAppraisal === 'function') calcTradeInAppraisal();
}

document.addEventListener('DOMContentLoaded', loadKalkulatorData);

/* ═══════════════════════════════════════════════════════════════════════════
 *  FITUR 1, 2, 3: MODE SWITCHER, BUDGET MATCHMAKER, TRADE-IN & FLYER STUDIO
 * ═══════════════════════════════════════════════════════════════════════════ */

// ── 0. MODE SWITCHER (KALKULATOR vs MATCHMAKER) ──
function switchCalcMainMode(mode) {
    const secCalc = document.getElementById('sectionKalkulator');
    const secMm = document.getElementById('sectionMatchmaker');
    const tabCalc = document.getElementById('tabModeKalkulator');
    const tabMm = document.getElementById('tabModeMatchmaker');

    if (mode === 'matchmaker') {
        if (secCalc) secCalc.style.display = 'none';
        if (secMm) secMm.style.display = 'block';
        if (tabCalc) tabCalc.classList.remove('active');
        if (tabMm) tabMm.classList.add('active');
        runBudgetMatchmaker();
    } else {
        if (secCalc) secCalc.style.display = '';
        if (secMm) secMm.style.display = 'none';
        if (tabCalc) tabCalc.classList.add('active');
        if (tabMm) tabMm.classList.remove('active');
    }
}

// ── 1. FITUR 3: TRADE-IN (TAKSIR MOBIL LAMA & AUTO-BRIDGE DP) ──
const TRADEIN_DATABASE = {
    avanza: { 2024: 220, 2023: 200, 2022: 185, 2021: 170, 2020: 155, 2019: 145, 2018: 135, 2017: 125, 2016: 115, 2015: 105, 2014: 95, 2013: 88, 2012: 80 },
    veloz: { 2024: 255, 2023: 235, 2022: 218, 2021: 195, 2020: 178, 2019: 165, 2018: 150, 2017: 140, 2016: 130, 2015: 120, 2014: 110 },
    calya: { 2024: 148, 2023: 138, 2022: 126, 2021: 115, 2020: 105, 2019: 98, 2018: 90, 2017: 84, 2016: 78 },
    sigra: { 2024: 142, 2023: 132, 2022: 122, 2021: 112, 2020: 102, 2019: 94, 2018: 86, 2017: 80, 2016: 74 },
    agya: { 2024: 155, 2023: 140, 2022: 125, 2021: 115, 2020: 105, 2019: 98, 2018: 90, 2017: 82, 2016: 76, 2015: 70, 2014: 65 },
    ayla: { 2024: 142, 2023: 130, 2022: 118, 2021: 108, 2020: 98, 2019: 90, 2018: 82, 2017: 75, 2016: 70, 2015: 64, 2014: 58 },
    brio: { 2024: 175, 2023: 160, 2022: 148, 2021: 136, 2020: 125, 2019: 115, 2018: 105, 2017: 96, 2016: 88, 2015: 82, 2014: 75 },
    rush: { 2024: 260, 2023: 240, 2022: 225, 2021: 208, 2020: 192, 2019: 180, 2018: 168, 2017: 145, 2016: 135, 2015: 125, 2014: 115, 2013: 105 },
    terios: { 2024: 245, 2023: 228, 2022: 212, 2021: 195, 2020: 180, 2019: 168, 2018: 156, 2017: 135, 2016: 125, 2015: 115, 2014: 105, 2013: 95 },
    xpander: { 2024: 255, 2023: 238, 2022: 220, 2021: 202, 2020: 188, 2019: 174, 2018: 160 },
    innova: { 2024: 395, 2023: 360, 2022: 330, 2021: 298, 2020: 270, 2019: 248, 2018: 228, 2017: 208, 2016: 190, 2015: 160, 2014: 145, 2013: 130, 2012: 115 },
    fortuner: { 2024: 530, 2023: 490, 2022: 450, 2021: 415, 2020: 380, 2019: 345, 2018: 315, 2017: 285, 2016: 260, 2015: 220, 2014: 200, 2013: 180, 2012: 160 },
    pajero: { 2024: 540, 2023: 500, 2022: 460, 2021: 425, 2020: 390, 2019: 355, 2018: 325, 2017: 295, 2016: 270 },
    mobilio: { 2022: 165, 2021: 152, 2020: 140, 2019: 130, 2018: 120, 2017: 110, 2016: 100, 2015: 92, 2014: 85 },
    raize: { 2024: 235, 2023: 218, 2022: 205, 2021: 190 },
    rocky: { 2024: 225, 2023: 208, 2022: 195, 2021: 182 },
    yaris: { 2024: 260, 2023: 240, 2022: 220, 2021: 200, 2020: 185, 2019: 170, 2018: 155, 2017: 140, 2016: 130, 2015: 120, 2014: 110 },
    jazz: { 2021: 220, 2020: 205, 2019: 190, 2018: 175, 2017: 160, 2016: 145, 2015: 135, 2014: 125, 2013: 110, 2012: 100 }
};

let lastCalculatedTradeInNet = 0;

function toggleTradeInBox(show) {
    const box = document.getElementById('tradeInFormContent');
    const slider = document.getElementById('tradeInToggleSlider');
    if (box) box.style.display = show ? 'block' : 'none';
    if (slider) slider.style.backgroundColor = show ? '#c8102e' : '#cbd5e1';
    if (show) calcTradeInAppraisal();
}

function toggleOverKreditInputs(show) {
    const row = document.getElementById('overKreditRow');
    if (row) row.style.display = show ? 'grid' : 'none';
}

function updateTradeInModels() {
    const merk = document.getElementById('tiMerk') ? document.getElementById('tiMerk').value : 'Toyota';
    const inputModel = document.getElementById('tiModel');
    if (!inputModel) return;
    
    // Saran model cepat sesuai merk
    const suggestions = {
        'Toyota': 'Avanza 1.3 G M/T',
        'Daihatsu': 'Sigra 1.2 R Deluxe',
        'Honda': 'Brio Satya 1.2 E',
        'Suzuki': 'Ertiga GL M/T',
        'Mitsubishi': 'Xpander Ultimate A/T',
        'Nissan': 'Livina VE A/T',
        'Hyundai': 'Creta Trend IVT',
        'Wuling': 'Confero S 1.5 C',
        'Lainnya': 'Mobil Bekas Standar'
    };
    if (suggestions[merk]) {
        inputModel.value = suggestions[merk];
    }
}

function calcTradeInAppraisal() {
    const merk = (document.getElementById('tiMerk') ? document.getElementById('tiMerk').value : 'Toyota').trim();
    const modelText = (document.getElementById('tiModel') ? document.getElementById('tiModel').value : 'Avanza').toLowerCase();
    const tahun = parseInt(document.getElementById('tiTahun') ? document.getElementById('tiTahun').value : '2018', 10) || 2018;
    const trans = document.getElementById('tiTrans') ? document.getElementById('tiTrans').value : 'Manual';
    const kondisiMult = parseFloat(document.getElementById('tiKondisi') ? document.getElementById('tiKondisi').value : '1.0') || 1.0;
    
    // 1. Tentukan Nilai Dasar Pasar (Juta)
    let baseValJuta = 0;
    for (const [key, yearMap] of Object.entries(TRADEIN_DATABASE)) {
        if (modelText.includes(key)) {
            baseValJuta = yearMap[tahun] || (yearMap[2024] ? Math.max(50, yearMap[2024] - (2024 - tahun) * 11) : 120);
            break;
        }
    }
    if (baseValJuta === 0) {
        // Fallback perkiraan cerdas
        baseValJuta = Math.max(45, 185 - (2024 - tahun) * 11.5);
    }
    
    // Transmisi Matic biasanya bernilai +5jt - 8jt di pasar sekunder
    if (trans === 'Matic') {
        baseValJuta += 6;
    }
    
    let marketVal = Math.round(baseValJuta * 1000000 * kondisiMult);
    
    // Dealer Trade-in Subsidy Bonus Tunas Toyota
    const subsidiTunas = 3000000;
    
    // Cek Over-Kredit
    let sisaHutang = 0;
    const isOverKredit = document.getElementById('tiIsOverKredit') && document.getElementById('tiIsOverKredit').checked;
    if (isOverKredit) {
        const sisaBulan = parseInt(document.getElementById('tiSisaBulan') ? document.getElementById('tiSisaBulan').value : '0', 10) || 0;
        const angsLama = parseNum(document.getElementById('tiAngsuranLama') ? document.getElementById('tiAngsuranLama').value : '0');
        sisaHutang = sisaBulan * angsLama;
    }
    
    const nilaiBersih = Math.max(0, marketVal + subsidiTunas - sisaHutang);
    lastCalculatedTradeInNet = nilaiBersih;
    
    // Target DP Toyota Baru yang Dibutuhkan
    const neededDp = parseNum(document.getElementById('inputTdp') ? document.getElementById('inputTdp').value : '0');
    
    // Update DOM Display
    const elPasar = document.getElementById('tiNilaiPasarText');
    const elBersih = document.getElementById('tiNilaiBersihText');
    const elDpReq = document.getElementById('tiDpBaruDibutuhkanText');
    const elSub = document.getElementById('tiSubInfoText');
    const elStatus = document.getElementById('tiStatusSolisiText') || document.getElementById('tiStatusSolusiText');
    
    if (elPasar) elPasar.textContent = formatRp(marketVal);
    if (elBersih) elBersih.textContent = formatRp(nilaiBersih);
    if (elDpReq) elDpReq.textContent = formatRp(neededDp);
    if (elSub) {
        let subText = `${merk} ${document.getElementById('tiModel') ? document.getElementById('tiModel').value : ''} (${tahun}) + Subsidi Tunas Rp 3.000.000`;
        if (isOverKredit && sisaHutang > 0) {
            subText += ` - Pelunasan Leasing Lama ${formatRp(sisaHutang)}`;
        }
        elSub.textContent = subText;
    }
    
    if (elStatus) {
        if (nilaiBersih >= neededDp) {
            const surplus = nilaiBersih - neededDp;
            elStatus.innerHTML = `🎉 <strong>Nilai mobil lama menutup 100% DP baru!</strong> Sisa uang tunai kembali ke konsumen: <span style="color:#4ade80;">${formatRp(surplus)}</span>`;
        } else {
            const shortfall = neededDp - nilaiBersih;
            const pctCovered = neededDp > 0 ? Math.round((nilaiBersih / neededDp) * 100) : 0;
            elStatus.innerHTML = `💡 <strong>Nilai mobil lama menutup ${pctCovered}% dari DP!</strong> Konsumen cukup menambah sisa tunai: <span style="color:#fde047;">${formatRp(shortfall)}</span>`;
        }
    }
}

function applyTradeInToKalkulator() {
    if (lastCalculatedTradeInNet <= 0) {
        alert('Nilai bersih mobil lama masih Rp 0. Silakan cek data kendaraan lama Anda.');
        return;
    }
    
    // Terapkan ke input TDP
    const inputTdp = document.getElementById('inputTdp');
    if (inputTdp) {
        inputTdp.value = numToFormatted(lastCalculatedTradeInNet);
        syncTdp(lastCalculatedTradeInNet);
        hitung();
    }
    
    // Berikan feedback visual
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#065f46; color:#ffffff; padding:14px 22px; border-radius:12px; font-size:13px; font-weight:800; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:99999; display:flex; align-items:center; gap:10px; transition:all 0.3s ease;';
    notif.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#34d399; font-size:18px;"></i> Berhasil! Nilai mobil lama (${formatRp(lastCalculatedTradeInNet)}) telah dijadikan Uang Muka (DP) Toyota Baru.`;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 400);
    }, 3500);
    
    // Scroll ke kartu hasil
    const resCard = document.querySelector('.result-primary-card');
    if (resCard) resCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ── 2. FITUR 2: BUDGET MATCHMAKER (PENCARI MOBIL SESUAI ANGGARAN) ──

// Helper Kategori Kendaraan
function getVehicleCategory(modelName) {
    const m = (modelName || '').toUpperCase();
    if (m.includes('CALYA') || m.includes('AVANZA') || m.includes('VELOZ') || m.includes('ZENIX') || m.includes('INNOVA') || m.includes('VOXY') || m.includes('ALPHARD') || m.includes('VELLFIRE')) {
        return 'MPV';
    }
    if (m.includes('RAIZE') || m.includes('RUSH') || m.includes('YARIS CROSS') || m.includes('FORTUNER') || m.includes('COROLLA CROSS') || m.includes('LAND CRUISER') || m.includes('BZ4X')) {
        return 'SUV';
    }
    if (m.includes('AGYA') || m.includes('YARIS') || m.includes('GR-YARIS') || m.includes('GR-COROLLA') || m.includes('VIOS') || m.includes('ALTIS') || m.includes('CAMRY')) {
        return 'HATCHBACK';
    }
    if (m.includes('RANGGA') || m.includes('HILUX') || m.includes('HIACE') || m.includes('HI-ACE') || m.includes('DYNA')) {
        return 'COMMERCIAL';
    }
    return 'MPV';
}

function getCarImageFallback(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('avanza')) return '../assets/img/mobil/avanza.webp';
    if (n.includes('veloz')) return '../assets/img/mobil/veloz.webp';
    if (n.includes('calya')) return '../assets/img/mobil/calya.webp';
    if (n.includes('agya')) return '../assets/img/mobil/agya.webp';
    if (n.includes('zenix')) return '../assets/img/mobil/zenix.webp';
    if (n.includes('innova')) return '../assets/img/mobil/innova-reborn.webp';
    if (n.includes('yaris cross')) return '../assets/img/mobil/yaris-cross.webp';
    if (n.includes('yaris')) return '../assets/img/mobil/yaris.webp';
    if (n.includes('raize')) return '../assets/img/mobil/raize.webp';
    if (n.includes('rush')) return '../assets/img/mobil/rush.webp';
    if (n.includes('fortuner')) return '../assets/img/mobil/fortuner.webp';
    if (n.includes('alphard')) return '../assets/img/mobil/alphard.webp';
    if (n.includes('voxy')) return '../assets/img/mobil/voxy.webp';
    if (n.includes('rangga')) return '../assets/img/mobil/rangga.webp';
    if (n.includes('hilux')) return '../assets/img/mobil/double-cabin.webp';
    if (n.includes('hiace') || n.includes('hi-ace')) return '../assets/img/mobil/hi-ace-comm.webp';
    if (n.includes('camry')) return '../assets/img/mobil/camry.webp';
    if (n.includes('corolla cross')) return '../assets/img/mobil/corolla-cross.webp';
    if (n.includes('vios')) return '../assets/img/mobil/vios.webp';
    return '../assets/img/mobil/avanza.webp';
}

function setMmDp(val) {
    const input = document.getElementById('mmInputDp');
    const lbl = document.getElementById('lblMmDpVal');
    if (input) input.value = numToFormatted(val);
    if (lbl) lbl.textContent = formatRp(val);
    
    // Update active quick chip
    const chips = document.querySelectorAll('#sectionMatchmaker .chip-quick');
    chips.forEach(c => {
        if (c.getAttribute('onclick') && c.getAttribute('onclick').includes(`setMmDp(${val})`)) {
            c.classList.add('active');
        } else if (c.getAttribute('onclick') && c.getAttribute('onclick').includes('setMmDp')) {
            c.classList.remove('active');
        }
    });
    
    runBudgetMatchmaker();
}

function setMmCicilan(val) {
    const input = document.getElementById('mmInputCicilan');
    const lbl = document.getElementById('lblMmCicilanVal');
    if (input) input.value = numToFormatted(val);
    if (lbl) lbl.textContent = formatRp(val);
    
    // Update active quick chip
    const chips = document.querySelectorAll('#sectionMatchmaker .chip-quick');
    chips.forEach(c => {
        if (c.getAttribute('onclick') && c.getAttribute('onclick').includes(`setMmCicilan(${val})`)) {
            c.classList.add('active');
        } else if (c.getAttribute('onclick') && c.getAttribute('onclick').includes('setMmCicilan')) {
            c.classList.remove('active');
        }
    });
    
    runBudgetMatchmaker();
}

function runBudgetMatchmaker() {
    const grid = document.getElementById('mmResultsGrid');
    const countText = document.getElementById('mmResultCountText');
    if (!grid) return;
    
    const budgetDp = parseNum(document.getElementById('mmInputDp') ? document.getElementById('mmInputDp').value : '35000000');
    const budgetCicilan = parseNum(document.getElementById('mmInputCicilan') ? document.getElementById('mmInputCicilan').value : '4500000');
    const selectedKat = document.getElementById('mmSelectKategori') ? document.getElementById('mmSelectKategori').value : 'ALL';
    const tenor = parseInt(document.getElementById('mmSelectTenor') ? document.getElementById('mmSelectTenor').value : '5', 10) || 5;
    
    const lblDp = document.getElementById('lblMmDpVal');
    const lblCic = document.getElementById('lblMmCicilanVal');
    if (lblDp) lblDp.textContent = formatRp(budgetDp);
    if (lblCic) lblCic.textContent = formatRp(budgetCicilan);
    
    // Sumber Data: allVehicleData dari API atau Fallback Populer jika offline/belum loaded
    let sourceList = (Array.isArray(allVehicleData) && allVehicleData.length > 0) ? allVehicleData : [
        { model: 'CALYA', type: '1.2 E M/T', otr: 177200000, value: '177200000|CALYA 1.2 E M/T', label: 'CALYA 1.2 E M/T' },
        { model: 'CALYA', type: '1.2 G A/T', otr: 195600000, value: '195600000|CALYA 1.2 G A/T', label: 'CALYA 1.2 G A/T' },
        { model: 'AGYA', type: '1.2 G M/T', otr: 185100000, value: '185100000|AGYA 1.2 G M/T', label: 'AGYA 1.2 G M/T' },
        { model: 'AGYA', type: '1.2 G A/T', otr: 201300000, value: '201300000|AGYA 1.2 G A/T', label: 'AGYA 1.2 G A/T' },
        { model: 'AVANZA', type: '1.3 E M/T', otr: 239700000, value: '239700000|AVANZA 1.3 E M/T', label: 'AVANZA 1.3 E M/T' },
        { model: 'AVANZA', type: '1.5 G CVT', otr: 263500000, value: '263500000|AVANZA 1.5 G CVT', label: 'AVANZA 1.5 G CVT' },
        { model: 'VELOZ', type: '1.5 M/T', otr: 292900000, value: '292900000|VELOZ 1.5 M/T', label: 'VELOZ 1.5 M/T' },
        { model: 'VELOZ', type: '1.5 Q CVT', otr: 308700000, value: '308700000|VELOZ 1.5 Q CVT', label: 'VELOZ 1.5 Q CVT' },
        { model: 'RAIZE', type: '1.2 G M/T', otr: 241000000, value: '241000000|RAIZE 1.2 G M/T', label: 'RAIZE 1.2 G M/T' },
        { model: 'RAIZE', type: '1.0T GR SPORT CVT', otr: 290000000, value: '290000000|RAIZE 1.0T GR SPORT CVT', label: 'RAIZE 1.0T GR SPORT CVT' },
        { model: 'RUSH', type: '1.5 G M/T', otr: 284400000, value: '284400000|RUSH 1.5 G M/T', label: 'RUSH 1.5 G M/T' },
        { model: 'RUSH', type: '1.5 S GR SPORT A/T', otr: 310400000, value: '310400000|RUSH 1.5 S GR SPORT A/T', label: 'RUSH 1.5 S GR SPORT A/T' },
        { model: 'YARIS CROSS', type: '1.5 G CVT', otr: 375000000, value: '375000000|YARIS CROSS 1.5 G CVT', label: 'YARIS CROSS 1.5 G CVT' },
        { model: 'ZENIX', type: '2.0 G CVT', otr: 439900000, value: '439900000|ZENIX 2.0 G CVT', label: 'ZENIX 2.0 G CVT' },
        { model: 'HILUX RANGGA', type: 'PICK UP DSL', otr: 245000000, value: '245000000|HILUX RANGGA PICK UP DSL', label: 'HILUX RANGGA PICK UP DSL' },
        { model: 'FORTUNER', type: '2.8 VRZ 4X2 A/T', otr: 564200000, value: '564200000|FORTUNER 2.8 VRZ 4X2 A/T', label: 'FORTUNER 2.8 VRZ 4X2 A/T' }
    ];
    
    const matches = [];
    
    sourceList.forEach(item => {
        const fullTitle = `${item.model || ''} ${item.type || ''}`.trim() || item.label || 'Toyota Unit';
        const otr = parseInt(item.otr || (item.value ? item.value.split('|')[0] : 0), 10) || 0;
        if (otr <= 0) return;
        
        const cat = getVehicleCategory(fullTitle);
        if (selectedKat !== 'ALL' && cat !== selectedKat) return;
        
        // DP Minimum Acuan (20% standar, toleransi promo 15%)
        const dpStd = Math.round(otr * 0.20);
        const dpMinPromo = Math.round(otr * 0.15);
        
        // Asumsi DP yang dipakai: Jika budget konsumen di antara min promo dan std, gunakan budget konsumen
        const dpApplied = Math.max(dpMinPromo, Math.min(budgetDp, otr * 0.35));
        const pokok = otr - dpApplied;
        const totalBulan = tenor * 12;
        const bungaRate = 0.0895; // 8.95% p.a.
        const totalBunga = pokok * bungaRate * tenor;
        const angsuran = Math.round((pokok + totalBunga) / totalBulan);
        
        // Cek kecocokan budget
        const isDpFit = dpMinPromo <= (budgetDp * 1.08);
        const isAngsFit = angsuran <= (budgetCicilan * 1.08);
        
        let matchType = null;
        if (isDpFit && isAngsFit) {
            matchType = 'EXACT'; // Sesuai Budget
        } else if (dpMinPromo <= (budgetDp * 1.30) && angsuran <= (budgetCicilan * 1.30)) {
            matchType = 'UPGRADE'; // Rekomendasi Upgrade Ringan
        }
        
        if (matchType) {
            matches.push({
                item,
                title: fullTitle,
                category: cat,
                otr: otr,
                dpMin: dpMinPromo,
                dpStd: dpStd,
                angsuran: angsuran,
                tenor: tenor,
                matchType: matchType,
                diffCicilan: angsuran - budgetCicilan,
                img: getCarImageFallback(fullTitle)
            });
        }
    });
    
    // Sort: EXACT match first, then lowest delta angsuran
    matches.sort((a, b) => {
        if (a.matchType === 'EXACT' && b.matchType !== 'EXACT') return -1;
        if (a.matchType !== 'EXACT' && b.matchType === 'EXACT') return 1;
        return a.diffCicilan - b.diffCicilan;
    });
    
    // Render Results
    if (countText) {
        countText.innerHTML = `Ditemukan <strong>${matches.length} Model Toyota</strong> yang Masuk Kualifikasi Anggaran:`;
    }
    const heroCount = document.getElementById('mmHeroCountNumber');
    if (heroCount) heroCount.textContent = matches.length;
    
    if (matches.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; background:#ffffff; border:1.5px dashed #cbd5e1; border-radius:18px; padding:36px 20px; text-align:center;">
                <div style="width:60px; height:60px; border-radius:50%; background:#fef2f2; color:#ef4444; font-size:24px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
                    <i class="fa-solid fa-filter-circle-xmark"></i>
                </div>
                <h4 style="font-size:16px; font-weight:800; color:#1e293b; margin:0 0 6px;">Belum Ada Unit yang Pas dengan Budget Ini</h4>
                <p style="font-size:12.5px; color:#64748b; margin:0 auto 16px; max-width:440px;">
                    Coba naikkan toleransi Uang Muka (DP) ke <strong>Rp 35 Jt+</strong> atau Cicilan ke <strong>Rp 4 Jt+</strong>, atau pilih kategori <strong>Semua Model Toyota</strong>.
                </p>
                <button type="button" class="btn" style="background:var(--toyota-red); color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;" onclick="setMmDp(35000000); setMmCicilan(4500000);">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Gunakan Rekomendasi Populer (Avanza / Calya)
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    matches.forEach(m => {
        const isExact = m.matchType === 'EXACT';
        const badgeBg = isExact ? '#dcfce7' : '#fef3c7';
        const badgeColor = isExact ? '#15803d' : '#b45309';
        const badgeIcon = isExact ? '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i>' : '<i class="fa-solid fa-star" style="color:#d97706;"></i>';
        const badgeText = isExact ? 'Sesuai Budget' : 'Rekomendasi Upgrade';
        
        const carValEscaped = (m.item.value || `${m.otr}|${m.title}`).replace(/"/g, '&quot;');
        const carTitleEscaped = m.title.replace(/"/g, '&quot;');
        
        html += `
            <div class="matchmaker-car-card ${isExact ? 'exact-match' : 'upgrade-match'}">
                <div class="mm-card-head">
                    <span class="mm-badge" style="background:${badgeBg}; color:${badgeColor}; font-weight:800;">
                        ${badgeIcon}
                        <span>${badgeText}</span>
                    </span>
                    <span class="mm-category-tag">${m.category}</span>
                </div>
                
                <div class="mm-car-thumb-wrap">
                    <img src="${m.img}" class="mm-car-thumb" alt="${m.title}" loading="lazy" onerror="this.src='../assets/img/mobil/avanza.webp'">
                </div>
                
                <h4 class="mm-car-title" title="${m.title}">${m.title}</h4>
                <div class="mm-otr-price">OTR: ${formatRp(m.otr)}</div>
                
                <div class="mm-sim-matrix">
                    <div class="mm-sim-box">
                        <span class="mm-sim-label">TDP Mulai Dari</span>
                        <span class="mm-sim-val gold">${formatRp(m.dpMin)}</span>
                        <span style="font-size:9.5px; color:#64748b;">(Estimasi DP 15-20%)</span>
                    </div>
                    <div class="mm-sim-box">
                        <span class="mm-sim-label">Cicilan / Bulan</span>
                        <span class="mm-sim-val blue">${formatRp(m.angsuran)}</span>
                        <span style="font-size:9.5px; color:#64748b;">(${m.tenor} Thn · Flat Rate)</span>
                    </div>
                </div>
                
                <div class="mm-btn-group">
                    <button type="button" class="btn-mm-select" onclick="selectMatchmakerModel('${carValEscaped}', ${m.dpMin}, ${m.tenor})">
                        <i class="fa-solid fa-calculator"></i> Buka Simulasi Lengkap
                    </button>
                    <button type="button" class="btn-mm-wa" onclick="shareMatchmakerRecommendation('${carTitleEscaped}', ${m.otr}, ${m.dpMin}, ${m.angsuran}, ${m.tenor})" title="Bagikan rekomendasi ini ke WA Konsumen">
                        <i class="fa-brands fa-whatsapp"></i> WA
                    </button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function selectMatchmakerModel(carVal, reqDp, tenor) {
    // 1. Pindah ke Tab Kalkulator
    switchCalcMainMode('kalkulator');
    
    // 2. Set Model Dropdown
    const sel = document.getElementById('selectModel');
    if (sel) {
        let found = false;
        for (let i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === carVal || (carVal.split('|')[1] && sel.options[i].value.includes(carVal.split('|')[1]))) {
                sel.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found && sel.options.length > 0) {
            sel.value = carVal;
        }
        pilihModel();
    }
    
    // 3. Set DP & Tenor
    if (reqDp && reqDp > 0) {
        const inputTdp = document.getElementById('inputTdp');
        if (inputTdp) {
            inputTdp.value = numToFormatted(reqDp);
            syncTdp(reqDp);
        }
    }
    
    if (tenor && tenor >= 1 && tenor <= 6) {
        currentTenor = tenor;
        document.querySelectorAll('.tenor-card-btn').forEach(btn => {
            const num = btn.querySelector('.t-num');
            if (num && parseInt(num.textContent, 10) === tenor) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    hitung();
    
    // Scroll ke atas
    window.scrollTo({ top: 120, behavior: 'smooth' });
}

function shareMatchmakerRecommendation(name, otr, dp, angs, thn) {
    const text = `Halo Bapak/Ibu,\n\nBerikut rekomendasi unit Toyota yang sesuai dengan kriteria anggaran Anda:\n\n` +
        `🚗 *${name}*\n` +
        `💰 *Harga OTR:* ${formatRp(otr)}\n` +
        `💎 *Uang Muka (TDP) Mulai:* ${formatRp(dp)}\n` +
        `📉 *Cicilan Ringan:* ${formatRp(angs)} / bulan\n` +
        `⏳ *Jangka Waktu:* ${thn} Tahun (${thn * 12} Bulan)\n\n` +
        `🎁 *Bonus Spesial Pemesanan Bulan Ini:*\n` +
        `✓ Free Servis & Garansi Resmi Toyota s/d 3 Thn (T-Care)\n` +
        `✓ Kaca Film Lumar Bergaransi\n` +
        `✓ Karpet Lembaran & Talang Air Original\n` +
        `✓ Layanan Darurat 24 Jam Astra World\n\n` +
        `Bisa Tukar Tambah (Trade-In) mobil lama segala merk dengan harga terbaik!\n` +
        `Berminat test-drive atau hitungan skema leasing lainnya? Hubungi saya sekarang ya. Terima kasih!`;
        
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
}


// ── 3. FITUR 1: STUDIO FLYER PROMO TOYOTA (WA STORY & IG SQUARE) ──

let flyerCurrentRatio = '9:16';
let flyerCurrentTheme = 'crimson';

function openFlyerStudioModal() {
    const modal = document.getElementById('flyerStudioModal');
    if (!modal) return;
    
    // Ambil data kalkulasi aktif saat ini
    const harga = getHarga();
    const tdp = parseNum(document.getElementById('inputTdp') ? document.getElementById('inputTdp').value : '0');
    const resAmount = document.getElementById('resultAmount');
    const cicilanStr = resAmount ? resAmount.textContent.trim() : 'Rp 4.500.000';
    
    // Isi field input flyer dengan data realtime
    const inputTdp = document.getElementById('flyerTdpInput');
    const inputCic = document.getElementById('flyerCicilanInput');
    if (inputTdp) inputTdp.value = `DP Mulai ${formatRp(tdp)}`;
    if (inputCic) inputCic.value = `${cicilanStr} / Bln`;
    
    // Coba ambil nama sales dari session/localStorage jika ada
    try {
        const storedSales = localStorage.getItem('sales_name') || localStorage.getItem('userName');
        const storedPhone = localStorage.getItem('sales_phone') || localStorage.getItem('userPhone');
        if (storedSales && document.getElementById('flyerSalesName')) document.getElementById('flyerSalesName').value = storedSales;
        if (storedPhone && document.getElementById('flyerSalesPhone')) document.getElementById('flyerSalesPhone').value = storedPhone;
    } catch(e) {}
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Render awal
    setTimeout(() => {
        renderFlyerCanvas();
    }, 100);
}

function closeFlyerStudioModal(e) {
    const modal = document.getElementById('flyerStudioModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function setFlyerRatio(ratio, btn) {
    flyerCurrentRatio = ratio;
    const btnStory = document.getElementById('btnRatioStory');
    const btnSquare = document.getElementById('btnRatioSquare');
    if (btnStory) btnStory.classList.toggle('active', ratio === '9:16');
    if (btnSquare) btnSquare.classList.toggle('active', ratio === '1:1');
    renderFlyerCanvas();
}

function setFlyerTheme(theme, el) {
    flyerCurrentTheme = theme;
    document.querySelectorAll('.theme-box-picker').forEach(b => {
        b.style.borderColor = '#e2e8f0';
        b.classList.remove('active');
    });
    if (el) {
        el.classList.add('active');
        el.style.borderColor = theme === 'crimson' ? '#c8102e' : (theme === 'navy' ? '#1e3a8a' : '#d97706');
    }
    renderFlyerCanvas();
}

function generateFlyerQr(url) {
    const qrContainer = document.getElementById('hiddenFlyerQrCode');
    if (!qrContainer) return null;
    qrContainer.innerHTML = '';
    if (typeof QRCode === 'undefined') return null;
    try {
        new QRCode(qrContainer, {
            text: url,
            width: 140,
            height: 140,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        const qrCanvas = qrContainer.querySelector('canvas');
        if (qrCanvas) return qrCanvas;
        const qrImg = qrContainer.querySelector('img');
        if (qrImg) return qrImg;
    } catch(e) {
        console.warn('QR gen error:', e);
    }
    return null;
}

function renderFlyerCanvas() {
    const canvas = document.getElementById('flyerCanvas');
    const previewImg = document.getElementById('flyerCanvasPreviewImg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set Dimensions based on ratio
    const isStory = flyerCurrentRatio === '9:16';
    const W = 1080;
    const H = isStory ? 1920 : 1080;
    canvas.width = W;
    canvas.height = H;
    
    // Ambil Data Model & Promo
    const modelSel = document.getElementById('selectModel');
    let carName = 'ALL NEW AVANZA 1.5 G CVT';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').trim();
    }
    
    const hargaNum = getHarga();
    const hargaText = formatRp(hargaNum);
    const headlineText = (document.getElementById('flyerHeadlineInput') ? document.getElementById('flyerHeadlineInput').value : 'SPECIAL PROMO BULAN INI').toUpperCase();
    const tdpText = (document.getElementById('flyerTdpInput') ? document.getElementById('flyerTdpInput').value : `DP Mulai ${formatRp(Math.round(hargaNum * 0.2))}`);
    const cicilanText = (document.getElementById('flyerCicilanInput') ? document.getElementById('flyerCicilanInput').value : 'Rp 4,5 Jt / Bln');
    const salesName = (document.getElementById('flyerSalesName') ? document.getElementById('flyerSalesName').value : 'Official Sales Consultant').trim();
    const salesPhone = (document.getElementById('flyerSalesPhone') ? document.getElementById('flyerSalesPhone').value : '0812-3456-7890').trim();
    
    // Checklist bonus
    const bTcare = document.getElementById('chkBonusTcare') && document.getElementById('chkBonusTcare').checked;
    const bKaca = document.getElementById('chkBonusKaca') && document.getElementById('chkBonusKaca').checked;
    const bKarpet = document.getElementById('chkBonusKarpet') && document.getElementById('chkBonusKarpet').checked;
    const bApar = document.getElementById('chkBonusApar') && document.getElementById('chkBonusApar').checked;
    
    // Generate QR Code Element
    const waClean = salesPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const waTarget = `https://wa.me/${waClean}?text=${encodeURIComponent(`Halo ${salesName}, saya melihat promo poster Toyota ${carName}. Boleh minta info detail & simulasi perhitungannya?`)}`;
    const qrElement = generateFlyerQr(waTarget);
    
    // ── 1. BACKGROUND DRAWING ──
    let grad;
    if (flyerCurrentTheme === 'navy') {
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.35, '#0f172a');
        grad.addColorStop(0.7, '#1e3a8a');
        grad.addColorStop(1, '#020617');
    } else if (flyerCurrentTheme === 'gold') {
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#09090b');
        grad.addColorStop(0.4, '#1c1917');
        grad.addColorStop(0.75, '#451a03');
        grad.addColorStop(1, '#09090b');
    } else {
        // Crimson Toyota
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#090e18');
        grad.addColorStop(0.3, '#7f1d1d');
        grad.addColorStop(0.7, '#991b1b');
        grad.addColorStop(1, '#090e18');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    
    // Decorative Grid & Glow Elements
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }
    ctx.restore();
    
    // ── 2. TOP BRANDING BAR ──
    const topMargin = isStory ? 80 : 50;
    
    // Dealer Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TUNAS TOYOTA', 70, topMargin + 40);
    
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('BANDUNG · JAWA BARAT', 70, topMargin + 70);
    
    // Right Badge
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(W - 320, topMargin + 10, 250, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.font = '800 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DEALER RESMI TOYOTA', W - 195, topMargin + 41);
    ctx.restore();
    
    // ── 3. PROMO HEADLINE PILL ──
    const headY = isStory ? 230 : 155;
    ctx.save();
    ctx.textAlign = 'center';
    
    // Glow behind headline
    ctx.shadowColor = flyerCurrentTheme === 'gold' ? '#f59e0b' : '#ef4444';
    ctx.shadowBlur = 24;
    ctx.fillStyle = flyerCurrentTheme === 'gold' ? '#d97706' : (flyerCurrentTheme === 'navy' ? '#2563eb' : '#c8102e');
    ctx.beginPath();
    ctx.roundRect(W / 2 - 280, headY, 560, 50, 25);
    ctx.fill();
    ctx.restore();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★  ${headlineText}  ★`, W / 2, headY + 33);
    
    // ── 4. CAR MODEL & OTR PRICE ──
    const titleY = isStory ? 350 : 255;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    
    // Wrap title if too long
    if (carName.length > 25) {
        ctx.font = '900 40px "Outfit", sans-serif';
    }
    ctx.fillText(carName, W / 2, titleY);
    
    ctx.fillStyle = '#fde047';
    ctx.font = '800 28px "Inter", sans-serif';
    ctx.fillText(`HARGA OTR: ${hargaText}`, W / 2, titleY + 45);
    
    // ── 5. CAR IMAGE RENDERING ──
    const carImgSrc = getCarImageFallback(carName);
    const carImg = new Image();
    carImg.crossOrigin = 'anonymous';
    carImg.src = carImgSrc;
    
    function drawRestOfCanvas() {
        // Draw Car Image
        const carY = isStory ? 480 : 320;
        const carH = isStory ? 400 : 300;
        const carW = isStory ? 740 : 560;
        
        ctx.save();
        // Virtual Ground Shadow
        const shadowGrad = ctx.createRadialGradient(W / 2, carY + carH - 20, 40, W / 2, carY + carH - 20, 360);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(W / 2, carY + carH - 20, 380, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        
        try {
            ctx.drawImage(carImg, (W - carW) / 2, carY, carW, carH);
        } catch(e) {
            console.warn('Canvas car draw failed, using placeholder:', e);
        }
        ctx.restore();
        
        // ── 6. GOLDEN HIGHLIGHT OFFER BOX ──
        const boxY = isStory ? 940 : 640;
        const boxW = W - 140;
        const boxH = isStory ? 240 : 170;
        const boxX = 70;
        
        ctx.save();
        // Box Background Glassmorphism
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 24);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = flyerCurrentTheme === 'gold' ? '#f59e0b' : '#fbbf24';
        ctx.stroke();
        
        // Divider
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(boxX + boxW / 2, boxY + 25);
        ctx.lineTo(boxX + boxW / 2, boxY + boxH - (isStory ? 60 : 35));
        ctx.stroke();
        
        // Left: TDP Ringan
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '800 16px "Inter", sans-serif';
        ctx.fillText('TOTAL UANG MUKA (TDP)', boxX + boxW / 4, boxY + (isStory ? 55 : 42));
        
        ctx.fillStyle = '#fde047';
        ctx.font = `900 ${isStory ? 44 : 32}px "Outfit", sans-serif`;
        ctx.fillText(tdpText, boxX + boxW / 4, boxY + (isStory ? 115 : 85));
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 14px "Inter", sans-serif';
        ctx.fillText('Sudah Termasuk Asuransi & Admin*', boxX + boxW / 4, boxY + (isStory ? 150 : 110));
        
        // Right: Angsuran Murah
        ctx.fillStyle = '#94a3b8';
        ctx.font = '800 16px "Inter", sans-serif';
        ctx.fillText('ANGSURAN / BULAN', boxX + (boxW * 3) / 4, boxY + (isStory ? 55 : 42));
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${isStory ? 44 : 32}px "Outfit", sans-serif`;
        ctx.fillText(cicilanText, boxX + (boxW * 3) / 4, boxY + (isStory ? 115 : 85));
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 14px "Inter", sans-serif';
        ctx.fillText('Tenor Panjang s/d 5-6 Tahun*', boxX + (boxW * 3) / 4, boxY + (isStory ? 150 : 110));
        
        // Bottom Banner inside box (Only in 9:16)
        if (isStory) {
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.beginPath();
            ctx.roundRect(boxX + 15, boxY + boxH - 52, boxW - 30, 40, 12);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.font = '700 14px "Inter", sans-serif';
            ctx.fillText('⚡ BISA TUKAR TAMBAH SEMUA MERK · PROSES KREDIT DIBANTU SAMPAI APPROVE', boxX + boxW / 2, boxY + boxH - 26);
        }
        ctx.restore();
        
        // ── 7. BONUS BADGES (ONLY FOR 9:16 STORY) ──
        if (isStory) {
            const bonusY = 1240;
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 22px "Outfit", sans-serif';
            ctx.fillText('BONUS & KEUNTUNGAN SPESIAL PEMBELIAN:', 80, bonusY);
            
            const bonuses = [];
            if (bTcare) bonuses.push('✓ Free Jasa Servis & Oli s/d 3 Thn (T-Care)');
            if (bKaca) bonuses.push('✓ Kaca Film Lumar Bergaransi Resmi');
            if (bKarpet) bonuses.push('✓ Karpet Lembaran & Talang Air Original');
            if (bApar) bonuses.push('✓ APAR & Kotak P3K Resmi Toyota');
            bonuses.push('✓ Layanan Darurat Derek 24 Jam (Astra World)');
            bonuses.push('✓ Garansi Mesin Resmi 3 Tahun / 100.000 KM');
            
            let curY = bonusY + 45;
            bonuses.forEach((b, idx) => {
                if (idx < 5) {
                    ctx.save();
                    ctx.fillStyle = 'rgba(255,255,255,0.12)';
                    ctx.beginPath();
                    ctx.roundRect(80, curY - 26, W - 160, 42, 10);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                    ctx.stroke();
                    
                    ctx.fillStyle = '#f8fafc';
                    ctx.font = '700 16px "Inter", sans-serif';
                    ctx.fillText(b, 100, curY);
                    ctx.restore();
                    curY += 54;
                }
            });
        }
        
        // ── 8. FOOTER SALES & QR CODE CARD ──
        const footH = isStory ? 240 : 180;
        const footY = H - footH - (isStory ? 60 : 35);
        const footW = W - 140;
        const footX = 70;
        
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(footX, footY, footW, footH, 24);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        
        // Sales Text (Left)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = `900 ${isStory ? 28 : 22}px "Outfit", sans-serif`;
        ctx.fillText(salesName, footX + 30, footY + (isStory ? 60 : 48));
        
        ctx.fillStyle = '#64748b';
        ctx.font = '700 15px "Inter", sans-serif';
        ctx.fillText('Official Sales Consultant · Tunas Toyota Bandung', footX + 30, footY + (isStory ? 95 : 78));
        
        // WhatsApp Pill Button
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(footX + 30, footY + (isStory ? 125 : 100), isStory ? 320 : 260, isStory ? 54 : 44, 27);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${isStory ? 19 : 15}px "Inter", sans-serif`;
        ctx.fillText(`✆ WA: ${salesPhone}`, footX + 50, footY + (isStory ? 160 : 128));
        
        if (isStory) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 12px "Inter", sans-serif';
            ctx.fillText('*Syarat & Ketentuan Berlaku. Unit Terbatas.', footX + 30, footY + 210);
        }
        
        // QR Code on Right
        const qrSize = isStory ? 160 : 120;
        const qrX = footX + footW - qrSize - 30;
        const qrY = footY + (footH - qrSize) / 2;
        
        if (qrElement) {
            try {
                ctx.drawImage(qrElement, qrX, qrY, qrSize, qrSize);
                // Frame
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
                
                // Label under QR
                ctx.textAlign = 'center';
                ctx.fillStyle = '#475569';
                ctx.font = '800 10.5px "Inter", sans-serif';
                ctx.fillText('SCAN KONSULTASI WA', qrX + qrSize / 2, qrY + qrSize + 14);
            } catch(e) {
                console.warn('QR canvas render error:', e);
            }
        }
        ctx.restore();
        
        // ── 9. UPDATE PREVIEW IMAGE ──
        if (previewImg) {
            previewImg.src = canvas.toDataURL('image/png');
        }
    }
    
    if (carImg.complete && carImg.naturalWidth > 0) {
        drawRestOfCanvas();
    } else {
        carImg.onload = drawRestOfCanvas;
        carImg.onerror = () => {
            carImg.src = '../assets/img/mobil/avanza.webp';
            carImg.onload = drawRestOfCanvas;
            carImg.onerror = drawRestOfCanvas;
        };
        setTimeout(() => {
            if (!previewImg.src || previewImg.src === '') drawRestOfCanvas();
        }, 300);
    }
}

function downloadFlyerImage() {
    const canvas = document.getElementById('flyerCanvas');
    if (!canvas) return;
    
    const modelSel = document.getElementById('selectModel');
    let carName = 'Toyota';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').replace(/[^a-zA-Z0-9]/g, '_').trim();
    }
    
    const link = document.createElement('a');
    link.download = `Promo_${carName}_${flyerCurrentRatio === '9:16' ? 'Story' : 'Square'}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function shareFlyerCaptionWA() {
    const modelSel = document.getElementById('selectModel');
    let carName = 'Toyota All New Avanza';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').trim();
    }
    
    const tdpText = (document.getElementById('flyerTdpInput') ? document.getElementById('flyerTdpInput').value : 'DP Ringan');
    const cicilanText = (document.getElementById('flyerCicilanInput') ? document.getElementById('flyerCicilanInput').value : 'Angsuran Terjangkau');
    const salesName = (document.getElementById('flyerSalesName') ? document.getElementById('flyerSalesName').value : 'Sales Consultant');
    const salesPhone = (document.getElementById('flyerSalesPhone') ? document.getElementById('flyerSalesPhone').value : '');
    
    const caption = `🔥 *PROMO RESMI TOYOTA BANDUNG - ${carName.toUpperCase()}* 🔥\n\n` +
        `Dapatkan penawaran terbaik bulan ini dengan kemudahan:\n` +
        `💎 *${tdpText}*\n` +
        `📉 *Cicilan Mulai: ${cicilanText}*\n` +
        `⏳ Tenor Panjang s/d 5-6 Tahun | Bunga Spesial\n\n` +
        `🎁 *Bonus Spesial Pembelian:*\n` +
        `✓ Free Servis Berkala & Oli s/d 3 Thn (T-Care)\n` +
        `✓ Kaca Film Lumar Bergaransi\n` +
        `✓ Karpet & Talang Air Original\n` +
        `✓ Layanan Darurat 24 Jam Astra World\n\n` +
        `🔄 *Menerima Tukar Tambah (Trade-In) semua merk dengan harga tertinggi!*\n` +
        `Data dibantu s/d serah terima unit di rumah Anda.\n\n` +
        `Hubungi:\n` +
        `👤 *${salesName}*\n` +
        `📱 Telp/WA: ${salesPhone}\n` +
        `📍 *Tunas Toyota Kiara Condong Bandung*`;
        
    const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
    window.open(waUrl, '_blank');
}

function copyFlyerPromoCaption() {
    const modelSel = document.getElementById('selectModel');
    let carName = 'Toyota All New Avanza';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').trim();
    }
    
    const tdpText = (document.getElementById('flyerTdpInput') ? document.getElementById('flyerTdpInput').value : 'DP Ringan');
    const cicilanText = (document.getElementById('flyerCicilanInput') ? document.getElementById('flyerCicilanInput').value : 'Angsuran Terjangkau');
    const salesName = (document.getElementById('flyerSalesName') ? document.getElementById('flyerSalesName').value : 'Sales Consultant');
    const salesPhone = (document.getElementById('flyerSalesPhone') ? document.getElementById('flyerSalesPhone').value : '');
    
    const caption = `🔥 *PROMO RESMI TOYOTA BANDUNG - ${carName.toUpperCase()}* 🔥\n\n` +
        `Dapatkan penawaran terbaik bulan ini:\n` +
        `💎 *${tdpText}*\n` +
        `📉 *Cicilan Mulai: ${cicilanText}*\n\n` +
        `🎁 *Bonus Tambahan:*\n` +
        `✓ Free Servis 3 Tahun (T-Care)\n` +
        `✓ Kaca Film Lumar & Talang Air\n` +
        `✓ Layanan Derek 24 Jam Astra World\n\n` +
        `Tukar Tambah (Trade-In) mobil lama segala merk diterima dengan taksiran tertinggi!\n\n` +
        `Hubungi: *${salesName}* (WA: ${salesPhone})\n` +
        `Tunas Toyota Kiara Condong Bandung`;
        
    if (navigator.clipboard) {
        navigator.clipboard.writeText(caption).then(() => {
            alert('✓ Caption WhatsApp & Medsos berhasil disalin ke clipboard!');
        }).catch(() => {
            prompt('Salin teks caption berikut:', caption);
        });
    } else {
        prompt('Salin teks caption berikut:', caption);
    }
}
