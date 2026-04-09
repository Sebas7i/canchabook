"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const { loginWithGoogle, loginWithFacebook, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    document.title = "Crea tu Cuenta - CanchaBook";
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('usuario');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('Error al registrarse con Google: ' + (err?.message || err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithFacebook();
    } catch (err: any) {
      setError('Error al registrarse con Facebook: ' + (err?.message || err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('El registro con correo estará disponible pronto. Por favor usa Google.');
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-black flex items-center justify-center p-6">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] shadow-2xl p-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 border border-gray-100 dark:border-zinc-800">
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-1.5 rounded-2xl shadow-sm mb-6">
          <div className="bg-white dark:bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center text-green-700">
            <i className="fas fa-user-plus text-2xl"></i>
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Únete ahora</h1>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mb-8 font-medium">Crea tu perfil deportivo</p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
           <div className="flex border border-gray-100 dark:border-zinc-800 p-1 rounded-2xl bg-[#F8F8F8] dark:bg-black/50 mb-2">
            <button
              type="button"
              onClick={() => setRole('usuario')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'usuario' ? 'bg-white dark:bg-zinc-900 shadow-sm text-green-700' : 'text-gray-400'}`}
            >
              Jugador
            </button>
            <button
              type="button"
              onClick={() => setRole('admin_cancha')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin_cancha' ? 'bg-white dark:bg-zinc-900 shadow-sm text-green-700' : 'text-gray-400'}`}
            >
              Dueño Sede
            </button>
          </div>

          <div className="space-y-4">
             <div className="relative group">
              <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors"></i>
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full pl-14 pr-6 py-4 bg-[#F9F9F9] dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm font-bold dark:text-slate-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative group">
              <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors"></i>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-14 pr-6 py-4 bg-[#F9F9F9] dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm font-bold dark:text-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-600 py-4 rounded-2xl font-bold text-sm mt-4 cursor-not-allowed"
          >
            Registrarme con Email
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 dark:text-zinc-700 uppercase tracking-widest">O únete con</span>
            <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-slate-200 py-4 rounded-[24px] font-black text-sm flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-95 shadow-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-primary"></div>
              ) : (
                <>
                  <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5" />
                  <span>Registrarme con Google</span>
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={handleFacebookRegister}
              disabled={loading}
              className="w-full bg-[#1877F2] text-white py-4 rounded-[24px] font-black text-sm flex items-center justify-center space-x-3 hover:bg-[#0c63d4] transition-all active:scale-95 shadow-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <i className="fab fa-facebook-f text-lg w-5 text-center"></i>
                  <span>Registrarme con Facebook</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs text-gray-500 dark:text-zinc-500 font-medium">
          ¿Ya tienes cuenta? <Link href="/login" className="text-[#2E8B1E] font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
