<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiBridgeController extends Controller
{
    /**
     * Bridge legacy PHP scripts into Laravel seamlessly
     */
    public function handle(Request $request, $script)
    {
        $script = str_replace('.php', '', $script);
        $scriptFile = base_path("api/{$script}.php");

        if (!file_exists($scriptFile)) {
            $scriptFile = public_path("api/{$script}.php");
        }

        if (file_exists($scriptFile)) {
            if ($request->isMethod('OPTIONS')) {
                return response()->json(['ok' => true], 200);
            }

            // Suppress header-already-sent notices in Laravel execution context
            set_error_handler(function ($severity, $message) {
                if (str_contains($message, 'Cannot modify header information') || str_contains($message, 'headers already sent')) {
                    return true;
                }
                return false;
            });

            ob_start();
            try {
                // Ensure legacy script has access to $_GET, $_POST, $_REQUEST, and php://input
                include $scriptFile;
                $output = ob_get_clean();
                restore_error_handler();

                // Detect if output is JSON
                $trimmed = trim($output);
                $isJson = (str_starts_with($trimmed, '{') && str_ends_with($trimmed, '}')) ||
                          (str_starts_with($trimmed, '[') && str_ends_with($trimmed, ']'));

                $resp = response($output);
                if ($isJson) {
                    $resp->header('Content-Type', 'application/json; charset=utf-8');
                }
                $resp->header('Access-Control-Allow-Origin', '*');
                $resp->header('Access-Control-Allow-Credentials', 'true');
                return $resp;
            } catch (\Throwable $e) {
                ob_end_clean();
                restore_error_handler();
                return response()->json([
                    'ok' => false,
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        return response()->json([
            'ok' => false,
            'message' => "API endpoint '{$script}' tidak ditemukan."
        ], 404);
    }
}

