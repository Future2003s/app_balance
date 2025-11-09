"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Category } from "@/lib/types";
import { categoryService } from "@/services/category.service";
import * as LucideIcons from "lucide-react";

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

// Iconos disponibles para categorías
const AVAILABLE_ICONS = [
  "UtensilsCrossed",
  "Car",
  "Film",
  "Heart",
  "GraduationCap",
  "Shirt",
  "Home",
  "ShoppingBag",
  "Coffee",
  "Plane",
  "Gamepad2",
  "Music",
  "Book",
  "Dumbbell",
  "Briefcase",
  "Gift",
  "MoreHorizontal",
] as const;

// Colores predefinidos
const COLOR_OPTIONS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#6B7280", // Gray
];

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    color: string;
    icon: string;
  }>({
    name: "",
    color: COLOR_OPTIONS[0],
    icon: AVAILABLE_ICONS[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        icon: (category.icon as any) || AVAILABLE_ICONS[0],
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (category) {
        // Actualizar categoría
        const result = await categoryService.update(category.id, formData);
        if (result) {
          onSuccess();
        } else {
          setError("Không thể cập nhật danh mục");
        }
      } else {
        // Crear nueva categoría
        const result = await categoryService.create(formData);
        if (result) {
          onSuccess();
        } else {
          setError("Không thể tạo danh mục");
        }
      }
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = (LucideIcons as any)[formData.icon] || LucideIcons.MoreHorizontal;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Tên Danh Mục"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nhập tên danh mục"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Màu Sắc
        </label>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-full h-10 rounded-lg border-2 transition-all ${
                formData.color === color
                  ? "border-gray-900 scale-110"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biểu Tượng
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {AVAILABLE_ICONS.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName] || LucideIcons.MoreHorizontal;
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
                <Icon className="w-6 h-6 mx-auto" style={{ color: formData.color }} />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: formData.color }}
          >
            <IconComponent className="w-5 h-5 text-white" />
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
            : category
            ? "Cập Nhật"
            : "Tạo Danh Mục"}
        </Button>
      </div>
    </form>
  );
}

