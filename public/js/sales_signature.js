/**
 * ════════════════════════════════════════════════════════════════
 *  TUNAS TOYOTA - SALES SOCIAL MEDIA & SMART SIGNATURE UTILITY
 * ════════════════════════════════════════════════════════════════
 *  Utility untuk mengelola link akun media sosial sales (Instagram,
 *  TikTok, Facebook, Website, WhatsApp) dan secara otomatis 
 *  menyisipkan link profil sosmed ke setiap format share WhatsApp
 *  (Promo, Brosur, Pricelist, Quotation, Simulasi Kredit, dll).
 */

(function () {
  'use strict';

  // Helper normalisasi nomor HP ke format WhatsApp (628xxx)
  window.cleanPhoneForWA = function (phone) {
    if (!phone) return '';
    let p = phone.toString().replace(/[^0-9]/g, '');
    if (p.startsWith('0')) {
      p = '62' + p.substring(1);
    } else if (p.startsWith('8')) {
      p = '62' + p;
    }
    return p;
  };

  // Helper format URL Media Sosial
  window.formatSocialUrl = function (type, val) {
    if (!val || typeof val !== 'string') return '';
    val = val.trim();
    if (!val) return '';

    // Bersihkan parameter pelacak query string yang membuat link berantakan
    if (val.startsWith('http://') || val.startsWith('https://')) {
      try {
        const u = new URL(val);
        const trackingKeys = ['igsi', 'igshid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', '_r', '_t', 'mibextid', 'fbclid', 'ref'];
        trackingKeys.forEach(k => u.searchParams.delete(k));
        let clean = u.toString().replace(/\?$/, '');
        clean = clean.replace('www.instagram.com', 'instagram.com')
                     .replace('www.tiktok.com', 'tiktok.com')
                     .replace('www.facebook.com', 'facebook.com');
        return clean;
      } catch (e) {
        return val.replace(/(\?|&)(igsi|igshid|utm_[^&=]+|_r|_t|mibextid|fbclid)=[^&]+/gi, '').replace(/\?$/, '');
      }
    }

    // Bersihkan karakter @ di awal username
    const username = val.replace(/^@+/, '');

    switch (type.toLowerCase()) {
      case 'instagram':
      case 'ig':
        return `https://instagram.com/${username}`;
      case 'tiktok':
      case 'tt':
        return `https://tiktok.com/@${username}`;
      case 'facebook':
      case 'fb':
        return `https://facebook.com/${username}`;
      case 'website':
      case 'web':
      case 'linktree':
        return `https://${val}`;
      case 'whatsapp':
      case 'wa':
        return `https://wa.me/${window.cleanPhoneForWA(val)}`;
      default:
        return val.startsWith('www.') ? `https://${val}` : val;
    }
  };

  // Mengambil data profil sales saat ini dari localStorage / memory
  window.getCurrentSalesProfile = function () {
    const salesId = localStorage.getItem('salesId') || '';
    const namaSales = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || localStorage.getItem('user_nama') || 'Sales Consultant';
    const noHp = localStorage.getItem('salesNoHp') || localStorage.getItem('user_phone') || localStorage.getItem('user_hp') || '';
    const email = localStorage.getItem('salesEmail') || '';
    const ig = localStorage.getItem('salesInstagram') || '';
    const tt = localStorage.getItem('salesTiktok') || '';
    const fb = localStorage.getItem('salesFacebook') || '';
    const web = localStorage.getItem('salesWebsite') || '';
    const role = localStorage.getItem('tingkatanSales') || localStorage.getItem('userRole') || 'Sales Consultant';
    const spv = localStorage.getItem('spvSales') || '';

    return {
      id: salesId,
      nama: namaSales,
      role: role,
      spv: spv,
      no_hp: noHp,
      email: email,
      instagram: ig,
      tiktok: tt,
      facebook: fb,
      website: web
    };
  };

  // Sinkronisasi data sosmed sales dari server ke localStorage
  window.syncSalesSocialProfile = function (callback) {
    const salesId = localStorage.getItem('salesId');
    if (!salesId) {
      if (typeof callback === 'function') callback(null);
      return;
    }

    const apiUrl = (window.location.pathname.includes('/pages/') ? '../api/' : 'api/') + `api_edit_profil.php?sales_id=${salesId}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data) {
          const d = res.data;
          if (d.nama_lengkap) localStorage.setItem('namaSales', d.nama_lengkap);
          if (d.no_hp) localStorage.setItem('salesNoHp', d.no_hp);
          if (d.email) localStorage.setItem('salesEmail', d.email);
          if (d.instagram_url !== undefined) localStorage.setItem('salesInstagram', d.instagram_url || '');
          if (d.tiktok_url !== undefined) localStorage.setItem('salesTiktok', d.tiktok_url || '');
          if (d.facebook_url !== undefined) localStorage.setItem('salesFacebook', d.facebook_url || '');
          if (d.website_url !== undefined) localStorage.setItem('salesWebsite', d.website_url || '');

          if (typeof callback === 'function') callback(d);
        }
      })
      .catch(err => {
        console.warn('Sync Sales Social Profile failed:', err);
        if (typeof callback === 'function') callback(null);
      });
  };

  // Generator tanda tangan resmi sales lengkap dengan link sosmed
  window.getSalesSignature = function (customOpts = {}) {
    const p = window.getCurrentSalesProfile();
    const nama = customOpts.nama || p.nama || 'Sales Consultant';
    const noHp = customOpts.no_hp || p.no_hp;
    const ig = customOpts.instagram !== undefined ? customOpts.instagram : p.instagram;
    const tt = customOpts.tiktok !== undefined ? customOpts.tiktok : p.tiktok;
    const fb = customOpts.facebook !== undefined ? customOpts.facebook : p.facebook;
    const web = customOpts.website !== undefined ? customOpts.website : p.website;

    let lines = [];
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📲 *Info Pemesanan, Test Drive & Konsultasi:*`);
    lines.push(`👤 *${nama}* (Sales Consultant)`);
    lines.push(`🏢 *TUNAS TOYOTA KIARACONDONG BANDUNG*`);
    lines.push(`📍 Jl. Ibrahim Adjie No. 372, Kiara Condong, Bandung`);

    let socialLinks = [];
    const cleanWa = window.cleanPhoneForWA(noHp);
    if (cleanWa) {
      socialLinks.push(`📞 WhatsApp: https://wa.me/${cleanWa}`);
    }

    if (ig) {
      const igUrl = window.formatSocialUrl('instagram', ig);
      socialLinks.push(`📸 Instagram: ${igUrl}`);
    }

    if (tt) {
      const ttUrl = window.formatSocialUrl('tiktok', tt);
      socialLinks.push(`🎵 TikTok: ${ttUrl}`);
    }

    if (fb) {
      const fbUrl = window.formatSocialUrl('facebook', fb);
      socialLinks.push(`📘 Facebook: ${fbUrl}`);
    }

    if (web) {
      const webUrl = window.formatSocialUrl('website', web);
      socialLinks.push(`🌐 Website: ${webUrl}`);
    }

    if (socialLinks.length > 0) {
      lines.push(``);
      lines.push(...socialLinks);
    }

    return lines.join('\n');
  };

  // Helper untuk menambahkan tanda tangan sosmed ke pesan broadcast apa pun
  window.injectSocialSignature = function (baseMessage, customOpts = {}) {
    const signature = window.getSalesSignature(customOpts);
    return `${baseMessage.trim()}\n\n${signature}`;
  };

  // Jalankan sinkronisasi awal secara otomatis saat halaman dimuat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.syncSalesSocialProfile();
    });
  } else {
    window.syncSalesSocialProfile();
  }
})();
