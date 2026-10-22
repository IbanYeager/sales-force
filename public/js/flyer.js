/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TUNAS TOYOTA - STUDIO FLYER & POSTER PROMO WHATSAPP (PRO STUDIO SUITE)
 *  Ultra-HD Canvas Engine: Multi-Car, Custom Backgrounds/Photos, Sales Avatar,
 *  Full Dynamic Typography & Live WhatsApp QR Code Generator
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ── GLOBAL STUDIO STATE ──
const studioState = {
    ratio: '9:16', // '9:16' (Story) | '1:1' (Feed)
    
    // Background Configuration
    bgMode: 'preset', // 'preset' | 'black' | 'white' | 'solid' | 'gradient' | 'image'
    bgPreset: 'crimson', // 'crimson' | 'navy' | 'gold' | 'emerald' | 'purple' | 'sunset' | 'pearl'
    bgSolidColor: '#090e18',
    bgGrad1: '#090e18',
    bgGrad2: '#7f1d1d',
    bgCustomImage: null, // DataURL
    bgOverlayAlpha: 0.45,
    bgOverlayColor: '#000000',
    bgBlur: 0,
    textColorTone: 'light', // 'light' (white text) | 'dark' (dark text for white bg)
    themeAccent: '#c8102e', // Accent highlight color

    // Multi-Car Configuration
    carLayoutMode: '1', // '1' | '2' | '3'
    cars: [
        {
            enabled: true,
            modelName: 'ALL NEW AVANZA 1.5 G CVT',
            imgSrc: '../assets/img/mobil/avanza.webp',
            customImg: null, // DataURL
            scale: 1.0,
            offsetX: 0,
            offsetY: 0
        },
        {
            enabled: false,
            modelName: 'ALL NEW VELOZ 1.5 Q CVT',
            imgSrc: '../assets/img/mobil/veloz.webp',
            customImg: null,
            scale: 0.9,
            offsetX: 120,
            offsetY: -30
        },
        {
            enabled: false,
            modelName: 'KIJANG INNOVA ZENIX 2.0 G CVT',
            imgSrc: '../assets/img/mobil/zenix.webp',
            customImg: null,
            scale: 0.85,
            offsetX: -120,
            offsetY: -30
        }
    ],

    // Typography & Content
    dealerName: 'TUNAS TOYOTA',
    dealerCity: 'BANDUNG · JAWA BARAT',
    badgeTop: 'DEALER RESMI TOYOTA',
    promoHeadline: 'SPECIAL PROMO BULAN INI',
    carTitle: 'ALL NEW AVANZA 1.5 G CVT',
    carSubtitle: 'HARGA OTR: Rp 263.500.000',
    
    finLabelLeft: 'TOTAL UANG MUKA / TDP',
    finValLeft: 'DP Mulai Rp 52.700.000',
    finLabelRight: 'ANGSURAN BULANAN',
    finValRight: 'Rp 7.427.772 / Bln',
    finSubtext: '• BISA TUKAR TAMBAH SEMUA MERK  • PROSES CEPAT & DIBANTU APPROVE',
    
    bonusHeading: 'BONUS & KEUNTUNGAN SPESIAL PEMBELIAN:',
    bonusItems: [
        '✓ Free Jasa Servis & Oli s/d 3 Thn (T-Care)',
        '✓ Kaca Film Lumar Bergaransi Resmi',
        '✓ Karpet Lembaran & Talang Air Original',
        '✓ APAR & Kotak P3K Resmi Toyota',
        '✓ Layanan Darurat Derek 24 Jam (Astra World)'
    ],
    footnote: '*Syarat & Ketentuan Berlaku. Unit Terbatas.',

    // Sales Profile & Avatar
    salesPhoto: null, // DataURL
    salesName: 'Official Sales Consultant',
    salesRole: 'Executive Sales Consultant',
    salesBranch: 'Tunas Toyota Kiara Condong',
    salesPhone: '081234567890'
};

let allVehicles = [];

// Helper Formatters
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

// Fallback Model Image Mapper
function getCarImageFallback(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('veloz')) return '../assets/img/mobil/veloz.webp';
    if (n.includes('avanza')) return '../assets/img/mobil/avanza.webp';
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
    if (n.includes('vellfire')) return '../assets/img/mobil/vellfire.webp';
    if (n.includes('voxy')) return '../assets/img/mobil/voxy.webp';
    if (n.includes('rangga')) return '../assets/img/mobil/rangga.webp';
    if (n.includes('hilux') || n.includes('double cabin')) return '../assets/img/mobil/double-cabin.webp';
    if (n.includes('hiace') || n.includes('hi-ace')) return '../assets/img/mobil/hi-ace-comm.webp';
    if (n.includes('camry')) return '../assets/img/mobil/camry.webp';
    if (n.includes('corolla cross') || n.includes('cross')) return '../assets/img/mobil/corolla-cross.webp';
    if (n.includes('altis')) return '../assets/img/mobil/corolla-altis.webp';
    if (n.includes('vios')) return '../assets/img/mobil/vios.webp';
    if (n.includes('land cruiser')) return '../assets/img/mobil/land-cruiser.webp';
    if (n.includes('bz4x')) return '../assets/img/mobil/bz4x.webp';
    if (n.includes('supra') || n.includes('gr-86') || n.includes('gr corolla')) return '../assets/img/mobil/gr-corolla.webp';
    return '../assets/img/mobil/avanza.webp';
}

