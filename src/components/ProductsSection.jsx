import { products } from "../data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function ProductsSection() {
    // Tomamos los primeros 4 para la Home
    const featured = products.slice(0, 4);

    return (
        <section className="py-24 px-6 md:px-12 bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div>
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Store Online</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                            Nuestros <span className="text-blue-600">Productos.</span>
                        </h2>
                    </div>
                    <Link to="/shop" className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                        Ver Catálogo Completo
                        <ShoppingBag className="size-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
