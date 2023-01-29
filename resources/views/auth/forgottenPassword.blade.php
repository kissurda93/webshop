@extends('layouts.main')

@section('content')
  <div class="user-form-layout-container">
    <section class="user-form-section">
      <form class="user-form" action={{ route("send_password") }} method="POST">
        @csrf
        @error('email')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="email">Email</label>
        <input id="email" name="email" type="email">
        <button type="submit">Send New Password</button>
      </form>
    </section>
  </div>
@endsection