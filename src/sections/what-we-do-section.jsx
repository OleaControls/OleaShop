import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhatWeDoSection() {
    return (
        <section className="py-10 md:py-16 bg-white px-5 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group">
                    <img
                        src="/IMG PARA PAGINA SHOP/banner epcomSmart home.jpg"
                        alt="Control total desde la palma de tu mano"
                        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                    />
                    <div className="absolute bottom-4 right-4 md:bottom-12 md:right-10 hidden md:block">
                        <Link
                            to="/shop"
                            className="font-display flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white
                                px-5 py-2.5 md:px-12 md:py-4
                                rounded-full font-bold uppercase
                                text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em]
                                shadow-xl transition-all active:scale-95"
                        >
                            Ver Productos
                            <ShoppingCart className="size-3.5 md:size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
