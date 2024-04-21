<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipi extends Model
{
    use HasFactory;

    protected $hidden = ['created_at', 'updated_at'];

    public function comarca(): BelongsTo {
        return $this->belongsTo(Comarca::class);
    }

    public function questions(): HasMany {
        return $this->hasMany(Question::class);
    }

    public function infoMunicipis(): HasMany {
        return $this->hasMany(infoMunicipi::class);
    }
}
