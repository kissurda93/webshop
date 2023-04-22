<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Exceptions\PaymentException;
use App\Models\Address;
use App\Services\SimplePayV21\SimplePayStart;
use App\Services\SimplePayV21\SimplePayIpn;
use App\Interfaces\CurrencyConverter;

class SimplePayService
{
  private $trx;
  private $trxIPN;
  private $dataToTrx = [];
  private $user;

  public function __construct()
  {
    $this->trx = new SimplePayStart;
    $this->trx->addData('currency', config('simplePay.CURRENCY'));
    $this->trx->addConfig(config('simplePay'));
    $this->trxIPN = new SimplePayIpn;
    $this->trxIPN->addConfig(config('simplePay'));
  }

  public function populateTransaction(): object
  {
    extract($this->dataToTrx);

    $this->trx->addData('total', round($totalPrice));

    //ORDER ITEMS
    //-----------------------------------------------------------------------------------------
    foreach($products as $product) {
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
    $this->trx->addGroupData('invoice', 'country', $invoiceAddress->country);
    $this->trx->addGroupData('invoice', 'state', $invoiceAddress->state);
    $this->trx->addGroupData('invoice', 'city', $invoiceAddress->city);
    $this->trx->addGroupData('invoice', 'zip', '1111');
    $this->trx->addGroupData('invoice', 'address', $invoiceAddress->address);

    // DELIVERY DATA
    //-----------------------------------------------------------------------------------------
    
    $this->trx->addGroupData('delivery', 'name', $user->name);
    $this->trx->addGroupData('delivery', 'country', $deliveryAddress->country);
    $this->trx->addGroupData('delivery', 'state', $deliveryAddress->state);
    $this->trx->addGroupData('delivery', 'city', $deliveryAddress->city);
    $this->trx->addGroupData('delivery', 'zip', '1111');
    $this->trx->addGroupData('delivery', 'address', $deliveryAddress->address);
    



    //payment starter element
    // auto: (immediate redirect)
    // button: (default setting)
    // link: link to payment page
    //-----------------------------------------------------------------------------------------
    $this->trx->formDetails['element'] = 'button';

    return $this;
  }

  public function runTransaction(): string
  {
    //create transaction in SimplePay system
    //-----------------------------------------------------------------------------------------
    $this->trx->runStart();


    //create html form for payment using by the created transaction
    //-----------------------------------------------------------------------------------------
    $this->trx->getHtmlForm();


    //return link to payment form
    //-----------------------------------------------------------------------------------------
    return  $this->trx->returnData['paymentUrl'];
  }

  public function receiveIpn(): array
  {
    $input_json = file_get_contents('php://input');

    // $input = (array) json_decode($input_json);

    //check signature and confirm IPN
    //-----------------------------------------------------------------------------------------
    if ($this->trxIPN->isIpnSignatureCheck($input_json)) {
      /**
       * Generates all response
       * Puts signature into header
       * Print response body
       *
       * Use this OR getIpnConfirmContent
       */
      $this->trxIPN->runIpnConfirm();

      $orderRef = $this->trxIPN->logOrderRef;

      return [$orderRef, $input_json];

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

  public function collectData(User $user, array $request): object
  {
    $this->user = $user;
    $this->processAddresses($request['invoice'], $request['delivery']);
    $this->processProducts($request['products']);

    return $this;
  }

  public function storeOrder(): object
  {
    $orderRef = str_replace(array('.', ':', '/'), "", @$_SERVER['SERVER_ADDR']) . @date("U", time()) . rand(1000, 9999);

    $this->dataToTrx['orderRef'] = $orderRef;

    $this->user->orders()->create([
      'user_data' => json_encode($this->user),
      'products_data' => json_encode($this->dataToTrx['products']),
      'total_price' => $this->dataToTrx['totalPrice'],
      'invoice_address' => json_encode($this->dataToTrx['invoiceAddress']),
      'delivery_address' => json_encode($this->dataToTrx['deliveryAddress']),
      'payment_status' => 'In Progress',
      'delivery_status' => 'Not Started',
      'order_ref' => $orderRef,
    ]);

    return $this;
  }

  public function storeOrderWithoutSimplePay()
  {
    $orderRef = str_replace(array('.', ':', '/'), "", @$_SERVER['SERVER_ADDR']) . @date("U", time()) . rand(1000, 9999);

    $order = $this->user->orders()->create([
      'user_data' => json_encode($this->user),
      'products_data' => json_encode($this->dataToTrx['products']),
      'total_price' => $this->dataToTrx['totalPrice'],
      'invoice_address' => json_encode($this->dataToTrx['invoiceAddress']),
      'delivery_address' => json_encode($this->dataToTrx['deliveryAddress']),
      'payment_status' => 'Completed',
      'delivery_status' => 'Started',
      'order_ref' => $orderRef,
    ]);

    $this->changeProductQuantities($order);

    return $this;
  }


  public function convert(CurrencyConverter $converter): object
  {
    list($products, $totalPrice) = $converter->convert($this->dataToTrx['products'], $this->dataToTrx['totalPrice']);

    $this->dataToTrx['products'] = $products;
    $this->dataToTrx['totalPrice'] = $totalPrice;

    return $this;
  }

  public function setIpnOnOrder(string $orderRef, string $input_json): Order
  {
    $order = Order::where('order_ref', $orderRef)->first();
    $order->update([
        'payment_status' => 'Successfull',
        'delivery_status' => 'Started',
        'ipn_status' => true,
        'ipn_response' => $input_json,
    ]);

    return $order;
  }

  public function changeProductQuantities(Order $order)
  {
    $productsJSON = $order->products_data;
    $products = json_decode($productsJSON);

    foreach($products as $product) {
        $productInDb = Product::find($product->id);
        $stock = $productInDb['stock'];
        $productInDb->update(['stock' => $stock - $product->quantity]);
    }
  }

  private function validateAddress (Address $address): Address
  {
    $validatedAddress = $address;
  
    if(!isset($validatedAddress['state'])) {
        $validatedAddress['state'] = $address['country'];
    }
  
    if(!isset($validatedAddress['city'])) {
        $validatedAddress['city'] = $address['state'];
    }
  
    return $validatedAddress;
  }

  private function processAddresses(string $invoice, string $delivery)
  {
    $invoiceAddress = $this->user->addresses()->find($invoice);
    $this->dataToTrx['invoiceAddress'] = $this->validateAddress($invoiceAddress);

    $deliveryAddress = $this->user->addresses()->find($delivery);
    $this->dataToTrx['deliveryAddress'] = $this->validateAddress($deliveryAddress);

    $this->dataToTrx['user'] = $this->user;
  }

  private function processProducts(array $products)
  {
    $productsInDB = collect();

    foreach($products as $product) {
      $newProduct = Product::find($product['product_id']);
      
      if($product['product_quantity'] > $newProduct['stock']) {
        $productTitle = $newProduct['title'];
        throw new PaymentException(
        "Not enough in stock ($productTitle)", 422);
      }

      $newProduct['quantity'] = $product['product_quantity'];
      $newProduct['price'] = $newProduct['price'] - $newProduct['price'] * ($newProduct['discountPercentage'] / 100);
      
      $productsInDB->push($newProduct);
    }
    
    $totalPrice = $productsInDB->reduce(fn ($total, $product) => $total + $product['price'] * $product['quantity']);
    
    $this->dataToTrx['products'] = $productsInDB;    
    $this->dataToTrx['totalPrice'] = $totalPrice;  
  }
}