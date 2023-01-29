<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = json_decode(file_get_contents(base_path().'/storage/products.json'));

        foreach($products as $product) {
            $productInstance = Product::create([
                'title' => $product->title,
                'description' => $product->description,
                'price' => $product->price,
                'discountPercentage' => $product->discountPercentage,
                'rating' => $product->rating,
                'stock' => $product->stock,
                'brand' => $product->brand,
                'thumbnail' => $product->thumbnail,
            ]);

            $category = Category::updateOrCreate([
                'name' => $product->category
            ]);

            $category->products()->attach($productInstance);
        }

    }
}
