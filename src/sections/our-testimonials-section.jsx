import SectionTitle from '../components/section-title';
import { StarIcon } from 'lucide-react';

export default function OurTestimonialSection() {
    const data = [
        {
            review: 'La integración del sistema BMS en nuestro corporativo fue impecable. La eficiencia energética mejoró un 25% en el primer trimestre. Un servicio de ingeniería de primer nivel.',
            name: 'Ing. Ricardo Nelson',
            about: 'Director de Proyectos, Infraestructura Global',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
        },
        {
            review: 'OLEACONTROLS demostró un dominio técnico excepcional en la instalación de los sistemas de detección de incendio y control de acceso para nuestra nueva torre residencial.',
            name: 'Arq. Sofía Martínez',
            about: 'Socia Fundadora, Studio Urbano',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        },
        {
            review: 'Su metodología de trabajo y cumplimiento de normativas internacionales nos dio la confianza necesaria para delegarles la infraestructura crítica de datos de nuestra planta.',
            name: 'Ing. Ethan Roberts',
            about: 'Gerente de Planta, TechLogistics MX',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
        },
        {
            review: 'Excelente soporte post-venta. La póliza de mantenimiento preventivo ha garantizado la continuidad operativa de nuestros sistemas de seguridad sin interrupciones.',
            name: 'Isabella Kim',
            about: 'Directora de Operaciones, Retail Group',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
        },
        {
            review: "La solución de carga para vehículos eléctricos que implementaron en nuestra cadena de hoteles funciona perfectamente y la telemetría es sumamente precisa.",
            name: 'Liam Johnson',
            about: 'Director de Sustentabilidad, Grand Hospitality',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
        },
        {
            review: 'Profesionales altamente capacitados. Superaron nuestras expectativas en el diseño de la red WiFi 6 de alta densidad para nuestro centro de convenciones.',
            name: 'Ava Patel',
            about: 'CEO, Eventos Smart S.A.',
            rating: 5,
            image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
        },
    ];

    return (
        <section className='flex flex-col items-center justify-center mt-40'>
            <SectionTitle title='Casos de Éxito' subtitle='La confianza de nuestros clientes corporativos respalda la calidad de nuestras soluciones de ingeniería avanzada.' />

            <div className='mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl px-4'>
                {data.map((item, index) => (
                    <div key={index} className='w-full max-w-sm space-y-6 rounded-[2rem] border border-slate-100 bg-white p-8 text-slate-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 shadow-sm'>
                        <div className='flex gap-1.5'>
                            {...Array(item.rating)
                                .fill('')
                                .map((_, index) => <StarIcon key={index} className='size-4 fill-blue-600 text-blue-600' />)}
                        </div>
                        <p className='text-slate-600 font-medium leading-relaxed italic'>“{item.review}”</p>
                        <div className='flex items-center gap-4 pt-4 border-t border-slate-50'>
                            <img className='size-12 rounded-2xl object-cover shadow-md' src={item.image} alt={item.name} />
                            <div>
                                <p className='font-black text-slate-900 text-sm'>{item.name}</p>
                                <p className='text-slate-400 text-[10px] font-bold uppercase tracking-widest'>{item.about}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}