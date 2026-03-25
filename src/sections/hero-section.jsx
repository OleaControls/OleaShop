import { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
    const images = [
        {
            src: "/IMG PARA PAGINA SHOP/cap.png",
            alt: "Soluciones inteligentes para tu hogar y empresa",
            buttonText: "Ir a la tienda"
        },
        {
            src: "/IMG PARA PAGINA SHOP/SmartHome.jpg",
            alt: "Seguridad inteligente para su Hogar - SmartHome powered by epcom",
            buttonText: "Ver catálogo"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <section className="relative w-full bg-[#f3f4f6] overflow-hidden group">
            {/* Banner Carousel */}
            <div className="relative w-full overflow-hidden">
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
                            
                            {/* Botón de acción flotante posicionado estratégicamente */}
                            <div className="absolute bottom-[15%] left-[6%] md:left-[8%]">
                                <Link to="/shop" className="flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 md:px-12 py-3 md:py-5 rounded-full font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 group/btn">
                                    <span>{image.buttonText}</span>
                                    <ShoppingCart className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controles del Carousel */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight className="size-6" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`size-2 rounded-full transition-all ${
                                currentIndex === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
