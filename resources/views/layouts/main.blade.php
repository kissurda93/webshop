<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>WebShop</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
  <header>
    <nav class="header-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/">Products</a></li>
        <li><a href="/">Categories</a></li>
      </ul>
    </nav>
    <section class="account-section">
      @auth
        <a href={{ route('profile') }}>Profile</a>
        <a href={{ route('logout') }}>SignOut</a>
      @endauth
      @guest
      <a href={{ route('login.view') }}>SignIn</a>
      |
      <a href="/">DemoAccount</a>
      @endguest
      
    </section>
  </header>

  <main>
    @if (session('message'))
      <div class="message-container">
        <section 
        @if (session('type') == 'failed')
          class="message message-failed"
        @else
          class="message"
        @endif
        >
          <p>{{ session('message') }}</p>
        </section>
      </div>
    @endif
    
    @yield('content')
  </main>
  
</body>
</html>