<?php
require_once 'config.php';
cors();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET reviews for a product ──────────────────────────────────────────────────
if ($method === 'GET') {
    $productId = $_GET['product_id'] ?? '';
    if (!$productId) err('product_id requerido');

    $stmt = $db->prepare("
        SELECT id, user_name, rating, comment, created_at
        FROM reviews WHERE product_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$productId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['rating'] = (int)$r['rating'];
    }
    ok($rows);
}

// ── POST create review ─────────────────────────────────────────────────────────
if ($method === 'POST') {
    $p      = requireAuth();
    $d      = body();
    $pid    = trim($d['product_id'] ?? '');
    $rating = (int)($d['rating']     ?? 5);
    $comment = trim($d['comment']    ?? '');

    if (!$pid) err('product_id requerido');
    if ($rating < 1 || $rating > 5) err('Rating debe ser entre 1 y 5');

    // Verificar que el usuario no haya dejado ya una reseña
    $check = $db->prepare("SELECT id FROM reviews WHERE user_id = ? AND product_id = ?");
    $check->execute([$p['sub'], $pid]);
    if ($check->fetch()) err('Ya dejaste una reseña para este producto');

    $db->prepare("
        INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
        VALUES (?, ?, ?, ?, ?)
    ")->execute([$pid, $p['sub'], $p['name'], $rating, $comment ?: null]);

    // Actualizar rating promedio del producto
    $avg = $db->prepare("SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE product_id = ?");
    $avg->execute([$pid]);
    $r = $avg->fetch();
    $db->prepare("UPDATE products SET rating = ?, reviews = ? WHERE id = ?")
       ->execute([round($r['avg'], 1), (int)$r['cnt'], $pid]);

    ok(['success' => true], 201);
}

err('Método no permitido', 405);
