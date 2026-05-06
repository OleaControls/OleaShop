import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate     = useNavigate();

    const [form, setForm]            = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPwd] = useState(false);
    const [errors, setErrors]        = useState({});
    const [loading, setLoading]      = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '', general: '' });
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Ingresa tu nombre completo.';
        if (!form.email.includes('@'))         e.email    = 'Ingresa un correo válido.';
        if (form.password.length < 8)          e.password = 'Mínimo 8 caracteres.';
        if (!/[A-Z]/.test(form.password))      e.password = 'Debe incluir al menos una mayúscula.';
        if (!/[0-9]/.test(form.password))      e.password = 'Debe incluir al menos un número.';
        if (form.password !== form.confirm)    e.confirm  = 'Las contraseñas no coinciden.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/');
        } catch (err) {
            setErrors({ general: err.message || 'Error al crear la cuenta' });
        } finally {
            setLoading(false);
        }
    };

    // Indicador de fortaleza de contraseña
    const pw = form.password;
    const strengthScore =
        pw.length === 0 ? 0 :
        pw.length < 8 ? 1 :
        [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length + 1;
    const strengthLabel = ['', 'Débil', 'Media', 'Buena', 'Fuerte'];
    const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'];
    const strengthText  = ['', 'text-red-400', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

    return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6 py-16">
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
                    <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Crea tu cuenta</h1>
                    <p className="text-slate-500 text-sm font-medium mt-2">Regístrate para gestionar tus pedidos</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.07)] p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Error general (ej. email duplicado) */}
                        {errors.general && (
                            <p className="text-red-500 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                {errors.general}
                            </p>
                        )}

                        {/* Name */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type="text" name="name" value={form.name} onChange={handleChange}
                                    placeholder="Tu nombre" autoComplete="name"
                                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white transition-all ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus:border-blue-500'}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="tu@correo.com" autoComplete="email"
                                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white transition-all ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus:border-blue-500'}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="Mínimo 8 caracteres" autoComplete="new-password"
                                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white transition-all ${errors.password ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus:border-blue-500'}`}
                                />
                                <button type="button" onClick={() => setShowPwd(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {/* Barra de fortaleza */}
                            {pw.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex gap-1 flex-1">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strengthScore ? strengthColor[strengthScore] : 'bg-slate-100'}`} />
                                        ))}
                                    </div>
                                    <span className={`font-display text-[9px] font-bold uppercase tracking-wider ${strengthText[strengthScore]}`}>
                                        {strengthLabel[strengthScore]}
                                    </span>
                                </div>
                            )}
                            {errors.password && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1">{errors.password}</p>}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                <input
                                    type="password" name="confirm" value={form.confirm} onChange={handleChange}
                                    placeholder="Repite tu contraseña" autoComplete="new-password"
                                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl border bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:bg-white transition-all ${errors.confirm ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus:border-blue-500'}`}
                                />
                                {form.confirm && form.confirm === form.password && (
                                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                                )}
                            </div>
                            {errors.confirm && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1">{errors.confirm}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            className="font-display w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group mt-2"
                        >
                            {loading ? (
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Crear Cuenta <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-300">o</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Inicia sesión</Link>
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
