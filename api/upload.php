<?php
require_once 'config.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

requireAdminAuth();

$file = $_FILES['image'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    err('No se recibió archivo válido', 400);
}

// Validar MIME real (no confiar en extensión)
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
if (!isset($allowed[$mime])) err('Tipo no permitido. Solo JPG, PNG, WebP o GIF.', 400);

if ($file['size'] > 5 * 1024 * 1024) err('Archivo demasiado grande. Máximo 5 MB.', 400);

$uploadDir = __DIR__ . '/uploads/products/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$filename = uniqid('prod_') . '.' . $allowed[$mime];
if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) err('Error al guardar el archivo', 500);

ok(['url' => 'https://mediumblue-llama-473263.hostingersite.com/api/uploads/products/' . $filename]);
