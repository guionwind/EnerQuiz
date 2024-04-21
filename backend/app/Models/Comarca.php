<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comarca extends Model
{
    use HasFactory;

    protected $table = 'comarques';

    protected $hidden = ['created_at', 'updated_at'];

    public function municipis(): HasMany {
        return $this->hasMany(Municipi::class);
    }
}
