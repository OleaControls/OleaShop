import { LinkedinIcon, TwitterIcon, ShieldCheck, MapPin, Phone, Mail, Instagram, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    const sections = [
        {
            title: 'Soluciones',
            links: [
                { title: 'Seguridad y Alarmas', href: '/shop?category=Seguridad' },
                { title: 'Hogar Inteligente', href: '/shop?category=Hogar%20Inteligente' },
                { title: 'Cámaras e IA', href: '/shop?category=Seguridad' },
                { title: 'Ofertas Especiales', href: '/shop' },
            ],
        },
        {
            title: 'Compañía',
            links: [
                { title: 'Sobre Nosotros', href: '#' },
                { title: 'Proyectos Reales', href: '#' },
                { title: 'Términos de Venta', href: '#' },
                { title: 'Aviso de Privacidad', href: '#' },
            ],
        },
    ];

    return (
        <footer>
            {/* CTA Strip */}
            <div className="bg-blue-600 py-12 px-8 md:px-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-200 mb-2">¿Tienes dudas?</p>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                            Asesoría técnica gratuita.
                        </h3>
                    </div>
                    <Link
                        to="/shop"
                        className="font-display group shrink-0 flex items-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all shadow-xl shadow-blue-800/20"
                    >
                        Ver Catálogo
                        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-[#09090b] text-slate-400 pt-20 pb-10 px-8 md:px-16 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">

                        {/* Brand */}
                        <div className="col-span-1">
                            <Link to='/' className="flex items-center mb-7">
                                <img
                                    src="/IMG PARA PAGINA SHOP/logo.png"
                                    alt="OLEACONTROLS"
                                    className="h-7 w-auto object-contain brightness-0 invert"
                                />
                            </Link>
                            <p className="text-[13px] leading-relaxed mb-8 font-medium text-slate-500">
                                Expertos en integración de sistemas de seguridad y automatización residencial. Tecnología SmartHome powered by epcom.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="size-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-400 transition-all">
                                    <Instagram className="size-4" />
                                </a>
                                <a href="#" className="size-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                                    <LinkedinIcon className="size-4" />
                                </a>
                                <a href="#" className="size-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                                    <TwitterIcon className="size-4" />
                                </a>
                            </div>
                        </div>

                        {/* Link sections */}
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="font-display text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-7">{section.title}</h4>
                                <ul className="space-y-3.5">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <Link to={link.href} className="text-sm text-slate-500 hover:text-white transition-colors duration-300 font-medium">
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact */}
                        <div>
                            <h4 className="font-display text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-7">Soporte Técnico</h4>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3.5">
                                    <div className="bg-white/5 p-2 rounded-lg shrink-0 mt-0.5">
                                        <MapPin className="size-3.5 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">
                                        Ciudad de México, MX
                                        <br />
                                        <span className="text-[11px] text-slate-600">Centro de Distribución</span>
                                    </span>
                                </li>
                                <li className="flex items-center gap-3.5">
                                    <div className="bg-white/5 p-2 rounded-lg shrink-0">
                                        <Phone className="size-3.5 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">55 7919 2845</span>
                                </li>
                                <li className="flex items-center gap-3.5">
                                    <div className="bg-white/5 p-2 rounded-lg shrink-0">
                                        <Mail className="size-3.5 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">soporte@oleacontrols.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-10 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                            © 2026 <span className="text-slate-400">OLEACONTROLS</span> · Ingeniería en Sistemas Especiales
                        </p>
                        <div className="flex items-center gap-7">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="size-4 text-blue-500" />
                                <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-600">Distribuidor Autorizado</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Zap className="size-4 text-blue-500" />
                                <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-600">Pago 100% Seguro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
