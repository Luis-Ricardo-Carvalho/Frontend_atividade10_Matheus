import React from 'react';
import { Database, Moon, Sun, Sliders } from 'lucide-react';
import { ApiStatus } from '../services/api';

interface NavbarProps {
  apiStatus: ApiStatus | null;
  onOpenApiSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiStatus,
  onOpenApiSettings,
  darkMode,
  onToggleDarkMode,
  onScrollToSection
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 dark:bg-blue-500" />
        <span>PetroClass</span>
        <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">· Petrologia</span>
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onScrollToSection('formulario')}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Formulário de Óxidos
        </button>
        <button
          type="button"
          onClick={() => onScrollToSection('resultado')}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Predição
        </button>
        <button
          type="button"
          onClick={() => onScrollToSection('diagrama')}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Diagrama TAS
        </button>
        <button
          type="button"
          onClick={() => onScrollToSection('historico')}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Histórico
        </button>
      </nav>

      {/* Zone 3: 1 primary action area */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenApiSettings}
          title="Configurações e Endpoint do Backend"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Backend API</span>
          {apiStatus?.online && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="API Online" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label="Alternar tema claro/escuro"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
