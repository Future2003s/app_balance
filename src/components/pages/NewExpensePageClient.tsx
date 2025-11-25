"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { useIsClient } from "@/hooks/useIsClient";
import { Button } from "@/components/ui/Button";

export function NewExpensePageClient() {
  const router = useRouter();
  const isClient = useIsClient();

  const handleSuccess = () => {
    router.push("/expenses");
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
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase">
              Chi tiêu
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Thêm Chi Tiêu Mới
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Điền đầy đủ số tiền, mô tả, danh mục và thời gian để ghi nhận giao
              dịch.
            </p>
          </div>
          <Link href="/expenses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>

        <ExpenseForm onSuccess={handleSuccess} />
      </div>
    </DashboardLayout>
  );
}
