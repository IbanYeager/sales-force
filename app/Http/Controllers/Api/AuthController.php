<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\SalesAccount;
use App\Models\SpvAccount;
use App\Models\KacabAccount;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->all();
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $loginType = $data['login_type'] ?? 'sales';

        if (empty($username) || empty($password)) {
            return response()->json([
                'ok' => false,
                'message' => 'Username dan password wajib diisi'
            ]);
        }

        if ($loginType === 'sales') {
            $user = DB::table('sales_accounts')->where('username', $username)->first();

            if ($user) {
                if (Hash::check($password, $user->password) || password_verify($password, $user->password) || $password === $user->password) {
                    return response()->json([
                        'ok' => true,
                        'message' => 'Login berhasil',
                        'sales' => [
                            'id' => $user->id,
                            'name' => $user->nama_lengkap,
                            'foto' => $user->foto ?? '',
                            'spv' => $user->nama_spv ?? '',
                            'peran' => 'Sales Consultant',
                            'tingkatan' => $user->tingkatan ?? 'Executive'
                        ]
                    ]);
                }
            }

            // Sales Master Fallback
            $salesMaster = [
                'reza' => ['name' => 'Reza', 'spv' => 'Pak Ryan'],
                'egy' => ['name' => 'Egy', 'spv' => 'Pak Ryan'],
                'erick' => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'erik' => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'deno' => ['name' => 'Deno', 'spv' => 'Pak Ryan'],
                'yani' => ['name' => 'Yani', 'spv' => 'Pak Ryan'],
                'denia' => ['name' => 'Deni A', 'spv' => 'Pak Ryan'],
                'jajang' => ['name' => 'Jajang', 'spv' => 'Pak Ryan'],
                'juarna' => ['name' => 'Juarna', 'spv' => 'Pak Ryan'],
                'galih_ryan' => ['name' => 'Galih (Ryan)', 'spv' => 'Pak Ryan'],
                'fanny' => ['name' => 'Fanny', 'spv' => 'Pak Ryan'],
                'dadan' => ['name' => 'Dadan', 'spv' => 'Pak Ryan'],
                'igo' => ['name' => 'Igo', 'spv' => 'Pak Ryan'],
                'dadi' => ['name' => 'Dadi', 'spv' => 'Pak Alvin'],
                'topik' => ['name' => 'Topik', 'spv' => 'Pak Alvin'],
                'indah' => ['name' => 'Indah', 'spv' => 'Pak Alvin'],
                'andri' => ['name' => 'Andri', 'spv' => 'Pak Alvin'],
                'rizky' => ['name' => 'Rizky', 'spv' => 'Pak Alvin'],
                'galih_riva' => ['name' => 'Galih (Riva)', 'spv' => 'Pak Riva'],
                'dery' => ['name' => 'Dery', 'spv' => 'Pak Riva'],
                'giono' => ['name' => 'Giono', 'spv' => 'Pak Riva'],
                'rizal' => ['name' => 'Rizal', 'spv' => 'Pak Riva'],
            ];

            $userLower = strtolower($username);
            if (array_key_exists($userLower, $salesMaster) && $password === '123456') {
                $acc = $salesMaster[$userLower];
                return response()->json([
                    'ok' => true,
                    'message' => 'Login berhasil',
                    'sales' => [
                        'id' => 999,
                        'name' => $acc['name'],
                        'foto' => '',
                        'spv' => $acc['spv'],
                        'peran' => 'Sales Consultant',
                        'tingkatan' => 'Junior'
                    ]
                ]);
            }
        } elseif ($loginType === 'spv') {
            $user = DB::table('spv_accounts')->where('username', $username)->first();

            if ($user) {
                if (Hash::check($password, $user->password) || password_verify($password, $user->password) || $password === $user->password) {
                    return response()->json([
                        'ok' => true,
                        'message' => 'Login berhasil',
                        'spv' => [
                            'id' => $user->id,
                            'name' => $user->nama_lengkap,
                            'foto' => $user->foto ?? '',
                            'peran' => 'Supervisor'
                        ]
                    ]);
                }
            }

            // Fallback SPV accounts
            $spvMaster = [
                'ryan' => ['name' => 'Pak Ryan'],
                'alvin' => ['name' => 'Pak Alvin'],
                'riva' => ['name' => 'Pak Riva'],
                'rahma' => ['name' => 'Bu Rahma']
            ];
            $userLower = strtolower($username);
            if (array_key_exists($userLower, $spvMaster) && ($password === '123456' || $password === 'admin123')) {
                return response()->json([
                    'ok' => true,
                    'message' => 'Login berhasil',
                    'spv' => [
                        'id' => 900,
                        'name' => $spvMaster[$userLower]['name'],
                        'foto' => '',
                        'peran' => 'Supervisor'
                    ]
                ]);
            }
        } elseif ($loginType === 'kacab') {
            $user = DB::table('kacab_accounts')->where('username', $username)->first();

            if ($user) {
                if (Hash::check($password, $user->password) || password_verify($password, $user->password) || $password === $user->password) {
                    return response()->json([
                        'ok' => true,
                        'message' => 'Login berhasil',
                        'kacab' => [
                            'id' => $user->id,
                            'name' => $user->nama_lengkap,
                            'foto' => $user->foto ?? '',
                            'peran' => 'Kepala Cabang'
                        ]
                    ]);
                }
            }

            if (in_array(strtolower($username), ['kacab', 'kepalacabang']) && in_array($password, ['123456', 'kacab123', 'admin123'])) {
                return response()->json([
                    'ok' => true,
                    'message' => 'Login berhasil',
                    'kacab' => [
                        'id' => 1,
                        'name' => 'Kepala Cabang',
                        'foto' => '',
                        'peran' => 'Kepala Cabang'
                    ]
                ]);
            }
        }

        return response()->json([
            'ok' => false,
            'message' => 'Username atau password salah.'
        ]);
    }
}

