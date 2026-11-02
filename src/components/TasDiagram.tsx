import React, { useMemo } from 'react';

interface TasDiagramProps {
  sio2: number;
  na2o: number;
  k2o: number;
  predictedRock?: string;
}

interface RockField {
  name: string;
  namePt: string;
  matchNames: string[];
  path: string; // SVG path command in SVG data coordinates (SiO2 from 40 to 80, Alkalis from 0 to 16)
  labelX: number;
  labelY: number;
  color: string;
}

export const TasDiagram: React.FC<TasDiagramProps> = ({
  sio2,
  na2o,
  k2o,
  predictedRock
}) => {
  const totalAlkalis = useMemo(() => {
    const val = (Number(na2o) || 0) + (Number(k2o) || 0);
    return Math.round(val * 100) / 100;
  }, [na2o, k2o]);

  // Diagram boundaries
  // X: SiO2 (38 to 80)
  // Y: Na2O + K2O (0 to 16)
  const minX = 38;
  const maxX = 82;
  const minY = 0;
  const maxY = 16;

  // ViewBox dimensions
  const width = 540;
  const height = 360;
  const padding = { top: 24, right: 30, bottom: 44, left: 52 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Coordinate conversion functions
  const toSvgX = (xVal: number) => {
    const clamped = Math.max(minX, Math.min(maxX, xVal));
    return padding.left + ((clamped - minX) / (maxX - minX)) * plotWidth;
  };

  const toSvgY = (yVal: number) => {
    const clamped = Math.max(minY, Math.min(maxY, yVal));
    // Y is inverted in SVG
    return padding.top + (1 - (clamped - minY) / (maxY - minY)) * plotHeight;
  };

  // Convert array of [x, y] to SVG path d string
  const toPath = (coords: [number, number][]) => {
    if (coords.length === 0) return '';
    return coords
      .map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(y).toFixed(1)}`)
      .join(' ') + ' Z';
  };

  // Simplified Petrological TAS Fields (Le Maitre et al.)
  const fields: RockField[] = useMemo(() => [
    {
      name: 'Picrobasalt',
      namePt: 'Picrobasalto',
      matchNames: ['picrobasalt'],
      path: toPath([[41, 0], [45, 0], [45, 3], [41, 3]]),
      labelX: 43,
      labelY: 1.5,
      color: 'rgba(100, 116, 139, 0.08)'
    },
    {
      name: 'Basalt',
      namePt: 'Basalto',
      matchNames: ['basalt', 'basalto'],
      path: toPath([[45, 0], [52, 0], [52, 5], [45, 3]]),
      labelX: 48.5,
      labelY: 2.2,
      color: 'rgba(59, 130, 246, 0.12)'
    },
    {
      name: 'Basaltic Andesite',
      namePt: 'Andesito Basáltico',
      matchNames: ['basaltic andesite', 'andesito basáltico', 'basaltic-andesite'],
      path: toPath([[52, 0], [57, 0], [57, 5.9], [52, 5]]),
      labelX: 54.5,
      labelY: 2.8,
      color: 'rgba(16, 185, 129, 0.12)'
    },
    {
      name: 'Andesite',
      namePt: 'Andesito',
      matchNames: ['andesite', 'andesito'],
      path: toPath([[57, 0], [63, 0], [63, 7], [57, 5.9]]),
      labelX: 60,
      labelY: 3.5,
      color: 'rgba(234, 88, 12, 0.12)'
    },
    {
      name: 'Dacite',
      namePt: 'Dacito',
      matchNames: ['dacite', 'dacito'],
      path: toPath([[63, 0], [77, 0], [69, 8], [63, 7]]),
      labelX: 67,
      labelY: 4,
      color: 'rgba(217, 119, 6, 0.12)'
    },
    {
      name: 'Rhyolite',
      namePt: 'Riolito',
      matchNames: ['rhyolite', 'riolito'],
      path: toPath([[69, 8], [77, 0], [80, 0], [80, 15], [70, 15], [69, 13]]),
      labelX: 74,
      labelY: 7,
      color: 'rgba(168, 85, 247, 0.12)'
    },
    {
      name: 'Trachybasalt',
      namePt: 'Traquibasalto',
      matchNames: ['trachybasalt', 'traquibasalto'],
      path: toPath([[45, 3], [52, 5], [49.4, 7.3], [45, 5]]),
      labelX: 47.8,
      labelY: 5.2,
      color: 'rgba(99, 102, 241, 0.08)'
    },
    {
      name: 'Trachyandesite',
      namePt: 'Traquiandesito',
      matchNames: ['trachyandesite', 'traquiandesito', 'basaltic trachyandesite'],
      path: toPath([[52, 5], [57, 5.9], [53, 9.3], [49.4, 7.3]]),
      labelX: 52.8,
      labelY: 7.2,
      color: 'rgba(14, 165, 233, 0.08)'
    },
    {
      name: 'Trachyte',
      namePt: 'Traquito',
      matchNames: ['trachyte', 'traquito', 'trachydacite'],
      path: toPath([[57, 5.9], [63, 7], [69, 8], [69, 13], [58, 12], [53, 9.3]]),
      labelX: 61.5,
      labelY: 10,
      color: 'rgba(236, 72, 153, 0.08)'
    }
  ], []);

  // Check which field matches predicted rock
  const activeField = useMemo(() => {
    if (!predictedRock) return null;
    const lower = predictedRock.toLowerCase().trim();
    return fields.find(f => f.matchNames.some(m => lower.includes(m)));
  }, [predictedRock, fields]);

  // Point coordinates
  const currentX = toSvgX(sio2 || 0);
  const currentY = toSvgY(totalAlkalis || 0);
  const isInside = sio2 >= minX && sio2 <= maxX && totalAlkalis >= minY && totalAlkalis <= maxY;

  // Ticks
  const xTicks = [40, 45, 50, 55, 60, 65, 70, 75, 80];
  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
            Diagrama TAS · Classificação Geoquímica
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Total Alkali - Silica (Le Maitre, 1989)
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
          <span>
            SiO₂: <strong className="text-blue-600 dark:text-blue-400">{sio2 ? sio2.toFixed(2) : '0.00'}%</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>
            (Na₂O + K₂O): <strong className="text-amber-600 dark:text-amber-400">{totalAlkalis.toFixed(2)}%</strong>
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: '320px' }}
        >
          {/* Background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            stroke="#cbd5e1"
            className="dark:stroke-slate-700"
            strokeWidth="1"
          />

          {/* Grid lines */}
          {xTicks.map(x => (
            <line
              key={`grid-x-${x}`}
              x1={toSvgX(x)}
              y1={padding.top}
              x2={toSvgX(x)}
              y2={padding.top + plotHeight}
              stroke="#f1f5f9"
              className="dark:stroke-slate-800"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          ))}

          {yTicks.map(y => (
            <line
              key={`grid-y-${y}`}
              x1={padding.left}
              y1={toSvgY(y)}
              x2={padding.left + plotWidth}
              y2={toSvgY(y)}
              stroke="#f1f5f9"
              className="dark:stroke-slate-800"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          ))}

          {/* Geological Fields */}
          {fields.map(f => {
            const isTarget = activeField?.name === f.name;
            return (
              <g key={f.name}>
                <path
                  d={f.path}
                  fill={isTarget ? 'rgba(59, 130, 246, 0.28)' : f.color}
                  stroke={isTarget ? '#2563eb' : '#94a3b8'}
                  className="transition-colors duration-200 dark:stroke-slate-600"
                  strokeWidth={isTarget ? 1.75 : 0.8}
                />
                <text
                  x={toSvgX(f.labelX)}
                  y={toSvgY(f.labelY)}
                  textAnchor="middle"
                  className={`text-[9.5px] font-mono pointer-events-none ${
                    isTarget
                      ? 'fill-blue-700 dark:fill-blue-300 font-bold'
                      : 'fill-slate-500 dark:fill-slate-400 font-medium'
                  }`}
                >
                  {f.name}
                </text>
              </g>
            );
          })}

          {/* Axis labels & Ticks */}
          {xTicks.map(x => (
            <g key={`x-tick-${x}`}>
              <line
                x1={toSvgX(x)}
                y1={padding.top + plotHeight}
                x2={toSvgX(x)}
                y2={padding.top + plotHeight + 5}
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={toSvgX(x)}
                y={padding.top + plotHeight + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
              >
                {x}
              </text>
            </g>
          ))}

          {yTicks.map(y => (
            <g key={`y-tick-${y}`}>
              <line
                x1={padding.left - 5}
                y1={toSvgY(y)}
                x2={padding.left}
                y2={toSvgY(y)}
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={toSvgY(y) + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
              >
                {y}
              </text>
            </g>
          ))}

          {/* Axis Titles */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] font-medium fill-slate-700 dark:fill-slate-300"
          >
            SiO₂ (wt%) — Teor de Sílica
          </text>
          <text
            x={14}
            y={padding.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 14, ${padding.top + plotHeight / 2})`}
            className="text-[11px] font-medium fill-slate-700 dark:fill-slate-300"
          >
            Na₂O + K₂O (wt%) — Álcalis Totais
          </text>

          {/* Live Sample Marker */}
          {isInside && (
            <g>
              {/* Outer pulse ring */}
              <circle
                cx={currentX}
                cy={currentY}
                r={9}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  values="6;13;6"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.1;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Center point */}
              <circle
                cx={currentX}
                cy={currentY}
                r={4.5}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* HUD Tag */}
              <g transform={`translate(${currentX > width - 110 ? currentX - 105 : currentX + 8}, ${currentY > height - 40 ? currentY - 26 : currentY - 10})`}>
                <rect
                  width="98"
                  height="22"
                  rx="4"
                  fill="#0f172a"
                  opacity="0.9"
                />
                <text
                  x="49"
                  y="14"
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-white font-medium"
                >
                  Amostra Atual
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
        <span>Sub-saturada &lt; 45% (Máfica) · 52-63% (Intermediária) · &gt; 63% (Félsica/Ácida)</span>
        {predictedRock && (
          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
            Campo Ativo: {predictedRock}
          </span>
        )}
      </div>
    </div>
  );
};
