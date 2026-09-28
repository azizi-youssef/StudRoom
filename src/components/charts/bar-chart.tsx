'use client';

import React from 'react';

interface BarChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function BarChart({
  data,
  labels,
  color = '#0EA5C6',
  height = 200,
  showGrid = true,
}: BarChartProps) {
  const max = Math.max(...data, 1);
  const barWidth = 80 / data.length;
  const gap = barWidth * 0.25;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height: height - 28 }}>
        {showGrid && (
          <>
            <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border-default)" strokeOpacity="0.8" strokeWidth="0.4" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-default)" strokeOpacity="0.8" strokeWidth="0.4" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border-default)" strokeOpacity="0.8" strokeWidth="0.4" />
          </>
        )}
        {data.map((value, index) => {
          const x = (index / data.length) * 100 + gap / 2;
          const barHeight = (value / max) * 80;
          const y = 100 - barHeight - 10;
          const width = barWidth - gap;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={barHeight || 0}
              fill={color}
              fillOpacity="0.85"
              rx="1.5"
              className="hover:fill-opacity-100 transition-all"
            />
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1.5 text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
          {labels.map((label, index) => (
            <span key={index} className="text-center truncate" style={{ width: `${100 / labels.length}%` }}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