// ── TAB SWITCHER ──
function switchFlyerTab(tabId, btn) {
    document.querySelectorAll('.flyer-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.flyer-tab-pane').forEach(p => p.classList.remove('active'));
    
    if (btn) {
        btn.classList.add('active');
        if (typeof btn.scrollIntoView === 'function') {
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
    const pane = document.getElementById(tabId);
    if (pane) pane.classList.add('active');
}

// ── RATIO SWITCHER ──
function setFlyerRatio(ratio, btn) {
    studioState.ratio = ratio;
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

// ── BACKGROUND HANDLERS ──
function setBgMode(mode, btn) {
    studioState.bgMode = mode;
    document.querySelectorAll('#bgPillSelector .pill-opt-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Toggle specific control containers
    const presetBox = document.getElementById('bgPresetBox');
    const solidBox = document.getElementById('bgSolidBox');
    const gradBox = document.getElementById('bgGradBox');
    const imageBox = document.getElementById('bgImageBox');

    if (presetBox) presetBox.style.display = (mode === 'preset') ? 'block' : 'none';
    if (solidBox) solidBox.style.display = (mode === 'solid') ? 'block' : 'none';
    if (gradBox) gradBox.style.display = (mode === 'gradient') ? 'block' : 'none';
    if (imageBox) imageBox.style.display = (mode === 'image') ? 'block' : 'none';

    // Auto set text tone for black/white presets
    if (mode === 'white') {
        studioState.textColorTone = 'dark';
        updateTonePills();
    } else if (mode === 'black') {
        studioState.textColorTone = 'light';
        updateTonePills();
    }

    renderFlyerCanvas();
}

function setBgPresetTheme(preset, el) {
    studioState.bgPreset = preset;
    studioState.bgMode = 'preset';
    document.querySelectorAll('#bgPresetBox .theme-pill-box').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');

    // Match theme accent color
    if (preset === 'crimson') studioState.themeAccent = '#c8102e';
    else if (preset === 'navy') studioState.themeAccent = '#1e3a8a';
    else if (preset === 'gold') studioState.themeAccent = '#d97706';
    else if (preset === 'emerald') studioState.themeAccent = '#059669';
    else if (preset === 'purple') studioState.themeAccent = '#7c3aed';
    else if (preset === 'sunset') studioState.themeAccent = '#ea580c';
    else if (preset === 'pearl') {
        studioState.themeAccent = '#0284c7';
        studioState.textColorTone = 'dark';
        updateTonePills();
    }

    syncThemeColorInput();
    renderFlyerCanvas();
}

function setTextColorTone(tone, btn) {
    studioState.textColorTone = tone;
    document.querySelectorAll('#tonePillSelector .pill-opt-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderFlyerCanvas();
}

function updateTonePills() {
    const btnLight = document.getElementById('btnToneLight');
    const btnDark = document.getElementById('btnToneDark');
    if (btnLight) btnLight.classList.toggle('active', studioState.textColorTone === 'light');
    if (btnDark) btnDark.classList.toggle('active', studioState.textColorTone === 'dark');
}

function onCustomColorChange() {
    const solidInp = document.getElementById('inputBgSolid');
    if (solidInp) studioState.bgSolidColor = solidInp.value;

    const g1 = document.getElementById('inputBgGrad1');
    const g2 = document.getElementById('inputBgGrad2');
    if (g1) studioState.bgGrad1 = g1.value;
    if (g2) studioState.bgGrad2 = g2.value;

    const accentInp = document.getElementById('inputThemeAccent');
    if (accentInp) studioState.themeAccent = accentInp.value;

    renderFlyerCanvas();
}

function syncThemeColorInput() {
    const accentInp = document.getElementById('inputThemeAccent');
    if (accentInp) accentInp.value = studioState.themeAccent;
}

// Background Image Upload
function handleBgImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        studioState.bgCustomImage = e.target.result;
        studioState.bgMode = 'image';
        
        const previewRow = document.getElementById('bgImageThumbRow');
        const previewImg = document.getElementById('bgImageThumbImg');
        if (previewRow && previewImg) {
            previewImg.src = e.target.result;
            previewRow.style.display = 'flex';
        }
        
        // Auto activate image tab in pills
        setBgMode('image', document.getElementById('pillModeImage'));
        renderFlyerCanvas();
    };
    reader.readAsDataURL(file);
}

function removeBgImage() {
    studioState.bgCustomImage = null;
    const previewRow = document.getElementById('bgImageThumbRow');
    if (previewRow) previewRow.style.display = 'none';
    const fileInput = document.getElementById('bgFileInput');
    if (fileInput) fileInput.value = '';
    
    setBgMode('preset', document.getElementById('pillModePreset'));
    renderFlyerCanvas();
}

// ── MULTI-CAR HANDLERS ──
function setCarLayoutMode(mode, btn) {
    studioState.carLayoutMode = mode;
    document.querySelectorAll('#carLayoutPills .pill-opt-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    studioState.cars[0].enabled = true;
    studioState.cars[1].enabled = (mode === '2' || mode === '3');
    studioState.cars[2].enabled = (mode === '3');

    const slot2Box = document.getElementById('carSlot2Box');
    const slot3Box = document.getElementById('carSlot3Box');
    if (slot2Box) slot2Box.style.display = (mode === '2' || mode === '3') ? 'block' : 'none';
    if (slot3Box) slot3Box.style.display = (mode === '3') ? 'block' : 'none';

    renderFlyerCanvas();
}

function onCarSlotModelChange(slotIdx) {
    const sel = document.getElementById(`selectCarSlot${slotIdx}`);
    if (!sel || !sel.value) return;

    const parts = sel.value.split('|');
    const otr = parseInt(parts[0], 10) || 0;
    const modelName = sel.options[sel.selectedIndex].text.replace(/\s*\(Rp[^)]*\)/i, '').trim();

    studioState.cars[slotIdx].modelName = modelName;
    studioState.cars[slotIdx].imgSrc = getCarImageFallback(modelName);
    studioState.cars[slotIdx].customImg = null; // Reset custom image on dropdown change

    // Clear thumb preview
    const thumbRow = document.getElementById(`carSlot${slotIdx}ThumbRow`);
    if (thumbRow) thumbRow.style.display = 'none';

    // If Slot 0 (Main Car), also auto-fill title & price if desired
    if (slotIdx === 0) {
        const titleInp = document.getElementById('flyerCarTitleInput');
        const subInp = document.getElementById('flyerCarSubInput');
        if (titleInp) {
            titleInp.value = modelName;
            studioState.carTitle = modelName;
        }
        if (subInp && otr > 0) {
            subInp.value = `HARGA OTR: ${formatRp(otr)}`;
            studioState.carSubtitle = `HARGA OTR: ${formatRp(otr)}`;
        }
    }

    renderFlyerCanvas();
}

function handleCarSlotUpload(slotIdx, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        studioState.cars[slotIdx].customImg = e.target.result;
        
        const thumbRow = document.getElementById(`carSlot${slotIdx}ThumbRow`);
        const thumbImg = document.getElementById(`carSlot${slotIdx}ThumbImg`);
        if (thumbRow && thumbImg) {
            thumbImg.src = e.target.result;
            thumbRow.style.display = 'flex';
        }
        renderFlyerCanvas();
    };
    reader.readAsDataURL(file);
}

function removeCarSlotUpload(slotIdx) {
    studioState.cars[slotIdx].customImg = null;
    const thumbRow = document.getElementById(`carSlot${slotIdx}ThumbRow`);
    if (thumbRow) thumbRow.style.display = 'none';
    const fileInp = document.getElementById(`carSlot${slotIdx}FileInput`);
    if (fileInp) fileInp.value = '';
    renderFlyerCanvas();
}

function updateCarSlotScale(slotIdx, val) {
    studioState.cars[slotIdx].scale = parseFloat(val) || 1.0;
    const badge = document.getElementById(`carSlot${slotIdx}ScaleBadge`);
    if (badge) badge.textContent = Math.round(studioState.cars[slotIdx].scale * 100) + '%';
    renderFlyerCanvas();
}

function updateCarSlotOffsetX(slotIdx, xVal) {
    studioState.cars[slotIdx].offsetX = parseInt(xVal, 10) || 0;
    const badge = document.getElementById(`carSlot${slotIdx}OffsetXBadge`);
    if (badge) badge.textContent = (studioState.cars[slotIdx].offsetX > 0 ? '+' : '') + studioState.cars[slotIdx].offsetX + 'px';
    renderFlyerCanvas();
}

function updateCarSlotOffsetY(slotIdx, yVal) {
    studioState.cars[slotIdx].offsetY = parseInt(yVal, 10) || 0;
    const badge = document.getElementById(`carSlot${slotIdx}OffsetYBadge`);
    if (badge) badge.textContent = (studioState.cars[slotIdx].offsetY > 0 ? '+' : '') + studioState.cars[slotIdx].offsetY + 'px';
    renderFlyerCanvas();
}

function resetCarSlotPosition(slotIdx) {
    studioState.cars[slotIdx].offsetX = 0;
    studioState.cars[slotIdx].offsetY = 0;
    studioState.cars[slotIdx].scale = (slotIdx === 0 ? 1.0 : (slotIdx === 1 ? 0.9 : 0.85));
    
    const scaleInp = document.getElementById(`carSlot${slotIdx}ScaleInput`);
    const scaleBadge = document.getElementById(`carSlot${slotIdx}ScaleBadge`);
    if (scaleInp) scaleInp.value = studioState.cars[slotIdx].scale;
    if (scaleBadge) scaleBadge.textContent = Math.round(studioState.cars[slotIdx].scale * 100) + '%';

    const xInp = document.getElementById(`carSlot${slotIdx}OffsetXInput`);
    const xBadge = document.getElementById(`carSlot${slotIdx}OffsetXBadge`);
    if (xInp) xInp.value = 0;
    if (xBadge) xBadge.textContent = '0px';

    const yInp = document.getElementById(`carSlot${slotIdx}OffsetYInput`);
    const yBadge = document.getElementById(`carSlot${slotIdx}OffsetYBadge`);
    if (yInp) yInp.value = 0;
    if (yBadge) yBadge.textContent = '0px';

    renderFlyerCanvas();
}

// ── SALES AVATAR PHOTO HANDLER ──
function handleSalesPhotoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        studioState.salesPhoto = e.target.result;
        
        const previewImg = document.getElementById('salesAvatarPreviewImg');
        const fallbackBox = document.getElementById('salesAvatarFallback');
        const btnRemove = document.getElementById('btnRemoveSalesPhoto');
        
        if (previewImg) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        }
        if (fallbackBox) fallbackBox.style.display = 'none';
        if (btnRemove) btnRemove.style.display = 'inline-flex';

        renderFlyerCanvas();
    };
    reader.readAsDataURL(file);
}

