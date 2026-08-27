const sales_account_id = localStorage.getItem('idSales') || 1;

    function formatRupiahInput(value) {
      let number_string = value.replace(/[^,\d]/g, '').toString(),
          split = number_string.split(','),
          sisa = split[0].length % 3,
          rupiah = split[0].substr(0, sisa),
          ribuan = split[0].substr(sisa).match(/\d{3}/gi);
      
      if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }
      
      rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
      return rupiah;
    }

    function loadPricelist() {
      fetch('../api/api_inventory.php')
        .then(r => r.json())
        .then(res => {
          if (res.data) {
            const select = document.getElementById('modelSelect');
            select.innerHTML = '<option value="">-- Pilih Tipe Mobil --</option>';
            
            // Group options by Model to keep it organized
            const groups = {};
            res.data.forEach(car => {
                const modelName = car.model || car.product_description || 'Toyota Vehicle';
                if (!groups[modelName]) groups[modelName] = [];
                groups[modelName].push(car);
            });

            Object.keys(groups).sort().forEach(model => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = model;

                groups[model].forEach(car => {
                    let opt = document.createElement('option');
                    const varianStr = car.varian || car.product_code || '';
                    const warnaStr = car.warna || car.color_description || '-';
                    const transmisiStr = car.transmisi ? ` - ${car.transmisi}` : '';
                    const bbmStr = car.bahan_bakar ? ` - ${car.bahan_bakar}` : '';

                    const label = `${model} ${varianStr} (${warnaStr})${transmisiStr}${bbmStr}`;
                    opt.value = label;
                    opt.dataset.harga = car.harga || 0;

                    const statusVal = String(car.status || car.availability_status || '');
                    let statusText = (statusVal.toLowerCase().includes('tersedia') || statusVal.toLowerCase().includes('available') || Number(car.stok) > 0 || Number(car.stock) > 0) ? 'Ready' : 'Inden';
                    let hargaText = car.harga ? `Rp ${formatRupiahInput(car.harga.toString())}` : 'Harga TBD';

                    opt.textContent = `[${statusText}] ${label} - ${hargaText}`;
                    optgroup.appendChild(opt);
                });
                select.appendChild(optgroup);
            });
            
            const gameSelect = document.getElementById('gameModelSelect');
            if (gameSelect) {
              gameSelect.innerHTML = select.innerHTML;
            }

            // Initialize Select2 after options are populated
            if (window.jQuery && $.fn.select2) {
                $(select).select2({
                    placeholder: "-- Pilih Tipe Mobil --",
                    allowClear: true,
                    width: '100%'
                });
                $(select).on('change', function() {
                    updateNominal();
                });
            }
          }
        })
        .catch(err => console.error("Error loading inventory:", err));
    }

    function updateNominal() {
      const select = document.getElementById('modelSelect');
      const selected = select.options[select.selectedIndex];
      const modelInput = document.getElementById('model');
      const nominalInput = document.getElementById('nominal');

      if (selected && selected.value !== "") {
        modelInput.value = selected.value;
        nominalInput.value = formatRupiahInput(selected.dataset.harga.toString());
      } else {
        modelInput.value = "";
        nominalInput.value = "";
      }
    }

    let allSPKData = [];

    function renderSpkList(dataToRender) {
      const listEl = document.getElementById('spkList');
      if (!listEl) return;

      if (dataToRender.length === 0) {
        listEl.innerHTML = '<p style="font-size:12px;color:var(--text-muted);line-height:1.6;">Tidak ada pengajuan yang sesuai.</p>';
        return;
      }

      listEl.innerHTML = dataToRender.map(s => {
        let badgeClass = 'chip-yellow';
        if (s.status === 'Disetujui' || s.status === 'DO') badgeClass = 'chip-green';
        else if (s.status === 'Ditolak') badgeClass = 'chip-red';

        return `
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="font-size:13px; margin:0 0 4px 0;">${s.nama_customer}</h4>
              <p style="font-size:11px; color:var(--text-muted); margin:0;">${s.model} • Rp ${s.nominal_jt} Jt • ${s.tipe_pembelian}</p>
            </div>
            <span class="chip ${badgeClass}" style="font-size:10px; font-weight:800; padding:4px 8px;">${s.status}</span>
          </div>
        `;
      }).join('');
    }

    function filterSpkList() {
      const keyword = document.getElementById('searchSpk').value.toLowerCase();
      if (!keyword) {
        // limit initial load to 20 to avoid clutter if too many
        renderSpkList(allSPKData.slice(0, 20));
        return;
      }
      const filtered = allSPKData.filter(s => 
        s.nama_customer.toLowerCase().includes(keyword) || 
        s.model.toLowerCase().includes(keyword) || 
        s.status.toLowerCase().includes(keyword)
      );
      renderSpkList(filtered.slice(0, 50));
    }

    function fetchSpk() {
      fetch(`../api/api_spk.php?sales_account_id=${sales_account_id}`)
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success' && res.data) {
            allSPKData = res.data;
            filterSpkList();
          }
        })
        .catch(err => console.error("Error loading SPKs:", err));
    }

    function submitSpk() {
      const nama = document.getElementById('namaCustomer').value.trim();
      const hp = document.getElementById('noHp').value.trim();
      const model = document.getElementById('model').value.trim();
      const nominalRaw = document.getElementById('nominal').value;
      const nominal = nominalRaw.replace(/\D/g, ''); // hapus titik
      const tipePembelian = document.getElementById('tipePembelian').value;

      if (!nama || !hp || !model) {
        alert('Nama customer, No. HP, dan Tipe Mobil wajib diisi.');
        return;
      }

      const btn = document.querySelector('.btn-main');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

      const signatureCanvas = document.getElementById('signatureCanvas');
      let signatureData = '';
      if (signatureCanvas) {
        // Only capture if user drew something (simple check: data length > some minimum)
        const dataUrl = signatureCanvas.toDataURL();
        if (dataUrl.length > 2000) { // arbitrary threshold to check if it's not empty
          signatureData = dataUrl;
        }
      }

      fetch('../api/api_spk.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          sales_account_id,
          nama_customer: nama,
          no_hp: hp,
          model,
          nominal,
          tipe_pembelian: tipePembelian,
          signature: signatureData
        })
      })
        .then(r => r.json())
        .then(res => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i> Submit SPK';

          if (res.status === 'success') {
            if (typeof confetti === 'function') {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 250);
              setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 400);
            }

            if (window.showCustomAlert) {
              window.showCustomAlert('🎉 SELAMAT! SPK BERHASIL SUBMIT!', 'Pengajuan SPK baru berhasil dicatat & Lencana Prestasi "Top Closer" aktif!', 'success');
            } else {
              alert('🎉 Selamat! SPK baru berhasil submit!');
            }

            document.getElementById('namaCustomer').value = '';
            document.getElementById('noHp').value = '';
            fetchSpk();
          } else {
            alert('Gagal: ' + res.message);
          }
        })
        .catch(err => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i> Submit SPK';
          console.error(err);
          alert('Gagal terhubung ke server.');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
      fetchSpk();
      loadPricelist();

      // Signature Canvas Logic
      const canvas = document.getElementById('signatureCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        
        // Setup canvas resolution
        function resizeCanvas() {
          const rect = canvas.parentElement.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = 200;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#0f172a';
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function startDrawing(e) {
          isDrawing = true;
          draw(e);
        }

        function stopDrawing() {
          isDrawing = false;
          ctx.beginPath();
        }

        function draw(e) {
          if (!isDrawing) return;
          e.preventDefault();
          
          let clientX, clientY;
          if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else {
            clientX = e.clientX;
            clientY = e.clientY;
          }
          
          const rect = canvas.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        canvas.addEventListener('touchstart', startDrawing, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', stopDrawing);
      }
    });

    window.clearSignature = function(e) {
      if (e) e.preventDefault();
      const canvas = document.getElementById('signatureCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

/* =========================================================
   SPK Input Mode Switcher & Game Logic (SPK Grand Prix)
   ========================================================= */

// Audio Synth Helpers (Web Audio API)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

function playEngineRev() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {}
}

function playVictoryFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
    });
  } catch (e) {}
}

