<?php
require_once 'config.php';
cors();

$db     = getDB();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

match ($action) {
    'register'        => handleRegister($db),
    'login'           => handleLogin($db),
    'logout'          => handleLogout($db),
    'refresh'         => handleRefresh($db),
    'me'              => handleMe($db),
    'profile'         => handleProfile($db),
    'change-password' => handleChangePassword($db),
    default           => err('Acción no válida'),
};

// ─── Register ─────────────────────────────────────────────────────────────────
function handleRegister(PDO $db): void {
    $d     = body();
    $name  = trim($d['name']     ?? '');
    $email = strtolower(trim($d['email'] ?? ''));
    $pass  = $d['password']      ?? '';

    // Validación
    if (!$name || !$email || !$pass)        err('Todos los campos son requeridos');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) err('Correo electrónico inválido');
    if (strlen($name) < 2)                  err('El nombre es muy corto');
    if (strlen($pass) < 8)                  err('La contraseña debe tener al menos 8 caracteres');
    if (!preg_match('/[A-Z]/', $pass))      err('La contraseña debe tener al menos una mayúscula');
    if (!preg_match('/[0-9]/', $pass))      err('La contraseña debe tener al menos un número');

    // Email duplicado
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) err('Este correo ya está registrado');

    // Hash seguro con bcrypt cost 12
    $hash = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);

    $db->prepare("INSERT INTO users (name, email, password_hash) VALUES (?,?,?)")
       ->execute([$name, $email, $hash]);

    $userId = (int)$db->lastInsertId();

    $accessToken = JWT::encode(['sub' => $userId, 'name' => $name, 'email' => $email]);
    issueRefreshCookie($db, $userId);

    ok([
        'accessToken' => $accessToken,
        'user'        => ['id' => $userId, 'name' => $name, 'email' => $email, 'phone' => null],
    ], 201);
}

// ─── Login ────────────────────────────────────────────────────────────────────
function handleLogin(PDO $db): void {
    $ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    checkRateLimit($db, $ip);

    $d     = body();
    $email = strtolower(trim($d['email']    ?? ''));
    $pass  = $d['password'] ?? '';

    if (!$email || !$pass) err('Correo y contraseña requeridos');

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Mismo mensaje para email incorrecto Y contraseña incorrecta (evita enumeración de usuarios)
    if (!$user || !password_verify($pass, $user['password_hash'])) {
        recordFailedAttempt($db, $ip);
        err('Correo o contraseña incorrectos', 401);
    }

    // Limpiar intentos fallidos al entrar bien
    $db->prepare("DELETE FROM login_attempts WHERE ip = ?")->execute([$ip]);

    // Re-hash si el cost cambió
    if (password_needs_rehash($user['password_hash'], PASSWORD_BCRYPT, ['cost' => 12])) {
        $newHash = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);
        $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$newHash, $user['id']]);
    }

    $accessToken = JWT::encode([
        'sub'   => (int)$user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
    ]);
    issueRefreshCookie($db, (int)$user['id']);

    ok([
        'accessToken' => $accessToken,
        'user'        => [
            'id'    => (int)$user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
        ],
    ]);
}

// ─── Logout ───────────────────────────────────────────────────────────────────
function handleLogout(PDO $db): void {
    $cookie = $_COOKIE['olea_refresh'] ?? '';
    if ($cookie) {
        $hash = hash('sha256', $cookie);
        $db->prepare("DELETE FROM refresh_tokens WHERE token_hash = ?")->execute([$hash]);
    }
    clearRefreshCookie();
    ok(['success' => true]);
}

