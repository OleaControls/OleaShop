import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    Trash2, Plus, Minus, ArrowRight, ShoppingBag,
    ShieldCheck, Truck, ChevronLeft, PackageCheck,
    Lock, HeadphonesIcon, Tag, Zap
} from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.07)] overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
                        <div className="p-10 md:p-14">
                            <div className="size-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-7">
                                <ShoppingBag className="size-9 text-slate-200" />
                            </div>
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                                Carrito vacío
                            </h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                Aún no has agregado ningún equipo. Explora nuestro catálogo de soluciones de seguridad y domótica.
                            </p>
                            <Link
                                to="/shop"
                                className="font-display flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] group w-full"
                            >
                                Explorar Catálogo
                                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── Breadcrumb bar ── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
                    <Link to="/shop" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Continuar comprando</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <PackageCheck className="size-4 text-blue-500" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                            {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12">

                {/* ── Page title ── */}
                <div className="mb-8 md:mb-10">
                    <span className="font-display text-blue-600 text-[10px] font-semibold uppercase tracking-[0.3em] mb-2 block">
                        Revisión de Pedido
                    </span>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                        Tu <span className="text-blue-600">Carrito.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Left: Items ── */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-3">

                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex items-center gap-4 p-4 md:p-5">

                                    {/* Image */}
                                    <Link to={`/product/${item.id}`} className="shrink-0">
                                        <div className="size-20 md:size-24 rounded-xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 flex items-center justify-center p-3 hover:scale-105 transition-transform overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-display font-bold text-slate-900 text-sm md:text-base leading-tight hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-2 flex-wrap mb-3">
                                            <span className="font-display text-[8px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-700 px-2 py-0.5 rounded-md">
                                                {item.category}
                                            </span>
                                            <span className="font-display text-[9px] text-slate-400 uppercase tracking-wider">
                                                ${item.price.toLocaleString()} c/u
                                            </span>
                                        </div>

                                        {/* Controls row */}
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Qty */}
                                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2.5 py-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="font-display font-bold text-slate-900 text-sm w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2.5 py-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>

                                            {/* Subtotal + delete */}
                                            <div className="flex items-center gap-3">
                                                <span className="font-display font-bold text-slate-900 text-base md:text-lg tracking-tight">
                                                    ${(item.price * item.quantity).toLocaleString()}
                                                    <span className="text-[9px] font-semibold text-slate-400 ml-1">MXN</span>
                                                </span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear cart */}
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={clearCart}
                                className="font-display text-slate-400 hover:text-red-500 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                            >
                                <Trash2 className="size-3.5" />
                                Vaciar carrito
                            </button>
                        </div>

                        {/* Trust strip */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { icon: Truck,            label: 'Envío Gratis',     sub: 'Todo México' },
                                { icon: ShieldCheck,      label: 'Garantía 3 Años',  sub: 'De fábrica'  },
                                { icon: HeadphonesIcon,   label: 'Soporte 24/7',     sub: 'Técnico'     },
                            ].map((b, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 md:p-4 flex flex-col items-center text-center gap-1.5">
                                    <b.icon className="size-4 text-blue-600" />
                                    <span className="font-display text-[8px] md:text-[9px] font-bold text-slate-900 uppercase tracking-wide leading-tight">{b.label}</span>
                                    <span className="text-[7px] md:text-[8px] font-medium text-slate-400 uppercase tracking-wider">{b.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Summary ── */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden">

                            {/* Gradient top */}
                            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

                            <div className="p-6 md:p-8">
                                <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight mb-6">
                                    Resumen del pedido
                                </h2>

                                {/* Line items */}
                                <div className="space-y-0 mb-6">
                                    <div className="flex justify-between items-center py-3.5 border-b border-slate-50">
                                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                            Subtotal ({cart.length} {cart.length === 1 ? 'equipo' : 'equipos'})
                                        </span>
                                        <span className="font-display text-sm font-bold text-slate-900">
                                            ${cartTotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3.5 border-b border-slate-50">
                                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                            Envío
                                        </span>
                                        <span className="font-display text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                            Gratis
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3.5 border-b border-slate-50">
                                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                            IVA
                                        </span>
                                        <span className="font-display text-[10px] font-semibold text-slate-400">
                                            Incluido
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 mb-6">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="font-display text-[9px] font-bold uppercase tracking-[0.25em] text-blue-600 block mb-1">
                                                Total a pagar
                                            </span>
                                            <span className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                                ${cartTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="font-display text-xs font-bold text-slate-400 uppercase mb-1">MXN</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="font-display w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 group mb-4"
                                >
                                    <Lock className="size-3.5" />
                                    Procesar Orden
                                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Promo code */}
                                <div className="flex gap-2 mb-6">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="Código de descuento"
                                            className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-display text-[10px] font-semibold uppercase tracking-wider text-slate-600 placeholder:text-slate-300 focus:outline-none focus:border-blue-300 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <button className="font-display text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-xl transition-colors shrink-0">
                                        Aplicar
                                    </button>
                                </div>

                                {/* Trust list */}
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Lock,        text: 'Pago 100% seguro y cifrado' },
                                        { icon: Zap,         text: 'Confirmación inmediata por email' },
                                        { icon: ShieldCheck, text: 'Garantía de fábrica incluida' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <item.icon className="size-3.5 text-blue-500 shrink-0" />
                                            <span className="font-display text-[9px] font-semibold uppercase tracking-wider text-slate-400">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
