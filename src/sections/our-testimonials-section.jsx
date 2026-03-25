import SectionTitle from '../components/section-title';
import { StarIcon } from 'lucide-react';

export default function OurTestimonialSection() {
    const data = [
        {
            review: 'La integración del sistema BMS en nuestro corporativo fue impecable. La eficiencia energética mejoró un 25% en el primer trimestre.',
            name: 'Ing. Ricardo Nelson',
            about: 'Director de Proyectos, Infraestructura Global',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
        },
        {
            review: 'OLEACONTROLS demostró un dominio técnico excepcional en la instalación de sistemas de detección de incendio y control de acceso.',
            name: 'Arq. Sofía Martínez',
            about: 'Socia Fundadora, Studio Urbano',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        },
        {
            review: 'Su metodología y cumplimiento de normativas internacionales nos dio la confianza para delegarles la infraestructura crítica de nuestra planta.',
            name: 'Ing. Ethan Roberts',
            about: 'Gerente de Planta, TechLogistics MX',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
        },
        {
            review: 'Excelente soporte post-venta. La póliza de mantenimiento preventivo garantizó la continuidad operativa sin ninguna interrupción.',
            name: 'Isabella Kim',
            about: 'Directora de Operaciones, Retail Group',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
        },
        {
            review: 'La solución de carga para vehículos eléctricos que implementaron en nuestra cadena de hoteles funciona perfectamente.',
            name: 'Liam Johnson',
            about: 'Director de Sustentabilidad, Grand Hospitality',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
        },
        {
            review: 'Profesionales altamente capacitados. Superaron nuestras expectativas en el diseño de la red WiFi 6 para nuestro centro de convenciones.',
            name: 'Ava Patel',
            about: 'CEO, Eventos Smart S.A.',
            rating: 5,
            image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
        },
    ];

    return (
        <section className="py-16 md:py-24 px-5 md:px-6">
            <SectionTitle
                title="Casos de Éxito"
                subtitle="La confianza de nuestros clientes corporativos respalda la calidad de nuestras soluciones."
            />
            <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="space-y-4 rounded-2xl md:rounded-[2rem] border border-slate-100 bg-white p-5 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 shadow-sm"
                    >
                        <div className="flex gap-1">
                            {Array(item.rating).fill('').map((_, i) => (
                                <StarIcon key={i} className="size-3.5 fill-blue-600 text-blue-600" />
                            ))}
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed italic text-sm">"{item.review}"</p>
                        <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                            <img
                                className="size-10 rounded-xl object-cover shadow-md shrink-0"
                                src={item.image}
                                alt={item.name}
                            />
                            <div className="min-w-0">
                                <p className="font-display font-bold text-slate-900 text-sm truncate">{item.name}</p>
                                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider truncate">{item.about}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
