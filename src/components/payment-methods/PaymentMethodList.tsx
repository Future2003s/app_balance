"use client";

import { memo } from "react";
import { PaymentMethod } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { loadIcon } from "@/lib/utils/iconLoader";

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onDelete: (id: string) => void;
  onEdit: (paymentMethod: PaymentMethod) => void;
}

export const PaymentMethodList = memo(function PaymentMethodList({
  paymentMethods,
  onDelete,
  onEdit,
}: PaymentMethodListProps) {
  // Cargar iconos de forma optimizada
  const getIcon = (iconName: string) => loadIcon(iconName);

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Chưa có phương thức thanh toán nào được đăng ký
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {paymentMethods.map((paymentMethod) => {
        const IconComponent = getIcon(paymentMethod.icon);
        return (
          <div
            key={paymentMethod.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {paymentMethod.name}
                  </h3>
                  <p className="text-xs text-gray-500">ID: {paymentMethod.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(paymentMethod)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(paymentMethod.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
});

