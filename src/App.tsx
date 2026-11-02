/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChemicalOxides,
  OXIDE_DEFINITIONS,
  ROCK_PRESETS,
  RockPreset,
  PredictionResponse,
  HistoryRecord
} from './types/petrology';
import {
  predictRockType,
  getStoredApiUrl,
  setStoredApiUrl,
  checkApiHealth,
  ApiStatus,
  DEFAULT_API_URL
} from './services/api';
import { Navbar } from './components/Navbar';
import { OxideInputCard } from './components/OxideInputCard';
import { PredictionResultCard } from './components/PredictionResultCard';
import { TasDiagram } from './components/TasDiagram';
import { PresetsSelector } from './components/PresetsSelector';
import { HistorySection } from './components/HistorySection';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import {
  Send,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const INITIAL_OXIDES: ChemicalOxides = {
  SiO2n: 47.77,
  TiO2n: 1.33,
  Al2O3n: 15.38,
  'FeO*n': 9.59,
  MnOn: 0.17,
  MgOn: 10.76,
  CaOn: 11.28,
  Na2On: 2.69,
  K2On: 0.62,
  P2O5n: 0.41
};

export default function App() {
  const [oxides, setOxides] = useState<ChemicalOxides>(INITIAL_OXIDES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Settings & Status
  const [apiUrl, setApiUrl] = useState<string>(getStoredApiUrl());
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('petroclass_theme') === 'dark' ||
        (!localStorage.getItem('petroclass_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // History
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('petroclass_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('petroclass_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('petroclass_theme', 'light');
    }
  }, [darkMode]);

  // Check API health on first mount
  useEffect(() => {
    handleCheckHealth();
  }, [apiUrl]);

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const status = await checkApiHealth(apiUrl);
      setApiStatus(status);
    } catch {
      setApiStatus({ online: false, message: 'Falha ao conectar' });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSaveApiUrl = (newUrl: string) => {
    setStoredApiUrl(newUrl);
    setApiUrl(newUrl);
    handleCheckHealth();
  };

  // Oxide sum calculation
  const currentSum = useMemo(() => {
    const sum =
      (Number(oxides.SiO2n) || 0) +
      (Number(oxides.TiO2n) || 0) +
      (Number(oxides.Al2O3n) || 0) +
      (Number(oxides['FeO*n']) || 0) +
      (Number(oxides.MnOn) || 0) +
      (Number(oxides.MgOn) || 0) +
      (Number(oxides.CaOn) || 0) +
      (Number(oxides.Na2On) || 0) +
      (Number(oxides.K2On) || 0) +
      (Number(oxides.P2O5n) || 0);
    return Math.round(sum * 100) / 100;
  }, [oxides]);

  const handleFieldChange = (key: keyof ChemicalOxides, value: number) => {
    setOxides((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectPreset = (preset: RockPreset) => {
    setOxides(preset.values);
    setError(null);
  };

  const handleClear = () => {
    setOxides({
      SiO2n: 0,
      TiO2n: 0,
      Al2O3n: 0,
      'FeO*n': 0,
      MnOn: 0,
      MgOn: 0,
      CaOn: 0,
      Na2On: 0,
      K2On: 0,
      P2O5n: 0
    });
    setResult(null);
    setError(null);
  };

  const handleNormalize = () => {
    if (currentSum <= 0) return;
    const factor = 100 / currentSum;
    const normalized: ChemicalOxides = {
      SiO2n: Math.round(oxides.SiO2n * factor * 100) / 100,
      TiO2n: Math.round(oxides.TiO2n * factor * 100) / 100,
      Al2O3n: Math.round(oxides.Al2O3n * factor * 100) / 100,
      'FeO*n': Math.round(oxides['FeO*n'] * factor * 100) / 100,
      MnOn: Math.round(oxides.MnOn * factor * 100) / 100,
      MgOn: Math.round(oxides.MgOn * factor * 100) / 100,
      CaOn: Math.round(oxides.CaOn * factor * 100) / 100,
      Na2On: Math.round(oxides.Na2On * factor * 100) / 100,
      K2On: Math.round(oxides.K2On * factor * 100) / 100,
      P2O5n: Math.round(oxides.P2O5n * factor * 100) / 100
    };
    setOxides(normalized);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (oxides.SiO2n <= 0) {
      setError('O teor de SiO₂ (Dióxido de Silício) é indispensável para a classificação petrológica.');
      setLoading(false);
      return;
    }

    try {
      const response = await predictRockType(oxides, apiUrl);
      setResult(response);

      // Save to history
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        oxides: { ...oxides },
        prediction: response.predicao,
        confidence: response.confianca,
        codigo: response.codigo
      };

      const updatedHistory = [newRecord, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('petroclass_history', JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }

      // Smooth scroll to result if on mobile
      if (window.innerWidth < 768) {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha desconhecida na predição.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRecord = (recordOxides: ChemicalOxides) => {
    setOxides(recordOxides);
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('petroclass_history');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        apiStatus={apiStatus}
        onOpenApiSettings={() => setIsSettingsOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section with Geological Specimen Core Imagery */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Hero Copy */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">
                <span>CLASSIFICADOR GEOQUÍMICO DE ROCHAS</span>
                <span>·</span>
                <span>MACHINE LEARNING BAYESNET</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-3 text-balance">
                Classificação Petrológica por Teores de Óxidos
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl">
                Insira as porcentagens em peso (wt%) dos 10 principais compostos químicos para inferir com precisão a litologia vulcânica correspondente (ex: Basalto, Andesito, Riolito, Dacito) através da API conectada.
              </p>

              {/* Sample Actions Strip */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all duration-150 disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Consultando Backend...' : 'Classificar Composição Atual'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectPreset(ROCK_PRESETS[0]);
                    handleSubmit();
                  }}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Carregar & Prever Amostra da Atividade</span>
                </button>
              </div>
            </div>

            {/* Geological Image Core Preview */}
            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-100 dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 overflow-hidden">
              <img
                src="/src/assets/images/geological_rock_specimens_1793624470155.jpg"
                alt="Seções transversais de amostras petrológicas de basalto, granito e rochas vulcânicas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs font-mono">
                  <div className="font-semibold">Testemunhos Petrológicos</div>
                  <div className="text-[10px] text-slate-300">Basalto · Andesito · Riolito</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preset Selector Strip */}
        <section>
          <PresetsSelector
            onSelectPreset={handleSelectPreset}
            onClear={handleClear}
            onNormalize={handleNormalize}
            currentSum={currentSum}
            disabled={loading}
          />
        </section>

        {/* Main Grid: Form Inputs vs Prediction + TAS Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 10 Chemical Oxide Fields in Grid */}
          <section id="formulario" className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Composição Química de Óxidos (10 Variáveis)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Insira as frações percentuais dos óxidos analisados em laboratório.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-500">Soma Total:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      currentSum >= 98 && currentSum <= 102
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
                    }`}
                  >
                    {currentSum.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 10 Fields Responsive Grid */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {OXIDE_DEFINITIONS.map((def) => (
                    <OxideInputCard
                      key={def.key}
                      def={def}
                      value={oxides[def.key]}
                      onChange={(newVal) => handleFieldChange(def.key, newVal)}
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Submit Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Payload com chaves duplas (SiO2n e SiO2) para compatibilidade total.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-xs transition-all duration-150 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Processando Classificação...' : 'Enviar para o Backend'}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Prediction Highlight Card & Interactive TAS Diagram */}
          <section className="lg:col-span-5 space-y-6">
            {/* Prediction Result Display */}
            <div id="resultado">
              <PredictionResultCard
                result={result}
                currentOxides={oxides}
                loading={loading}
                error={error}
                onRetry={() => handleSubmit()}
              />
            </div>

            {/* TAS Diagram (Total Alkali-Silica) */}
            <div id="diagrama">
              <TasDiagram
                sio2={oxides.SiO2n}
                na2o={oxides.Na2On}
                k2o={oxides.K2On}
                predictedRock={result?.predicao}
              />
            </div>
          </section>
        </div>

        {/* History of Past Predictions */}
        <section id="historico" className="pt-2">
          <HistorySection
            records={history}
            onLoadRecord={handleLoadRecord}
            onClearHistory={handleClearHistory}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">PetroClass</span>
            <span>·</span>
            <span>Classificador Geoquímico de Rochas Ígneas (BayesNet)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Vite 8 · React 19 · Tailwind CSS</span>
            <span>·</span>
            <a
              href="https://backend-atividade10-matheus.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Backend Render</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiUrl={apiUrl}
        onSaveUrl={handleSaveApiUrl}
        apiStatus={apiStatus}
        onRefreshHealth={handleCheckHealth}
        isCheckingHealth={isCheckingHealth}
      />
    </div>
  );
}
