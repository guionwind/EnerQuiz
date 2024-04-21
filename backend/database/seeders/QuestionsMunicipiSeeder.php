<?php

namespace Database\Seeders;

use App\Models\infoMunicipi;
use App\Models\Municipi;
use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionsMunicipiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $municipis = Municipi::all();
        /*
        $municipis->each(function ($municipi) {
            Question::factory(2)->create([
                'municipi_id' => $municipi->id,
            ]);}
        );
        */

        $popularSectors = InfoMunicipi::select('municipi_nom', 'sector_nom')
            ->selectRaw('SUM(valorEnergia) as total')
            ->groupBy('municipi_nom', 'sector_nom')
            ->orderByDesc('total')
            ->get();


        foreach ($municipis as $municipi) {
            Question::factory()->create([
                'content' => "Quin és el sector que més energia consumeix a ".$municipi->name.'?',
                'answer1' => 'PRIMARI',
                'answer2' => 'INDUSTRIAL',
                'answer3' => 'TERCIARI',
                'answer4' => 'USOS DOMESTICS',
                'correct_answer' => $popularSectors->firstwhere('municipi_nom', $municipi->name)->sector_nom,
                'municipi_id' => $municipi->id,
            ]);
            $consum = $municipi->valorEnergia;
            Question::factory()->create([
                'content' => "Quin és el consum d'energia total a ".$municipi->name.'?',
                'answer1' => ''.$consum*2 .'kWh',
                'answer2' => ''.$consum/2 .'kWh',
                'answer3' => ''.$consum .'kWh',
                'answer4' => ''.$consum+72700 .'kWh',
                'correct_answer' => ''.$consum .'kWh',
                'municipi_id' => $municipi->id,
            ]);


        }



    }
}
