@extends('layouts.main')

@section('content')
  <section class="profile-section">
    <h2>Hi {{ $user->name }}</h2>
    <form action={{ route('update_user') }} method="POST" class="profile-form">
      @csrf
      <div class="input-group">
        @error('name')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="name">Name</label>
        <input type="text" name="name" id="name" value="{{ $user->name }}">
      </div>
      <div class="input-group">
        @error('email')
          <p class="errormsg">{{ $message }}</p>
        @enderror
        <label for="name">Email</label>
        <input type="text" name="email" id="name" value={{ $user->email }}>
      </div>
      
      <div class="button-group">
        <button type="submit">Save</button>
      </div>
    </form>
    <div>
      <button class="delete"><a href={{ route('delete_user') }}>Delete Account</a></button>
      <button class="update-password"><a href={{ route('password_form') }}>Change Password</a></button>
    </div>
  </section>
@endsection