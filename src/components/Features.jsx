export default function Features() {
    const logos = [
        { name: "Epcom", src: "/IMG PARA PAGINA SHOP/IM2/epcom logo.png" },
        { name: "Hikvision", src: "/IMG PARA PAGINA SHOP/IM2/hikvision.svg" },
        { name: "TP-Link", src: "/IMG PARA PAGINA SHOP/IM2/TPLINK_Logo_2.svg.png" },
    ];

    // Duplicamos los logos para crear el efecto de loop infinito sin saltos
    const doubleLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

    return (
        <section className="bg-white py-16 overflow-hidden border-y border-slate-50 relative">
            {/* Gradientes para suavizar la entrada y salida de los elementos */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>

            <div className="flex whitespace-nowrap animate-marquee items-center">
                {doubleLogos.map((logo, i) => (
                    <div key={i} className="flex items-center justify-center mx-16 grayscale hover:grayscale-0 transition-all duration-700 opacity-60 hover:opacity-100 transform hover:scale-110">
                        <img 
                            src={logo.src} 
                            alt={logo.name} 
                            className="h-12 md:h-16 w-auto object-contain max-w-[200px]" 
                        />
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
}
