<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Duel extends Model
{
    use HasFactory;

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'user1_id',
        'user2_id',
        'isFinished',
    ];
//    public function player1(): BelongsTo
//    {
//        return $this->belongsTo(User::class, 'user1_id');
//    }
//    public function player2(): BelongsTo
//    {
//        return $this->belongsTo(User::class, 'user2_id');
//    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'duels_users', 'duel_id', 'user_id');
    }

    public function answers(): HasMany
    {
        return $this->HasMany(Answer::class);
    }
}
