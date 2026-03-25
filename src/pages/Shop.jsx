import { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Search, Package, ArrowLeft, Filter, X, LayoutGrid } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || 'all';
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, searchQuery]);

    const categories = ['all', ...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            {/* Header Compacto y Minimalista (UX Focused) */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Volver</span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-blue-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Catálogo Pro</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            {filteredProducts.length} Equipos
                        </span>
                    </div>
                </div>
            </nav>

            {/* Hero Section Refinado */}
            <header className="py-20 bg-white relative overflow-hidden">
                {/* Patrón de puntos sutil */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', size: '20px 20px' }} />
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none uppercase italic">
                        Equipamiento <span className="text-blue-600">Online</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Sistemas avanzados de seguridad y automatización con soporte técnico especializado.
                    </p>
                </div>
            </header>

            {/* Toolbar de Navegación y Filtros */}
            <div className="bg-[#fcfcfd] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        
                        {/* Buscador Estilo Minimalista */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar equipo..." 
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm placeholder:text-slate-300 placeholder:font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="size-3.5 text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* Filtros de Categoría Refinados */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar scroll-smooth">
                            <div className="flex items-center gap-2 mr-3 border-r border-slate-200 pr-5">
                                <Filter className="size-3.5 text-slate-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Categorías</span>
                            </div>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSearchParams({ category: cat })}
                                    className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                                        categoryFilter === cat 
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-blue-600/20 hover:text-blue-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <main className="max-w-7xl mx-auto px-6 pb-40">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <div className="bg-slate-50 size-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Search className="size-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No encontramos resultados</h3>
                        <p className="text-slate-400 text-sm mb-10 max-w-xs mx-auto">Intenta ajustar tus filtros o buscar términos más generales.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSearchParams({category: 'all'})}}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
