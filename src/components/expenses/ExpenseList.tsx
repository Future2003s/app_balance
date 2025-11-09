"use client";

import { memo, useEffect, useState, useMemo } from "react";
import { Expense, Category, PaymentMethod } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { categoryService } from "@/services/category.service";
import { paymentMethodService } from "@/services/paymentMethod.service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList = memo(function ExpenseList({
  expenses,
  onDelete,
}: ExpenseListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [cats, pms] = await Promise.all([
        categoryService.getAll(),
        paymentMethodService.getAll(),
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
    };
    loadData();
  }, []);

  // Memoizar las funciones de búsqueda
  const categoryMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat])),
    [categories]
  );
  const paymentMethodMap = useMemo(
    () => new Map(paymentMethods.map((pm) => [pm.id, pm])),
    [paymentMethods]
  );

  const getCategory = (id: string) => categoryMap.get(id);
  const getPaymentMethod = (id: string) => paymentMethodMap.get(id);
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Chưa có chi tiêu nào được ghi nhận</p>
        <Link href="/expenses/new">
          <Button>Tạo Chi Tiêu Đầu Tiên</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô Tả
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh Mục
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương Thức
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Tiền
              </th>
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => {
              const category = getCategory(expense.categoryId);
              const paymentMethod = getPaymentMethod(expense.paymentMethodId);

              return (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    {category && (
                      <Badge color={category.color}>
                        {category.name}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paymentMethod?.name || 'N/A'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/expenses/${expense.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {expenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          const paymentMethod = getPaymentMethod(expense.paymentMethodId);

          return (
            <div
              key={expense.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {expense.description}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(expense.date)}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    {category && (
                      <Badge color={category.color}>
                        {category.name}
                      </Badge>
                    )}
                    {paymentMethod && (
                      <span className="text-xs text-gray-500">
                        {paymentMethod.name}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <Link href={`/expenses/${expense.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-1" />
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});

