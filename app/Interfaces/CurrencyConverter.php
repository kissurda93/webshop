<?php

namespace App\Interfaces;

use Illuminate\Support\Collection;

interface CurrencyConverter
{
  function convert(Collection $products, int $totalPrice): array;
}