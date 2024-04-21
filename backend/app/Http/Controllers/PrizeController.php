<?php

namespace App\Http\Controllers;

use App\Models\HasPrize;
use App\Models\Prize;
use App\Models\User;
use Illuminate\Http\Request;

class PrizeController extends Controller
{
    public function create(Request $request) {

    }

    public function seePrizes() {
        $user = auth()->user();
        //$user = User::find(23);
        $prizes = $user->prizes;

        return response()->json(['count'=>$prizes->count(), 'result' => $prizes, 'message' => 'OK'], 200);

    }

    //Get the Prize from an instance of HasPrize. Argument: HasPrize ID
    public function getPrizeFromHasprize($id) {
        $hasPrize = HasPrize::find($id);
        if ($hasPrize) {
            return response()->json(['originalPrize' => $hasPrize->prize, 'message' => 'OK'], 200);
        }
        else {
            return response()->json(['message' => 'Not found'], 404);
        }
    }

    /**
     * Store a newly awarded HasPrize in storage.
     */
    public function givePrize(Request $request) {
        // Validació de les dades rebudes
        $request->validate([
            'user_id' => 'required|integer',
            'prize_id' => 'required|integer',
        ]);

        if (!User::find($request->user_id)) {
            return response()->json(['message' => 'User ID not found'], 404);
        }

        $prize = Prize::find($request->prize_id);
        if (!$prize) {
            return response()->json(['message' => 'Prize ID not found'], 404);
        }

        // Atorgar el premi
        $newHasPrize = HasPrize::create([
            'code' => sha1(time()),
            'remaining_amount' => $prize->total_amount,
            'user_id' => $request->user_id,
            'prize_id' => $request->prize_id,
        ]);

        // Retornar una resposta JSON amb el premi creat
        return response()->json(['awardedPrize' => $newHasPrize, 'message' => 'Created'], 201);
    }

    public function payWithPrize(Request $request) {
        $user = auth()->user();

        $request->validate([
            'code' => 'required|string',
            'payAmount' => 'requred|integer',
        ]);
        $prize = HasPrize::where('code', $request->code)->where('user_id', $user->id)->first()->get();
        if ($prize) {
            $amount = $request->payAmount;
            if ($amount < 0 || $amount > $prize->remaining_amount) {
                $prize->update(['remaining_amount' => $prize->remaining_amount - $amount]);
            }
            else {
                return response()->json(['message' => 'Cannot afford'], 400);
            }
        }
        else {
            return response()->json(['message' => 'Prize not found'], 404);
        }

    }

}
