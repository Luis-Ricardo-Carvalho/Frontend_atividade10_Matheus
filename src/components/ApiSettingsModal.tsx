import React, { useState } from 'react';
import { X, Check, RefreshCw, AlertCircle, ExternalLink, Server } from 'lucide-react';
import { DEFAULT_API_URL, ApiStatus, checkApiHealth } from '../services/api';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  onSaveUrl: (newUrl: string) => void;
  apiStatus: ApiStatus | null;
  onRefreshHealth: () => void;
  isCheckingHealth: boolean;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  apiUrl,
  onSaveUrl,
  apiStatus,
  onRefreshHealth,
  isCheckingHealth
}) => {
  const [tempUrl, setTempUrl] = useState(apiUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUrl(tempUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefault = () => {
    setTempUrl(DEFAULT_API_URL);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Configurações do Servidor de Predição
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Base do Backend (Render / Vercel / Local)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              A aplicação envia requisições POST com as 10 variáveis químicas. A API padrão da atividade está configurada abaixo.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="url"
                required
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://backend-atividade10-matheus.onrender.com"
                className="flex-1 font-mono text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-2.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="Restaurar padrão"
              >
                Padrão
              </button>
            </div>
          </div>

          {/* Connection Test / Status Panel */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Status da Conexão
              </span>
              <button
                type="button"
                onClick={onRefreshHealth}
                disabled={isCheckingHealth}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                Testar Conexão
              </button>
            </div>

            {apiStatus ? (
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${apiStatus.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className={apiStatus.online ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-rose-700 dark:text-rose-400 font-semibold'}>
                    {apiStatus.online ? 'Servidor Conectado & Operacional' : 'Servidor Indisponível'}
                  </span>
                </div>
                {apiStatus.message && (
                  <div className="text-slate-600 dark:text-slate-300">
                    Mensagem: {apiStatus.message}
                  </div>
                )}
                {apiStatus.latencyMs !== undefined && (
                  <div className="text-slate-500 dark:text-slate-400">
                    Latência de resposta: {apiStatus.latencyMs} ms
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 text-[11px]">
                Clique em "Testar Conexão" para verificar a conectividade com o backend.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-2.5 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Nota sobre o Render.com:</strong> A hospedagem gratuita do Render entra em modo de economia de energia (hibernação) após inatividade. A primeira chamada pode levar cerca de 30-50 segundos para despertar a API.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
              {savedSuccess ? 'Salvo!' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
