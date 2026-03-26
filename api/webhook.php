<?php
// ── Stripe Webhook ─────────────────────────────────────────────────────────────
// Configura tu webhook secret en el Dashboard de Stripe →
// Developers → Webhooks → tu endpoint → Signing secret
// Luego reemplaza el valor en config.php: define('STRIPE_WEBHOOK_SECRET', 'whsec_...');

require_once 'config.php';
header('Content-Type: application/json');

if (!defined('STRIPE_WEBHOOK_SECRET') || STRIPE_WEBHOOK_SECRET === 'whsec_REEMPLAZA') {
    http_response_code(500);
    exit(json_encode(['error' => 'Webhook secret no configurado']));
}

$payload = file_get_contents('php://input');
$sig     = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (!verifyStripeSignature($payload, $sig, STRIPE_WEBHOOK_SECRET)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Firma inválida']));
}

$event = json_decode($payload, true);
$type  = $event['type'] ?? '';

if ($type === 'payment_intent.succeeded') {
    $pi      = $event['data']['object'];
    $orderId = $pi['metadata']['order_id'] ?? null;

    if ($orderId) {
        $db = getDB();
        $db->prepare("UPDATE orders SET pago_status = 'confirmado' WHERE id = ?")
           ->execute([$orderId]);
    }
}

if ($type === 'payment_intent.payment_failed') {
    $pi      = $event['data']['object'];
    $orderId = $pi['metadata']['order_id'] ?? null;
    if ($orderId) {
        $db = getDB();
        $db->prepare("UPDATE orders SET pago_status = 'fallido' WHERE id = ?")
           ->execute([$orderId]);
    }
}

http_response_code(200);
echo json_encode(['received' => true]);

// ── Verificación de firma Stripe (sin SDK) ────────────────────────────────────
function verifyStripeSignature(string $payload, string $sig, string $secret): bool {
    if (!$sig) return false;
    $parts = [];
    foreach (explode(',', $sig) as $pair) {
        $bits = explode('=', $pair, 2);
        if (count($bits) === 2) $parts[$bits[0]][] = $bits[1];
    }
    $t = (int)($parts['t'][0] ?? 0);
    if (abs(time() - $t) > 300) return false; // 5 min tolerancia
    $signed   = "$t.$payload";
    $expected = hash_hmac('sha256', $signed, $secret);
    foreach ($parts['v1'] ?? [] as $v) {
        if (hash_equals($expected, $v)) return true;
    }
    return false;
}
