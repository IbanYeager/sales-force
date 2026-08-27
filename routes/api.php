<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApiBridgeController;

/*
|--------------------------------------------------------------------------
| API Routes - Sales Force Automation (Tunas Toyota)
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/api_login.php', [AuthController::class, 'login']);

// Bridge for all legacy API scripts (e.g. /api/api_followup.php, /api/api_spk.php, etc.)
Route::any('/{script}', [ApiBridgeController::class, 'handle'])->where('script', '.*');
