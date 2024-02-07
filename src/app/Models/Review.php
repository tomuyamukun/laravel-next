<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        "content",
        "rating",
        "media_id",
        "media_type",
        "user_id",
    ];

    /**
     * reviewは一人のuserのリレーション
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }
}
