const BASE = import.meta.env.VITE_API_URL ?? '/api';

// Token en memoria (nunca en localStorage — más seguro)
let _token = null;
export const setToken   = (t) => { _token = t; };
export const clearToken = ()  => { _token = null; };

async function request(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
        ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
    };

    const res = await fetch(`${BASE}/${endpoint}`, {
        credentials: 'include', // envía cookies httpOnly cross-origin
        ...options,
        headers,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    // ── Admin Auth ────────────────────────────────────────────────────────────
    admin: {
        login:   (data) => request('auth.php?action=admin-login',   { method: 'POST', body: JSON.stringify(data) }),
        refresh: ()     => request('auth.php?action=admin-refresh',  { method: 'POST' }),
        logout:  ()     => request('auth.php?action=admin-logout',   { method: 'POST' }),
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    auth: {
        register:       (data)  => request('auth.php?action=register', { method: 'POST', body: JSON.stringify(data) }),
        login:          (data)  => request('auth.php?action=login',    { method: 'POST', body: JSON.stringify(data) }),
        logout:         ()      => request('auth.php?action=logout',   { method: 'POST' }),
        refresh:        ()      => request('auth.php?action=refresh',  { method: 'POST' }),
        me:             ()      => request('auth.php?action=me'),
        updateProfile:  (data)  => request('auth.php?action=profile',        { method: 'PUT',  body: JSON.stringify(data) }),
        changePassword: (data)  => request('auth.php?action=change-password',{ method: 'POST', body: JSON.stringify(data) }),
    },

    // ── Stripe ───────────────────────────────────────────────────────────────
    createPaymentIntent: (amount) => request('stripe.php', { method: 'POST', body: JSON.stringify({ amount }) }),

    // ── Orders ────────────────────────────────────────────────────────────────
    getOrders:          ()               => request('orders.php'),
    createOrder:        (order)          => request('orders.php', { method: 'POST', body: JSON.stringify(order) }),
    updateOrderPayment: (id, pagoStatus) => request(`orders.php?id=${id}`, { method: 'PATCH', body: JSON.stringify({ pagoStatus }) }),

    // ── Products ──────────────────────────────────────────────────────────────
    getProducts:   ()            => request('products.php'),
    createProduct: (product)     => request('products.php', { method: 'POST', body: JSON.stringify(product) }),
    updateProduct: (id, product) => request(`products.php?id=${id}`, { method: 'PUT',  body: JSON.stringify(product) }),
    deleteProduct: (id)          => request(`products.php?id=${id}`, { method: 'DELETE' }),
    toggleProduct: (id)          => request(`products.php?id=${id}`, { method: 'PATCH' }),
};
