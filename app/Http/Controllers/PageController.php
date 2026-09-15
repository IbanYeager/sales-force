<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class PageController extends Controller
{
    /**
     * Dashboard Utama (Sales App)
     */
    public function index()
    {
        return view('index');
    }

    /**
     * Halaman Panduan Alur Kerja
     */
    public function panduan()
    {
        $role = request()->get('role');
        if ($role === 'kacab') {
            return redirect('/pages_kacab/index_kacab.html');
        }
        if ($role === 'spv') {
            return redirect('/pages_spv/index_spv.html');
        }

        if (View::exists('panduan_alur_kerja_sales_app')) {
            return view('panduan_alur_kerja_sales_app');
        }
        return redirect()->route('dashboard');
    }

    /**
     * Halaman Sales (pages/{page})
     */
    public function showSalesPage($page)
    {
        $cleanPage = str_replace('.html', '', $page);

        if ($cleanPage === 'index' || $cleanPage === '' || $cleanPage === 'dashboard' || $cleanPage === 'home') {
            return $this->index();
        }

        if ($cleanPage === 'sph') {
            $cleanPage = 'quotation';
        }

        if ($cleanPage === 'panduan' || $cleanPage === 'panduan_alur_kerja_sales_app') {
            return $this->panduan();
        }

        if ($cleanPage === 'quotation') {
            $role = request()->query('role');
            if ($role === 'kacab') {
                return $this->showKacabPage('quotation');
            } elseif ($role === 'spv') {
                return $this->showSpvPage('quotation');
            }
        }

        if (View::exists("pages.{$cleanPage}")) {
            return view("pages.{$cleanPage}");
        }

        abort(404, "Halaman sales '{$cleanPage}' tidak ditemukan.");
    }

    /**
     * Halaman Portal SPV (pages_spv/{page})
     */
    public function showSpvPage($page = 'index_spv')
    {
        $cleanPage = str_replace('.html', '', $page);

        if ($cleanPage === 'index' || empty($cleanPage)) {
            $cleanPage = 'index_spv';
        }

        if ($cleanPage === 'panduan' || $cleanPage === 'panduan_alur_kerja_sales_app') {
            return redirect('/pages_spv/index_spv.html');
        }

        if ($cleanPage === 'sph') {
            $cleanPage = 'quotation';
        }

        if (View::exists("pages_spv.{$cleanPage}")) {
            return view("pages_spv.{$cleanPage}");
        }

        abort(404, "Halaman SPV '{$cleanPage}' tidak ditemukan.");
    }

    /**
     * Halaman Portal Kacab (pages_kacab/{page})
     */
    public function showKacabPage($page = 'index_kacab')
    {
        $cleanPage = str_replace('.html', '', $page);

        if ($cleanPage === 'index' || empty($cleanPage)) {
            $cleanPage = 'index_kacab';
        }

        if ($cleanPage === 'panduan' || $cleanPage === 'panduan_alur_kerja_sales_app') {
            return redirect('/pages_kacab/index_kacab.html');
        }

        if ($cleanPage === 'sph') {
            $cleanPage = 'quotation';
        }

        if (View::exists("pages_kacab.{$cleanPage}")) {
            return view("pages_kacab.{$cleanPage}");
        }

        abort(404, "Halaman Kacab '{$cleanPage}' tidak ditemukan.");
    }
}

