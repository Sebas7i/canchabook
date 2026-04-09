"use client";
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-surface dark:bg-black p-6 animate-gentle-in">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 shadow-premium">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2 tracking-tighter">
            Algo Inesperado Ocurrió
          </h1>
          <p className="text-brand-muted text-center max-w-sm mb-8 font-medium">
            Tuvimos un problema técnico temporal procesando tu solicitud. Por favor intenta recargar la aplicación.
          </p>
          <div className="space-y-4 w-full max-w-xs">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-brand-primary text-white rounded-button font-black shadow-float flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <i className="fas fa-sync-alt"></i>
                <span>Recargar Aplicación</span>
              </button>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-left overflow-auto mt-6">
                    <p className="text-xs font-black text-red-600 dark:text-red-400 mb-1">Details (Dev Only):</p>
                    <pre className="text-[10px] text-red-800 dark:text-red-300 font-mono">
                        {this.state.error?.toString()}
                    </pre>
                </div>
              )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
