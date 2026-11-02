import React from 'react';
import { OxideFieldDefinition } from '../types/petrology';

interface OxideInputCardProps {
  def: OxideFieldDefinition;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const OxideInputCard: React.FC<OxideInputCardProps> = ({
  def,
  value,
  onChange,
  disabled = false
}) => {
  const isOutOfTypical = value < def.typicalMin * 0.5 || value > def.typicalMax * 1.5;
  const isHigh = value > def.typicalMax;
  const isLow = value < def.typicalMin;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const adjustValue = (delta: number) => {
    const newVal = Math.max(0, Math.round((Number(value || 0) + delta) * 100) / 100);
    onChange(newVal);
  };

  // Category badge colors
  const categoryStyles = {
    felsic: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    mafic: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    calcic: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    accessory: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
  };

  const categoryLabels = {
    felsic: 'Félsico / Sílica',
    mafic: 'Máfico / Fe-Mg',
    calcic: 'Cálcico',
    accessory: 'Acessório'
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border transition-all duration-200 rounded-xl p-3.5 shadow-xs ${
        isOutOfTypical
          ? 'border-amber-300 dark:border-amber-700/70 bg-amber-50/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header: Formula & Label */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
              {def.formulaHtml}
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              ({def.plainKey})
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[160px] sm:max-w-[200px]" title={def.namePt}>
            {def.namePt}
          </div>
        </div>

        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${categoryStyles[def.category]}`}
        >
          {categoryLabels[def.category]}
        </span>
      </div>

      {/* Numeric Input & Steppers */}
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <input
            type="number"
            step={def.step}
            min="0"
            max="100"
            value={value === 0 ? '0' : value}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-full text-right font-mono font-bold text-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:opacity-50"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-slate-400 select-none">
            %
          </span>
        </div>

        {/* Stepper Buttons */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => adjustValue(def.step)}
            disabled={disabled}
            aria-label={`Incrementar ${def.formulaHtml}`}
            className="w-7 h-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded flex items-center justify-center text-[10px] transition-colors disabled:opacity-40"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => adjustValue(-def.step)}
            disabled={disabled}
            aria-label={`Decrementar ${def.formulaHtml}`}
            className="w-7 h-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded flex items-center justify-center text-[10px] transition-colors disabled:opacity-40"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Range Bar & Scientific bounds note */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
          <span>Típico: {def.typicalMin} – {def.typicalMax}%</span>
          {isHigh && (
            <span className="text-amber-600 dark:text-amber-400 font-sans font-medium">Acima do típico</span>
          )}
          {isLow && value > 0 && (
            <span className="text-slate-500 dark:text-slate-400 font-sans">Abaixo do típico</span>
          )}
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isOutOfTypical ? 'bg-amber-500' : 'bg-blue-600 dark:bg-blue-500'
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, (value / (def.typicalMax * 1.4)) * 100))}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};
