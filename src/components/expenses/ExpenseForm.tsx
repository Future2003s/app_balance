"use client";

import { useState, useEffect } from "react";
import { Expense, ExpenseFormData } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { DateInput } from "@/components/ui/DateInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { expenseService } from "@/services/expense.service";
import { categoryService } from "@/services/category.service";
import { paymentMethodService } from "@/services/paymentMethod.service";
import {
  formatDateForInput,
  formatNumber,
  parseFormattedNumber,
} from "@/lib/utils/format";

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: "",
    note: "",
    isCompleted: false,
    categoryId: "",
    paymentMethodId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpenseFormData, string>>
  >({});
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Cargar datos en paralelo
      const [cats, pms] = await Promise.all([
        categoryService.getAll(),
        paymentMethodService.getAll(),
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        description: expense.description,
        note: expense.note || "",
        isCompleted: expense.isCompleted || false,
        categoryId: expense.categoryId,
        paymentMethodId: expense.paymentMethodId,
        date: formatDateForInput(expense.date),
      });
      setFormattedAmount(formatNumber(expense.amount));
    } else {
      setFormattedAmount("");
    }
  }, [expense]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Số tiền phải lớn hơn 0";
    }

    if (!formData.description || formData.description.trim().length < 3) {
      newErrors.description = "Mô tả phải có ít nhất 3 ký tự";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Bạn phải chọn một danh mục";
    }

    if (!formData.paymentMethodId) {
      newErrors.paymentMethodId = "Bạn phải chọn một phương thức thanh toán";
    }

    if (!formData.date) {
      newErrors.date = "Bạn phải chọn một ngày";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (expense) {
      await expenseService.update(expense.id, formData);
    } else {
      await expenseService.create(formData);
    }

    onSuccess();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Input
          type="text"
          label="Số Tiền"
          value={formattedAmount}
          onChange={(e) => {
            const inputValue = e.target.value;

            // Si está vacío, limpiar todo
            if (inputValue === "") {
              setFormattedAmount("");
              setFormData({ ...formData, amount: 0 });
              return;
            }

            // Eliminar todos los caracteres que no sean dígitos
            // (eliminar puntos de formato anterior)
            const digitsOnly = inputValue.replace(/\D/g, "");

            // Si no hay dígitos, limpiar
            if (digitsOnly === "") {
              setFormattedAmount("");
              setFormData({ ...formData, amount: 0 });
              return;
            }

            // Convertir a número y formatear
            const numericValue = parseInt(digitsOnly, 10);
            if (!isNaN(numericValue)) {
              setFormData({ ...formData, amount: numericValue });
              setFormattedAmount(formatNumber(numericValue));
            }
          }}
          onBlur={(e) => {
            // Asegurar formato correcto al perder el foco
            const numericValue = parseFormattedNumber(e.target.value);
            if (numericValue > 0) {
              setFormData({ ...formData, amount: numericValue });
              setFormattedAmount(formatNumber(numericValue));
            } else {
              setFormattedAmount("");
              setFormData({ ...formData, amount: 0 });
            }
          }}
          error={errors.amount}
          placeholder="Nhập số tiền"
          required
        />

        <Input
          type="text"
          label="Mô Tả"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          error={errors.description}
          placeholder="Ví dụ: Ăn trưa tại nhà hàng"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi Chú (Tùy chọn)
          </label>
          <textarea
            value={formData.note || ""}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Ghi chú thêm về chi tiêu này..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {(formData.note || "").length}/500 ký tự
          </p>
        </div>

        <Select
          label="Danh Mục"
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          error={errors.categoryId}
          options={[
            { value: "", label: "Chọn một danh mục" },
            ...categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })),
          ]}
          required
        />

        <Select
          label="Phương Thức Thanh Toán"
          value={formData.paymentMethodId}
          onChange={(e) =>
            setFormData({ ...formData, paymentMethodId: e.target.value })
          }
          error={errors.paymentMethodId}
          options={[
            { value: "", label: "Chọn một phương thức thanh toán" },
            ...paymentMethods.map((pm) => ({
              value: pm.id,
              label: pm.name,
            })),
          ]}
          required
        />

        <DateInput
          label="Ngày"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="isCompleted"
            checked={formData.isCompleted || false}
            onChange={(e) =>
              setFormData({ ...formData, isCompleted: e.target.checked })
            }
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="isCompleted"
            className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
          >
            Đánh dấu là đã hoàn thành
          </label>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            {expense ? "Cập Nhật" : "Tạo"} Chi Tiêu
          </Button>
        </div>
      </form>
    </Card>
  );
}
