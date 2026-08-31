let toyotaModels = [];

function getUnitImage(model) {
    if (!model) return 'fallback';
    const m = model.toLowerCase();
    if (m.includes('zenix')) return 'zenix.webp';
    if (m.includes('reborn')) return 'innova-reborn.webp';
    if (m.includes('yaris cross')) return 'yaris-cross.webp';
    if (m.includes('corolla cross')) return 'cross.webp';
    if (m.includes('corolla altis')) return 'altis.webp';
    if (m.includes('camry')) return 'camry.webp';
    if (m.includes('vios')) return 'vios.webp';
    if (m.includes('bz4x')) return 'bz4x.webp';
    if (m.includes('alphard')) return 'alphard.webp';
    if (m.includes('vellfire')) return 'vellfire.webp';
    if (m.includes('voxy')) return 'voxy.webp';
    if (m.includes('avanza')) return 'avanza.webp';
    if (m.includes('veloz')) return 'veloz.webp';
    if (m.includes('calya')) return 'calya.webp';
    if (m.includes('agya gr-s')) return 'agya-gr-s.webp';
    if (m.includes('agya')) return 'agya.webp';
    if (m.includes('raize')) return 'raize.webp';
    if (m.includes('rush')) return 'rush.webp';
    if (m.includes('fortuner')) return 'fortuner.webp';
    if (m.includes('land cruiser')) return 'land-cruiser.webp';
    if (m.includes('urban cruiser')) return 'urban-cruiser.webp';
    if (m.includes('double cabin')) return 'double-cabin.webp';
    if (m.includes('single cabin')) return 'single-cabin.webp';
    if (m.includes('hiace premio')) return 'hi-ace-premio.webp';
    if (m.includes('hiace')) return 'hi-ace-comm.webp';
    if (m.includes('dyna')) return 'dyna.webp';
    if (m.includes('rangga')) return 'rangga.webp';
    if (m.includes('gr 86')) return 'gr-86.webp';
    if (m.includes('gr yaris')) return 'gr-yaris.webp';
    if (m.includes('gr corolla')) return 'gr-corolla.webp';

    return m.replace(/\s+/g, '-') + '.webp';
}

