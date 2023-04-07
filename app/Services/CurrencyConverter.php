<?php

namespace App\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class CurrencyConverter
{
  private $apiKey;
  private $url;

  public function __construct()
  {
    $this->url = 'https://api.apilayer.com/exchangerates_data/convert';
    $this->apiKey = config('simplePay.CONVERTER_API_KEY');
  }

  public function convert(Collection $products, int $totalPrice): array
  {

    $responses = Http::pool(function (Pool $pool) use ($products, $totalPrice) {
      $products->each(function($product) use ($pool) {
        $pool
        ->withHeaders([
          'apikey' => $this->apiKey,
        ])
        ->get($this->url, [
        'from' => 'USD',
        'to' => 'HUF',
        'amount' => $product['price'],
      ]);
      });

      $pool
      ->as('total')
      ->withHeaders([
        'apikey' => $this->apiKey,
      ])
      ->get($this->url, [
        'from' => 'USD',
        'to' => 'HUF',
        'amount' => $totalPrice,
      ]);
    });

    for ($i = 0; $i <= count($products) - 1; $i++) {
        $products[$i]['price'] = round($responses[$i]['result']);
    }

    $totalPrice = round($responses['total']['result']);

    return [$products, $totalPrice];
  }
}