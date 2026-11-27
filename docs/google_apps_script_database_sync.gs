/**
 * Google Apps Script - 2-Way Realtime Sync untuk Spreadsheet:
 * DATABASE SALES TUNAS TOYOTA KIARACONDONG 2026
 * Sheet Target: "Database" (gid=622548953)
 *
 * Cara Pasang:
 * 1. Buka Spreadsheet -> menu Ekstensi (Extensions) -> Apps Script
 * 2. Hapus kode lama (jika ada), lalu paste seluruh kode ini
 * 3. Klik Terapkan (Deploy) -> Deployment baru (New deployment)
 * 4. Jenis: Aplikasi Web (Web app)
 *    - Jalankan sebagai: Saya (Me)
 *    - Yang memiliki akses: Siapa saja (Anyone)
 * 5. Salin URL Web App (.../exec) lalu masukkan ke Pengaturan Sync SFT CRM
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = payload.sheet_name || 'Database';
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Sheet "' + sheetName + '" tidak ditemukan'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var lastRow = sheet.getLastRow();
    var targetRow = 0;
    var reqRow = parseInt(payload.sheet_row_index || 0, 10);
    var reqVin = String(payload.vin || '').trim().toUpperCase();
    var reqPhone = normalizePhone_(payload.phone || '');

    // 1. Fast O(1) lookup by sheet_row_index (verifikasi no rangka jika ada)
    if (reqRow >= 2 && reqRow <= lastRow) {
      var cellVin = String(sheet.getRange(reqRow, 1).getValue() || '').trim().toUpperCase();
      if (!reqVin || cellVin === reqVin) {
        targetRow = reqRow;
      }
    }

    // 2. Fallback scan by no rangka (Col A) atau No Tlp/Hp (Col J)
    if (!targetRow && (reqVin || reqPhone)) {
      var dataRange = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
      for (var i = 0; i < dataRange.length; i++) {
        var rowVin = String(dataRange[i][0] || '').trim().toUpperCase();
        var rowPhone = normalizePhone_(dataRange[i][9] || '');
        if ((reqVin && rowVin === reqVin) || (!reqVin && reqPhone && rowPhone === reqPhone)) {
          targetRow = i + 2;
          break;
        }
      }
    }

    if (!targetRow) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Baris customer tidak ditemukan di sheet Database'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Kolom AI (35) s/d AP (42):
    // 35: Connected | 36: Contacted | 37: Prospect | 38: SPK
    // 39: Remarks   | 40: Status FU | 41: Reason Follow up | 42: Sales FU
    var connected = toBoolStr_(payload.connected);
    var contacted = toBoolStr_(payload.contacted);
    var prospect = toBoolStr_(payload.prospect);
    var spk = toBoolStr_(payload.spk);
    var remarks = normalizeRemarks_(payload.remarks, connected, contacted, prospect, spk);
    var statusFu = (String(payload.status_fu || payload.sales_fu_status || 'Open').trim() === 'Closed') ? 'Closed' : 'Open';
    var reasonFu = String(payload.reason_followup || '').trim();
    var salesFu = String(payload.sales_fu || payload.sales_name || '').trim();

    if (connected !== '') sheet.getRange(targetRow, 35).setValue(connected);
    if (contacted !== '') sheet.getRange(targetRow, 36).setValue(contacted);
    if (prospect !== '') sheet.getRange(targetRow, 37).setValue(prospect);
    if (spk !== '') sheet.getRange(targetRow, 38).setValue(spk);
    if (remarks !== '') sheet.getRange(targetRow, 39).setValue(remarks);
    if (statusFu !== '') sheet.getRange(targetRow, 40).setValue(statusFu);
    if (reasonFu !== '') sheet.getRange(targetRow, 41).setValue(reasonFu);
    if (salesFu !== '') sheet.getRange(targetRow, 42).setValue(salesFu);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      row: targetRow,
      connected: connected,
      reason_followup: reasonFu,
      sales_fu: salesFu
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function toBoolStr_(val) {
  var s = String(val || '').trim().toUpperCase();
  if (s === 'TRUE' || s === 'IYA' || s === 'YA' || s === '1') return 'TRUE';
  if (s === 'FALSE' || s === 'TIDAK' || s === '0') return 'FALSE';
  return '';
}

function normalizePhone_(p) {
  var d = String(p || '').replace(/[^0-9]/g, '');
  if (d.indexOf('0') === 0) d = '62' + d.substring(1);
  else if (d.indexOf('8') === 0) d = '62' + d;
  return d;
}

function normalizeRemarks_(raw, connected, contacted, prospect, spk) {
  var s = String(raw || '').trim();
  var valid = [
    'Customer janjian',
    'Customer menolak',
    'Customer pending',
    'Customer tertarik',
    'Customer tidak aktif',
    'Customer Tidak diangkat',
    'SPK berhasil'
  ];
  for (var i = 0; i < valid.length; i++) {
    if (s.toLowerCase() === valid[i].toLowerCase()) return valid[i];
  }
  if (s.toLowerCase().indexOf('menunggu respon') !== -1 || s.toLowerCase().indexOf('tunggu') !== -1 || s.toLowerCase().indexOf('cek harga') !== -1) {
    return 'Customer pending';
  }
  if (s.toLowerCase().indexOf('simulasi') !== -1 || s.toLowerCase().indexOf('test drive') !== -1) {
    return 'Customer tertarik';
  }
  if (s.toLowerCase().indexOf('dealer') !== -1 || s.toLowerCase().indexOf('merk lain') !== -1) {
    return 'Customer menolak';
  }
  if (spk === 'TRUE') return 'SPK berhasil';
  if (prospect === 'TRUE') return 'Customer tertarik';
  if (prospect === 'FALSE') return 'Customer menolak';
  if (contacted === 'FALSE') return 'Customer Tidak diangkat';
  if (connected === 'FALSE') return 'Customer tidak aktif';
  if (connected === 'TRUE') return 'Customer pending';
  return '';
}
