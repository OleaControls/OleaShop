import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const sections = [
    {
        title: '1. Responsable del tratamiento de datos',
        content: 'OLEACONTROLS (en adelante "la Empresa"), con domicilio en Ciudad de México, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).'
    },
    {
        title: '2. Datos personales que recabamos',
        content: 'Recabamos los siguientes datos: nombre completo, dirección de correo electrónico, número de teléfono, dirección de entrega, y datos de pago procesados de forma segura a través de Stripe. No almacenamos datos de tarjetas de crédito o débito en nuestros servidores.'
    },
    {
        title: '3. Finalidades del tratamiento',
        content: 'Sus datos son utilizados para: (a) procesar y entregar sus pedidos, (b) enviar confirmaciones y actualizaciones de pedidos, (c) brindar soporte técnico, (d) mejorar nuestros servicios, y (e) cumplir con obligaciones legales.'
    },
    {
        title: '4. Transferencia de datos',
        content: 'No compartimos sus datos personales con terceros, salvo con los proveedores de servicios necesarios para la operación (procesador de pagos Stripe, servicio de correo electrónico), quienes están obligados a mantener la confidencialidad de la información.'
    },
    {
        title: '5. Cookies y tecnologías de rastreo',
        content: 'Nuestro sitio utiliza cookies esenciales para el funcionamiento del carrito de compras y la sesión de usuario. No utilizamos cookies de rastreo publicitario de terceros.'
    },
    {
        title: '6. Derechos ARCO',
        content: 'Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (Derechos ARCO). Para ejercerlos, contáctenos en soporte@oleacontrols.com con el asunto "Derechos ARCO".'
    },
    {
        title: '7. Seguridad',
        content: 'Implementamos medidas de seguridad técnicas y administrativas para proteger sus datos: cifrado HTTPS/TLS en todas las comunicaciones, contraseñas almacenadas con bcrypt, tokens de sesión httpOnly, y acceso restringido a la base de datos.'
    },
    {
        title: '8. Cambios a este aviso',
        content: 'Podemos actualizar este aviso de privacidad en cualquier momento. Notificaremos cambios significativos por correo electrónico o mediante un aviso visible en el sitio.'
    },
    {
        title: '9. Contacto',
        content: 'Para consultas sobre privacidad: soporte@oleacontrols.com · Tel. 55 7919 2845 · Horario: 10:00 am – 7:00 pm (Lun–Sáb)'
    },
];

export default function Privacidad() {
    useEffect(() => { document.title = 'Aviso de Privacidad — OLEACONTROLS'; }, []);

    return (
        <div className="min-h-screen bg-[#F6F6F4]">
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Inicio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-blue-500" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500">Aviso de Privacidad</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Legal</span>
                    <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight mt-2">Aviso de Privacidad</h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">Última actualización: Enero 2026 · Vigente para todos los usuarios de oleacontrols.com</p>
                </div>

                <div className="space-y-6">
                    {sections.map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                            <h2 className="font-display text-base font-bold text-slate-900 mb-3">{s.title}</h2>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">{s.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                    <ShieldCheck className="size-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-display text-sm font-bold text-blue-900">Tu privacidad es importante para nosotros</p>
                        <p className="text-blue-700 text-sm font-medium mt-1">Para cualquier pregunta sobre el manejo de tus datos, no dudes en contactarnos.</p>
                        <Link to="/contacto" className="inline-flex items-center gap-1.5 mt-3 font-display text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                            Ir a contacto →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
