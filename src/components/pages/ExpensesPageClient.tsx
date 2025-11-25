"use client";

import { useState, lazy, Suspense, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useIsClient } from "@/hooks/useIsClient";
import { ExpenseFilters as ExpenseFiltersType } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CardSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { useExpensesData } from "@/hooks/useExpensesData";

// Lazy loading de componentes pesados
const ExpenseList = lazy(() =>
  import("@/components/expenses/ExpenseList").then((m) => ({
    default: m.ExpenseList,
  }))
);
const ExpenseFilters = lazy(() =>
  import("@/components/expenses/ExpenseFilters").then((m) => ({
    default: m.ExpenseFilters,
  }))
);

export function ExpensesPageClient() {
  const isClient = useIsClient();
  const [filters, setFilters] = useState<ExpenseFiltersType>({});
  const {
    expenses,
    isLoading,
    pendingExpenseIds,
    deleteExpense,
    toggleExpenseCompletion,
  } = useExpensesData({ filters });

  const visibleExpenses = useMemo(
    () => expenses,
    [expenses]
  );

  const summaryExpenses = useMemo(() => {
    if (filters.isCompleted === undefined) {
      return visibleExpenses.filter((expense) => !(expense.isCompleted ?? false));
    }
    return visibleExpenses;
  }, [visibleExpenses, filters.isCompleted]);

  if (!isClient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chi Tiêu</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Quản lý tất cả chi tiêu của bạn
            </p>
          </div>
          <Link href="/expenses/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Thêm Chi Tiêu</span>
              <span className="sm:hidden">Thêm</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Suspense fallback={<CardSkeleton />}>
          <ExpenseFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </Suspense>

        {/* Expense Summary */}
        {summaryExpenses.length > 0 && (
          <ExpenseSummary expenses={summaryExpenses} />
        )}

        {/* Expenses List */}
        <Suspense
          fallback={
            <Card>
              <div className="p-4">
                <Skeleton variant="text" width="30%" height={24} className="mb-4" />
                <TableSkeleton />
              </div>
            </Card>
          }
        >
          <Card>
            <ExpenseList
              expenses={visibleExpenses}
              onDelete={(id) => {
                if (confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
                  deleteExpense(id);
                }
              }}
              onToggleComplete={toggleExpenseCompletion}
              pendingExpenseIds={pendingExpenseIds}
            />
          </Card>
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

