"use client";

import type { TrafficPoint } from "@/lib/types";

const HEIGHT = 160;
const BAR_GAP = 2;

export function TrafficChart({ series }: { series: TrafficPoint[] }) {
  if (series.length === 0) {
    return <p className="text-sm text-adm-muted">No pageview data in this range yet.</p>;
  }

  const max = Math.max(1, ...series.map((p) => p.count));
  const barWidth = Math.max(3, Math.min(18, 640 / series.length - BAR_GAP));
  const width = series.length * (barWidth + BAR_GAP);

  // Show at most 6 date labels, evenly spaced, so long ranges don't collide.
  const labelStep = Math.max(1, Math.ceil(series.length / 6));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT + 24}`}
        width={width}
        height={HEIGHT + 24}
        role="img"
        aria-label="Daily pageviews"
      >
        <line x1={0} y1={HEIGHT} x2={width} y2={HEIGHT} stroke="var(--adm-hairline)" strokeWidth={1} />
        {series.map((p, i) => {
          const barHeight = Math.max(2, (p.count / max) * (HEIGHT - 8));
          const x = i * (barWidth + BAR_GAP);
          const y = HEIGHT - barHeight;
          return (
            <g key={p.date}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={Math.min(4, barWidth / 2)}
                fill="var(--adm-primary)"
              >
                <title>
                  {p.date}: {p.count} pageviews
                </title>
              </rect>
              {i % labelStep === 0 ? (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--adm-font-body)"
                  fill="var(--adm-muted)"
                >
                  {p.date.slice(5)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
