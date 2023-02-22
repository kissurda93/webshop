<?php

return [
    //HUF
    'HUF_MERCHANT' => env('SIMPLE_PAY_MERCHANT'),            //merchant account ID (HUF)
    'HUF_SECRET_KEY' => env('SIMPLE_PAY_SECRET_KEY'),          //secret key for account ID (HUF)
    
    //EUR
    'EUR_MERCHANT' => "",            //merchant account ID (EUR)
    'EUR_SECRET_KEY' => "",          //secret key for account ID (EUR)

    //USD
    'USD_MERCHANT' => "",            //merchant account ID (USD)
    'USD_SECRET_KEY' => "",          //secret key for account ID (USD)

    'SANDBOX' => true,

    //common return URL
    'URL' => env('APP_FRONTEND_URL') . '/payment-message',

    //optional uniq URL for events
    /*
    'URLS_SUCCESS' => 'http://' . $_SERVER['HTTP_HOST'] . '/success.php',       //url for successful payment
    'URLS_FAIL' => 'http://' . $_SERVER['HTTP_HOST'] . '/fail.php',             //url for unsuccessful
    'URLS_CANCEL' => 'http://' . $_SERVER['HTTP_HOST'] . '/cancel.php',         //url for cancell on payment page
    'URLS_TIMEOUT' => 'http://' . $_SERVER['HTTP_HOST'] . '/timeout.php',       //url for payment page timeout
    */

    'GET_DATA' => (isset($_GET['r']) && isset($_GET['s'])) ? ['r' => $_GET['r'], 's' => $_GET['s']] : [],
    'POST_DATA' => $_POST,
    'SERVER_DATA' => $_SERVER,

    'LOGGER' => true,                              //basic transaction log
    'LOG_PATH' => __DIR__.'/../storage/logs',                           //path of log file

    //3DS
    'AUTOCHALLENGE' => true,                      //in case of unsuccessful payment with registered card run automatic challange

    'CURRENCY' => 'HUF',

    'CONVERTER_API_KEY' => env('EXCHANGE_RATES_DATA_API_KEY'),
];
