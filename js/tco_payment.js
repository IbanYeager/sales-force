document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data dari sessionStorage
    const orderDataRaw = sessionStorage.getItem('tcoOrderData');
    if (!orderDataRaw) {
        // Jika tidak ada data, redirect kembali ke tco
        window.location.href = 'tco.html';
        return;
    }

    const orderData = JSON.parse(orderDataRaw);
    
    // Set total harga di state pembayaran
    document.getElementById('payAmount').innerText = orderData.orderPrice;

    // Set data di nota / receipt state
    if (document.getElementById('receiptName')) document.getElementById('receiptName').innerText = orderData.customerName || '-';
    if (document.getElementById('receiptPhone')) document.getElementById('receiptPhone').innerText = orderData.customerPhone || '-';
    
    const carStr = `${orderData.orderModel || ''} [Grade: ${orderData.selectedGrade || 'Semua Tipe'}]${orderData.carDetails ? ` - ${orderData.carDetails}` : ''}`;
    if (document.getElementById('receiptCar')) document.getElementById('receiptCar').innerText = carStr;
    if (document.getElementById('receiptItem')) document.getElementById('receiptItem').innerText = orderData.orderItem || '-';
    
    const isPkg = (orderData.orderItem && (orderData.orderItem.toLowerCase().includes('package') || orderData.orderItem.toLowerCase().includes('paket'))) ||
                  (orderData.partNumber && /^[A-Z]{2}(\s*,\s*[A-Z]{2})*$/i.test(orderData.partNumber.trim()));
    const receiptPnRow = document.getElementById('receiptPnRow');
    if (receiptPnRow) {
        receiptPnRow.style.display = isPkg ? 'none' : 'flex';
    }
    if (document.getElementById('receiptPn')) document.getElementById('receiptPn').innerText = isPkg ? '-' : (orderData.partNumber || '-');

    if (document.getElementById('receiptScheme')) document.getElementById('receiptScheme').innerText = orderData.priceType || 'RTCO After Tax';
    if (document.getElementById('receiptTotal')) document.getElementById('receiptTotal').innerText = orderData.orderPrice || '-';

    // Generate random transaction ID
    const randomId = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('receiptId').innerText = `TCO-${randomId}`;

    // Format current date
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('receiptDate').innerText = now.toLocaleDateString('id-ID', options).replace('.', ':') + ' WIB';

    // 2. Start Countdown Timer (15 menit) with circular progress
    startCircularTimer(15 * 60);
});

function startCircularTimer(durationInSeconds) {
    let timer = durationInSeconds;
    const totalDuration = durationInSeconds;
    const display = document.getElementById('countdownTimer');
    const progressCircle = document.getElementById('timerProgress');
    
    // SVG circle circumference (2 * PI * r, r=36)
    const circumference = 2 * Math.PI * 36; // ≈ 226.19
    progressCircle.style.strokeDasharray = circumference;
    
    const interval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        // Update circular progress
        const progress = timer / totalDuration;
        const offset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = offset;

        // Color transition based on remaining time
        const percentLeft = (timer / totalDuration) * 100;
        if (percentLeft > 50) {
            progressCircle.style.stroke = '#10b981'; // Green
        } else if (percentLeft > 20) {
            progressCircle.style.stroke = '#f59e0b'; // Yellow/amber
        } else {
            progressCircle.style.stroke = '#ef4444'; // Red
            display.style.color = '#ef4444';
        }

        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "00:00";
            progressCircle.style.strokeDashoffset = circumference;
            // Tindakan jika waktu habis, bisa redirect
            if (typeof showCustomAlert === 'function') {
                showCustomAlert("Waktu Habis", "Waktu pembayaran telah habis. Silakan ulangi pemesanan.", "warning");
            } else {
                alert("Waktu pembayaran telah habis.");
            }
            setTimeout(() => {
                window.location.href = 'tco.html';
            }, 1500);
        }
    }, 1000);
}

function simulatePayment() {
    const paymentState = document.getElementById('paymentState');
    const loadingState = document.getElementById('loadingState');
    const receiptState = document.getElementById('receiptState');
    const mainHeader = document.getElementById('mainHeader');
    const progressSteps = document.getElementById('progressSteps');

    // Sembunyikan payment, tampilkan loading
    paymentState.style.display = 'none';
    loadingState.style.display = 'flex';

    // Sembunyikan header back button & progress steps saat memproses
    mainHeader.style.display = 'none';
    if (progressSteps) progressSteps.style.display = 'none';

    // Potong stok TCO di database
    const orderDataRaw = sessionStorage.getItem('tcoOrderData');
    if (orderDataRaw) {
        try {
            const orderData = JSON.parse(orderDataRaw);
            if (orderData.orderItem) {
                fetch('../api/api_spv_manage_tco.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'order_item', name: orderData.orderItem })
                }).catch(e => console.error("Error reducing TCO stock:", e));
            }
        } catch(e) {}
    }

    // Simulasi delay jaringan (2 detik)
    setTimeout(() => {
        loadingState.style.display = 'none';
        receiptState.style.display = 'flex';

        // Update progress steps to show Step 4 (Selesai) as active
        if (progressSteps) {
            progressSteps.style.display = 'flex';
            progressSteps.innerHTML = `
                <div class="step-item">
                    <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                    <span class="step-label completed">Pilih</span>
                </div>
                <div class="step-connector completed"></div>
                <div class="step-item">
                    <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                    <span class="step-label completed">Detail</span>
                </div>
                <div class="step-connector completed"></div>
                <div class="step-item">
                    <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                    <span class="step-label completed">Bayar</span>
                </div>
                <div class="step-connector completed"></div>
                <div class="step-item">
                    <div class="step-circle completed"><i class="fa-solid fa-flag" style="font-size:10px;"></i></div>
                    <span class="step-label completed">Selesai</span>
                </div>
            `;
        }
        
        // Hapus data session agar tidak bisa diulang (opsional)
        // sessionStorage.removeItem('tcoOrderData');
    }, 2000);
}

function finishOrder() {
    sessionStorage.removeItem('tcoOrderData');
    window.location.href = 'tco.html';
}

function downloadReceipt() {
    const receiptElement = document.getElementById('receiptCardToDownload');
    
    // Sembunyikan elemen yang tidak perlu jika ada (sementara)
    // Kemudian gunakan html2canvas
    if (typeof html2canvas !== 'undefined') {
        html2canvas(receiptElement, {
            scale: 2, // Biar resolusi tinggi
            backgroundColor: "#f3f5fa" // Biar tepiannya mengikuti warna body
        }).then(canvas => {
            const image = canvas.toDataURL("image/png");
            
            // Buat elemen <a> untuk download otomatis
            const link = document.createElement('a');
            link.href = image;
            const txId = document.getElementById('receiptId').innerText;
            link.download = `Nota_${txId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            if (typeof showCustomAlert === 'function') {
                showCustomAlert("Berhasil!", "Nota berhasil disimpan ke galeri.", "success");
            } else {
                alert("Nota berhasil disimpan!");
            }
        }).catch(err => {
            console.error("Gagal membuat gambar nota:", err);
            alert("Maaf, terjadi kesalahan saat menyimpan nota.");
        });
    } else {
        alert("Library html2canvas belum termuat. Pastikan koneksi internet stabil.");
    }
}