// Mode Switcher
window.switchSpkMode = function(mode) {
  playClickSound();
  const btnBiasa = document.getElementById('btnModeBiasa');
  const btnGame = document.getElementById('btnModeGame');
  const containerBiasa = document.getElementById('inputBiasaContainer');
  const containerGame = document.getElementById('inputGameContainer');

  if (!btnBiasa || !btnGame || !containerBiasa || !containerGame) return;

  if (mode === 'game') {
    btnBiasa.classList.remove('active');
    btnGame.classList.add('active');
    containerBiasa.style.display = 'none';
    containerGame.style.display = 'block';
    if (typeof initArcadeSpkGame === 'function') {
      setTimeout(initArcadeSpkGame, 50);
    }
  } else {
    btnGame.classList.remove('active');
    btnBiasa.classList.add('active');
    containerGame.style.display = 'none';
    containerBiasa.style.display = 'block';
  }
};

// Game State & Navigation
let currentGameStage = 1;

window.nextGameStage = function(targetStage) {
  if (currentGameStage === 1) {
    const nama = document.getElementById('gameNamaCustomer').value.trim();
    const hp = document.getElementById('gameNoHp').value.trim();
    if (!nama || !hp) {
      alert('Mohon isi Nama Customer dan Nomor HP terlebih dahulu untuk lanjut!');
      return;
    }
  } else if (currentGameStage === 2) {
    const model = document.getElementById('gameModel').value.trim();
    if (!model) {
      alert('Mohon pilih Tipe Mobil terlebih dahulu!');
      return;
    }
  }

  setGameStage(targetStage);
  playEngineRev();
};

window.prevGameStage = function(targetStage) {
  playClickSound();
  setGameStage(targetStage);
};

