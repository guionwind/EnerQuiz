<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Friend extends Model
{
    use HasFactory;

    protected $hidden = ['created_at', 'updated_at'];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users','id');
    }
    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users', 'id');
    }
}
