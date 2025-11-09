"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { Expense, Category } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import { categoryService } from "@/services/category.service";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Hash,
} from "lucide-react";

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export const ExpenseSummary = memo(function ExpenseSummary({
  expenses,
}: ExpenseSummaryProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await categoryService.getAll();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const categoryMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat])),
    [categories]
  );

  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        total: 0,
        average: 0,
        count: 0,
        min: 0,
        max: 0,
        trend: null as number | null,
        averagePerDay: 0,
        dateRange: null as { start: string; end: string } | null,
        expensesByCategory: [] as Array<{ categoryId: string; total: number; count: number }>,
      };
    }

    const amounts = expenses.map((e) => e.amount);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / expenses.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    // Calcular rango de fechas
    const sortedByDate = [...expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const startDate = sortedByDate[0].date;
    const endDate = sortedByDate[sortedByDate.length - 1].date;
    
    // Calcular promedio por día
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const averagePerDay = daysDiff > 0 ? total / daysDiff : total;

    // Calcular tendencia comparando primera mitad con segunda mitad
    let trend: number | null = null;
    if (sortedByDate.length >= 4) {
      const midPoint = Math.floor(sortedByDate.length / 2);
      const firstHalf = sortedByDate.slice(0, midPoint);
      const secondHalf = sortedByDate.slice(midPoint);

      const firstHalfTotal = firstHalf.reduce((sum, e) => sum + e.amount, 0);
      const secondHalfTotal = secondHalf.reduce((sum, e) => sum + e.amount, 0);

      if (firstHalfTotal > 0) {
        trend = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
      }
    }

    // Agrupar por categoría
    const categoryMap = new Map<string, { total: number; count: number }>();
    expenses.forEach((expense) => {
      const existing = categoryMap.get(expense.categoryId) || { total: 0, count: 0 };
      categoryMap.set(expense.categoryId, {
        total: existing.total + expense.amount,
        count: existing.count + 1,
      });
    });
    const expensesByCategory = Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({ categoryId, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 categorías

    return {
      total,
      average,
      count: expenses.length,
      min,
      max,
      trend,
      averagePerDay,
      dateRange: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      expensesByCategory,
    };
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <Card title="Tổng Hợp">
        <div className="text-center py-8">
          <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas principales */}
      <Card title="Tổng Hợp Theo Bộ Lọc">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Tổng tiền */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              {stats.trend !== null && (
                <div className="flex items-center">
                  {stats.trend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1">Tổng Tiền</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(stats.total)}
            </p>
          </div>

          {/* Trung bình */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Trung Bình</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(stats.average)}
            </p>
          </div>

          {/* Số lượng */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Hash className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Số Lượng</p>
            <p className="text-lg font-bold text-gray-900">{stats.count}</p>
          </div>

          {/* Tối thiểu */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Tối Thiểu</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(stats.min)}
            </p>
          </div>

          {/* Tối đa */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Tối Đa</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(stats.max)}
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Rango de fechas y promedio diario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.dateRange && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Khoảng Thời Gian</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.dateRange.start} - {stats.dateRange.end}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-600 mb-1">Trung Bình Mỗi Ngày</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(stats.averagePerDay)}
              </p>
            </div>
          </div>

          {/* Tendencia */}
          {stats.trend !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Xu hướng chi tiêu</span>
              <div className="flex items-center">
                {stats.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    stats.trend >= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.abs(stats.trend).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Top categorías */}
      {stats.expensesByCategory.length > 0 && (
        <Card title="Top Danh Mục">
          <div className="space-y-3">
            {stats.expensesByCategory.map((item) => {
              const category = categoryMap.get(item.categoryId);
              const percentage = (item.total / stats.total) * 100;
              return (
                <div key={item.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {category && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span className="text-gray-700 font-medium">
                        {category?.name || `Danh mục ID: ${item.categoryId}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs">
                        {item.count} giao dịch
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category?.color || "#3B82F6",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% tổng chi tiêu
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
});

