import React from 'react';
import { HistoryRecord, ChemicalOxides } from '../types/petrology';
import { History, Download, Trash2, ArrowUpRight } from 'lucide-react';

interface HistorySectionProps {
  records: HistoryRecord[];
  onLoadRecord: (oxides: ChemicalOxides) => void;
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  records,
  onLoadRecord,
  onClearHistory
}) => {
  const exportCsv = () => {
    if (records.length === 0) return;
    const headers = [
      'Data/Hora',
      'Predição',
      'Confiança',
      'Código',
      'SiO2n',
      'TiO2n',
      'Al2O3n',
      'FeO*n',
      'MnOn',
      'MgOn',
      'CaOn',
      'Na2On',
      'K2On',
      'P2O5n'
    ];

    const rows = records.map(r => [
      `"${r.timestamp}"`,
      `"${r.prediction}"`,
      r.confidence !== undefined ? (r.confidence * 100).toFixed(2) + '%' : '',
      r.codigo ?? '',
      r.oxides.SiO2n,
      r.oxides.TiO2n,
      r.oxides.Al2O3n,
      r.oxides['FeO*n'],
      r.oxides.MnOn,
      r.oxides.MgOn,
      r.oxides.CaOn,
      r.oxides.Na2On,
      r.oxides.K2On,
      r.oxides.P2O5n
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `predicoes_petroclass_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center shadow-xs">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
          <History className="w-5 h-5" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Histórico de Análises
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Suas análises e classificações anteriores serão salvas automaticamente aqui para referência e exportação.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Histórico Recente de Predições ({records.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <th className="py-2.5 px-3">Data/Hora</th>
              <th className="py-2.5 px-3">Rocha Predita</th>
              <th className="py-2.5 px-3">Confiança</th>
              <th className="py-2.5 px-3">SiO₂</th>
              <th className="py-2.5 px-3">Al₂O₃</th>
              <th className="py-2.5 px-3">FeO*</th>
              <th className="py-2.5 px-3">MgO</th>
              <th className="py-2.5 px-3">Na₂O+K₂O</th>
              <th className="py-2.5 px-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-slate-700 dark:text-slate-300">
            {records.map((r) => {
              const alkalis = (Number(r.oxides.Na2On) || 0) + (Number(r.oxides.K2On) || 0);
              return (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {r.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {r.prediction}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {r.confidence !== undefined ? `${(r.confidence * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {r.oxides.SiO2n.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {r.oxides.Al2O3n.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {r.oxides['FeO*n'].toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {r.oxides.MgOn.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {alkalis.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onLoadRecord(r.oxides)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Carregar estes teores no formulário"
                    >
                      <span>Carregar</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
