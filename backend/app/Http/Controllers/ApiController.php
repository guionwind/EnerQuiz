<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    public function index()
    {

    }

    public function fetchData()
    {
        $url = "https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json";

        //$token = "Qb2pyS9N5Bo3IAWa3iU3IQM0N";

        $response = Http::get($url);

        if ($response->successful()) {
            $data = $response->json();

            return response()->json($data);
        } else {
            return $statusCode = $response->status();
            $errorResponse = $response->json();
        }
    }
}
