<?php
// Archivo temporal de diagnóstico — borrar después de usar
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>PHP " . phpversion() . "</h3>";

// Test 1: config.php
echo "<p>Cargando config.php...</p>";
try {
    require_once 'config.php';
    echo "<p style='color:green'>✅ config.php OK</p>";
} catch (Throwable $e) {
    echo "<p style='color:red'>❌ config.php ERROR: " . $e->getMessage() . "</p>";
    exit;
}

// Test 2: DB
echo "<p>Conectando a BD...</p>";
echo "<p>Host: " . DB_HOST . " | DB: " . DB_NAME . " | User: " . DB_USER . "</p>";
$envPath = __DIR__ . '/.env';
echo "<p>Buscando .env en: <code>" . $envPath . "</code></p>";
echo "<p>.env existe: " . (file_exists($envPath) ? '✅ sí' : '❌ NO existe') . "</p>";
echo "<p>DB_PASS configurado: " . (DB_PASS ? '✅ sí (' . strlen(DB_PASS) . ' chars)' : '❌ vacío') . "</p>";
try {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "<p style='color:green'>✅ Base de datos OK</p>";
} catch (PDOException $e) {
    echo "<p style='color:red'>❌ BD ERROR: " . $e->getMessage() . "</p>";
}

// Test 3: PHPMailer
$base = __DIR__ . '/PHPMailer/';
if (file_exists($base . 'PHPMailer.php')) {
    echo "<p style='color:green'>✅ PHPMailer encontrado</p>";
} else {
    echo "<p style='color:orange'>⚠️ PHPMailer NO encontrado en: $base</p>";
}

echo "<p style='color:blue'><strong>Diagnóstico completo</strong></p>";
