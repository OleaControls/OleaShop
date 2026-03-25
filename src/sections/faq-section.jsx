import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import SectionTitle from '../components/section-title';

export default function FaqSection() {
    const [isOpen, setIsOpen] = useState(null);

    const data = [
        {
            question: '¿Qué tipo de garantía ofrecen en sus instalaciones?',
            answer: 'Ofrecemos una garantía técnica por escrito de 3 años en todas nuestras instalaciones de sistemas especiales, cubriendo tanto vicios ocultos como defectos en la ejecución del proyecto.',
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
            answer: 'Absolutamente. Diseñamos nuestros sistemas de CCTV y control de acceso cumpliendo rigurosamente con la Ley Federal de Protección de Datos Personales y estándares de ciberseguridad industrial.',
        },
        {
            question: '¿Ofrecen pólizas de mantenimiento preventivo y correctivo?',
            answer: 'Sí, contamos con programas de mantenimiento personalizados diseñados para asegurar la disponibilidad operativa continua de sus sistemas críticos y prolongar la vida útil del equipamiento.',
        },
    ];

    return (
        <section className="py-16 md:py-24 px-5 md:px-6 mb-8 md:mb-16">
            <SectionTitle
                title="Preguntas Frecuentes"
                subtitle="Respuestas sobre nuestros procesos, estándares de calidad y servicios técnicos."
            />
            <div className="mx-auto mt-10 md:mt-16 w-full max-w-2xl">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="border-b border-slate-100 bg-white mb-2 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                        <button
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
                            onClick={() => setIsOpen(isOpen === index ? null : index)}
                        >
                            <span className="font-display font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wide leading-snug">
                                {item.question}
                            </span>
                            <div className={`shrink-0 p-1.5 rounded-lg transition-colors ${isOpen === index ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {isOpen === index
                                    ? <MinusIcon className="size-3.5" />
                                    : <PlusIcon className="size-3.5" />
                                }
                            </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen === index ? 'max-h-48' : 'max-h-0'}`}>
                            <p className="px-5 pb-5 md:px-6 md:pb-6 text-sm leading-relaxed text-slate-500 font-medium">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