function getUnitSpecs(model, type = '') {
    const m = (model || '').toLowerCase();
    const t = (type || '').toLowerCase();
    let seats = '5 Kursi';
    let fuel = 'Bensin';
    let engine = '1.5L';
    let transmisi = 'CVT / MT';
    let penggerak = 'FWD (Depan)';
    let fitur = 'Head Unit Display, Rear Camera';

    // Seats Configurations
    if (m.match(/avanza|veloz|rush|sienta|innova|reborn|zenix|fortuner|calya|alphard|vellfire|voxy|land cruiser/)) {
        seats = '7 Kursi';
    } else if (m.match(/hiace premio/)) {
        seats = '10 Kursi';
    } else if (m.match(/hiace/)) {
        seats = '15 Kursi';
    } else if (m.match(/dyna|rangga|single cabin/)) {
        seats = '2 Kursi';
    } else if (m.match(/gr 86|gr yaris/)) {
        seats = '4 Kursi';
    }

    // Fuel Configurations
    if (m.match(/fortuner|innova reborn|hilux|hiace|dyna|land cruiser/)) {
        fuel = 'Diesel / Bensin';
    }
    if (m.match(/hybrid|hev/)) fuel = 'Hybrid';
    if (m.match(/bz4x/)) fuel = 'Listrik (EV)';
    if (t.match(/ev/)) fuel = 'Listrik (EV)';

    // Engine Configurations
    if (m.match(/calya/)) engine = '1.2L (1,197 cc 4 Silinder Dual VVT-i)';
    else if (m.match(/veloz/) && t.match(/hybrid|hev/)) engine = '1.5L 2NR-VEX 4-Silinder Hybrid EV';
    else if (m.match(/veloz/)) engine = '1.5L (1,496 cc 4 Silinder Dual VVT-i)';
    else if (m.match(/avanza/)) {
        if (t.match(/1\.3/)) engine = '1.3L (1,329 cc 4 Silinder Dual VVT-i)';
        else engine = '1.5L (1,496 cc 4 Silinder Dual VVT-i)';
    }
    else if (m.match(/agya|raize 1.2/)) engine = '1.2L (1,198 cc 3 Silinder Dual VVT-i)';
    else if (m.match(/raize|raize 1.0/)) engine = '1.0L Turbo';
    else if (m.match(/gr yaris|gr corolla/)) engine = '1.6L Turbo 3-Silinder';
    else if (m.match(/corolla cross|corolla altis|c-hr/)) {
        if (t.match(/hybrid|hev/)) engine = '1.8L Hybrid Synergy Drive';
        else engine = '1.8L 4-Silinder Dual VVT-i';
    }
    else if (m.match(/yaris cross/)) {
        if (t.match(/hybrid|hev/)) engine = '1.5L 2NR-VEX Hybrid EV';
        else engine = '1.5L 2NR-VE Bensin';
    }
    else if (m.match(/camry|alphard|vellfire/)) {
        if (t.match(/hybrid|hev/)) engine = '2.5L Hybrid Synergy Drive';
        else engine = '2.5L 4-Silinder Dual VVT-i';
    }
    else if (m.match(/gr 86/)) engine = '2.4L Boxer 4-Silinder';
    else if (m.match(/innova reborn|reborn/)) {
        if (t.match(/2\.4/)) engine = '2.4L (2GD-FTV) Turbo Diesel';
        else engine = '2.0L (1TR-FE) Bensin / 2.4L Diesel';
    }
    else if (m.match(/fortuner|hilux/)) {
        if (t.match(/2\.8/)) engine = '2.8L (1GD-FTV) Turbo Diesel';
        else if (t.match(/2\.4/)) engine = '2.4L (2GD-FTV) Turbo Diesel';
        else engine = '2.4L / 2.8L Turbo Diesel';
    }
    else if (m.match(/land cruiser/)) engine = '3.3L Twin-Turbo Diesel (V6)';
    else if (m.match(/zenix|voxy/)) {
        if (t.match(/hybrid|hv/)) engine = '2.0L (M20A-FXS) Hybrid EV';
        else engine = '2.0L (M20A-FKS) Bensin';
    }
    else if (m.match(/rangga/)) engine = '2.0L Bensin / 2.4L Turbo Diesel';
    else if (m.match(/bz4x/)) engine = '71.4 kWh (Baterai)';
    else if (m.match(/vios|yaris/)) engine = '1.5L (2NR-VE) 4 Silinder';
    else if (m.match(/rush/)) engine = '1.5L (2NR-VE) 4 Silinder';

    // Transmisi Configurations
    if (m.match(/bz4x|hybrid|hev/) || t.match(/hybrid|hev|hv/)) transmisi = 'e-CVT / EV';
    else if (t.match(/mt|m\/t/)) transmisi = 'Manual (MT)';
    else if (t.match(/at|a\/t|cvt/)) transmisi = 'Otomatis (AT/CVT)';
    else if (m.match(/calya/)) transmisi = '4-Speed AT / 5-Speed MT';
    else if (m.match(/fortuner|innova reborn|rush|alphard|vellfire|land cruiser/)) transmisi = 'Otomatis (AT)';
    else if (m.match(/gr yaris|gr corolla/)) transmisi = '6-Speed MT';
    else if (m.match(/dyna|hiace|rangga|single cabin/)) transmisi = 'Manual (MT)';

    // Penggerak Configurations
    if (m.match(/rush|innova reborn|fortuner|hiace|dyna|rangga|gr 86/)) penggerak = 'RWD (Belakang)';
    else if (m.match(/land cruiser|hilux double|hilux single/)) penggerak = '4x4 / AWD / RWD';
    else if (m.match(/gr yaris|gr corolla/)) penggerak = 'GR-FOUR (AWD)';
    else if (m.match(/bz4x/)) penggerak = 'FWD (Depan)';

    // Fitur Dynamic based on Type
    if (m.match(/alphard|vellfire/)) {
        fitur = 'TSS 3.0, Panoramic View Monitor, Power Sliding Door';
        if (t.match(/vip|executive/)) fitur += ', Executive Lounge Captain Seat, 14" Head Unit, Power Long Slide';
        else fitur += ', Captain Seat w/ Ottoman, 14" Head Unit';
    } else if (m.match(/voxy/)) {
        fitur = 'TSS 3.0, Dual Sliding Door w/ Kick Sensor, Panoramic View Monitor, Roof Monitor';
    } else if (m.match(/bz4x/)) {
        fitur = 'TSS 3.0, Panoramic Sunroof, Advanced Park, 12.3" Head Unit, T Intouch';
    } else if (m.match(/camry/)) {
        fitur = 'TSS, 9" Head Unit, Premium Black Interior';
        if (t.match(/hybrid|hev/)) fitur += ', JBL Audio, EV Mode, Moonroof';
    } else if (m.match(/corolla cross/)) {
        fitur = 'TSS, Panoramic View Monitor, Power Back Door';
        if (t.match(/hybrid|hev/)) fitur += ', Panoramic Sunroof, EV Mode';
    } else if (m.match(/corolla altis/)) {
        fitur = 'TSS, 9" Head Unit, Blind Spot Monitor';
        if (t.match(/hybrid|hev/)) fitur += ', EV Mode, HUD (Head-Up Display)';
    } else if (m.match(/yaris cross/)) {
        fitur = 'Electric Parking Brake, 6 Airbags, Digital AC, Blind Spot Monitor';
        if (t.match(/s /) || t === 's') {
            if (t.match(/gr/)) fitur += ', GR Aerokit';
            if (t.match(/hv|hybrid|hev/)) fitur += ', TSS, Panoramic Glass Roof w/ Power Sunshade, EV Mode, Power Back Door';
            else fitur += ', TSS, Power Back Door';
        }
    } else if (m.match(/zenix/)) {
        fitur = 'Electric Parking Brake + Brake Hold, Digital AC, T Intouch';
        if (t.match(/q /) || t.match(/^q/)) {
            fitur += ', TSS 3.0, Panoramic Retractable Roof, Captain Seat w/ Ottoman, Power Back Door, 10" Head Unit, RSE';
        } else if (t.match(/v /) || t.match(/^v/)) {
            if (t.match(/hv|hybrid/)) fitur += ', Panoramic Retractable Roof, 10" Head Unit, RSE (Rear Seat Entertainment)';
            else fitur += ', 10" Head Unit, RSE (Rear Seat Entertainment)';
        } else {
            fitur += ', 9" Head Unit, Dual Airbags';
        }
    } else if (m.match(/avanza/)) {
        fitur = 'Push Start Button, Dual Airbags, VSC, HSA, ABS+EBD';
        if (t.match(/1\.5|g /) || t === 'g') fitur += ', 9" Head Unit, 16" Alloy Wheel, Tilt & Telescopic Steering';
        else if (t.match(/1\.3|e /) || t === 'e') fitur += ', 8" Head Unit, 15" Alloy Wheel';
        if (t.match(/tss/)) fitur = '6 Airbags, Toyota Safety Sense, T Intouch, RCTA, BSM, 9" Head Unit, 16" Alloy Wheel';
    } else if (m.match(/innova reborn|reborn/)) {
        fitur = 'Dual SRS Airbags + Knee Airbag, VSC, HSA, ABS+EBD';
        if (t.match(/v /) || t === 'v') fitur += ', Premium 9" Head Unit, Rear Seat Entertainment, Premium Black Interior';
        else fitur += ', 8" Head Unit, Premium Black Interior';
    } else if (m.match(/veloz/)) {
        if (t.match(/hybrid|hev/)) {
            let list = ['Fuel Efficient 28.9 km/l', 'EV Mode'];
            if (t.match(/q/)) list.push('New Integrated 10" Head Unit');
            if (t.match(/modellista/)) list.push('New Bold Leisure Soft Pad Door Armrest');
            list.push('New Sophisticated Black Seat Material');
            fitur = list.join(',');
        } else {
            fitur = '6 Airbags, T Intouch, Electric Parking Brake, 9" Head Unit';
            if (t.match(/tss/)) fitur += ', TSS (Toyota Safety Sense)';
            if (t.match(/gr /)) fitur += ', GR Sport Aerokit';
        }
    } else if (m.match(/raize/)) {
        fitur = '8" Head Unit, VSC, HSA, Dual Airbags';
        if (t.match(/1\.0|turbo/)) fitur = '9" Head Unit, 1.0L Turbo Engine';
        if (t.match(/gr /)) fitur += ', GR Aerokit, Paddle Shift';
        if (t.match(/tss/)) fitur += ', TSS (Toyota Safety Sense)';
    } else if (m.match(/rush/)) {
        fitur = '7" Head Unit, 6 Airbags, Push Start Button';
        if (t.match(/gr /)) fitur += ', GR Sport Aerokit, 8" Head Unit, Auto AC, Smart Entry';
    } else if (m.match(/fortuner/)) {
        fitur = 'Bi-Beam LED, 6 Airbags, Drive Mode';
        if (t.match(/vrz/)) fitur += ', Power Back Door, Rear Seat Entertainment';
        if (t.match(/gr /)) fitur += ', GR Aerokit, Panoramic View Monitor, Wireless Charger';
        if (t.match(/2\.8/)) fitur += ', TSS (Toyota Safety Sense)';
    } else if (m.match(/hilux double cabin/)) {
        fitur = '4x4 Shift-on-the-fly, Rear Differential Lock';
        if (t.match(/v |gr /)) fitur += ', 8" Head Unit, Bi-Beam LED, 6 Airbags';
        if (t.match(/gr /)) fitur += ', GR Aerokit, TSS, Paddle Shift, 360 Camera';
    } else if (m.match(/calya/)) {
        fitur = 'Dual SRS Airbags, ABS+EBD, ISOFIX, Rear Parking Sensor';
        if (t.match(/g /) || t === 'g') fitur += ', New Smoked Headlamp, New Bolder Interior, Retractable Mirror';
        else if (t.match(/e /) || t === 'e') fitur += ', New Front Grille Design';
    } else if (m.match(/agya/)) {
        fitur = 'Dual Airbags, ABS+EBD, Rear Camera, 8" Head Unit';
        if (t.match(/gr /)) fitur += ', GR Aerokit, Sporty Interior, Wireless Charger, Sport-Tuned Suspension';
    } else if (m.match(/land cruiser/)) {
        fitur = 'TSS, Crawl Control, Kinetic Dynamic Suspension, T Intouch, 12.3" Head Unit';
        if (t.match(/gr /)) fitur += ', GR Sport Tuning, Torsen LSD, AVS';
    } else if (m.match(/gr 86|gr yaris|gr corolla/)) {
        fitur = 'GR Sport Tuning, Track Mode, Sport Seats, Torsen LSD';
        if (m.match(/gr yaris|gr corolla/)) fitur += ', GR-FOUR AWD System, Turbocharger';
    } else if (m.match(/vios|yaris/)) {
        fitur = 'Dual Airbags, 8" Head Unit, VSC, HSA';
        if (t.match(/g /)) fitur += ', 9" Head Unit';
        if (t.match(/tss/)) fitur += ', TSS (Toyota Safety Sense)';
        if (t.match(/gr /)) fitur += ', GR Aerokit, Paddle Shift';
    } else if (m.match(/hiace|dyna|rangga|single cabin/)) {
        fitur = 'Commercial Grade Heavy Duty Suspension, ABS+BA';
        if (m.match(/hiace/)) fitur += ', Dual Airbags, Spacious Cabin';
    }

    return { seats, fuel, engine, transmisi, penggerak, fitur };
}

