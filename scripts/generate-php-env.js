// Se ejecuta durante el build en Hostinger.
// Lee las variables de entorno de Node.js y genera api/.env para PHP.
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const vars = {
    DB_PASS:        process.env.DB_PASS        ?? '',
    JWT_SECRET:     process.env.JWT_SECRET     ?? '',
    ADMIN_PASS:     process.env.ADMIN_PASS     ?? '',
    STRIPE_SECRET:  process.env.STRIPE_SECRET  ?? '',
    STRIPE_WEBHOOK: process.env.STRIPE_WEBHOOK ?? '',
    MAIL_PASS:      process.env.MAIL_PASS      ?? '',
};

const content = Object.entries(vars)
    .map(([k, v]) => `${k}="${v.replace(/"/g, '\\"')}"`)
    .join('\n') + '\n';

const outPath = join(root, 'dist', 'api', '.env');
writeFileSync(outPath, content, 'utf8');

console.log('✅ dist/api/.env generado con', Object.keys(vars).length, 'variables');
