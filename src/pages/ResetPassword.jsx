import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ResetPassword() {
    const [params]          = useSearchParams();
    const navigate          = useNavigate();
    const token             = params.get('token') || '';
    const [form, setForm]   = useState({ password: '', confirm: '' });
    const [show, setShow]   = useState({ password: false, confirm: false });
    const [done, setDone]   = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValid = form.password.length >= 8 &&
                    /[A-Z]/.test(form.password) &&
                    /[0-9]/.test(form.password) &&
                    form.password === form.confirm;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        setError('');
        try {
            await api.auth.resetPassword({ token, password: form.password });
            setDone(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'El enlace es inválido o ya expiró.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6">
            <div className="text-center">
                <p className="font-display text-slate-500 text-sm font-medium">Enlace inválido.</p>
                <Link to="/forgot-password" className="mt-4 inline-block font-display text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                    Solicitar nuevo enlace
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link to="/"><img src="/IMG PARA PAGINA SHOP/logo.png" alt="OLEACONTROLS"
                        className="h-7 w-auto object-contain mx-auto mb-6 opacity-80 hover:opacity-100 transition-opacity" /></Link>
                    <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Nueva contraseña</h1>
                    <p className="text-slate-500 text-sm font-medium mt-2">Elige una contraseña segura para tu cuenta</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.07)] p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    {done ? (
                        <div className="text-center py-4 space-y-4">
                            <div className="size-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                                <CheckCircle2 className="size-8 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="font-display text-lg font-bold text-slate-900">¡Contraseña actualizada!</h2>
                                <p className="text-slate-500 text-sm font-medium mt-2">Redirigiendo al inicio de sesión...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { id: 'password', label: 'Nueva contraseña' },
                                { id: 'confirm',  label: 'Confirmar contraseña' },
                            ].map(f => (
                                <div key={f.id}>
                                    <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">{f.label}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                        <input
                                            type={show[f.id] ? 'text' : 'password'}
                                            value={form[f.id]}
                                            onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:border-blue-500 focus:bg-white transition-all"
                                        />
                                        <button type="button" onClick={() => setShow(p => ({ ...p, [f.id]: !p[f.id] }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                                            {show[f.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    {f.id === 'confirm' && form.confirm && form.password !== form.confirm && (
                                        <p className="text-red-500 text-xs font-semibold mt-1">Las contraseñas no coinciden</p>
                                    )}
                                </div>
                            ))}

                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-500 font-medium space-y-1">
                                <p className={form.password.length >= 8 ? 'text-emerald-600' : ''}>✓ Mínimo 8 caracteres</p>
                                <p className={/[A-Z]/.test(form.password) ? 'text-emerald-600' : ''}>✓ Al menos una mayúscula</p>
                                <p className={/[0-9]/.test(form.password) ? 'text-emerald-600' : ''}>✓ Al menos un número</p>
                            </div>

                            {error && <p className="text-red-500 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

                            <button type="submit" disabled={!isValid || loading}
                                className="font-display w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg active:scale-[0.98]">
                                {loading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar nueva contraseña'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
                    <ShieldCheck className="size-4 text-blue-400" />
                    <span className="font-display text-[9px] font-semibold uppercase tracking-widest">Conexión segura y encriptada</span>
                </div>
            </div>
        </div>
    );
}
