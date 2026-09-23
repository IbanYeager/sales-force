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
            $u_clean = str_replace(' ', '', $username);
            $user = DB::table('sales_accounts')
                ->where('username', $username)
                ->orWhereRaw('LOWER(username) = ?', [strtolower($username)])
                ->orWhere('username', $u_clean)
                ->orWhereRaw('REPLACE(username, " ", "") = ?', [$u_clean])
                ->first();

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
                // Tim Pak Ryan (21 Sales)
                'egy'        => ['name' => 'Egy', 'spv' => 'Pak Ryan'],
                'reza'       => ['name' => 'Reza', 'spv' => 'Pak Ryan'],
                'erick'      => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'erik'       => ['name' => 'Erick', 'spv' => 'Pak Ryan'],
                'denia'      => ['name' => 'Deni A', 'spv' => 'Pak Ryan'],
                'deni a'     => ['name' => 'Deni A', 'spv' => 'Pak Ryan'],
                'yani'       => ['name' => 'Yani', 'spv' => 'Pak Ryan'],
                'deno'       => ['name' => 'Deno', 'spv' => 'Pak Ryan'],
                'jajang'     => ['name' => 'Jajang', 'spv' => 'Pak Ryan'],
                'galih_ryan' => ['name' => 'Galih', 'spv' => 'Pak Ryan'],
                'fanny'      => ['name' => 'Fanny', 'spv' => 'Pak Ryan'],
                'fani'       => ['name' => 'Fanny', 'spv' => 'Pak Ryan'],
                'dadan'      => ['name' => 'Dadan', 'spv' => 'Pak Ryan'],
                'juarna'     => ['name' => 'Juarna', 'spv' => 'Pak Ryan'],
                'denis'      => ['name' => 'Deni S', 'spv' => 'Pak Ryan'],
                'deni s'     => ['name' => 'Deni S', 'spv' => 'Pak Ryan'],
                'jesy'       => ['name' => 'Jesy', 'spv' => 'Pak Ryan'],
                'igo'        => ['name' => 'Igo', 'spv' => 'Pak Ryan'],
                'hadi'       => ['name' => 'Hadi', 'spv' => 'Pak Ryan'],
                'hady'       => ['name' => 'Hadi', 'spv' => 'Pak Ryan'],
                'agus'       => ['name' => 'Agus', 'spv' => 'Pak Ryan'],
                'agus_ryan'  => ['name' => 'Agus', 'spv' => 'Pak Ryan'],
                'tama'       => ['name' => 'Tama', 'spv' => 'Pak Ryan'],
                'wendy'      => ['name' => 'Wendy', 'spv' => 'Pak Ryan'],
                'rahadian'   => ['name' => 'Rahadian', 'spv' => 'Pak Ryan'],
                'isna_ryan'  => ['name' => 'Isna', 'spv' => 'Pak Ryan'],
                'rahma'      => ['name' => 'Rahma', 'spv' => 'Pak Ryan'],
                'rahma_ryan' => ['name' => 'Rahma', 'spv' => 'Pak Ryan'],

                // Tim Pak Alvin (20 Sales)
                'dadi'       => ['name' => 'Dadi', 'spv' => 'Pak Alvin'],
                'topik'      => ['name' => 'Topik', 'spv' => 'Pak Alvin'],
                'indah'      => ['name' => 'Indah', 'spv' => 'Pak Alvin'],
                'andri'      => ['name' => 'Andri', 'spv' => 'Pak Alvin'],
                'ndri'       => ['name' => 'Andri', 'spv' => 'Pak Alvin'],
                'rizki'      => ['name' => 'Rizki', 'spv' => 'Pak Alvin'],
                'rizky'      => ['name' => 'Rizki', 'spv' => 'Pak Alvin'],
                'ardian'     => ['name' => 'Ardian', 'spv' => 'Pak Alvin'],
                'fadil'      => ['name' => 'Fadil', 'spv' => 'Pak Alvin'],
                'fadhil'     => ['name' => 'Fadil', 'spv' => 'Pak Alvin'],
                'udil'       => ['name' => 'Udil', 'spv' => 'Pak Alvin'],
                'yeni'       => ['name' => 'Yeni', 'spv' => 'Pak Alvin'],
                'yenni'      => ['name' => 'Yeni', 'spv' => 'Pak Alvin'],
                'nova'       => ['name' => 'Nova', 'spv' => 'Pak Alvin'],
                'deri'       => ['name' => 'Deri', 'spv' => 'Pak Alvin'],
                'dery'       => ['name' => 'Deri', 'spv' => 'Pak Alvin'],
                'ahmad'      => ['name' => 'Ahmad', 'spv' => 'Pak Alvin'],
                'luvita'     => ['name' => 'Luvita', 'spv' => 'Pak Alvin'],
                'andrius'    => ['name' => 'Andrius', 'spv' => 'Pak Alvin'],
                'kurnia'     => ['name' => 'Kurnia', 'spv' => 'Pak Alvin'],
                'intan'      => ['name' => 'Intan', 'spv' => 'Pak Alvin'],
                'rico'       => ['name' => 'Rico', 'spv' => 'Pak Alvin'],
                'erlan'      => ['name' => 'Erlan', 'spv' => 'Pak Alvin'],
                'anan'       => ['name' => 'Anan', 'spv' => 'Pak Alvin'],
                'tia'        => ['name' => 'Tia', 'spv' => 'Pak Alvin'],

                // Tim Pak Riva (14 Sales)
                'galih_riva' => ['name' => 'Galih', 'spv' => 'Pak Riva'],
                'giyono'     => ['name' => 'Giyono', 'spv' => 'Pak Riva'],
                'giono'      => ['name' => 'Giyono', 'spv' => 'Pak Riva'],
                'mustofa'    => ['name' => 'Mustofa', 'spv' => 'Pak Riva'],
                'nuri'       => ['name' => 'Nuri', 'spv' => 'Pak Riva'],
                'reny'       => ['name' => 'Reny', 'spv' => 'Pak Riva'],
                'reni'       => ['name' => 'Reny', 'spv' => 'Pak Riva'],
                'rizal'      => ['name' => 'Rizal', 'spv' => 'Pak Riva'],
                'shovia'     => ['name' => 'Shovia', 'spv' => 'Pak Riva'],
                'shovie'     => ['name' => 'Shovia', 'spv' => 'Pak Riva'],
                'gugum'      => ['name' => 'Gugum', 'spv' => 'Pak Riva'],
                'noni'       => ['name' => 'Noni', 'spv' => 'Pak Riva'],
                'puspa'      => ['name' => 'Puspa', 'spv' => 'Pak Riva'],
                'robi'       => ['name' => 'Robi', 'spv' => 'Pak Riva'],
                'julia'      => ['name' => 'Julia', 'spv' => 'Pak Riva'],
                'ophie'      => ['name' => 'Ophie', 'spv' => 'Pak Riva'],
                'faris'      => ['name' => 'Faris', 'spv' => 'Pak Riva'],

                // Tim Bu Rahma (5 Sales)
                'fia'        => ['name' => 'Fia', 'spv' => 'Bu Rahma'],
                'isna'       => ['name' => 'Isna', 'spv' => 'Bu Rahma'],
                'isna_rahma' => ['name' => 'Isna', 'spv' => 'Bu Rahma'],
                'neo'        => ['name' => 'Neo', 'spv' => 'Bu Rahma'],
                'firzi'      => ['name' => 'Firzi', 'spv' => 'Bu Rahma'],
                'tian'       => ['name' => 'Tian', 'spv' => 'Bu Rahma']
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

