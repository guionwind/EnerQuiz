<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class infoMunicipi extends Model
{

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'sector_nom',
        'municipi_nom',
        'valorEnergia',
    ];

    use HasFactory;

    protected $table = 'info_municipi';

    public function municipi(): HasOne
    {
        return $this->hasOne(Municipi::class, 'municipi_nom');
    }
}
