"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
    <Link 
      href={to} 
      className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 ${
        isActive(to) ? 'text-brand-primary scale-110' : 'text-brand-muted dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-inner flex items-center justify-center transition-all ${
        isActive(to) ? 'bg-brand-primary/10 shadow-inner' : 'bg-transparent'
      }`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 safe-bottom px-4 flex items-center justify-around z-50 rounded-t-panel shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-x border-white dark:border-zinc-800 transition-colors">
      {user.role === 'usuario' && (
        <>
          <NavItem to="/" icon="fa-th-large" label="Explorar" />
          <NavItem to="/reservations" icon="fa-calendar-check" label="Mis Citas" />
          <NavItem to="/profile" icon="fa-user-circle" label="Perfil" />
        </>
      )}

      {user.role === 'admin_cancha' && (
        <>
          <NavItem to="/" icon="fa-store" label="Mi Sede" />
          <NavItem to="/admin/courts" icon="fa-running" label="Canchas" />
          <NavItem to="/profile" icon="fa-user-circle" label="Perfil" />
        </>
      )}

      {user.role === 'root' && (
        <>
          <NavItem to="/" icon="fa-crown" label="Master" />
          <NavItem to="/root/analytics" icon="fa-database" label="Control" />
          <NavItem to="/profile" icon="fa-user-circle" label="Perfil" />
        </>
      )}
    </nav>
  );
};

export default Navbar;
