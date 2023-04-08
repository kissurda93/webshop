<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\PaymentRequest;
use App\Services\SimplePayService;
use Illuminate\Validation\ValidationException;
use App\Exceptions\PaymentException;
use App\Services\AmrShawkyConverter;

class SimplePayController extends Controller
{
    public function start(PaymentRequest $request, User $user, SimplePayService $simplePayService)
    {
        try {
            $validated = $request->validated();

            $converter = new AmrShawkyConverter();

            $paymentUrl = $simplePayService
            ->collectData($user, $validated)
            ->storeOrder()
            ->convert($converter)
            ->populateTransaction()
            ->runTransaction();

            return response($paymentUrl);
        } catch(ValidationException $e) {
            return response($e->errors());
        } catch(PaymentException $e) {
            return response($e->getMessage(), $e->getCode());
        }

    }

    public function ipn(SimplePayService $simplePayService)
    {
        list($orderRef, $input_json) = $simplePayService->receiveIpn();

        $order = $simplePayService->setIpnOnOrder($orderRef, $input_json);

        $simplePayService->changeProductQuantities($order);
    }
}
