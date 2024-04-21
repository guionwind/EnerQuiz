<?php

namespace Database\Seeders;

use App\Models\HasPrize;
use App\Models\Prize;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $prize = Prize::factory(1)->create();

        HasPrize::factory(5)->hasPrize(1)->hasUser(1)->create();

    }
}
