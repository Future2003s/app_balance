"use client";

import { memo } from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { DailyExpense } from "@/lib/types";

interface DailySummaryProps {
  dailyExpenses: DailyExpense[];
}

export const DailySummary = memo(function DailySummary({
  dailyExpenses,
}: DailySummaryProps) {
  if (dailyExpenses.length === 0) {
    return (
      <Card title="Tổng Kết Theo Ngày">
        <p className="text-gray-500 text-center py-4">
          Chưa có dữ liệu chi tiêu
        </p>
      </Card>
    );
  }

  // Mostrar últimos 7 días o todos si son menos
  const displayExpenses = dailyExpenses.slice(-7);

  return (
    <Card title="Tổng Kết Theo Ngày (7 Ngày Gần Nhất)">
      <div className="space-y-3">
        {displayExpenses.map((daily) => {
          const date = new Date(daily.date);
          const dayName = new Intl.DateTimeFormat("vi-VN", {
            weekday: "short",
          }).format(date);
          const dateStr = formatDate(daily.date);

          return (
            <div
              key={daily.date}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {dateStr}
                  </span>
                  <span className="text-xs text-gray-500">({dayName})</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {daily.count} giao dịch
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(daily.total)}
                </p>
              </div>
            </div>
          );
        })}
        {dailyExpenses.length > 7 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Tổng {dailyExpenses.length} ngày
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(
                  dailyExpenses.reduce((sum, d) => sum + d.total, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

