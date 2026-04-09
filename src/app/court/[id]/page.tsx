"use client";

import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TIME_SLOTS } from '../../../constants';
import { Court, Reservation } from '../../../types';

import { useAuth } from '../../../contexts/AuthContext';
import { useCourts } from '../../../hooks/useCourts';
import { useReservations } from '../../../hooks/useReservations';

const CourtDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { user } = useAuth();
  const { courtsList: courts, updateCourt: onUpdateCourt } = useCourts();
  const { addReservation: onBook } = useReservations();
  const router = useRouter();
  
  const initialCourt = courts.find(c => c.id === id);

  const [court, setCourt] = useState<Court | undefined>(initialCourt);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Court>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const updatedCourt = courts.find(c => c.id === id);
    if (updatedCourt) {
      setCourt(updatedCourt);
      document.title = `${updatedCourt.name} - CanchaBook`;
    }
  }, [courts, id]);

  useEffect(() => {
    if (court) {
      setEditForm({
        name: court.name,
        pricePerHour: court.pricePerHour,
        description: court.description
      });
    }
  }, [court]);

  if (!user) return null;
  if (!court) return <div className="p-10 text-center font-black text-brand-muted">Cancha no encontrada</div>;

  const isAdmin = user.role === 'admin_cancha' || user.role === 'root';

  const handleBooking = async () => {
    if (!selectedTime) return;
    
    // Optimistic UI
    setIsSuccess(true);
    
    try {
      await onBook(court, selectedDate, selectedTime, duration);
      setTimeout(() => router.push('/reservations'), 2500);
    } catch (error) {
      console.error("Error en la reserva:", error);
      setIsSuccess(false);
      alert("Hubo un error al procesar tu reserva.");
    }
  };

  const handleSaveEdit = () => {
    const updated = { ...court, ...editForm } as Court;
    onUpdateCourt(updated);
    setCourt(updated);
    setIsEditing(false);
  };

  const handleDurationChange = (amount: number) => {
    setDuration(prev => Math.max(1, Math.min(5, prev + amount)));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col items-center justify-center p-8 animate-gentle-in">
        <div className="w-32 h-32 bg-brand-primary/10 rounded-full flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 animate-ping opacity-25"></div>
           <i className="fas fa-check-circle text-6xl text-brand-primary"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center tracking-tighter">¡Reserva Exitosa!</h2>
        <p className="text-brand-muted mt-3 font-medium text-center max-w-xs leading-relaxed">
          Tu partido en <span className="text-brand-primary font-black">{court.name}</span> está listo.
        </p>
        <button 
          onClick={() => router.push('/reservations')}
          className="mt-12 w-full max-w-sm p-6 bg-brand-primary text-white rounded-button font-black shadow-float active:scale-95 transition-all"
        >
           Ver mis reservas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface dark:bg-black pb-32 pt-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery / Image Section */}
        <div className="space-y-6">
          <div className="relative h-[50vh] lg:h-[70vh] rounded-[40px] overflow-hidden shadow-2xl group border-4 border-white dark:border-zinc-800">
            <img 
              src={court.image} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={court.name} 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
               <button onClick={() => router.back()} className="w-12 h-12 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-inner border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-lg">
                  <i className="fas fa-chevron-left"></i>
               </button>
               <div className="flex space-x-3">
                 {isAdmin && (
                   <button onClick={() => setIsEditing(!isEditing)} className="w-12 h-12 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-inner border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-lg">
                      <i className="fas fa-edit"></i>
                   </button>
                 )}
                 <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-inner border border-white/20 flex items-center justify-center transition-all active:scale-90 shadow-lg ${isFavorite ? 'text-red-500' : 'text-white'}`}>
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                 </button>
               </div>
            </div>

            <div className="absolute bottom-10 left-10">
               <span className="bg-brand-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-float mb-4 inline-block">
                 {court.type}
               </span>
               <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-xl">{court.name}</h1>
            </div>
          </div>
        </div>

        {/* Info & Booking Section */}
        <div className="space-y-8 lg:py-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[48px] p-10 shadow-premium border border-gray-100 dark:border-zinc-800 space-y-8 animate-pop">
            {isEditing ? (
              <div className="space-y-6">
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Editar Sede</h2>
                 <div className="space-y-4">
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-5 bg-brand-surface dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-inner text-sm font-bold"
                    />
                    <textarea 
                      value={editForm.description} 
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full p-5 bg-brand-surface dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-inner text-sm font-medium h-32"
                    />
                    <div className="flex space-x-3">
                      <button onClick={handleSaveEdit} className="flex-1 bg-brand-primary text-white py-5 rounded-inner font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Guardar</button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 dark:bg-zinc-800 text-brand-muted py-5 rounded-inner font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Cancelar</button>
                    </div>
                 </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Precio x Hora</p>
                    <p className="text-3xl font-black text-brand-primary tracking-tighter">${court.pricePerHour}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-100 dark:bg-zinc-800"></div>
                  <div className="flex-1 px-4">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Valoración</p>
                    <div className="flex items-center space-x-2">
                       <i className="fas fa-star text-brand-accent"></i>
                       <span className="text-xl font-black text-gray-900 dark:text-white">{court.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-2">Descripción</p>
                  <p className="text-sm font-medium text-brand-secondary dark:text-slate-400 leading-relaxed px-2">
                    {court.description}
                  </p>
                </div>

                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-2">Selecciona Día</label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-5 bg-brand-surface dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-inner text-xs font-black"
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-2">¿Cuántas Horas?</label>
                      <div className="flex items-center justify-between bg-brand-surface dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-inner p-2">
                        <button onClick={() => handleDurationChange(-1)} className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-brand-primary active:scale-90 disabled:opacity-30" disabled={duration <= 1}><i className="fas fa-minus"></i></button>
                        <span className="text-lg font-black text-gray-900 dark:text-white">{duration}h</span>
                        <button onClick={() => handleDurationChange(1)} className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-brand-primary active:scale-90 disabled:opacity-30" disabled={duration >= 5}><i className="fas fa-plus"></i></button>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-2">Horarios Disponibles</p>
                  <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 rounded-xl text-[10px] font-black transition-all border ${selectedTime === time ? 'bg-brand-primary text-white border-brand-primary shadow-glow scale-105' : 'bg-white dark:bg-zinc-800 text-brand-muted border-gray-100 dark:border-zinc-700'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!selectedTime}
                  onClick={handleBooking}
                  className={`w-full py-6 rounded-button font-black text-sm uppercase tracking-widest shadow-float active:scale-95 transition-all ${selectedTime ? 'bg-brand-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-brand-muted cursor-not-allowed'}`}
                >
                  Confirmar Reserva
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;
