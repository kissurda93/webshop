<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\PaymentRequest;
use App\Services\SimplePayService;
use Illuminate\Validation\ValidationException;
use App\Exceptions\PaymentException;
use App\Services\CurrencyConverter;

class SimplePayController extends Controller
{
    public function start(PaymentRequest $request, User $user, SimplePayService $simplePayService)
    {
        try {
            $validated = $request->validated();
            $simplePayService->prepareUser($user, $validated);
            $simplePayService->prepareProducts($validated['products']);
        } catch(ValidationException $e) {
            return response($e->errors());
        } catch(PaymentException $e) {
            return response($e->message(), $e->responseCode());
        }
        
        $simplePayService->storeOrder($user);

        $converter = new CurrencyConverter();
        $simplePayService->convert($converter);

        $simplePayService->populateTransaction();

        $paymentUrl = $simplePayService->runTransaction();

        return response($paymentUrl);
    }

    public function ipn(SimplePayService $simplePayService)
    {
        list($orderRef, $input_json) = $simplePayService->receiveIpn();

        $order = $simplePayService->setIpnOnOrder($orderRef, $input_json);

        $simplePayService->changeProductQuantities($order);
    }
}
