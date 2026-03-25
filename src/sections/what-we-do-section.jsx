import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhatWeDoSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-[#fbfbfb] group">
                    {/* Imagen proporcionada por el usuario */}
                    <img 
                        src="/IMG PARA PAGINA SHOP/banner epcomSmart home.jpg" 
                        alt="Control total desde la palma de tu mano" 
                        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                    />
                    
                    {/* CTA Discreto para la Tienda */}
                    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16">
                        <Link to="/shop" className="bg-slate-900 text-white px-12 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/40 active:scale-95 flex items-center gap-3">
                            Ver Productos
                            <ShoppingCart className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
