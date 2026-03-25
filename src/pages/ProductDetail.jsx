import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import {
    ArrowLeft, ShoppingCart, Check, Shield, Truck, Award,
    Star, Share2, ChevronRight, Zap, Boxes, Plus, Minus,
    Package, HeadphonesIcon, BadgeCheck, ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const categoryColors = {
    'Seguridad': 'bg-blue-600/10 text-blue-700 border-blue-200',
    'Hogar Inteligente': 'bg-emerald-600/10 text-emerald-700 border-emerald-200',
    'Seguridad Avanzada': 'bg-violet-600/10 text-violet-700 border-violet-200',
};

export default function ProductDetail() {
    const { id } = useParams();
    const { products } = useProducts();
    const product = products.find(p => p.id === id);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('especificaciones');

    useEffect(() => { window.scrollTo(0, 0); setQty(1); setAdded(false); }, [id]);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#F6F6F4]">
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
                    <Boxes className="size-16 text-slate-200 mx-auto mb-6" />
                    <h1 className="font-display text-2xl font-bold mb-3 text-slate-900">Equipo no disponible</h1>
                    <p className="text-slate-400 mb-8 text-sm font-medium">No encontramos el producto en nuestro catálogo.</p>
                    <Link to="/shop" className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-display font-bold uppercase text-[10px] tracking-widest transition-all w-full">
                        <ArrowLeft className="size-4" /> Ver Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
    const others  = products.filter(p => p.id !== product.id).slice(0, 3);
    const suggestions = related.length > 0 ? related : others;

    const badgeClass = categoryColors[product.category] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── Breadcrumb bar ─────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
                    <Link to="/shop" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Tienda</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <Link to="/shop" className="hover:text-blue-600 transition-colors">Tienda</Link>
                        <ChevronRight className="size-3" />
                        <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
                        <ChevronRight className="size-3" />
                        <span className="text-slate-700 truncate max-w-[180px]">{product.name}</span>
                    </div>

                    <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Share2 className="size-4" />
                    </button>
                </div>
            </div>

            {/* ── Main content ───────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16">

                    {/* ── LEFT: Image ────────────────────────────────── */}
                    <div className="lg:sticky lg:top-20 space-y-4 self-start">

                        {/* Main image */}
                        <div className="relative bg-white rounded-2xl md:rounded-3xl border border-slate-100 overflow-hidden shadow-md group aspect-square flex items-center justify-center p-10 md:p-16">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pointer-events-none" />

                            <img
                                src={product.image}
                                alt={product.name}
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
                            />

                            {/* Premium badge */}
                            <div className="absolute top-4 left-4 z-20">
                                <span className="font-display text-[8px] font-bold uppercase tracking-[0.2em] bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-lg">
                                    Premium Tech
                                </span>
                            </div>

                            {/* Stock pill */}
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white border border-emerald-100 shadow-sm px-3 py-1.5 rounded-full">
                                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-display text-[8px] font-bold text-emerald-700 uppercase tracking-wider">En stock</span>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Zap,    label: 'Instalación', value: 'Express' },
                                { icon: Shield, label: 'Garantía',    value: '3 Años'  },
                                { icon: Award,  label: 'Certif.',     value: 'NOM-ICE' },
                            ].map((b, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 md:p-4 flex flex-col items-center text-center gap-1.5 hover:border-blue-200 hover:shadow-sm transition-all">
                                    <b.icon className="size-4 text-blue-600" />
                                    <span className="text-[7px] md:text-[8px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">{b.label}</span>
                                    <span className="font-display text-[9px] md:text-[10px] font-bold text-slate-900 uppercase">{b.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Info ────────────────────────────────── */}
                    <div className="flex flex-col gap-6">

                        {/* Header */}
                        <div>
                            {/* Rating row */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(i => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                                </div>
                                <span className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-widest">4.9 · 38 reseñas</span>
                            </div>

                            {/* Name */}
                            <h1 className="font-display text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                                {product.name}
                            </h1>

                            {/* Category + ID */}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <span className={`font-display text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${badgeClass}`}>
                                    {product.category}
                                </span>
                                <span className="font-display text-[9px] text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg">
                                    SKU: {product.id}
                                </span>
                            </div>

                            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* ── Price & CTA card ─────────────────────── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Top accent */}
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <div className="p-5 md:p-7">
                                {/* Price */}
                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <span className="font-display text-[9px] font-semibold text-slate-400 uppercase tracking-[0.25em] block mb-1">Precio unitario</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                                ${product.price.toLocaleString()}
                                            </span>
                                            <span className="font-display text-xs font-bold text-slate-400 uppercase">MXN</span>
                                        </div>
                                    </div>
                                    {qty > 1 && (
                                        <div className="text-right">
                                            <span className="font-display text-[9px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Total</span>
                                            <span className="font-display text-xl font-bold text-blue-600">
                                                ${(product.price * qty).toLocaleString()} MXN
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Quantity selector */}
                                <div className="flex items-center gap-4 mb-5">
                                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500">Cantidad</span>
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            className="px-3.5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                        >
                                            <Minus className="size-3.5" />
                                        </button>
                                        <span className="font-display font-bold text-slate-900 text-sm w-10 text-center">{qty}</span>
                                        <button
                                            onClick={() => setQty(q => q + 1)}
                                            className="px-3.5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                        >
                                            <Plus className="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] group/btn ${
                                        added
                                            ? 'bg-emerald-500 text-white shadow-emerald-200/50'
                                            : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/15'
                                    }`}
                                >
                                    {added ? (
                                        <><Check className="size-5" /> ¡Añadido al carrito!</>
                                    ) : (
                                        <><ShoppingCart className="size-4.5" /> Agregar al carrito</>
                                    )}
                                </button>

                                {/* Shipping info */}
                                <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-50">
                                    {[
                                        { icon: Truck,           text: 'Envío Gratis' },
                                        { icon: Shield,          text: 'Pago Seguro' },
                                        { icon: HeadphonesIcon,  text: 'Soporte 24/7' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                                            <item.icon className="size-4 text-slate-300" />
                                            <span className="font-display text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Delivery info strip ───────────────────── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                            <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                <Package className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">Entrega en 24–48 horas</p>
                                <p className="text-slate-400 text-[11px] font-medium mt-0.5">Disponible para toda la República Mexicana</p>
                            </div>
                            <div className="ml-auto shrink-0">
                                <span className="font-display text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Gratis</span>
                            </div>
                        </div>

                        {/* ── Tabs ──────────────────────────────────── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Tab headers */}
                            <div className="flex border-b border-slate-100">
                                {[
                                    { id: 'especificaciones', label: 'Especificaciones' },
                                    { id: 'soporte',          label: 'Garantía'         },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3.5 font-display text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                                            activeTab === tab.id ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content */}
                            <div className="p-5">
                                {activeTab === 'especificaciones' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                                <BadgeCheck className="size-4 text-blue-500 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <span className="font-display text-[10px] md:text-[11px] font-semibold text-slate-700 tracking-tight leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {[
                                            { icon: Shield,  title: 'Garantía de Fábrica 3 Años', desc: 'Cobertura total contra defectos de fabricación con respaldo técnico de ingeniería de primer nivel.' },
                                            { icon: Zap,     title: 'Soporte Post-Venta',          desc: 'Atención técnica remota y presencial durante toda la vida útil del equipo.' },
                                            { icon: Award,   title: 'Certificación NOM-ICE',        desc: 'Todos nuestros equipos cumplen con la normativa oficial mexicana vigente.' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="size-9 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <item.icon className="size-4.5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-display text-xs font-bold text-slate-900 mb-1">{item.title}</p>
                                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="font-display text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest underline underline-offset-4 decoration-blue-200 transition-colors">
                                            Descargar ficha técnica (PDF)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Related products ───────────────────────────────── */}
                {suggestions.length > 0 && (
                    <div className="mt-16 md:mt-24">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className="font-display text-[10px] font-semibold text-blue-600 uppercase tracking-[0.3em] mb-2 block">También te puede interesar</span>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Productos relacionados.</h2>
                            </div>
                            <Link to="/shop" className="hidden sm:flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">
                                Ver todos <ChevronRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
                            {suggestions.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
