<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Collection;

class ProductService
{
  public function productsOrderByCategories(): Collection
  {
    $categories = Category::with('products');

    $data = collect();

    $categories->each(function ($category) use ($data) {
      $products = $category->products;

      $products->each(function ($product) use ($data) {
        $data->push($product);
      }); 
    });

    return $data;
  }

  public function updateProduct(array $request, Product $product): string
  {
    if(isset($request['stock']) && $request['stock'] !== $product->stock)
      $product->update(['stock' => $request['stock']]);

    if(isset($request['discount']) && $request['discount'] != $product['discountPercentage'])
      $product->update(['discountPercentage' => $request['discount']]);

    return "Product updated successfully!";
  }

  public function createProduct(array $request): Product
  {
    $urls = $this->savePhotos($request['images']);

    $request['thumbnail'] = $urls[0]['url'];

    $product = Product::create($request);

    $category = Category::updateOrCreate([
        'name' => $request['category'],
    ]);

    $category->products()->attach($product);

    $product->images()->createMany($urls);

    $product['categories'] = $product->categories;
    $product['images'] = $product->images;

    return $product;
  }

  private function savePhotos(array $images): array
  {
    $urls = [];

    foreach ($images as $image) {
      $imageName = time() . '-' . $image->getClientOriginalName();
      $image->move(public_path('images'), $imageName);

      $path = config('app.api_url') . "/images/" .  $imageName;
      array_push($urls, ['url' => $path]);
    }

    return $urls;
  }

}