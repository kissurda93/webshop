<?php

namespace App\Models;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'price',
        'discountPercentage',
        'rating',
        'stock',
        'brand',
        'thumbnail',
    ];

    public function categories() {
        return $this->belongsToMany(Category::class, 'category_product', 'products_id', 'categories_id');
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }
}
