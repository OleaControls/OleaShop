import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Categories() {
    const items = [
        {
            name: "Seguridad y Detección",
            color: "bg-[#0c1526]",
            desc: "Sistemas contra incendios y alarmas industriales",
            href: "/shop?category=Seguridad",
            image: "/IMG PARA PAGINA SHOP/NBG12WLSP-h.png"
        },
        {
            name: "Termostatos e Iluminación",
            color: "bg-[#0f1f3d]",
            desc: "Control total de tu entorno y energía",
            href: "/shop?category=Hogar%20Inteligente",
            image: "/IMG PARA PAGINA SHOP/PROA7T6ZW-h.png"
        },
        {
            name: "Cámaras e IA",
            color: "bg-[#111827]",
            desc: "Visión nítida con detección humana avanzada",
            href: "/shop?category=Seguridad",
            image: "/IMG PARA PAGINA SHOP/HC35W45R2-h.png"
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-3">
            {items.map((item, i) => (
                <Link
                    key={i}
                    to={item.href}
                    className={`${item.color} text-white flex group cursor-pointer overflow-hidden relative border-b md:border-b-0 md:border-r border-white/5 last:border-0
                        /* mobile: row layout */ flex-row items-center gap-4 p-5
                        /* desktop: column layout */ md:flex-col md:justify-between md:min-h-[400px] md:p-10`}
                >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/8 transition-all duration-700 pointer-events-none" />

                    {/* Text */}
                    <div className="relative z-10 flex-1 min-w-0">
                        <span className="text-blue-400 text-[8px] font-semibold uppercase tracking-[0.4em] mb-1 md:mb-3 block">Categoría</span>
                        <h3 className="font-display text-base md:text-2xl font-bold leading-tight mb-1 md:mb-3 group-hover:text-blue-300 transition-colors duration-500 truncate md:whitespace-normal">
                            {item.name}
                        </h3>
                        <p className="text-slate-400 text-[11px] md:text-xs font-medium leading-relaxed hidden md:block max-w-[180px]">
                            {item.desc}
                        </p>
                        {/* Explore — shown on mobile inline */}
                        <div className="flex items-center gap-1 mt-1 md:hidden text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">
                            Explorar <ArrowRight className="size-2.5" />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative z-10 shrink-0
                        /* mobile */ w-20 h-20
                        /* desktop */ md:w-auto md:h-auto md:flex md:justify-end md:transform md:translate-x-4 md:translate-y-2 md:group-hover:translate-x-0 md:group-hover:translate-y-0 md:transition-all md:duration-700">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain drop-shadow-lg md:drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] md:h-52 md:w-auto group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Explore — desktop bottom */}
                    <div className="absolute bottom-6 left-10 hidden md:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-blue-400 transition-colors duration-500 z-10">
                        Explorar <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-white/[0.03] rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700 pointer-events-none" />
                </Link>
            ))}
        </section>
    );
}
