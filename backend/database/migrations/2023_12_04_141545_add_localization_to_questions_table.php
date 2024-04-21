<?php

use App\Models\Comarca;
use App\Models\Municipi;
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
        Schema::table('questions', function (Blueprint $table) {
            $table->foreignIdFor(Municipi::class, 'municipi_id')->nullable()->constrained();
            $table->foreignId('comarca_id')->nullable();

            $table->foreign('comarca_id')->references('id')->on('comarques');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('municipi_id');
            $table->dropColumn('comarca_id');

        });
    }
};
