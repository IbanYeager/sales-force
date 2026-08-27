// ── UTILS BERSAMA — Tunas Toyota Kiaracondong ──
// Dimuat di <head> sebelum inline script halaman.
// Menggunakan properti window (bukan const) agar tidak bentrok dengan
// deklarasi lama di inline script halaman yang belum dibersihkan.

window.NOMOR_WA_AI = window.NOMOR_WA_AI || "6282119004796";

window.hubungiAI = window.hubungiAI || function (topik = '') {
  let pesan = 'Halo, saya mengunjungi website Showroom Tunas Toyota Kiaracondong. Bisa saya mendapat informasi?';
  if (topik !== '') {
    pesan = `Halo, saya mengunjungi website Showroom Tunas Toyota Kiaracondong. Saya ingin informasi tentang *${topik}*.`;
  }
  window.open(`https://wa.me/${window.NOMOR_WA_AI}?text=${encodeURIComponent(pesan)}`, '_blank');
};

window.formatRupiah = window.formatRupiah || function (angka) {
  if (!angka || angka <= 0) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

window.getUnitImage = window.getUnitImage || function (model) {
  if (!model) return 'avanza.webp';
  const m = model.toLowerCase().trim();

  if (m.includes('double cabin') || m.includes('hilux double')) return 'double-cabin.webp';
  if (m.includes('single cabin') || m.includes('hilux single')) return 'single-cabin.webp';
  if (m.includes('hi ace premio') || m.includes('hiace premio')) return 'hi-ace-premio.webp';
  if (m.includes('hi ace') || m.includes('hiace')) return 'hi-ace-comm.webp';
  if (m.includes('zenix')) return 'zenix.webp';
  if (m.includes('reborn')) return 'reborn.webp';
  if (m.includes('yaris cross')) return 'yaris-cross.webp';
  if (m.includes('cross') || m.includes('corolla cross')) return 'cross.webp';
  if (m.includes('altis') || m.includes('corolla altis')) return 'altis.webp';
  if (m.includes('camry')) return 'camry.webp';
  if (m.includes('vios hybrid')) return 'vios-hybrid.webp';
  if (m.includes('vios')) return 'vios.webp';
  if (m.includes('bz4x')) return 'bz4x.webp';
  if (m.includes('alphard')) return 'alphard.webp';
  if (m.includes('vellfire')) return 'vellfire.webp';
  if (m.includes('voxy improvement')) return 'voxy-improvement.webp';
  if (m.includes('voxy')) return 'voxy.webp';
  if (m.includes('avanza')) return 'avanza.webp';
  if (m.includes('veloz hybrid')) return 'veloz-hybrid.webp';
  if (m.includes('veloz')) return 'veloz.webp';
  if (m.includes('calya')) return 'calya.webp';
  if (m.includes('agya gr')) return 'agya-gr-s.webp';
  if (m.includes('agya')) return 'agya.webp';
  if (m.includes('raize improvement')) return 'raize-improvement.webp';
  if (m.includes('raize')) return 'raize.webp';
  if (m.includes('rush')) return 'rush.webp';
  if (m.includes('fortuner')) return 'fortuner.webp';
  if (m.includes('land cruiser')) return 'land-cruiser.webp';
  if (m.includes('dyna')) return 'dyna.webp';
  if (m.includes('rangga')) return 'rangga.webp';
  if (m.includes('gr 86') || m.includes('86')) return 'gr-86.webp';
  if (m.includes('gr yaris')) return 'gr-yaris.webp';
  if (m.includes('gr corolla')) return 'gr-corolla.webp';
  if (m.includes('urban cruiser')) return 'urban-cruiser.webp';
  if (m.includes('supra')) return 'supra.webp';
  return 'avanza.webp';
};

window.fixCarImagePath = window.fixCarImagePath || function (path, modelName = '') {
  if (!path || typeof path !== 'string' || path.includes('sales_pov') || path.includes('undefined')) {
    return 'image/mobil/' + window.getUnitImage(modelName);
  }

  let cleaned = path.trim();

  // Repair legacy / mismatched image names
  cleaned = cleaned.replace('new-single-cabin.webp', 'single-cabin.webp');
  cleaned = cleaned.replace('new-double-cabin.webp', 'double-cabin.webp');
  cleaned = cleaned.replace('corolla-altis.webp', 'altis.webp');
  cleaned = cleaned.replace('corolla-cross.webp', 'cross.webp');
  cleaned = cleaned.replace('assets/img/mobil/', 'image/mobil/');
  cleaned = cleaned.replace('../sales_pov/', '');

  if (!cleaned.startsWith('image/') && !cleaned.startsWith('http') && !cleaned.startsWith('/')) {
    cleaned = 'image/mobil/' + cleaned;
  }

  return cleaned;
};
