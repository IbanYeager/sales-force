/**
 * js/cetak_testdrive.js
 * Official Toyota Test Drive Loan Form (Exact PDF Replica)
 */

async function loadData() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    alert("ID tidak valid");
    return;
  }

  const salesName = localStorage.getItem('namaSales') || '';
  try {
    const res = await fetch(`../api/api_request_testdrive.php?sales=${encodeURIComponent(salesName)}`);
    const json = await res.json();

    if (json.status === 'success' && Array.isArray(json.data)) {
      const item = json.data.find(d => d.id == id);
      if (item) {
        renderPDF(item);
        setTimeout(() => {
          window.print();
        }, 500);
      } else {
        document.getElementById('documentContent').innerHTML = "<p style='text-align:center;padding:40px;'>Data tidak ditemukan atau Anda tidak berhak melihat data ini.</p>";
      }
    }
  } catch (e) {
    console.error("Error loading test drive print data:", e);
  }
}

function renderPDF(data) {
  const container = document.getElementById('documentContent');

  const jadwalRaw = data.jadwal;
  let jadwalStr = jadwalRaw || '';
  if (jadwalRaw && jadwalRaw.includes('T')) {
    const parts = jadwalRaw.split('T');
    jadwalStr = `${parts[0]} Jam ${parts[1]}`;
  }

  const modelVal = (data.model && data.model !== 'null') ? data.model : (data.model_unit || data.nama_unit || data.unit || '');
  const typeVal = (data.type && data.type !== 'null') ? data.type : (data.tipe || '');
  const unitType = [modelVal, typeVal].filter(Boolean).join(' ') || (data.unit_testdrive || '');
  const unitWarna = (data.warna && data.warna !== 'null') ? data.warna : (data.warna_unit || '');
  const salesName = data.nama_sales || localStorage.getItem('namaSales') || 'Egy';

  container.innerHTML = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.35; color: #000000; width: 100%;">
      
      <!-- Title -->
      <div style="text-align: center; margin-bottom: 14px;">
        <h2 style="margin: 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
          FORMULIR PEMINJAMAN UNIT TEST DRIVE
        </h2>
      </div>

      <!-- Company & Branch -->
      <div style="margin-bottom: 8px; font-size: 11px; font-weight: bold; line-height: 1.35;">
        <div>PT. TUNAS RIDEAN</div>
        <div>CABANG : TUNAS TOYOTA KIARACONDONG</div>
      </div>

      <!-- Table 1: Unit Data -->
      <table class="td-form-table">
        <tr>
          <td class="td-label">TYPE</td>
          <td class="td-colon">:</td>
          <td class="td-val">${unitType}</td>
        </tr>
        <tr>
          <td class="td-label">NO RANGKA</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.no_rangka || ''}</td>
        </tr>
        <tr>
          <td class="td-label">NO MESIN</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.no_mesin || ''}</td>
        </tr>
        <tr>
          <td class="td-label">WARNA</td>
          <td class="td-colon">:</td>
          <td class="td-val">${unitWarna}</td>
        </tr>
        <tr>
          <td class="td-label">NO POLISI</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.no_polisi || ''}</td>
        </tr>
        <tr>
          <td class="td-label">JAM DAN TANGGAL TEST DRIVE</td>
          <td class="td-colon">:</td>
          <td class="td-val">${jadwalStr}</td>
        </tr>
      </table>

      <!-- Section 2: Untuk pengganti customer -->
      <div class="td-section-title">Untuk pengganti customer</div>
      <table class="td-form-table">
        <tr>
          <td class="td-label">CUSTOMER</td>
          <td class="td-colon">:</td>
          <td class="td-val"></td>
        </tr>
        <tr>
          <td class="td-label">NAMA CUSTOMER</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.nama_customer || ''}</td>
        </tr>
        <tr>
          <td class="td-label">NO. IDENTITAS CUSTOMER</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.no_ktp || data.no_identitas || ''}</td>
        </tr>
        <tr>
          <td class="td-label">ALAMAT CUSTOMER</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.alamat || ''}</td>
        </tr>
        <tr>
          <td class="td-label">ALASAN PEMINJAMAN DEMO CAR</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.alasan || 'Test Drive Konsumen Prospek'}</td>
        </tr>
      </table>

      <!-- Section 3: Untuk peminjaman antar cabang -->
      <div class="td-section-title">Untuk peminjaman antar cabang</div>
      <table class="td-form-table">
        <tr>
          <td class="td-label">CABANG PEMINJAM</td>
          <td class="td-colon">:</td>
          <td class="td-val">TUNAS TOYOTA KIARACONDONG</td>
        </tr>
        <tr>
          <td class="td-label">NAMA PEMBAWA DEMO CAR</td>
          <td class="td-colon">:</td>
          <td class="td-val">${salesName}</td>
        </tr>
        <tr>
          <td class="td-label">ALASAN PEMINJAMAN DEMO CAR</td>
          <td class="td-colon">:</td>
          <td class="td-val"></td>
        </tr>
      </table>

      <!-- Section 4: Untuk keperluan promisi/kanvasing -->
      <div class="td-section-title">Untuk keperluan promisi/kanvasing</div>
      <table class="td-form-table">
        <tr>
          <td class="td-label">PROGRAM PROMOSI</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.program_promosi || 'Test Drive Experience Tunas Toyota'}</td>
        </tr>
        <tr>
          <td class="td-label">AREA/TEMPAT PROMOSI</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.rute || 'Kiara Condong - Dago / Sekitarnya'}</td>
        </tr>
        <tr>
          <td class="td-label">NAMA PEMBAWA DEMO CAR</td>
          <td class="td-colon">:</td>
          <td class="td-val">${salesName}</td>
        </tr>
      </table>

      <!-- Section 5: Kondisi Unit -->
      <table class="td-form-table" style="margin-top: 6px;">
        <tr>
          <td class="td-label">KONDISI UNIT</td>
          <td class="td-colon">:</td>
          <td class="td-val"></td>
        </tr>
        <tr>
          <td class="td-label">KILOMETER AWAL</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.km_awal ? data.km_awal + ' KM' : ''}</td>
        </tr>
        <tr>
          <td class="td-label">KONDISI BBM</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.bbm_awal || ''}</td>
        </tr>
        <tr>
          <td class="td-label">KILOMETER AKHIR</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.km_akhir ? data.km_akhir + ' KM' : ''}</td>
        </tr>
        <tr>
          <td class="td-label">KONDISI BBM</td>
          <td class="td-colon">:</td>
          <td class="td-val">${data.bbm_akhir || ''}</td>
        </tr>
      </table>

      <!-- Note -->
      <div style="font-size: 9.5px; color: #000000; margin-bottom: 24px; margin-top: 4px;">
        Nb:wajib izin HO untuk peminjaman antar cabang &amp; mobil pengganti customer by email
      </div>

      <!-- Signatures Row (4 Columns matching PDF) -->
      <table style="width: 100%; text-align: center; border-collapse: collapse; border: none; font-size: 11px; page-break-inside: avoid;">
        <tr>
          <td style="width: 25%; border: none; padding: 2px;">Pemohon</td>
          <td style="width: 25%; border: none; padding: 2px;">Mengetahui</td>
          <td style="width: 25%; border: none; padding: 2px;">Menyetujui</td>
          <td style="width: 25%; border: none; padding: 2px;">Mengetahui</td>
        </tr>
        <tr>
          <td style="border: none; height: 50px;"></td>
          <td style="border: none; height: 50px;"></td>
          <td style="border: none; height: 50px;"></td>
          <td style="border: none; height: 50px;"></td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px;">SPV/KABENG</td>
          <td style="border: none; padding: 2px;">Kapool &amp; CRO</td>
          <td style="border: none; padding: 2px;">Kepala Cabang</td>
          <td style="border: none; padding: 2px;">Security</td>
        </tr>
      </table>

    </div>
  `;
}

loadData();
