<x-mail::message>
# Hello {{ $user->name }}

Click the button below to verify your account.

<x-mail::button :url="$url">
Verify Account
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
