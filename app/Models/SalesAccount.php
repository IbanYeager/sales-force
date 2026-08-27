<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class SalesAccount extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'sales_accounts';

    protected $fillable = [
        'nama_spv',
        'username',
        'password',
        'nama_lengkap',
        'tingkatan',
        'foto',
        'no_hp',
        'email',
        'status',
    ];

    protected $hidden = [
        'password',
    ];
}