let activeCategory = 'All';

function filterCategory(cat, btn) {
    activeCategory = cat;

    // Update active class on buttons
    const btns = document.querySelectorAll('#categoryFilters .cat-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Re-render
    renderLibrary();
}

function renderLibrary() {
    const search = (document.getElementById('searchInput').value || '').toLowerCase();
    const container = document.getElementById('libGrid');
    if (!container) return;

    container.innerHTML = '';
    const filtered = toyotaModels.filter(m => m.toLowerCase().includes(search));

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column:span 2; color:var(--text-muted); font-size:12px;">Tidak ditemukan</p>';
        return;
    }

    function getBodyType(modelName) {
        const modelToCategory = {
            'agya': 'Hatchback', 'yaris': 'Hatchback', 'gr yaris': 'Hatchback', 'gr corolla': 'Hatchback',
            'calya': 'MPV', 'avanza': 'MPV', 'veloz': 'MPV', 'sienta': 'MPV', 'innova': 'MPV', 'zenix': 'MPV', 'reborn': 'MPV', 'voxy': 'MPV', 'alphard': 'MPV', 'vellfire': 'MPV', 'majesty': 'MPV',
            'raize': 'SUV', 'rush': 'SUV', 'yaris cross': 'SUV', 'corolla cross': 'SUV', 'cross': 'SUV', 'fortuner': 'SUV', 'bz4x': 'SUV', 'land cruiser': 'SUV', 'c-hr': 'SUV', 'rav4': 'SUV', 'urban cruiser': 'SUV',
            'vios': 'Sedan', 'corolla altis': 'Sedan', 'altis': 'Sedan', 'camry': 'Sedan', 'gr 86': 'Sedan', 'supra': 'Sedan', 'prius': 'Sedan',
            'hilux': 'Commercial', 'single cabin': 'Commercial', 'double cabin': 'Commercial', 'hiace': 'Commercial', 'hi ace': 'Commercial', 'dyna': 'Commercial', 'rangga': 'Commercial'
        };
        const m = modelName.toLowerCase();
        const entries = Object.entries(modelToCategory).sort((a, b) => b[0].length - a[0].length);
        for (const [key, cat] of entries) {
            if (m.includes(key)) return cat;
        }
        return 'Lainnya';
    }

    const byKategori = {};
    filtered.forEach(m => {
        const cat = getBodyType(m);
        if (!byKategori[cat]) byKategori[cat] = [];
        byKategori[cat].push(m);
    });

    let catsToRender = Object.entries(byKategori);
    if (activeCategory !== 'All') {
        catsToRender = catsToRender.filter(([name]) => name === activeCategory);
    }

    let foundAny = false;

    for (const [catName, catFiltered] of catsToRender) {
        if (catFiltered.length > 0) {
            foundAny = true;
            container.innerHTML += `
                <div style="grid-column: 1 / -1; margin-top: 20px; margin-bottom: 5px; display:flex; align-items:center; gap:8px;">
                    <div style="width:4px; height:18px; background:linear-gradient(135deg, var(--primary-red), #ff0000); border-radius:4px;"></div>
                    <h3 style="font-size:16px; font-weight:800; color:var(--text-dark); margin:0;">${catName}</h3>
                </div>
            `;
            catFiltered.forEach(model => {
                const specs = getUnitSpecs(model);
                const img = getUnitImage(model);
                container.innerHTML += `
                    <div class="card glass-card" style="padding:16px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.8); background:rgba(255,255,255,0.5);">
                        <div class="car-img-wrapper" style="height:90px; margin-bottom:12px;">
                            <img src="../assets/img/mobil/${img}" onerror="this.src='../assets/img/mobil/avanza.webp'" alt="${model}">
                        </div>
                        <div>
                            <h4 style="font-size:15px; font-weight:800; color:var(--text-dark); margin-bottom:6px;">${model}</h4>
                            <div style="display:flex; justify-content:center; gap:6px; margin-bottom:14px;">
                                <span style="background:rgba(255,255,255,0.8); padding:4px 10px; border-radius:12px; font-size:10px; font-weight:700; color:var(--text-muted); box-shadow:0 2px 4px rgba(0,0,0,0.02);"><i class="fa-solid fa-gas-pump" style="color:var(--primary-blue);"></i> ${specs.fuel.split(' / ')[0]}</span>
                                <span style="background:rgba(255,255,255,0.8); padding:4px 10px; border-radius:12px; font-size:10px; font-weight:700; color:var(--text-muted); box-shadow:0 2px 4px rgba(0,0,0,0.02);"><i class="fa-solid fa-users" style="color:var(--primary-blue);"></i> ${specs.seats}</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <button class="btn-main" onclick="showSpecs('${model}')" style="flex:1; font-size:11.5px; padding:10px 6px; justify-content:center; border-radius:12px; background:linear-gradient(135deg, var(--primary-blue), #003d99); box-shadow: 0 4px 12px rgba(0,82,204,0.25);">
                                <i class="fa-solid fa-list-ul" style="margin-right:4px;"></i> Lihat Detail
                            </button>
                            <button class="btn-main" onclick="quickShareCar('${model}')" title="Bagikan Info & Spek ke WhatsApp" style="width:38px; height:38px; padding:0; justify-content:center; border-radius:12px; background:linear-gradient(135deg, #25D366 0%, #15803d 100%); color:#ffffff; box-shadow: 0 4px 12px rgba(37,211,102,0.3); border:none; cursor:pointer; flex-shrink:0;">
                                <i class="fa-brands fa-whatsapp" style="font-size:17px;"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
    }

    if (!foundAny && filtered.length > 0) {
        // If some cars are found but none fit the category (very rare since we mapped all)
        container.innerHTML = '<p style="text-align:center; grid-column:span 2; color:var(--text-muted); font-size:12px;">Tidak ada mobil di kategori ini yang cocok dengan pencarian.</p>';
    }
}

let elibraryPricelist = [];

async function fetchElibraryPricelist() {
    if (elibraryPricelist.length > 0) return elibraryPricelist;
    try {
        const res = await fetch('../api/api_pricelist.php');
        const data = await res.json();
        if (data.ok) {
            elibraryPricelist = data.data;
        }
    } catch (e) {
        console.error("Gagal memuat pricelist:", e);
    }
    return elibraryPricelist;
}

let currentElibModel = '';
let currentElibVariants = [];

async function showSpecs(model) {
    currentElibModel = model;
    const img = getUnitImage(model);

    document.getElementById('spekTitle').textContent = model;
    document.getElementById('spekImg').src = `../assets/img/mobil/${img}`;
    document.getElementById('spekImg').onerror = function () { this.src = '../assets/img/mobil/avanza.webp'; };

    if (typeof renderColorSelector === 'function') {
        renderColorSelector(model);
    }

    // Default fallback loading
    document.getElementById('variantSelector').innerHTML = '<option>Memuat tipe...</option>';
    document.getElementById('spekPrice').textContent = 'Rp ...';
    document.getElementById('spekKodeTipe').textContent = '-';
    document.getElementById('spekFitur').innerHTML = '';

    document.getElementById('modalSpek').classList.add('show');

    // Fetch and render variants
    const pl = await fetchElibraryPricelist();
    const rawVariants = pl.filter(p => {
        const kat = (p.kategori_order || '').toLowerCase();
        const isReguler = kat.includes('reguler') || kat.includes('regular');
        if (!isReguler) return false;

        let dbModel = p.model.trim().toLowerCase();
        // Remove 'hybrid' and 'hev' from dbModel so they group under the base model
        dbModel = dbModel.replace(/\s+hybrid/gi, '').replace(/\s+hev/gi, '').trim();
        let eModel = model.trim().toLowerCase();

        // Manual Data Mapping
        if (eModel === 'innova zenix') eModel = 'zenix';
        if (eModel === 'innova reborn' && (dbModel === 'reborn' || dbModel === 'innova reborn')) return true;
        if (eModel === 'corolla cross') eModel = 'cross';
        if (eModel === 'corolla altis') eModel = 'altis';
        if (eModel === 'hilux single cabin') eModel = 'single cabin';
        if (eModel === 'hilux double cabin') eModel = 'double cabin';
        if (eModel === 'hilux rangga') eModel = 'rangga';
        if (eModel === 'hiace commuter') eModel = 'hi ace comm';
        if (eModel === 'hiace premio') eModel = 'hi ace premio';

        if (eModel === 'raize' && (dbModel === 'raize' || dbModel === 'raize improvement')) return true;
        if (eModel === 'veloz' && (dbModel === 'veloz')) return true;
        if (eModel === 'vios' && (dbModel === 'vios')) return true;

        return dbModel === eModel;
    });

    // Deduplicate by tipe_paket
    currentElibVariants = [];
    const seen = new Set();
    rawVariants.forEach(v => {
        const cleanName = (v.tipe_paket || '').trim();
        if (!seen.has(cleanName) && cleanName !== '') {
            seen.add(cleanName);
            v.tipe_paket = cleanName; // normalize name
            currentElibVariants.push(v);
        }
    });

    const selector = document.getElementById('variantSelector');
    selector.innerHTML = '';

    if (currentElibVariants.length === 0) {
        selector.innerHTML = '<option value="">Harga belum tersedia</option>';
        document.getElementById('spekPrice').textContent = '-';
        // Render base specs if no variant
        handleVariantChange('');
    } else {
        currentElibVariants.forEach(v => {
            selector.innerHTML += `<option value="${v.tipe_paket}">${v.tipe_paket}</option>`;
        });
        // Auto select first variant
        handleVariantChange(currentElibVariants[0].tipe_paket);
    }
}

let currentSelectedVariantName = '';
let currentSelectedColorName = '';

function handleVariantChange(variantName) {
    currentSelectedVariantName = variantName;
    const variantData = currentElibVariants.find(v => v.tipe_paket === variantName);
    const specs = getUnitSpecs(currentElibModel, variantName);

    // Update Price and Kode Tipe
    if (variantData && (variantData.harga_mt > 0 || variantData.harga_at > 0)) {
        let priceHtml = '';
        let kodeHtml = '';

        if (variantData.harga_mt > 0 && variantData.harga_at > 0) {
            const hMT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_mt).replace('Rp', 'Rp ');
            const hAT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_at).replace('Rp', 'Rp ');

            priceHtml = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:10px; opacity:0.8; font-weight:700;">M/T:</span> <span>${hMT}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:10px; opacity:0.8; font-weight:700;">A/T:</span> <span>${hAT}</span>
                </div>
             `;

            kodeHtml = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:10px; opacity:0.8; font-weight:700;">M/T:</span> <span>${variantData.kode_tipe_mt || '-'}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:10px; opacity:0.8; font-weight:700;">A/T:</span> <span>${variantData.kode_tipe_at || '-'}</span>
                </div>
             `;
        } else if (variantData.harga_mt > 0) {
            const hMT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_mt).replace('Rp', 'Rp ');
            priceHtml = `<div>${hMT}</div>`;
            kodeHtml = `<div>${variantData.kode_tipe_mt || '-'}</div>`;
        } else if (variantData.harga_at > 0) {
            const hAT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_at).replace('Rp', 'Rp ');
            priceHtml = `<div>${hAT}</div>`;
            kodeHtml = `<div>${variantData.kode_tipe_at || '-'}</div>`;
        }

        document.getElementById('spekPrice').innerHTML = priceHtml;
        document.getElementById('spekKodeTipe').innerHTML = kodeHtml;
    } else {
        document.getElementById('spekPrice').innerHTML = '-';
        document.getElementById('spekKodeTipe').innerHTML = '-';
    }

    // Update Specs UI
    document.getElementById('spekKursi').textContent = specs.seats;
    document.getElementById('spekFuel').textContent = specs.fuel;
    document.getElementById('spekEngine').textContent = specs.engine;
    document.getElementById('spekTransmisi').textContent = specs.transmisi;
    document.getElementById('spekPenggerak').textContent = specs.penggerak;

    // Render features
    document.getElementById('spekFitur').innerHTML = specs.fitur.split(',').map(f => `<span class="feature-badge">${f.trim()}</span>`).join('');
}


function initCompare() {
    const s1 = document.getElementById('compareSelect1');
    const s2 = document.getElementById('compareSelect2');
    if (!s1 || !s2) return;

    s1.innerHTML = '';
    s2.innerHTML = '';

    toyotaModels.sort().forEach(m => {
        s1.innerHTML += `<option value="${m}">${m}</option>`;
        s2.innerHTML += `<option value="${m}">${m}</option>`;
    });

    s1.value = 'Innova Zenix';
    s2.value = 'Yaris Cross';

    // Trigger initial population of type dropdowns
    updateCompareTypes(s1.value, 'compareType1');
    updateCompareTypes(s2.value, 'compareType2');
}

async function updateCompareTypes(model, targetSelectId) {
    const selector = document.getElementById(targetSelectId);
    if (!selector) return;

    selector.innerHTML = '<option value="">Memuat...</option>';

    const pl = await fetchElibraryPricelist();

    const rawVariants = pl.filter(p => {
        const kat = (p.kategori_order || '').toLowerCase();
        const isReguler = kat.includes('reguler') || kat.includes('regular');
        if (!isReguler) return false;

        let dbModel = p.model.trim().toLowerCase();
        let eModel = model.trim().toLowerCase();

        // Manual Data Mapping
        if (eModel === 'innova zenix') eModel = 'zenix';
        if (eModel === 'innova reborn' && (dbModel === 'reborn' || dbModel === 'innova reborn')) return true;
        if (eModel === 'corolla cross') eModel = 'cross';
        if (eModel === 'corolla altis') eModel = 'altis';
        if (eModel === 'hilux single cabin') eModel = 'single cabin';
        if (eModel === 'hilux double cabin') eModel = 'double cabin';
        if (eModel === 'hilux rangga') eModel = 'rangga';
        if (eModel === 'hiace commuter') eModel = 'hi ace comm';
        if (eModel === 'hiace premio') eModel = 'hi ace premio';

        if (eModel === 'raize' && (dbModel === 'raize' || dbModel === 'raize improvement')) return true;
        if (eModel === 'veloz' && (dbModel === 'veloz' || dbModel === 'veloz hybrid')) return true;
        if (eModel === 'vios' && (dbModel === 'vios' || dbModel === 'vios hybrid')) return true;

        return dbModel === eModel;
    });

    selector.innerHTML = '<option value="">-- Tipe (Opsional) --</option>';

    const seen = new Set();
    rawVariants.forEach(v => {
        const cleanName = (v.tipe_paket || '').trim();
        if (!seen.has(cleanName) && cleanName !== '') {
            seen.add(cleanName);
            selector.innerHTML += `<option value="${cleanName}">${cleanName}</option>`;
        }
    });
}

function renderCompareRow(icon, title, val1, val2) {
    return `
        <div style="margin-bottom: 16px;">
            <div style="text-align:center; font-size:10px; font-weight:800; color:var(--text-muted); margin-bottom:8px; letter-spacing:1px;">
                <i class="fa-solid ${icon}" style="color:var(--text-dark); margin-right:4px;"></i> ${title}
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div style="background:rgba(255,255,255,0.9); border:1px solid rgba(0,0,0,0.04); border-radius:12px; padding:12px; font-size:13px; font-weight:700; color:var(--primary-blue); text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.03); display:flex; align-items:center; justify-content:center;">
                    ${val1}
                </div>
                <div style="background:rgba(255,255,255,0.9); border:1px solid rgba(0,0,0,0.04); border-radius:12px; padding:12px; font-size:13px; font-weight:700; color:var(--primary-red); text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.03); display:flex; align-items:center; justify-content:center;">
                    ${val2}
                </div>
            </div>
        </div>
    `;
}

function compareCars() {
    const m1 = document.getElementById('compareSelect1').value;
    const m2 = document.getElementById('compareSelect2').value;

    // Get types if available
    const typeInput1 = document.getElementById('compareType1');
    const typeInput2 = document.getElementById('compareType2');
    const t1 = typeInput1 ? typeInput1.value : '';
    const t2 = typeInput2 ? typeInput2.value : '';

    const res = document.getElementById('compareResult');

    if (!m1 || !m2) return;

    const s1 = getUnitSpecs(m1, t1);
    const s2 = getUnitSpecs(m2, t2);

    const i1 = getUnitImage(m1);
    const i2 = getUnitImage(m2);

    const title1 = t1 ? `${m1} <span style="font-size:12px; display:block; margin-top:2px; font-weight:700; color:var(--text-dark);">${t1}</span>` : m1;
    const title2 = t2 ? `${m2} <span style="font-size:12px; display:block; margin-top:2px; font-weight:700; color:var(--text-dark);">${t2}</span>` : m2;

    res.innerHTML = `
        <div class="glass-card" style="padding:0; overflow:hidden; border:1px solid rgba(255,255,255,0.8); animation: fadeIn 0.4s ease-out;">
          
          <!-- Header VS -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 16px; background:linear-gradient(135deg, rgba(0,82,204,0.05), rgba(220,38,38,0.05)); position:relative;">
              <div style="flex:1; text-align:center; position:relative; z-index:1;">
                  <div class="car-img-wrapper" style="height:90px; margin-bottom:8px; display:flex; align-items:center; justify-content:center;">
                      <img src="../assets/img/mobil/${i1}" style="max-height:100%; max-width:100%; object-fit:contain; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.15));" onerror="this.src='../assets/img/mobil/avanza.webp'">
                  </div>
                  <h4 style="font-weight:900; font-size:16px; color:var(--primary-blue); line-height:1.2;">${title1}</h4>
              </div>
              
              <!-- Floating VS Badge -->
              <div style="width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, var(--primary-red), #ff0000); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:15px; box-shadow: 0 4px 14px rgba(220,38,38,0.4); z-index:2; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); border:3px solid #fff;">
                  VS
              </div>

              <div style="flex:1; text-align:center; position:relative; z-index:1;">
                  <div class="car-img-wrapper" style="height:90px; margin-bottom:8px; display:flex; align-items:center; justify-content:center;">
                      <img src="../assets/img/mobil/${i2}" style="max-height:100%; max-width:100%; object-fit:contain; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.15));" onerror="this.src='../assets/img/mobil/avanza.webp'">
                  </div>
                  <h4 style="font-weight:900; font-size:16px; color:var(--primary-red); line-height:1.2;">${title2}</h4>
              </div>
          </div>
          
          <!-- Specs List -->
          <div style="padding: 20px 16px 4px 16px; background: rgba(255,255,255,0.7);">
              ${renderCompareRow('fa-users', 'KAPASITAS KURSI', s1.seats, s2.seats)}
              ${renderCompareRow('fa-gas-pump', 'BAHAN BAKAR', s1.fuel, s2.fuel)}
              ${renderCompareRow('fa-gauge-high', 'KAPASITAS MESIN', s1.engine, s2.engine)}
              ${renderCompareRow('fa-gear', 'TRANSMISI', s1.transmisi, s2.transmisi)}
              ${renderCompareRow('fa-car', 'PENGGERAK', s1.penggerak, s2.penggerak)}
          </div>
          
          <!-- Features -->
          <div style="text-align:center; padding:20px 16px; background:linear-gradient(90deg, rgba(0,82,204,0.03), rgba(220,38,38,0.03)); border-top:1px solid rgba(0,0,0,0.05);">
             <div style="display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:800; color:var(--text-dark); letter-spacing:1px; margin-bottom:20px;">
                <i class="fa-solid fa-star" style="color:#f59e0b;"></i> FITUR UNGGULAN
             </div>
             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                <div style="display:flex; flex-direction:column; gap:8px; align-items:center; padding-right:8px; border-right:1px dashed rgba(0,0,0,0.1);">
                    ${s1.fitur.split(',').map(f => `<span style="display:inline-block; font-size:11px; font-weight:700; color:var(--primary-blue); background:rgba(0,82,204,0.08); padding:8px 12px; border-radius:12px; border:1px solid rgba(0,82,204,0.15); box-shadow:0 2px 4px rgba(0,82,204,0.05); width:100%;">${f.trim()}</span>`).join('')}
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; align-items:center; padding-left:8px;">
                    ${s2.fitur.split(',').map(f => `<span style="display:inline-block; font-size:11px; font-weight:700; color:var(--primary-red); background:rgba(220,38,38,0.08); padding:8px 12px; border-radius:12px; border:1px solid rgba(220,38,38,0.15); box-shadow:0 2px 4px rgba(220,38,38,0.05); width:100%;">${f.trim()}</span>`).join('')}
                </div>
             </div>
          </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const container = document.getElementById('libGrid');
        if (container) container.innerHTML = '<p style="text-align:center; grid-column:span 2; color:var(--text-muted); font-size:12px;">Memuat daftar mobil...</p>';

        const res = await fetch('../api/api_pricelist.php?wilayah=Jawa%20Barat');
        const json = await res.json();
        if (json.ok && json.data) {
            const models = new Set();
            json.data.forEach(item => {
                if (item.model) {
                    let m = item.model.toUpperCase().trim();
                    // Normalisasi duplikat dari database
                    if (m === 'REBORN') m = 'INNOVA REBORN';
                    m = m.replace(' IMPROVEMENT', '');
                    m = m.replace(/^NEW\s+/i, '');

                    // Jangan tambahkan model hybrid ke grid sebagai kartu terpisah
                    // (Mereka akan masuk ke dalam dropdown tipe model utamanya)
                    if (m.includes('HYBRID') || m.includes('HEV')) {
                        return;
                    }

                    models.add(m);
                }
            });
            toyotaModels = Array.from(models).sort();
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }

    renderLibrary();
    initCompare();
});

function renderColorSelector(model) {
    const container = document.getElementById('colorSelectorContainer');
    const optionsDiv = document.getElementById('colorOptions');
    const nameSpan = document.getElementById('selectedColorName');

    if (!container) return;

    container.style.display = 'block'; // Force display to show debug if needed

    if (typeof window.carColorData === 'undefined') {
        optionsDiv.innerHTML = '<span style="color:red">Error: carColorData undefined</span>';
        return;
    }

    const m = model.toLowerCase();
    let bestKey = null;

    const mapping = {
        "innova zenix": "Zenix",
        "corolla altis": "Altis",
        "hilux double cabin": "Double Cabin",
        "hilux single cabin": "Single Cabin",
        "hilux rangga": "Rangga",
        "hiace premio": "Hi Ace Premio",
        "hiace commuter": "Hi Ace Commuter",
        "hi ace comm": "Hi Ace Commuter",
        "hi ace premio": "Hi Ace Premio"
    };

    if (mapping[m]) {
        bestKey = mapping[m];
    } else {
        const keys = Object.keys(window.carColorData).sort((a, b) => b.length - a.length);
        for (let k of keys) {
            if (m.includes(k.toLowerCase())) {
                bestKey = k;
                break;
            }
        }
    }

    const colors = bestKey ? window.carColorData[bestKey] : null;

    if (!colors || colors.length === 0) {
        optionsDiv.innerHTML = `<span style="color:red">No colors for: ${model} (bestKey: ${bestKey})</span>`;
        return;
    }

    optionsDiv.innerHTML = '';
    nameSpan.textContent = '';

    colors.forEach((c, index) => {
        const dot = document.createElement('div');
        dot.style.width = '24px';
        dot.style.height = '24px';
        dot.style.borderRadius = '50%';
        dot.style.boxSizing = 'border-box';
        dot.style.border = '2px solid rgba(0,0,0,0.15)';
        dot.style.cursor = 'pointer';
        dot.style.flexShrink = '0';
        dot.style.transition = 'all 0.2s';
        dot.style.overflow = 'hidden';
        dot.style.position = 'relative';
        dot.title = c.name;

        let primaryHex = c.hex;

        // Multi-color handling for 2 tones
        if (c.hex && c.hex.includes('/')) {
            const parts = c.hex.split('/');
            primaryHex = parts[0];
            dot.style.background = `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)`;
            dot.style.backgroundSize = '100% 100%';
            dot.style.backgroundClip = 'padding-box';
        } else {
            dot.style.backgroundColor = primaryHex || '#ccc';
        }

        dot.onclick = () => {
            currentSelectedColorName = c.name;
            // Update image
            if (c.img) document.getElementById('spekImg').src = c.img;
            // Update name
            nameSpan.textContent = `- ${c.name}`;

            // Highlight active
            Array.from(optionsDiv.children).forEach(child => {
                child.style.transform = 'scale(1)';
                child.style.boxShadow = 'none';
                child.style.border = '2px solid rgba(0,0,0,0.1)';
            });
            dot.style.transform = 'scale(1.2)';
            dot.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            dot.style.border = '2px solid var(--primary-red)';
        };

        optionsDiv.appendChild(dot);

        // Select first by default
        if (index === 0) {
            dot.onclick();
        }
    });
}

// =========================================================================
// 📲 WHATSAPP SHARING ENGINE (PRODUCT KNOWLEDGE & E-CATALOG)
// =========================================================================

function generateCarShareMessage(model, variantName, selectedColor) {
    const specs = getUnitSpecs(model, variantName);
    const m = (model || '').trim();
    const v = (variantName || '').trim();

    // Get Price & Kode Tipe
    let priceStr = '-';
    let kodeStr = '-';
    const variantData = (currentElibVariants || []).find(item => item.tipe_paket === variantName);
    if (variantData) {
        if (variantData.harga_mt > 0 && variantData.harga_at > 0) {
            const hMT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_mt).replace('Rp', 'Rp ');
            const hAT = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_at).replace('Rp', 'Rp ');
            priceStr = `${hMT} (M/T) | ${hAT} (A/T)`;
            kodeStr = `${variantData.kode_tipe_mt || '-'} (M/T) | ${variantData.kode_tipe_at || '-'} (A/T)`;
        } else if (variantData.harga_mt > 0) {
            priceStr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_mt).replace('Rp', 'Rp ');
            kodeStr = variantData.kode_tipe_mt || '-';
        } else if (variantData.harga_at > 0) {
            priceStr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variantData.harga_at).replace('Rp', 'Rp ');
            kodeStr = variantData.kode_tipe_at || '-';
        }
    }

    // Get list of all available colors for this model
    let allColorNames = [];
    if (typeof window.carColorData !== 'undefined') {
        const modelLower = m.toLowerCase();
        let bestKey = null;
        const mapping = {
            "innova zenix": "Zenix",
            "corolla altis": "Altis",
            "hilux double cabin": "Double Cabin",
            "hilux single cabin": "Single Cabin",
            "hilux rangga": "Rangga",
            "hiace premio": "Hi Ace Premio",
            "hiace commuter": "Hi Ace Commuter",
            "hi ace comm": "Hi Ace Commuter",
            "hi ace premio": "Hi Ace Premio"
        };
        if (mapping[modelLower]) {
            bestKey = mapping[modelLower];
        } else {
            const keys = Object.keys(window.carColorData).sort((a, b) => b.length - a.length);
            for (let k of keys) {
                if (modelLower.includes(k.toLowerCase())) {
                    bestKey = k;
                    break;
                }
            }
        }
        if (bestKey && window.carColorData[bestKey]) {
            allColorNames = window.carColorData[bestKey].map(c => c.name);
        }
    }

    // Sales Identity
    const salesName = localStorage.getItem('namaSales') || 'Sales Consultant';
    const salesPhone = localStorage.getItem('noHpSales') || localStorage.getItem('no_hp') || '';
    const cleanPhone = salesPhone.replace(/[^0-9]/g, '');

    // E-Catalog link
    const slug = m.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let catalogUrl = `https://salesforcetunassft.com/pages/catalog?model=${encodeURIComponent(slug)}`;
    if (salesName) catalogUrl += `&sales=${encodeURIComponent(salesName)}`;
    if (cleanPhone) catalogUrl += `&phone=${encodeURIComponent(cleanPhone)}`;

    // Build Features text
    const featuresList = (specs.fitur || '').split(',').map(f => `  ✓ ${f.trim()}`).filter(Boolean).join('\n');

    // Build Color text
    let colorSection = '';
    if (selectedColor && selectedColor.trim() !== '') {
        colorSection += `🎨 *Warna Pilihan*: *${selectedColor.trim()}*\n`;
    }
    if (allColorNames.length > 0) {
        colorSection += `🌈 *Pilihan Warna Resmi*:\n` + allColorNames.map(c => `  • ${c}`).join('\n');
    }

    let text = `*🚗 INFORMASI & SPESIFIKASI RESMI TOYOTA 🚗*\n`;
    text += `*TUNAS TOYOTA KIARA CONDONG*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `🚘 *Model*: *TOYOTA ${m.toUpperCase()}*\n`;
    if (v) text += `🏷️ *Tipe / Varian*: *${v}*\n`;
    if (priceStr && priceStr !== '-') text += `💰 *Harga OTR*: *${priceStr}*\n`;
    if (kodeStr && kodeStr !== '-') text += `🔖 *Kode Tipe*: ${kodeStr}\n`;
    text += `\n`;

    text += `📋 *KETERANGAN & SPESIFIKASI*:\n`;
    text += `👥 Kapasitas: *${specs.seats}*\n`;
    text += `⛽ Bahan Bakar: *${specs.fuel}*\n`;
    text += `⚙️ Mesin: *${specs.engine}*\n`;
    text += `🕹️ Transmisi: *${specs.transmisi}*\n`;
    text += `🔄 Penggerak: *${specs.penggerak}*\n\n`;

    if (featuresList) {
        text += `✨ *FITUR-FITUR UNGGULAN*:\n${featuresList}\n\n`;
    }

    if (colorSection) {
        text += `${colorSection}\n\n`;
    }

    text += `📖 *Brosur & E-Catalog Digital Lengkap*:\n${catalogUrl}\n\n`;

    if (typeof window.getSalesSignature === 'function') {
        text += window.getSalesSignature({ nama: salesName, no_hp: cleanPhone }) + '\n\n';
    } else {
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `📲 *Konsultasi Pembelian, Test Drive & Simulasi Kredit:*\n`;
        text += `👤 *${salesName}* (Sales Consultant)\n`;
        if (cleanPhone) {
            text += `📞 *WhatsApp*: https://wa.me/${cleanPhone}\n`;
        }
        text += `🏢 *TUNAS TOYOTA KIARACONDONG BANDUNG*\n`;
        text += `📍 Jl. Ibrahim Adjie No. 372, Kiara Condong, Bandung\n\n`;
    }

    text += `_Dapatkan promo DP ringan, bunga spesial 0%, dan bonus aksesoris khusus bulan ini!_ 🔥`;

    return text;
}

