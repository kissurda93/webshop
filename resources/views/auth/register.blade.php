@extends('layouts.main')

@section('content')
  <div class="user-form-layout-container">
    <section class="user-form-section">
      <h2>Please Sign Up</h2>
      <form class="user-form" action="/register" method="POST">
        @csrf
        @error('name')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="name">Name</label>
        <input id="name" name="name" type="text" value="{{ old('name') }}">
        @error('email')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value="{{ old('email') }}">
        @error('password')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="password">Password</label>
        <input id="password" name="password" type="password">
        <label for="password_confirmation">Password Confirmation</label>
        <input id="password_confirmation" name="password_confirmation" type="password">
        <button type="submit">Sign Up</button>
      </form>
      <p>Or <a href={{ route('login.view') }}>Sign In</a> if you have an account!</p>
    </section>
  </div>
@endsection