import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search, ArrowLeft, X, SlidersHorizontal,
    ChevronDown, LayoutGrid, List, Sparkles,
    Shield, Home, Lock
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────────── */
const categoryIcons = { 'Seguridad': Shield, 'Hogar Inteligente': Home, 'Seguridad Avanzada': Lock };

const sortOptions = [
    { value: 'default',    label: 'Destacados' },
    { value: 'price-asc',  label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'name-asc',   label: 'Nombre A–Z' },
];

const categoryColors = {
    'Seguridad': 'bg-blue-600 text-white',
    'Hogar Inteligente': 'bg-emerald-600 text-white',
    'Seguridad Avanzada': 'bg-violet-600 text-white',
};

/* ── List view card ───────────────────────────────────────────────────── */
function ProductListCard({ product }) {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (adding) return;
        addToCart(product);
        setAdding(true);
        setTimeout(() => setAdding(false), 1400);
    };

    return (
        <Link
            to={`/product/${product.id}`}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 flex items-center gap-6 p-5"
        >
            <div className="size-24 rounded-xl bg-gradient-to-b from-slate-50 to-white shrink-0 p-3 border border-slate-100 group-hover:scale-105 transition-transform">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="flex-1 min-w-0">
                <span className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-2 ${categoryColors[product.category] || 'bg-slate-800 text-white'}`}>
                    {product.category}
                </span>
                <h3 className="font-display font-bold text-slate-900 text-base tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1 line-clamp-1">
                    {product.description}
                </p>
            </div>
            <div className="shrink-0 text-right flex flex-col items-end gap-3">
                <div>
                    <p className="font-display text-[8px] text-slate-300 uppercase tracking-widest">Precio</p>
                    <p className="font-display text-xl font-bold text-slate-900">
                        ${product.price.toLocaleString()} <span className="text-[10px] font-medium text-slate-400">MXN</span>
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className={`font-display px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        adding ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                >
                    {adding ? '¡Listo!' : 'Añadir'}
                </button>
            </div>
        </Link>
    );
}

/* ── Main Shop page ───────────────────────────────────────────────────── */
export default function Shop() {
    const { products: allProducts } = useProducts();
    const products = allProducts.filter(p => p.activo !== false);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || 'all';
    const [searchQuery, setSearchQuery]   = useState('');
    const [sortBy, setSortBy]             = useState('default');
    const [gridCols, setGridCols]         = useState('grid');
    const [sortOpen, setSortOpen]         = useState(false);

    const categories = ['all', ...new Set(products.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchCat    = categoryFilter === 'all' || p.category === categoryFilter;
            const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });
        if (sortBy === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'name-asc')   result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [categoryFilter, searchQuery, sortBy]);

    const priceRange = useMemo(() => {
        const prices = products.map(p => p.price);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, []);

    const activeFilters = categoryFilter !== 'all' || searchQuery;

    const clearAll = () => { setSearchQuery(''); setSearchParams({ category: 'all' }); };

    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="relative bg-[#0c1526] overflow-hidden">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px'
                    }}
                />
                {/* Blue glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-20">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-10">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Inicio</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="size-3.5 text-blue-400" />
                                <span className="font-display text-[10px] font-semibold text-blue-400 uppercase tracking-[0.3em]">Catálogo Oficial</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mb-3">
                                Equipamiento<br />
                                <span className="text-blue-400">Profesional.</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
                                Seguridad y automatización residencial con soporte técnico especializado.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 shrink-0">
                            {[
                                { value: products.length, label: 'Productos' },
                                { value: '3', label: 'Categorías' },
                                { value: '24h', label: 'Entrega' },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                                    <p className="font-display text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar cámara, cerradura, switch..."
                            className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white/10 border border-white/10 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/15 focus:border-blue-500/40 backdrop-blur-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="size-3.5 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div className="flex items-center gap-2 mt-5 flex-wrap">
                        {categories.map(cat => {
                            const Icon = categoryIcons[cat];
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSearchParams({ category: cat })}
                                    className={`font-display flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                                        categoryFilter === cat
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-white/8 border border-white/10 text-slate-400 hover:bg-white/15 hover:text-white'
                                    }`}
                                >
                                    {Icon && <Icon className="size-3" />}
                                    {cat === 'all' ? 'Todos' : cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── TOOLBAR ──────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                        {activeFilters && (
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-1.5 font-display text-[9px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors border border-red-100"
                            >
                                <X className="size-3" /> Limpiar
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className="font-display flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all"
                            >
                                <SlidersHorizontal className="size-3.5" />
                                {sortOptions.find(s => s.value === sortBy)?.label}
                                <ChevronDown className={`size-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {sortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
                                    {sortOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                                            className={`w-full text-left px-4 py-3 font-display text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                                sortBy === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Grid/List toggle */}
                        <div className="hidden md:flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                            {[
                                { id: 'grid', Icon: LayoutGrid },
                                { id: 'list', Icon: List },
                            ].map(({ id, Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setGridCols(id)}
                                    className={`p-1.5 rounded-lg transition-all ${gridCols === id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Icon className="size-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BODY: Sidebar + Products ──────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 items-start">

                {/* Sidebar */}
                <aside className="hidden lg:block w-60 shrink-0 sticky top-16">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                            <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-900">Filtros</span>
                            {activeFilters && (
                                <button onClick={clearAll} className="font-display text-[9px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                                    Limpiar
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="p-4">
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Categorías</p>
                            <div className="space-y-0.5">
                                {categories.map(cat => {
                                    const Icon = categoryIcons[cat] || LayoutGrid;
                                    const count = cat === 'all' ? products.length : products.filter(p => p.category === cat).length;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSearchParams({ category: cat })}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                                                categoryFilter === cat
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="size-3.5 shrink-0" />
                                                <span className="font-display text-[10px] font-bold uppercase tracking-wider">
                                                    {cat === 'all' ? 'Todos' : cat}
                                                </span>
                                            </div>
                                            <span className={`font-display text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                                categoryFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price range */}
                        <div className="px-4 pb-4 border-t border-slate-50 pt-4">
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Rango de Precio</p>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 text-center">
                                    <p className="font-display text-[8px] text-slate-400 uppercase tracking-widest">Desde</p>
                                    <p className="font-display text-sm font-bold text-slate-900">${priceRange.min.toLocaleString()}</p>
                                </div>
                                <div className="w-3 h-px bg-slate-200 shrink-0" />
                                <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 text-center">
                                    <p className="font-display text-[8px] text-slate-400 uppercase tracking-widest">Hasta</p>
                                    <p className="font-display text-sm font-bold text-slate-900">${priceRange.max.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust note */}
                        <div className="mx-4 mb-4 p-3.5 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="flex items-start gap-2.5">
                                <Shield className="size-4 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-display text-[9px] font-bold text-blue-900 uppercase tracking-wider mb-0.5">Compra segura</p>
                                    <p className="text-[10px] text-blue-600 font-medium leading-snug">Garantía 3 años + soporte técnico</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products */}
                <main className="flex-1 min-w-0 pb-20">
                    {filteredProducts.length > 0 ? (
                        gridCols === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredProducts.map(p => <ProductListCard key={p.id} product={p} />)}
                            </div>
                        )
                    ) : (
                        <div className="py-32 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="bg-slate-50 size-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Search className="size-7 text-slate-300" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Sin resultados</h3>
                            <p className="text-slate-400 text-sm mb-10 max-w-xs mx-auto">
                                Intenta buscar con otros términos o selecciona otra categoría.
                            </p>
                            <button
                                onClick={clearAll}
                                className="font-display bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20"
                            >
                                Ver todos los productos
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
