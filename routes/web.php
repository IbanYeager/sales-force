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
    Route::get('/sph', function() { return redirect('/pages_spv/index_spv.html'); });
    Route::get('/sph.html', function() { return redirect('/pages_spv/index_spv.html'); });
    Route::get('/quotation', function() { return redirect('/pages_spv/index_spv.html'); });
    Route::get('/quotation.html', function() { return redirect('/pages_spv/index_spv.html'); });
    Route::get('/ao_report', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
    Route::get('/ao_report.html', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
    Route::get('/mtoyota_service', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
    Route::get('/mtoyota_service.html', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
    Route::get('/mtoyota', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
    Route::get('/mtoyota.html', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
    Route::get('/penjualan_merchandise', function() { return app(PageController::class)->showSpvPage('penjualan_merchandise'); });
    Route::get('/penjualan_merchandise.html', function() { return app(PageController::class)->showSpvPage('penjualan_merchandise'); });
    Route::get('/{page}', [PageController::class, 'showSpvPage'])->name('spv.page');
});
Route::get('/pages_spv/sph.html', function() { return redirect('/pages_spv/index_spv.html'); });
Route::get('/pages_spv/sph', function() { return redirect('/pages_spv/index_spv.html'); });
Route::get('/pages_spv/quotation.html', function() { return redirect('/pages_spv/index_spv.html'); });
Route::get('/pages_spv/quotation', function() { return redirect('/pages_spv/index_spv.html'); });
Route::get('/pages_spv/ao_report.html', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
Route::get('/pages_spv/ao_report', function() { return app(PageController::class)->showSpvPage('ao_report_spv'); });
Route::get('/pages_spv/mtoyota_service.html', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
Route::get('/pages_spv/mtoyota_service', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
Route::get('/pages_spv/mtoyota.html', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
Route::get('/pages_spv/mtoyota', function() { return app(PageController::class)->showSpvPage('mtoyota_service'); });
Route::get('/pages_spv/penjualan_merchandise.html', function() { return app(PageController::class)->showSpvPage('penjualan_merchandise'); });
Route::get('/pages_spv/penjualan_merchandise', function() { return app(PageController::class)->showSpvPage('penjualan_merchandise'); });
Route::get('/pages_spv/{page}', [PageController::class, 'showSpvPage']);

// Portal Kacab (Kepala Cabang)
Route::prefix('kacab')->group(function () {
    Route::get('/', [PageController::class, 'showKacabPage'])->name('kacab.dashboard');
    Route::get('/sph', function() { return redirect('/pages_kacab/index_kacab.html'); });
    Route::get('/quotation', function() { return redirect('/pages_kacab/index_kacab.html'); });
    Route::get('/quotation.html', function() { return redirect('/pages_kacab/index_kacab.html'); });
    Route::get('/ao_report', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
    Route::get('/ao_report.html', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
    Route::get('/riwayat_foto_aktivitas', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
    Route::get('/riwayat_foto_aktivitas.html', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
    Route::get('/after_sales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/aftersales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/bengkel', function() { return app(PageController::class)->showKacabPage('after_sales'); });
    Route::get('/mtoyota_service', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
    Route::get('/mtoyota_service.html', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
    Route::get('/mtoyota', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
    Route::get('/mtoyota.html', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
    Route::get('/penjualan_merchandise', function() { return app(PageController::class)->showKacabPage('penjualan_merchandise'); });
    Route::get('/penjualan_merchandise.html', function() { return app(PageController::class)->showKacabPage('penjualan_merchandise'); });
    Route::get('/{page}', [PageController::class, 'showKacabPage'])->name('kacab.page');
});
Route::get('/pages_kacab/sph.html', function() { return redirect('/pages_kacab/index_kacab.html'); });
Route::get('/pages_kacab/sph', function() { return redirect('/pages_kacab/index_kacab.html'); });
Route::get('/pages_kacab/quotation.html', function() { return redirect('/pages_kacab/index_kacab.html'); });
Route::get('/pages_kacab/quotation', function() { return redirect('/pages_kacab/index_kacab.html'); });
Route::get('/pages_kacab/ao_report.html', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
Route::get('/pages_kacab/ao_report', function() { return app(PageController::class)->showKacabPage('ao_report_kacab'); });
Route::get('/pages_kacab/riwayat_foto_aktivitas.html', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
Route::get('/pages_kacab/riwayat_foto_aktivitas', function() { return app(PageController::class)->showKacabPage('riwayat_foto_aktivitas'); });
Route::get('/pages_kacab/after_sales.html', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/after_sales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/aftersales', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/bengkel', function() { return app(PageController::class)->showKacabPage('after_sales'); });
Route::get('/pages_kacab/mtoyota_service.html', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
Route::get('/pages_kacab/mtoyota_service', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
Route::get('/pages_kacab/mtoyota.html', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
Route::get('/pages_kacab/mtoyota', function() { return app(PageController::class)->showKacabPage('mtoyota_service'); });
Route::get('/pages_kacab/penjualan_merchandise.html', function() { return app(PageController::class)->showKacabPage('penjualan_merchandise'); });
Route::get('/pages_kacab/penjualan_merchandise', function() { return app(PageController::class)->showKacabPage('penjualan_merchandise'); });
Route::get('/pages_kacab/{page}', [PageController::class, 'showKacabPage']);

// Direct SPH & Quotation Redirects for Sales
Route::get('/sph', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/sph.html', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/quotation', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/quotation.html', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/pages/sph', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/pages/sph.html', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/pages/quotation', function() { return redirect('/pages/kalkulator.html'); });
Route::get('/pages/quotation.html', function() { return redirect('/pages/kalkulator.html'); });

// Redirect removed sales features to home/dashboard
$removedSalesPages = [
    'battle_card', 'order_tracker', 'ai_copilot', 'wa_studio', 'digital_card',
    'retention', 'delivery_ceremony', 'approval', 'eco_calculator', 'komparasi',
    'tss-simulator', 'pitstop', 'memory_match', 'game', 'hybrid_flow',
    'valet_park', 'drag_race'
];

foreach ($removedSalesPages as $rmPage) {
    Route::get("/{$rmPage}", function () { return redirect('/'); });
    Route::get("/{$rmPage}.html", function () { return redirect('/'); });
    Route::get("/pages/{$rmPage}", function () { return redirect('/'); });
    Route::get("/pages/{$rmPage}.html", function () { return redirect('/'); });
}

// Pages Sales (Legacy & Clean URL)
Route::get('/pages/{page}', [PageController::class, 'showSalesPage'])->name('sales.page');

// Fallback direct route for common sales pages (e.g. /login, /input, /profil)
$salesPages = [
    'login', 'input', 'spk', 'profil', 'customer', 'ao_report', 'deal', 'do',
    'dokumen', 'balap', 'brosur', 'catalog', 'catur',
    'checkin', 'elibrary', 'inspeksi', 'inventory', 'jadwal_input',
    'kalkulator', 'kecamatan', 'leasing_matrix', 'market_analysis',
    'merchandise', 'notifikasi', 'olx', 'penjualan_kircon',
    'polreg', 'polreg_detail', 'pricelist', 'promo', 'public_card', 'rental_testdrive',
    'riwayat_foto_aktivitas', 'snake', 'target', 'tco', 'tebak', 'testdrive',
    'tradein', 'tts', 'velg', 'video_viral',
    'mtoyota_service', 'mtoyota', 'booking_service',
    'flyer', 'studio_flyer'
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
