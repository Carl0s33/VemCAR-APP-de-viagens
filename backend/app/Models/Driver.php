<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'cnh',
        'state',
        'aproved',
        'user_id'
    ];


    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
