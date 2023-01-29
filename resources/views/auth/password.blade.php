@extends('layouts.main')

@section('content')
  <section class="profile-section">
    <form action={{ route('update_password') }} method="POST" class="profile-form">
      @csrf
      <div class="input-group">
        @error('old_password')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="old_password">Old Password</label>
        <input type="password" name="old_password" id="old_password">
      </div>
      <div class="input-group">
        @error('password')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="password">New Password</label>
        <input type="password" name="password" id="password">
      </div>
      <div class="input-group">
        <label for="password_confirmation">Password Confirmation</label>
        <input type="password" name="password_confirmation" id="password_confirmation">
      </div>
      <div class="button-group">
        <button type="submit">Save</button>
      </div>
    </form>
  </section>
@endsection