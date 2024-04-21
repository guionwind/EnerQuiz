<?php

namespace App\Http\Controllers;

use App\Models\DailyQuiz;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DailyQuizController extends Controller
{
    // saves a new DailyQuiz record for the logged user
    public function store(Request $request) {
        $user = auth()->user();
        if ($user) {
            $request->validate([
                'isCorrect' => 'required|numeric|between:0,1',
            ]);

            $today = Carbon::now()->toDateString();
            if (!$this->userHasAlreadyAnswered($today)) {
                DailyQuiz::create([
                    'user_id' => $user->id,
                    'date' => $today,
                    'isCorrect' => $request['isCorrect'],
                ]);
                return response()->json(['message' => 'Daily Quiz record for today created succesfully'], 201);
            }
            else return response()->json(['message' => 'This user has already done the daily quiz today'], 400);
        }
        else return response()->json(['message' => 'User not logged in'], 400);
    }

    //given a date, checks if the logged user has answered
    private function userHasAlreadyAnswered($date) : bool
    {
        $user = auth()->user();
        if (DailyQuiz::where('user_id', $user->id)->where('date', $date)->exists()) return true;
        else return false;

    }
}
