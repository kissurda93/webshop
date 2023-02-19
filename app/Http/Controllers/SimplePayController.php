<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;
use App\Http\Requests\PaymentRequest;

class SimplePayController extends Controller
{
    public $trx;
    public $trxIPN;

    function __construct()
    {
        require_once __DIR__ . '/SimplePayV21.php';
        $this->trx = new SimplePayStart;
        $this->trx->addData('currency', config('simplePay.CURRENCY'));
        $this->trx->addConfig(config('simplePay'));
        $this->trxIPN = new SimplePayIpn;
        $this->trxIPN->addConfig(config('simplePay'));
    }

    public function start(PaymentRequest $request) {
        $validated = $request->validated();

        // Collect and supplement user infos from database
        // -----------------------------------------------------------
        $user = User::find($validated['id']);

        $address = $user->addresses()->where('default', 1)->first();
        if(!isset($address['state'])) {
            $address['state'] = $address['country'];
        }
        if(!isset($address['city'])) {
            $address['city'] = $address['state'];
        }


        // Collect and supplement the product infos from database
        // -------------------------------------------------------
        $products = $validated['products'];
        $productsInDB = collect();

        foreach($products as $product) {
            $newProduct = Product::find($product['product_id']);

            $newProduct['quantity'] = $product['product_quantity'];

            $newProduct['price'] = $newProduct['price'] - $newProduct['price'] * ($newProduct['discountPercentage'] / 100);
            
            $productsInDB->push($newProduct);
        }

        
        
        // Storing Order in database
        // -----------------------------------------------
        $totalPrice = $productsInDB->reduce(fn ($total, $product) => $total + $product['price'] * $product['quantity']);
        $orderRef = str_replace(array('.', ':', '/'), "", @$_SERVER['SERVER_ADDR']) . @date("U", time()) . rand(1000, 9999);

        $user->orders()->create([
            'user_data' => json_encode($user),
            'products_data' => json_encode($productsInDB),
            'total_price' => $totalPrice,
            'address' => $address,
            'payment_status' => 'In Progress',
            'delivery_status' => 'Not Started',
            'order_ref' => $orderRef,
        ]);


        // Converting USD to HUF via Exchange Rates Data API
        // ------------------------------------------------------------------------------
        // $responses = Http::pool(function (Pool $pool) use ($productsInDB, $totalPrice) {
        //     foreach($productsInDB as $product) {
        //         $pool->withHeaders([
        //             'apikey' => env('EXCHANGE_RATES_DATA_API_KEY'),
        //         ])->get('https://api.apilayer.com/exchangerates_data/convert', [
        //         'from' => 'USD',
        //         'to' => 'HUF',
        //         'amount' => $product['price'],
        //     ]);
        //     }
        //     $pool->as('total')->withHeaders([
        //         'apikey' => env('EXCHANGE_RATES_DATA_API_KEY'),
        //     ])->get('https://api.apilayer.com/exchangerates_data/convert', [
        //         'from' => 'USD',
        //         'to' => 'HUF',
        //         'amount' => $totalPrice,
        //     ]);
        // });

        // for ($i = 0; $i <= count($productsInDB) - 1; $i++) {
        //     $productsInDB[$i]['price'] = round($responses[$i]['result']);
        // }

        // $totalPrice = round($responses['total']['result']);

        
        // Giving data to SimplePay Transaction
        // -------------------------------------------------------------------------------------------------------------------------
        $this->trx->addData('total', round($totalPrice));

        //ORDER ITEMS
        //-----------------------------------------------------------------------------------------
        foreach($productsInDB as $product) {
            $this->trx->addItems([
                'ref' => $product['id'],
                 'title' => $product['title'],
                 'description' => $product['description'],
                 'amount' => $product['quantity'],
                 'price' => $product['price'],
            ]);
        }

        // ORDER REFERENCE NUMBER
        // uniq oreder reference number in the merchant system
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('orderRef', $orderRef);


        // CUSTOMER
        // customer's name
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('customer', $user->name);


        // customer's registration mehod
        // 01: guest
        // 02: registered
        // 05: third party
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('threeDSReqAuthMethod', '02');


        // EMAIL
        // customer's email
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('customerEmail', $user->email);


        // LANGUAGE
        // HU, EN, DE, etc.
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('language', 'EN');


        // TIMEOUT
        // 2018-09-15T11:25:37+02:00
        //-----------------------------------------------------------------------------------------
        $timeoutInSec = 600;
        $timeout = @date("c", time() + $timeoutInSec);
        $this->trx->addData('timeout', $timeout);


        // METHODS
        // CARD or WIRE
        //-----------------------------------------------------------------------------------------
        $this->trx->addData('methods', array('CARD'));


        // REDIRECT URLs
        //-----------------------------------------------------------------------------------------

        // common URL for all result
        $this->trx->addData('url', config('simplePay.URL'));


        // INVOICE DATA
        //-----------------------------------------------------------------------------------------
        $this->trx->addGroupData('invoice', 'name', $user->name);
        //$this->trx->addGroupData('invoice', 'company', '');
        $this->trx->addGroupData('invoice', 'country', $address->country);
        $this->trx->addGroupData('invoice', 'state', $address->state);
        $this->trx->addGroupData('invoice', 'city', $address->city);
        $this->trx->addGroupData('invoice', 'zip', '1111');
        $this->trx->addGroupData('invoice', 'address', $address->address);
        //$this->trx->addGroupData('invoice', 'address2', 'Address 2');
        //$this->trx->addGroupData('invoice', 'phone', '06201234567');


        //payment starter element
        // auto: (immediate redirect)
        // button: (default setting)
        // link: link to payment page
        //-----------------------------------------------------------------------------------------
        $this->trx->formDetails['element'] = 'button';


        //create transaction in SimplePay system
        //-----------------------------------------------------------------------------------------
        $this->trx->runStart();


        //create html form for payment using by the created transaction
        //-----------------------------------------------------------------------------------------
        $this->trx->getHtmlForm();


        //return link to payment form
        //-----------------------------------------------------------------------------------------
        return response(['url' => $this->trx->returnData['paymentUrl']]);
    }

    public function ipn() {
        $json = file_get_contents('php://input');

        $input = (array) json_decode($json);


        //check signature and confirm IPN
        //-----------------------------------------------------------------------------------------
        if ($this->trxIPN->isIpnSignatureCheck($json)) {
            /**
             * Generates all response
             * Puts signature into header
             * Print response body
             *
             * Use this OR getIpnConfirmContent
             */
            $this->trxIPN->runIpnConfirm();

            /**
             * Generates all response
             * Gets signature and response body
             *
             * You must set signeature in header and you must print response body!
             *
             * Use this OR runIpnConfirm()
             */
            //$confirm = $trx->getIpnConfirmContent();

        }
    }
}
