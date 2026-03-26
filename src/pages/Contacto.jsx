import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, Headphones } from 'lucide-react';

const contactInfo = [
    {
        icon: MapPin,
        title: 'Dirección',
        lines: ['Ciudad de México, MX', 'Centro de Distribución'],
    },
    {
        icon: Phone,
        title: 'Teléfono',
        lines: ['55 7919 2845', 'Lun–Vie 10:00–19:00'],
    },
    {
        icon: Mail,
        title: 'Correo',
        lines: ['soporte@oleacontrols.com', 'ventas@oleacontrols.com'],
    },
    {
        icon: Clock,
        title: 'Horario',
        lines: ['Lunes a Viernes', '10:00 am – 7:00 pm'],
    },
];

const reasons = [
    { value: 'cotizacion',   label: 'Solicitar cotización' },
    { value: 'soporte',      label: 'Soporte técnico' },
    { value: 'instalacion',  label: 'Agendar instalación' },
    { value: 'informacion',  label: 'Información de producto' },
    { value: 'otro',         label: 'Otro' },
];

export default function Contacto() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())    e.name    = 'El nombre es requerido.';
        if (!form.email.includes('@')) e.email = 'Ingresa un correo válido.';
        if (!form.message.trim()) e.message = 'Escribe tu mensaje.';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1000);
    };

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

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
                    <span className="font-display text-[10px] font-semibold text-blue-400 uppercase tracking-[0.3em] mb-5 block">
                        Estamos para ayudarte
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-5">
                        Contáctanos.
                    </h1>
                    <p className="text-slate-400 text-base font-medium max-w-lg mx-auto leading-relaxed">
                        Respuesta en menos de 24 horas. Nuestro equipo técnico está listo para asesorarte sin costo.
                    </p>
                </div>
            </div>

            {/* ── CONTACT CARDS ────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 mb-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactInfo.map((c, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <c.icon className="size-4.5 text-blue-600" />
                            </div>
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{c.title}</p>
                            {c.lines.map((line, j) => (
                                <p key={j} className={`font-medium ${j === 0 ? 'text-slate-900 text-sm' : 'text-slate-400 text-xs'}`}>{line}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FORM + SIDEBAR ───────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Sidebar info */}
                    <div className="space-y-5">
                        {/* Why contact */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                            <h3 className="font-display text-base font-bold text-slate-900 mb-5 tracking-tight">¿Por qué contactarnos?</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: MessageSquare, text: 'Cotizaciones personalizadas sin costo' },
                                    { icon: Headphones,    text: 'Soporte técnico especializado' },
                                    { icon: CheckCircle,   text: 'Asesoría de instalación incluida' },
                                    { icon: Send,          text: 'Respuesta en menos de 24 horas' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="size-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                            <item.icon className="size-3.5 text-blue-600" />
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium leading-snug">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Emergency */}
                        <div className="bg-[#0c1526] rounded-2xl p-7 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                            <p className="font-display text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-3">Soporte urgente</p>
                            <p className="font-display text-xl font-bold text-white mb-1 tracking-tight">+52 (55) 1234 5678</p>
                            <p className="text-slate-500 text-xs font-medium">Lunes a Viernes · 9am–6pm</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            {sent ? (
                                /* Success state */
                                <div className="py-16 text-center">
                                    <div className="size-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                        <CheckCircle className="size-9 text-emerald-500" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 tracking-tight">¡Mensaje enviado!</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-8">
                                        Recibimos tu mensaje. Nos pondremos en contacto contigo en menos de 24 horas.
                                    </p>
                                    <button
                                        onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', reason:'', message:'' }); }}
                                        className="font-display text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:text-blue-800 transition-colors"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-display text-xl font-bold text-slate-900 mb-6 tracking-tight">Envíanos un mensaje</h2>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name + Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Nombre *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Tu nombre completo"
                                                    className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white focus:border-blue-500 transition-all ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                                                />
                                                {errors.name && <p className="text-red-500 text-[11px] font-semibold mt-1.5">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Correo *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="tu@correo.com"
                                                    className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white focus:border-blue-500 transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                                                />
                                                {errors.email && <p className="text-red-500 text-[11px] font-semibold mt-1.5">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {/* Phone + Reason */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="+52 55 0000 0000"
                                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Motivo</label>
                                                <select
                                                    name="reason"
                                                    value={form.reason}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Selecciona una opción</option>
                                                    {reasons.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Mensaje *</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Cuéntanos en qué podemos ayudarte. ¿Qué producto te interesa? ¿Cuál es tu proyecto?"
                                                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white focus:border-blue-500 transition-all resize-none leading-relaxed ${errors.message ? 'border-red-300' : 'border-slate-200'}`}
                                            />
                                            {errors.message && <p className="text-red-500 text-[11px] font-semibold mt-1.5">{errors.message}</p>}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="font-display w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group"
                                        >
                                            {loading ? (
                                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="size-4" />
                                                    Enviar mensaje
                                                </>
                                            )}
                                        </button>

                                        <p className="text-slate-400 text-[11px] text-center font-medium">
                                            Al enviar aceptas que te contactemos por los medios proporcionados.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
