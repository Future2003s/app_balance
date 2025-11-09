"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "@/lib/types";
import { paymentMethodService } from "@/services/paymentMethod.service";
import * as LucideIcons from "lucide-react";

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
  onSuccess: () => void;
  onCancel: () => void;
}

// Iconos disponibles para métodos de pago
const AVAILABLE_ICONS = [
  "Banknote",
  "CreditCard",
  "Wallet",
  "ArrowLeftRight",
  "Smartphone",
  "Building2",
  "Landmark",
  "MoreHorizontal",
] as const;

export function PaymentMethodForm({
  paymentMethod,
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    icon: string;
  }>({
    name: "",
    icon: AVAILABLE_ICONS[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        name: paymentMethod.name,
        icon: (paymentMethod.icon as any) || AVAILABLE_ICONS[0],
      });
    }
  }, [paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (paymentMethod) {
        // Actualizar método de pago
        const result = await paymentMethodService.update(
          paymentMethod.id,
          formData
        );
        if (result) {
          onSuccess();
        } else {
          setError("Không thể cập nhật phương thức thanh toán");
        }
      } else {
        // Crear nuevo método de pago
        const result = await paymentMethodService.create(formData);
        if (result) {
          onSuccess();
        } else {
          setError("Không thể tạo phương thức thanh toán");
        }
      }
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  const IconComponent =
    (LucideIcons as any)[formData.icon] || LucideIcons.MoreHorizontal;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Tên Phương Thức Thanh Toán"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nhập tên phương thức thanh toán"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biểu Tượng
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {AVAILABLE_ICONS.map((iconName) => {
            const Icon =
              (LucideIcons as any)[iconName] || LucideIcons.MoreHorizontal;
            const isSelected = formData.icon === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormData({ ...formData, icon: iconName })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="w-6 h-6 mx-auto text-blue-600" />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600">Xem trước</span>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Hủy
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading
            ? "Đang lưu..."
            : paymentMethod
            ? "Cập Nhật"
            : "Tạo Phương Thức Thanh Toán"}
        </Button>
      </div>
    </form>
  );
}

