<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prize extends Model
{
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    use HasFactory;

    public function givenPrizes(): HasMany {
        return $this->hasMany(HasPrize::class);
    }

}
