<?php
define('DB_HOST',    'localhost');
define('DB_NAME',    'u274487731_shopolea');
define('DB_USER',    'u274487731_sistemasolea');
define('DB_CHARSET', 'utf8mb4');

// ── Cargar .env (archivo local, nunca en git) ──────────────────────────────
$_dotenv = @parse_ini_file(__DIR__ . '/.env') ?: [];
function _env(string $key, string $default = ''): string {
    global $_dotenv;
    return $_dotenv[$key] ?? (getenv($key) ?: $default);
}

define('DB_PASS',    _env('DB_PASS'));
define('JWT_SECRET', _env('JWT_SECRET'));
define('ADMIN_USER', 'oleacontrols');
define('ADMIN_PASS', _env('ADMIN_PASS'));

// ── Stripe ─────────────────────────────────────────────────────────────────
define('STRIPE_SECRET_KEY',     _env('STRIPE_SECRET'));
define('STRIPE_WEBHOOK_SECRET', _env('STRIPE_WEBHOOK'));

// ── SMTP / PHPMailer ───────────────────────────────────────────────────────
define('MAIL_HOST',     'smtp.gmail.com');
define('MAIL_PORT',     587);
define('MAIL_SECURE',   'tls');
define('MAIL_USER',     'sistemasoleacontrols@gmail.com');
define('MAIL_PASS',     _env('MAIL_PASS'));
define('MAIL_FROM',     'sistemasoleacontrols@gmail.com');
define('MAIL_FROM_NAME','OLEACONTROLS');

// ─── DB ────────────────────────────────────────────────────────────────────
function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHARSET;
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode(['error' => 'DB connection failed']));
    }
    return $pdo;
}

// ─── JWT (HS256) ───────────────────────────────────────────────────────────
class JWT {
    private static function b64(string $d): string {
        return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
    }
    private static function unb64(string $d): string {
        $pad = strlen($d) % 4;
        if ($pad) $d .= str_repeat('=', 4 - $pad);
        return base64_decode(strtr($d, '-_', '+/'));
    }
    public static function encode(array $payload, int $expSeconds = 1800): string {
        $h = self::b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload['iat'] = time();
        $payload['exp'] = time() + $expSeconds;
        $p = self::b64(json_encode($payload));
        $s = self::b64(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
        return "$h.$p.$s";
    }
    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        [$h, $p, $s] = $parts;
        $expected = self::b64(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
        if (!hash_equals($expected, $s)) return null;
        $data = json_decode(self::unb64($p), true);
        if (!$data || ($data['exp'] ?? 0) < time()) return null;
        return $data;
    }
}

// ─── Middlewares ───────────────────────────────────────────────────────────
function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) err('No autorizado', 401);
    $payload = JWT::decode($m[1]);
    if (!$payload) err('Token inválido o expirado', 401);
    return $payload;
}

function requireAdminAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) err('No autorizado', 401);
    $payload = JWT::decode($m[1]);
    if (!$payload)                            err('Token inválido o expirado', 401);
    if (($payload['role'] ?? '') !== 'admin') err('Acceso denegado', 403);
    return $payload;
}

// ─── CORS ─────────────────────────────────────────────────────────────────
function cors(): void {
    $allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'https://mediumblue-llama-473263.hostingersite.com',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ─── Email (PHPMailer) ─────────────────────────────────────────────────────
function sendEmail(string $to, string $subject, string $html): bool {
    $base = __DIR__ . '/PHPMailer/';
    if (!file_exists($base . 'PHPMailer.php')) {
        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=utf-8',
            'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . '>',
            'Reply-To: sistemasoleacontrols@gmail.com',
        ]);
        return @mail($to, $subject, $html, $headers);
    }
    require_once $base . 'Exception.php';
    require_once $base . 'PHPMailer.php';
    require_once $base . 'SMTP.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = MAIL_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = MAIL_USER;
        $mail->Password   = MAIL_PASS;
        $mail->SMTPSecure = MAIL_SECURE;
        $mail->Port       = MAIL_PORT;
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        $mail->addReplyTo('sistemasoleacontrols@gmail.com', 'Soporte OLEACONTROLS');
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $html;
        $mail->send();
        return true;
    } catch (\Exception $e) {
        error_log('PHPMailer error: ' . $mail->ErrorInfo);
        return false;
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function body(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
function ok($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
function err(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}
