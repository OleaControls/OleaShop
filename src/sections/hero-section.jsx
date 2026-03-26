import { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
    const images = [
        { src: "/IMG PARA PAGINA SHOP/oleacarusel.png",     alt: "Compra tus equipos smarthome",                      buttonText: "Ir a la tienda" },
        { src: "/IMG PARA PAGINA SHOP/SmartHome.jpg",    alt: "Seguridad inteligente SmartHome powered by epcom",  buttonText: "Ver catálogo" },
        { src: "/IMG PARA PAGINA SHOP/controltotal.png", alt: "Control total y seguridad en una sola plataforma",  buttonText: "Ir a la tienda" },
        { src: "/IMG PARA PAGINA SHOP/porqueolea.png",   alt: "Por qué Oleacontrols",                               buttonText: "Ver catálogo" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentIndex(p => (p + 1) % images.length), 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const next = () => setCurrentIndex(p => (p + 1) % images.length);
    const prev = () => setCurrentIndex(p => (p - 1 + images.length) % images.length);

    return (
        <section className="relative w-full overflow-hidden group bg-slate-100">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-auto object-cover"
                        />
                        {/* CTA button — desktop only */}
                        <div className="absolute bottom-[15%] left-[8%] hidden md:block">
                            <Link
                                to="/shop"
                                className="flex items-center gap-3 bg-slate-900/50 hover:bg-blue-600/70 text-white px-12 py-5 rounded-full font-display font-bold uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95 group/btn backdrop-blur-sm"
                            >
                                <span>{image.buttonText}</span>
                                <ShoppingCart className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev / Next */}
            <button
                onClick={prev}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-1.5 md:p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="size-4 md:size-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-1.5 md:p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="size-4 md:size-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentIndex === index ? 'bg-white w-5 md:w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
