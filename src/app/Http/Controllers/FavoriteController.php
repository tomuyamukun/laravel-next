<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * お気に入りのボタンを押下時の操作
     */
    public function toggleFavorite(Request $request) {

        $validatedData = $request->validate([
            "media_type" => 'required|string',
            'media_id' => 'required|integer'
        ]);

        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('media_id', $validatedData['media_id'])
            ->where('media_type', $validatedData['media_type'])
            ->first();

        // お気に入りが存在している場合
        if ($existingFavorite) {
            $existingFavorite->delete();
            return response()->json(['status' => 'removed']);
        } else {
            // お気に入りがない場合
            Favorite::create([
                'media_type' => $validatedData['media_type'],
                'media_id' => $validatedData['media_id'],
                'user_id' => Auth::id()
            ]);
        }

        return response()->json(['status' => 'added']);
    }

    /**
     * お気に入りの状態の確認
     */
    public function checkFavoriteStatus(Request $request) {
        $validatedData = $request->validate([
            "media_type" => 'required|string',
            'media_id' => 'required|integer'
        ]);

        $isFavorite = Favorite::where('user_id', Auth::id())
            ->where('media_id', $validatedData['media_id'])
            ->where('media_type', $validatedData['media_type'])
            ->exists();

        return response()->json($isFavorite);
    }
}
