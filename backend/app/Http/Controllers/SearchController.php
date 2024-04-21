<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchUsers(Request $request)
    {
        $result = [];
        $term = $request->input('search');
        if ($term != null) {
            $result = User::where('username', 'like', "%$term%")->limit(100)->get();
        }

        return response()->json(['result'=>$result, 'message' => 'OK'], 200);
    }
}
