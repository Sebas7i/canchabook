"use client";

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';
import Navbar from './Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Navbar />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
