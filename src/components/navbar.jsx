import { MenuIcon, XIcon, ShoppingBag, ShoppingCart, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    const links = [
        { name: 'Inicio',   href: '/' },
        { name: 'Tienda',   href: '/shop' },
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Contacto', href: '/contacto' },
    ];

    return (
        <>
            <div className="sticky top-0 z-50">

                {/* ── Announcement bar ─────────────────────────────────── */}
                <div className="bg-slate-950 py-2 px-6">
                    <p className="text-center font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                        <span className="text-blue-500">●</span>
                        &nbsp; Distribución Nacional &nbsp;·&nbsp; Garantía 3 Años &nbsp;·&nbsp; Soporte Técnico
                    </p>
                </div>

                {/* ── Main nav ─────────────────────────────────────────── */}
                <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">

                        {/* Logo */}
                        <Link to="/" className="shrink-0 hover:opacity-70 transition-opacity">
                            <img
                                src="/IMG PARA PAGINA SHOP/logo.png"
                                alt="OLEACONTROLS"
                                className="h-6 md:h-7 w-auto object-contain"
                            />
                        </Link>

                        {/* Nav links — center */}
                        <div className="hidden md:flex items-center gap-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors duration-200 relative group py-1"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-3 shrink-0">

                            {/* User — desktop */}
                            {isAuthenticated ? (
                                <div className="hidden md:block relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                    >
                                        <div className="size-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-display text-[10px] font-black shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-display text-[10px] font-semibold text-slate-700 uppercase tracking-wider max-w-[72px] truncate">
                                            {user.name}
                                        </span>
                                        <ChevronDown className={`size-3 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50">
                                            <div className="px-4 py-3.5 border-b border-slate-50">
                                                <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Sesión activa</p>
                                                <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                                                <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/cuenta"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-4 py-3 font-display text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                <LayoutDashboard className="size-3.5" />
                                                Mi cuenta
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-3 font-display text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="size-3.5" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden md:flex items-center gap-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors relative group py-1"
                                >
                                    <User className="size-3.5" />
                                    Cuenta
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
                                </Link>
                            )}

                            {/* Divider */}
                            <div className="hidden md:block w-px h-5 bg-slate-200" />

                            {/* Cart button — desktop */}
                            <Link
                                to="/cart"
                                className="hidden md:flex items-center gap-2.5 bg-slate-900 hover:bg-blue-600 text-white pl-4 pr-3 py-2.5 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-slate-900/15 group relative overflow-hidden"
                            >
                                {/* subtle shine on hover */}
                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 pointer-events-none" />
                                <ShoppingCart className="size-4 shrink-0" />
                                Carrito
                                <span className={`min-w-[20px] h-5 rounded-full flex items-center justify-center font-black text-[9px] leading-none transition-all px-1 ${
                                    cartCount > 0
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'bg-white/15 text-white/50'
                                }`}>
                                    {cartCount}
                                </span>
                            </Link>

                            {/* Cart icon — mobile */}
                            <Link to="/cart" className="relative md:hidden">
                                <ShoppingBag className="size-5 text-slate-800" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[8px] font-black size-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
                            >
                                <MenuIcon className="size-5" />
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* ── Mobile menu ──────────────────────────────────────────── */}
            <div className={`fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

                {/* Backdrop */}
                <div
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Drawer — slides from right */}
                <div className={`absolute top-0 right-0 h-full w-[85vw] max-w-sm bg-slate-950 flex flex-col transition-transform duration-500 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
                        <img
                            src="/IMG PARA PAGINA SHOP/logo.png"
                            alt="OLEACONTROLS"
                            className="h-6 w-auto object-contain brightness-0 invert opacity-60"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        >
                            <XIcon className="size-4.5" />
                        </button>
                    </div>

                    {/* User info strip (if logged in) */}
                    {isAuthenticated && (
                        <div className="mx-5 mt-5 flex items-center gap-3 bg-white/5 border border-white/[0.08] rounded-2xl px-4 py-3">
                            <div className="size-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-display font-black text-sm shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none mb-0.5">Sesión activa</p>
                                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation links */}
                    <nav className="flex-1 px-5 py-6 flex flex-col gap-1 overflow-y-auto">
                        <p className="font-display text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600 px-3 mb-2">Navegación</p>
                        {links.map((link, i) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between px-4 py-3.5 rounded-xl font-display text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/6 active:bg-white/10 transition-all group"
                            >
                                <span>{link.name}</span>
                                <span className="size-5 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <ChevronDown className="-rotate-90 size-3 text-slate-500 group-hover:text-white transition-colors" />
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom actions */}
                    <div className="px-5 pb-8 pt-4 border-t border-white/[0.07] flex flex-col gap-3">
                        <Link
                            to="/cart"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 rounded-2xl transition-colors active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag className="size-4.5" />
                                <span className="font-display font-bold text-sm uppercase tracking-wider">Carrito</span>
                            </div>
                            <span className={`font-display font-black text-xs min-w-[24px] h-6 rounded-full flex items-center justify-center px-1.5 ${cartCount > 0 ? 'bg-white text-blue-600' : 'bg-white/20 text-white/60'}`}>
                                {cartCount}
                            </span>
                        </Link>

                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 px-5 py-3.5 rounded-2xl font-display font-bold text-sm uppercase tracking-wider transition-all"
                            >
                                <User className="size-4" /> Iniciar Sesión
                            </Link>
                        ) : (
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="flex items-center justify-center gap-2 border border-red-900/40 text-red-400 hover:bg-red-950/30 px-5 py-3.5 rounded-2xl font-display font-bold text-sm uppercase tracking-wider transition-all"
                            >
                                <LogOut className="size-4" /> Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
