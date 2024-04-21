<?php

namespace Database\Seeders;

use App\Models\Comarca;
use App\Models\InfoComarcaSectors;
use App\Models\infoMunicipi;
use App\Models\Municipi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

// Es fan les migracions obtenint les dades obertes tant de la taula de comarques com de la de municipis
class MunicipisIComarquesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        //DB::table('municipis')->truncate();
        if (is_null(Comarca::first()) or is_null(Municipi::first())) {
            $response = Http::get('https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json?$limit=46000&$offset=40530');

            $data = $response->json();

            $contentComarques = file_get_contents(storage_path('app/json/comarques_coordenades.json'));
            $coordsComarques = json_decode($contentComarques, true);

            $contentMunicipis = file_get_contents(storage_path('app/json/municipis_coordenades.json'));
            $coordsMunicipis = json_decode($contentMunicipis, true);

            foreach ($data as $municipi) {

                $existingMunicipi = Municipi::where('name', $municipi['municipi'])->first();

                $existingInfoMunicipi = InfoMunicipi::where('municipi_nom', $municipi['municipi'])
                    ->where('sector_nom', $municipi['descripcio_sector'])
                    ->whereNotNull('valorEnergia')
                    ->first();


                $existingComarca = Comarca::where('name', $municipi['comarca'])->first();

                if (!$existingComarca) {
                    $comarcaName = $municipi['comarca'];


                    $existingComarca = Comarca::create([
                        'name' => $comarcaName,
                        'latitude' => $coordsComarques[$comarcaName]['latitude'],
                        'longitude' => $coordsComarques[$comarcaName]['longitude'],
                        'valorEnergia' => 0,
                        'any' => $municipi['any']
                    ]);

                }

                $valorEnergia = isset($municipi['consum_kwh']) ? +$municipi['consum_kwh'] : null;

                if ($valorEnergia !== null && $existingComarca->any == $municipi['any']) {
                    $existingComarca->increment('valorEnergia', $valorEnergia);
                }

                if (!$existingMunicipi) {
                    $municipiName = $municipi['municipi'];
                    Municipi::create([
                        'name' => $municipi['municipi'],
                        'slug' => Str::slug($municipi['municipi']),
                        'latitude' => $coordsMunicipis[$municipiName]['latitude'],
                        'longitude' => $coordsMunicipis[$municipiName]['longitude'],
                        'comarca_id' => $existingComarca->id,
                        'valorEnergia' => 0,
                        'any' => $municipi['any']
                    ]);
                }

                if ($existingMunicipi && $valorEnergia !== null && $existingMunicipi->any == $municipi['any']) {
                    $existingMunicipi->increment('valorEnergia', $valorEnergia);
                }

                if (!$existingInfoMunicipi && $valorEnergia !== null) {
                    infoMunicipi::create([
                        'sector_nom' => $municipi['descripcio_sector'],
                        'municipi_nom' => $municipi['municipi'],
                        'valorEnergia' => $valorEnergia
                    ]);
                }

                $existingInfoComarca = InfoComarcaSectors::where('comarca_nom', $municipi['comarca'])
                    ->where('sector_nom', $municipi['descripcio_sector'])
                    ->first();

                if (!$existingInfoComarca) {
                    $comarcaName = $municipi['comarca'];
                    InfoComarcaSectors::create([
                        'comarca_nom' => $comarcaName,
                        'sector_nom' => $municipi['descripcio_sector'],
                        'valorEnergia' => 0,
                    ]);
                }

                if ($existingInfoComarca && $valorEnergia !== null ) {
                    $existingInfoComarca->increment('valorEnergia', $valorEnergia);
                }

            }
        }
    }
}
