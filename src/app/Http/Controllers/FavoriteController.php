<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class FavoriteController extends Controller
{

    public function index() {
        $api_key = config('services.tmdb.api_key');
        $user = Auth::user();
        $favorites = $user->favorites;

        // APIを使ってお気に入りしている作品を取得
        $details = [];
        foreach($favorites as $favorite) {
            $tmdb_api_key = "https://api.themoviedb.org/3/" . $favorite->media_type . "/" . $favorite->media_id . "?api_key=" . $api_key;
            $response = Http::get($tmdb_api_key);
            // APIのレスポンスにmedia_typeはないのでテーブルの値を利用
            if($response->successful()) {
                $details[] = array_merge($response->json(), ['media_type' => $favorite->media_type]);
            }
        }

        return response()->json($details);
    }

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
