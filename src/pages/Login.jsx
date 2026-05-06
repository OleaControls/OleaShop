import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();
    const from      = location.state?.from || '/';

    const [form, setForm]               = useState({ email: '', password: '' });
    const [showPassword, setShowPwd]    = useState(false);
    const [error, setError]             = useState('');
    const [loading, setLoading]         = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Correo o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <img
                            src="/logos/LogoOleaHomeControls.png"
                            alt="OLEACONTROLS"
                            className="h-40 w-auto object-contain mx-auto mb-6 opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Bienvenido de vuelta</h1>
                    <p className="text-slate-500 text-sm font-medium mt-2">Inicia sesión en tu cuenta</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.07)] p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="tu@correo.com"
                                    autoComplete="email"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:border-blue-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:border-blue-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="font-display w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group mt-2"
                        >
                            {loading ? (
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-2">
                        <Link to="/forgot-password" className="font-display text-[10px] font-semibold uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-300">o</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            Regístrate gratis
                        </Link>
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
                    <ShieldCheck className="size-4 text-blue-400" />
                    <span className="font-display text-[9px] font-semibold uppercase tracking-widest">Conexión segura y encriptada</span>
                </div>
            </div>
        </div>
    );
}
