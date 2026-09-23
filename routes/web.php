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
Route::get('/panduan_alur_kerja_sales_app', [PageController::class, 'panduan']);
Route::get('/pages/panduan_alur_kerja_sales_app.html', [PageController::class, 'panduan']);
Route::get('/pages/panduan_alur_kerja_sales_app', [PageController::class, 'panduan']);
// Portal SPV (Supervisor)
Route::prefix('spv')->group(function () {
    Route::get('/', [PageController::class, 'showSpvPage'])->name('spv.dashboard');
    Route::get('/sph', function() { return app(PageController::class)->showSpvPage('quotation'); });
    Route::get('/ao_report', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
    Route::get('/ao_report.html', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
    Route::get('/{page}', [PageController::class, 'showSpvPage'])->name('spv.page');
});
Route::get('/pages_spv/sph.html', function() { return app(PageController::class)->showSpvPage('quotation'); });
Route::get('/pages_spv/sph', function() { return app(PageController::class)->showSpvPage('quotation'); });
Route::get('/pages_spv/ao_report.html', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
Route::get('/pages_spv/ao_report', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
Route::get('/pages_spv/{page}', [PageController::class, 'showSpvPage']);

// Portal Kacab (Kepala Cabang)
Route::prefix('kacab')->group(function () {
    Route::get('/', [PageController::class, 'showKacabPage'])->name('kacab.dashboard');
    Route::get('/sph', function() { return app(PageController::class)->showKacabPage('quotation'); });
    Route::get('/ao_report', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
    Route::get('/ao_report.html', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
    Route::get('/riwayat_foto_aktivitas', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
    Route::get('/riwayat_foto_aktivitas.html', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
    Route::get('/after_sales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/aftersales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/bengkel', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/{page}', [PageController::class, 'showKacabPage'])->name('kacab.page');
});
Route::get('/pages_kacab/sph.html', function() { return app(PageController::class)->showKacabPage('quotation'); });
Route::get('/pages_kacab/sph', function() { return app(PageController::class)->showKacabPage('quotation'); });
Route::get('/pages_kacab/ao_report.html', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
Route::get('/pages_kacab/ao_report', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
Route::get('/pages_kacab/riwayat_foto_aktivitas.html', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
Route::get('/pages_kacab/riwayat_foto_aktivitas', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
Route::get('/pages_kacab/after_sales.html', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/after_sales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/aftersales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/bengkel', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/{page}', [PageController::class, 'showKacabPage']);

// Direct SPH Aliases for Sales
Route::get('/sph', function() { return app(PageController::class)->showSalesPage('quotation'); });
Route::get('/sph.html', function() { return app(PageController::class)->showSalesPage('quotation'); });

// Pages Sales (Legacy & Clean URL)
Route::get('/pages/{page}', [PageController::class, 'showSalesPage'])->name('sales.page');

// Fallback direct route for common sales pages (e.g. /login, /input, /profil)
$salesPages = [
    'login', 'input', 'spk', 'profil', 'customer', 'ao_report', 'deal', 'do',
    'dokumen', 'ai_copilot', 'approval', 'balap', 'battle_card', 'brosur', 'catalog', 'catur',
    'checkin', 'delivery_ceremony', 'digital_card', 'drag_race', 'eco_calculator',
    'elibrary', 'game', 'hybrid_flow', 'inspeksi', 'inventory', 'jadwal_input',
    'kalkulator', 'kecamatan', 'komparasi', 'leasing_matrix', 'market_analysis',
    'merchandise', 'notifikasi', 'olx', 'order_tracker', 'penjualan_kircon', 'pitstop',
    'polreg', 'polreg_detail', 'pricelist', 'promo', 'public_card', 'quotation', 'rental_testdrive', 'retention',
    'riwayat_foto_aktivitas', 'snake', 'target', 'tco', 'tebak', 'testdrive',
    'tradein', 'tss-simulator', 'tts', 'valet_park', 'velg', 'video_viral', 'wa_studio'
];

Route::get('/e-catalog', function () {
    return app(PageController::class)->showSalesPage('elibrary');
});
Route::get('/katalog', function () {
    return app(PageController::class)->showSalesPage('elibrary');
});
Route::get('/brosur', function () {
    return redirect('/pages/elibrary');
});
Route::get('/e-brosur', function () {
    return redirect('/pages/elibrary');
});
Route::get('/media_studio', function () {
    return app(PageController::class)->showSalesPage('video_viral');
});
Route::get('/media-studio', function () {
    return app(PageController::class)->showSalesPage('video_viral');
});
Route::get('/media_hub', function () {
    return app(PageController::class)->showSalesPage('video_viral');
});

foreach ($salesPages as $page) {
    Route::get("/{$page}", function () use ($page) {
        return app(PageController::class)->showSalesPage($page);
    });
    Route::get("/{$page}.html", function () use ($page) {
        return app(PageController::class)->showSalesPage($page);
    });
}
