import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
    LayoutDashboard, Package, User, Shield, LogOut,
    ChevronRight, ShoppingBag, Star, Truck, CheckCircle2,
    Clock, XCircle, Eye, MapPin, CreditCard, Bell,
    Edit3, Save, X, ArrowRight, BadgeCheck, Zap, Award
} from 'lucide-react';

// Normaliza el formato de la API al formato que esperan los componentes
function normalizeOrder(o) {
    return {
        id:     o.folio || o.id,
        date:   o.fecha,
        status: o.status || 'procesando',
        total:  (typeof o.total === 'number') ? o.total : parseFloat(o.total) || 0,
        items:  (o.items || []).map(i => ({
            name:  i.name,
            qty:   i.quantity ?? i.qty ?? 1,
            price: i.price,
            image: i.image || '',
        })),
    };
}

const STATUS = {
    entregado:  { label: 'Entregado',  icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    en_camino:  { label: 'En camino',  icon: Truck,        color: 'text-blue-600 bg-blue-50 border-blue-100'           },
    procesando: { label: 'Procesando', icon: Clock,        color: 'text-amber-600 bg-amber-50 border-amber-100'         },
    cancelado:  { label: 'Cancelado',  icon: XCircle,      color: 'text-red-500 bg-red-50 border-red-100'               },
};

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ user, orders, loading }) {
    const totalSpent = orders.reduce((s, o) => s + o.total, 0);
    const delivered  = orders.filter(o => o.status === 'entregado').length;

    return (
        <div className="space-y-6">
            {/* Welcome card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-3xl overflow-hidden p-6 md:p-8">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,_#3b82f6_0%,_transparent_70%)]" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="size-16 md:size-20 rounded-2xl bg-blue-600 flex items-center justify-center font-display font-black text-2xl text-white shadow-lg shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-display text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-1">Bienvenido de vuelta</p>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">{user.name}</h2>
                        <p className="text-slate-400 text-xs font-medium mt-1">{user.email}</p>
                    </div>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-3 mt-6">
                    {[
                        { label: 'Pedidos',       value: orders.length },
                        { label: 'Entregados',    value: delivered      },
                        { label: 'Total gastado', value: `$${totalSpent.toLocaleString()}` },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 text-center">
                            <p className="font-display text-lg md:text-2xl font-bold text-white">{s.value}</p>
                            <p className="font-display text-[8px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { icon: Package,     label: 'Mis pedidos',   sub: `${orders.length} órdenes`,  to: null, tab: 'pedidos'  },
                    { icon: ShoppingBag, label: 'Tienda',        sub: 'Explorar productos',        to: '/shop'               },
                    { icon: User,        label: 'Mi perfil',     sub: 'Editar datos',              to: null, tab: 'perfil'   },
                    { icon: Shield,      label: 'Seguridad',     sub: 'Contraseña',                to: null, tab: 'seguridad'},
                ].map((item, i) => (
                    item.to ? (
                        <Link key={i} to={item.to} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:border-blue-200 hover:shadow-md transition-all group">
                            <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <item.icon className="size-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                                <p className="font-display text-xs font-bold text-slate-900">{item.label}</p>
                                <p className="text-slate-400 text-[9px] font-medium">{item.sub}</p>
                            </div>
                        </Link>
                    ) : (
                        <button key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:border-blue-200 hover:shadow-md transition-all group text-left">
                            <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <item.icon className="size-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                                <p className="font-display text-xs font-bold text-slate-900">{item.label}</p>
                                <p className="text-slate-400 text-[9px] font-medium">{item.sub}</p>
                            </div>
                        </button>
                    )
                ))}
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">Pedidos recientes</h3>
                </div>
                <div className="space-y-3">
                    {orders.slice(0, 2).map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            </div>

            {/* Badges */}
            <div>
                <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Tus logros</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Star,       label: 'Cliente VIP',          desc: 'Más de 3 compras',   earned: true  },
                        { icon: BadgeCheck, label: 'Comprador verificado', desc: 'Cuenta verificada',  earned: true  },
                        { icon: Award,      label: 'Early Adopter',        desc: 'Primer mes de app',  earned: false },
                    ].map((b, i) => (
                        <div key={i} className={`rounded-2xl border p-4 flex flex-col items-center gap-2 text-center ${b.earned ? 'bg-white border-blue-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                            <div className={`size-9 rounded-xl flex items-center justify-center ${b.earned ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                <b.icon className={`size-4 ${b.earned ? 'text-blue-600' : 'text-slate-400'}`} />
                            </div>
                            <p className={`font-display text-[9px] font-bold uppercase tracking-wide leading-tight ${b.earned ? 'text-slate-900' : 'text-slate-400'}`}>{b.label}</p>
                            <p className="text-[8px] font-medium text-slate-400">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({ order }) {
    const [open, setOpen] = useState(false);
    const s = STATUS[order.status] || STATUS.procesando;
    const StatusIcon = s.icon;

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all">
            <div className="p-4 md:p-5 flex items-center gap-4">
                {/* First product image */}
                <div className="size-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0">
                    <img src={order.items[0].image} alt="" className="w-full h-full object-contain mix-blend-multiply" onError={e => e.target.style.display='none'} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-display text-xs font-bold text-slate-900">Pedido {order.id}</p>
                            <p className="text-slate-400 text-[10px] font-medium mt-0.5">{order.date} · {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</p>
                        </div>
                        <span className={`font-display text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 ${s.color}`}>
                            <StatusIcon className="size-3" />
                            {s.label}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-sm font-bold text-slate-900">${order.total.toLocaleString()} <span className="text-[9px] font-semibold text-slate-400">MXN</span></span>
                        <button onClick={() => setOpen(!open)} className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                            <Eye className="size-3" />
                            {open ? 'Ocultar' : 'Ver detalle'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded */}
            {open && (
                <div className="border-t border-slate-50 px-4 md:px-5 py-4 bg-slate-50/50 space-y-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="size-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center p-1 shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" onError={e => e.target.style.display='none'} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-display text-[10px] font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                    <p className="text-slate-400 text-[9px]">Cant. {item.qty}</p>
                                </div>
                            </div>
                            <span className="font-display text-xs font-bold text-slate-900 shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                    ))}
                    {order.status === 'entregado' && (
                        <button className="w-full font-display text-[9px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100 transition-colors">
                            <Star className="size-3" /> Dejar reseña
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Tab: Orders ───────────────────────────────────────────────────────────────
function TabPedidos({ orders, loading }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Mis pedidos</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">{loading ? '…' : `${orders.length} órdenes en total`}</p>
                </div>
                <Link to="/shop" className="font-display text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors">
                    Nueva compra <ArrowRight className="size-3" />
                </Link>
            </div>

            {loading ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <svg className="animate-spin size-6 text-blue-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    <p className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cargando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <ShoppingBag className="size-10 text-slate-200 mx-auto mb-4" />
                    <p className="font-display text-sm font-bold text-slate-400">Aún no tienes pedidos</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 mt-4 font-display text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                        Explorar catálogo <ArrowRight className="size-3" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            )}
        </div>
    );
}

// ── Tab: Profile ──────────────────────────────────────────────────────────────
function TabPerfil({ user, updateProfile }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name, email: user.email, telefono: user.phone || '', ciudad: '' });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await updateProfile({ name: form.name, phone: form.telefono });
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Mi perfil</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Administra tu información personal</p>
                </div>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="font-display text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors">
                        <Edit3 className="size-3.5" /> Editar
                    </button>
                ) : (
                    <button onClick={() => setEditing(false)} className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors">
                        <X className="size-3.5" /> Cancelar
                    </button>
                )}
            </div>

            {/* Avatar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center font-display font-black text-2xl text-white shadow-md shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-display text-base font-bold text-slate-900">{user.name}</p>
                    <p className="text-slate-400 text-xs font-medium">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <BadgeCheck className="size-3.5 text-blue-500" />
                        <span className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600">Cuenta verificada</span>
                    </div>
                </div>
            </div>

            {/* Form fields */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { id: 'name',      label: 'Nombre completo', type: 'text'  },
                        { id: 'email',     label: 'Correo',          type: 'email' },
                        { id: 'telefono',  label: 'Teléfono',        type: 'tel'   },
                        { id: 'ciudad',    label: 'Ciudad',          type: 'text'  },
                    ].map(f => (
                        <div key={f.id}>
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">{f.label}</label>
                            <input
                                type={f.type}
                                value={form[f.id] || ''}
                                onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                                disabled={!editing}
                                className={`w-full px-3.5 py-2.5 border rounded-xl font-display text-xs text-slate-800 transition-all focus:outline-none ${
                                    editing
                                        ? 'bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white'
                                        : 'bg-slate-50/50 border-slate-100 text-slate-600 cursor-default'
                                }`}
                            />
                        </div>
                    ))}
                </div>
                {editing && (
                    <div className="px-5 md:px-6 pb-5 space-y-3">
                        {error && <p className="font-display text-[9px] font-bold uppercase tracking-wider text-red-500">{error}</p>}
                        <button onClick={handleSave} disabled={saving} className="font-display flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98]">
                            <Save className="size-3.5" /> {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                )}
            </div>

            {saved && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider text-emerald-700">Perfil actualizado correctamente</span>
                </div>
            )}

            {/* Address card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-blue-600" />
                        <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">Dirección guardada</p>
                    </div>
                    <button className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                        + Agregar
                    </button>
                </div>
                <div className="bg-slate-50 border border-slate-100 border-dashed rounded-xl p-5 text-center">
                    <MapPin className="size-6 text-slate-200 mx-auto mb-2" />
                    <p className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sin direcciones guardadas</p>
                    <p className="text-slate-300 text-[9px] font-medium mt-1">Agrega una dirección para agilizar tus compras</p>
                </div>
            </div>
        </div>
    );
}

// ── Tab: Security ─────────────────────────────────────────────────────────────
function TabSeguridad({ changePassword }) {
    const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' });
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });

    const isValid = form.actual && form.nueva.length >= 8 && form.nueva === form.confirmar;

    const handleSave = async () => {
        if (!isValid) return;
        setSaving(true);
        setError('');
        try {
            await changePassword(form.actual, form.nueva);
            setDone(true);
            setForm({ actual: '', nueva: '', confirmar: '' });
            setTimeout(() => setDone(false), 4000);
        } catch (err) {
            setError(err.message || 'Error al cambiar contraseña');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Seguridad</h3>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Administra el acceso a tu cuenta</p>
            </div>

            {/* Change password */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="size-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Shield className="size-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">Cambiar contraseña</p>
                            <p className="text-slate-400 text-[10px] font-medium">Mínimo 8 caracteres</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: 'actual',    label: 'Contraseña actual'  },
                            { id: 'nueva',     label: 'Nueva contraseña'   },
                            { id: 'confirmar', label: 'Confirmar contraseña' },
                        ].map(f => (
                            <div key={f.id}>
                                <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">{f.label}</label>
                                <div className="relative">
                                    <input
                                        type={show[f.id] ? 'text' : 'password'}
                                        value={form[f.id]}
                                        onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow(p => ({ ...p, [f.id]: !p[f.id] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                    >
                                        <Eye className="size-3.5" />
                                    </button>
                                </div>
                                {f.id === 'confirmar' && form.confirmar && form.nueva !== form.confirmar && (
                                    <p className="font-display text-[9px] font-bold text-red-500 uppercase tracking-wider mt-1">Las contraseñas no coinciden</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {error && <p className="mt-3 font-display text-[9px] font-bold uppercase tracking-wider text-red-500">{error}</p>}

                    <button
                        onClick={handleSave}
                        disabled={!isValid || saving}
                        className="mt-4 font-display flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                    >
                        <Save className="size-3.5" /> {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                    </button>

                    {done && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                            <span className="font-display text-[9px] font-bold uppercase tracking-wider text-emerald-700">Contraseña actualizada correctamente</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Session info */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="size-4 text-blue-600" />
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">Sesión activa</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                        <p className="font-display text-[10px] font-bold text-slate-900">Navegador actual</p>
                        <p className="text-slate-400 text-[9px] font-medium mt-0.5">Activo ahora · Ciudad de México</p>
                    </div>
                    <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="size-4 text-blue-600" />
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">Notificaciones</p>
                </div>
                <div className="space-y-3">
                    {[
                        { label: 'Actualizaciones de pedido',  on: true  },
                        { label: 'Ofertas y promociones',      on: false },
                        { label: 'Novedades de productos',     on: true  },
                    ].map((n, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <span className="font-display text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{n.label}</span>
                            <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${n.on ? 'bg-blue-600' : 'bg-slate-200'} flex items-center px-0.5`}>
                                <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${n.on ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Cuenta() {
    const { user, logout, isAuthenticated, updateProfile, changePassword } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inicio');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;
        api.getMyOrders()
            .then(data => setOrders((data || []).map(normalizeOrder)))
            .catch(() => {})
            .finally(() => setOrdersLoading(false));
    }, [isAuthenticated]);

    const tabs = [
        { id: 'inicio',    icon: LayoutDashboard, label: 'Inicio'    },
        { id: 'pedidos',   icon: Package,         label: 'Pedidos'   },
        { id: 'perfil',    icon: User,            label: 'Perfil'    },
        { id: 'seguridad', icon: Shield,          label: 'Seguridad' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── Breadcrumb bar ── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Mi cuenta</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-display text-[9px] font-black">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500 hidden sm:block">{user.name}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* ── Sidebar ── */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            {/* User mini header */}
                            <div className="p-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center font-display font-black text-base text-white shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-slate-400 text-[9px] font-medium truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="p-2">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span className="font-display text-[10px] font-bold uppercase tracking-wider flex-1 text-left">{tab.label}</span>
                                            {activeTab === tab.id && <ChevronRight className="size-3.5 text-blue-400" />}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Logout */}
                            <div className="p-2 pt-0 border-t border-slate-50 mt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                >
                                    <LogOut className="size-4 shrink-0" />
                                    <span className="font-display text-[10px] font-bold uppercase tracking-wider">Cerrar sesión</span>
                                </button>
                            </div>
                        </div>

                        {/* Help card */}
                        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-5 mt-4 hidden lg:block">
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-2">¿Necesitas ayuda?</p>
                            <p className="font-display text-sm font-bold text-white mb-3">Soporte técnico especializado</p>
                            <Link to="/contacto" className="font-display text-[9px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 w-fit">
                                Contactar <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </aside>

                    {/* ── Content ── */}
                    <div className="lg:col-span-9">

                        {/* Mobile tab bar */}
                        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 mb-5 lg:hidden overflow-x-auto">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-display text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-1 justify-center ${
                                            activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                    >
                                        <Icon className="size-3.5" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {activeTab === 'inicio'    && <TabOverview  user={user} orders={orders} loading={ordersLoading} />}
                        {activeTab === 'pedidos'   && <TabPedidos   orders={orders} loading={ordersLoading} />}
                        {activeTab === 'perfil'    && <TabPerfil    user={user} updateProfile={updateProfile} />}
                        {activeTab === 'seguridad' && <TabSeguridad changePassword={changePassword} />}
                    </div>
                </div>
            </main>
        </div>
    );
}
