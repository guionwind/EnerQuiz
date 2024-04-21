<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('questions')->insert([
            [
                'content' => "Quina és la font d'energia amb major consum a Catalunya?",
                'answer1' => "Gas natural",
                'answer2' => "Petroli",
                'answer3' => "Energia solar",
                'answer4' => "Nuclear",
                'correct_answer' => "Petroli",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quin sector consumeix la major part de l'energia a Catalunya?",
                'answer1' => "Transport",
                'answer2' => "Indústria",
                'answer3' => "Residencial",
                'answer4' => "Agricultura",
                'correct_answer' => "Indústria",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quina és la font d'energia renovable que té la major producció dins Catalunya?",
                'answer1' => "Eòlica",
                'answer2' => "Biomassa",
                'answer3' => "Hidroelèctrica",
                'answer4' => "Energia solar",
                'correct_answer' => "Hidroelèctrica",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quin és l'ús més comú de l'energia solar a Catalunya?",
                'answer1' => "En terrenys agrícoles",
                'answer2' => "Autoconsum en llars",
                'answer3' => "Desalinització de l'aigua de mar",
                'answer4' => "Refinament del petroli",
                'correct_answer' => "Autoconsum en llars",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quin percentatge de l'energia elèctrica a Catalunya prové de fonts renovables?",
                'answer1' => "15%",
                'answer2' => "30%",
                'answer3' => "50%",
                'answer4' => "70%",
                'correct_answer' => "15%",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quina és la capacitat total d'energia eòlica instal·lada a Catalunya?",
                'answer1' => "500 MW",
                'answer2' => "1.000 MW",
                'answer3' => "2.500 MW",
                'answer4' => "5.000 MW",
                'correct_answer' => "2.500 MW",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quin percentatge de l'energia consumida a Catalunya es produeix a Catalunya?",
                'answer1' => "10%",
                'answer2' => "25%",
                'answer3' => "50%",
                'answer4' => "75%",
                'correct_answer' => "75%",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quin d'aquests és un impacte ambiental de l'ús de carbó?",
                'answer1' => "Emissions de diòxid de carboni (CO2)",
                'answer2' => "Pluja àcida",
                'answer3' => "Deforestació",
                'answer4' => "Tots",
                'correct_answer' => "Tots",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quina és la tendència recent en l'ús de vehicles elèctrics a Catalunya?",
                'answer1' => "Augment de la seva adopció",
                'answer2' => "Reducció en la seva utilització",
                'answer3' => "Estancament sense canvis significatius",
                'answer4' => "Creixent popularitat de vehicles de gas natural",
                'correct_answer' => "Augment de la seva adopció",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
            [
                'content' => "Quina organització té la responsabilitat de supervisar i regular el consum energètic a Catalunya?",
                'answer1' => "Generalitat de Catalunya",
                'answer2' => "Govern d'Espanya",
                'answer3' => "Unió Europea",
                'answer4' => "ONU",
                'correct_answer' => "Generalitat de Catalunya",
                'created_at' =>  Carbon::now(),
                'updated_at' =>  Carbon::now(),
            ],
        ]);

    }
}
