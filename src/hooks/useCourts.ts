import { useState, useEffect } from 'react';
import { Court } from '../types';
import { supabase } from '../lib/supabase';

export const useCourts = () => {
  const [courtsList, setCourtsList] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourts = async () => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*');

      if (error) throw error;

      if (data) {
        const mappedCourts: Court[] = data.map(c => ({
          id: c.id,
          name: c.name,
          type: c.type,
          pricePerHour: Number(c.price_per_hour),
          image: c.image_url,
          rating: Number(c.rating),
          location: c.location,
          amenities: c.amenities || [],
          description: c.description,
          ownerId: c.owner_id
        }));
        setCourtsList(mappedCourts);
      }
    } catch (error) {
      console.error("Error listing courts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();

    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courts'
        },
        () => {
          fetchCourts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateCourt = async (updatedCourt: Court) => {
    try {
      const { error } = await supabase
        .from('courts')
        .update({
          name: updatedCourt.name,
          type: updatedCourt.type,
          price_per_hour: updatedCourt.pricePerHour,
          image_url: updatedCourt.image,
          rating: updatedCourt.rating,
          location: updatedCourt.location,
          amenities: updatedCourt.amenities,
          description: updatedCourt.description,
          owner_id: updatedCourt.ownerId
        })
        .eq('id', updatedCourt.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating court:", error);
    }
  };

  return { courtsList, loading, updateCourt };
};
