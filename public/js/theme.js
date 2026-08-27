/**
 * TUNAS TOYOTA — THEME CONTROLLER v2.0
 * Default Tema: MODE TERANG (Light Mode) untuk Pengunjung Pertama
 */

(function () {
  // Ambil tema dari localStorage, jika belum ada selalu default ke 'light' (Mode Terang)
  const saved = localStorage.getItem('tunas_theme');
  const theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) document.body.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  if (document.body) document.body.setAttribute('data-theme', next);
  localStorage.setItem('tunas_theme', next);
  document.querySelectorAll('.theme-toggle i, .nav-theme-toggle i').forEach(icon => {
    icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

// Sisipkan tombol toggle di header setiap halaman
document.addEventListener('DOMContentLoaded', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  if (document.body) document.body.setAttribute('data-theme', current);

  const actions = document.querySelector('.header-customer .header-actions');
  if (!actions || actions.querySelector('.theme-toggle')) return;

  const isDark = current === 'dark';
  const btn = document.createElement('div');
  btn.className = 'theme-toggle';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Ganti tema terang/gelap');
  btn.setAttribute('tabindex', '0');
  btn.innerHTML = `<i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}"></i>`;
  btn.addEventListener('click', toggleTheme);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
  });
  actions.insertBefore(btn, actions.firstChild);
});