function removeSalesPhoto() {
    studioState.salesPhoto = null;
    const previewImg = document.getElementById('salesAvatarPreviewImg');
    const fallbackBox = document.getElementById('salesAvatarFallback');
    const btnRemove = document.getElementById('btnRemoveSalesPhoto');
    const fileInput = document.getElementById('salesPhotoInput');

    if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
    if (fallbackBox) fallbackBox.style.display = 'flex';
    if (btnRemove) btnRemove.style.display = 'none';
    if (fileInput) fileInput.value = '';

    renderFlyerCanvas();
}

// ── TEXT CONTENT SYNC FROM INPUTS ──
function syncInputsToState() {
    const getVal = (id, def) => {
        const el = document.getElementById(id);
        return el ? el.value : def;
    };

    studioState.dealerName = getVal('flyerDealerName', studioState.dealerName);
    studioState.dealerCity = getVal('flyerDealerCity', studioState.dealerCity);
    studioState.badgeTop = getVal('flyerBadgeTop', studioState.badgeTop);
    studioState.promoHeadline = getVal('flyerHeadlineInput', studioState.promoHeadline);
    studioState.carTitle = getVal('flyerCarTitleInput', studioState.carTitle);
    studioState.carSubtitle = getVal('flyerCarSubInput', studioState.carSubtitle);
    
    studioState.finLabelLeft = getVal('flyerFinLabelLeft', studioState.finLabelLeft);
    studioState.finValLeft = getVal('flyerTdpInput', studioState.finValLeft);
    studioState.finLabelRight = getVal('flyerFinLabelRight', studioState.finLabelRight);
    studioState.finValRight = getVal('flyerCicilanInput', studioState.finValRight);
    studioState.finSubtext = getVal('flyerFinSubtext', studioState.finSubtext);
    
    studioState.bonusHeading = getVal('flyerBonusHeading', studioState.bonusHeading);
    
    // Bonus lines from textarea
    const bonusArea = document.getElementById('flyerBonusTextarea');
    if (bonusArea) {
        studioState.bonusItems = bonusArea.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }
    
    studioState.footnote = getVal('flyerFootnote', studioState.footnote);

    studioState.salesName = getVal('flyerSalesName', studioState.salesName);
    studioState.salesRole = getVal('flyerSalesRole', studioState.salesRole);
    studioState.salesBranch = getVal('flyerSalesBranch', studioState.salesBranch);
    studioState.salesPhone = getVal('flyerSalesPhone', studioState.salesPhone);
}

