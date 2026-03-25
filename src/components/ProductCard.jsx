import { ShoppingCart, Plus, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full relative">
            {/* Área Interactiva: Imagen y Contenido */}
            <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
                <div className="relative aspect-square overflow-hidden bg-[#fcfcfc] p-6">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-slate-900 text-white text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-sm">
                            {product.category}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                        <div className="flex gap-0.5 mb-1.5 opacity-30">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-2.5 fill-slate-900 text-slate-900" />)}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase">
                            {product.name}
                        </h3>
                    </div>

                    <p className="text-slate-400 text-[11px] font-medium line-clamp-2 mb-6 flex-grow leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </Link>

            {/* Botón de añadir rápido (Independiente del Link principal) */}
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                }}
                className="absolute top-[40%] right-4 bg-blue-600 text-white p-3 rounded-xl shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-700 active:scale-90 z-20"
            >
                <Plus className="size-4" />
            </button>

            {/* Footer de la tarjeta */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Precio</span>
                    <span className="text-lg font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</span>
                </div>
                
                <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center gap-1.5 text-slate-900 font-bold text-[9px] uppercase tracking-widest hover:text-blue-600 transition-colors group/link"
                >
                    Ver más
                    <ArrowRight className="size-3 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
