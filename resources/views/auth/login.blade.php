@extends('layouts.main')

@section('content')
  <div class="user-form-layout-container">
    <section class="user-form-section">
      <h2>Please Sign In</h2>
      <form class="user-form" action={{ route('login') }} method="POST">
        @csrf
        @error('name')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="email">Email</label>
        <input id="email" name="email" type="email">
        @error('password')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="password">Password</label>
        <input id="password" name="password" type="password">
        <button type="submit">Sign In</button>
      </form>
      <p>Or <a href={{ route('register.view') }}>create a new account</a> if you don't have one!</p>
      <p>Did you forget your password? <a href={{ route('send_password_form') }}>Click Here!</a></p>
    </section>
  </div>
@endsection