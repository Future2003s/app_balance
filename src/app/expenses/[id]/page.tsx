'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useIsClient } from '@/hooks/useIsClient';
import { expenseService } from '@/services/expense.service';
import { Expense } from '@/lib/types';

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const isClient = useIsClient();
  const [expense, setExpense] = useState<Expense | null>(null);
  const id = params.id as string;

  useEffect(() => {
    if (isClient && id) {
      const loadExpense = async () => {
        const found = await expenseService.getById(id);
        if (found) {
          setExpense(found);
        } else {
          router.push('/expenses');
        }
      };
      loadExpense();
    }
  }, [isClient, id, router]);

  const handleSuccess = () => {
    router.push('/expenses');
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

  if (!expense) {
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Chỉnh Sửa Chi Tiêu</h1>
        <ExpenseForm expense={expense} onSuccess={handleSuccess} />
      </div>
    </DashboardLayout>
  );
}

