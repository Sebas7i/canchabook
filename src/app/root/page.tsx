"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCourts } from '../../hooks/useCourts';
import { useReservations } from '../../hooks/useReservations';

const RootDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courtsList: courts } = useCourts();
  const { reservations } = useReservations();

  React.useEffect(() => {
    document.title = "Master Control Dashboard - CanchaBook";
  }, []);

  if (!user || user.role !== 'root') {
    return <div className="p-20 text-center font-black text-brand-error">Acceso Restringido - Nivel Root Requerido</div>;
  }

  const globalStats = {
    totalRevenue: reservations.filter(r => r.status === 'Confirmada').reduce((acc, r) => {
      const court = courts.find(c => c.id === r.courtId);
      return acc + (court ? court.pricePerHour * r.duration : 0);
    }, 0),
    totalUsers: 1240, // Mock for now
    totalCourts: courts.length,
    activeReservations: reservations.filter(r => r.status === 'Confirmada').length
  };

  return (
    <div className="space-y-12 animate-gentle-in pb-32 pt-10 px-4 max-w-7xl mx-auto">
      {/* Root Header */}
      <div className="bg-zinc-900 dark:bg-black p-10 rounded-panel text-white relative overflow-hidden shadow-premium border-b-8 border-brand-primary/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 transition-colors"></div>
         <div className="relative z-10 flex items-center justify-between">
           <div className="space-y-2">
             <div className="flex items-center space-x-3 text-brand-primary">
                <i className="fas fa-microchip animate-pulse"></i>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Administrator</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter">Panel Maestro</h1>
             <p className="text-zinc-400 font-medium text-sm">Control central de toda la infraestructura CanchaBook.</p>
           </div>
           <div className="hidden md:flex space-x-4">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-inner border border-white/10 text-center min-w-[120px]">
                 <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                 <span className="text-brand-success font-black text-xs uppercase flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-brand-success rounded-full animate-ping"></span>
                    <span>Online</span>
                 </span>
              </div>
           </div>
         </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Revenue Bruto', value: `$${globalStats.totalRevenue.toLocaleString()}`, trend: '+12.4%', icon: 'fa-chart-line', color: 'text-brand-success' },
           { label: 'Usuarios Activos', value: globalStats.totalUsers.toLocaleString(), trend: '+5.2%', icon: 'fa-users', color: 'text-brand-info' },
           { label: 'Sedes Registradas', value: globalStats.totalCourts, trend: '+2', icon: 'fa-map-marked-alt', color: 'text-brand-primary' },
           { label: 'Reservas Mensuales', value: globalStats.activeReservations, trend: '+18.1%', icon: 'fa-calendar-check', color: 'text-brand-accent' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-card border border-zinc-100 dark:border-zinc-800 shadow-premium group hover:shadow-float transition-all transition-colors">
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 bg-zinc-50 dark:bg-zinc-800/50 ${stat.color} rounded-inner flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${stat.icon}`}></i>
                 </div>
                 <span className="text-[10px] font-black text-brand-success bg-brand-success/10 px-2 py-1 rounded-md">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </div>

      {/* System Monitoring Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-panel border border-zinc-100 dark:border-zinc-800 shadow-premium overflow-hidden transition-colors">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
               <h3 className="font-black text-sm uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Últimas Acciones del Sistema</h3>
               <button className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-brand-primary transition-colors"><i className="fas fa-ellipsis-h"></i></button>
            </div>
            <div className="p-2">
               {[1, 2, 3, 4, 5].map((item) => (
                 <div key={item} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 rounded-inner transition-colors group">
                    <div className="flex items-center space-x-6">
                       <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                          <i className="fas fa-user-shield text-xs"></i>
                       </div>
                       <div>
                          <p className="text-sm font-black text-zinc-800 dark:text-zinc-200">Admin_Update_Court</p>
                          <p className="text-[10px] font-bold text-zinc-400">Sede Norte • ID: #{Math.floor(Math.random() * 899) + 100}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">Hace 4 min</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-brand-primary/5 dark:bg-zinc-900 rounded-panel border-2 border-dashed border-brand-primary/20 p-10 flex flex-col items-center justify-center space-y-6 text-center transition-colors">
            <div className="w-20 h-20 bg-brand-primary text-white rounded-card flex items-center justify-center text-3xl shadow-glow">
               <i className="fas fa-database"></i>
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Integridad de Datos</h4>
               <p className="text-xs text-brand-muted font-medium px-4">Sincronización en tiempo real con el Backend (Supabase) activa y saludable.</p>
            </div>
            <button className="px-10 py-5 bg-zinc-900 dark:bg-brand-primary text-white rounded-inner font-black text-[10px] uppercase tracking-widest shadow-float active:scale-95 transition-all w-full">
               System Health Check
            </button>
         </div>
      </section>
    </div>
  );
};

export default RootDashboard;
