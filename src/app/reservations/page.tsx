"use client";

import React, { useState } from 'react';
import { Reservation } from '../../types';
import Link from 'next/link';
import { useReservations } from '../../hooks/useReservations';

const MyReservations: React.FC = () => {
  const { reservations, cancelReservation: onCancel } = useReservations();

  React.useEffect(() => {
    document.title = "Mis Partidos - CanchaBook";
  }, []);

  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);

  const confirmCancel = () => {
    if (reservationToCancel) {
      onCancel(reservationToCancel.id);
      setReservationToCancel(null);
    }
  };

  const handleShare = (res: Reservation) => {
    const text = `¡Hola! He reservado la cancha ${res.courtName} para el ${res.date} a las ${res.time} por ${res.duration} horas. ¿Te unes? ⚽🎾`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-10 animate-gentle-in pb-32 pt-10 px-4 max-w-4xl mx-auto">
      <div className="px-2">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Mis Partidos</h1>
        <p className="text-brand-muted text-sm font-medium mt-3">Gestiona tus próximos encuentros y comparte con amigos.</p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-20 rounded-panel shadow-premium border border-gray-50 dark:border-zinc-800 text-center space-y-8">
          <div className="w-24 h-24 bg-brand-surface dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-brand-muted">
            <i className="fas fa-calendar-xmark text-4xl"></i>
          </div>
          <div className="space-y-3">
            <h3 className="font-black text-2xl text-gray-800 dark:text-slate-100 tracking-tight">Cero partidos a la vista</h3>
            <p className="text-brand-muted text-sm font-medium px-6 leading-relaxed">Aún no has programado nada. ¡El terreno de juego te espera!</p>
          </div>
          <Link href="/" className="inline-block px-12 py-5 bg-brand-primary text-white font-black rounded-button hover:bg-brand-secondary transition-all shadow-float uppercase text-xs tracking-widest active:scale-95">
            Explorar Canchas
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map(res => (
            <div key={res.id} className="group bg-white dark:bg-zinc-900 p-6 rounded-card shadow-premium border border-gray-50 dark:border-zinc-800 flex items-center justify-between hover:shadow-float hover:border-brand-primary/20 transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-inner flex items-center justify-center transition-all ${
                  res.status === 'Cancelada' ? 'bg-brand-surface dark:bg-zinc-800 text-brand-muted' : 'bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white'
                }`}>
                  <i className={`fas ${res.status === 'Cancelada' ? 'fa-circle-xmark' : 'fa-trophy'} text-2xl`}></i>
                </div>
                <div>
                  <h3 className={`font-black text-xl tracking-tight transition-colors ${res.status === 'Cancelada' ? 'text-brand-muted' : 'text-gray-900 dark:text-slate-100 group-hover:text-brand-primary'}`}>{res.courtName}</h3>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <span className="text-[11px] font-black text-brand-muted uppercase tracking-widest">
                       {new Date(res.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full"></span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${res.status === 'Cancelada' ? 'text-brand-muted' : 'text-brand-primary'}`}>
                      {res.time} hrs • {res.duration}h
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl tracking-widest ${
                  res.status === 'Confirmada' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-surface dark:bg-zinc-800 text-brand-muted'
                }`}>
                  {res.status}
                </span>
                <div className="flex space-x-2">
                  {res.status === 'Confirmada' && (
                    <>
                      <button 
                        onClick={() => handleShare(res)}
                        className="w-10 h-10 bg-brand-info/10 text-brand-info rounded-xl hover:bg-brand-info hover:text-white transition-all flex items-center justify-center active:scale-90"
                        title="Invitar amigos"
                        aria-label="Compartir reserva por WhatsApp"
                      >
                        <i className="fab fa-whatsapp"></i>
                      </button>
                      <button 
                        onClick={() => setReservationToCancel(res)}
                        className="w-10 h-10 bg-brand-error/10 text-brand-error rounded-xl hover:bg-brand-error hover:text-white transition-all flex items-center justify-center active:scale-90"
                        title="Anular partido"
                        aria-label="Cancelar esta reserva"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card Style for Figma */}
      {reservations.length > 0 && (
        <div className="bg-brand-secondary p-10 rounded-panel text-white shadow-premium relative overflow-hidden border-b-8 border-brand-accent/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center space-x-6">
            <div className="bg-white/10 p-4 rounded-inner backdrop-blur-xl border border-white/20">
              <i className="fas fa-info-circle text-2xl text-brand-accent"></i>
            </div>
            <div>
              <h4 className="font-black text-xl mb-1 tracking-tight">Fair Play</h4>
              <p className="text-xs font-medium text-white/60 leading-relaxed max-w-sm">
                Recuerda presentarte 10 minutos antes. La puntualidad garantiza el mejor juego para todos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Figma Layer */}
      {reservationToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-gentle-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReservationToCancel(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-panel p-10 relative z-10 shadow-float animate-pop border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-brand-error/10 text-brand-error rounded-card flex items-center justify-center mx-auto mb-8 shadow-glow">
              <i className="fas fa-triangle-exclamation text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-3 tracking-tighter">¿Anular Reserva?</h3>
            <p className="text-brand-muted text-sm text-center mb-10 font-medium px-4">
              Estás a punto de cancelar tu partido en <span className="font-bold text-gray-800 dark:text-slate-200 underline decoration-brand-error/30">{reservationToCancel.courtName}</span>. ¿Confirmas esta acción?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setReservationToCancel(null)}
                className="py-5 bg-brand-surface dark:bg-zinc-800 text-brand-muted rounded-inner font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
              >
                Cerrar
              </button>
              <button 
                onClick={confirmCancel}
                className="py-5 bg-brand-error text-white rounded-inner font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-700 shadow-lg shadow-brand-error/20 transition-all active:scale-105"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
