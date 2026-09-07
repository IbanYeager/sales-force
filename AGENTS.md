# Project Guidelines for Antigravity AI

## Automatic Git Push Rule
- Setiap kali selesai melakukan perbaikan bug, penambahan fitur, atau modifikasi file di repositori ini, SELALU jalankan:
  1. `git add .` (atau file yang terkait)
  2. `git commit -m "..."` dengan pesan commit deskriptif (format conventional commits).
  3. `git push origin main`
- Lakukan hal ini secara otomatis tanpa perlu menunggu user meminta perintah push.
- Pastikan selalu memeriksa `git status` setelah push untuk memastikan working tree bersih dan sinkron dengan GitHub/Hostinger.
