import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, CreditCard, Truck, ChevronLeft, PackageCheck } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#fcfcfd]">
                <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-600/10" />
                    <div className="bg-slate-50 size-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingBag className="size-10 text-slate-300" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tighter italic">Carrito Vacío</h1>
                    <p className="text-slate-400 mb-10 font-medium leading-relaxed">Tu selección tecnológica está esperando. Explora nuestras soluciones de seguridad y domótica.</p>
                    <Link to="/shop" className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 group w-full">
                        Volver al Catálogo
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] pb-40">
            {/* Header Minimalista */}
            <div className="bg-white border-b border-slate-100 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest transition-colors mb-8 group">
                        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Continuar Comprando
                    </Link>
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                                Tu <span className="text-blue-600">Pedido.</span>
                            </h1>
                            <p className="text-slate-400 font-medium mt-4 text-sm flex items-center gap-2">
                                <PackageCheck className="size-4 text-blue-500" />
                                {cart.length} {cart.length === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Lista de Productos (UX Optimizado) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-6">Producto</div>
                            <div className="col-span-3 text-center">Cantidad</div>
                            <div className="col-span-3 text-right">Subtotal</div>
                        </div>

                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:grid md:grid-cols-12 md:gap-4 items-center group hover:border-blue-100 transition-all duration-300">
                                {/* Imagen y Nombre */}
                                <div className="md:col-span-6 flex flex-col md:flex-row items-center gap-6 w-full">
                                    <div className="size-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 p-3 group-hover:scale-105 transition-transform">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight italic leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-3 mt-1.5">
                                            <span className="text-blue-600 text-[9px] font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{item.category}</span>
                                            <span className="text-slate-300 text-[10px] font-bold">${item.price.toLocaleString()} c/u</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Control de Cantidad */}
                                <div className="md:col-span-3 flex justify-center w-full mt-6 md:mt-0">
                                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                        >
                                            <Minus className="size-4" />
                                        </button>
                                        <span className="px-4 font-black text-slate-900 text-sm min-w-[3rem] text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Precio y Eliminar */}
                                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-6 w-full mt-6 md:mt-0">
                                    <p className="font-black text-slate-900 text-xl tracking-tighter">${(item.price * item.quantity).toLocaleString()}</p>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2.5 rounded-xl text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all group/trash"
                                        title="Eliminar del carrito"
                                    >
                                        <Trash2 className="size-5 group-hover/trash:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 flex justify-center">
                            <button 
                                onClick={clearCart}
                                className="text-slate-400 hover:text-red-600 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-red-50 transition-all"
                            >
                                <Trash2 className="size-3.5" />
                                Vaciar mi selección
                            </button>
                        </div>
                    </div>

                    {/* Resumen de Pago (Diseño Compacto y Directo) */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-32">
                            <h2 className="text-xl font-black mb-8 uppercase tracking-tighter italic flex items-center gap-3">
                                <CreditCard className="size-5 text-blue-600" />
                                Resumen de Pago
                            </h2>
                            
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Equipamiento</span>
                                    <span className="text-sm font-black text-slate-900">${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Logística Express</span>
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-md">Bonificado</span>
                                </div>
                                <div className="pt-6 flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-1">Total a Pagar</span>
                                        <span className="text-4xl font-black text-slate-900 tracking-tighter italic">${cartTotal.toLocaleString()}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase mb-1">MXN</span>
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 mb-8 active:scale-[0.98] flex items-center justify-center gap-3 group">
                                Procesar Orden
                                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                    <ShieldCheck className="size-4 text-blue-500" />
                                    <span>Garantía de Fábrica Incluida</span>
                                </div>
                                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                    <Truck className="size-4 text-blue-500" />
                                    <span>Entrega 24-48 Horas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
