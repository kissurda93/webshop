<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_data',
        'products_data',
        'total_price',
        'invoice_address',
        'delivery_address',
        'payment_status',
        'delivery_status',
        'order_ref',
        'ipn_status',
        'ipn_response',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
