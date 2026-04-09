import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

// Hooks and Contexts
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useCourts } from './hooks/useCourts';
import { useReservations } from './hooks/useReservations';

// Components
import Navbar from './components/Navbar';
import Splash from './pages/Splash';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const CourtDetail = lazy(() => import('./pages/CourtDetail'));
const MyReservations = lazy(() => import('./pages/MyReservations'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const RootDashboard = lazy(() => import('./pages/RootDashboard'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center animate-gentle-in">
    <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    <p className="mt-4 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Cargando experiencia...</p>
  </div>
);

const App: React.FC = () => {
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = React.useCallback(() => setShowSplash(false), []);
  
  // En fase 1 centralizamos todo en Contextos. useCourts y useReservations ya están listos.


  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />;
  }

  // Si la autenticación está resolviéndose, bloquea la app
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // Usuario No Autenticado
  if (!user) {
    return (
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }

  // Aplicación Principal
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-brand-surface dark:bg-black">
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-40 shadow-sm transition-colors">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-2 rounded-2xl shadow-float transition-transform group-hover:scale-110">
                <div className="bg-white dark:bg-slate-200 p-1 rounded-xl">
                   <i className="fas fa-futbol text-brand-primary text-xl"></i>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-brand-secondary dark:text-brand-primary">CanchaBook</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-3 group hover:bg-gray-50 dark:hover:bg-zinc-800 p-2 rounded-2xl transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-gray-900 dark:text-slate-100 leading-none mb-1">{user.name}</p>
                  <span className="text-[9px] font-black uppercase bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-brand-primary/20 shadow-sm group-hover:scale-110 transition-transform" />
              </Link>
              
              <button 
                onClick={logout} 
                className="hidden md:block text-red-500 text-xs font-black hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all border border-red-100 dark:border-red-900/30"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={
                user.role === 'usuario' ? <Home /> : 
                user.role === 'admin_cancha' ? <AdminDashboard /> : 
                <RootDashboard />
              } />
              
              <Route path="/court/:id" element={<CourtDetail />} />
              
              <Route path="/reservations" element={<MyReservations />} />
              
              <Route path="/profile" element={<Profile />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>

        <Navbar role={user.role} />
      </div>
    </HashRouter>
  );
};

export default App;
