import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const categoryColors = {
    'Seguridad': 'bg-blue-600 text-white',
    'Hogar Inteligente': 'bg-emerald-600 text-white',
    'Seguridad Avanzada': 'bg-violet-600 text-white',
};

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);

    const badgeClass = categoryColors[product.category] || 'bg-slate-800 text-white';

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (adding) return;
        addToCart(product);
        setAdding(true);
        setTimeout(() => setAdding(false), 1400);
    };

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">

            {/* Image Area */}
            <Link to={`/product/${encodeURIComponent(product.id)}`} className="block relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 to-white p-8">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply drop-shadow-lg"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <ShoppingCart className="size-12" />
                    </div>
                )}

                {/* Category Badge */}
                <span className={`absolute top-4 left-4 text-[8px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-md shadow-sm ${badgeClass}`}>
                    {product.category}
                </span>

                {/* Hover overlay hint */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <span className="bg-white/95 shadow-lg text-slate-700 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-slate-100">
                        Ver detalle →
                    </span>
                </div>
            </Link>

            {/* Content */}
            <Link to={`/product/${encodeURIComponent(product.id)}`} className="px-5 pt-4 pb-2 flex flex-col flex-grow">
                <h3 className="font-display font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                </p>
            </Link>

            {/* Card Footer */}
            <div className="px-3 md:px-5 pt-3 pb-4 md:pb-5 mt-auto flex items-center justify-between gap-2">
                {/* Price */}
                <div>
                    <span className="text-[7px] md:text-[8px] text-slate-300 font-semibold uppercase tracking-widest block mb-0.5">Precio</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-display text-base md:text-xl font-bold text-slate-900 tracking-tight">
                            ${product.price.toLocaleString()}
                        </span>
                        <span className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase">MXN</span>
                    </div>
                </div>

                {/* Add to cart button */}
                <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-1 md:gap-1.5 transition-all duration-300 active:scale-95 shadow-sm rounded-xl font-bold uppercase tracking-wider
                        /* mobile: icon only */ p-2 md:px-4 md:py-2.5 text-[10px]
                        ${adding
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-900 hover:bg-blue-600 text-white'
                        }`}
                >
                    {adding
                        ? <Check className="size-3.5" />
                        : <ShoppingCart className="size-3.5" />
                    }
                    <span className="hidden md:inline">{adding ? '¡Listo!' : 'Añadir'}</span>
                </button>
            </div>
        </div>
    );
}
