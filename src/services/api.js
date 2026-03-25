// Base URL: en desarrollo usa VITE_API_URL del .env.local
// En producción (Hostinger) usa /api relativo al dominio
const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request(endpoint, options = {}) {
    const res = await fetch(`${BASE}/${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    // ── Orders ────────────────────────────────────────────────────────────────
    getOrders:          ()               => request('orders.php'),
    createOrder:        (order)          => request('orders.php', { method: 'POST', body: JSON.stringify(order) }),
    updateOrderPayment: (id, pagoStatus) => request(`orders.php?id=${id}`, { method: 'PATCH', body: JSON.stringify({ pagoStatus }) }),

    // ── Products ──────────────────────────────────────────────────────────────
    getProducts:   ()            => request('products.php'),
    createProduct: (product)     => request('products.php', { method: 'POST', body: JSON.stringify(product) }),
    updateProduct: (id, product) => request(`products.php?id=${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    deleteProduct: (id)          => request(`products.php?id=${id}`, { method: 'DELETE' }),
    toggleProduct: (id)          => request(`products.php?id=${id}`, { method: 'PATCH' }),
};
