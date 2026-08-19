let velgData = [];

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function updateProductCount(count) {
    const el = document.getElementById('velgCountText');
    if (el) el.textContent = `${count} Produk`;
}

async function renderGrid(filter = 'semua') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Memuat katalog velg & ban...</div>';

    try {
        const res = await fetch(`../api/api_velg.php?category=${encodeURIComponent(filter)}`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
            velgData = json.data;
        }
    } catch (e) {
        console.error('Gagal memuat api_velg.php:', e);
    }

    grid.innerHTML = '';
    updateProductCount(velgData.length);

    if (velgData.length === 0) {
        grid.innerHTML = `
            <div class="velg-empty">
                <div class="velg-empty-icon"><i class="fa-solid fa-box-open"></i></div>
                <h4>Tidak Ada Produk</h4>
                <p>Belum ada produk di kategori ini.</p>
            </div>`;
        return;
    }

    velgData.forEach((item, index) => {
        const isBan = item.category === 'ban';
        const badgeClass = item.preorder ? 'velg-badge-po' : 'velg-badge-ready';
        const badgeIcon = item.preorder ? 'fa-clock' : 'fa-circle-check';

        // Build spec tags
        let specTags = `<span class="velg-spec"><i class="fa-solid fa-ring"></i> ${item.ring}</span>`;
        if (!isBan && item.pcd !== '-') {
            specTags += `<span class="velg-spec"><i class="fa-solid fa-gear"></i> ${item.pcd}</span>`;
        }
        specTags += `<span class="velg-spec"><i class="fa-solid fa-arrows-left-right"></i> ${item.lebar}</span>`;

        const html = `
            <div class="velg-card" onclick="openDetail(${item.id})" style="animation: fadeSlideUp 0.4s ${index * 0.06}s both;">
                <div class="velg-card-img">
                    <span class="velg-badge ${badgeClass}">
                        <i class="fa-solid ${badgeIcon}"></i> ${item.status}
                    </span>
                    <img src="${item.img}" alt="${item.brand} ${item.name}">
                </div>
                <div class="velg-card-body">
                    <div class="velg-card-brand">${item.brand}</div>
                    <h3 class="velg-card-name">${item.name}</h3>
                    <div class="velg-specs">${specTags}</div>
                    <div class="velg-card-footer">
                        <div class="velg-price-block">
                            <span class="velg-price-label">Estimasi Harga</span>
                            <span class="velg-price-value">${formatRupiah(item.price)}</span>
                        </div>
                        <button class="velg-btn-add" onclick="event.stopPropagation(); pesananCepat(${item.id})" title="Ajukan Pesanan">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function updateProductCount(count) {
    const el = document.getElementById('velgCountText');
    if (el) el.textContent = `${count} Produk`;
}

function renderGrid(filter = 'semua') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    let filteredData = velgData;
    if (filter !== 'semua') {
        filteredData = velgData.filter(item => item.category === filter);
    }

    updateProductCount(filteredData.length);

    if (filteredData.length === 0) {
        grid.innerHTML = `
            <div class="velg-empty">
                <div class="velg-empty-icon"><i class="fa-solid fa-box-open"></i></div>
                <h4>Tidak Ada Produk</h4>
                <p>Belum ada produk di kategori ini.</p>
            </div>`;
        return;
    }

    filteredData.forEach((item, index) => {
        const isBan = item.category === 'ban';
        const badgeClass = item.preorder ? 'velg-badge-po' : 'velg-badge-ready';
        const badgeIcon = item.preorder ? 'fa-clock' : 'fa-circle-check';

        // Build spec tags
        let specTags = `<span class="velg-spec"><i class="fa-solid fa-ring"></i> ${item.ring}</span>`;
        if (!isBan && item.pcd !== '-') {
            specTags += `<span class="velg-spec"><i class="fa-solid fa-gear"></i> ${item.pcd}</span>`;
        }
        specTags += `<span class="velg-spec"><i class="fa-solid fa-arrows-left-right"></i> ${item.lebar}</span>`;

        const html = `
            <div class="velg-card" onclick="openDetail(${item.id})" style="animation: fadeSlideUp 0.4s ${index * 0.06}s both;">
                <div class="velg-card-img">
                    <span class="velg-badge ${badgeClass}">
                        <i class="fa-solid ${badgeIcon}"></i> ${item.status}
                    </span>
                    <img src="${item.img}" alt="${item.brand} ${item.name}">
                </div>
                <div class="velg-card-body">
                    <div class="velg-card-brand">${item.brand}</div>
                    <h3 class="velg-card-name">${item.name}</h3>
                    <div class="velg-specs">${specTags}</div>
                    <div class="velg-card-footer">
                        <div class="velg-price-block">
                            <span class="velg-price-label">Estimasi Harga</span>
                            <span class="velg-price-value">${formatRupiah(item.price)}</span>
                        </div>
                        <button class="velg-btn-add" onclick="event.stopPropagation(); pesananCepat(${item.id})" title="Ajukan Pesanan">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('.velg-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.currentTarget;
            tabs.forEach(t => t.classList.remove('active'));
            target.classList.add('active');
            const category = target.getAttribute('data-category');
            renderGrid(category);
        });
    });
}

// ── Modal Logic ────────────────────────────────────────────
const modal = document.getElementById('velgModal');

function openDetail(id) {
    const item = velgData.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modalBrand').textContent = item.brand;
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalPrice').textContent = formatRupiah(item.price);
    document.getElementById('modalImg').src = item.img;
    document.getElementById('modalRing').textContent = item.ring;
    document.getElementById('modalPcd').textContent = item.pcd;
    document.getElementById('modalLebar').textContent = item.lebar;

    const kondisiEl = document.getElementById('modalKondisi');
    if (item.preorder) {
        kondisiEl.textContent = 'Pre-order';
        kondisiEl.style.color = 'var(--yellow-warn)';
    } else {
        kondisiEl.textContent = 'Ready Stock';
        kondisiEl.style.color = 'var(--green-success)';
    }

    document.getElementById('btnPesanDetail').onclick = () => {
        closeModal();
        pesananCepat(id);
    };

    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

async function pesananCepat(id) {
    const item = velgData.find(i => i.id === id);
    const isConfirmed = await (window.customConfirm
        ? window.customConfirm(`Apakah Anda ingin mengajukan pesanan untuk ${item.brand} ${item.name} seharga ${formatRupiah(item.price)}?`)
        : window.confirm(`Apakah Anda ingin mengajukan pesanan untuk ${item.brand} ${item.name}?`));

    if (isConfirmed) {
        if (window.showCustomAlert) {
            showCustomAlert('Berhasil', `Pesanan untuk ${item.name} berhasil ditambahkan ke draft!`, 'success');
        } else {
            alert(`Pesanan untuk ${item.name} berhasil ditambahkan ke keranjang/draft!`);
        }
    }
}

// ── Fade-in Animation via CSS keyframes ────────────────────
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes fadeSlideUp {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    initTabs();
});