function applyHeadlinePreset(txt) {
    const input = document.getElementById('flyerHeadlineInput');
    if (input) {
        input.value = txt;
        studioState.promoHeadline = txt;
        renderFlyerCanvas();
    }
}

// ── QR CODE GENERATOR ──
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
        console.warn('QR generation error:', e);
    }
    return null;
}

// ── IMAGE LOADER PROMISE ──
function loadImage(src) {
    return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn('Image load failed for:', src);
            resolve(null);
        };
        img.src = src;
    });
}

// ── CORE CANVAS RENDERING ENGINE ──
async function renderFlyerCanvas() {
    const canvas = document.getElementById('flyerCanvas');
    const previewImg = document.getElementById('flyerCanvasPreviewImg');
    if (!canvas) return;

    syncInputsToState();

    const ctx = canvas.getContext('2d');
    const isStory = studioState.ratio === '9:16';
    const W = 1080;
    const H = isStory ? 1920 : 1080;
    canvas.width = W;
    canvas.height = H;

    // Generate WhatsApp QR Code Element
    const waClean = studioState.salesPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const waTarget = `https://wa.me/${waClean}?text=${encodeURIComponent(`Halo ${studioState.salesName}, saya melihat poster promo Toyota ${studioState.carTitle}. Boleh minta info simulasi & diskon terbaiknya?`)}`;
    const qrElement = generateFlyerQr(waTarget);

    // Pre-load all necessary images
    const bgImgPromise = studioState.bgCustomImage ? loadImage(studioState.bgCustomImage) : Promise.resolve(null);
    const salesPhotoPromise = studioState.salesPhoto ? loadImage(studioState.salesPhoto) : Promise.resolve(null);
    
    // Car Images Promise
    const carPromises = studioState.cars.map(c => {
        if (!c.enabled) return Promise.resolve(null);
        return loadImage(c.customImg || c.imgSrc);
    });

    const [loadedBgImg, loadedSalesPhoto, ...loadedCars] = await Promise.all([
        bgImgPromise,
        salesPhotoPromise,
        ...carPromises
    ]);

    // ── 1. DRAW BACKGROUND ──
    const isLightText = studioState.textColorTone === 'light';

    if (studioState.bgMode === 'image' && loadedBgImg) {
        // Draw custom image fill (cover)
        ctx.save();
        if (studioState.bgBlur > 0) {
            ctx.filter = `blur(${studioState.bgBlur}px)`;
        }
        const imgRatio = loadedBgImg.width / loadedBgImg.height;
        const canvasRatio = W / H;
        let dw, dh, dx, dy;
        if (imgRatio > canvasRatio) {
            dh = H;
            dw = H * imgRatio;
            dx = (W - dw) / 2;
            dy = 0;
        } else {
            dw = W;
            dh = W / imgRatio;
            dx = 0;
            dy = (H - dh) / 2;
        }
        ctx.drawImage(loadedBgImg, dx, dy, dw, dh);
        ctx.restore();

        // Dark or light overlay
        ctx.fillStyle = studioState.bgOverlayColor;
        ctx.globalAlpha = studioState.bgOverlayAlpha;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1.0;
    } else if (studioState.bgMode === 'white') {
        // Pure White / Minimalist Clean
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, W, H);
        
        // Subtle top gradient accent
        const topG = ctx.createLinearGradient(0, 0, 0, 300);
        topG.addColorStop(0, '#e2e8f0');
        topG.addColorStop(1, '#f8fafc');
        ctx.fillStyle = topG;
        ctx.fillRect(0, 0, W, 300);
    } else if (studioState.bgMode === 'black') {
        // Deep Black Carbon
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, W, H);
        
        const topG = ctx.createRadialGradient(W / 2, 400, 50, W / 2, 400, 600);
        topG.addColorStop(0, 'rgba(30,41,59,0.4)');
        topG.addColorStop(1, 'rgba(5,7,12,0)');
        ctx.fillStyle = topG;
        ctx.fillRect(0, 0, W, H);
    } else if (studioState.bgMode === 'solid') {
        ctx.fillStyle = studioState.bgSolidColor;
        ctx.fillRect(0, 0, W, H);
    } else if (studioState.bgMode === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, studioState.bgGrad1);
        grad.addColorStop(1, studioState.bgGrad2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    } else {
        // Preset Gradients
        let grad;
        if (studioState.bgPreset === 'navy') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#020617');
            grad.addColorStop(0.35, '#0f172a');
            grad.addColorStop(0.7, '#1e3a8a');
            grad.addColorStop(1, '#020617');
        } else if (studioState.bgPreset === 'gold') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#09090b');
            grad.addColorStop(0.35, '#1c1917');
            grad.addColorStop(0.75, '#451a03');
            grad.addColorStop(1, '#09090b');
        } else if (studioState.bgPreset === 'emerald') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#022c22');
            grad.addColorStop(0.35, '#064e3b');
            grad.addColorStop(0.7, '#047857');
            grad.addColorStop(1, '#022c22');
        } else if (studioState.bgPreset === 'purple') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#0f051d');
            grad.addColorStop(0.35, '#2e1065');
            grad.addColorStop(0.75, '#581c87');
            grad.addColorStop(1, '#0f051d');
        } else if (studioState.bgPreset === 'sunset') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#1c0a00');
            grad.addColorStop(0.4, '#7c2d12');
            grad.addColorStop(0.8, '#c2410c');
            grad.addColorStop(1, '#1c0a00');
        } else if (studioState.bgPreset === 'pearl') {
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#f1f5f9');
            grad.addColorStop(0.5, '#e2e8f0');
            grad.addColorStop(1, '#cbd5e1');
        } else {
            // Crimson Toyota Red (Default)
            grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#090e18');
            grad.addColorStop(0.3, '#7f1d1d');
            grad.addColorStop(0.7, '#991b1b');
            grad.addColorStop(1, '#090e18');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    // Dynamic Geometry Mesh Pattern
    ctx.save();
    ctx.globalAlpha = isLightText ? 0.06 : 0.04;
    ctx.strokeStyle = isLightText ? '#ffffff' : '#0f172a';
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

    // ── 2. TOP DEALER BRANDING BAR ──
    const topMargin = isStory ? 80 : 50;
    const primaryTextColor = isLightText ? '#ffffff' : '#0f172a';
    const secondaryTextColor = isLightText ? '#94a3b8' : '#475569';

    // Dealer Name
    ctx.fillStyle = primaryTextColor;
    ctx.font = '900 38px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(studioState.dealerName.toUpperCase(), 70, topMargin + 40);

    // Dealer City Subtitle
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 17px "Inter", sans-serif';
    ctx.fillText(studioState.dealerCity.toUpperCase(), 70, topMargin + 70);

    // Right Badge
    ctx.save();
    ctx.fillStyle = isLightText ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.roundRect(W - 340, topMargin + 10, 270, 48, 24);
    ctx.fill();
    ctx.strokeStyle = isLightText ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.12)';
    ctx.stroke();
    
    ctx.fillStyle = studioState.themeAccent;
    ctx.font = '800 15px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(studioState.badgeTop.toUpperCase(), W - 205, topMargin + 40);
    ctx.restore();

    // ── 3. PROMO HEADLINE PILL ──
    const headY = isStory ? 230 : 155;
    ctx.save();
    ctx.textAlign = 'center';

    // Glow effect behind headline
    ctx.shadowColor = studioState.themeAccent;
    ctx.shadowBlur = 24;
    ctx.fillStyle = studioState.themeAccent;
    ctx.beginPath();
    ctx.roundRect(W / 2 - 300, headY, 600, 52, 26);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★  ${studioState.promoHeadline.toUpperCase()}  ★`, W / 2, headY + 34);

    // ── 4. CAR MODEL TITLE & SUBTITLE ──
    const titleY = isStory ? 355 : 255;
    ctx.fillStyle = primaryTextColor;
    ctx.font = '900 46px "Outfit", sans-serif';
    ctx.textAlign = 'center';

    if (studioState.carTitle.length > 25) {
        ctx.font = '900 36px "Outfit", sans-serif';
    }
    ctx.fillText(studioState.carTitle.toUpperCase(), W / 2, titleY);

    ctx.fillStyle = studioState.themeAccent;
    ctx.font = '800 28px "Inter", sans-serif';
    ctx.fillText(studioState.carSubtitle, W / 2, titleY + 45);

    // ── 5. CAR PHOTO RENDERING (MULTI-CAR LAYOUT) ──
    const carBaseY = isStory ? 440 : 305;

    if (studioState.carLayoutMode === '1') {
        // Single Car: Perfectly Centered
        const carImg = loadedCars[0];
        if (carImg) {
            const scale = studioState.cars[0].scale;
            const imgW = (isStory ? 780 : 550) * scale;
            const imgH = (isStory ? 450 : 315) * scale;
            const imgX = (W - imgW) / 2 + studioState.cars[0].offsetX;
            const imgY = carBaseY + studioState.cars[0].offsetY;

            ctx.drawImage(carImg, imgX, imgY, imgW, imgH);
        }
    } else if (studioState.carLayoutMode === '2') {
        // 2 Cars (Duo Promo: Car 2 Rear Right, Car 1 Front Left - Balanced & Inset)
        const car1 = loadedCars[0];
        const car2 = loadedCars[1];

        // Draw Car 2 (Behind on Right, insetting safely from right edge)
        if (car2) {
            const scale2 = studioState.cars[1].scale;
            const w2 = (isStory ? 600 : 430) * scale2;
            const h2 = (isStory ? 350 : 250) * scale2;
            const x2 = (W - w2 - 50) + studioState.cars[1].offsetX;
            const y2 = carBaseY - 20 + studioState.cars[1].offsetY;

            ctx.drawImage(car2, x2, y2, w2, h2);
        }

        // Draw Car 1 (Front on Left, insetting safely from left edge)
        if (car1) {
            const scale1 = studioState.cars[0].scale;
            const w1 = (isStory ? 670 : 480) * scale1;
            const h1 = (isStory ? 390 : 275) * scale1;
            const x1 = 50 + studioState.cars[0].offsetX;
            const y1 = carBaseY + 45 + studioState.cars[0].offsetY;

            ctx.drawImage(car1, x1, y1, w1, h1);
        }
    } else if (studioState.carLayoutMode === '3') {
        // 3 Cars (Trio Showcase: Balanced Podium V-Formation)
        const car1 = loadedCars[0];
        const car2 = loadedCars[1];
        const car3 = loadedCars[2];

        // Car 3 (Left Rear)
        if (car3) {
            const s3 = studioState.cars[2].scale;
            const w3 = (isStory ? 510 : 365) * s3;
            const h3 = (isStory ? 295 : 210) * s3;
            const x3 = 35 + studioState.cars[2].offsetX;
            const y3 = carBaseY - 30 + studioState.cars[2].offsetY;

            ctx.drawImage(car3, x3, y3, w3, h3);
        }

        // Car 2 (Right Rear)
        if (car2) {
            const s2 = studioState.cars[1].scale;
            const w2 = (isStory ? 510 : 365) * s2;
            const h2 = (isStory ? 295 : 210) * s2;
            const x2 = (W - w2 - 35) + studioState.cars[1].offsetX;
            const y2 = carBaseY - 30 + studioState.cars[1].offsetY;

            ctx.drawImage(car2, x2, y2, w2, h2);
        }

        // Car 1 (Center Front)
        if (car1) {
            const s1 = studioState.cars[0].scale;
            const w1 = (isStory ? 670 : 480) * s1;
            const h1 = (isStory ? 390 : 275) * s1;
            const x1 = (W - w1) / 2 + studioState.cars[0].offsetX;
            const y1 = carBaseY + 45 + studioState.cars[0].offsetY;

            ctx.drawImage(car1, x1, y1, w1, h1);
        }
    }

    // ── 6. FINANCIAL HIGHLIGHT BADGE (TDP & CICILAN) ──
    const finY = isStory ? 940 : 640;
    const finW = W - 140;
    const finH = isStory ? 140 : 120;
    const finX = 70;

    ctx.save();
    ctx.fillStyle = isLightText ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.roundRect(finX, finY, finW, finH, 20);
    ctx.fill();
    ctx.strokeStyle = studioState.themeAccent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Split Columns
    ctx.textAlign = 'center';
    ctx.fillStyle = isLightText ? '#cbd5e1' : '#64748b';
    ctx.font = '700 13px "Inter", sans-serif';
    ctx.fillText(studioState.finLabelLeft.toUpperCase(), finX + finW * 0.25, finY + 38);

    ctx.fillStyle = studioState.themeAccent;
    ctx.font = `900 ${isStory ? 28 : 24}px "Outfit", sans-serif`;
    ctx.fillText(studioState.finValLeft, finX + finW * 0.25, finY + (isStory ? 80 : 75));

    // Divider Line
    ctx.strokeStyle = isLightText ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(finX + finW * 0.5, finY + 20);
    ctx.lineTo(finX + finW * 0.5, finY + finH - 20);
    ctx.stroke();

    // Right Column: Angsuran
    ctx.fillStyle = isLightText ? '#cbd5e1' : '#64748b';
    ctx.font = '700 13px "Inter", sans-serif';
    ctx.fillText(studioState.finLabelRight.toUpperCase(), finX + finW * 0.75, finY + 38);

    ctx.fillStyle = isLightText ? '#ffffff' : '#0f172a';
    ctx.font = `900 ${isStory ? 28 : 24}px "Outfit", sans-serif`;
    ctx.fillText(studioState.finValRight, finX + finW * 0.75, finY + (isStory ? 80 : 75));

    // Subtext at bottom of badge
    ctx.fillStyle = isLightText ? '#94a3b8' : '#64748b';
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillText(studioState.finSubtext, finX + finW / 2, finY + finH - 14);
    ctx.restore();

    // ── 7. BONUS & BENEFIT CHECKLIST (STORY 9:16 ONLY) ──
    if (isStory && studioState.bonusItems.length > 0) {
        const bonusY = 1130;
        ctx.textAlign = 'left';
        ctx.fillStyle = studioState.themeAccent;
        ctx.font = '800 15px "Inter", sans-serif';
        ctx.fillText(studioState.bonusHeading.toUpperCase(), 80, bonusY);

        let curY = bonusY + 45;
        studioState.bonusItems.slice(0, 5).forEach((b) => {
            ctx.save();
            ctx.fillStyle = isLightText ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)';
            ctx.beginPath();
            ctx.roundRect(80, curY - 26, W - 160, 42, 10);
            ctx.fill();
            ctx.strokeStyle = isLightText ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
            ctx.stroke();

            ctx.fillStyle = isLightText ? '#f8fafc' : '#1e293b';
            ctx.font = '700 16px "Inter", sans-serif';
            ctx.fillText(b, 100, curY);
            ctx.restore();
            curY += 54;
        });
    }

    // ── 8. FOOTER SALES CARD (WITH USER'S OWN PHOTO AVATAR) ──
    const footH = isStory ? 240 : 180;
    const footY = H - footH - (isStory ? 60 : 35);
    const footW = W - 140;
    const footX = 70;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(footX, footY, footW, footH, 24);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 22;

    // Sales Avatar Geometry
    const hasPhoto = Boolean(loadedSalesPhoto);
    const avRadius = isStory ? 52 : 40;
    const avX = footX + 24 + avRadius;
    const avY = footY + (footH / 2) - (isStory ? 10 : 0);

    if (hasPhoto) {
        // Draw Circular Clipped Sales Photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(avX, avY, avRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(loadedSalesPhoto, avX - avRadius, avY - avRadius, avRadius * 2, avRadius * 2);
        ctx.restore();

        // Outer Ring for Avatar
        ctx.beginPath();
        ctx.arc(avX, avY, avRadius, 0, Math.PI * 2);
        ctx.strokeStyle = studioState.themeAccent;
        ctx.lineWidth = 3.5;
        ctx.stroke();
    } else {
        // Default Avatar Circle with Initial
        ctx.beginPath();
        ctx.arc(avX, avY, avRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1f5f9';
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = `900 ${isStory ? 36 : 28}px "Outfit", sans-serif`;
        const initial = (studioState.salesName || 'S').trim().charAt(0).toUpperCase();
        ctx.fillText(initial, avX, avY + (isStory ? 13 : 10));
    }

    // Text Alignment (shifts right to accommodate the avatar)
    const textStartX = avX + avRadius + 20;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 ${isStory ? 28 : 22}px "Outfit", sans-serif`;
    ctx.fillText(studioState.salesName, textStartX, footY + (isStory ? 60 : 48));

    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px "Inter", sans-serif';
    ctx.fillText(`${studioState.salesRole} · ${studioState.salesBranch}`, textStartX, footY + (isStory ? 95 : 76));

    // WhatsApp Pill Button
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(textStartX, footY + (isStory ? 122 : 98), isStory ? 310 : 240, isStory ? 52 : 42, 26);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStory ? 18 : 14}px "Inter", sans-serif`;
    ctx.fillText(`✆ WA: ${studioState.salesPhone}`, textStartX + 20, footY + (isStory ? 155 : 124));

    if (isStory) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 12px "Inter", sans-serif';
        ctx.fillText(studioState.footnote, textStartX, footY + 210);
    }

    // QR Code on Far Right
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

    // ── 9. UPDATE LIVE PREVIEW IMG ELEMENT ──
    if (previewImg) {
        previewImg.src = canvas.toDataURL('image/png');
    }

    // ── 10. SYNC CAPTION TEXTBOX ──
    updateLiveCaptionText();
}

function updateLiveCaptionText() {
    const box = document.getElementById('liveCaptionPreviewText');
    if (!box) return;

    const caption = `🔥 *PROMO RESMI TOYOTA BANDUNG - ${studioState.carTitle.toUpperCase()}* 🔥\n\n` +
        `Dapatkan penawaran terbaik bulan ini dengan kemudahan:\n` +
        `💎 *${studioState.finValLeft}*\n` +
        `📉 *Cicilan Mulai: ${studioState.finValRight}*\n` +
        `⏳ Tenor Panjang s/d 5-6 Tahun | Bunga Spesial\n\n` +
        `🎁 *Bonus Spesial Pembelian:*\n` +
        studioState.bonusItems.map(b => `${b}`).join('\n') + '\n\n' +
        `🔄 *Menerima Tukar Tambah (Trade-In) semua merk dengan harga tertinggi!*\n` +
        `Data dibantu s/d serah terima unit di rumah Anda.\n\n` +
        `Hubungi:\n` +
        `👤 *${studioState.salesName}*\n` +
        `📱 Telp/WA: ${studioState.salesPhone}\n` +
        `📍 *${studioState.salesBranch}*`;

    box.textContent = caption;
}

// ── EXPORT ACTIONS ──
function downloadFlyerImage(format = 'png') {
    const canvas = document.getElementById('flyerCanvas');
    if (!canvas) return;

    const carClean = studioState.carTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.download = `Flyer_Promo_${carClean}_${studioState.ratio === '9:16' ? 'Story' : 'Square'}_${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 1.0);
    link.click();
    showToast('✓ Poster berhasil diunduh dalam resolusi Ultra HD (1080p)!');
}

