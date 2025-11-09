'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({ title, children, className, headerAction }: CardProps) {
  return (
    <div className={cn('bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-6', className)}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

