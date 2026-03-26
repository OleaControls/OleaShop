import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail]     = useState('');
    const [sent, setSent]       = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError('Ingresa tu correo electrónico'); return; }
        setLoading(true);
        setError('');
        try {
            await api.auth.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link to="/">
                        <img src="/IMG PARA PAGINA SHOP/logo.png" alt="OLEACONTROLS"
                            className="h-7 w-auto object-contain mx-auto mb-6 opacity-80 hover:opacity-100 transition-opacity" />
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Recuperar contraseña</h1>
                    <p className="text-slate-500 text-sm font-medium mt-2">Te enviaremos un enlace para restablecerla</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.07)] p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    {sent ? (
                        <div className="text-center py-4 space-y-4">
                            <div className="size-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                                <CheckCircle2 className="size-8 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="font-display text-lg font-bold text-slate-900">¡Revisa tu correo!</h2>
                                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                                    Si <strong>{email}</strong> está registrado, recibirás un enlace en los próximos minutos.
                                </p>
                            </div>
                            <p className="text-slate-400 text-xs">Revisa también tu carpeta de spam.</p>
                            <Link to="/login" className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                                <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="tu@correo.com"
                                        autoFocus
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-blue-600/10 focus:border-blue-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="font-display w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Enviar enlace de recuperación'}
                            </button>

                            <Link to="/login" className="flex items-center justify-center gap-2 font-display text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">
                                <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
                            </Link>
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
