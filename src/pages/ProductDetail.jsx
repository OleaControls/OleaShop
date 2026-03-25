import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Shield, Info, Truck, Award, Star, Share2, Heart, ChevronRight, Zap, Boxes } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductDetail() {
    const { id } = useParams();
    const product = products.find(p => p.id === id);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('especificaciones');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#fcfcfd]">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 max-w-md">
                    <Boxes className="size-16 text-slate-200 mx-auto mb-6" />
                    <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Equipo no disponible</h1>
                    <p className="text-slate-400 mb-10 font-medium">Lo sentimos, no pudimos encontrar el producto que buscas en nuestro catálogo.</p>
                    <Link to="/shop" className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all w-full">
                        <ArrowLeft className="size-4" />
                        Explorar Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] pb-40">
            {/* Header de Navegación Compacto */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/shop" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Regresar</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Tienda</span>
                        <ChevronRight className="size-3" />
                        <span>{product.category}</span>
                        <ChevronRight className="size-3" />
                        <span className="text-slate-900">{product.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Share2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                    
                    {/* Visualización del Producto (Izquierda) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="sticky top-32">
                            <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-12 md:p-20 group">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000"
                                />
                                
                                <div className="absolute top-10 left-10">
                                    <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-xl">
                                        Premium Tech
                                    </span>
                                </div>
                            </div>
                            
                            {/* Detalles de Confianza Visual */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {[
                                    { icon: Zap, label: 'Instalación', value: 'Express' },
                                    { icon: Shield, label: 'Garantía', value: '3 Años' },
                                    { icon: Award, label: 'Certificación', value: 'NOM-ICE' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
                                        <item.icon className="size-5 text-blue-600 mb-1" />
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Información y Compra (Derecha) */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-3 fill-blue-500 text-blue-500" />)}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(4.9 Puntaje de Ingeniería)</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none uppercase italic">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-8">
                                <span className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">{product.category}</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-400 tracking-widest">ID: {product.id}</span>
                            </div>

                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Precio y Disponibilidad */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 block">Inversión Final</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter italic">${product.price.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">mxn</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50/50 border border-green-100/50">
                                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">En stock: Disponible para entrega inmediata</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={handleAddToCart}
                                    className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] group ${
                                        added 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10'
                                    }`}
                                >
                                    {added ? (
                                        <>
                                            <Check className="size-5" />
                                            Añadido al Carrito
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-5" />
                                            Añadir a mi Selección
                                            <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Truck className="size-4 text-slate-300" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Envío Nacional Gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="size-4 text-slate-300" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pago Encriptado</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs de Información Detallada */}
                        <div className="space-y-6">
                            <div className="flex border-b border-slate-100">
                                <button 
                                    onClick={() => setActiveTab('especificaciones')}
                                    className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === 'especificaciones' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    Especificaciones
                                    {activeTab === 'especificaciones' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('soporte')}
                                    className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === 'soporte' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    Soporte Técnico
                                    {activeTab === 'soporte' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                                </button>
                            </div>

                            <div className="pt-2">
                                {activeTab === 'especificaciones' ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {product.features.map((feature, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-50 shadow-sm group hover:border-blue-100 transition-colors">
                                                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight italic">{feature}</span>
                                                <Check className="size-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 rounded-3xl bg-blue-50/30 border border-blue-100/50">
                                        <div className="flex items-start gap-4 mb-6">
                                            <Info className="size-6 text-blue-600" />
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic mb-1">Garantía Directa</h4>
                                                <p className="text-slate-500 text-xs leading-relaxed font-medium">Este equipo cuenta con respaldo técnico de ingeniería de primer nivel y garantía de fábrica por 3 años.</p>
                                            </div>
                                        </div>
                                        <button className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] underline underline-offset-4 decoration-blue-200">
                                            Descargar ficha técnica (PDF)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
