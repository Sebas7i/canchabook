"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.full_name || 'Usuario',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'usuario',
          avatar: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
        } as UserProfile);
      } else {
        // This case should ideally be handled by the trigger, but as a fallback:
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
           const newUser = {
             id: authUser.user.id,
             full_name: authUser.user.user_metadata.full_name || 'Usuario',
             email: authUser.user.email,
             avatar_url: authUser.user.user_metadata.avatar_url,
             role: 'usuario'
           };
           await supabase.from('profiles').insert([newUser]);
           setUser({
              id: newUser.id,
              name: newUser.full_name,
              email: newUser.email || '',
              phone: '',
              role: 'usuario',
              avatar: newUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
           });
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateUser = async (updatedUser: UserProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          phone: updatedUser.phone,
          avatar_url: updatedUser.avatar,
          role: updatedUser.role
        })
        .eq('id', updatedUser.id);
      
      if (error) throw error;
      setUser(updatedUser);
    } catch (error) {
       console.error("Error updating user profile:", error);
       throw error;
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error("Error logging in with Google:", error.message);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
