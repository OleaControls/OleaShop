import { MenuIcon, XIcon, ShoppingBag, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();

    const links = [
        { name: 'Inicio', href: '/' },
        { name: 'Tienda', href: '/shop' },
        { name: 'Seguridad', href: '/shop?category=security' },
        { name: 'Nosotros', href: '#' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 flex justify-between items-center px-8 md:px-16 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
                
                {/* Logo - Tamaño optimizado para elegancia */}
                <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                    <img 
                        src="/IMG PARA PAGINA SHOP/logo.png" 
                        alt="OLEACONTROLS" 
                        className="h-5 md:h-7 w-auto object-contain" 
                    />
                </Link>

                {/* Links - Estética Minimalista */}
                <div className="hidden md:flex gap-10 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                    {links.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.href} 
                            className="hover:text-blue-600 transition-colors duration-300 relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Actions - Iconos con estilo Pro */}
                <div className="flex items-center gap-6 text-slate-800">
                    <button className="hidden md:block hover:text-blue-600 transition-colors cursor-pointer">
                        <Search className="size-4.5" />
                    </button>
                    
                    <Link to="/cart" className="relative group p-1">
                        <ShoppingBag className="size-5.5 group-hover:scale-110 transition-transform duration-300" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black size-4.5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button 
                        onClick={() => setIsOpen(true)} 
                        className="md:hidden p-1 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <MenuIcon className="size-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu - Estilo Full Screen Clean */}
            <div className={`fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center gap-10 text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <XIcon className="size-10" />
                </button>

                <div className="flex flex-col items-center gap-8">
                    {links.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.href} 
                            onClick={() => setIsOpen(false)} 
                            className="hover:text-blue-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                
                <Link 
                    to="/shop" 
                    onClick={() => setIsOpen(false)}
                    className="mt-8 bg-slate-900 text-white px-12 py-4 rounded-2xl text-lg font-black tracking-tighter italic"
                >
                    Ver Catálogo
                </Link>
            </div>
        </>
    );
}
