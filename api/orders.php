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

// ── GET all orders (solo admin) ────────────────────────────────────────────────
if ($method === 'GET' && !$id) {
    requireAdminAuth();
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
            $qty      = (int)($item['quantity'] ?? 1);
            $subtotal = number_format((float)$item['price'] * $qty, 2);
            $nameEsc  = htmlspecialchars($item['name'] ?? '');
            $rows .= "
            <tr>
              <td style='padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;'>{$nameEsc}</td>
              <td style='padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;text-align:center;'>{$qty}</td>
              <td style='padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;font-weight:700;text-align:right;'>\${$subtotal} MXN</td>
            </tr>";
        }
        $totalFmt  = number_format($total, 2);
        $safeName  = htmlspecialchars($buyerName);
        $shipping  = $d['shipping'] ?? [];
        $calle     = htmlspecialchars($shipping['calle']    ?? '');
        $colonia   = htmlspecialchars($shipping['colonia']  ?? '');
        $cp        = htmlspecialchars($shipping['cp']       ?? '');
        $ciudad    = htmlspecialchars($shipping['ciudad']   ?? '');
        $estado    = htmlspecialchars($shipping['estado']   ?? '');
        $metodo    = $d['payment']['metodo'] ?? 'tarjeta';
        $metodoLabel = ['tarjeta'=>'Tarjeta de crédito/débito','transferencia'=>'Transferencia SPEI','efectivo'=>'Efectivo'][$metodo] ?? $metodo;

        $html = "
<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f6f6f4;font-family:Arial,sans-serif;'>
<div style='max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);'>

  <!-- Header -->
  <div style='background:linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 100%);padding:36px;text-align:center;'>
    <img src='https://mediumblue-llama-473263.hostingersite.com/IMG%20PARA%20PAGINA%20SHOP/logo.png'
         alt='OLEACONTROLS' style='height:28px;filter:brightness(0) invert(1);margin-bottom:14px;' />
    <div style='display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;margin-bottom:12px;'>✅</div>
    <h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:800;'>¡Pedido confirmado!</h1>
    <p style='margin:8px 0 0;color:#93c5fd;font-size:13px;'>Tu orden está siendo procesada</p>
  </div>

  <!-- Folio banner -->
  <div style='background:#eff6ff;border-bottom:2px solid #bfdbfe;padding:16px 36px;display:flex;justify-content:space-between;align-items:center;'>
    <div>
      <p style='margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#94a3b8;'>Número de pedido</p>
      <p style='margin:4px 0 0;font-size:22px;font-weight:800;color:#1d4ed8;letter-spacing:-0.5px;'>{$folio}</p>
    </div>
    <a href='https://mediumblue-llama-473263.hostingersite.com/cuenta'
       style='background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;letter-spacing:0.05em;'>
      Ver pedido →
    </a>
  </div>

  <!-- Body -->
  <div style='padding:32px 36px;'>
    <p style='color:#334155;font-size:15px;margin:0 0 6px;font-weight:600;'>Hola, {$safeName} 👋</p>
    <p style='color:#64748b;font-size:14px;margin:0 0 28px;line-height:1.7;'>
      Tu pedido ha sido recibido y está siendo preparado. En breve recibirás actualizaciones sobre el estado de tu envío.
    </p>

    <!-- Products table -->
    <p style='margin:0 0 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#94a3b8;'>Productos comprados</p>
    <table style='width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;'>
      <thead>
        <tr style='background:#f8fafc;'>
          <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:left;'>Producto</th>
          <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:center;'>Cant.</th>
          <th style='padding:10px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;text-align:right;'>Subtotal</th>
        </tr>
      </thead>
      <tbody>{$rows}</tbody>
      <tfoot>
        <tr>
          <td colspan='2' style='padding:14px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1d4ed8;border-top:2px solid #e2e8f0;'>Total pagado</td>
          <td style='padding:14px 16px;font-size:20px;font-weight:800;color:#0f172a;text-align:right;border-top:2px solid #e2e8f0;'>\${$totalFmt} MXN</td>
        </tr>
      </tfoot>
    </table>

    <!-- Info grid -->
    <table style='width:100%;border-collapse:collapse;margin-bottom:24px;'>
      <tr>
        <td style='width:50%;padding-right:8px;vertical-align:top;'>
          <div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;'>
            <p style='margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#94a3b8;'>📦 Dirección de entrega</p>
            <p style='margin:0;font-size:13px;color:#334155;font-weight:600;'>{$safeName}</p>
            <p style='margin:4px 0 0;font-size:12px;color:#64748b;line-height:1.6;'>{$calle}<br>{$colonia}, CP {$cp}<br>{$ciudad}, {$estado}</p>
          </div>
        </td>
        <td style='width:50%;padding-left:8px;vertical-align:top;'>
          <div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;'>
            <p style='margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#94a3b8;'>💳 Método de pago</p>
            <p style='margin:0;font-size:13px;color:#334155;font-weight:600;'>{$metodoLabel}</p>
            <p style='margin:8px 0 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#94a3b8;'>📅 Entrega estimada</p>
            <p style='margin:4px 0 0;font-size:13px;color:#334155;font-weight:600;'>24 – 48 horas hábiles</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- Next steps -->
    <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;'>
      <p style='margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#15803d;'>¿Qué sigue?</p>
      <table style='width:100%;border-collapse:collapse;'>
        <tr><td style='padding:4px 0;font-size:13px;color:#166534;'>1️⃣ &nbsp;Preparamos tu pedido en nuestro almacén</td></tr>
        <tr><td style='padding:4px 0;font-size:13px;color:#166534;'>2️⃣ &nbsp;Te enviamos el número de guía de rastreo</td></tr>
        <tr><td style='padding:4px 0;font-size:13px;color:#166534;'>3️⃣ &nbsp;Tu equipo llega en 24–48 horas hábiles</td></tr>
      </table>
    </div>

    <p style='color:#94a3b8;font-size:12px;margin:0;line-height:1.7;'>
      ¿Tienes dudas? Contáctanos en
      <a href='mailto:sistemasoleacontrols@gmail.com' style='color:#2563eb;text-decoration:none;'>sistemasoleacontrols@gmail.com</a>
      o al <strong>55 7919 2845</strong> · Lun–Sáb 10am–7pm
    </p>
  </div>

  <!-- Footer -->
  <div style='background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;text-align:center;'>
    <p style='margin:0;font-size:11px;color:#94a3b8;'>© 2026 OLEACONTROLS · Ingeniería en Sistemas Especiales · Ciudad de México</p>
    <p style='margin:6px 0 0;font-size:11px;'>
      <a href='https://mediumblue-llama-473263.hostingersite.com/devoluciones' style='color:#94a3b8;text-decoration:none;'>Política de Devoluciones</a>
      &nbsp;·&nbsp;
      <a href='https://mediumblue-llama-473263.hostingersite.com/privacidad' style='color:#94a3b8;text-decoration:none;'>Aviso de Privacidad</a>
    </p>
  </div>
</div>
</body></html>";
        sendEmail($buyerEmail, "✅ Pedido {$folio} confirmado — OLEACONTROLS", $html);
    }

    ok(['success' => true, 'id' => $d['id']], 201);
}

// ── PATCH update payment status (solo admin) ──────────────────────────────────
if ($method === 'PATCH' && $id) {
    requireAdminAuth();
    $d = body();
    if (empty($d['pagoStatus'])) err('pagoStatus requerido');
    $db->prepare("UPDATE orders SET pago_status = ? WHERE id = ?")
       ->execute([$d['pagoStatus'], $id]);
    ok(['success' => true]);
}

err('Método no permitido', 405);
