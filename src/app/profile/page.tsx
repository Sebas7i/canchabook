"use client";

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Profile: React.FC = () => {
  const { user, updateUser: onUpdate, logout: onLogout } = useAuth();
  const { isDarkMode: darkMode, toggleDarkMode: onToggleDarkMode } = useTheme();

  React.useEffect(() => {
    document.title = "Mi Perfil - CanchaBook";
  }, []);
  
  if (!user) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Otros Estados de Ajustes
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    location: true,
    publicProfile: false
  });

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCameraClick = () => {
    alert("Abriendo Cámara Nativa de Android/iOS...");
  };

  const handleLogout = () => {
    onLogout();
  };

  const SettingRow = ({ icon, label, sublabel, color, isActive, onToggle }: any) => (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${color} rounded-inner flex items-center justify-center text-lg shadow-sm`}>
          <i className={`fas ${icon}`}></i>
        </div>
        <div>
          <span className="font-black text-gray-800 dark:text-slate-200 text-sm block">{label}</span>
          <span className="text-[10px] text-brand-muted font-bold">{sublabel}</span>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isActive ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-zinc-700'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${isActive ? 'right-1' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-gentle-in max-w-2xl mx-auto pb-32 pt-10 px-4">
      {/* Header de Perfil */}
      <section className="bg-white dark:bg-zinc-900 p-8 rounded-panel shadow-premium border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center space-y-6 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-10"></div>
        
        <div className="relative z-10 pt-4">
          <div className="relative group" onClick={handleCameraClick}>
            <img 
              src={editedUser.avatar} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
               <i className="fas fa-camera text-white text-2xl"></i>
            </div>
            <button className="absolute bottom-1 right-1 bg-brand-primary text-white w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 flex items-center justify-center shadow-lg">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tighter">{user.name}</h2>
            <span className="text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full inline-block">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="w-full bg-brand-surface dark:bg-zinc-800/50 p-1.5 rounded-inner flex">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${activeTab === 'profile' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted'}`}
          >
            Mi Cuenta
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 rounded-inner text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${activeTab === 'settings' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-primary' : 'text-brand-muted'}`}
          >
            Ajustes App
          </button>
        </div>
      </section>

      {activeTab === 'profile' ? (
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-card shadow-premium border border-gray-100 dark:border-zinc-800 space-y-6 animate-pop transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-gray-800 dark:text-slate-200">Información Personal</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-brand-primary text-[10px] font-black uppercase tracking-widest underline underline-offset-4"
              >
                Editar
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2 tracking-widest">Nombre Completo</label>
              <input 
                disabled={!isEditing}
                type="text" 
                value={editedUser.name}
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                className="w-full bg-brand-surface dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-inner py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 dark:text-slate-200 disabled:opacity-70"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2 tracking-widest">Correo Electrónico</label>
              <input 
                disabled={!isEditing}
                type="email" 
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                className="w-full bg-brand-surface dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-inner py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 dark:text-slate-200 disabled:opacity-70"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2 tracking-widest">Número Telefónico</label>
              <input 
                disabled={!isEditing}
                type="tel" 
                value={editedUser.phone}
                onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                className="w-full bg-brand-surface dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-inner py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 dark:text-slate-200 disabled:opacity-70"
              />
            </div>
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-brand-primary text-white py-4 rounded-inner font-black text-xs uppercase tracking-widest shadow-float active:scale-95 transition-all">Guardar</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 bg-brand-surface dark:bg-zinc-800 text-brand-muted dark:text-slate-400 py-4 rounded-inner font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Cancelar</button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="space-y-6 animate-pop">
          {/* Notificaciones */}
          <div className="bg-white dark:bg-zinc-900 rounded-card border border-gray-50 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800 overflow-hidden shadow-premium transition-colors">
            <h3 className="p-6 font-black text-gray-800 dark:text-slate-200 text-sm bg-gray-50/50 dark:bg-black/50 uppercase tracking-widest">Notificaciones</h3>
            <SettingRow 
              icon="fa-bell" 
              label="Push Directas" 
              sublabel="Alertas de nuevas reservas" 
              color="bg-brand-primary/10 text-brand-primary"
              isActive={settings.notifications}
              onToggle={() => toggleSetting('notifications')}
            />
            <SettingRow 
              icon="fa-volume-up" 
              label="Sonidos" 
              sublabel="Alertas audibles en el app" 
              color="bg-brand-info/10 text-brand-info"
              isActive={settings.sounds}
              onToggle={() => toggleSetting('sounds')}
            />
          </div>

          {/* Interfaz y Datos */}
          <div className="bg-white dark:bg-zinc-900 rounded-card border border-gray-50 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800 overflow-hidden shadow-premium transition-colors">
            <h3 className="p-6 font-black text-gray-800 dark:text-slate-200 text-sm bg-gray-50/50 dark:bg-black/50 uppercase tracking-widest">Interfaz y Privacidad</h3>
            <SettingRow 
              icon="fa-moon" 
              label="Modo Oscuro" 
              sublabel="Ahorra batería y descansa la vista" 
              color="bg-slate-800 dark:bg-white text-white dark:text-black"
              isActive={darkMode}
              onToggle={onToggleDarkMode}
            />
            <SettingRow 
              icon="fa-location-crosshairs" 
              label="Ubicación Precisa" 
              sublabel="Busca canchas cerca de ti" 
              color="bg-brand-error/10 text-brand-error"
              isActive={settings.location}
              onToggle={() => toggleSetting('location')}
            />
            <SettingRow 
              icon="fa-globe" 
              label="Perfil Público" 
              sublabel="Otros jugadores pueden verte" 
              color="bg-brand-accent/10 text-brand-accent"
              isActive={settings.publicProfile}
              onToggle={() => toggleSetting('publicProfile')}
            />
          </div>

          {/* Soporte */}
          <div className="bg-white dark:bg-zinc-900 rounded-card border border-gray-100 dark:border-zinc-800 p-2 shadow-premium transition-colors">
            <button className="w-full p-6 flex items-center justify-between text-left hover:bg-brand-surface dark:hover:bg-zinc-800/50 rounded-inner transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-slate-400 rounded-inner flex items-center justify-center">
                  <i className="fas fa-headset"></i>
                </div>
                <span className="font-black text-gray-800 dark:text-slate-200 text-sm">Centro de Ayuda</span>
              </div>
              <i className="fas fa-external-link-alt text-gray-300 dark:text-zinc-600 text-xs"></i>
            </button>
          </div>
        </section>
      )}

      {/* Botón de Logout Destacado */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white dark:bg-zinc-900 text-brand-error py-6 rounded-card border border-brand-error/10 dark:border-red-900/30 font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:bg-brand-error/5 transition-all flex items-center justify-center space-x-3 active:scale-95"
      >
        <i className="fas fa-power-off"></i>
        <span>Cerrar Sesión</span>
      </button>

      <div className="text-center">
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">CanchaBook v2.4.0 (Pro)</p>
        <p className="text-[8px] font-medium text-brand-muted opacity-50 mt-1">Made with ❤️ for Athletes</p>
      </div>
    </div>
  );
};

export default Profile;
