import { Shield, Zap, Award, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
    {
        icon: Shield,
        title: 'Seguridad Primero',
        desc: 'Cada producto que distribuimos ha sido evaluado bajo estándares técnicos exigentes. No vendemos tecnología — vendemos tranquilidad.'
    },
    {
        icon: Zap,
        title: 'Instalación Express',
        desc: 'Nuestro equipo de ingenieros certificados garantiza instalaciones eficientes, limpias y operativas desde el primer día.'
    },
    {
        icon: Award,
        title: 'Certificación NOM-ICE',
        desc: 'Distribuidores autorizados de Epcom, Hikvision y TP-Link. Productos con respaldo de fábrica y garantía por escrito.'
    },
    {
        icon: Users,
        title: 'Soporte Continuo',
        desc: 'No desaparecemos después de la venta. Brindamos soporte técnico remoto y presencial durante toda la vida del equipo.'
    },
];

const stats = [
    { value: '500+', label: 'Proyectos completados' },
    { value: '8',    label: 'Años de experiencia' },
    { value: '3',    label: 'Marcas certificadas' },
    { value: '98%',  label: 'Clientes satisfechos' },
];

const brands = [
    { name: 'Epcom',     src: '/IMG PARA PAGINA SHOP/IM2/epcom logo.png' },
    { name: 'Hikvision', src: '/IMG PARA PAGINA SHOP/IM2/hikvision.svg' },
    { name: 'TP-Link',   src: '/IMG PARA PAGINA SHOP/IM2/TPLINK_Logo_2.svg.png' },
];

export default function Nosotros() {
    return (
        <div className="min-h-screen bg-[#F6F6F4]">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="relative bg-[#0c1526] overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px'
                    }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
                    <span className="font-display text-[10px] font-semibold text-blue-400 uppercase tracking-[0.3em] mb-5 block">
                        Quiénes somos
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        Tecnología que<br />
                        <span className="text-blue-400">protege lo que más importa.</span>
                    </h1>
                    <p className="text-slate-400 text-base font-medium max-w-xl mx-auto leading-relaxed mb-10">
                        Somos OLEACONTROLS, integradores especializados en sistemas de seguridad y automatización residencial en México. Desde 2016 transformando hogares y empresas con tecnología de primer nivel.
                    </p>
                    <Link
                        to="/shop"
                        className="font-display inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 group"
                    >
                        Ver nuestros productos
                        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* ── STATS ────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{s.value}</p>
                            <p className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MISSION ──────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    {/* Text */}
                    <div>
                        <span className="font-display text-[10px] font-semibold text-blue-600 uppercase tracking-[0.3em] mb-4 block">Nuestra misión</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                            Hacemos que la seguridad avanzada sea accesible para todos.
                        </h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed mb-6">
                            En OLEACONTROLS creemos que cada familia y cada negocio merece acceso a tecnología de seguridad de clase mundial. Por eso trabajamos directamente con las marcas líderes para ofrecer productos auténticos a precios justos, respaldados por ingenieros certificados.
                        </p>
                        <p className="text-slate-500 text-base font-medium leading-relaxed mb-8">
                            No somos solo una tienda — somos tu aliado tecnológico. Desde el asesoramiento inicial hasta el soporte post-instalación, estamos contigo en cada paso.
                        </p>
                        <div className="space-y-3">
                            {[
                                'Distribuidor autorizado en México',
                                'Ingenieros certificados por fabricante',
                                'Garantía de fábrica en todos los productos',
                                'Soporte técnico remoto y presencial',
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="size-4.5 text-blue-600 shrink-0" />
                                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image card */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden bg-[#0c1526] aspect-[4/3] shadow-2xl">
                            <img
                                src="/IMG PARA PAGINA SHOP/SmartHome.jpg"
                                alt="OLEACONTROLS en acción"
                                className="w-full h-full object-cover opacity-70"
                            />
                            {/* Overlay badge */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                                    <div className="flex items-center gap-3 mb-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                                        <span className="font-display text-[10px] font-bold text-white uppercase tracking-widest">4.9 / 5.0</span>
                                    </div>
                                    <p className="text-white text-sm font-medium leading-snug">
                                        "El mejor servicio de instalación que hemos contratado. Profesionales y puntuales."
                                    </p>
                                    <p className="font-display text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-2">— Cliente CDMX</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -top-5 -right-5 bg-blue-600 text-white rounded-2xl p-4 shadow-xl shadow-blue-600/30">
                            <p className="font-display text-3xl font-bold leading-none">8+</p>
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-blue-200 mt-0.5">Años</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── VALUES ───────────────────────────────────────────────── */}
            <div className="bg-white py-20 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="font-display text-[10px] font-semibold text-blue-600 uppercase tracking-[0.3em] mb-4 block">Nuestros valores</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Por qué elegir OLEACONTROLS.</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="group bg-[#F6F6F4] rounded-2xl p-7 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="size-11 bg-blue-600/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                                    <v.icon className="size-5 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-display text-base font-bold text-slate-900 mb-3 tracking-tight">{v.title}</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BRANDS ───────────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                <span className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-[0.3em] mb-4 block">Marcas con las que trabajamos</span>
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight mb-12">Distribuidores autorizados.</h2>
                <div className="flex items-center justify-center gap-16 flex-wrap">
                    {brands.map((b, i) => (
                        <img
                            key={i}
                            src={b.src}
                            alt={b.name}
                            className="h-10 w-auto object-contain grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500"
                        />
                    ))}
                </div>
            </div>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <div className="bg-[#0c1526] py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        ¿Listo para proteger tu hogar?
                    </h2>
                    <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                        Explora nuestro catálogo o contáctanos para una asesoría técnica gratuita sin compromiso.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/shop"
                            className="font-display flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 group w-full sm:w-auto justify-center"
                        >
                            Ver Catálogo
                            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/contacto"
                            className="font-display flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all w-full sm:w-auto justify-center"
                        >
                            Contactar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
