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
    'forgot-password' => handleForgotPassword($db),
    'reset-password'  => handleResetPassword($db),
    'admin-login'     => handleAdminLogin($db),
    'admin-refresh'   => handleAdminRefresh($db),
    'admin-logout'    => handleAdminLogout($db),
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

// ─── Forgot password ──────────────────────────────────────────────────────────
function handleForgotPassword(PDO $db): void {
    $d     = body();
    $email = strtolower(trim($d['email'] ?? ''));
    if (!$email) err('Email requerido');

    $stmt = $db->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $db->prepare("DELETE FROM password_resets WHERE user_id = ?")->execute([$user['id']]);
        $token = bin2hex(random_bytes(32));
        $hash  = hash('sha256', $token);
        $db->prepare("INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))")
           ->execute([$user['id'], $hash]);

        $url  = 'https://mediumblue-llama-473263.hostingersite.com/reset-password?token=' . $token;
        $name = htmlspecialchars($user['name']);
        $html = "
<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f6f6f4;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);'>
  <div style='background:#1e3a5f;padding:32px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:20px;font-weight:800;'>OLEACONTROLS</h1>
    <p style='margin:4px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;'>Recuperar contraseña</p>
  </div>
  <div style='padding:32px 36px;'>
    <p style='color:#334155;font-size:15px;margin:0 0 8px;'>Hola <strong>{$name}</strong>,</p>
    <p style='color:#64748b;font-size:14px;margin:0 0 28px;line-height:1.6;'>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón para continuar. Este enlace expira en <strong>1 hora</strong>.</p>
    <a href='{$url}' style='display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.05em;'>Restablecer contraseña</a>
    <p style='color:#94a3b8;font-size:12px;margin:24px 0 0;line-height:1.6;'>Si no solicitaste esto, ignora este mensaje. Tu contraseña no cambiará.</p>
  </div>
  <div style='background:#f8fafc;padding:16px 36px;border-top:1px solid #e2e8f0;'>
    <p style='margin:0;font-size:11px;color:#94a3b8;text-align:center;'>© 2026 OLEACONTROLS · Ciudad de México</p>
  </div>
</div></body></html>";
        sendEmail($email, 'Recuperar contraseña — OLEACONTROLS', $html);
    }
    // Siempre responder igual (evitar enumeración de usuarios)
    ok(['success' => true]);
}

// ─── Reset password ────────────────────────────────────────────────────────────
function handleResetPassword(PDO $db): void {
    $d        = body();
    $token    = $d['token']    ?? '';
    $password = $d['password'] ?? '';

    if (!$token || !$password) err('Token y contraseña requeridos');
    if (strlen($password) < 8)             err('Mínimo 8 caracteres');
    if (!preg_match('/[A-Z]/', $password)) err('Debe tener al menos una mayúscula');
    if (!preg_match('/[0-9]/', $password)) err('Debe tener al menos un número');

    $hash = hash('sha256', $token);
    $stmt = $db->prepare("SELECT user_id FROM password_resets WHERE token_hash = ? AND expires_at > NOW()");
    $stmt->execute([$hash]);
    $row = $stmt->fetch();
    if (!$row) err('Enlace inválido o expirado. Solicita uno nuevo.', 400);

    $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$newHash, $row['user_id']]);
    $db->prepare("DELETE FROM password_resets WHERE user_id = ?")->execute([$row['user_id']]);
    $db->prepare("DELETE FROM refresh_tokens WHERE user_id = ?")->execute([$row['user_id']]);

    ok(['success' => true]);
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function handleAdminLogin(PDO $db): void {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    checkRateLimit($db, $ip);

    $d    = body();
    $user = trim($d['user']     ?? '');
    $pass = trim($d['password'] ?? '');

    if (!$user || !$pass) err('Usuario y contraseña requeridos');

    // Comparación timing-safe para evitar ataques de temporización
    $validUser = hash_equals(ADMIN_USER, $user);
    $validPass = hash_equals(ADMIN_PASS, $pass);

    if (!$validUser || !$validPass) {
        recordFailedAttempt($db, $ip);
        err('Credenciales inválidas', 401);
    }

    $db->prepare("DELETE FROM login_attempts WHERE ip = ?")->execute([$ip]);

    $accessToken = JWT::encode(['sub' => 0, 'role' => 'admin', 'name' => 'Administrador'], 3600);
    issueAdminRefreshCookie($db);

    ok(['accessToken' => $accessToken]);
}

// ─── Admin Refresh ────────────────────────────────────────────────────────────
function handleAdminRefresh(PDO $db): void {
    $cookie = $_COOKIE['olea_admin_refresh'] ?? '';
    if (!$cookie) err('Sin sesión admin', 401);

    $hash = hash('sha256', $cookie);
    $stmt = $db->prepare("SELECT id, expires_at FROM admin_sessions WHERE token_hash = ? AND expires_at > NOW()");
    $stmt->execute([$hash]);
    $row = $stmt->fetch();

    if (!$row) {
        clearAdminRefreshCookie();
        err('Sesión admin expirada', 401);
    }

    $db->prepare("DELETE FROM admin_sessions WHERE token_hash = ?")->execute([$hash]);
    issueAdminRefreshCookie($db);

    $accessToken = JWT::encode(['sub' => 0, 'role' => 'admin', 'name' => 'Administrador'], 3600);
    ok(['accessToken' => $accessToken]);
}

// ─── Admin Logout ─────────────────────────────────────────────────────────────
function handleAdminLogout(PDO $db): void {
    $cookie = $_COOKIE['olea_admin_refresh'] ?? '';
    if ($cookie) {
        $hash = hash('sha256', $cookie);
        $db->prepare("DELETE FROM admin_sessions WHERE token_hash = ?")->execute([$hash]);
    }
    clearAdminRefreshCookie();
    ok(['success' => true]);
}

// ─── Admin cookie helpers ─────────────────────────────────────────────────────
function issueAdminRefreshCookie(PDO $db): void {
    $db->exec("DELETE FROM admin_sessions WHERE expires_at < NOW()");
    $token = bin2hex(random_bytes(32));
    $hash  = hash('sha256', $token);
    $db->prepare("INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, DATE_ADD(NOW(), INTERVAL 8 HOUR))")
       ->execute([$hash]);

    $isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    setcookie('olea_admin_refresh', $token, [
        'expires'  => time() + 8 * 3600,
        'path'     => '/api',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'None',
    ]);
}

function clearAdminRefreshCookie(): void {
    setcookie('olea_admin_refresh', '', [
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
