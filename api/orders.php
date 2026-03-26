<?php
require_once 'config.php';
cors();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// ── GET my orders (filtered by logged-in user's email) ─────────────────────────
if ($method === 'GET' && !$id && isset($_GET['me'])) {
    $payload = requireAuth();
    $email   = $payload['email'] ?? '';
    $stmt    = $db->prepare("SELECT * FROM orders WHERE email = ? ORDER BY fecha_creacion DESC");
    $stmt->execute([$email]);
    $orders  = $stmt->fetchAll();
    foreach ($orders as &$order) {
        $s = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $s->execute([$order['id']]);
        $items = $s->fetchAll();
        foreach ($items as &$item) {
            $item['price']    = (float)$item['price'];
            $item['quantity'] = (int)$item['quantity'];
        }
        $order['items'] = $items;
        $order['total'] = (float)$order['total'];
    }
    ok($orders);
}

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

    // ── Descontar stock ────────────────────────────────────────────────────
    foreach (($d['items'] ?? []) as $item) {
        if (!empty($item['id'])) {
            $db->prepare("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?")
               ->execute([$item['quantity'] ?? 1, $item['id']]);
        }
    }

    // ── Email de confirmación ──────────────────────────────────────────────
    $buyerEmail = $d['shipping']['email'] ?? '';
    $buyerName  = $d['shipping']['nombre'] ?? 'Cliente';
    $folio      = $d['folio'] ?? $d['id'];
    $total      = (float)($d['total'] ?? 0);
    $items      = $d['items'] ?? [];

    if ($buyerEmail) {
        $rows = '';
        foreach ($items as $item) {
            $subtotal = number_format($item['price'] * ($item['quantity'] ?? 1), 2);
            $rows .= "<tr>
                <td style='padding:10px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;'>{$item['name']}</td>
                <td style='padding:10px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;text-align:center;'>{$item['quantity']}</td>
                <td style='padding:10px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;font-weight:700;text-align:right;'>\${$subtotal}</td>
            </tr>";
        }
        $totalFmt = number_format($total, 2);
        $html = "
<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f6f6f4;font-family:Arial,sans-serif;'>
<div style='max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);'>
  <div style='background:#1e3a5f;padding:32px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;'>OLEACONTROLS</h1>
    <p style='margin:6px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;'>Confirmación de pedido</p>
  </div>
  <div style='padding:32px 36px;'>
    <p style='color:#334155;font-size:15px;margin:0 0 8px;'>Hola <strong>{$buyerName}</strong>,</p>
    <p style='color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6;'>Tu pedido ha sido recibido y está siendo procesado. Recibirás una notificación cuando sea enviado.</p>
    <div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:24px;'>
      <p style='margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#94a3b8;'>Número de pedido</p>
      <p style='margin:0;font-size:20px;font-weight:800;color:#2563eb;'>{$folio}</p>
    </div>
    <table style='width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;'>
      <thead><tr style='background:#f1f5f9;'>
        <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:left;'>Producto</th>
        <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:center;'>Cant.</th>
        <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:right;'>Total</th>
      </tr></thead>
      <tbody>{$rows}</tbody>
      <tfoot><tr style='background:#fff;'>
        <td colspan='2' style='padding:14px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#2563eb;border-top:2px solid #e2e8f0;'>Total a pagar</td>
        <td style='padding:14px 16px;font-size:18px;font-weight:800;color:#0f172a;text-align:right;border-top:2px solid #e2e8f0;'>\${$totalFmt} MXN</td>
      </tr></tfoot>
    </table>
    <p style='color:#64748b;font-size:13px;line-height:1.6;margin:0;'>¿Tienes preguntas? Escríbenos a <a href='mailto:soporte@oleacontrols.com' style='color:#2563eb;'>soporte@oleacontrols.com</a> o llámanos al <strong>55 7919 2845</strong>.</p>
  </div>
  <div style='background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;'>
    <p style='margin:0;font-size:11px;color:#94a3b8;text-align:center;'>© 2026 OLEACONTROLS · Ingeniería en Sistemas Especiales · Ciudad de México</p>
  </div>
</div>
</body></html>";
        sendEmail($buyerEmail, "Pedido confirmado {$folio} — OLEACONTROLS", $html);
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
