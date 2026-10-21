/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TUNAS TOYOTA - STUDIO FLYER & POSTER PROMO WHATSAPP (DEDICATED PAGE JS)
 *  High-DPI HTML5 Canvas Generator with Live QR Code & Multi-Ratio Exporter
 * ═══════════════════════════════════════════════════════════════════════════
 */

let flyerRatio = '9:16';
let flyerTheme = 'crimson';
let allVehicles = [];

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

function setFlyerRatio(ratio, btn) {
    flyerRatio = ratio;
    document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const resTag = document.getElementById('flyerResInfoTag');
    if (resTag) {
        resTag.innerHTML = ratio === '9:16'
            ? '<i class="fa-solid fa-expand"></i> Resolusi Ekspor: <strong>1080 x 1920 px</strong> (Ultra HD Story)'
            : '<i class="fa-solid fa-expand"></i> Resolusi Ekspor: <strong>1080 x 1080 px</strong> (Ultra HD Feed/Chat)';
    }

    renderFlyerCanvas();
}

function setFlyerTheme(theme, el) {
    flyerTheme = theme;
    document.querySelectorAll('.theme-pill-box').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
    renderFlyerCanvas();
}

function applyHeadlinePreset(txt) {
    const input = document.getElementById('flyerHeadlineInput');
    if (input) {
        input.value = txt;
        renderFlyerCanvas();
    }
}

function onModelFlyerChange() {
    const sel = document.getElementById('selectModelFlyer');
    if (!sel || !sel.value) return;
    const parts = sel.value.split('|');
    const otr = parseInt(parts[0], 10) || 0;
    
    if (otr > 0) {
        const inputHarga = document.getElementById('flyerHargaInput');
        if (inputHarga) inputHarga.value = numToFormatted(otr);
        
        // Auto default TDP 20% & cicilan estimasi 5 tahun
        const tdpEst = Math.round(otr * 0.20);
        const cicEst = Math.round(((otr - tdpEst) + (otr - tdpEst) * 0.0895 * 5) / 60);
        
        const inputTdp = document.getElementById('flyerTdpInput');
        const inputCic = document.getElementById('flyerCicilanInput');
        if (inputTdp) inputTdp.value = `DP Mulai ${formatRp(tdpEst)}`;
        if (inputCic) inputCic.value = `${formatRp(cicEst)} / Bln`;
    }
    renderFlyerCanvas();
}

