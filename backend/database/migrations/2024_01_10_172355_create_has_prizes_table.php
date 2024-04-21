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
        Schema::create('has_prizes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->float('remaining_amount');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('prize_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('has_prizes');
    }
};
