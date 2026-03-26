import { StarIcon, Quote } from 'lucide-react';

const data = [
    {
        review: 'La integración del sistema BMS en nuestro corporativo fue impecable. La eficiencia energética mejoró un 25% en el primer trimestre.',
        name: 'Ing. Ricardo Nelson',
        about: 'Director de Proyectos',
        company: 'Infraestructura Global',
        rating: 5,
        tag: 'Automatización BMS',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    },
    {
        review: 'OLEACONTROLS demostró un dominio técnico excepcional en la instalación de sistemas de detección de incendio y control de acceso.',
        name: 'Arq. Sofía Martínez',
        about: 'Socia Fundadora',
        company: 'Studio Urbano',
        rating: 5,
        tag: 'Detección de Incendio',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    },
    {
        review: 'Su metodología y cumplimiento de normativas internacionales nos dio la confianza para delegarles la infraestructura crítica de nuestra planta.',
        name: 'Ing. Ethan Roberts',
        about: 'Gerente de Planta',
        company: 'TechLogistics MX',
        rating: 5,
        tag: 'Infraestructura Crítica',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'Excelente soporte post-venta. La póliza de mantenimiento preventivo garantizó la continuidad operativa sin ninguna interrupción.',
        name: 'Isabella Kim',
        about: 'Directora de Operaciones',
        company: 'Retail Group',
        rating: 5,
        tag: 'Mantenimiento Preventivo',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'La solución de carga para vehículos eléctricos que implementaron en nuestra cadena de hoteles funciona perfectamente.',
        name: 'Liam Johnson',
        about: 'Director de Sustentabilidad',
        company: 'Grand Hospitality',
        rating: 5,
        tag: 'Carga Vehicular EV',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
        review: 'Profesionales altamente capacitados. Superaron nuestras expectativas en el diseño de la red WiFi 6 para nuestro centro de convenciones.',
        name: 'Ava Patel',
        about: 'CEO',
        company: 'Eventos Smart S.A.',
        rating: 5,
        tag: 'Redes WiFi 6',
        image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
    },
];

export default function OurTestimonialSection() {
    return (
        <section className="py-20 md:py-28 px-5 md:px-6 bg-[#F6F6F4]">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="font-display text-[10px] font-bold text-blue-600 uppercase tracking-[0.35em] mb-3 block">
                        Casos de Éxito
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                        La confianza de quienes<br className="hidden md:block" />
                        <span className="text-blue-600"> ya nos eligieron.</span>
                    </h2>
                </div>
                <p className="text-slate-500 font-medium text-sm max-w-xs leading-relaxed md:text-right">
                    Clientes corporativos que respaldan la calidad de nuestras soluciones.
                </p>
            </div>

            {/* Cards grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="group relative bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-400 flex flex-col"
                    >
                        {/* Top row: tag + quote icon */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                {item.tag}
                            </span>
                            <Quote className="size-6 text-slate-100 group-hover:text-blue-100 transition-colors" />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-4">
                            {Array(item.rating).fill('').map((_, i) => (
                                <StarIcon key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        {/* Review */}
                        <p className="text-slate-600 font-medium leading-relaxed text-sm flex-1 mb-7">
                            "{item.review}"
                        </p>

                    </div>
                ))}
            </div>
        </section>
    );
}
