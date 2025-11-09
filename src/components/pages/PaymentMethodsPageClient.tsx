"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useIsClient } from "@/hooks/useIsClient";
import { paymentMethodService } from "@/services/paymentMethod.service";
import { PaymentMethod } from "@/lib/types";
import { Plus } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";

// Lazy loading de componentes pesados
const PaymentMethodList = lazy(() =>
  import("@/components/payment-methods/PaymentMethodList").then((m) => ({
    default: m.PaymentMethodList,
  }))
);
const PaymentMethodForm = lazy(() =>
  import("@/components/payment-methods/PaymentMethodForm").then((m) => ({
    default: m.PaymentMethodForm,
  }))
);

export function PaymentMethodsPageClient() {
  const isClient = useIsClient();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<
    PaymentMethod | undefined
  >(undefined);

  useEffect(() => {
    if (isClient) {
      loadPaymentMethods();
    }
  }, [isClient]);

  const loadPaymentMethods = async () => {
    const data = await paymentMethodService.getAll();
    setPaymentMethods(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?")) {
      try {
        const success = await paymentMethodService.delete(id);
        if (success) {
          loadPaymentMethods();
        }
      } catch (error: any) {
        alert(
          error.message ||
            "Không thể xóa phương thức thanh toán này. Có thể đây là phương thức mặc định hoặc không tồn tại."
        );
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPaymentMethod(undefined);
    loadPaymentMethods();
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPaymentMethod(undefined);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Phương Thức Thanh Toán
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Quản lý phương thức thanh toán của bạn
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Thêm Phương Thức</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>

        {/* Payment Methods List */}
        <Suspense fallback={<CardSkeleton />}>
          <Card>
            <PaymentMethodList
              paymentMethods={paymentMethods}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Card>
        </Suspense>

        {/* Modal para crear/editar método de pago */}
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
          title={
            editingPaymentMethod
              ? "Chỉnh Sửa Phương Thức Thanh Toán"
              : "Thêm Phương Thức Thanh Toán Mới"
          }
        >
          <Suspense fallback={<div className="text-gray-500 p-4">Đang tải form...</div>}>
            <PaymentMethodForm
              paymentMethod={editingPaymentMethod}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </Suspense>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

