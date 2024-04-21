<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InfoComarcaSectors extends Model
{
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'sector_nom',
        'comarca_nom',
        'valorEnergia',
    ];

    use HasFactory;

    protected $table = 'info_comarques_sector';

    public function comarca(): HasOne
    {
        return $this->hasOne(Comarca::class, 'name');
    }
}
