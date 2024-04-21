<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class LoginController extends Controller
{
    public function login_google() {
        return Socialite::driver('google')->redirect();
    }

    public function google_callback(){
        $user = Socialite::driver('google')->user();

        $userExists = User::where('external_id', $user->id)->where('external_auth', 'google')->first();

        if ($userExists) {
            Auth::login($userExists);
        } else {
            $pathavatar = 'uploads/profile-pictures/avatarDefault.jpg';
            $userNew = User::create([
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'external_id' => $user->id,
                'external_auth' => 'google',
                'profile_picture' => $pathavatar,
                'racha' => 0,
                'puntuacio' => 0,
            ]);

            Auth::login($userNew);
        }
        return redirect()->intended();
    }
}
