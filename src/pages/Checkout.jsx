import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    ChevronLeft, ChevronRight, MapPin, CreditCard, CheckCircle2,
    Truck, Shield, Lock, Zap, Package, ArrowRight, Check,
    Smartphone, Building2, ClipboardList, Star
} from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontFamily: 'inherit',
            fontSize: '13px',
            color: '#1e293b',
            letterSpacing: '0.025em',
            '::placeholder': { color: '#cbd5e1' },
        },
        invalid: { color: '#ef4444' },
    },
};

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepBar({ current }) {
    const steps = [
        { id: 1, label: 'Envío'     },
        { id: 2, label: 'Pago'      },
        { id: 3, label: 'Confirmar' },
    ];
    return (
        <div className="flex items-center justify-center gap-0">
            {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`size-8 md:size-9 rounded-full flex items-center justify-center font-display font-black text-xs transition-all duration-300 ${
                            current > step.id
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                : current === step.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-slate-100 text-slate-400'
                        }`}>
                            {current > step.id ? <Check className="size-4" /> : step.id}
                        </div>
                        <span className={`font-display text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                            current === step.id ? 'text-blue-600' : current > step.id ? 'text-emerald-600' : 'text-slate-300'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`w-16 md:w-24 h-[2px] mx-2 mb-4 transition-all duration-500 ${
                            current > step.id ? 'bg-emerald-400' : 'bg-slate-100'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Mini order summary (sidebar) ────────────────────────────────────────────
function OrderSummary({ cart, cartTotal }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="p-5">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
                    Tu pedido
                </h3>
                <div className="space-y-3 mb-5">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="size-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-display text-[10px] font-bold text-slate-900 leading-tight line-clamp-1">{item.name}</p>
                                <p className="font-display text-[9px] text-slate-400 mt-0.5">Cant. {item.quantity}</p>
                            </div>
                            <span className="font-display text-xs font-bold text-slate-900 shrink-0">
                                ${(item.price * item.quantity).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-50 pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[9px] font-semibold uppercase tracking-widest text-slate-400">Subtotal</span>
                        <span className="font-display text-xs font-bold text-slate-900">${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[9px] font-semibold uppercase tracking-widest text-slate-400">Envío</span>
                        <span className="font-display text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">Gratis</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="font-display text-[10px] font-bold uppercase tracking-widest text-blue-600">Total</span>
                        <span className="font-display text-lg font-bold text-slate-900">${cartTotal.toLocaleString()} <span className="text-[9px] text-slate-400 font-semibold">MXN</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────
function StepShipping({ data, onChange, onNext }) {
    const fields = [
        { id: 'nombre',    label: 'Nombre completo',       type: 'text',  placeholder: 'Ej. Carlos Rodríguez',       col: 'col-span-2' },
        { id: 'email',     label: 'Correo electrónico',    type: 'email', placeholder: 'tu@email.com',               col: 'col-span-2' },
        { id: 'telefono',  label: 'Teléfono',              type: 'tel',   placeholder: '+52 55 1234 5678',           col: 'col-span-1' },
        { id: 'cp',        label: 'Código Postal',         type: 'text',  placeholder: '06600',                      col: 'col-span-1' },
        { id: 'calle',     label: 'Calle y número',        type: 'text',  placeholder: 'Av. Insurgentes Sur 1234',   col: 'col-span-2' },
        { id: 'colonia',   label: 'Colonia',               type: 'text',  placeholder: 'Del Valle',                  col: 'col-span-1' },
        { id: 'ciudad',    label: 'Ciudad',                type: 'text',  placeholder: 'Ciudad de México',           col: 'col-span-1' },
        { id: 'estado',    label: 'Estado',                type: 'text',  placeholder: 'CDMX',                       col: 'col-span-1' },
        { id: 'referencias', label: 'Referencias (opcional)', type: 'text', placeholder: 'Entre calles, color de fachada…', col: 'col-span-2' },
    ];

    const required = ['nombre','email','telefono','cp','calle','colonia','ciudad','estado'];
    const isValid = required.every(f => data[f]?.trim());

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <MapPin className="size-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">Datos de entrega</h2>
                    <p className="text-slate-400 text-xs font-medium">¿Dónde enviamos tu pedido?</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                {fields.map(f => (
                    <div key={f.id} className={f.col}>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
                            {f.label}
                        </label>
                        <input
                            type={f.type}
                            value={data[f.id] || ''}
                            onChange={e => onChange(f.id, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all"
                        />
                    </div>
                ))}
            </div>

            {/* Delivery notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
                <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Truck className="size-4 text-white" />
                </div>
                <div>
                    <p className="font-display text-xs font-bold text-blue-900 uppercase tracking-wider">Entrega estimada: 24–48 horas</p>
                    <p className="text-blue-600 text-[10px] font-medium mt-0.5">Envío express sin costo a toda la República Mexicana</p>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 py-4 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group"
            >
                Continuar con el pago
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────
function StepPayment({ data, onChange, onNext, onBack }) {
    const methods = [
        { id: 'tarjeta',     icon: CreditCard,  label: 'Tarjeta',          sub: 'Crédito o débito'          },
        { id: 'transferencia', icon: Building2,  label: 'Transferencia',    sub: 'SPEI / Banco'              },
        { id: 'contraentrega', icon: Package,    label: 'Contra entrega',   sub: 'Paga al recibir'           },
    ];

    const isValid = !!data.metodo;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="size-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">Método de pago</h2>
                    <p className="text-slate-400 text-xs font-medium">Selecciona cómo quieres pagar</p>
                </div>
            </div>

            {/* Method selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {methods.map(m => (
                    <button
                        key={m.id}
                        onClick={() => onChange('metodo', m.id)}
                        className={`flex flex-col items-center gap-2 p-3.5 md:p-4 rounded-2xl border-2 transition-all ${
                            data.metodo === m.id
                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                                : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                        <m.icon className={`size-5 ${data.metodo === m.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className={`font-display text-[9px] font-bold uppercase tracking-wider leading-tight text-center ${data.metodo === m.id ? 'text-blue-700' : 'text-slate-500'}`}>
                            {m.label}
                        </span>
                        <span className={`text-[8px] font-medium leading-tight text-center ${data.metodo === m.id ? 'text-blue-400' : 'text-slate-300'}`}>
                            {m.sub}
                        </span>
                    </button>
                ))}
            </div>

            {/* Aviso Stripe para tarjeta */}
            {data.metodo === 'tarjeta' && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <Lock className="size-4 text-blue-500 shrink-0" />
                    <p className="text-blue-700 text-[10px] font-semibold leading-relaxed">
                        Ingresarás los datos de tu tarjeta de forma segura en el siguiente paso, procesado por <span className="font-bold">Stripe</span>.
                    </p>
                </div>
            )}

            {/* Transferencia info */}
            {data.metodo === 'transferencia' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-6 space-y-3">
                    <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Datos bancarios</p>
                    {[
                        { label: 'Banco',   value: 'BBVA México'           },
                        { label: 'CLABE',   value: '012 345 678 901 234 56' },
                        { label: 'Titular', value: 'Olea Controls S.A.'    },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                            <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400">{row.label}</span>
                            <span className="font-display text-[10px] font-bold text-slate-900 tracking-wider">{row.value}</span>
                        </div>
                    ))}
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed pt-1">
                        Envía tu comprobante a <span className="text-blue-600 font-bold">ventas@oleacontrols.mx</span> para confirmar tu pedido en menos de 2 horas.
                    </p>
                </div>
            )}

            {/* Contra entrega info */}
            {data.metodo === 'contraentrega' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-6 flex items-start gap-4">
                    <div className="size-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <Package className="size-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Paga cuando llegue tu equipo</p>
                        <p className="text-slate-500 text-[10px] font-medium leading-relaxed">
                            El pago se realiza al momento de recibir el producto. Aceptamos efectivo y tarjeta. Sin cargos adicionales.
                        </p>
                    </div>
                </div>
            )}

            {!data.metodo && <div className="mb-6" />}

            <div className="flex gap-3">
                <button onClick={onBack} className="font-display flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all shrink-0">
                    <ChevronLeft className="size-4" />
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 py-4 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group"
                >
                    Revisar pedido
                    <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

// ─── Step 3: Confirm ──────────────────────────────────────────────────────────
function StepConfirm({ shipping, payment, cart, cartTotal, onBack, onConfirm, loading, stripeError }) {
    const methodLabels = { tarjeta: 'Tarjeta de crédito/débito', transferencia: 'Transferencia bancaria (SPEI)', contraentrega: 'Pago contra entrega' };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ClipboardList className="size-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">Confirmar pedido</h2>
                    <p className="text-slate-400 text-xs font-medium">Revisa todo antes de confirmar</p>
                </div>
            </div>

            {/* Shipping summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><MapPin className="size-3" /> Dirección de entrega</p>
                </div>
                <p className="font-display text-sm font-bold text-slate-900">{shipping.nombre}</p>
                <p className="text-slate-500 text-xs font-medium mt-0.5">{shipping.calle}, {shipping.colonia}</p>
                <p className="text-slate-500 text-xs font-medium">{shipping.ciudad}, {shipping.estado}, CP {shipping.cp}</p>
                <p className="text-slate-500 text-xs font-medium">{shipping.telefono} · {shipping.email}</p>
            </div>

            {/* Payment summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-4">
                <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3"><CreditCard className="size-3" /> Método de pago</p>
                <p className="font-display text-sm font-bold text-slate-900">{methodLabels[payment.metodo]}</p>
                {payment.metodo === 'tarjeta' && payment.numeroTarjeta && (
                    <p className="text-slate-400 text-xs font-medium mt-0.5">**** **** **** {payment.numeroTarjeta.replace(/\s/g,'').slice(-4)}</p>
                )}
            </div>

            {/* Stripe Card Element — solo para tarjeta */}
            {payment.metodo === 'tarjeta' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-4">
                    <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
                        <Lock className="size-3" /> Datos de tarjeta
                    </p>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    {stripeError && (
                        <p className="text-red-500 text-[10px] font-semibold mt-2 flex items-center gap-1">
                            <span>⚠</span> {stripeError}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mt-2.5">
                        <Lock className="size-3 text-slate-300" />
                        <span className="font-display text-[8px] font-semibold uppercase tracking-widest text-slate-300">Pago cifrado · Powered by Stripe</span>
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-6">
                <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3"><Package className="size-3" /> Productos</p>
                <div className="space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="size-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-display text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                    <p className="text-slate-400 text-[9px] font-medium">Cant. {item.quantity} × ${item.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="font-display text-xs font-bold text-slate-900 shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-blue-600">Total</span>
                    <span className="font-display text-xl font-bold text-slate-900">${cartTotal.toLocaleString()} <span className="text-[9px] text-slate-400">MXN</span></span>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="font-display flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all shrink-0">
                    <ChevronLeft className="size-4" />
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] group"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Procesando…
                        </>
                    ) : (
                        <>
                            <Lock className="size-3.5" />
                            Confirmar y pagar
                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Step 4: Success ──────────────────────────────────────────────────────────
function StepSuccess({ orderNumber, shipping }) {
    return (
        <div className="text-center">

            {/* Animated check */}
            <div className="flex items-center justify-center mb-8">
                <div className="relative">
                    <div className="size-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-300/40">
                        <CheckCircle2 className="size-12 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                </div>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                ¡Pedido confirmado!
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2 max-w-md mx-auto">
                Gracias por tu compra, <span className="font-bold text-slate-700">{shipping.nombre?.split(' ')[0]}</span>. Tu equipo está siendo preparado para envío.
            </p>
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
                Número de orden: <span className="text-blue-600">#{orderNumber}</span>
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                    { icon: Truck,    title: 'Envío en camino',       sub: 'Llega en 24–48 horas hábiles'     },
                    { icon: Smartphone, title: 'Confirmación enviada', sub: `Revisa ${shipping.email}`         },
                    { icon: Shield,  title: 'Garantía activa',        sub: '3 años de respaldo de fábrica'    },
                ].map((card, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col items-center gap-2 text-center">
                        <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <card.icon className="size-5 text-blue-600" />
                        </div>
                        <p className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-900">{card.title}</p>
                        <p className="text-slate-400 text-[9px] font-medium leading-tight">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Rating prompt */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 mb-8 text-left">
                <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(i => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
                </div>
                <div>
                    <p className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-900">¿Te gustó la experiencia?</p>
                    <p className="text-slate-400 text-[9px] font-medium">Recuerda dejarnos tu reseña una vez que recibas tu equipo.</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    to="/"
                    className="font-display flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                    Ir al inicio
                </Link>
                <Link
                    to="/shop"
                    className="font-display flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg group"
                >
                    Seguir comprando
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

// ─── Main Checkout component ──────────────────────────────────────────────────
function CheckoutInner() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const stripe   = useStripe();
    const elements = useElements();

    const [step, setStep]             = useState(1);
    const [loading, setLoading]       = useState(false);
    const [stripeError, setStripeError] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [shipping, setShipping]     = useState({});
    const [payment, setPayment]       = useState({});

    const updateShipping = (k, v) => setShipping(p => ({ ...p, [k]: v }));
    const updatePayment  = (k, v) => setPayment(p => ({ ...p, [k]: v }));

    const handleConfirm = async () => {
        setLoading(true);
        setStripeError('');

        // ── Pago con tarjeta vía Stripe ──────────────────────────────────────
        if (payment.metodo === 'tarjeta') {
            if (!stripe || !elements) {
                setStripeError('Stripe no está listo. Recarga la página.');
                setLoading(false);
                return;
            }
            try {
                const { clientSecret } = await api.createPaymentIntent(cartTotal);
                const cardElement = elements.getElement(CardElement);
                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: { name: shipping.nombre, email: shipping.email },
                    },
                });
                if (error) {
                    setStripeError(error.message);
                    setLoading(false);
                    return;
                }
                if (paymentIntent.status !== 'succeeded') {
                    setStripeError('El pago no pudo completarse. Intenta de nuevo.');
                    setLoading(false);
                    return;
                }
            } catch (e) {
                setStripeError('Error al procesar el pago. Verifica tu conexión.');
                setLoading(false);
                return;
            }
        }

        // ── Guardar orden ────────────────────────────────────────────────────
        const num = Math.floor(100000 + Math.random() * 900000).toString();
        const newOrder = {
            id: `OC-${num}`,
            folio: `INST-${new Date().getFullYear()}-${num}`,
            fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
            fechaCreacion: new Date().toISOString(),
            shipping,
            payment: { metodo: payment.metodo, ultimosCuatro: null },
            items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, category: i.category })),
            total: cartTotal,
            status: 'nueva',
            pagoStatus: payment.metodo === 'tarjeta' ? 'confirmado' : 'pendiente',
        };
        try {
            await api.createOrder(newOrder);
        } catch (e) {
            console.error('Error al guardar orden:', e);
        }
        setOrderNumber(num);
        clearCart();
        setLoading(false);
        setStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (cart.length === 0 && step !== 4) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── Top bar ── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
                    {step < 4 ? (
                        <Link to="/cart" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Carrito</span>
                        </Link>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-2">
                        <Lock className="size-3.5 text-slate-400" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-400">Pago seguro</span>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-12">

                {step < 4 && (
                    <div className="mb-8 md:mb-10">
                        <StepBar current={step} />
                    </div>
                )}

                <div className={`${step < 4 ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start' : 'max-w-xl mx-auto'}`}>

                    {/* ── Form area ── */}
                    <div className={`${step < 4 ? 'lg:col-span-7' : ''}`}>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
                            <div className="p-6 md:p-8">
                                {step === 1 && <StepShipping data={shipping} onChange={updateShipping} onNext={() => { setStep(2); window.scrollTo({top:0,behavior:'smooth'}); }} />}
                                {step === 2 && <StepPayment  data={payment}  onChange={updatePayment}  onNext={() => { setStep(3); window.scrollTo({top:0,behavior:'smooth'}); }} onBack={() => setStep(1)} />}
                                {step === 3 && <StepConfirm  shipping={shipping} payment={payment} cart={cart} cartTotal={cartTotal} onBack={() => setStep(2)} onConfirm={handleConfirm} loading={loading} stripeError={stripeError} />}
                                {step === 4 && <StepSuccess  orderNumber={orderNumber} shipping={shipping} />}
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    {step < 4 && (
                        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                            <OrderSummary cart={cart} cartTotal={cartTotal} />

                            {/* Security badges */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Compra 100% segura</p>
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Lock,       text: 'Cifrado SSL 256-bit' },
                                        { icon: Shield,     text: 'Datos protegidos'     },
                                        { icon: Zap,        text: 'Procesamiento inmediato' },
                                    ].map((b, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <b.icon className="size-3.5 text-blue-500 shrink-0" />
                                            <span className="font-display text-[9px] font-semibold uppercase tracking-wider text-slate-400">{b.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutInner />
        </Elements>
    );
}