function shareFlyerToWhatsApp() {
    updateLiveCaptionText();
    const box = document.getElementById('liveCaptionPreviewText');
    const caption = box ? box.textContent : '';
    const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
    window.open(waUrl, '_blank');
}

function copyFlyerPromoCaption() {
    updateLiveCaptionText();
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

// ── LOAD API DATA & INITIALIZATION ──
async function initFlyerStudioPage() {
    // 1. Ambil Nama & HP Sales dari Session/LocalStorage
    try {
        const storedSales = localStorage.getItem('namaSales') || localStorage.getItem('sales_name') || localStorage.getItem('userName');
        const storedPhone = localStorage.getItem('noHp') || localStorage.getItem('sales_phone') || localStorage.getItem('userPhone');
        if (storedSales) {
            studioState.salesName = storedSales;
            const el = document.getElementById('flyerSalesName');
            if (el) el.value = storedSales;
        }
        if (storedPhone) {
            studioState.salesPhone = storedPhone;
            const el = document.getElementById('flyerSalesPhone');
            if (el) el.value = storedPhone;
        }
    } catch(e) {}

    // 2. Fetch Catalog Mobil
    try {
        const res = await fetch('../api/api_kalkulator.php');
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.mobil) && data.mobil.length > 0) {
            allVehicles = data.mobil;
            [0, 1, 2].forEach(slotIdx => {
                const sel = document.getElementById(`selectCarSlot${slotIdx}`);
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
            });
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
            if (!isNaN(h) && h > 0) {
                studioState.carSubtitle = `HARGA OTR: ${formatRp(h)}`;
                const subInp = document.getElementById('flyerCarSubInput');
                if (subInp) subInp.value = studioState.carSubtitle;
            }
        }
        if (pDp) {
            const d = parseInt(pDp, 10);
            if (!isNaN(d) && d > 0) {
                studioState.finValLeft = `DP Mulai ${formatRp(d)}`;
                const dpInp = document.getElementById('flyerTdpInput');
                if (dpInp) dpInp.value = studioState.finValLeft;
            }
        }
        if (pCicilan) {
            const c = parseInt(pCicilan, 10);
            if (!isNaN(c) && c > 0) {
                studioState.finValRight = `${formatRp(c)} / Bln`;
                const cicInp = document.getElementById('flyerCicilanInput');
                if (cicInp) cicInp.value = studioState.finValRight;
            }
        }
        if (pModel) {
            studioState.carTitle = pModel;
            studioState.cars[0].modelName = pModel;
            studioState.cars[0].imgSrc = getCarImageFallback(pModel);
            const titleInp = document.getElementById('flyerCarTitleInput');
            if (titleInp) titleInp.value = pModel;
        }
        if (pRatio && (pRatio === '1:1' || pRatio === '9:16')) {
            studioState.ratio = pRatio;
            const btnStory = document.getElementById('btnRatioStory');
            const btnSquare = document.getElementById('btnRatioSquare');
            if (btnStory) btnStory.classList.toggle('active', pRatio === '9:16');
            if (btnSquare) btnSquare.classList.toggle('active', pRatio === '1:1');
        }
        if (pTheme) {
            studioState.bgPreset = pTheme;
        }
    } catch(e) {
        console.error('URL parse error:', e);
    }

    // 4. Initial Render
    setTimeout(() => {
        renderFlyerCanvas();
    }, 150);
}

// ── FULLSCREEN ZOOM MODAL HANDLERS ──
function openFlyerZoomModal() {
    const previewImg = document.getElementById('flyerCanvasPreviewImg');
    const modalImg = document.getElementById('flyerZoomModalImg');
    const modal = document.getElementById('flyerZoomModal');
    if (previewImg && modalImg && modal) {
        if (!previewImg.src || previewImg.src === '') {
            renderFlyerCanvas();
        }
        modalImg.src = previewImg.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeFlyerZoomModal(event) {
    const modal = document.getElementById('flyerZoomModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

window.openFlyerZoomModal = openFlyerZoomModal;
window.closeFlyerZoomModal = closeFlyerZoomModal;

document.addEventListener('DOMContentLoaded', initFlyerStudioPage);
