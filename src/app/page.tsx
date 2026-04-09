"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { SportType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCourts } from '../hooks/useCourts';
import CourtCardSkeleton from '../components/CourtCardSkeleton';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { courtsList: courts, loading } = useCourts();

  React.useEffect(() => {
    document.title = "CanchaBook - Reserva tu cancha favorita";
  }, []);
  
  if (!user) return null; // Safety check
  const [filter, setFilter] = useState<SportType | 'Todas'>('Todas');

  const filteredCourts = filter === 'Todas' 
    ? courts 
    : courts.filter(c => c.type === filter);

  return (
    <div className="space-y-12 animate-gentle-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section / Welcome */}
      <section className="bg-brand-primary/5 dark:bg-brand-primary/10 p-10 rounded-[48px] border border-brand-primary/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="relative z-10">
            <span className="text-[10px] font-black tracking-[0.3em] text-brand-primary uppercase mb-4 block">Dashboard Jugador</span>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
              ¡Hola, <span className="text-brand-primary">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-brand-muted text-sm font-medium max-w-sm leading-relaxed">
              ¿Listo para el partido de hoy? Tenemos {courts.length} canchas de primer nivel esperándote.
            </p>
         </div>
      </section>

      {/* Filter Tabs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Categorías</h2>
           <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{filteredCourts.length} Sedes cerca de ti</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-4 custom-scrollbar">
          {['Todas', 'Fútbol', 'Pádel', 'Tenis', 'Basketball'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-4 rounded-inner whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm active:scale-95
                ${filter === cat 
                  ? 'bg-brand-primary text-white shadow-glow' 
                  : 'bg-white dark:bg-zinc-900 text-brand-muted dark:text-slate-400 border border-gray-100 dark:border-zinc-800 hover:border-brand-primary/30'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Courts Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Canchas Disponibles</h2>
            <div className="flex space-x-2">
               <button className="w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl flex items-center justify-center text-brand-muted hover:text-brand-primary transition-colors active:scale-90"><i className="fas fa-th-list"></i></button>
               <button className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 active:scale-90"><i className="fas fa-th-large"></i></button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeletons during initial load
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={`skel-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CourtCardSkeleton />
              </motion.div>
            ))
          ) : (
            filteredCourts.map(court => (
              <motion.div
                layout
                key={court.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-zinc-900 rounded-card overflow-hidden border border-gray-50 dark:border-zinc-800 transition-all duration-500 hover:shadow-float hover:border-brand-primary/20"
              >
                <Link href={`/court/${court.id}`} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={court.image} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                      alt={court.name} 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                       <span className="bg-brand-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {court.type}
                       </span>
                       <div className="text-right">
                          <span className="block text-white text-xs font-bold opacity-70 italic mb-1">Cancha Premium</span>
                          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center space-x-1.5">
                             <i className="fas fa-star text-brand-accent text-[10px]"></i>
                             <span className="text-white text-xs font-black">{court.rating}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-brand-primary transition-colors leading-none">
                        {court.name}
                      </h3>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-brand-primary leading-none">${court.pricePerHour}</span>
                        <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mt-1">por hora</span>
                      </div>
                    </div>
                    
                    <p className="text-brand-muted text-xs font-medium line-clamp-2 leading-relaxed h-10">
                      {court.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-zinc-800">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                           <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-brand-surface dark:bg-zinc-800 overflow-hidden ring-1 ring-gray-100 dark:ring-zinc-800 transition-transform group-hover:translate-x-1">
                              <img src={`https://i.pravatar.cc/100?u=${court.id}${i}`} alt="user" className="w-full h-full object-cover" />
                           </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-brand-primary flex items-center justify-center text-[10px] text-white font-black z-10 shadow-lg">
                           +12
                        </div>
                      </div>
                      <div className="bg-brand-primary/10 text-brand-primary w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm active:scale-90">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        </div>
        {filteredCourts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-gray-50 dark:bg-zinc-900/50 rounded-[48px] border-2 border-dashed border-gray-100 dark:border-zinc-800"
          >
            <div className="text-5xl mb-6">🏜️</div>
            <p className="text-brand-muted font-black uppercase text-xs tracking-widest">No hay canchas disponibles en esta categoría</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
