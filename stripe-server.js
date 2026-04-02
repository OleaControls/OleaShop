import express from 'express';
import cors    from 'cors';
import Stripe  from 'stripe';
import dotenv  from 'dotenv';

dotenv.config({ path: '.env.local' });

const HOSTINGER = 'https://mediumblue-llama-473263.hostingersite.com';
const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY);
const app       = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// ── Upload proxy — ANTES de express.json() para no consumir el stream ────
app.post('/api/upload.php', async (req, res) => {
    const url = `${HOSTINGER}/api/upload.php`;
    try {
        const headers = { 'Content-Type': req.headers['content-type'] };
        if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
        // Pasar req directamente como stream (Node 18+)
        const fetchRes = await fetch(url, { method: 'POST', headers, body: req, duplex: 'half' });
        const text = await fetchRes.text();
        res.status(fetchRes.status).type('application/json').send(text);
    } catch (err) {
        console.error('❌  Upload error:', err.message);
        res.status(502).json({ error: 'Upload proxy error: ' + err.message });
    }
});

app.use(express.json());

// ── Stripe PaymentIntent ─────────────────────────────────────────────────────
app.post('/api/stripe.php', async (req, res) => {
    try {
        const amount = Math.round((req.body.amount ?? 0) * 100);
        if (amount < 100) return res.status(400).json({ error: 'Monto inválido: mínimo $1 MXN' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'mxn',
            automatic_payment_methods: { enabled: true },
        });

        console.log(`✅  PaymentIntent: ${paymentIntent.id} — $${req.body.amount} MXN`);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('❌  Stripe error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── Proxy → Hostinger ────────────────────────────────────────────────────────
app.use('/api', async (req, res) => {
    const qs  = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const url = `${HOSTINGER}/api${req.path}${qs}`;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
        if (req.headers.cookie)        headers['Cookie']        = req.headers.cookie;

        const fetchRes = await fetch(url, {
            method:  req.method,
            headers,
            body: ['POST','PUT','PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
        });

        const setCookie = fetchRes.headers.get('set-cookie');
        if (setCookie) res.setHeader('Set-Cookie', setCookie);

        const text = await fetchRes.text();
        res.status(fetchRes.status)
           .type(fetchRes.headers.get('content-type') || 'application/json')
           .send(text);
    } catch (err) {
        console.error('❌  Proxy error:', err.message);
        res.status(502).json({ error: 'Proxy error: ' + err.message });
    }
});

app.listen(3001, () => {
    console.log('\n🚀  Servidor corriendo en http://localhost:3001');
    console.log('   ✅  /api/stripe.php  → Stripe local');
    console.log('   🔀  /api/*           → Proxy a Hostinger\n');
    console.log('   Tarjetas de prueba:');
    console.log('   4242 4242 4242 4242 → Éxito');
    console.log('   4000 0000 0000 9995 → Rechazada');
    console.log('   4000 0025 0000 3155 → 3D Secure\n');
});