function shareCarToWhatsApp(customModel = null) {
    const model = customModel || currentElibModel;
    const variantSelect = document.getElementById('variantSelector');
    const variantName = (variantSelect && variantSelect.value) ? variantSelect.value : currentSelectedVariantName;
    const selectedColor = currentSelectedColorName;

    const message = generateCarShareMessage(model, variantName, selectedColor);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

function copyCarSpecsToClipboard() {
    const model = currentElibModel;
    const variantSelect = document.getElementById('variantSelector');
    const variantName = (variantSelect && variantSelect.value) ? variantSelect.value : currentSelectedVariantName;
    const selectedColor = currentSelectedColorName;

    const message = generateCarShareMessage(model, variantName, selectedColor);
    navigator.clipboard.writeText(message).then(() => {
        alert('Format teks spesifikasi lengkap berhasil disalin ke clipboard!');
    }).catch(() => {
        alert('Gagal menyalin ke clipboard.');
    });
}

async function quickShareCar(model) {
    let variantName = '';
    const pl = await fetchElibraryPricelist();
    const rawVariants = pl.filter(p => {
        const kat = (p.kategori_order || '').toLowerCase();
        const isReguler = kat.includes('reguler') || kat.includes('regular');
        if (!isReguler) return false;

        let dbModel = p.model.trim().toLowerCase();
        dbModel = dbModel.replace(/\s+hybrid/gi, '').replace(/\s+hev/gi, '').trim();
        let eModel = model.trim().toLowerCase();

        if (eModel === 'innova zenix') eModel = 'zenix';
        if (eModel === 'innova reborn' && (dbModel === 'reborn' || dbModel === 'innova reborn')) return true;
        if (eModel === 'corolla cross') eModel = 'cross';
        if (eModel === 'corolla altis') eModel = 'altis';
        if (eModel === 'hilux single cabin') eModel = 'single cabin';
        if (eModel === 'hilux double cabin') eModel = 'double cabin';
        if (eModel === 'hilux rangga') eModel = 'rangga';
        if (eModel === 'hiace commuter') eModel = 'hi ace comm';
        if (eModel === 'hiace premio') eModel = 'hi ace premio';

        if (eModel === 'raize' && (dbModel === 'raize' || dbModel === 'raize improvement')) return true;
        if (eModel === 'veloz' && (dbModel === 'veloz')) return true;
        if (eModel === 'vios' && (dbModel === 'vios')) return true;

        return dbModel === eModel;
    });

    if (rawVariants.length > 0) {
        variantName = rawVariants[0].tipe_paket;
        currentElibVariants = rawVariants;
    }

    const message = generateCarShareMessage(model, variantName, '');
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

