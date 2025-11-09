'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { useIsClient } from '@/hooks/useIsClient';
import { expenseService } from '@/services/expense.service';
import { Expense, ExpenseFilters as ExpenseFiltersType } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
  const isClient = useIsClient();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFiltersType>({});

  useEffect(() => {
    if (isClient) {
      loadExpenses();
    }
  }, [isClient, filters]);

  const loadExpenses = async () => {
    const filtered = await expenseService.filter(filters);
    setExpenses(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
      await expenseService.delete(id);
      loadExpenses();
    }
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
        <ExpenseFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Expenses List */}
        <Card>
          <ExpenseList
            expenses={expenses}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

