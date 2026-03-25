import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Banner() {
    return (
        <div className="flex w-full flex-wrap items-center justify-center bg-slate-900 py-3 px-4 text-center text-[10px] md:text-xs font-bold text-white border-b border-white/5">
            <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-blue-400" />
                <p className="tracking-[0.15em] uppercase">Garantía por Escrito de 3 Años en Instalaciones de Sistemas Especiales</p>
            </div>
            <Link to="/shop" className="ml-4 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors group">
                Solicitar Consultoría Técnica
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
