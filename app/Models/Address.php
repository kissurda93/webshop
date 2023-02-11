<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;

    protected $fillable = ['country', 'state', 'city', 'address', 'default'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
