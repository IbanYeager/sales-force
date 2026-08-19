let orderDetails = {
    model: '',
    item: '',
    priceRtco: '',
    priceTpos: '',
    priceTls: '',
    partNumber: '',
    applicableGrade: ''
};

function getPackageParts(item) {
  if (!item || !item.name) return [];
  const name = item.name.toLowerCase();
  const pn = (item.part_number || item.partNumber || '').toUpperCase();

  // Innova Zenix
  if (name.includes('cross over package') || (pn.includes('AC') && pn.includes('AD') && name.includes('pkg a'))) {
    return ['Upper Grill Ornament Modelista', 'Black Outer Mirror Cover', 'Multifunction Box', 'Cargo Net', 'Spare tire cover', 'Premium Horn'];
  }
  if (name.includes('compact package') || (pn.includes('BC') && pn.includes('BD'))) {
    return ['Multifunction Box', 'Storage Organizer', 'Black Outer Mirror Cover', 'Spare tire cover', 'Premium Horn'];
  }
  if (name.includes('package e') && (pn.includes('EA') || name.includes('zenix'))) {
    return ['Seat Cover Private Spec', 'Premium Horn'];
  }
  if (name.includes('lite package') && (name.includes('pkg f') || pn.includes('FC'))) {
    return ['Multifunction Box'];
  }
  if (name.includes('smart car fragrance package 1 scent') || (pn.includes('GA') && pn.includes('GB'))) {
    return ['Multifunction Box', 'Air Fragrance Device Set Zenix', 'Scents NTCO Amber Haven'];
  }

  // Innova Reborn
  if (name.includes('luxury package') || (name.includes('pkg d') && pn.includes('DB'))) {
    return ['Rear Bumper Ornament', 'Rear Bumper Step Guard', 'Premium Horn'];
  }
  if (name.includes('full package') && (name.includes('pkg f') || pn.includes('FA'))) {
    return ['Spare Tire Cover', 'Rear Bumper Ornament', 'Rear Bumper Step Guard', 'Premium Horn'];
  }
  if (name.includes('lite package') && (name.includes('pkg h') || pn.includes('HA'))) {
    return ['Spare Tire Cover'];
  }

  // Calya
  if (name.includes('lux package') && (name.includes('pkg a') || pn === 'AA')) {
    return ['Side Visor', 'Console Box', 'Cargo Net', 'Mud Guard'];
  }
  if (name.includes('stylish package') || (name.includes('pkg c') && pn === 'CA')) {
    return ['Side Visor', 'Foglamp Ornament', 'Door Handle Protector'];
  }
  if (name.includes('primo package') || (name.includes('pkg d') && pn === 'DA')) {
    return ['Cargo Net', 'Mud Guard'];
  }
  if (name.includes('seat cover package') && (name.includes('pkg e') || pn === 'EB')) {
    return ['Seat Cover Value Spec'];
  }
  if (name.includes('lite package') && (name.includes('pkg f') && (pn.includes('FA') || pn.includes('FB')))) {
    return ['Cargo Net'];
  }
  if (name.includes('functional package') || name.includes('pkg g')) {
    return ['Side Visor', 'Console Box', 'Back Camera', 'Mud Guard'];
  }

  // Fortuner
  if (name.includes('style package') && (name.includes('pkg a') || pn.includes('AF'))) {
    return ['Cargo Net', 'Spare Tire Cover', 'Black Door Housing Protector', 'Sporty Outer Mirror Cover', 'Premium Horn'];
  }
  if (name.includes('sporty package') && (name.includes('pkg b') || pn.includes('BF'))) {
    return ['Spare Tire Cover', 'Sporty Door Handle Protector', 'Sporty Door Housing Protector', 'Sporty Outer Mirror Cover', 'Premium Horn'];
  }
  if (name.includes('full spec package') && (name.includes('pkg c') || pn.includes('CD'))) {
    return ['Air Purifier', 'Black Door Housing Protector', 'Black Door Handle Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn', 'DVR'];
  }
  if (name.includes('full spec 4x4 gr-s black') || (name.includes('pkg e') && pn.includes('EA'))) {
    return ['Air Purifier', 'Black Door Housing Protector', 'Black Door Handle Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn'];
  }
  if (name.includes('full spec 4x4 gr-s') || (name.includes('pkg d') && pn.includes('DA'))) {
    return ['Air Purifier', 'Sporty Door Handle Protector', 'Sporty Door Housing Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn'];
  }
  if (name.includes('smart car fragrance package 1') && (name.includes('fortuner') || pn.includes('HA'))) {
    return ['Premium Horn', 'Air Fragrance Device Set Fortuner', 'Scents NTCO Amber Haven'];
  }
  if (name.includes('smart car fragrance package 2') && (name.includes('fortuner') || pn.includes('IA'))) {
    return ['Premium Horn', 'Air Fragrance Device Set Fortuner', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper'];
  }

  // Avanza & Veloz
  if (name.includes('utility package') && name.includes('pkg c')) return ['Seat Cover Regular Spec'];
  if (name.includes('lux package') && name.includes('pkg d')) return ['Cargo Net', 'Front grille ornament', 'Side body moulding Gunmetal'];
  if (name.includes('seat cover package') && name.includes('pkg e')) return ['Seat Cover Value Spec'];
  if (name.includes('lite package') && name.includes('pkg g')) return ['Cargo Net'];
  if (name.includes('value package') || name.includes('sfx b')) return ['Smart Car Fragrance', 'Side Visor'];
  if (name.includes('basic package') || name.includes('sfx e')) return ['Cargo Net'];

  // Rush
  if (name.includes('adventure package')) return ['Spare Tire Cover', 'Cargo Net', 'Sporty Outer Mirror Cover'];
  if (name.includes('convenience package')) return ['Spare Tire Cover', 'Cargo Net'];

  // Raize
  if (name.includes('sporty essence package')) return ['Sporty Roof Spoiler', 'GR Sporty Shift Knob', 'Side Visor'];
  if (name.includes('aero scent package')) return ['Sporty Roof Spoiler', 'Air Fragrance Device Single Channel', 'Amber Haven Scent Stick'];
  if (name.includes('smart car fragrance package') && name.includes('raize')) return ['Air Fragrance Device Single Channel', 'Amber Haven Scent Stick'];

  // New Agya
  if (name.includes('stylix max package') || (name.includes('pkg b') && name.includes('gya'))) return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Sporty Roof Spoiler (New)', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  if (name.includes('aerokit & function package') || (name.includes('pkg d') && name.includes('gya'))) return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Back Camera', 'Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  if (name.includes('aerokit package') || (name.includes('pkg e') && name.includes('gya'))) return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  if (name.includes('advance package') || (name.includes('pkg c') && name.includes('gya'))) return ['Premium Horn', 'DVR'];
  if (name.includes('stylix plus package') || (name.includes('pkg f') && name.includes('gya'))) return ['Sporty Roof Spoiler (New)', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  if (name.includes('basic package') || (name.includes('pkg g') && name.includes('gya'))) return ['Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];

  // Yaris Cross
  if (name.includes('sporty package') && (name.includes('yaris') || name.includes('pkg a'))) return ['Front Grill ornament', 'Back Door Sporty Ornament', 'Ducktail'];
  if (name.includes('full spec package without dvr') || (name.includes('pkg c') && name.includes('yaris'))) return ['Air Purifier', 'Front Grill ornament', 'Back Door Sporty Ornament', 'Ducktail', 'Cargo Net'];
  if (name.includes('lite package') && (name.includes('yaris') || name.includes('pkg e'))) return ['Cargo Net'];

  // Hilux D-Cab
  if (name.includes('convenience package') && name.includes('hilux')) return ['DVR'];
  if (name.includes('sporty package') && name.includes('hilux')) return ['Sporty Outer Mirror Cover', 'Premium Horn', 'DVR'];
  if (name.includes('advance package') && name.includes('hilux')) return ['Premium Horn', 'Engine Hood Lift Assist'];
  if (name.includes('lift assist package') && name.includes('hilux')) return ['Premium Horn', 'Engine Hood Lift Assist', 'Tail Gate Lift Assist'];

  // Hilux Rangga
  if (name.includes('fleet support package')) return ['Telematics (Gfleet)'];
  if (name.includes('function package') && name.includes('rangga')) return ['Fr Corner Sensor'];
  if (name.includes('operational package')) return ['Bed Liner (3 Way)', 'Fr Corner Sensor'];
  if (name.includes('sme support package')) return ['Telematics (T-Intouch)'];
  if (name.includes('commercial package std')) return ['Cover Glove Box w/o key', 'Side Visor'];
  if (name.includes('commercial package high')) return ['Cover Glove Box w/o key'];

  // Land Cruiser 300
  if (name.includes('full spec custom package') || name.includes('lc300')) return ['Rubber Floor mat', 'E-Mirror', 'Bonnet Protector', 'Air Fragrance Device Set LC300', 'Scents NTCO Oceanic Joy', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper', 'Scents NTCO Sunlit Zest'];
  if (name.includes('function package') && name.includes('lc300')) return ['E-Mirror', 'Rubber Floor mat'];

  // Alphard
  if (name.includes('modellista package') && name.includes('air fragrance')) return ['Front Spoiler Modellista', 'Side Skirt Modellista', 'Rear Skirt Modellista', 'Air Fragrance Device Set Alphard', 'Scents NTCO Oceanic Joy', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper', 'Scents NTCO Sunlit Zest'];
  if (name.includes('modellista package')) return ['Front Spoiler Modellista', 'Side Skirt Modellista', 'Rear Skirt Modellista'];
  if (name.includes('welcab')) return ['Conversion Welcab Seat'];

  // Voxy
  if (name.includes('modellista aeropart package')) return ['Front Spoiler Modellista', 'Rear Bumper Spoiler Modellista', 'Premium Horn'];
  if (name.includes('modellista full package')) return ['Front Spoiler Modellista', 'Rear Bumper Spoiler Modellista', 'Signature Illumination Grille', 'Premium Horn'];

  // BZ4X
  if (name.includes('wall charger')) return ['Wall Charger (include installation service)'];

  if (pn && pn.includes(',')) {
    return pn.split(',').map((c, i) => `Part Item #${i + 1} (Suffix ${c.trim()})`);
  }

  return [];
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil URL query parameters dari tombol "Pesan" di catalog TCO
    const urlParams = new URLSearchParams(window.location.search);
    orderDetails.model = urlParams.get('model') || 'Innova Zenix';
    const itemParam = urlParams.get('item') || 'Black Outer Mirror Ornament';
    const priceParam = urlParams.get('price') || '';

    // Split items jika multiple item (dipisahkan oleh ' + ')
    const rawNames = itemParam.split(/\s+\+\s+/);
    
    orderDetails.items = rawNames.map(name => ({
        name: name.trim(),
        priceRtco: rawNames.length === 1 ? priceParam : '',
        priceTpos: '',
        priceTls: '',
        partNumber: '',
        applicableGrade: '',
        selectedScheme: 'RTCO'
    }));

    // Initial render
    renderPerItemPriceSchemes();
    initGradeSelect();
    updateOrderSummary();

    // 2. Fetch data detail produk lengkap dari API database TCO
    try {
        const response = await fetch('../api/api_tco.php');
        const apiData = await response.json();
        
        if (Array.isArray(apiData)) {
            const matchedModelObj = apiData.find(m => m.model.toLowerCase() === orderDetails.model.toLowerCase());
            if (matchedModelObj && matchedModelObj.items) {
                orderDetails.items.forEach(it => {
                    const matchedItemObj = matchedModelObj.items.find(i => i.name.toLowerCase() === it.name.toLowerCase());
                    if (matchedItemObj) {
                        it.priceRtco = matchedItemObj.price || it.priceRtco;
                        it.priceTpos = matchedItemObj.price_tpos || '';
                        it.priceTls = matchedItemObj.price_tls || '';
                        it.partNumber = matchedItemObj.part_number || '';
                        it.applicableGrade = matchedItemObj.applicable_grade || '';
                    }
                });

                // Set default applicableGrade from first item
                if (orderDetails.items[0] && orderDetails.items[0].applicableGrade) {
                    orderDetails.applicableGrade = orderDetails.items[0].applicableGrade;
                }

                // Re-render UI dengan data presisi dari Database
                renderPerItemPriceSchemes();
                initGradeSelect();
                updateOrderSummary();
            }
        }
    } catch (err) {
        console.error("Gagal sinkronisasi data TCO API:", err);
    }
});

function renderPerItemPriceSchemes() {
    const container = document.getElementById('perItemPriceSchemesContainer');
    if (!container) return;

    if (orderDetails.items.length === 1) {
        const item = orderDetails.items[0];
        container.innerHTML = `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px;">
                <label class="input-label" for="schemeSelect_0">Pilihan Skema Harga <span>*</span></label>
                <div class="input-group">
                    <select id="schemeSelect_0" class="form-control item-scheme-select" onchange="onPerItemSchemeChange(0, this.value)" required>
                        <option value="RTCO" ${item.selectedScheme === 'RTCO' ? 'selected' : ''}>Harga Customer (RTCO After Tax) - ${item.priceRtco || '-'}</option>
                        ${item.priceTpos ? `<option value="TPOS" ${item.selectedScheme === 'TPOS' ? 'selected' : ''}>Harga Beli Dealer via TPOS (Tipe 3 - WPBT) - ${item.priceTpos}</option>` : ''}
                        ${item.priceTls ? `<option value="TLS" ${item.selectedScheme === 'TLS' ? 'selected' : ''}>Harga Beli Dealer via TLS (RTCO - WPBT) - ${item.priceTls}</option>` : ''}
                    </select>
                    <i class="fa-solid fa-money-bill-wave"></i>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="font-size:12.5px; font-weight:800; color:var(--text-dark); margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-layer-group" style="color:var(--primary-red, #d7123a);"></i> Skema Harga Masing-Masing Produk (${orderDetails.items.length} Item)
            </div>
            ${orderDetails.items.map((item, idx) => `
                <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:14px; margin-bottom:4px;">
                    <div style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                        <span><i class="fa-solid fa-box" style="color:#2563eb;"></i> ${idx + 1}. ${item.name}</span>
                        ${item.partNumber ? `<span style="font-size:10px; font-family:monospace; background:#e2e8f0; padding:2px 6px; border-radius:4px; color:#475569;">P/N: ${item.partNumber}</span>` : ''}
                    </div>
                    <label class="input-label" style="font-size:11px; margin-bottom:4px;" for="schemeSelect_${idx}">Pilih Skema Harga Produk Ini <span>*</span></label>
                    <div class="input-group">
                        <select id="schemeSelect_${idx}" class="form-control item-scheme-select" onchange="onPerItemSchemeChange(${idx}, this.value)" required style="font-size:12.5px;">
                            <option value="RTCO" ${item.selectedScheme === 'RTCO' ? 'selected' : ''}>Harga Customer (RTCO) - ${item.priceRtco || '-'}</option>
                            ${item.priceTpos ? `<option value="TPOS" ${item.selectedScheme === 'TPOS' ? 'selected' : ''}>Harga Dealer TPOS (Tipe 3) - ${item.priceTpos}</option>` : ''}
                            ${item.priceTls ? `<option value="TLS" ${item.selectedScheme === 'TLS' ? 'selected' : ''}>Harga Dealer TLS (RTCO) - ${item.priceTls}</option>` : ''}
                        </select>
                        <i class="fa-solid fa-tags"></i>
                    </div>
                </div>
            `).join('')}
        `;
    }
}

function onPerItemSchemeChange(idx, val) {
    if (orderDetails.items[idx]) {
        orderDetails.items[idx].selectedScheme = val;
    }
    updateOrderSummary();
}

function initGradeSelect() {
    const gradeSelect = document.getElementById('selectGrade');
    if (!gradeSelect) return;

    const currentVal = gradeSelect.value;
    gradeSelect.innerHTML = '';

    const firstItemGrade = orderDetails.items[0] ? orderDetails.items[0].applicableGrade : orderDetails.applicableGrade;

    if (firstItemGrade) {
        const grades = firstItemGrade.split(',').map(g => g.trim());
        grades.forEach(g => {
            if (g) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g;
                gradeSelect.appendChild(opt);
            }
        });
        if (currentVal && Array.from(gradeSelect.options).some(o => o.value === currentVal)) {
            gradeSelect.value = currentVal;
        } else if (grades.length > 0) {
            gradeSelect.value = grades[0];
        }
    } else {
        const opt = document.createElement('option');
        opt.value = 'Semua Tipe';
        opt.textContent = 'Semua Tipe Kendaraan';
        gradeSelect.appendChild(opt);
        gradeSelect.value = 'Semua Tipe';
    }
}

function onGradeChange() {
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderModelEl = document.getElementById('orderModel');
    const orderItemEl = document.getElementById('orderItem');
    const orderPriceEl = document.getElementById('orderPrice');
    const orderPriceLabelEl = document.getElementById('orderPriceLabel');

    const pnBadge = document.getElementById('orderPnBadge');
    const gradeBadge = document.getElementById('orderGradeBadge');
    const schemeBadge = document.getElementById('orderSchemeBadge');

    const gradeSelect = document.getElementById('selectGrade');
    const selectedGrade = gradeSelect ? gradeSelect.value : 'Semua Tipe';

    if (orderModelEl) orderModelEl.innerHTML = `<i class="fa-solid fa-car" style="margin-right: 6px;"></i> ${orderDetails.model}`;
    
    const itemNamesStr = orderDetails.items.map(i => i.name).join(' + ');
    if (orderItemEl) orderItemEl.innerText = itemNamesStr;

    if (pnBadge) {
        if (orderDetails.items.length > 1) {
            pnBadge.innerHTML = `<i class="fa-solid fa-boxes-packing"></i> ${orderDetails.items.length} Aksesoris Dipilih`;
        } else {
            pnBadge.innerHTML = `<i class="fa-solid fa-barcode"></i> P/N: ${orderDetails.items[0]?.partNumber || 'Official TAM'}`;
        }
    }
    if (gradeBadge) gradeBadge.innerHTML = `<i class="fa-solid fa-check-double"></i> Grade: ${selectedGrade}`;

    const pkgPartsEl = document.getElementById('orderPackageParts');
    if (pkgPartsEl) {
        if (orderDetails.items.length === 1) {
            const parts = getPackageParts({ name: orderDetails.items[0].name, part_number: orderDetails.items[0].partNumber });
            if (parts.length > 0) {
                pkgPartsEl.style.display = 'block';
                pkgPartsEl.innerHTML = `
                    <div style="font-size:11px; font-weight:700; color:#e2e8f0; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-boxes-packing" style="color:#60a5fa;"></i> Included Part Name (${parts.length} Item):
                    </div>
                    <ul style="margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:4px;">
                        ${parts.map(p => `<li style="font-size:11px; color:#cbd5e1; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-check" style="color:#34d399; font-size:10px;"></i> ${p}</li>`).join('')}
                    </ul>
                `;
            } else {
                pkgPartsEl.style.display = 'none';
            }
        } else {
            pkgPartsEl.style.display = 'none';
        }
    }

    // Calculate total order price dynamically based on each item's chosen scheme!
    let totalOrderPrice = 0;
    const schemeSummaryArr = [];

    orderDetails.items.forEach(it => {
        let priceStr = it.priceRtco;
        let schemeLabel = 'Customer (RTCO)';

        if (it.selectedScheme === 'TPOS' && it.priceTpos) {
            priceStr = it.priceTpos;
            schemeLabel = 'Dealer TPOS';
        } else if (it.selectedScheme === 'TLS' && it.priceTls) {
            priceStr = it.priceTls;
            schemeLabel = 'Dealer TLS';
        }

        const numVal = parseInt((priceStr || '').replace(/[^\d]/g, '')) || 0;
        totalOrderPrice += numVal;
        schemeSummaryArr.push(`${it.name} (${schemeLabel})`);
    });

    if (orderPriceEl) {
        orderPriceEl.innerText = 'Rp ' + totalOrderPrice.toLocaleString('id-ID');
    }
    if (orderPriceLabelEl) {
        orderPriceLabelEl.innerText = orderDetails.items.length > 1 ? 'Total Biaya Pesanan Aksesoris' : 'Harga Aksesoris Terpilih';
    }
    if (schemeBadge) {
        if (orderDetails.items.length === 1) {
            const schemeLabel = orderDetails.items[0].selectedScheme === 'TPOS' ? 'Dealer TPOS (Tipe 3)' : (orderDetails.items[0].selectedScheme === 'TLS' ? 'Dealer TLS (RTCO)' : 'Customer (RTCO)');
            schemeBadge.innerHTML = `<i class="fa-solid fa-tag"></i> Skema: ${schemeLabel}`;
        } else {
            schemeBadge.innerHTML = `<i class="fa-solid fa-tag"></i> Skema: Kombinasi Per-Item`;
        }
    }
}

function submitOrder(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const carDetails = document.getElementById('carDetails').value.trim();
    const orderNotes = document.getElementById('orderNotes').value.trim();

    const gradeSelect = document.getElementById('selectGrade');
    const selectedGrade = gradeSelect ? gradeSelect.value : 'Semua Tipe';

    const orderItemsSummary = orderDetails.items.map(it => {
        const schemeLabel = it.selectedScheme === 'TPOS' ? 'TPOS Dealer' : (it.selectedScheme === 'TLS' ? 'TLS Dealer' : 'Customer RTCO');
        return `${it.name} [Skema: ${schemeLabel}]`;
    }).join(' + ');

    const orderPrice = document.getElementById('orderPrice').innerText;

    const orderData = {
        customerName,
        customerPhone,
        carDetails,
        orderNotes,
        orderModel: orderDetails.model,
        orderItem: orderItemsSummary,
        partNumber: orderDetails.items.map(i => i.partNumber).filter(Boolean).join(', '),
        selectedGrade,
        priceType: orderDetails.items.length > 1 ? 'Skema Kombinasi Per-Item' : (orderDetails.items[0].selectedScheme || 'RTCO'),
        orderPrice
    };

    sessionStorage.setItem('tcoOrderData', JSON.stringify(orderData));

    setTimeout(() => {
        window.location.href = 'tco_payment.html';
    }, 1200);
}

function closeSuccessOverlay() {
    document.getElementById('successOverlay').style.display = 'none';
    window.location.href = 'tco.html';
}
