<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(); //si fas login amb google no tens password
            $table->string('external_id')->nullable(); //variables de login google
            $table->string('external_auth')->nullable(); //variables de login google
            $table->string('profile_picture')->nullable();
            $table->string('bio')->nullable();
            $table->string('language')->nullable();
            $table->integer('racha');
            $table->integer('puntuacio')->default(1000);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
