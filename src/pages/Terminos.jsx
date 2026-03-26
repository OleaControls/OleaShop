import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const sections = [
    {
        title: '1. Aceptación de términos',
        content: 'Al realizar una compra en OLEACONTROLS, aceptas estos términos y condiciones de venta. Si no estás de acuerdo, te pedimos no completar tu pedido.'
    },
    {
        title: '2. Productos y disponibilidad',
        content: 'Todos los productos listados están sujetos a disponibilidad de stock. Nos reservamos el derecho de cancelar un pedido si el producto no está disponible, realizando el reembolso completo correspondiente.'
    },
    {
        title: '3. Precios',
        content: 'Los precios están expresados en Pesos Mexicanos (MXN) e incluyen IVA. Los precios pueden cambiar sin previo aviso. El precio aplicable es el vigente al momento de confirmar el pedido.'
    },
    {
        title: '4. Formas de pago',
        content: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, Mastercard, American Express) procesados de forma segura a través de Stripe. El cargo se realiza al confirmar el pedido.'
    },
    {
        title: '5. Envíos',
        content: 'Realizamos envíos a toda la República Mexicana. El tiempo de entrega estimado es de 24 a 48 horas hábiles. El envío es gratuito en todos los pedidos. Una vez enviado el pedido, recibirás un número de seguimiento.'
    },
    {
        title: '6. Garantía',
        content: 'Todos los equipos cuentan con garantía de fábrica de 3 años contra defectos de fabricación. La garantía no cubre daños por mal uso, accidentes, modificaciones no autorizadas o desgaste natural.'
    },
    {
        title: '7. Devoluciones y cancelaciones',
        content: 'Consulta nuestra Política de Devoluciones para conocer los plazos y condiciones. En general, aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto, siempre que esté en condiciones originales.'
    },
    {
        title: '8. Instalación',
        content: 'Los servicios de instalación son prestados por técnicos certificados de OLEACONTROLS. Los precios de instalación se cotizarán por separado según el alcance del proyecto.'
    },
    {
        title: '9. Limitación de responsabilidad',
        content: 'OLEACONTROLS no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de nuestros productos. Nuestra responsabilidad máxima se limita al valor del producto adquirido.'
    },
    {
        title: '10. Ley aplicable',
        content: 'Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se resolverá ante los tribunales competentes de la Ciudad de México.'
    },
];

export default function Terminos() {
    useEffect(() => { document.title = 'Términos y Condiciones — OLEACONTROLS'; }, []);

    return (
        <div className="min-h-screen bg-[#F6F6F4]">
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest">Inicio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileText className="size-4 text-blue-500" />
                        <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500">Términos y Condiciones</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Legal</span>
                    <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight mt-2">Términos y Condiciones</h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">Última actualización: Enero 2026</p>
                </div>

                <div className="space-y-6">
                    {sections.map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                            <h2 className="font-display text-base font-bold text-slate-900 mb-3">{s.title}</h2>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">{s.content}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
