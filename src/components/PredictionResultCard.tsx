import React, { useState } from 'react';
import { PredictionResponse, ChemicalOxides } from '../types/petrology';
import { Layers, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';

interface PredictionResultCardProps {
  result: PredictionResponse | null;
  currentOxides: ChemicalOxides;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  currentOxides,
  loading,
  error,
  onRetry
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Petrological knowledge database for returned rock types
  const getRockInfo = (name?: string) => {
    if (!name) return null;
    const lower = name.toLowerCase().trim();

    if (lower.includes('basaltic andesite') || lower.includes('andesito bas')) {
      return {
        type: 'Ígnea Vulcânica Extrusiva · Máfica a Intermediária',
        texture: 'Afanítica a porfirítica',
        minerals: 'Plagioclásio cálcio-sódico, piroxênios (augita), olivina subordinada',
        environment: 'Arcos de ilha e bordas continentais de subducção',
        color: 'Cinza-escuro a cinza-médio'
      };
    }
    if (lower.includes('basalt') || lower.includes('basalto')) {
      return {
        type: 'Ígnea Vulcânica Extrusiva · Máfica',
        texture: 'Afanítica fina a vítrea, frequentemente vesicular',
        minerals: 'Plagioclásio cálcico (labradorita), piroxênio (augita), olivina',
        environment: 'Dorsais meso-oceânicas, vulcanismo de ponto quente (hotspot) e derrames continentais (Paraná/Decão)',
        color: 'Cinza-escuro a preto denso'
      };
    }
    if (lower.includes('andesite') || lower.includes('andesito')) {
      return {
        type: 'Ígnea Vulcânica Extrusiva · Intermediária',
        texture: 'Porfirítica com fenocristais de plagioclásio ou anfibólio',
        minerals: 'Andesina, hornblenda, biotita, piroxênio subordinado',
        environment: 'Zonas de colisão de placas e arcos vulcânicos (Cadeia dos Andes)',
        color: 'Cinza-médio a cinza-acastanhado'
      };
    }
    if (lower.includes('dacite') || lower.includes('dacito')) {
      return {
        type: 'Ígnea Vulcânica Extrusiva · Félsica / Ácida',
        texture: 'Porfirítica a afanítica com quartzo e plagioclásio',
        minerals: 'Plagioclásio sódico (oligoclásio), quartzo, biotita, hornblenda',
        environment: 'Vulcanismo explosivo de arco continental (ex: Monte Santa Helena)',
        color: 'Cinza-claro a amarelado'
      };
    }
    if (lower.includes('rhyolite') || lower.includes('riolito')) {
      return {
        type: 'Ígnea Vulcânica Extrusiva · Félsica / Ácida (Equivalente ao Granito)',
        texture: 'Afanítica, porfirítica, fluidal ou esferulítica',
        minerals: 'Quartzo, feldspato alcalino (sanidina, ortoclásio), biotita',
        environment: 'Caldeiras continentais e erupções piroclásticas de alta viscosidade',
        color: 'Rosa, cinza-claro, avermelhado ou creme'
      };
    }
    return {
      type: 'Rocha Ígnea Magmática',
      texture: 'Cristalina afanítica',
      minerals: 'Silicatos magmáticos',
      environment: 'Crosta terrestre e processos magmáticos',
      color: 'Variável'
    };
  };

  const rockInfo = result?.predicao ? getRockInfo(result.predicao) : null;

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="relative w-16 h-16 mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/40 border-t-blue-600 dark:border-t-blue-500 animate-spin" />
          <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Consultando Modelo BayesNet...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-3">
          Enviando teores percentuais de óxidos para o servidor e calculando probabilidades a posteriori.
        </p>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
          Aguardando resposta do backend...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-rose-800 dark:text-rose-300">
              Falha na Comunicação com a API
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1 mb-4 leading-relaxed">
              {error}
            </p>
            <div className="flex items-center gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                >
                  Tentar Novamente
                </button>
              )}
              <span className="text-xs text-slate-500">
                Verifique se o backend no Render já concluiu a inicialização (cold-start).
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state when no prediction made yet
  if (!result) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Nenhuma Predição Realizada
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
          Preencha os teores de óxidos no formulário ou selecione uma amostra pronta para classificar o tipo de rocha.
        </p>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">
          Aguardando submissão do formulário
        </span>
      </div>
    );
  }

  // Active prediction highlight state
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/80 dark:border-blue-500/60 rounded-xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative subtle backdrop gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section with Code & Confidence */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-500 dark:text-slate-400">
            Resultado da Classificação Geoquímica
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result.codigo !== undefined && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Código: <strong>{result.codigo}</strong>
            </span>
          )}
          {result.confianca !== undefined && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Confiança: {(result.confianca * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Main Feature Rock Prediction Headline */}
      <div className="mb-5">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
          Tipo de Rocha Predito (rock_name):
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
            {result.predicao}
          </h2>
          {rockInfo && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              · {rockInfo.type}
            </span>
          )}
        </div>
      </div>

      {/* Geological summary details */}
      {rockInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800 mb-5 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-mono">Mineralogia Principal:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{rockInfo.minerals}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-mono">Ambiente Tectônico Típico:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{rockInfo.environment}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-mono">Textura Observada:</span>
            <span className="text-slate-800 dark:text-slate-200">{rockInfo.texture}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-mono">Coloração Característica:</span>
            <span className="text-slate-800 dark:text-slate-200">{rockInfo.color}</span>
          </div>
        </div>
      )}

      {/* Multi-class probabilities if returned by BayesNet model */}
      {result.probabilidades && Object.keys(result.probabilidades).length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 mb-2">
            Distribuição de Probabilidades por Classe:
          </div>
          <div className="space-y-2">
            {Object.entries(result.probabilidades)
              .sort(([, a], [, b]) => b - a)
              .map(([rock, prob]) => {
                const percent = (prob * 100);
                const isWinner = rock.toLowerCase() === result.predicao.toLowerCase();
                return (
                  <div key={rock} className="text-xs">
                    <div className="flex items-center justify-between mb-0.5 font-mono">
                      <span className={isWinner ? 'font-bold text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}>
                        {rock} {isWinner && '★'}
                      </span>
                      <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {percent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(1, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Collapsible Raw JSON inspector for verification */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {showJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showJson ? 'Ocultar Resposta Bruta da API' : 'Inspecionar JSON Retornado da API'}
          </button>

          {showJson && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copiado!' : 'Copiar JSON'}
            </button>
          )}
        </div>

        {showJson && (
          <pre className="mt-2.5 p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
