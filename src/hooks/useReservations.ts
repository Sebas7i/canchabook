import { useState, useEffect } from 'react';
import { Reservation, Court } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          court:courts(name),
          profile:profiles(full_name)
        `);

      if (user.role === 'usuario') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const mapped: Reservation[] = data.map((res: any) => ({
          id: res.id,
          courtId: res.court_id,
          courtName: res.court?.name || 'Cancha',
          date: res.date,
          time: res.time,
          duration: res.duration,
          status: res.status as any,
          userName: res.profile?.full_name || 'Usuario',
          userId: res.user_id
        }));
        setReservations(mapped);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    fetchReservations();

    // Real-time subscription
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations'
        },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addReservation = async (court: Court, date: string, time: string, duration: number) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          court_id: court.id,
          user_id: user.id,
          date,
          time,
          duration,
          status: 'Confirmada'
        }])
        .select()
        .single();

      if (error) throw error;

      const newRes: Reservation = {
        id: data.id,
        courtId: court.id,
        courtName: court.name,
        date,
        time,
        duration,
        status: 'Confirmada',
        userName: user.name,
        userId: user.id
      };
      
      return newRes;
    } catch (error) {
      console.error("Error adding reservation:", error);
      throw error;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'Cancelada' })
        .eq('id', reservationId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      throw error;
    }
  };

  return { reservations, loading, addReservation, cancelReservation };
};
