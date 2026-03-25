import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { api } from '../services/api';
import {
    LayoutDashboard, Package, Calendar, Users, Wrench, LogOut,
    ChevronRight, TrendingUp, Clock, CheckCircle2, XCircle,
    AlertCircle, Phone, Mail, MapPin, Search, Filter, Plus,
    Edit2, Trash2, X, ChevronLeft, BarChart2, Boxes, Star,
    Zap, Shield, ArrowUp, ArrowDown, Menu, Bell, Home,
    ClipboardList, UserCheck, CreditCard, Check, Eye, FileText,
    CalendarDays, ArrowRight, Image, Tag, DollarSign,
    ToggleLeft, ToggleRight, Building2, Truck, RefreshCw,
    BadgeCheck, AlertTriangle
} from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

// ─── Status configs ───────────────────────────────────────────────────────────
const INSTALL_STATUS = {
    nueva:       { label: 'Nueva',        icon: AlertCircle,  dot: 'bg-slate-400',   color: 'text-slate-600  bg-slate-100   border-slate-200'   },
    contactado:  { label: 'Contactado',   icon: Phone,        dot: 'bg-amber-500',   color: 'text-amber-700  bg-amber-50    border-amber-200'   },
    agendado:    { label: 'Agendado',     icon: Calendar,     dot: 'bg-blue-500',    color: 'text-blue-700   bg-blue-50     border-blue-200'    },
    en_proceso:  { label: 'En proceso',   icon: Wrench,       dot: 'bg-violet-500',  color: 'text-violet-700 bg-violet-50   border-violet-200'  },
    completado:  { label: 'Completado',   icon: CheckCircle2, dot: 'bg-emerald-500', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    cancelado:   { label: 'Cancelado',    icon: XCircle,      dot: 'bg-red-500',     color: 'text-red-600    bg-red-50      border-red-200'     },
};
const PAGO_STATUS = {
    pendiente:  { label: 'Pendiente',   color: 'text-amber-700 bg-amber-50 border-amber-200'    },
    confirmado: { label: 'Confirmado',  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    rechazado:  { label: 'Rechazado',   color: 'text-red-600 bg-red-50 border-red-200'          },
};
const METODO_LABEL = {
    tarjeta:      'Tarjeta',
    transferencia:'Transferencia SPEI',
    contraentrega:'Contra entrega',
};
const PRIORITY = {
    alta:   { label: 'Alta',   color: 'text-red-600 bg-red-50 border-red-200'         },
    media:  { label: 'Media',  color: 'text-amber-600 bg-amber-50 border-amber-200'   },
    normal: { label: 'Normal', color: 'text-slate-500 bg-slate-100 border-slate-200'  },
};
const CATEGORY_OPTIONS = ['Seguridad', 'Hogar Inteligente', 'Seguridad Avanzada'];
const TECHNICIANS = ['Miguel Torres','Laura Sánchez','Andrés Morales','Sofía Ramírez'];

// ─── Small stat card ──────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, trend, color = 'blue' }) {
    const bg = { blue:'bg-blue-600 shadow-blue-600/20', emerald:'bg-emerald-500 shadow-emerald-500/20', violet:'bg-violet-600 shadow-violet-600/20', amber:'bg-amber-500 shadow-amber-500/20' };
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`size-10 rounded-xl flex items-center justify-center shadow-lg ${bg[color]}`}>
                    <Icon className="size-5 text-white" />
                </div>
                {trend !== undefined && (
                    <span className={`font-display text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {trend >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}{Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</p>
            {sub && <p className="text-[10px] font-medium text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function TabDashboard({ orders, setTab }) {
    const activas  = orders.filter(o => ['nueva','contactado','agendado','en_proceso'].includes(o.status));
    const completadas = orders.filter(o => o.status === 'completado');
    const revenue  = orders.filter(o => o.status !== 'cancelado').reduce((s,o) => s+o.total, 0);
    const pendPago = orders.filter(o => o.pagoStatus === 'pendiente' && o.status !== 'cancelado').length;


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={TrendingUp}   label="Ingresos totales"        value={`$${revenue.toLocaleString()}`}  sub="MXN · todas las órdenes"  trend={12}  color="blue"    />
                <StatCard icon={ClipboardList} label="Órdenes activas"         value={activas.length}                  sub="Pendientes de instalar"             color="violet"  />
                <StatCard icon={CheckCircle2} label="Completadas"             value={completadas.length}              sub="Instalaciones terminadas"  trend={5}   color="emerald" />
                <StatCard icon={AlertTriangle} label="Pagos pendientes"        value={pendPago}                        sub="Por confirmar"                       color="amber"   />
            </div>

            {/* Recent orders */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                        <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">Últimas órdenes</h3>
                        <button onClick={() => setTab('ordenes')} className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                            Ver todas <ChevronRight className="size-3" />
                        </button>
                    </div>
                    {orders.length === 0 ? (
                        <div className="py-12 text-center">
                            <Boxes className="size-8 text-slate-200 mx-auto mb-3" />
                            <p className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">Sin órdenes recibidas</p>
                            <p className="text-slate-300 text-[10px] font-medium mt-1">Las órdenes aparecerán aquí cuando los clientes realicen compras</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {orders.slice(0, 5).map(order => {
                                const s = INSTALL_STATUS[order.status];
                                const SIcon = s.icon;
                                const ps = PAGO_STATUS[order.pagoStatus];
                                return (
                                    <div key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                                        <div className={`size-8 rounded-xl border flex items-center justify-center shrink-0 ${s.color.split(' ').slice(1).join(' ')}`}>
                                            <SIcon className={`size-4 ${s.color.split(' ')[0]}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display text-xs font-bold text-slate-900">{order.shipping?.nombre || 'Cliente'}</p>
                                            <p className="text-slate-400 text-[10px] font-medium">{order.folio} · {order.fecha}</p>
                                        </div>
                                        <div className="text-right shrink-0 space-y-0.5">
                                            <p className="font-display text-xs font-bold text-slate-900">${order.total.toLocaleString()}</p>
                                            <span className={`font-display text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${ps.color}`}>{ps.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── PDF generator ────────────────────────────────────────────────────────────
function generateOrderPDF(order) {
    const ps  = PAGO_STATUS[order.pagoStatus];
    const rows = (order.items || []).map(item => `
        <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;">${item.name}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;text-align:right;">$${item.price.toLocaleString()}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:700;color:#0f172a;text-align:right;">$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Orden de Compra ${order.folio}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#0f172a; font-size:13px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display:none; }
  }
  .page { max-width:760px; margin:0 auto; padding:40px 48px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:36px; padding-bottom:28px; border-bottom:2px solid #e2e8f0; }
  .brand { display:flex; align-items:center; gap:12px; }
  .brand-icon { width:44px; height:44px; background:#2563eb; border-radius:12px; display:flex; align-items:center; justify-content:center; }
  .brand-icon svg { width:24px; height:24px; fill:white; }
  .brand-name { font-size:18px; font-weight:800; color:#0f172a; letter-spacing:-0.5px; }
  .brand-sub { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#94a3b8; }
  .order-ref { text-align:right; }
  .order-ref .folio { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#2563eb; }
  .order-ref .title { font-size:22px; font-weight:800; color:#0f172a; letter-spacing:-0.5px; margin:2px 0; }
  .order-ref .date { font-size:11px; color:#94a3b8; font-weight:500; }
  .badge { display:inline-block; padding:4px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; border:1px solid; margin-top:6px; }
  .badge-confirmado { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; }
  .badge-pendiente  { background:#fffbeb; color:#b45309; border-color:#fde68a; }
  .badge-rechazado  { background:#fef2f2; color:#dc2626; border-color:#fecaca; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
  .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; }
  .card-title { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#94a3b8; margin-bottom:10px; }
  .card p { font-size:12px; color:#475569; margin-bottom:4px; line-height:1.5; }
  .card .name { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:6px; }
  table { width:100%; border-collapse:collapse; margin-bottom:0; }
  .table-wrap { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:28px; }
  thead th { background:#f1f5f9; padding:10px 12px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:#64748b; text-align:left; }
  thead th:last-child, thead th:nth-child(2), thead th:nth-child(3) { text-align:right; }
  thead th:nth-child(2) { text-align:center; }
  .total-row td { padding:14px 12px; border-top:2px solid #e2e8f0; }
  .total-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:#2563eb; }
  .total-value { font-size:18px; font-weight:800; color:#0f172a; text-align:right; }
  .footer { border-top:1px solid #e2e8f0; padding-top:20px; display:flex; justify-content:space-between; align-items:center; }
  .footer-note { font-size:10px; color:#94a3b8; line-height:1.6; }
  .print-btn { display:block; margin:0 auto 28px; padding:12px 32px; background:#2563eb; color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; }
  .print-btn:hover { background:#1d4ed8; }
</style>
</head>
<body>
<div class="page">
  <button class="print-btn no-print" onclick="window.print()">⬇ Imprimir / Guardar PDF</button>

  <div class="header">
    <div class="brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
      </div>
      <div>
        <div class="brand-name">Olea Controls</div>
        <div class="brand-sub">Seguridad · Domótica</div>
      </div>
    </div>
    <div class="order-ref">
      <div class="folio">${order.folio}</div>
      <div class="title">Orden de Compra</div>
      <div class="date">${order.fecha}</div>
      <span class="badge badge-${order.pagoStatus}">${ps?.label || order.pagoStatus}</span>
    </div>
  </div>

  <div class="grid2">
    <div class="card">
      <div class="card-title">Datos del cliente</div>
      <p class="name">${order.shipping?.nombre || '—'}</p>
      <p>📧 ${order.shipping?.email || '—'}</p>
      <p>📞 ${order.shipping?.telefono || '—'}</p>
    </div>
    <div class="card">
      <div class="card-title">Dirección de entrega / instalación</div>
      <p>${order.shipping?.calle || '—'}</p>
      <p>${order.shipping?.colonia || ''}, CP ${order.shipping?.cp || ''}</p>
      <p>${order.shipping?.ciudad || ''}, ${order.shipping?.estado || ''}</p>
      ${order.shipping?.referencias ? `<p><em>Ref: ${order.shipping.referencias}</em></p>` : ''}
    </div>
    <div class="card">
      <div class="card-title">Método de pago</div>
      <p class="name">${METODO_LABEL[order.payment?.metodo] || order.payment?.metodo || '—'}</p>
      ${order.payment?.ultimosCuatro ? `<p>Tarjeta terminación **** ${order.payment.ultimosCuatro}</p>` : ''}
    </div>
    <div class="card">
      <div class="card-title">Referencia</div>
      <p class="name">${order.id}</p>
      <p>Folio: ${order.folio}</p>
      <p>Fecha: ${order.fecha}</p>
    </div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr>
        <th>Producto / Servicio</th>
        <th style="text-align:center">Cant.</th>
        <th style="text-align:right">P. Unit.</th>
        <th style="text-align:right">Subtotal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="total-row">
        <td colspan="3"><span class="total-label">Total a pagar</span></td>
        <td><span class="total-value">$${order.total.toLocaleString()} MXN</span></td>
      </tr></tfoot>
    </table>
  </div>

  <div class="footer">
    <div class="footer-note">
      Olea Controls · ventas@oleacontrols.mx<br>
      Este documento es una confirmación de compra. Conserva este comprobante.
    </div>
    <div class="footer-note" style="text-align:right">
      Garantía de fábrica incluida<br>
      Envío gratuito a toda la República
    </div>
  </div>
</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
}

// ─── Order detail modal ───────────────────────────────────────────────────────
function OrderModal({ order, onClose, onSave }) {
    const [pagoStatus, setPago] = useState(order.pagoStatus);
    const ps = PAGO_STATUS[pagoStatus];

    return (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-14 md:pt-16">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden max-h-[88vh] flex flex-col">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 shrink-0">
                    <div>
                        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-blue-600">{order.folio}</p>
                        <h3 className="font-display text-base font-bold text-slate-900">{order.shipping?.nombre}</h3>
                    </div>
                    <button onClick={onClose} className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <X className="size-4 text-slate-500" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-4">

                    {/* Client + Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                            <p className="font-display text-[8px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-2"><Users className="size-3"/>Cliente</p>
                            <p className="font-display text-sm font-bold text-slate-900">{order.shipping?.nombre}</p>
                            <p className="text-slate-500 text-xs flex items-center gap-1.5"><Mail className="size-3"/>{order.shipping?.email}</p>
                            <p className="text-slate-500 text-xs flex items-center gap-1.5"><Phone className="size-3"/>{order.shipping?.telefono}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                            <p className="font-display text-[8px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-2"><MapPin className="size-3"/>Dirección</p>
                            <p className="text-slate-700 text-xs font-medium leading-relaxed">{order.shipping?.calle}</p>
                            <p className="text-slate-500 text-xs">{order.shipping?.colonia}, CP {order.shipping?.cp}</p>
                            <p className="text-slate-500 text-xs">{order.shipping?.ciudad}, {order.shipping?.estado}</p>
                            {order.shipping?.referencias && <p className="text-slate-400 text-[10px] italic">{order.shipping.referencias}</p>}
                        </div>
                    </div>

                    {/* Products table */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1.5">
                            <Boxes className="size-3.5 text-slate-400"/>
                            <p className="font-display text-[8px] font-bold uppercase tracking-widest text-slate-400">Productos / Servicios</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display text-[10px] font-bold text-slate-900 leading-tight">{item.name}</p>
                                        <p className="text-slate-400 text-[9px]">Cant. {item.quantity} × ${item.price.toLocaleString()}</p>
                                    </div>
                                    <span className="font-display text-xs font-bold text-slate-900 shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center px-4 py-3 bg-white">
                                <span className="font-display text-[10px] font-bold uppercase tracking-wider text-blue-600">Total</span>
                                <span className="font-display text-base font-bold text-slate-900">${order.total.toLocaleString()} <span className="text-[9px] font-semibold text-slate-400">MXN</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <p className="font-display text-[8px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-3"><CreditCard className="size-3"/>Pago</p>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="font-display text-xs font-bold text-slate-900">{METODO_LABEL[order.payment?.metodo] || '—'}</p>
                                {order.payment?.ultimosCuatro && <p className="text-slate-400 text-[10px] mt-0.5">**** **** **** {order.payment.ultimosCuatro}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <select value={pagoStatus} onChange={e => setPago(e.target.value)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-display text-[10px] font-bold text-slate-700 focus:outline-none focus:border-blue-400 transition-all cursor-pointer">
                                    {Object.entries(PAGO_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                                <span className={`font-display text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ps.color}`}>{ps.label}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-slate-50 flex gap-3 shrink-0">
                    <button onClick={() => generateOrderPDF(order)}
                        className="font-display flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all">
                        <FileText className="size-3.5" /> PDF
                    </button>
                    <button onClick={onClose} className="font-display px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 font-bold text-xs uppercase tracking-wider transition-all">
                        Cerrar
                    </button>
                    <button onClick={() => onSave({ ...order, pagoStatus })}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98]">
                        <Check className="size-3.5" /> Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Órdenes ──────────────────────────────────────────────────────────────────
function TabOrdenes({ orders, setOrders }) {
    const [search, setSearch]     = useState('');
    const [filterPago, setFilter] = useState('todos');
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => orders.filter(o => {
        const q = search.toLowerCase();
        const matchS = !q || (o.shipping?.nombre||'').toLowerCase().includes(q) || o.folio.toLowerCase().includes(q) || (o.shipping?.email||'').toLowerCase().includes(q);
        const matchF = filterPago === 'todos' || o.pagoStatus === filterPago;
        return matchS && matchF;
    }), [orders, search, filterPago]);

    const handleSave = async (updated) => {
        await api.updateOrderPayment(updated.id, updated.pagoStatus).catch(console.error);
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        setSelected(null);
    };

    const pillCounts = {
        todos:      orders.length,
        pendiente:  orders.filter(o=>o.pagoStatus==='pendiente').length,
        confirmado: orders.filter(o=>o.pagoStatus==='confirmado').length,
        rechazado:  orders.filter(o=>o.pagoStatus==='rechazado').length,
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Órdenes de compra</h3>
                <p className="text-slate-400 text-xs font-medium mt-0.5">{orders.length} órdenes recibidas · {orders.filter(o=>o.pagoStatus==='confirmado').length} pagos confirmados</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente, folio o email…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-display text-xs placeholder:text-slate-300 text-slate-700 focus:outline-none focus:border-blue-400 transition-all" />
                </div>
            </div>

            {/* Pago filter pills */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key:'todos',      label:'Todas'       },
                    { key:'pendiente',  label:'Pendiente'   },
                    { key:'confirmado', label:'Confirmado'  },
                    { key:'rechazado',  label:'Rechazado'   },
                ].map(pill => (
                    <button key={pill.key} onClick={() => setFilter(pill.key)}
                        className={`font-display text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${filterPago===pill.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                        {pill.label} <span className={filterPago===pill.key?'text-blue-200':'text-slate-400'}>({pillCounts[pill.key]})</span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Boxes className="size-8 text-slate-200 mx-auto mb-3" />
                        <p className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {orders.length === 0 ? 'Sin órdenes aún — aparecerán cuando los clientes realicen compras' : 'Sin resultados'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filtered.map(order => {
                            const ps = PAGO_STATUS[order.pagoStatus];
                            return (
                                <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                                    {/* Avatar */}
                                    <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-display font-black text-sm text-white shrink-0">
                                        {(order.shipping?.nombre||'?').charAt(0).toUpperCase()}
                                    </div>

                                    {/* Main info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-display text-xs font-bold text-slate-900">{order.shipping?.nombre}</span>
                                            <span className={`font-display text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ps.color}`}>{ps.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[9px] font-medium text-slate-400">
                                            <span className="text-blue-500 font-bold">{order.folio}</span>
                                            <span>·</span>
                                            <span>{order.fecha}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-0.5"><CreditCard className="size-2.5"/>{METODO_LABEL[order.payment?.metodo]||'—'}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-0.5"><MapPin className="size-2.5"/>{order.shipping?.ciudad}</span>
                                        </div>
                                        <p className="text-slate-400 text-[9px] font-medium mt-0.5 line-clamp-1">
                                            {(order.items||[]).map(i=>`${i.name} ×${i.quantity}`).join(' · ')}
                                        </p>
                                    </div>

                                    {/* Total + actions */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="font-display text-sm font-bold text-slate-900">${order.total.toLocaleString()}</p>
                                            <p className="font-display text-[8px] font-semibold text-slate-400 uppercase">MXN</p>
                                        </div>
                                        <button onClick={() => generateOrderPDF(order)}
                                            title="Generar PDF"
                                            className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-all">
                                            <FileText className="size-3.5" />
                                        </button>
                                        <button onClick={() => setSelected(order)}
                                            title="Ver detalle"
                                            className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all">
                                            <Eye className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
        </div>
    );
}

// ─── Product modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
    const isNew = !product;
    const [form, setForm] = useState(product || {
        name:'', category:'Seguridad', price:'', description:'', image:'', stock:'10',
        features:[''], activo:true,
    });

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const setFeature = (i, v) => setForm(p => ({ ...p, features: p.features.map((f,fi) => fi===i ? v : f) }));
    const addFeature = () => setForm(p => ({ ...p, features: [...p.features, ''] }));
    const removeFeature = (i) => setForm(p => ({ ...p, features: p.features.filter((_,fi) => fi!==i) }));

    const isValid = form.name && form.price && form.category;

    return (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-14">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden max-h-[88vh] flex flex-col">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 shrink-0">
                    <h3 className="font-display text-base font-bold text-slate-900">{isNew ? 'Nuevo producto / servicio' : 'Editar producto'}</h3>
                    <button onClick={onClose} className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <X className="size-4 text-slate-500" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-4">
                    <div>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Nombre del producto / servicio *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej. Kit Cámaras Hikvision 4K NVR"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Categoría *</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 transition-all">
                                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Precio (MXN) *</label>
                            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="1250"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Stock</label>
                            <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="10"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Visible en tienda</label>
                            <button onClick={() => set('activo', !form.activo)} className="flex items-center gap-2">
                                {form.activo
                                    ? <ToggleRight className="size-7 text-blue-600" />
                                    : <ToggleLeft className="size-7 text-slate-300" />}
                                <span className={`font-display text-[10px] font-bold uppercase tracking-wider ${form.activo ? 'text-blue-600' : 'text-slate-400'}`}>{form.activo ? 'Activo' : 'Inactivo'}</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">URL de imagen</label>
                        <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="/IMG PARA PAGINA SHOP/producto.png"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                    </div>

                    <div>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Descripción</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 resize-none focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400">Especificaciones / características</label>
                            <button onClick={addFeature} className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <Plus className="size-3" /> Agregar
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.features?.map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input value={f} onChange={e => setFeature(i, e.target.value)} placeholder={`Característica ${i+1}`}
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                                    <button onClick={() => removeFeature(i)} className="size-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-slate-50 flex gap-3 shrink-0">
                    <button onClick={onClose} className="font-display px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 font-bold text-xs uppercase tracking-wider transition-all">Cancelar</button>
                    <button onClick={() => { if (isValid) onSave({ ...form, price: Number(form.price), stock: Number(form.stock) }); }}
                        disabled={!isValid}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98]">
                        <Check className="size-3.5" /> {isNew ? 'Crear producto' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Productos ────────────────────────────────────────────────────────────────
function TabProductos() {
    const { products, addProduct, updateProduct, deleteProduct, toggleActive } = useProducts();
    const [search, setSearch]     = useState('');
    const [editProduct, setEdit]  = useState(null);
    const [newProduct, setNew]    = useState(false);
    const [confirmDel, setConfirm]= useState(null);

    const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

    const CATEGORY_COLOR = {
        'Seguridad':          'text-blue-700 bg-blue-50 border-blue-200',
        'Hogar Inteligente':  'text-emerald-700 bg-emerald-50 border-emerald-200',
        'Seguridad Avanzada': 'text-violet-700 bg-violet-50 border-violet-200',
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Productos y servicios</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">{products.length} items en catálogo · {products.filter(p=>p.activo!==false).length} activos</p>
                </div>
                <button onClick={() => setNew(true)} className="font-display flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] self-start sm:self-auto">
                    <Plus className="size-3.5" /> Nuevo producto
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o categoría…"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-display text-xs placeholder:text-slate-300 text-slate-700 focus:outline-none focus:border-blue-400 transition-all" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {filtered.map(p => {
                    const cc = CATEGORY_COLOR[p.category] || 'text-slate-600 bg-slate-100 border-slate-200';
                    const inactive = p.activo === false;
                    return (
                        <div key={p.id} className={`bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md ${inactive ? 'border-slate-100 opacity-60' : 'border-slate-100 hover:border-slate-200'}`}>
                            {/* Image */}
                            <div className="relative aspect-square bg-gradient-to-b from-slate-50 to-white p-4 flex items-center justify-center">
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                                ) : (
                                    <Image className="size-7 text-slate-200" />
                                )}
                                <span className={`absolute top-2 left-2 font-display text-[7px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${cc}`}>{p.category}</span>
                                {inactive && <span className="absolute top-2 right-2 font-display text-[7px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-500">Off</span>}
                            </div>

                            <div className="p-3">
                                <h4 className="font-display text-[10px] font-bold text-slate-900 leading-tight line-clamp-2 mb-1.5">{p.name}</h4>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-display text-sm font-bold text-slate-900">${Number(p.price).toLocaleString()}</span>
                                    <span className="font-display text-[8px] font-semibold text-slate-400 uppercase">×{p.stock ?? '—'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => toggleActive(p.id)}
                                        className={`flex-1 font-display text-[8px] font-bold uppercase tracking-wide py-1.5 rounded-lg border transition-all ${inactive ? 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100'}`}>
                                        {inactive ? 'Activar' : 'Desact.'}
                                    </button>
                                    <button onClick={() => setEdit(p)} className="size-7 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 flex items-center justify-center transition-all">
                                        <Edit2 className="size-3" />
                                    </button>
                                    <button onClick={() => setConfirm(p.id)} className="size-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all">
                                        <Trash2 className="size-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {newProduct  && <ProductModal product={null}    onClose={() => setNew(false)}  onSave={p => { addProduct(p);    setNew(false);  }} />}
            {editProduct && <ProductModal product={editProduct} onClose={() => setEdit(null)} onSave={p => { updateProduct(p); setEdit(null); }} />}

            {/* Confirm delete */}
            {confirmDel && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirm(null)} />
                    <div className="relative bg-white rounded-3xl p-7 shadow-2xl max-w-sm w-full text-center">
                        <div className="size-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="size-6 text-red-500" />
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 mb-2">¿Eliminar producto?</h4>
                        <p className="text-slate-400 text-xs font-medium mb-5">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirm(null)} className="flex-1 font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
                            <button onClick={() => { deleteProduct(confirmDel); setConfirm(null); }} className="flex-1 font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-md">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Pagos ────────────────────────────────────────────────────────────────────
function TabPagos({ orders, setOrders }) {
    const [filter, setFilter] = useState('todos');

    const filtered = filter === 'todos' ? orders : orders.filter(o => o.pagoStatus === filter);

    const updatePago = async (id, pagoStatus) => {
        await api.updateOrderPayment(id, pagoStatus).catch(console.error);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, pagoStatus } : o));
    };

    const totals = {
        confirmado: orders.filter(o=>o.pagoStatus==='confirmado').reduce((s,o)=>s+o.total,0),
        pendiente:  orders.filter(o=>o.pagoStatus==='pendiente').reduce((s,o)=>s+o.total,0),
        rechazado:  orders.filter(o=>o.pagoStatus==='rechazado').reduce((s,o)=>s+o.total,0),
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">Pagos y ventas</h3>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Gestiona el estado de los pagos de cada orden</p>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label:'Cobrado',    value: totals.confirmado, color:'emerald', icon: BadgeCheck   },
                    { label:'Pendiente',  value: totals.pendiente,  color:'amber',   icon: Clock        },
                    { label:'Rechazado',  value: totals.rechazado,  color:'blue',    icon: XCircle      },
                ].map((s,i) => <StatCard key={i} icon={s.icon} label={s.label} value={`$${s.value.toLocaleString()}`} color={s.color} />)}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['todos','pendiente','confirmado','rechazado'].map(k => (
                    <button key={k} onClick={() => setFilter(k)}
                        className={`font-display text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${filter===k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                        {k==='todos'?'Todos':PAGO_STATUS[k]?.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-14 text-center">
                        <CreditCard className="size-8 text-slate-200 mx-auto mb-3" />
                        <p className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">Sin pagos que mostrar</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filtered.map(order => {
                            const ps = PAGO_STATUS[order.pagoStatus];
                            return (
                                <div key={order.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-display text-xs font-bold text-slate-900">{order.shipping?.nombre}</span>
                                                <span className="font-display text-[9px] text-blue-600 font-bold uppercase tracking-wider">{order.folio}</span>
                                                <span className="text-slate-400 text-[9px] font-medium">{order.fecha}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap text-[10px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1"><CreditCard className="size-3" />{METODO_LABEL[order.payment?.metodo] || '—'}</span>
                                                {order.payment?.ultimosCuatro && <span>•••• {order.payment.ultimosCuatro}</span>}
                                                <span className="flex items-center gap-1 font-display font-bold text-sm text-slate-900">${order.total.toLocaleString()} <span className="text-[9px] font-semibold text-slate-400">MXN</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`font-display text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ps.color}`}>{ps.label}</span>
                                            {order.pagoStatus === 'pendiente' && (
                                                <div className="flex gap-1">
                                                    <button onClick={() => updatePago(order.id, 'confirmado')} className="font-display text-[8px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors">
                                                        Confirmar
                                                    </button>
                                                    <button onClick={() => updatePago(order.id, 'rechazado')} className="font-display text-[8px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors">
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Admin() {
    const navigate = useNavigate();
    const [tab, setTab]             = useState('dashboard');
    const [sidebarOpen, setSidebar] = useState(false);
    const [orders, setOrders]       = useState([]);

    const fetchOrders = () => api.getOrders().then(setOrders).catch(console.error);

    // Reload orders when tab changes
    useEffect(() => { fetchOrders(); }, [tab]);

    const isAdmin = localStorage.getItem('olea-admin') === '1';
    if (!isAdmin) { navigate('/admin/login'); return null; }

    const handleLogout = () => { localStorage.removeItem('olea-admin'); navigate('/admin/login'); };

    const pendingNew  = orders.filter(o => o.status === 'nueva').length;
    const pendingPago = orders.filter(o => o.pagoStatus === 'pendiente' && o.status !== 'cancelado').length;

    const tabs = [
        { id:'dashboard',  icon:LayoutDashboard, label:'Dashboard'  },
        { id:'ordenes',    icon:ClipboardList,   label:'Órdenes',    badge: pendingNew  },
        { id:'productos',  icon:Package,         label:'Productos'   },
        { id:'pagos',      icon:CreditCard,      label:'Pagos',      badge: pendingPago },
    ];

    const Sidebar = () => (
        <div className="flex flex-col h-full">
            <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Shield className="size-5 text-white" />
                    </div>
                    <div>
                        <p className="font-display text-xs font-bold text-white tracking-tight">Olea Controls</p>
                        <p className="font-display text-[8px] font-semibold uppercase tracking-widest text-slate-500">Admin Panel</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="font-display text-[8px] font-bold uppercase tracking-[0.25em] text-slate-600 px-3 mb-2">Menú</p>
                {tabs.map(t => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                        <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                            <Icon className="size-4 shrink-0" />
                            <span className="font-display text-[10px] font-bold uppercase tracking-wider flex-1 text-left">{t.label}</span>
                            {t.badge > 0 && (
                                <span className={`font-display text-[8px] font-black min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 ${active ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>{t.badge}</span>
                            )}
                        </button>
                    );
                })}
            </nav>
            <div className="px-3 pb-5 border-t border-white/[0.06] pt-3 space-y-0.5">
                <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                    <Home className="size-4 shrink-0" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider">Ver tienda</span>
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut className="size-4 shrink-0" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider">Cerrar sesión</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-52 bg-slate-950 shrink-0 sticky top-0 h-screen"><Sidebar /></aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebar(false)} />
                    <aside className="absolute left-0 top-0 h-full w-52 bg-slate-950 shadow-2xl"><Sidebar /></aside>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 px-5 md:px-8 h-14 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebar(true)} className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 lg:hidden transition-colors">
                            <Menu className="size-4" />
                        </button>
                        <h1 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                            {tabs.find(t => t.id === tab)?.label}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                                <Bell className="size-4" />
                            </button>
                            {(pendingNew + pendingPago) > 0 && (
                                <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white font-display font-black text-[8px] rounded-full flex items-center justify-center">{pendingNew + pendingPago}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-slate-100 rounded-xl">
                            <div className="size-6 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Shield className="size-3.5 text-white" />
                            </div>
                            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-700 hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-5 md:p-8 overflow-auto">
                    {tab === 'dashboard' && <TabDashboard  orders={orders} setTab={setTab} />}
                    {tab === 'ordenes'   && <TabOrdenes    orders={orders} setOrders={setOrders} />}
                    {tab === 'productos' && <TabProductos />}
                    {tab === 'pagos'     && <TabPagos      orders={orders} setOrders={setOrders} />}
                </main>
            </div>
        </div>
    );
}
