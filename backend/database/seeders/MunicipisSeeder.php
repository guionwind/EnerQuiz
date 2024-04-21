<?php

namespace Database\Seeders;

use App\Models\Municipi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MunicipisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('municipis')->truncate();

        $response = Http::get("https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json");

        $data = $response->json();

        foreach($data as $municipi) {

            $existingMunicipi = Municipi::where('name', $municipi['municipi'])->first();

            if(!$existingMunicipi) {
                Municipi::create([
                    'name' => $municipi['municipi'],
                    'slug' => Str::slug($municipi['municipi']),
                    'latitude' => fake()->latitude,
                    'longitude' => fake()->longitude,
                    'comarca_id' => $municipi['cdmun'],
                ]);
            }

        }

    }
}
