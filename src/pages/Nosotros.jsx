import { FlaskConical, PiggyBank, TrendingUp, BookOpen, Gift, BadgePercent, ShieldCheck, GraduationCap, CalendarCheck, HardHat, HeartHandshake, Handshake, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const motivos = [
    {
        icon: FlaskConical,
        title: 'Ciencia e Ingeniería',
        desc: 'Somos los únicos en aplicar cálculos y métodos científicos para entregar soluciones.'
    },
    {
        icon: PiggyBank,
        title: 'Cuidamos tu Capital',
        desc: 'Al invertir en tu nuevo sistema nos encargamos de proteger cada peso balanceando el riesgo en equipos, simplicidad de uso y nivel de sofisticación.'
    },
    {
        icon: TrendingUp,
        title: 'Maximizamos tu Inversión',
        desc: 'Damos la asesoría para optimizar tiempos, mejorando costos de m.o. y mejorando equipos.'
    },
    {
        icon: BookOpen,
        title: 'Consultoría Experimentada',
        desc: 'Conocimiento y acciones específicas respaldadas por Normatividades, Estándares y Buenas Prácticas en la industria.'
    },
    {
        icon: Gift,
        title: 'Regalo en cada Proyecto',
        desc: 'Como forma de agradecimiento a su confianza y optimizando nuestros servicios, nos permite regalarle desde equipos extra, hasta pólizas de mantenimiento.'
    },
    {
        icon: BadgePercent,
        title: 'Reducimos Costos',
        desc: 'Muéstrenos el presupuesto y planos de terceros y nosotros balancearemos calidad y costos, logrando reducir hasta en un 25%.'
    },
    {
        icon: ShieldCheck,
        title: 'Tres Años de Garantía',
        desc: 'Confiamos tanto en nuestros métodos que nos permite otorgarle carta garantía por escrito en calidad de la instalación, hasta por 3 años.'
    },
    {
        icon: GraduationCap,
        title: 'Entrenamiento y Liderazgo',
        desc: 'Cada semana, todo nuestro personal asiste a entrenamientos, adiestramientos y seminarios sobre temas de desarrollo personal y profesional.'
    },
    {
        icon: CalendarCheck,
        title: 'Dos Reuniones al Mes',
        desc: 'Dos veces al mes, por 30 minutos, nos reunimos con ustedes para saber sus comentarios, críticas y áreas de mejora.'
    },
    {
        icon: HardHat,
        title: 'Nicho de la Construcción',
        desc: 'Atendemos exclusivamente a despachos de arquitectos, constructoras, desarrolladoras, inmobiliarias y administraciones de inmuebles; esto nos permite ser su especialista.'
    },
    {
        icon: HeartHandshake,
        title: 'Atención Post-Proyecto',
        desc: 'Nos hacemos cargo de atender a sus usuarios finales, u ocupantes, en garantías, capacitaciones y dudas.'
    },
    {
        icon: Handshake,
        title: 'Dispuestos a Negociar',
        desc: 'Puede con nosotros llegar a acuerdos sobre el costo, el tiempo y calidad del proyecto, y estará enterado de cómo avanza en cada una de estas 3 áreas.'
    },
];


const brands = [
    { name: 'Epcom',     src: '/IMG PARA PAGINA SHOP/IM2/epcom logo.png' },
    { name: 'Hikvision', src: '/IMG PARA PAGINA SHOP/IM2/hikvision.svg' },
    { name: 'TP-Link',   src: '/IMG PARA PAGINA SHOP/IM2/TPLINK_Logo_2.svg.png' },
];

export default function Nosotros() {
    useEffect(() => { document.title = 'Nosotros — OLEACONTROLS'; }, []);
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
                        OLEACONTROLS, empresa especializada en el Proyecto, Diseño, Instalación y Mantenimiento de sistemas e instalaciones especiales, áreas: Residencial, Comercial y Corporativa.
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


            {/* ── MISIÓN & VISIÓN ───────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Misión */}
                    <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
                        <span className="font-display text-[10px] font-semibold text-blue-600 uppercase tracking-[0.3em] mb-4 block">Nuestra Misión</span>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
                            Modernizar y proteger hogares y empresas.
                        </h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed">
                            Ayudamos a hogares laborales y personales a modernizarse y protegerse, a través de la innovación con los sistemas especiales.
                        </p>
                    </div>

                    {/* Visión */}
                    <div className="bg-[#0c1526] rounded-3xl p-10 border border-white/5 shadow-sm">
                        <span className="font-display text-[10px] font-semibold text-blue-400 uppercase tracking-[0.3em] mb-4 block">Nuestra Visión</span>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-5">
                            Hacer progresar a México con tecnología instalada.
                        </h2>
                        <p className="text-slate-400 text-base font-medium leading-relaxed">
                            Haremos progresar a México con tecnología instalada, siendo la compañía conformada por colaboradores líderes, comprometidos y atrevidos.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── 12 MOTIVOS ───────────────────────────────────────────── */}
            <div className="bg-white py-20 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="font-display text-[10px] font-semibold text-blue-600 uppercase tracking-[0.3em] mb-4 block">12 razones para elegirnos</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Por qué OLEACONTROLS.</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {motivos.map((m, i) => (
                            <div key={i} className="group bg-[#F6F6F4] rounded-2xl p-7 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="size-11 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                                        <m.icon className="size-5 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="font-display text-[10px] font-bold text-slate-300 uppercase tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <h3 className="font-display text-base font-bold text-slate-900 mb-2 tracking-tight">{m.title}</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">{m.desc}</p>
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
