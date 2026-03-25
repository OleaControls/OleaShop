import { useProducts } from "../context/ProductsContext";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProductsSection() {
    const { products: allProducts } = useProducts();
    const featured = allProducts.filter(p => p.activo !== false).slice(0, 4);

    return (
        <section className="py-16 md:py-24 px-5 md:px-12 bg-[#F6F6F4]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-10 md:mb-16">
                    <div>
                        <span className="font-display text-blue-600 text-[10px] font-semibold uppercase tracking-[0.3em] mb-2 block">
                            Store Online
                        </span>
                        <h2 className="font-display text-2xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                            Nuestros <span className="text-blue-600">Productos.</span>
                        </h2>
                    </div>
                    <Link
                        to="/shop"
                        className="font-display shrink-0 group hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                        Ver Catálogo
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
                    {featured.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
