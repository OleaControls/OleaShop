export default function Categories() {
    const items = [
        { 
            name: "Seguridad y Detección", 
            color: "bg-[#0f172a]", 
            desc: "Sistemas contra incendios y alarmas industriales",
            image: "/IMG PARA PAGINA SHOP/NBG12WLSP-h.png"
        },
        { 
            name: "Termostatos e Iluminación", 
            color: "bg-[#1e3a8a]", 
            desc: "Control total de tu entorno y energía",
            image: "/IMG PARA PAGINA SHOP/PROA7T6ZW-h.png"
        },
        { 
            name: "Cámaras e IA", 
            color: "bg-[#1e293b]", 
            desc: "Visión nítida con detección humana avanzada",
            image: "/IMG PARA PAGINA SHOP/HC35W45R2-h.png"
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-3">
            {items.map((item, i) => (
                <div key={i} className={`${item.color} text-white p-10 flex flex-col justify-between min-h-[400px] group cursor-pointer overflow-hidden relative border-r border-white/5 last:border-0`}>
                    
                    {/* Contenido Superior */}
                    <div className="relative z-10">
                        <span className="text-blue-400 text-[8px] font-black uppercase tracking-[0.4em] mb-3 block">Categoría</span>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-3 group-hover:text-blue-400 transition-colors duration-500">{item.name}</h3>
                        <p className="text-slate-400 text-xs font-medium max-w-[180px] leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Imagen del Producto - Mayor tamaño y mejor posición */}
                    <div className="relative z-10 flex justify-end transform translate-x-6 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700 ease-out">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-52 md:h-60 w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>

                    {/* Decoración de fondo */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700"></div>
                </div>
            ))}
        </section>
    );
}
