"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { useIsClient } from "@/hooks/useIsClient";
import { categoryService } from "@/services/category.service";
import { Category } from "@/lib/types";
import { Plus } from "lucide-react";

export default function CategoriesPage() {
  const isClient = useIsClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined
  );

  useEffect(() => {
    if (isClient) {
      loadCategories();
    }
  }, [isClient]);

  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const success = await categoryService.delete(id);
        if (success) {
          loadCategories();
        }
      } catch (error: any) {
        alert(
          error.message ||
            "Không thể xóa danh mục này. Có thể đây là danh mục mặc định hoặc danh mục không tồn tại."
        );
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(undefined);
    loadCategories();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(undefined);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Danh Mục</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Quản lý danh mục chi tiêu của bạn
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Thêm Danh Mục</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>

        {/* Categories List */}
        <Card>
          <CategoryList
            categories={categories}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Card>

        {/* Modal para crear/editar categoría */}
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
          title={editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
        >
          <CategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

