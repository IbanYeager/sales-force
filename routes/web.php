<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

/*
|--------------------------------------------------------------------------
| Web Routes - Sales Force Automation (Tunas Toyota)
|--------------------------------------------------------------------------
*/

// Main Dashboard
Route::get('/', [PageController::class, 'index'])->name('dashboard');
Route::get('/index', [PageController::class, 'index']);
Route::get('/index.html', [PageController::class, 'index']);
Route::get('/home', [PageController::class, 'index']);
Route::get('/dashboard', [PageController::class, 'index']);

// Panduan Alur Kerja
Route::get('/panduan', [PageController::class, 'panduan'])->name('panduan');
Route::get('/panduan_alur_kerja_sales_app.html', [PageController::class, 'panduan']);

// Portal SPV (Supervisor)
Route::prefix('spv')->group(function () {
    Route::get('/', [PageController::class, 'showSpvPage'])->name('spv.dashboard');
    Route::get('/{page}', [PageController::class, 'showSpvPage'])->name('spv.page');
});
Route::get('/pages_spv/{page}', [PageController::class, 'showSpvPage']);

// Portal Kacab (Kepala Cabang)
Route::prefix('kacab')->group(function () {
    Route::get('/', [PageController::class, 'showKacabPage'])->name('kacab.dashboard');
    Route::get('/{page}', [PageController::class, 'showKacabPage'])->name('kacab.page');
});
Route::get('/pages_kacab/{page}', [PageController::class, 'showKacabPage']);

// Pages Sales (Legacy & Clean URL)
Route::get('/pages/{page}', [PageController::class, 'showSalesPage'])->name('sales.page');

// Fallback direct route for common sales pages (e.g. /login, /input, /profil)
$salesPages = [
    'login', 'login_spv', 'login_kacab', 'login_sales', 'input', 'spk', 'profil', 'customer', 'ao_report', 'deal', 'do',
    'dokumen', 'ai_copilot', 'approval', 'balap', 'battle_card', 'brosur', 'catalog', 'catur',
    'checkin', 'delivery_ceremony', 'digital_card', 'drag_race', 'eco_calculator',
    'elibrary', 'game', 'hybrid_flow', 'inspeksi', 'inventory', 'jadwal_input',
    'kalkulator', 'kecamatan', 'komparasi', 'leasing_matrix', 'market_analysis',
    'merchandise', 'notifikasi', 'olx', 'order_tracker', 'penjualan_kircon', 'pitstop',
    'polreg', 'pricelist', 'promo', 'quotation', 'rental_testdrive', 'retention',
    'riwayat_foto_aktivitas', 'snake', 'target', 'tco', 'tebak', 'testdrive',
    'tradein', 'tss-simulator', 'tts', 'valet_park', 'velg', 'wa_studio'
];

Route::get('/e-catalog', function () {
    return app(PageController::class)->showSalesPage('catalog');
});
Route::get('/katalog', function () {
    return app(PageController::class)->showSalesPage('catalog');
});

foreach ($salesPages as $page) {
    Route::get("/{$page}", function () use ($page) {
        return app(PageController::class)->showSalesPage($page);
    });
}
