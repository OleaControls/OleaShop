export default function Features() {
    const logos = [
        { name: "Epcom",     src: "/IMG PARA PAGINA SHOP/IM2/epcom logo.png" },
        { name: "Hikvision", src: "/IMG PARA PAGINA SHOP/IM2/hikvision.svg" },
        { name: "TP-Link",   src: "/IMG PARA PAGINA SHOP/IM2/TPLINK_Logo_2.svg.png" },
    ];

    const doubleLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

    return (
        <section className="bg-white py-10 md:py-14 overflow-hidden border-y border-slate-100 relative">
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="flex whitespace-nowrap animate-marquee items-center">
                {doubleLogos.map((logo, i) => (
                    <div key={i} className="flex items-center justify-center mx-8 md:mx-16 grayscale hover:grayscale-0 transition-all duration-700 opacity-50 hover:opacity-100">
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="h-8 md:h-14 w-auto object-contain max-w-[120px] md:max-w-[200px]"
                        />
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0%   { transform: translateX(0); }
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
