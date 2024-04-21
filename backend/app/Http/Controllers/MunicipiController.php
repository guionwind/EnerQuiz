<?php

namespace App\Http\Controllers;

use App\Models\infoMunicipi;
use App\Models\Municipi;
use http\Env\Response;
use Illuminate\Http\Request;

class MunicipiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $municipis = Municipi::all();
        return response()->json($municipis);
    }

    /**
     * Retorna l'informació d'un municipi
     */
    public function show($id) {
        $municipi = Municipi::find($id);
        if ($municipi) {
            return response()->json([$municipi,'message' => 'OK'], 200);
        }
        else return response()->json(['message' => 'Municipi not found'], 404);
    }

    public function search(Request $request)
    {
        $name = $request->input('name');

        if ($name) {
            $municipis = Municipi::where('slug', 'like', "%$name%")->get();

            return $municipis
                ? response()->json(['municipis' => $municipis], 200)
                : response()->json(['message' => 'Municipis not found'], 404);
        }

        return response()->json(['message' => 'Please specify a name to search'], 400);
    }

    /**
     * Display questions belonging to the given Municipi (by name in slug format).
     * Return value: random question from municipi by default; can be all questions from a municipi if type == 'all'
     */
    public function localQuestion(Request $request, $name)
    {
        $exists = Municipi::where('slug', $name)->exists();

        if ($name && $exists) {
            $municipi = Municipi::where('slug', $name)->first();
            $questions = $municipi->questions();
            if ($questions) {
                $type = $request->input('type');
                if ($type) {
                    if ($type == 'random') {
                        $result = $questions->inRandomOrder()->first();
                        if ($result) return response()->json(['question' => $result, 'message' => 'OK'], 200);
                    }
                    else if ($type == 'all') {
                        $result = $municipi->questions;
                        if ($result) return response()->json(['question' => $result, 'message' => 'OK'], 200);
                    }
                }
                else return response()->json(['message'=>'Please specify type=random or type=all'], 400);
            }
            return response()->json(['message'=>'There are no questions for this municipi'], 204);
        }
        else return response()->json(['message'=>'Municipi not found'], 404);
    }

    /**
     * Same as localQuestion, but using the Municipi id instead of the slug.
     */
    public function localQuestionId(Request $request, $id) {
        //$name = $request->input('name');
        $municipi = Municipi::find($id);
        if ($id && $municipi) {
            $questions = $municipi->questions();
            if ($questions) {
                $type = $request->input('type');
                if ($type) {
                    if ($type == 'random') {
                        $result = $questions->inRandomOrder()->first();
                        if ($result) return response()->json(['question' => $result, 'message' => 'OK'], 200);
                    }
                    else if ($type == 'all') {
                        $result = $municipi->questions;
                        if ($result) return response()->json(['question' => $result, 'message' => 'OK'], 200);
                    }
                }
                else return response()->json(['message'=>'Please specify type=random or type=all'], 400);
            }
            return response()->json(['message'=>'There are no questions for this municipi'], 204);
        }
        else return response()->json(['message'=>'Municipi not found'], 404);
    }

    public function obtenirDadesSector($id, $sector) {

        $infoMunicipi = infoMunicipi::where('municipi_nom', $id)
            ->where('sector_nom', $sector)
            ->first();

        if ($infoMunicipi) {
            return response()->json($infoMunicipi);
        } else {
            // Manejar el caso donde la tupla no existe
            return response()->json(['message' => 'No se encontraron datos para la combinación proporcionada'], 404);
        }
    }
}
