"use client";

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useIsClient } from '@/hooks/useIsClient';

export function NewExpensePageClient() {
  const router = useRouter();
  const isClient = useIsClient();

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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Thêm Chi Tiêu Mới</h1>
        <ExpenseForm onSuccess={handleSuccess} />
      </div>
    </DashboardLayout>
  );
}

