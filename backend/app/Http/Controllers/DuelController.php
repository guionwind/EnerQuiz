<?php

namespace App\Http\Controllers;

use App\Events\DuelEvent;
use App\Models\Answer;
use App\Models\Duel;
use App\Models\Question;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Symfony\Polyfill\Intl\Idn\Info;

class DuelController extends Controller
{
    public function rate(Request $request, $id)
    {
        $user = auth()->user();

        if (! $user) return response()->json(['message' => 'User not logged in', 403]);

        $duel = Duel::findOrFail($id);

        //En cas que l'usuari no pertanyi a la batalla
        if (!($duel->user1_id == $user->id || $duel->user2_id == $user->id)) {
//                info('User ID: ' . $user->id . ' does not belong to this battle. Duel User IDs: ' . $duel->user1_id . ', ' . $duel->user2_id);
//                var_dump('User ID:', $user->id, 'Duel User IDs:', $duel->user1_id, $duel->user2_id);
            return response()->json(['message' => 'User not belonging to this battle', 403]);
        }

        if ($duel->rating == null) {
            $duel->rating = $request->input('rate');
        }
        else {
            $duel->rating = ($duel->rating + $request->input('rate')) / 2;
        }

        $duel->save();
    }

    protected function calcularNuevoElo($puntuacionGanador, $puntuacionPerdedor)
    {
        $k = 256;
        $ganaEsperadoGanador = 1 / (1 + 10 ** (($puntuacionPerdedor - $puntuacionGanador) / 60000));

        $nuevaPuntuacionGanador = intval($puntuacionGanador + $k * (1 - $ganaEsperadoGanador));
        $nuevaPuntuacionPerdedor = intval($puntuacionPerdedor - $k * $ganaEsperadoGanador);

        return [
            'ganador' => $nuevaPuntuacionGanador,
            'perdedor' => $nuevaPuntuacionPerdedor,
        ];
    }

    public function createDuel($rival_id)
    {
        $self = auth()->user();
        $rival = User::find($rival_id);

        if (!$self) {
            return response()->json(['message' => 'Not currently logged in'], 401);
        }
        else if (!$rival) {
            return response()->json(['message' => 'Rival user not found'], 404);
        }
        else if ($rival_id == $self->id) {
            return response()->json(['message' => 'Cannot duel yourself'], 400);
        }

        $rivalDuels = $self->duels->filter(function ($duel) use ($rival_id) {
            return $duel->contains($rival_id);
        });

        $startedDuel = $rivalDuels->first(function ($duel) {
            return ! $duel->isFinished;
        });

        //Si existeix un duel no acabat
        if ($startedDuel) {
            return response()->json(['message' => 'Duel en curs', 'answers' => $startedDuel->answers], 200);
        }
        else {
            $duel = Duel::create([
                'user1_id' => $self->id,
                'user2_id' => $rival_id,
                'isFinished' => 0
            ]);

            $duel->users()->attach([$self->id, $rival_id]);

            return response()->json(['message' => 'Duel started', 'duel' => $duel], 200);
        }
    }

    public function sendQuestion($id)
    {
        $question = Question::find($id);
        if (! $question) return response()->json(['message' => 'Aquesta pregunta no existeix'], 404);

        event(new DuelEvent($question, auth()->user()->id));

        return response()->json(['message' => 'Pregunta enviada correctament'], 200);
    }
    public function answerQuestion(Request $request, $id)
    {
        $duel = Duel::find($id);
        if (!$duel) return response()->json(['message' => 'El duel indicat no existeix'], 404);

        $request->validate([
            'questionId' => 'required|integer',
            'isCorrect' => 'required|boolean'
        ]);

        $user = auth()->user();

        $answer = Answer::create([
            'question_id' => $request->questionId,
            'duel_id' => $id,
            'isCorrect' => $request->isCorrect,
            'user_id' => $user->id
        ]);
        event(new DuelEvent($answer, $user->id));

        return response()->json(['message' => 'Resposta guardada amb èxit', 'answer' => $answer], 200);
    }

    public function finishDuel(Request $request, $id)
    {
        $duel = Duel::find($id);
        if (!$duel) return response()->json(['message' => 'El duel indicat no existeix'], 404);

        $winner = $this->getDuelWinner($duel);

        $duel->isFinished = true;
        $duel->save();

        if (! $winner) {
            return response()->json(['message' => 'Duel finalitzat correctament en empat', 'winner' => $winner], 200);
        }
        $looser = $winner == $duel->user1_id ? $duel->user2_id : $duel->user1_id;

        $this->actualizarPuntuaciones($winner, $looser);
        return response()->json(['message' => 'Duel finalitzat correctament amb guanyador', 'winner' => $winner], 200);
    }

    private function getDuelWinner(Duel $duel): ?int
    {
        $user1 = User::find($duel->user1_id);
        $user2 = User::find($duel->user2_id);

        $user1DuelAnswers = $user1->answers->filter(function ($answer) use ($duel) {
            return $answer->duel_id == $duel->id;
        });

        $user2DuelAnswers = $user2->answers->filter(function ($answer) use ($duel) {
            return $answer->duel_id == $duel->id;
        });

        $user1CorrectAnswers = $user1DuelAnswers->sum('isCorrect');
        $user2CorrectAnswers = $user2DuelAnswers->sum('isCorrect');

        if ($user1CorrectAnswers > $user2CorrectAnswers) return $user1->id;
        else if ($user2CorrectAnswers > $user1CorrectAnswers) return $user2->id;
        else return null;
    }

    private function actualizarPuntuaciones($winner, $looser)
    {
        $user1 = User::find($winner);
        $user2 = User::find($looser);

        $puntuacionGanador = $user1->puntuacio;
        $puntuacionPerdedor = $user2->puntuacio;

        $nuevasPuntuaciones = $this->calcularNuevoElo($puntuacionGanador, $puntuacionPerdedor);

        $user1->update(['puntuacio' => $nuevasPuntuaciones['ganador']]);
        $user2->update(['puntuacio' => $nuevasPuntuaciones['perdedor']]);

        $user1->save();
        $user2->save();
    }
}
