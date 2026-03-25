export default function SectionTitle({ title, subtitle }) {
    return (
        <div className='flex flex-col items-center justify-center px-4'>
            <div className="bg-blue-600 w-16 h-1.5 rounded-full mb-8 shadow-lg shadow-blue-500/20"></div>
            <h3 className='text-center text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6'>{title}</h3>
            <p className='max-w-xl text-center text-slate-500 font-medium text-lg leading-relaxed'>{subtitle}</p>
        </div>
    );
}