// ─── Refresh ──────────────────────────────────────────────────────────────────
function handleRefresh(PDO $db): void {
    $cookie = $_COOKIE['olea_refresh'] ?? '';
    if (!$cookie) err('Sin sesión activa', 401);

    $hash = hash('sha256', $cookie);
    $stmt = $db->prepare("
        SELECT rt.user_id, u.name, u.email, u.phone
        FROM refresh_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token_hash = ? AND rt.expires_at > NOW()
    ");
    $stmt->execute([$hash]);
    $row = $stmt->fetch();

    if (!$row) {
        clearRefreshCookie();
        err('Sesión expirada, inicia sesión de nuevo', 401);
    }

    // Rotar token (invalidar el anterior, emitir nuevo)
    $db->prepare("DELETE FROM refresh_tokens WHERE token_hash = ?")->execute([$hash]);
    issueRefreshCookie($db, (int)$row['user_id']);

    $accessToken = JWT::encode([
        'sub'   => (int)$row['user_id'],
        'name'  => $row['name'],
        'email' => $row['email'],
    ]);

    ok([
        'accessToken' => $accessToken,
        'user'        => [
            'id'    => (int)$row['user_id'],
            'name'  => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
        ],
    ]);
}

// ─── Me ───────────────────────────────────────────────────────────────────────
function handleMe(PDO $db): void {
    $p    = requireAuth();
    $stmt = $db->prepare("SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?");
    $stmt->execute([$p['sub']]);
    $user = $stmt->fetch();
    if (!$user) err('Usuario no encontrado', 404);
    ok($user);
}

// ─── Profile update ───────────────────────────────────────────────────────────
function handleProfile(PDO $db): void {
    $p = requireAuth();
    $d = body();

    $name    = trim($d['name']    ?? '');
    $phone   = trim($d['phone']   ?? '');
    $address = trim($d['address'] ?? '');

    if ($name && strlen($name) < 2) err('Nombre muy corto');

    $db->prepare("UPDATE users SET name=?, phone=?, address=? WHERE id=?")
       ->execute([$name ?: null, $phone ?: null, $address ?: null, $p['sub']]);

    ok(['success' => true]);
}

// ─── Change password ──────────────────────────────────────────────────────────
function handleChangePassword(PDO $db): void {
    $p    = requireAuth();
    $d    = body();
    $curr = $d['current']  ?? '';
    $new  = $d['password'] ?? '';

    if (!$curr || !$new) err('Campos requeridos');
    if (strlen($new) < 8)                err('Mínimo 8 caracteres');
    if (!preg_match('/[A-Z]/', $new))    err('Debe tener al menos una mayúscula');
    if (!preg_match('/[0-9]/', $new))    err('Debe tener al menos un número');

    $stmt = $db->prepare("SELECT password_hash FROM users WHERE id = ?");
    $stmt->execute([$p['sub']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($curr, $user['password_hash'])) {
        err('Contraseña actual incorrecta', 401);
    }

    $hash = password_hash($new, PASSWORD_BCRYPT, ['cost' => 12]);
    $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$hash, $p['sub']]);

    // Invalidar todas las sesiones excepto la actual (fuerza re-login en otros dispositivos)
    $db->prepare("DELETE FROM refresh_tokens WHERE user_id = ?")->execute([$p['sub']]);
    issueRefreshCookie($db, (int)$p['sub']);

    ok(['success' => true]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers internos
// ═══════════════════════════════════════════════════════════════════════════════

function issueRefreshCookie(PDO $db, int $userId): void {
    // Limpiar tokens expirados del sistema
    $db->exec("DELETE FROM refresh_tokens WHERE expires_at < NOW()");

    // Mantener máx. 5 sesiones activas por usuario
    $stmt = $db->prepare("SELECT id FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 100 OFFSET 5");
    $stmt->execute([$userId]);
    $old = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if ($old) {
        $ph = implode(',', array_fill(0, count($old), '?'));
        $db->prepare("DELETE FROM refresh_tokens WHERE id IN ($ph)")->execute($old);
    }

    // Generar token criptográficamente seguro (256 bits)
    $token = bin2hex(random_bytes(32));
    $hash  = hash('sha256', $token);
    $ip    = $_SERVER['REMOTE_ADDR'] ?? null;

    $db->prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip) VALUES (?,?,DATE_ADD(NOW(), INTERVAL 30 DAY),?)")
       ->execute([$userId, $hash, $ip]);

    $isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    setcookie('olea_refresh', $token, [
        'expires'  => time() + 30 * 24 * 3600,
        'path'     => '/api',
        'secure'   => $isHttps,
        'httponly' => true,   // Inaccesible desde JavaScript
        'samesite' => 'None', // Necesario para cross-origin en desarrollo
    ]);
}

function clearRefreshCookie(): void {
    setcookie('olea_refresh', '', [
        'expires'  => time() - 3600,
        'path'     => '/api',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
}

function checkRateLimit(PDO $db, string $ip): void {
    $stmt = $db->prepare("SELECT attempts, last_attempt FROM login_attempts WHERE ip = ?");
    $stmt->execute([$ip]);
    $row = $stmt->fetch();

    if ($row) {
        $minutesSince = (time() - strtotime($row['last_attempt'])) / 60;
        if ($minutesSince > 15) {
            $db->prepare("DELETE FROM login_attempts WHERE ip = ?")->execute([$ip]);
        } elseif ((int)$row['attempts'] >= 5) {
            $wait = (int)(15 - $minutesSince) + 1;
            err("Demasiados intentos fallidos. Espera $wait minutos e inténtalo de nuevo.", 429);
        }
    }
}

function recordFailedAttempt(PDO $db, string $ip): void {
    $db->prepare("
        INSERT INTO login_attempts (ip, attempts) VALUES (?,1)
        ON DUPLICATE KEY UPDATE attempts = attempts + 1, last_attempt = NOW()
    ")->execute([$ip]);
}
