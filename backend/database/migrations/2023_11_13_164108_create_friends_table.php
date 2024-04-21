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

        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id_1')->constrained('users');
            $table->foreignId('user_id_2')->constrained('users');
            $table->unique(['user_id_1','user_id_2']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friends');
    }
};
