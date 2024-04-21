<?php

namespace App\Http\Controllers;

use App\Models\Comarca;
use App\Models\InfoComarcaSectors;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ComarcaController extends Controller
{
    /**
     * Display a listing of comarques (name, latitude and longitude)
     */
    public function index()
    {
        $min = request()->input('min');
        $max = request()->input('max');
        $comarques = Comarca::all();

        if ($min or $max) {

            if (! $min) {
                $comarques = Comarca::where('valorEnergia', '<', $max)->get();
            } elseif (! $max) {
                $comarques = Comarca::where('valorEnergia', '>', $min)->get();
            } else {
                $comarques = Comarca::whereBetween('valorEnergia', [$min, $max])->get();
            }
        }

        return response()->json($comarques);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function fetchDadesEnergetiques() //a l'hora de conectar amb el front, caldrá afegir un string $nomComarca com a parametre per la comarca
    {
        $url = "https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json" . "?comarca=" . "ANOIA"; //anoia com a exemple

        $response = Http::get($url);

        if ($response->successful()) {
            $data = $response->json();

            $comarcaNom = $data["comarca"]; //NO FUNCIONAAAAAAAAAAAA

            $comarca = new Comarca();
            $comarca->name = $comarcaNom;
            $comarca->latitude = 72.7;
            $comarca->longitude = 3.3;
            $comarca->valorEnergia = 66;

            $comarca->save();

            return response()->json($data);

        } else {
            return response()->json(['error' => 'No se pudieron obtener los datos de la API'], 500);
        }

    }

    public function municipis($id)
    {
        $comarca = Comarca::find($id);
        if ($comarca) {
            $result = $comarca->municipis;
            //elimina la FK a comarca
            foreach($result as $r) {
                unset($r['comarca_id']);
            }
            return response()->json(['municipis' => $result, 'message' => 'OK'], 201);
        }

        else return response()->json(['message' => 'Comarca not found'], 404);
    }

    /*$atributsSeleccionats = [
                'name' => $comarcaNom,
                'latitude' => '72.7',
                'longitude' => '3.3',
                'valorEnergia' => '22',
                //'valorEnergia' => $data['Consum [kWh]'],
            ];
            Comarca::create($atributsSeleccionats);
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $comarca = Comarca::find($id);
        if ($comarca) {
            return response()->json([$comarca,'message' => 'OK'], 200);
        }
        else return response()->json(['message' => 'Comarca not found'], 404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comarca $comarca)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comarca $comarca)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comarca $comarca)
    {
        //
    }

    public function getDadesEnergetiques($id) {
        $comarca = Comarca::where('name', $id)
            ->first();

        if (!$comarca) {
            return response()->json(['message' => 'No se encontraron datos para la combinación proporcionada'], 404);
        }
        else {
            return response()->json($comarca);
        }
    }

    public function getDadesEnergetiquesSector($id, $sector) {
        $comarca = InfoComarcaSectors::where('comarca_nom', $id)
            ->where('sector_nom', $sector)
            ->first();

        if (!$comarca) {
            return response()->json(['message' => 'No se encontraron datos para la combinación proporcionada'], 404);
        }
        else {
            return response()->json($comarca);
        }
    }
}
