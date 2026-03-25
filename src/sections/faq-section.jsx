import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import SectionTitle from '../components/section-title';

export default function FaqSection() {
    const [isOpen, setIsOpen] = useState(false);
    const data = [
        {
            question: '¿Qué tipo de garantía ofrecen en sus instalaciones?',
            answer: "Ofrecemos una garantía técnica por escrito de 3 años en todas nuestras instalaciones de sistemas especiales, cubriendo tanto vicios ocultos como defectos en la ejecución del proyecto.",
        },
        {
            question: '¿Cuentan con certificaciones para sistemas de detección de incendio?',
            answer: 'Sí, nuestro personal de ingeniería está certificado bajo estándares internacionales y normativas locales para el diseño, instalación y mantenimiento de sistemas inteligentes de detección de incendio.',
        },
        {
            question: '¿Pueden integrar sistemas de diferentes marcas en una sola plataforma BMS?',
            answer: 'Efectivamente. Somos especialistas en integración mediante protocolos abiertos como BACnet, Modbus y KNX, permitiendo que equipos de distintos fabricantes converjan en una gestión centralizada.',
        },
        {
            question: '¿Realizan levantamientos técnicos en sitio antes de cotizar?',
            answer: 'Para garantizar la precisión de nuestras propuestas, realizamos levantamientos técnicos exhaustivos y análisis de sitio, asegurando que la solución propuesta sea la óptima para su infraestructura.',
        },
        {
            question: '¿Sus soluciones de videovigilancia cumplen con normativas de protección de datos?',
            answer: "Absolutamente. Diseñamos nuestros sistemas de CCTV y control de acceso cumpliendo rigurosamente con la Ley Federal de Protección de Datos Personales y estándares de ciberseguridad industrial.",
        },
        {
            question: '¿Ofrecen pólizas de mantenimiento preventivo y correctivo?',
            answer: 'Sí, contamos con programas de mantenimiento personalizados diseñados para asegurar la disponibilidad operativa continua de sus sistemas críticos y prolongar la vida útil del equipamiento.',
        },
    ];

    return (
        <section className='flex flex-col items-center justify-center mt-40 mb-20'>
            <SectionTitle title="Preguntas Frecuentes" subtitle="Encuentre respuestas detalladas sobre nuestros procesos de ingeniería, estándares de calidad y servicios técnicos." />
            <div className='mx-auto mt-16 w-full max-w-2xl px-4'>
                {data.map((item, index) => (
                    <div key={index} className='flex flex-col border-b border-slate-100 bg-white mb-2 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md'>
                        <h3 className='flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-black text-slate-800 text-sm uppercase tracking-wide' onClick={() => setIsOpen(isOpen === index ? null : index)}>
                            {item.question}
                            <div className={`p-1 rounded-lg transition-colors ${isOpen === index ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {isOpen === index ? <MinusIcon className='size-4' /> : <PlusIcon className='size-4' />}
                            </div>
                        </h3>
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen === index ? 'max-h-40' : 'max-h-0'}`}>
                            <p className='px-6 pb-6 text-sm leading-relaxed text-slate-500 font-medium'>{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}