function setGameStage(stageNum) {
  currentGameStage = stageNum;

  document.querySelectorAll('.game-stage-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('gameVictoryCard').classList.remove('active');

  const panel = document.getElementById(`gameStage${stageNum}`);
  if (panel) panel.classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const item = document.getElementById(`stepItem${i}`);
    if (!item) continue;
    item.classList.remove('active', 'completed');
    if (i === stageNum) {
      item.classList.add('active');
    } else if (i < stageNum) {
      item.classList.add('completed');
    }
  }

  const scoreText = document.getElementById('gameScoreText');
  if (scoreText) {
    scoreText.textContent = `${stageNum * 150} SPEED XP`;
  }

  if (stageNum === 3) {
    setTimeout(initGameSignatureCanvas, 100);
  }
}

window.updateGameNominal = function() {
  const select = document.getElementById('gameModelSelect');
  const selected = select.options[select.selectedIndex];
  const modelInput = document.getElementById('gameModel');
  const nominalInput = document.getElementById('gameNominal');

  if (selected && selected.value !== "") {
    modelInput.value = selected.value;
    nominalInput.value = formatRupiahInput(selected.dataset.harga ? selected.dataset.harga.toString() : "0");
  } else {
    modelInput.value = "";
    nominalInput.value = "";
  }
};

window.selectGamePayment = function(type) {
  playClickSound();
  document.getElementById('gameTipePembelian').value = type;
  const cardKredit = document.getElementById('payCardKredit');
  const cardCash = document.getElementById('payCardCash');

  if (type === 'Cash') {
    cardKredit.classList.remove('selected');
    cardCash.classList.add('selected');
  } else {
    cardCash.classList.remove('selected');
    cardKredit.classList.add('selected');
  }
};

// Game Signature Canvas
let isGameCanvasInit = false;
let gameCanvasCtx = null;
let isGameDrawing = false;

function initGameSignatureCanvas() {
  const canvas = document.getElementById('gameSignatureCanvas');
  if (!canvas) return;

  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width || 300;
  canvas.height = 180;
  gameCanvasCtx = canvas.getContext('2d');
  gameCanvasCtx.lineWidth = 3;
  gameCanvasCtx.lineCap = 'round';
  gameCanvasCtx.strokeStyle = '#fbbf24';

  if (isGameCanvasInit) return;
  isGameCanvasInit = true;

  function startDraw(e) {
    isGameDrawing = true;
    draw(e);
  }
  function stopDraw() {
    isGameDrawing = false;
    if (gameCanvasCtx) gameCanvasCtx.beginPath();
  }
  function draw(e) {
    if (!isGameDrawing || !gameCanvasCtx) return;
    e.preventDefault();
    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;

    gameCanvasCtx.lineTo(x, y);
    gameCanvasCtx.stroke();
    gameCanvasCtx.beginPath();
    gameCanvasCtx.moveTo(x, y);
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseout', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDraw);
}

window.clearGameSignature = function(e) {
  if (e) e.preventDefault();
  const canvas = document.getElementById('gameSignatureCanvas');
  if (canvas && gameCanvasCtx) {
    gameCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

// Submit SPK via Game Mode
window.submitGameSpk = function() {
  const nama = document.getElementById('gameNamaCustomer').value.trim();
  const hp = document.getElementById('gameNoHp').value.trim();
  const model = document.getElementById('gameModel').value.trim();
  const nominalRaw = document.getElementById('gameNominal').value;
  const nominal = nominalRaw.replace(/\D/g, '');
  const tipePembelian = document.getElementById('gameTipePembelian').value;

  if (!nama || !hp || !model) {
    alert('Nama Customer, No. HP, dan Tipe Mobil wajib diisi.');
    return;
  }

  const btn = document.getElementById('btnSubmitGameSpk');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMPROSES SUBMIT...';

  const canvas = document.getElementById('gameSignatureCanvas');
  let signatureData = '';
  if (canvas) {
    const dataUrl = canvas.toDataURL();
    if (dataUrl.length > 2000) {
      signatureData = dataUrl;
    }
  }

  fetch('../api/api_spk.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submit',
      sales_account_id,
      nama_customer: nama,
      no_hp: hp,
      model,
      nominal,
      tipe_pembelian: tipePembelian,
      signature: signatureData
    })
  })
    .then(r => r.json())
    .then(res => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-trophy" style="font-size:18px;"></i> <span>CROSS FINISH LINE & SUBMIT SPK</span>';

      if (res.status === 'success') {
        document.querySelectorAll('.game-stage-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('gameVictoryCard').classList.add('active');

        playVictoryFanfare();

        if (typeof confetti === 'function') {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0 } }), 300);
          setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1 } }), 500);
        }

        fetchSpk();
      } else {
        alert('Gagal: ' + res.message);
      }
    })
    .catch(err => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-trophy" style="font-size:18px;"></i> <span>CROSS FINISH LINE & SUBMIT SPK</span>';
      console.error(err);
      alert('Gagal terhubung ke server.');
    });
};

window.resetGameSpkForm = function() {
  document.getElementById('gameNamaCustomer').value = '';
  document.getElementById('gameNoHp').value = '';
  document.getElementById('gameModelSelect').value = '';
  document.getElementById('gameModel').value = '';
  document.getElementById('gameNominal').value = '';
  clearGameSignature();
  setGameStage(1);
};
