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
        Schema::create('info_municipi', function (Blueprint $table) {
            $table->id();
            $table->string('municipi_nom');
            $table->string('sector_nom');
            $table->unsignedBigInteger('valorEnergia')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('info_municipi');
    }
};
