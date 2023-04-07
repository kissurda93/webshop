<?php

namespace App\Services;

use Illuminate\Support\Collection;
use AmrShawky\LaravelCurrency\Facade\Currency;

class CurrencyConverter
{
  public function convert(Collection $products, int $totalPrice): array
  {
    $products->each(function($product) {
      $product['price'] = Currency::convert()
      ->from('USD')
      ->to('HUF')
      ->amount($product['price'])
      ->get();
    });

    $totalPrice = Currency::convert()
    ->from('USD')
    ->to('HUF')
    ->amount($totalPrice)
    ->get();

    return [$products, $totalPrice];
  }
}