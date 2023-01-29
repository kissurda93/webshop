<x-mail::message>
# Hello 

<p>This your new password: {{ $password }} </p>
<p>After signed in to your account, you have the opprtunity to change this password!</p>

<x-mail::button :url="$url">
To SignIn
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
