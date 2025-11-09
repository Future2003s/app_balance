'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';

interface TopCategory {
  categoryId: string;
  categoryName: string;
  total: number;
  color: string;
}

interface TopCategoriesProps {
  categories: TopCategory[];
}

export const TopCategories = memo(function TopCategories({ categories }: TopCategoriesProps) {
  if (categories.length === 0) {
    return (
      <Card title="Top Danh Mục">
        <p className="text-gray-500 text-center py-4">
          Chưa có chi tiêu nào được ghi nhận
        </p>
      </Card>
    );
  }

  const maxTotal = Math.max(...categories.map((c) => c.total));

  return (
    <Card title="Top 5 Danh Mục">
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = (category.total / maxTotal) * 100;
          return (
            <div key={category.categoryId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {category.categoryName}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(category.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});

