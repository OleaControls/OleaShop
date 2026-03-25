import SectionTitle from "../components/section-title";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function OurLatestCreations() {
    const featuredProducts = products.slice(0, 3);

    return (
        <section className="flex flex-col items-center justify-center mt-40 pb-20">
            <SectionTitle 
                title="Sistemas Destacados" 
                subtitle="Selección de nuestras soluciones de ingeniería de alto desempeño para seguridad, automatización y conectividad avanzada." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20 max-w-7xl px-4">
                {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <Link to="/shop" className="mt-20 flex items-center gap-3 group text-blue-600 font-black text-xl hover:text-blue-700 transition-colors uppercase tracking-widest text-sm">
                Ver Catálogo Técnico Completo
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </section>
    );
}
