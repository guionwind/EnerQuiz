<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ComarcaController;
use App\Http\Controllers\DailyQuizController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DuelController;
use App\Http\Controllers\PrizeController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MunicipiController;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Register and LoginRoute::get('/dailyquiz/history', [UserController::class, 'dailyQuizzes']);
Route::post('/register', [UserController::class, 'store']);
Route::post('/login', [UserController::class, 'login']);

// ALL ROUTES REQUIRING USER AUTH BY TOKEN GO HERE
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    //Profile
    Route::get('/myProfile/id', [UserController::class, 'getIdUserAuth']);
    Route::get('/myProfile', [UserController::class, 'getInfoLoggedIn']);
    Route::put('/myProfile/update', [UserController::class, 'updateProfile']);


    //Chat (require conversation id)
    Route::get('/conversations/{id}', [ChatController::class, 'getMessages']);
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::post('/conversations/{id}', [ChatController::class, 'sendMessage']);

    //DailyQuiz
    Route::get('/dailyquiz/history', [UserController::class, 'dailyQuizzes']);
        //create request must contain isCorrect attribute, with "true" or "false" as the only two possible values
    Route::post('/dailyquiz/new', [DailyQuizController::class, 'store']);
    Route::get('/dailyquiz/today', [UserController::class, 'answeredToday']);
    Route::post('/dailyquiz/rate', [UserController::class, 'rateDailyQuiz']);

    //Friends
    Route::post('/addfriend/{id}', [UserController::class, 'addFriend']);
    Route::get('/friends', [UserController::class, 'friends']);
    Route::delete('/unfriend/{id}', [UserController::class, 'unfriend']);

    //Logout
    Route::post('/logout', [UserController::class, 'logout']);

    //Battle
    Route::post('/duel/{id}/rate', [DuelController::class, 'rate']);
    Route::post('/duel/{rival_id}', [DuelController::class, 'createDuel']);
    Route::post('/duel/{id}/answer', [DuelController::class, 'answerQuestion']);
    Route::post('/duel/{duel_id}/question/{id}', [DuelController::class, 'sendQuestion']);

    //Prize
    Route::get('/prize', [PrizeController::class, 'seePrizes']);
    Route::put('/prize', [PrizeController::class, 'payWithPrize']);
});

Route::post('/duel/{id}/finish', [DuelController::class, 'finishDuel']);
// Questions

Route::get('/questions', [QuestionController::class, 'index']);
Route::get('/questions/random', [QuestionController::class, 'random']);
Route::get('/questions/{id}', [QuestionController::class, 'show']);

// Questions by Municipi name. Uses slug name. Must include query param type (random, all)
Route::get('/questions/municipi/{name}', [MunicipiController::class, 'localQuestion']);
// Questions by Municipi id.
Route::get('/questions/municipi/id/{id}', [MunicipiController::class, 'localQuestionId']);

// Search users. request must contain "input" field. example: /api/users/search?search=pasta
Route::get('/users/search', [SearchController::class, 'searchUsers']);


// Users
Route::delete('/users/delete/{id}', [UserController::class, 'destroy']);
Route::get('/users/{id}/dailyquiz/history', [UserController::class, 'dailyQuizzesUser']);
Route::get('/users/{id}', [UserController::class, 'getInfo']);


//Friends (admin)
    // crea amics manualment; aquesta nomes la faria servir un admin
Route::post('/remoteaddfriend/{id1}/{id2}', [UserController::class, 'remoteAddFriend']);
    // obte amics de l'usuari indicat
Route::get('/users/{id}/friends', [UserController::class, 'userFriends']);


// Comarques
Route::get('/comarques', [ComarcaController::class, 'index']);
    //obte dades d'una comarca (work in progress)
//Route::get('/comarques/dades', [ComarcaController::class, 'fetchDadesEnergetiques']);
Route::get('/comarques/{id}', [ComarcaController::class, 'show']);
Route::get('/comarques/{id}/municipis', [ComarcaController::class, 'municipis']);


// Municipis
Route::get('/municipis', [MunicipiController::class, 'index']);
Route::get('/municipis/search', [MunicipiController::class, 'search']);
Route::get('/municipis/{id}', [MunicipiController::class, 'show']);
Route::get('/fetch-data', [ApiController::class, 'fetchData']);

// Dades Municipi
Route::get('/dades/municipis/{municipi}/{sector}', [MunicipiController::class, 'obtenirDadesSector']);
Route::get('/dades/comarca/{id}', [ComarcaController::class, 'getDadesEnergetiques']);
Route::get('/dades/comarca/{id}/{sector}', [ComarcaController::class, 'getDadesEnergetiquesSector']);

//Share
Route::get('/share', [UserController::class, 'share']);

//Google Login
Route::post('/register-google', [UserController::class, 'googleRegister']);
Route::get('/google-callback', [LoginController::class, 'google_callback']);


//Prize
Route::get('/prize/{id}', [PrizeController::class, 'getPrizeFromHasprize']);

//Prize (admin)
//Route::put('/prize', [PrizeController::class, 'create']);
Route::post('/prize', [PrizeController::class, 'givePrize']);

//Ranking
Route::get('/ranking-elo', [UserController::class, 'rankingELO']);
Route::get('/ranking-daily-quiz', [UserController::class, 'rankingDailyQuiz']);

