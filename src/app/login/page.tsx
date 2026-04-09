"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    document.title = "Iniciar Sesión - CanchaBook";
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('usuario');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      alert("Error de Autenticación con Google: " + (err?.message || err));
      setError('Error al iniciar sesión con Google: ' + (err?.message || err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('El inicio de sesión con correo estará disponible pronto. Por favor usa Google.');
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 bg-brand-surface dark:bg-black transition-colors">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-panel shadow-premium p-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 border border-gray-100 dark:border-zinc-800">
        <div className="bg-brand-primary p-1.5 rounded-2xl shadow-glow mb-8 transition-transform hover:scale-110">
          <div className="bg-white dark:bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center text-brand-primary">
            <i className="fas fa-volleyball-ball text-2xl animate-spin-slow"></i>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Bienvenido</h1>
        <p className="text-brand-muted text-sm mb-10 font-medium">Ingresa a la comunidad CanchaBook</p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex border border-gray-100 dark:border-zinc-800 p-1.5 rounded-inner bg-brand-surface dark:bg-black/50 mb-4 transition-colors">
            <button
              type="button"
              onClick={() => setRole('usuario')}
              className={`flex-1 py-3.5 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all ${role === 'usuario' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted dark:text-zinc-600'}`}
            >
              Jugador
            </button>
            <button
              type="button"
              onClick={() => setRole('admin_cancha')}
              className={`flex-1 py-3.5 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin_cancha' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted dark:text-zinc-600'}`}
            >
              Dueño Sede
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors"></i>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-14 pr-6 py-5 bg-brand-surface dark:bg-black/50 border border-gray-100 dark:border-zinc-800 rounded-inner outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold dark:text-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors"></i>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-14 pr-6 py-5 bg-brand-surface dark:bg-black/50 border border-gray-100 dark:border-zinc-800 rounded-inner outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold dark:text-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-600 py-5 rounded-[24px] font-black text-sm mt-6 cursor-not-allowed"
          >
            Iniciar Sesión (Email)
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 dark:text-zinc-700 uppercase tracking-widest">O continúa con</span>
            <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-slate-200 py-5 rounded-[24px] font-black text-sm flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-95 shadow-sm"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-primary"></div>
            ) : (
              <>
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5" />
                <span>Iniciar con Google</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-xs text-gray-400 dark:text-zinc-500 font-bold">
          ¿No tienes cuenta? <Link href="/register" className="text-brand-primary font-black ml-1">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
