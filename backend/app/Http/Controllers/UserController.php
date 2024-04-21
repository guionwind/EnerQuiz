<?php

namespace App\Http\Controllers;

use App\Models\Comarca;
use App\Models\Conversation;
use App\Models\Friend;
use App\Models\Municipi;
use App\Models\Question;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validació de les dades rebudes
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // Crear l'usuari
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'racha' => 0,
            'puntuacio' => 0,
            'password' => bcrypt($request->password),
        ]);

        // Retornar una resposta JSON amb l'usuari creat
        return response()->json(['user' => $user, 'message' => 'Usuari creat amb èxit'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $user = auth()->user();

            $token = $user->createToken('MyAppToken')->plainTextToken;

            return response()->json(['token' => $token], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }


    public function logout(Request $request)
    {

        if (auth()->user() != null) {
            $request->user()->tokens()->delete();

            return response()->json(['message' => 'Has tancat la sessió correctament'], 200);
        }
        return response()->json(['message' => 'Not logged in'], 400);

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }

    public function getInfo($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function getInfoLoggedIn()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message'=>'Not logged in'], 400);
        }
        else {
            return response()->json($user, 200);
        }
    }

    public function friends()
    {
        if (auth()->user()) {
            return response()->json(['friends' => auth()->user()->friends, 'message' => 'OK'], 200);
        }
        else return response()->json(['message' => 'User not logged in'], 400);

    }

    public function userFriends($id)
    {
        $aux = User::find($id);
        if ($aux) {
            return response()->json([
                'friends' => $aux->friends,
                'message' => 'OK'], 200);
        }
        else return response()->json(['message' => 'User not found'], 404);
    }

    /**
     * Add a friend to the currently logged in user
     */
    public function addFriend($id)
    {
        $self = auth()->user();
        $friend = User::find($id);
        if (!$self) {
            return response()->json(['message' => 'Not currently logged in'], 400);
        }
        else if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }
        else if ($id == $self->id) {
            return response()->json(['message' => 'Cannot add yourself as a friend'], 400);
        }
        else if ($self->friends->contains($id) ) {
            return response()->json(['message' => 'Friendship already exists'], 400);
        }
        else {
            $self->friends()->attach($friend);

            Conversation::create([
                'user1_id' => auth()->user()->id,
                'user2_id' => $id,
            ]);

            return response()->json(['message' => 'Friend added and conversation created'], 200);
        }
    }

    /**
     * Make 2 users become friends
     */
    public function remoteAddFriend($id1, $id2)
    {
        $user1 = User::find($id1);
        $user2 = User::find($id2);
        if (!$user1 || !$user2) {
            return response()->json(['message' => 'User not found'], 404);
        }
        else if ($user1 == $user2) {
            return response()->json(['message' => 'Attempted to add itself as a friend'], 400);
        }
        else if ($user1->friends->contains($user2) or $user2->friends->contains($user1)) {
            return response()->json(['message' => 'Friendship already exists'], 400);
        }
        else {
            $user1->friends()->attach($user2);
            return response()->json(['message' => 'Friendship created'], 200);
        }

    }

    public function unfriend($id)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Not logged in'], 400);
        }
        else {
            $friendship = $user->friends()->where('user_id_2', $id)->first();
            if ($friendship) {
                $user->friends()->where('id', $friendship->id)->detach();
                return response()->json(['message' => 'Unfriended'], 200);
            }
            else return response()->json(['message' => 'You are not friends with this user'], 400);
        }
    }

    public function dailyQuizzes()
    {
        $user = auth()->user();
        if ($user) {
            return response()->json(['records' => $user->dailyQuizzes, 'message' => 'OK'], 200);
        }
        else {
            return response()->json(['message' => 'Not logged in'], 400);
        }
    }

    public function dailyQuizzesUser($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json(['records' => $user->dailyQuizzes, 'message' => 'OK'], 200);
        }
        else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
    public function share()
    {
        if (auth()->user()) {
            return response()->json(['message' => 'Bones, ' . auth()->user()->name . 'et convida a jugar a Enerquiz, on apendràs sobre energia de Catalunya. LINK DE LA APP']);
        }
        return response()->json(['message' => 'Bones, et convidem a jugar a Enerquiz, on aprendràs sobre energia de Catalunya. LINK DE LA APP']);
    }

    public function getIdUserAuth() {
        $user = auth()->user();

        if ($user) {
            return response()->json(['id' => $user->id, 'message' => 'OK'], 200);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    public function updateProfile(Request $request) {
        $user = auth()->user();

        $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'password' => 'nullable|min:6',
            'profile_picture' => 'nullable',
            'bio' => 'nullable|string',
            'language' => 'nullable|string|max:255',
            'toggle_localization' => 'nullable|boolean',
            'municipi_id' => 'nullable'
        ]);

        $dataToUpdate = $request->only(['name', 'username', 'email', 'password', 'profile_picture', 'bio', 'language']);

        if ($request->filled('toggle_localization')) {
            $dataToUpdate['toggle_localization'] = $request->input('toggle_localization') ? 1 : 0;
        }

        if ($request->filled('password')) {
            $dataToUpdate['password'] = bcrypt($request->input('password'));
        }

        if ($request->filled('municipi_id')) {
            $municipi = Municipi::find($request->input('municipi_id'));
            $user->municipi()->associate($municipi);
        } else {
            $user->municipi()->dissociate();
        }


        $user->update($dataToUpdate);

        return response()->json(['message' => 'Perfil actualitzat.']);
    }

    public function googleRegister(Request $request)
    {

        $request->validate([
            'givenName' => 'nullable|string|max:255',
            'familyName' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'name' => 'nullable|string|max:510',
            'photo' => 'nullable|string',
            'id' => 'nullable'
        ]);

        $existingUser = User::where('email', $request->email)->first();

        if ($existingUser) {

            $credentials = [
                'email' => $existingUser->email,
                'password' => $existingUser->external_id, //contrasenya del usuari loguejat amb google
            ];

            if (auth()->attempt($credentials)) {
                $user = auth()->user();

                $token = $user->createToken('MyAppToken')->plainTextToken;

                return response()->json(['user' => $user, 'token' => $token, 'message' => 'Inicio de sesión exitoso'], 200);
            }

            return response()->json(['error' => 'Error al iniciar sesión'], 500);


        }

        else {// Crear l'usuari
            $user = User::create([
                'name' => $request->givenName,
                'email' => $request->email,
                'username' => $request->name,
                'racha' => 0,
                'puntuacio' => 1000,
                'profile_picture' => $request->photo,
                'external_id' => $request->id,
                'password' => bcrypt($request->id), //utilitzem la ID del login de google com a contrasenya
                'language' => "es",
            ]);
            return response()->json(['user' => $user, 'message' => 'Usuari registrat amb google amb èxit'], 201);
        }
    }

    public function rankingELO(Request $request)
    {
        $request->validate(['comarca' => 'nullable|integer']);

        $comarca = $request->input('comarca');
        $users = [];

        if ($comarca != null) {

            $comarcaModel = Comarca::find($comarca);

            if ($comarcaModel == null) return response()->json('La comarca indicada no existeix', '404');

            $municipisId = Municipi::where('comarca_id', $comarcaModel->id)->pluck('id');

            $users = User::whereIn('municipi_id', $municipisId)->orderBy('puntuacio', 'desc')->get();
        }
        else $users = User::orderBy('puntuacio', 'desc')->get();

        return response()->json($users);
    }

    public function rankingDailyQuiz()
    {
        $usuarios = User::orderBy('racha', 'desc')->get();

        return response()->json($usuarios);
    }


    public function answeredToday()
    {
        $user = auth()->user();
        $answeredToday = $user->dailyQuizzes()->where('date', today())->first();
        //dd($allDailies);
        if ($answeredToday) {
            return response()->json(['answered' => '1', 'isCorrect' => $answeredToday->isCorrect, 'message' => 'OK'], 200);
        }
        else return response()->json(['answered' => '0', 'message' => 'OK'], 200);
    }

    public function rateDailyQuiz(Request $request)
    {
        $request->validate([
            'questionId' => 'required|integer',
            'rate' => 'required|integer'
        ]);

        $questionId = $request->input('questionId');
        $rate = $request->input('rate');

        $question = Question::find($questionId);

        if ($question == null) return response()->json(['message' => 'Question not found'], 404);
        else {
            if ($question->rate == null) $question->rate = $rate;
            else $question->rate += $rate;
            $question->save();

            return response()->json(['message' => 'Question rated successfully'], 200);
        }
    }
}
