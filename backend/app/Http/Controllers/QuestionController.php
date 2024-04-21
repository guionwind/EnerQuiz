<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = Question::all();
        return response()->json($questions);
    }

    /**
     * Display a random question.
     */
    public function random(Request $request)
    {
        $questions = Question::all();
        if ($questions) {
            $toggleMunicipis = $request->input('municipis');
            if ($toggleMunicipis) {
                if ($toggleMunicipis == 'false') {
                    $questionsNoMunicipis = Question::where('municipi_id', null)->get();
                    return response()->json(['question' => $questionsNoMunicipis->random(), 'message' => 'OK'], 200);
                }
                else if ($toggleMunicipis == 'true') {
                    return response()->json(['question' => $questions->random(), 'message' => 'OK'], 200);
                }
                else {
                    return response()->json(['message'=>'Please specify if municipis=true or municipis=false'], 400);
                }

            }
            else {
                return response()->json(['question' => $questions->random(), 'message' => 'OK'], 200);
            }
        }
        else {
            return response()->json(['message'=>'There are no questions in the database'], 404);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

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
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        else return response()->json($question, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
