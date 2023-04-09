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
}