"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useReservations } from '../../hooks/useReservations';
import { useCourts } from '../../hooks/useCourts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reservations, loading: loadingRes } = useReservations();
  const { courtsList: courts, loading: loadingCourts } = useCourts();

  React.useEffect(() => {
    document.title = "Panel de Administración - CanchaBook";
  }, []);

  const [activeTab, setActiveTab] = useState<'reservas' | 'canchas'>('reservas');

  if (!user || (user.role !== 'admin_cancha' && user.role !== 'root')) {
    return <div className="p-20 text-center font-black text-brand-error">Acceso Denegado</div>;
  }

  const stats = {
    totalReservas: reservations.length,
    confirmadas: reservations.filter(r => r.status === 'Confirmada').length,
    canceladas: reservations.filter(r => r.status === 'Cancelada').length,
    ingresos: reservations.filter(r => r.status === 'Confirmada').reduce((acc, r) => {
      const court = courts.find(c => c.id === r.courtId);
      return acc + (court ? court.pricePerHour * r.duration : 0);
    }, 0)
  };

  return (
    <div className="space-y-10 animate-gentle-in pb-32 pt-10 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
           <span className="text-[10px] font-black tracking-[0.3em] text-brand-primary uppercase">Panel Administrativo</span>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Gestión Sede</h1>
           <p className="text-brand-muted text-sm font-medium">Control total de tus canchas y reservas en tiempo real.</p>
        </div>
        <div className="flex space-x-3 bg-brand-surface dark:bg-zinc-800/50 p-1.5 rounded-inner">
           <button 
             onClick={() => setActiveTab('reservas')}
             className={`px-8 py-3.5 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeTab === 'reservas' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted'}`}
           >
             Reservas
           </button>
           <button 
             onClick={() => setActiveTab('canchas')}
             className={`px-8 py-3.5 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeTab === 'canchas' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted'}`}
           >
             Mis Canchas
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Ingresos Est.', value: `$${stats.ingresos}`, icon: 'fa-dollar-sign', color: 'text-brand-success', bg: 'bg-brand-success/10' },
           { label: 'Confirmadas', value: stats.confirmadas, icon: 'fa-check-circle', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
           { label: 'Canceladas', value: stats.canceladas, icon: 'fa-times-circle', color: 'text-brand-error', bg: 'bg-brand-error/10' },
           { label: 'Total Citas', value: stats.totalReservas, icon: 'fa-calendar-alt', color: 'text-brand-info', bg: 'bg-brand-info/10' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-card border border-gray-100 dark:border-zinc-800 shadow-premium group hover:border-brand-primary/20 transition-all transition-colors">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-inner flex items-center justify-center mb-6 text-lg group-hover:scale-110 transition-transform`}>
                 <i className={`fas ${stat.icon}`}></i>
              </div>
              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </div>

      {activeTab === 'reservas' ? (
        <section className="bg-white dark:bg-zinc-900 rounded-panel border border-gray-100 dark:border-zinc-800 shadow-premium overflow-hidden transition-colors">
           <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between bg-gray-50/30 dark:bg-black/30">
              <h2 className="font-black text-lg text-gray-800 dark:text-slate-200 uppercase tracking-tight">Listado de Reservas</h2>
              <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest active:scale-95"><i className="fas fa-download mr-2"></i>Exportar Reporte</button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800 transition-colors">
                   <th className="p-6 text-[10px] font-black text-brand-muted uppercase tracking-widest">Jugador</th>
                   <th className="p-6 text-[10px] font-black text-brand-muted uppercase tracking-widest">Cancha</th>
                   <th className="p-6 text-[10px] font-black text-brand-muted uppercase tracking-widest">Fecha / Hora</th>
                   <th className="p-6 text-[10px] font-black text-brand-muted uppercase tracking-widest">Estado</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                 {reservations.map((res) => (
                   <tr key={res.id} className="hover:bg-brand-surface dark:hover:bg-zinc-800/30 transition-colors group">
                     <td className="p-6">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-black text-xs uppercase shadow-sm">
                              {(res.userName || 'U').charAt(0)}
                           </div>
                           <span className="font-black text-gray-800 dark:text-slate-200 text-sm">{res.userName || 'Usuario Defecto'}</span>
                        </div>
                     </td>
                     <td className="p-6">
                        <span className="text-xs font-bold text-brand-secondary dark:text-slate-400">{res.courtName}</span>
                     </td>
                     <td className="p-6">
                        <div className="space-y-1">
                           <p className="text-xs font-black text-gray-800 dark:text-slate-200">{res.date}</p>
                           <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{res.time} • {res.duration}h</p>
                        </div>
                     </td>
                     <td className="p-6">
                        <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest ${
                          res.status === 'Confirmada' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'
                        }`}>
                          {res.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {courts.map(court => (
             <div key={court.id} className="bg-white dark:bg-zinc-900 rounded-card border border-gray-100 dark:border-zinc-800 p-6 flex items-center space-x-6 hover:shadow-premium transition-all transition-colors group">
                <img src={court.image} className="w-20 h-20 rounded-inner object-cover border-2 border-gray-50 dark:border-zinc-800 group-hover:scale-105 transition-transform" alt={court.name} />
                <div className="flex-1">
                   <h3 className="font-black text-gray-900 dark:text-white mb-1 leading-none">{court.name}</h3>
                   <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{court.type}</span>
                   <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1.5">
                         <i className="fas fa-star text-brand-accent text-[8px]"></i>
                         <span className="text-xs font-black dark:text-slate-300">{court.rating}</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white">${court.pricePerHour}/h</span>
                   </div>
                </div>
                <button className="w-10 h-10 bg-brand-surface dark:bg-zinc-800 rounded-xl flex items-center justify-center text-brand-muted hover:text-brand-primary transition-colors active:scale-90 shadow-sm"><i className="fas fa-ellipsis-v"></i></button>
             </div>
           ))}
           <button className="bg-brand-surface dark:bg-zinc-900/50 rounded-card border-2 border-dashed border-gray-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-brand-muted hover:border-brand-primary/50 hover:text-brand-primary transition-all active:scale-[0.98]">
              <i className="fas fa-plus-circle text-3xl mb-4"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Añadir Nueva Cancha</span>
           </button>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
