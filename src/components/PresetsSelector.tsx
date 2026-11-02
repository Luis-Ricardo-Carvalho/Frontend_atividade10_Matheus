import React from 'react';
import { ROCK_PRESETS, RockPreset, ChemicalOxides } from '../types/petrology';
import { Sparkles, RotateCcw, Scale } from 'lucide-react';

interface PresetsSelectorProps {
  onSelectPreset: (preset: RockPreset) => void;
  onClear: () => void;
  onNormalize: () => void;
  currentSum: number;
  disabled?: boolean;
}

export const PresetsSelector: React.FC<PresetsSelectorProps> = ({
  onSelectPreset,
  onClear,
  onNormalize,
  currentSum,
  disabled = false
}) => {
  const isSumBalanced = currentSum >= 98.0 && currentSum <= 102.0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Amostras Padrão de Calibração (Presets)
          </span>
        </div>

        {/* Sum Indicator and Normalization */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border ${
              isSumBalanced
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title="Soma geoquímica dos 10 óxidos. Em análises petrológicas reais por fluorescência de raios-X (FRX), a soma analítica ideal situa-se entre 98.5% e 101.5%."
          >
            <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-sans">Soma:</span>
            <strong className="tabular-nums">{currentSum.toFixed(2)}%</strong>
          </div>

          <button
            type="button"
            onClick={onNormalize}
            disabled={disabled || currentSum <= 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40"
            title="Recalcula proporcionalmente os 10 teores para totalizarem exatamente 100.00%"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Normalizar 100%</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-40"
            title="Zerar todos os campos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {ROCK_PRESETS.map((preset) => {
          const isTaskSample = preset.id === 'basalt-assignment';
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-2.5 rounded-lg border transition-all duration-150 disabled:opacity-50 ${
                isTaskSample
                  ? 'bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border-blue-300 dark:border-blue-800'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {preset.name}
                </span>
                {isTaskSample && (
                  <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1 py-0.2 rounded">
                    Tarefa
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
