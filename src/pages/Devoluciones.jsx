import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock, Phone } from 'lucide-react';

export default function Devoluciones() {
    useEffect(() => { document.title = 'Política de Devoluciones — OLEACONTROLS'; }, []);

    return (
        <div className="min-h-screen bg-[#F6F6F4]">
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Inicio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <RefreshCw className="size-4 text-blue-500" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500">Devoluciones</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <div>
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Legal</span>
                    <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight mt-2">Política de Devoluciones</h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">Queremos que estés 100% satisfecho con tu compra.</p>
                </div>

                {/* Quick summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: Clock,        color: 'blue',    title: '30 días',       desc: 'Para solicitar devolución desde la recepción' },
                        { icon: CheckCircle2, color: 'emerald', title: 'Reembolso',     desc: 'Total si el producto tiene defecto de fábrica' },
                        { icon: Phone,        color: 'violet',  title: 'Soporte',       desc: 'Atención personalizada en cada caso' },
                    ].map((c, i) => {
                        const colors = {
                            blue:    'bg-blue-50 text-blue-600 border-blue-100',
                            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            violet:  'bg-violet-50 text-violet-600 border-violet-100',
                        };
                        return (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center">
                                <div className={`size-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${colors[c.color]}`}>
                                    <c.icon className="size-5" />
                                </div>
                                <p className="font-display text-lg font-bold text-slate-900">{c.title}</p>
                                <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">{c.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Accept / not accept */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="size-5 text-emerald-500" />
                            <h2 className="font-display text-base font-bold text-slate-900">Aceptamos devoluciones cuando:</h2>
                        </div>
                        <ul className="space-y-2">
                            {[
                                'El producto llegó dañado o con defecto de fabricación',
                                'El producto no funciona al sacarlo de la caja',
                                'Recibiste un producto diferente al que pediste',
                                'El producto presenta falla dentro de los 30 días',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle className="size-5 text-red-400" />
                            <h2 className="font-display text-base font-bold text-slate-900">No aceptamos devoluciones cuando:</h2>
                        </div>
                        <ul className="space-y-2">
                            {[
                                'Han pasado más de 30 días desde la recepción',
                                'El producto fue dañado por mal uso',
                                'Presenta modificaciones no autorizadas',
                                'Le faltan sellos, accesorios o empaque original',
                                'El daño fue causado por instalación incorrecta ajena a OLEACONTROLS',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Process */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-display text-base font-bold text-slate-900 mb-5">¿Cómo solicitar una devolución?</h2>
                    <div className="space-y-4">
                        {[
                            { step: '1', title: 'Contáctanos', desc: 'Escribe a soporte@oleacontrols.com o llama al 55 7919 2845 con tu número de pedido y descripción del problema.' },
                            { step: '2', title: 'Evaluamos tu caso', desc: 'En máximo 24 horas hábiles te contactaremos para evaluar el caso y darte una solución.' },
                            { step: '3', title: 'Envío del producto', desc: 'Si aplica, te indicaremos cómo enviarnos el producto. OLEACONTROLS cubre el costo del envío en casos de defecto de fábrica.' },
                            { step: '4', title: 'Reembolso o reposición', desc: 'Una vez recibido el producto, procesamos el reembolso en 3–5 días hábiles o enviamos el reemplazo de inmediato.' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="size-8 bg-blue-600 rounded-xl flex items-center justify-center font-display font-black text-white text-sm shrink-0">{s.step}</div>
                                <div>
                                    <p className="font-display text-sm font-bold text-slate-900">{s.title}</p>
                                    <p className="text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4">
                    <Phone className="size-5 text-blue-600 shrink-0" />
                    <div>
                        <p className="font-display text-sm font-bold text-blue-900">¿Necesitas ayuda?</p>
                        <p className="text-blue-700 text-sm font-medium">Llámanos al <strong>55 7919 2845</strong> o escríbenos a <strong>soporte@oleacontrols.com</strong></p>
                        <p className="text-blue-500 text-xs font-medium mt-0.5">Lunes a Sábado · 10:00 am – 7:00 pm</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
