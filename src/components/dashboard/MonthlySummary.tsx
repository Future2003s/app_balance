"use client";

import { memo } from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/format";
import { MonthlyExpense } from "@/lib/types";

interface MonthlySummaryProps {
  monthlyExpenses: MonthlyExpense[];
}

export const MonthlySummary = memo(function MonthlySummary({
  monthlyExpenses,
}: MonthlySummaryProps) {
  if (monthlyExpenses.length === 0) {
    return (
      <Card title="Tổng Kết Theo Tháng">
        <p className="text-gray-500 text-center py-4">
          Chưa có dữ liệu chi tiêu
        </p>
      </Card>
    );
  }

  // Ordenar por mes más reciente primero y limitar a los últimos 6 meses
  // El servicio ya devuelve los meses en orden cronológico, así que invertimos el array
  const sortedExpenses = [...monthlyExpenses]
    .reverse() // Invertir para mostrar el más reciente primero
    .slice(0, 6); // Solo mostrar los últimos 6 meses

  // Encontrar el máximo para calcular porcentajes
  const maxTotal = Math.max(...sortedExpenses.map((m) => m.total));

  return (
    <Card title="Tổng Kết Theo Tháng (6 Tháng Gần Nhất)">
      <div className="space-y-3">
        {sortedExpenses.map((monthly) => {
          const percentage =
            maxTotal > 0 ? (monthly.total / maxTotal) * 100 : 0;

          return (
            <div key={monthly.month} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {monthly.month}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {monthly.count} giao dịch
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(monthly.total)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {monthlyExpenses.length > 6 && (
          <div className="pt-3 border-t border-gray-200 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Tổng {monthlyExpenses.length} tháng
              </span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(
                  monthlyExpenses.reduce((sum, m) => sum + m.total, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

