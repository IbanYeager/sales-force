@echo off
REM ==============================================================================
REM SFT T-STOCK AI SENTINEL - DAILY 06:00 AM AUTO DISPATCHER FOR KACAB
REM ==============================================================================
echo [%DATE% %TIME%] Menjalankan AI Sentinel Harian untuk Kacab...
php "c:\laragon\www\sft\api\api_cron_kacab_sentinel.php"
echo [%DATE% %TIME%] Selesai dieksekusi.
