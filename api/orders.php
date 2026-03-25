<?php
require_once 'config.php';
cors();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// ── GET all orders ─────────────────────────────────────────────────────────────
if ($method === 'GET' && !$id) {
    $orders = $db->query("SELECT * FROM orders ORDER BY fecha_creacion DESC")->fetchAll();
    foreach ($orders as &$order) {
        $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$order['id']]);
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['price']    = (float)$item['price'];
            $item['quantity'] = (int)$item['quantity'];
        }
        $order['items']    = $items;
        $order['shipping'] = [
            'nombre'      => $order['nombre'],
            'email'       => $order['email'],
            'telefono'    => $order['telefono'],
            'calle'       => $order['calle'],
            'colonia'     => $order['colonia'],
            'cp'          => $order['cp'],
            'ciudad'      => $order['ciudad'],
            'estado'      => $order['estado'],
            'referencias' => $order['referencias'],
        ];
        $order['payment']    = [
            'metodo'        => $order['metodo_pago'],
            'ultimosCuatro' => $order['ultimos_cuatro'],
        ];
        $order['pagoStatus'] = $order['pago_status'];
        $order['total']      = (float)$order['total'];
    }
    ok($orders);
}

// ── GET single order ───────────────────────────────────────────────────────────
if ($method === 'GET' && $id) {
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    $order = $stmt->fetch();
    if (!$order) err('Orden no encontrada', 404);

    $stmt2 = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $stmt2->execute([$id]);
    $order['items'] = $stmt2->fetchAll();
    ok($order);
}

// ── POST create order ──────────────────────────────────────────────────────────
if ($method === 'POST') {
    $d = body();
    if (empty($d['id'])) err('id requerido');

    $db->prepare("
        INSERT INTO orders
          (id,folio,fecha,fecha_creacion,status,pago_status,metodo_pago,ultimos_cuatro,total,
           nombre,email,telefono,calle,colonia,cp,ciudad,estado,referencias)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $d['id'],
        $d['folio']          ?? '',
        $d['fecha']          ?? date('d M Y'),
        $d['fechaCreacion']  ?? date('Y-m-d H:i:s'),
        $d['status']         ?? 'nueva',
        $d['pagoStatus']     ?? 'pendiente',
        $d['payment']['metodo']        ?? null,
        $d['payment']['ultimosCuatro'] ?? null,
        $d['total']          ?? 0,
        $d['shipping']['nombre']      ?? null,
        $d['shipping']['email']       ?? null,
        $d['shipping']['telefono']    ?? null,
        $d['shipping']['calle']       ?? null,
        $d['shipping']['colonia']     ?? null,
        $d['shipping']['cp']          ?? null,
        $d['shipping']['ciudad']      ?? null,
        $d['shipping']['estado']      ?? null,
        $d['shipping']['referencias'] ?? null,
    ]);

    foreach (($d['items'] ?? []) as $item) {
        $db->prepare("
            INSERT INTO order_items (order_id, product_id, name, price, quantity, image, category)
            VALUES (?,?,?,?,?,?,?)
        ")->execute([
            $d['id'],
            $item['id']       ?? null,
            $item['name']     ?? '',
            $item['price']    ?? 0,
            $item['quantity'] ?? 1,
            $item['image']    ?? null,
            $item['category'] ?? null,
        ]);
    }

    ok(['success' => true, 'id' => $d['id']], 201);
}

// ── PATCH update payment status ────────────────────────────────────────────────
if ($method === 'PATCH' && $id) {
    $d = body();
    if (empty($d['pagoStatus'])) err('pagoStatus requerido');
    $db->prepare("UPDATE orders SET pago_status = ? WHERE id = ?")
       ->execute([$d['pagoStatus'], $id]);
    ok(['success' => true]);
}

err('Método no permitido', 405);
