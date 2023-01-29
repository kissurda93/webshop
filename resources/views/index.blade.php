@extends('layouts.main')

@section('content')
  <section class="products">
    @foreach ($products as $product)
    <div class="product-container">
      <img src="{{ $product->thumbnail }}" alt="Image of the product" >
      <p>Name: {{ $product->title }}</p>
      <p>Brand: {{ $product->brand }}</p>
      <p>Description: {{ $product->description }}</p>
      <p>Price: {{ $product->price }}</p>
      <p>Rating: {{ $product->rating }}</p>
      <p>Stock: {{ $product->stock }}</p>
    </div>
    @endforeach
  </section>
@endsection