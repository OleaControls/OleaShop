import { LinkedinIcon, TwitterIcon, YoutubeIcon, ShieldCheck, MapPin, Phone, Mail, Instagram } from "lucide-react";
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
        <footer className="bg-[#0a0a0b] text-slate-400 pt-24 pb-12 px-8 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    
                    {/* Brand Info */}
                    <div className="col-span-1">
                        <Link to='/' className="flex items-center mb-8">
                            <img 
                                src="/IMG PARA PAGINA SHOP/logo.png" 
                                alt="OLEACONTROLS" 
                                className="h-6 w-auto object-contain brightness-0 invert" 
                            />
                        </Link>
                        <p className="text-[13px] leading-relaxed mb-8 font-medium">
                            Expertos en integración de sistemas de seguridad y automatización residencial de alto nivel. Tecnología SmartHome powered by epcom.
                        </p>
                        <div className="flex items-center gap-5">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Instagram className="size-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><LinkedinIcon className="size-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><TwitterIcon className="size-5" /></a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link to={link.href} className="text-sm hover:text-white transition-all duration-300 font-medium">{link.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">Soporte Técnico</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="bg-white/5 p-2 rounded-lg">
                                    <MapPin className="size-4 text-blue-500" />
                                </div>
                                <span className="text-sm font-medium">Ciudad de México, MX<br /><span className="text-[11px] text-slate-500">Centro de Distribución</span></span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="bg-white/5 p-2 rounded-lg">
                                    <Phone className="size-4 text-blue-500" />
                                </div>
                                <span className="text-sm font-medium">+52 (55) 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="bg-white/5 p-2 rounded-lg">
                                    <Mail className="size-4 text-blue-500" />
                                </div>
                                <span className="text-sm font-medium">soporte@oleacontrols.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                        © 2026 <span className="text-white">OLEACONTROLS</span>. Ingeniería en Sistemas Especiales.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-5 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Distribuidor Autorizado</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-5 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pago 100% Seguro</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
