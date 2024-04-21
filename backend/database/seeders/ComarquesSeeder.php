<?php

namespace Database\Seeders;

use App\Models\Comarca;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ComarquesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('comarques')->truncate();

        $response = Http::get("https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json");

        $data = $response->json();

        foreach($data as $comarca) {

            $existingComarca = Comarca::where('name', $comarca['comarca'])->first();

            //no totes les tuples de les dades obertes tenen consum_kwh
            $valorEnergia = isset($comarca['consum_kwh']) && is_numeric($comarca['consum_kwh']) && strlen((string)$comarca['consum_kwh']) <= 6
                ? $comarca['consum_kwh']
                : null;



            if(!$existingComarca) {
                Comarca::create([
                    'name' => $comarca['comarca'],
                    'latitude' => fake()->latitude,
                    'longitude' => fake()->longitude,
                    'valorEnergia' => $valorEnergia
                ]);
            }
        }
    }
}
