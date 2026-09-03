@echo off
REM ==============================================================================
REM SFT T-STOCK AI SENTINEL - DAILY AUTO DISPATCHER FOR KACAB
REM ==============================================================================
echo [%DATE% %TIME%] Menjalankan AI Sentinel Harian untuk Kacab...
cd /d "%~dp0"
php "%~dp0api\api_cron_kacab_sentinel.php" action=execute_cron
echo [%DATE% %TIME%] Selesai dieksekusi.
