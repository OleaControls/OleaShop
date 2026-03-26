<?php
require_once 'config.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

$body  = body();
$amount = intval(round(($body['amount'] ?? 0) * 100)); // MXN → centavos

if ($amount < 100) err('Monto inválido: mínimo $1 MXN');

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_USERPWD        => STRIPE_SECRET_KEY . ':',
    CURLOPT_POSTFIELDS     => http_build_query([
        'amount'                             => $amount,
        'currency'                           => 'mxn',
        'automatic_payment_methods[enabled]' => 'true',
    ]),
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($httpCode !== 200 || empty($data['client_secret'])) {
    err($data['error']['message'] ?? 'Error al crear el PaymentIntent', 500);
}

ok(['clientSecret' => $data['client_secret']]);
