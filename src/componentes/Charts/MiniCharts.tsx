// Conjunto de mini gráficos leves, feitos em SVG puro (sem dependências externas)

type GroupedBarChartProps = {
  labels: string[];
  seriesA: number[];
  seriesB: number[];
  colorA?: string;
  colorB?: string;
  legendA?: string;
  legendB?: string;
  maxValue?: number;
  height?: number;
};

export function GroupedBarChart({
  labels,
  seriesA,
  seriesB,
  colorA = "#c4b5fd",
  colorB = "#7c3aed",
  legendA = "Programado",
  legendB = "Cortado",
  maxValue,
  height = 180,
}: GroupedBarChartProps) {
  const max = maxValue ?? Math.max(...seriesA, ...seriesB, 1);
  const steps = 4;
  const gridValues = Array.from({ length: steps + 1 }, (_, i) =>
    Math.round((max / steps) * i)
  );

  return (
    <div>
      <div className="flex" style={{ height }}>
        <div className="flex flex-col justify-between text-[10px] text-gray-400 pr-2 pb-5">
          {[...gridValues].reverse().map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div className="flex-1 flex items-end gap-3 border-l border-b border-gray-200 pl-2">
          {labels.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="flex items-end gap-1 h-[calc(100%-20px)] w-full justify-center">
                <div
                  className="w-2.5 rounded-t-sm"
                  style={{
                    height: `${(seriesA[i] / max) * 100}%`,
                    backgroundColor: colorA,
                  }}
                  title={`${legendA}: ${seriesA[i]}`}
                />
                <div
                  className="w-2.5 rounded-t-sm"
                  style={{
                    height: `${(seriesB[i] / max) * 100}%`,
                    backgroundColor: colorB,
                  }}
                  title={`${legendB}: ${seriesB[i]}`}
                />
              </div>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: colorA }} />
          {legendA}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: colorB }} />
          {legendB}
        </span>
      </div>
    </div>
  );
}

type SimpleBarChartProps = {
  labels: string[];
  values: number[];
  color?: string;
  height?: number;
};

export function SimpleBarChart({
  labels,
  values,
  color = "#f97316",
  height = 160,
}: SimpleBarChartProps) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div
            className="w-full rounded-t-sm"
            style={{ height: `${(v / max) * 100}%`, backgroundColor: color }}
            title={`${labels[i]}: ${v}`}
          />
          <span className="text-[9px] text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

type LineSeries = {
  name: string;
  color: string;
  values: number[];
};

type MultiLineChartProps = {
  labels: string[];
  series: LineSeries[];
  maxValue?: number;
  height?: number;
};

export function MultiLineChart({
  labels,
  series,
  maxValue,
  height = 180,
}: MultiLineChartProps) {
  const width = 520;
  const paddingLeft = 28;
  const paddingBottom = 20;
  const max = maxValue ?? Math.max(...series.flatMap((s) => s.values), 1);
  const chartW = width - paddingLeft;
  const chartH = height - paddingBottom;
  const stepX = chartW / (labels.length - 1);

  const toPoints = (values: number[]) =>
    values
      .map((v, i) => {
        const x = paddingLeft + i * stepX;
        const y = chartH - (v / max) * chartH;
        return `${x},${y}`;
      })
      .join(" ");

  const gridSteps = 3;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) =>
    Math.round((max / gridSteps) * i)
  );

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {gridValues.map((v) => {
          const y = chartH - (v / max) * chartH;
          return (
            <g key={v}>
              <line x1={paddingLeft} y1={y} x2={width} y2={y} stroke="#f1f1f4" strokeWidth={1} />
              <text x={0} y={y + 3} fontSize={9} fill="#9ca3af">
                {v}
              </text>
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text
            key={label}
            x={paddingLeft + i * stepX}
            y={height - 4}
            fontSize={9}
            fill="#9ca3af"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <polyline points={toPoints(s.values)} fill="none" stroke={s.color} strokeWidth={2} />
            {s.values.map((v, i) => {
              const x = paddingLeft + i * stepX;
              const y = chartH - (v / max) * chartH;
              return <circle key={i} cx={x} cy={y} r={3} fill={s.color} />;
            })}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-gray-500">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}