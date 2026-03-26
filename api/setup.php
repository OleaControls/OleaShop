<?php
// Corre este archivo para crear/actualizar todas las tablas en MySQL
// Visita: https://tu-dominio.com/api/setup.php  (es seguro correrlo más de una vez)
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

$db = getDB();

// ─── Tienda ────────────────────────────────────────────────────────────────
$db->exec("
CREATE TABLE IF NOT EXISTS `orders` (
  `id`             varchar(20)    NOT NULL,
  `folio`          varchar(30)    NOT NULL,
  `fecha`          varchar(30)    NOT NULL,
  `fecha_creacion` datetime       DEFAULT CURRENT_TIMESTAMP,
  `status`         varchar(20)    DEFAULT 'nueva',
  `pago_status`    varchar(20)    DEFAULT 'pendiente',
  `metodo_pago`    varchar(30)    DEFAULT NULL,
  `ultimos_cuatro` varchar(4)     DEFAULT NULL,
  `total`          decimal(10,2)  NOT NULL,
  `nombre`         varchar(100)   DEFAULT NULL,
  `email`          varchar(100)   DEFAULT NULL,
  `telefono`       varchar(20)    DEFAULT NULL,
  `calle`          varchar(200)   DEFAULT NULL,
  `colonia`        varchar(100)   DEFAULT NULL,
  `cp`             varchar(10)    DEFAULT NULL,
  `ciudad`         varchar(100)   DEFAULT NULL,
  `estado`         varchar(100)   DEFAULT NULL,
  `referencias`    text           DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$db->exec("
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`         int(11)       NOT NULL AUTO_INCREMENT,
  `order_id`   varchar(20)   NOT NULL,
  `product_id` varchar(100)  DEFAULT NULL,
  `name`       varchar(200)  NOT NULL,
  `price`      decimal(10,2) NOT NULL,
  `quantity`   int(11)       NOT NULL DEFAULT 1,
  `image`      varchar(500)  DEFAULT NULL,
  `category`   varchar(100)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$db->exec("
CREATE TABLE IF NOT EXISTS `products` (
  `id`             varchar(100)  NOT NULL,
  `name`           varchar(200)  NOT NULL,
  `brand`          varchar(100)  DEFAULT NULL,
  `price`          decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `category`       varchar(100)  DEFAULT NULL,
  `description`    text          DEFAULT NULL,
  `image`          varchar(500)  DEFAULT NULL,
  `images`         json          DEFAULT NULL,
  `specs`          json          DEFAULT NULL,
  `features`       json          DEFAULT NULL,
  `stock`          int(11)       DEFAULT 10,
  `activo`         tinyint(1)    DEFAULT 1,
  `destacado`      tinyint(1)    DEFAULT 0,
  `badge`          varchar(50)   DEFAULT NULL,
  `rating`         decimal(3,1)  DEFAULT NULL,
  `reviews`        int(11)       DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// ─── Auth ──────────────────────────────────────────────────────────────────
$db->exec("
CREATE TABLE IF NOT EXISTS `users` (
  `id`            int(11)      NOT NULL AUTO_INCREMENT,
  `name`          varchar(100) NOT NULL,
  `email`         varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone`         varchar(20)  DEFAULT NULL,
  `address`       text         DEFAULT NULL,
  `created_at`    datetime     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$db->exec("
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id`          int(11)      NOT NULL AUTO_INCREMENT,
  `user_id`     int(11)      NOT NULL,
  `token_hash`  varchar(64)  NOT NULL,
  `expires_at`  datetime     NOT NULL,
  `ip`          varchar(45)  DEFAULT NULL,
  `created_at`  datetime     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `token_hash` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$db->exec("
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `ip`           varchar(45) NOT NULL,
  `attempts`     int(11)     DEFAULT 0,
  `last_attempt` datetime    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$db->exec("
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id`          int(11)      NOT NULL AUTO_INCREMENT,
  `token_hash`  varchar(64)  NOT NULL,
  `expires_at`  datetime     NOT NULL,
  `created_at`  datetime     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `token_hash` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// ─── Migraciones (agregar columnas nuevas si no existen) ───────────────────
$migrations = [
    "ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `destacado` tinyint(1) DEFAULT 0",
];
foreach ($migrations as $sql) {
    try { $db->exec($sql); } catch (Exception $e) { /* columna ya existe */ }
}

echo json_encode([
    'success' => true,
    'tables'  => ['orders', 'order_items', 'products', 'users', 'refresh_tokens', 'login_attempts'],
    'message' => 'Todas las tablas creadas/verificadas correctamente.',
]);
