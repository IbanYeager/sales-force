@echo off
title Auto Git Push Watcher - Sales Force Tunas
color 0A
echo ========================================================
echo   AUTO GIT PUSH WATCHER AKTIF
echo   Folder: %CD%
echo   Memeriksa perubahan file setiap 15 detik...
echo   (Biarkan jendela ini tetap terbuka / minimize)
echo ========================================================
echo.

:loop
set "HAS_CHANGES="
for /f "tokens=*" %%i in ('git status --porcelain 2^>nul') do (
    set "HAS_CHANGES=1"
)

if defined HAS_CHANGES (
    echo --------------------------------------------------------
    echo [%time%] Terdeteksi perubahan kode baru!
    echo Melakukan git add, commit, dan push...
    
    git add .
    git commit -m "auto: sinkronisasi update kode (%date% %time%)"
    git push origin main
    
    echo [%time%] BERHASIL PUSH KE GITHUB DAN HOSTINGER!
    echo --------------------------------------------------------
    echo.
)

timeout /t 15 /nobreak >nul
goto loop
