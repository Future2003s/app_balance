"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useIsClient } from "@/hooks/useIsClient";
import { expenseService } from "@/services/expense.service";
import { Expense, ExpenseFilters as ExpenseFiltersType } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CardSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFiltersType>({});


  useEffect(() => {
    if (isClient) {
      const loadExpenses = async () => {
        const filtered = await expenseService.filter(filters);
        setExpenses(filtered);
      };
      loadExpenses();
    }
  }, [isClient, filters]);

  // Lắng nghe khi quay lại từ trang edit/new để cập nhật danh sách
  useEffect(() => {
    if (isClient) {
      // Kiểm tra khi component mount hoặc khi quay lại từ trang khác
      const checkForUpdates = () => {
        if (localStorage.getItem('expense_updated') || localStorage.getItem('expense_created')) {
          const loadExpenses = async () => {
            const filtered = await expenseService.filter(filters);
            setExpenses(filtered);
          };
          loadExpenses();
          localStorage.removeItem('expense_updated');
          localStorage.removeItem('expense_created');
        }
      };

      // Kiểm tra ngay khi mount
      checkForUpdates();

      // Lắng nghe sự kiện focus để kiểm tra khi quay lại tab
      const handleFocus = () => {
        checkForUpdates();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isClient, filters]);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
      const success = await expenseService.delete(id);
      if (success) {
        // Cập nhật state local thay vì reload
        setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
      }
    }
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const updated = await expenseService.update(id, { isCompleted });
      if (updated) {
        // Cập nhật state local thay vì reload
        setExpenses(prevExpenses =>
          prevExpenses.map(exp =>
            exp.id === id ? { ...exp, isCompleted } : exp
          )
        );
      }
    } catch (error) {
      console.error("Error toggling complete status:", error);
    }
  };

  const handleExpenseUpdated = (updatedExpense: Expense) => {
    // Cập nhật expense trong danh sách khi quay lại từ trang edit
    setExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
  };

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
        {expenses.length > 0 && (
          <ExpenseSummary expenses={expenses} />
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
              expenses={expenses}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          </Card>
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

