<?php

namespace App\Exceptions;

use Exception;

class AddressException extends Exception
{
    protected $message;
    protected $responseCode;

    public function __construct(string $message, int $responseCode)
    {
        $this->message = $message;
        $this->responseCode = $responseCode;
    }

    public function message()
    {
        return ['message' => $this->message];
    }

    public function responseCode()
    {
        return $this->responseCode;
    }
}
