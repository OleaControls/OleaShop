import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

const ADMIN_CREDENTIALS = { user: 'admin', password: 'olea2026' };

export default function AdminLogin() {
    const [form, setForm]       = useState({ user: '', password: '' });
    const [showPw, setShowPw]   = useState(false);
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            if (form.user === ADMIN_CREDENTIALS.user && form.password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('olea-admin', '1');
                navigate('/admin');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
            setLoading(false);
        }, 900);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-14 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30 mb-4">
                        <Shield className="size-7 text-white" />
                    </div>
                    <h1 className="font-display text-xl font-bold text-white tracking-tight">Panel de Administración</h1>
                    <p className="text-slate-500 text-xs font-medium mt-1">Olea Controls · Acceso restringido</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 space-y-4">

                    <div>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Usuario</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                            <input
                                type="text"
                                value={form.user}
                                onChange={e => setForm(p => ({ ...p, user: e.target.value }))}
                                placeholder="admin"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-display text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-display text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="font-display text-[9px] font-bold uppercase tracking-wider text-red-400 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !form.user || !form.password}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:cursor-not-allowed text-white disabled:text-slate-600 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                        ) : (
                            <><Lock className="size-3.5" /> Ingresar al panel</>
                        )}
                    </button>
                </form>

                <p className="text-center font-display text-[9px] font-semibold uppercase tracking-widest text-slate-700 mt-6">
                    Olea Controls © 2026 · Todos los derechos reservados
                </p>
            </div>
        </div>
    );
}
