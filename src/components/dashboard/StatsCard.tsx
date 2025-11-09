'use client';

import { memo, ReactNode } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
}

export const StatsCard = memo(function StatsCard({ title, value, icon, trend, trendLabel }: StatsCardProps) {
  const isNumber = typeof value === 'number';
  const displayValue = isNumber ? formatCurrency(value) : value;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{displayValue}</p>
          {trend !== undefined && trendLabel && (
            <p className="text-xs text-gray-500 mt-1">
              {trend >= 0 ? '+' : ''}
              {trend.toFixed(1)}% {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full text-blue-600 flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
});

