<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HasPrize extends Model
{
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'code',
        'remaining_amount',
        'user_id',
        'prize_id',
    ];

    protected $table = 'has_prizes';

    use HasFactory;

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function prize(): BelongsTo {
        return $this->belongsTo(Prize::class, 'prize_id');
    }
}