function generateFlyerQr(url) {
    const qrContainer = document.getElementById('hiddenFlyerQrCode');
    const qrThumbContainer = document.getElementById('qrLiveThumbContainer');
    if (!qrContainer) return null;
    qrContainer.innerHTML = '';
    if (qrThumbContainer) qrThumbContainer.innerHTML = '';
    
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
        
        if (qrThumbContainer) {
            new QRCode(qrThumbContainer, {
                text: url,
                width: 64,
                height: 64,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
        
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
    const isStory = flyerRatio === '9:16';
    const W = 1080;
    const H = isStory ? 1920 : 1080;
    canvas.width = W;
    canvas.height = H;

    // Ambil Data Model & Promo
    const modelSel = document.getElementById('selectModelFlyer');
    let carName = 'ALL NEW AVANZA 1.5 G CVT';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').trim();
    }

    const hargaNum = parseNum(document.getElementById('flyerHargaInput') ? document.getElementById('flyerHargaInput').value : '263500000');
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
    const bDerek = document.getElementById('chkBonusDerek') && document.getElementById('chkBonusDerek').checked;
    const bGaransi = document.getElementById('chkBonusGaransi') && document.getElementById('chkBonusGaransi').checked;

    // Generate QR Code Element
    const waClean = salesPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const waTarget = `https://wa.me/${waClean}?text=${encodeURIComponent(`Halo ${salesName}, saya melihat poster promo Toyota ${carName}. Boleh minta info simulasi & diskon terbaiknya?`)}`;
    const qrElement = generateFlyerQr(waTarget);

    // ── 1. BACKGROUND GRADIENT ──
    let grad;
    if (flyerTheme === 'navy') {
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.35, '#0f172a');
        grad.addColorStop(0.7, '#1e3a8a');
        grad.addColorStop(1, '#020617');
    } else if (flyerTheme === 'gold') {
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#09090b');
        grad.addColorStop(0.4, '#1c1917');
        grad.addColorStop(0.75, '#451a03');
        grad.addColorStop(1, '#09090b');
    } else if (flyerTheme === 'emerald') {
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#022c22');
        grad.addColorStop(0.35, '#064e3b');
        grad.addColorStop(0.7, '#047857');
        grad.addColorStop(1, '#022c22');
    } else {
        // Crimson Toyota (Default)
        grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#090e18');
        grad.addColorStop(0.3, '#7f1d1d');
        grad.addColorStop(0.7, '#991b1b');
        grad.addColorStop(1, '#090e18');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Tech Grid Ambient Pattern
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
    ctx.roundRect(W - 330, topMargin + 10, 260, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.font = '800 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DEALER RESMI TOYOTA', W - 200, topMargin + 41);
    ctx.restore();

    // ── 3. PROMO HEADLINE PILL ──
    const headY = isStory ? 230 : 155;
    ctx.save();
    ctx.textAlign = 'center';

    // Glow effect behind headline
    ctx.shadowColor = flyerTheme === 'gold' ? '#f59e0b' : (flyerTheme === 'emerald' ? '#10b981' : '#ef4444');
    ctx.shadowBlur = 24;
    ctx.fillStyle = flyerTheme === 'gold' ? '#d97706' : (flyerTheme === 'navy' ? '#2563eb' : (flyerTheme === 'emerald' ? '#059669' : '#c8102e'));
    ctx.beginPath();
    ctx.roundRect(W / 2 - 300, headY, 600, 52, 26);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 21px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★  ${headlineText}  ★`, W / 2, headY + 34);

    // ── 4. CAR MODEL & OTR PRICE ──
    const titleY = isStory ? 355 : 255;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';

    if (carName.length > 25) {
        ctx.font = '900 38px "Outfit", sans-serif';
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
            console.warn('Canvas draw image error:', e);
        }
        ctx.restore();

        // ── 6. GOLDEN HIGHLIGHT OFFER BOX ──
        const boxY = isStory ? 940 : 640;
        const boxW = W - 140;
        const boxH = isStory ? 240 : 170;
        const boxX = 70;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 24);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = flyerTheme === 'gold' ? '#f59e0b' : '#fbbf24';
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

        // ── 7. BONUS BADGES (9:16 STORY) ──
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
            if (bDerek) bonuses.push('✓ Layanan Darurat Derek 24 Jam (Astra World)');
            if (bGaransi) bonuses.push('✓ Garansi Mesin Resmi 3 Tahun / 100.000 KM');

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

        // Sales Info
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = `900 ${isStory ? 28 : 22}px "Outfit", sans-serif`;
        ctx.fillText(salesName, footX + 30, footY + (isStory ? 60 : 48));

        ctx.fillStyle = '#64748b';
        ctx.font = '700 15px "Inter", sans-serif';
        ctx.fillText('Official Sales Consultant · Tunas Toyota Kiara Condong', footX + 30, footY + (isStory ? 95 : 78));

        // WhatsApp Pill Button
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(footX + 30, footY + (isStory ? 125 : 100), isStory ? 330 : 260, isStory ? 54 : 44, 27);
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
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

                ctx.textAlign = 'center';
                ctx.fillStyle = '#475569';
                ctx.font = '800 10.5px "Inter", sans-serif';
                ctx.fillText('SCAN KONSULTASI WA', qrX + qrSize / 2, qrY + qrSize + 14);
            } catch(e) {
                console.warn('QR render error:', e);
            }
        }
        ctx.restore();

        // ── 9. UPDATE PREVIEW IMAGE ──
        if (previewImg) {
            previewImg.src = canvas.toDataURL('image/png');
        }

        // ── 10. SYNC LIVE CAPTION PREVIEW ──
        updateLiveCaptionText(carName, hargaText, tdpText, cicilanText, salesName, salesPhone);
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

function updateLiveCaptionText(carName, hargaText, tdpText, cicilanText, salesName, salesPhone) {
    const box = document.getElementById('liveCaptionPreviewText');
    if (!box) return;

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

    box.textContent = caption;
}

function downloadFlyerImage() {
    const canvas = document.getElementById('flyerCanvas');
    if (!canvas) return;

    const modelSel = document.getElementById('selectModelFlyer');
    let carName = 'Toyota';
    if (modelSel && modelSel.selectedIndex >= 0 && modelSel.options[modelSel.selectedIndex]) {
        carName = modelSel.options[modelSel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').replace(/[^a-zA-Z0-9]/g, '_').trim();
    }

    const link = document.createElement('a');
    link.download = `Promo_${carName}_${flyerRatio === '9:16' ? 'Story' : 'Square'}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function shareFlyerCaptionWA() {
    const box = document.getElementById('liveCaptionPreviewText');
    const caption = box ? box.textContent : 'Promo Spesial Toyota Tunas Kiara Condong';
    const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
    window.open(waUrl, '_blank');
}

function copyFlyerPromoCaption() {
    const box = document.getElementById('liveCaptionPreviewText');
    const caption = box ? box.textContent : '';

    if (navigator.clipboard) {
        navigator.clipboard.writeText(caption).then(() => {
            showToast('✓ Caption WhatsApp & Medsos berhasil disalin ke clipboard!');
        }).catch(() => {
            prompt('Salin teks caption berikut:', caption);
        });
    } else {
        prompt('Salin teks caption berikut:', caption);
    }
}

function showToast(msg) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#065f46; color:#ffffff; padding:14px 22px; border-radius:12px; font-size:13px; font-weight:800; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:99999; display:flex; align-items:center; gap:10px; transition:all 0.3s ease;';
    notif.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#34d399; font-size:18px;"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

// ── LOAD API DATA & URL PARAMS ──
async function initFlyerStudioPage() {
    // 1. Ambil Nama & HP Sales dari Session/LocalStorage
    try {
        const storedSales = localStorage.getItem('namaSales') || localStorage.getItem('sales_name') || localStorage.getItem('userName');
        const storedPhone = localStorage.getItem('noHp') || localStorage.getItem('sales_phone') || localStorage.getItem('userPhone');
        if (storedSales && document.getElementById('flyerSalesName')) document.getElementById('flyerSalesName').value = storedSales;
        if (storedPhone && document.getElementById('flyerSalesPhone')) document.getElementById('flyerSalesPhone').value = storedPhone;
    } catch(e) {}

    // 2. Fetch Catalog Mobil
    try {
        const res = await fetch('../api/api_kalkulator.php');
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.mobil) && data.mobil.length > 0) {
            allVehicles = data.mobil;
            const sel = document.getElementById('selectModelFlyer');
            if (sel) {
                sel.innerHTML = '';
                const groups = {};
                allVehicles.forEach(v => {
                    const modelGroup = v.model || 'LAINNYA';
                    if (!groups[modelGroup]) groups[modelGroup] = [];
                    groups[modelGroup].push(v);
                });

                for (const [grp, items] of Object.entries(groups)) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = grp;
                    items.forEach(it => {
                        const opt = document.createElement('option');
                        opt.value = it.value;
                        opt.textContent = it.label;
                        optgroup.appendChild(opt);
                    });
                    sel.appendChild(optgroup);
                }
            }
        }
    } catch(e) {
        console.warn('Catalog API offline/fallback:', e);
    }

    // 3. Parse URL Parameters jika dialihkan dari Kalkulator / Matchmaker
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const pModel = urlParams.get('model');
        const pHarga = urlParams.get('harga');
        const pDp = urlParams.get('dp') || urlParams.get('tdp');
        const pCicilan = urlParams.get('cicilan');
        const pRatio = urlParams.get('ratio');
        const pTheme = urlParams.get('theme');

        if (pHarga) {
            const h = parseInt(pHarga, 10);
            if (!isNaN(h) && h > 0 && document.getElementById('flyerHargaInput')) {
                document.getElementById('flyerHargaInput').value = numToFormatted(h);
            }
        }
        if (pDp) {
            const d = parseInt(pDp, 10);
            if (!isNaN(d) && d > 0 && document.getElementById('flyerTdpInput')) {
                document.getElementById('flyerTdpInput').value = `DP Mulai ${formatRp(d)}`;
            }
        }
        if (pCicilan) {
            const c = parseInt(pCicilan, 10);
            if (!isNaN(c) && c > 0 && document.getElementById('flyerCicilanInput')) {
                document.getElementById('flyerCicilanInput').value = `${formatRp(c)} / Bln`;
            }
        }
        if (pModel) {
            const sel = document.getElementById('selectModelFlyer');
            if (sel) {
                for (let i = 0; i < sel.options.length; i++) {
                    if (sel.options[i].text.toLowerCase().includes(pModel.toLowerCase())) {
                        sel.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        if (pRatio && (pRatio === '1:1' || pRatio === '9:16')) {
            flyerRatio = pRatio;
            const btnStory = document.getElementById('btnRatioStory');
            const btnSquare = document.getElementById('btnRatioSquare');
            if (btnStory) btnStory.classList.toggle('active', pRatio === '9:16');
            if (btnSquare) btnSquare.classList.toggle('active', pRatio === '1:1');
        }
        if (pTheme) {
            flyerTheme = pTheme;
        }
    } catch(e) {
        console.error('URL parse error:', e);
    }

    // 4. Render Awal
    setTimeout(() => {
        renderFlyerCanvas();
    }, 150);
}

document.addEventListener('DOMContentLoaded', initFlyerStudioPage);
