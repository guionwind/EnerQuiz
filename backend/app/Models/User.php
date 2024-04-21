<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'profile_picture',
        'bio',
        'language',
        'racha',
        'puntuacio',
        'toggle_localization',
        'municipi_id',
        'external_id',
        'external_auth'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
        'email_verified_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function friends(): BelongsToMany {
        return $this->belongsToMany(User::class, 'friends', 'user_id_1', 'user_id_2');
    }

    public function dailyQuizzes(): HasMany
    {
        return $this->hasMany(DailyQuiz::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function duels(): BelongsToMany {
        return $this->belongsToMany(Duel::class, 'duels_users', 'user_id', 'duel_id');
    }

    public function municipi(): BelongsTo {
        return $this->belongsTo(Municipi::class);
    }

    public function prizes(): HasMany {
        return $this->hasMany(HasPrize::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

}
