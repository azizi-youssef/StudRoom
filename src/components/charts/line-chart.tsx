'use client';

import React from 'react';

interface LineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function LineChart({
  data,
  labels,
  color = '#0EA5C6',
  height = 200,
  showGrid = true,
}: LineChartProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

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
        {/* Area fill */}
        <polygon points={areaPoints} fill={color} fillOpacity="0.08" />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {data.map((value, index) => {
          const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
          const y = 100 - ((value - min) / range) * 80 - 10;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2.5"
              fill="white"
              stroke={color}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1.5 text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
