"use client";

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface MiniSparklineProps {
  data: any[];
  dataKey: string;
  color: string;
  domain?: [number | string, number | string];
}

export function MiniSparkline({ data, dataKey, color, domain = [0, 'dataMax'] }: MiniSparklineProps) {
  return (
    <div className="h-[40px] w-full mt-2 opacity-80 group-hover:opacity-100 transition-opacity" title="7 Day Trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={domain} type="number" />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#color-${dataKey})`} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
