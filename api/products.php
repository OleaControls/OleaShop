<?php
require_once 'config.php';
cors();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

function fmt(array $p): array {
    $p['price']          = (float)$p['price'];
    $p['original_price'] = $p['original_price'] !== null ? (float)$p['original_price'] : null;
    $p['stock']          = (int)$p['stock'];
    $p['activo']         = (bool)$p['activo'];
    $p['rating']         = $p['rating'] !== null ? (float)$p['rating'] : null;
    $p['reviews']        = (int)$p['reviews'];
    $p['features']       = $p['features'] ? json_decode($p['features'], true) : [];
    $p['specs']          = $p['specs']    ? json_decode($p['specs'],    true) : [];
    $p['images']         = $p['images']   ? json_decode($p['images'],   true) : [];
    return $p;
}

// ── GET all products ───────────────────────────────────────────────────────────
if ($method === 'GET') {
    $products = $db->query("SELECT * FROM products ORDER BY name ASC")->fetchAll();
    ok(array_map('fmt', $products));
}

// ── POST create product ────────────────────────────────────────────────────────
if ($method === 'POST') {
    $d  = body();
    $pid = $d['id'] ?? 'p-'.uniqid();

    $db->prepare("
        INSERT INTO products
          (id,name,brand,price,original_price,category,description,image,images,specs,features,stock,activo,badge,rating,reviews)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $pid,
        $d['name']            ?? '',
        $d['brand']           ?? null,
        $d['price']           ?? 0,
        $d['original_price']  ?? null,
        $d['category']        ?? null,
        $d['description']     ?? null,
        $d['image']           ?? null,
        json_encode($d['images']   ?? []),
        json_encode($d['specs']    ?? []),
        json_encode($d['features'] ?? []),
        $d['stock']           ?? 10,
        isset($d['activo']) ? (int)(bool)$d['activo'] : 1,
        $d['badge']           ?? null,
        $d['rating']          ?? null,
        $d['reviews']         ?? 0,
    ]);

    ok(['success' => true, 'id' => $pid], 201);
}

// ── PUT update product ─────────────────────────────────────────────────────────
if ($method === 'PUT' && $id) {
    $d = body();
    $db->prepare("
        UPDATE products SET
          name=?,brand=?,price=?,original_price=?,category=?,description=?,
          image=?,images=?,specs=?,features=?,stock=?,activo=?,badge=?,rating=?,reviews=?
        WHERE id=?
    ")->execute([
        $d['name']           ?? '',
        $d['brand']          ?? null,
        $d['price']          ?? 0,
        $d['original_price'] ?? null,
        $d['category']       ?? null,
        $d['description']    ?? null,
        $d['image']          ?? null,
        json_encode($d['images']   ?? []),
        json_encode($d['specs']    ?? []),
        json_encode($d['features'] ?? []),
        $d['stock']          ?? 10,
        isset($d['activo']) ? (int)(bool)$d['activo'] : 1,
        $d['badge']          ?? null,
        $d['rating']         ?? null,
        $d['reviews']        ?? 0,
        $id,
    ]);
    ok(['success' => true]);
}

// ── DELETE product ─────────────────────────────────────────────────────────────
if ($method === 'DELETE' && $id) {
    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    ok(['success' => true]);
}

// ── PATCH toggle activo ────────────────────────────────────────────────────────
if ($method === 'PATCH' && $id) {
    $db->prepare("UPDATE products SET activo = NOT activo WHERE id = ?")->execute([$id]);
    ok(['success' => true]);
}

err('Método no permitido', 405);
