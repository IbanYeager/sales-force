<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class SpvAccount extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'spv_accounts';

    protected $fillable = [
        'username',
        'password',
        'nama_lengkap',
        'no_hp',
        'email',
        'foto',
    ];

    protected $hidden = [
        'password',
    ];
}

