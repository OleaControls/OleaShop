export default function SectionTitle({ title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center px-6">
            <div className="bg-blue-600 w-10 h-1 rounded-full mb-5 md:mb-8 shadow-lg shadow-blue-500/20" />
            <h3 className="font-display text-center text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 md:mb-6">
                {title}
            </h3>
            <p className="max-w-xl text-center text-slate-500 font-medium text-base md:text-lg leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}
