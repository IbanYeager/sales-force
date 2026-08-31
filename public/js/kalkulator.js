let currentTenor = 3;
        let currentMetode = 'flat';

        const formatRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

        // Parse formatted string "200.000.000" -> 200000000
        function parseNum(str) {
            return Math.max(0, parseInt(String(str).replace(/\./g, ''), 10) || 0);
        }

        // Format number -> "200.000.000"
        function numToFormatted(n) {
            return Math.round(n).toLocaleString('id-ID');
        }

        // Auto-format dots while user types (keeps cursor position)
        function formatInput(el) {
            const raw = el.value.replace(/\./g, '').replace(/[^0-9]/g, '');
            if (raw === '') { el.value = ''; return; }
            const num = parseInt(raw, 10);
            const formatted = num.toLocaleString('id-ID');
            el.value = formatted;
        }

        // Sync: slider moved -> update text input (formatted)
        function updateHarga(val) {
            document.getElementById('inputHarga').value = numToFormatted(Number(val));
        }

        // Sync: text input changed -> update slider (clamped)
        function syncHarga(val) {
            const v = parseNum(val);
            const clamped = Math.min(Math.max(v, 100000000), 1500000000);
            document.getElementById('rangeHarga').value = clamped;
        }

        function updateTdp(val) {
            document.getElementById('inputTdp').value = numToFormatted(Number(val));
        }

        function syncTdp(val) {
            const v = parseNum(val);
            const clamped = Math.min(v, 500000000);
            document.getElementById('rangeTdp').value = clamped;
        }

        function setTenor(th, el) {
            currentTenor = th;
            document.querySelectorAll('.tenor-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
        }

        function setMetode(mode, el) {
            currentMetode = mode;
            document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
        }

        function updateBunga() {
            const rate = Number(document.getElementById('selectProvinsi').value);
            const pct = (rate * 100).toFixed(2).replace('.', ',');
            document.getElementById('bungaText').textContent = `Bunga ${pct}% p.a. (flat acuan)`;
        }

        // ===== CALCULATION =====
        function getHarga() {
            return parseNum(document.getElementById('inputHarga').value);
        }

        function getTdp() {
            return parseNum(document.getElementById('inputTdp').value);
        }


        function hitungFlat(pokok, bungaPA, tahun) {
            // Flat rate: cicilan = (pokok + pokok * rate * tahun) / totalBulan
            const bulan = tahun * 12;
            const totalBunga = pokok * bungaPA * tahun;
            const cicilan = (pokok + totalBunga) / bulan;
            return { cicilan, totalBunga };
        }

        function hitungEfektif(pokok, bungaPA, tahun) {
            // Efektif: bunga dihitung atas saldo pokok yang tersisa setiap bulan (declining balance)
            // Cicilan berbeda tiap bulan — tampilkan cicilan bulan pertama
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
            // Untuk display, tampilkan rata-rata cicilan
            const cicilanRata = (pokok + totalBunga) / bulan;
            return { cicilan: cicilanRata, totalBunga, cicilanPertama };
        }

        function hitungAnuitas(pokok, bungaPA, tahun) {
            // Anuitas (PMT formula): cicilan tetap setiap bulan
            const bulan = tahun * 12;
            const r = bungaPA / 12; // bunga per bulan
            let cicilan;
            if (r === 0) {
                cicilan = pokok / bulan;
            } else {
                cicilan = pokok * r * Math.pow(1 + r, bulan) / (Math.pow(1 + r, bulan) - 1);
            }
            const totalBunga = (cicilan * bulan) - pokok;
            return { cicilan, totalBunga };
        }

        function hitung() {
            const harga = getHarga();
            const tdp = getTdp();
            const admin = parseNum(document.getElementById('inputAdmin').value);
            const asuransi = parseNum(document.getElementById('inputAsuransi').value);
            const leasing = document.getElementById('selectLeasing').options[document.getElementById('selectLeasing').selectedIndex].text;
            const tahun = currentTenor;
            const bulan = tahun * 12;
            const bungaPA = Number(document.getElementById('selectProvinsi').value);

            if (tdp >= harga) {
                alert('Uang muka (TDP) tidak boleh melebihi harga OTR!');
                return;
            }

            const btn = document.getElementById('btnCalc');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Menghitung...</span>';

            setTimeout(() => {
                const pokok = harga - tdp;
                let cicilan, totalBunga;
                let metodeLabel = '';

                if (currentMetode === 'flat') {
                    ({ cicilan, totalBunga } = hitungFlat(pokok, bungaPA, tahun));
                    metodeLabel = 'Flat Rate';
                } else if (currentMetode === 'efektif') {
                    ({ cicilan, totalBunga } = hitungEfektif(pokok, bungaPA, tahun));
                    metodeLabel = 'Efektif (Avg)';
                } else {
                    ({ cicilan, totalBunga } = hitungAnuitas(pokok, bungaPA, tahun));
                    metodeLabel = 'Anuitas';
                }

                // Total Bayar = Cicilan total + TDP Pokok + Admin + Asuransi
                const totalBayar = (cicilan * bulan) + tdp + admin + asuransi;
                const tdpFinal = tdp + admin + asuransi + cicilan; // TDP Total / Total Pembayaran Pertama

                const pctStr = (bungaPA * 100).toFixed(2).replace('.', ',') + '% p.a.';
                const provinsiLabel = document.getElementById('selectProvinsi').selectedOptions[0].text;

                document.getElementById('resultAmount').textContent = formatRp(cicilan);
                document.getElementById('resultPeriod').textContent = `${bulan} bulan (${tahun} tahun)`;
                document.getElementById('resultRateText').textContent = `${pctStr} · ${provinsiLabel.split('(')[0].trim()} · ${metodeLabel}`;
                document.getElementById('brkHarga').textContent = formatRp(harga);
                document.getElementById('brkTdp').textContent = formatRp(tdpFinal) + " (TDP Final)";
                document.getElementById('brkPokok').textContent = formatRp(pokok);
                document.getElementById('brkBunga').textContent = formatRp(totalBunga);
                document.getElementById('brkTotal').textContent = formatRp(totalBayar);
                document.getElementById('brkMetode').textContent = metodeLabel;
                
                // Extra fields
                document.getElementById('brkLeasing').textContent = leasing;
                document.getElementById('brkAdmin').textContent = formatRp(admin);
                document.getElementById('brkAsuransi').textContent = formatRp(asuransi);

                document.getElementById('resultCard').classList.add('show');
                document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Multi Leasing Calculation
                renderMultiLeasingMatrix(harga, tdp, tahun, admin, asuransi);

                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span>Hitung Ulang</span>';
            }, 500);
        }

        function renderMultiLeasingMatrix(harga, tdp, tahun, admin, asuransi) {
            const container = document.getElementById('multiLeasingCard');
            const list = document.getElementById('multiLeasingList');
            if (!container || !list) return;

            const pokok = harga - tdp;
            const bulan = tahun * 12;

            const LEASING_PROVIDERS = [
                { name: 'BCA Finance', rate: 0.0725, adminCost: 2000000, badge: '⭐ Bunga Terendah', color: '#1e40af', bg: '#dbeafe' },
                { name: 'ACC Finance (Astra)', rate: 0.0795, adminCost: 2250000, badge: '🏆 Approval Cepat', color: '#15803d', bg: '#dcfce7' },
                { name: 'Adira Finance', rate: 0.0850, adminCost: 1750000, badge: '🔥 DP Ringan', color: '#b45309', bg: '#fef3c7' },
                { name: 'Mandiri Utama Finance', rate: 0.0775, adminCost: 2100000, badge: '💎 Skema Fleksibel', color: '#6b21a8', bg: '#f3e8ff' }
            ];

            let html = '';
            LEASING_PROVIDERS.forEach(provider => {
                const totalBunga = pokok * provider.rate * tahun;
                const cicilan = (pokok + totalBunga) / bulan;
                const tdpFinal = tdp + provider.adminCost + asuransi + cicilan;

                html += `
                    <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <span style="font-weight: 800; font-size: 13.5px; color: var(--primary-blue);">${provider.name}</span>
                                <span style="font-size: 10px; font-weight: 800; background: ${provider.bg}; color: ${provider.color}; padding: 2px 8px; border-radius: 12px;">${provider.badge}</span>
                            </div>
                            <div style="font-size: 11.5px; color: var(--text-muted);">
                                Bunga: <strong>${(provider.rate * 100).toFixed(2)}% p.a.</strong> · TDP: <strong>${formatRp(tdpFinal)}</strong>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 14.5px; font-weight: 900; color: var(--primary-red);">${formatRp(cicilan)}</div>
                            <div style="font-size: 10.5px; color: var(--text-secondary); font-weight: 600;">/ bulan (${bulan}x)</div>
                        </div>
                    </div>
                `;
            });

            list.innerHTML = html;
            container.style.display = 'block';
        }

        async function loadKalkulatorData() {
            try {
                const res = await fetch('../api/api_kalkulator.php');
                const data = await res.json();
                if (data.status === 'success') {
                    const selectLeasing = document.getElementById('selectLeasing');
                    const selectProvinsi = document.getElementById('selectProvinsi');
                    selectLeasing.innerHTML = '';
                    selectProvinsi.innerHTML = '';

                    data.leasing.forEach(l => {
                        selectLeasing.innerHTML += `<option value="${l.nama_leasing}">${l.nama_leasing}</option>`;
                    });

                    data.provinsi.forEach(p => {
                        const decimal = parseFloat(p.suku_bunga) / 100;
                        const formattedPct = parseFloat(p.suku_bunga).toString().replace('.', ',');
                        selectProvinsi.innerHTML += `<option value="${decimal}">${p.nama_provinsi} (${formattedPct}%)</option>`;
                    });

                    updateBunga();
                }
            } catch (e) {
                console.error('Error fetching kalkulator data:', e);
            }
        }

        document.addEventListener('DOMContentLoaded', loadKalkulatorData);

        // ================= COMPARISON LOGIC =================
        let compareData = [];

        window.addToCompare = function() {
            // Get current result data
            const amountText = document.getElementById('resultAmount').innerText;
            if (amountText === 'Rp 0') {
                alert('Silakan lakukan simulasi terlebih dahulu.');
                return;
            }

            const leasingSelect = document.getElementById('selectLeasing');
            const leasingName = leasingSelect && leasingSelect.selectedIndex >= 0 ? (leasingSelect.options[leasingSelect.selectedIndex]?.text || '-') : '-';
            const mobilSelect = document.getElementById('selectModel');
            const mobilName = mobilSelect && mobilSelect.selectedIndex >= 0 ? (mobilSelect.options[mobilSelect.selectedIndex]?.text || '') : (document.getElementById('inputMobil') ? document.getElementById('inputMobil').value : '');
            
            const rateVal = document.getElementById('selectProvinsi') ? Number(document.getElementById('selectProvinsi').value) : 0.06;
            const bungaStr = (rateVal * 100).toFixed(2).replace('.', ',') + '% p.a.';
            const tdpEl = document.getElementById('brkTdp');
            const tdpStr = (tdpEl && tdpEl.innerText.trim() !== '' && tdpEl.innerText.trim() !== '-') ? tdpEl.innerText.trim() : (document.getElementById('inputTdp') ? formatRp(parseNum(document.getElementById('inputTdp').value)) : '-');

            const newItem = {
                mobil: mobilName || 'Toyota Vehicle',
                cicilan: amountText,
                tenor: `${currentTenor} Tahun`,
                tdp: tdpStr,
                bunga: bungaStr,
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

            if (compareData.length === 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'block';
            
            let html = '';
            compareData.forEach((item, index) => {
                html += `
                    <div style="min-width:140px; background:#f8fafc; border:1px solid var(--border-color); border-radius:12px; padding:12px; position:relative;">
                        <div style="font-size:10px; font-weight:800; color:var(--text-muted); margin-bottom:4px;">Opsi ${index + 1}</div>
                        <div style="font-size:12px; font-weight:800; color:var(--text-dark); margin-bottom:4px; line-height:1.2;">${item.mobil}</div>
                        <div style="font-size:14px; font-weight:800; color:var(--primary-blue); margin-bottom:2px;">${item.cicilan}</div>
                        <div style="font-size:10px; color:var(--text-secondary); margin-bottom:8px;">${item.tenor} Bulan</div>
                        
                        <div style="font-size:10px; color:var(--text-dark); margin-bottom:2px;"><strong>TDP:</strong> ${item.tdp}</div>
                        <div style="font-size:10px; color:var(--text-dark); margin-bottom:2px;"><strong>Leasing:</strong> ${item.leasing}</div>
                        <div style="font-size:10px; color:var(--text-dark);"><strong>Bunga:</strong> ${item.bunga}% (${item.metode})</div>
                    </div>
                `;
            });
            list.innerHTML = html;
        }

        window.shareToWhatsApp = function() {
            const amountText = document.getElementById('resultAmount').innerText;
            if (amountText === 'Rp 0') {
                alert('Silakan lakukan simulasi terlebih dahulu.');
                return;
            }

            const mobilName = document.getElementById('inputMobil') ? document.getElementById('inputMobil').value : 'Mobil Toyota';
            const hargaOTR = document.getElementById('brkHarga').innerText;
            const tdp = document.getElementById('brkTdp').innerText;
            const cicilan = amountText;
            const tenor = state.tenor;
            const leasingSelect = document.getElementById('selectLeasing');
            const leasingName = leasingSelect.options[leasingSelect.selectedIndex]?.text || '-';
            const metode = state.metode;

            let text = `🚗 *SIMULASI KREDIT RESMI TUNAS TOYOTA* 🚗\n\n` +
                       `🚘 *Model*: *${mobilName || 'Tipe Mobil'}*\n` +
                       `🏷️ *Harga OTR*: ${hargaOTR}\n\n` +
                       `💳 *SKEMA KREDIT ESTIMASI*:\n` +
                       `• *Tenor*: ${tenor} Bulan (${Math.round(tenor/12)} Tahun)\n` +
                       `• *DP / Total Bayar Awal*: *${tdp}*\n` +
                       `• *Cicilan per Bulan*: *${cicilan}*\n` +
                       `• *Leasing Rekanan*: ${leasingName}\n` +
                       `• *Metode*: ${metode}\n\n` +
                       `_Estimasi dapat disesuaikan dengan budget DP dan kebutuhan tenor Anda._\n`;
            
            if (typeof window.injectSocialSignature === 'function') {
                text = window.injectSocialSignature(text);
            }

            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
        };
