"use client";

import { useState, useEffect } from "react";
import { ExpenseFilters as ExpenseFiltersType } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { categoryService } from "@/services/category.service";
import { paymentMethodService } from "@/services/paymentMethod.service";
import { X } from "lucide-react";

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
}

export function ExpenseFilters({
  filters,
  onFiltersChange,
}: ExpenseFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ExpenseFiltersType>(filters);
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const cats = await categoryService.getAll();
      const pms = await paymentMethodService.getAll();
      setCategories(cats);
      setPaymentMethods(pms);
    };
    loadData();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ExpenseFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ExpenseFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <Card title="Bộ Lọc">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Input
          type="date"
          label="Ngày Bắt Đầu"
          value={localFilters.startDate || ""}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <Input
          type="date"
          label="Ngày Kết Thúc"
          value={localFilters.endDate || ""}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <Select
          label="Danh Mục"
          value={localFilters.categoryId || ""}
          onChange={(e) => handleFilterChange("categoryId", e.target.value)}
          options={[
            { value: "", label: "Tất Cả" },
            ...categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })),
          ]}
        />
        <Select
          label="Phương Thức Thanh Toán"
          value={localFilters.paymentMethodId || ""}
          onChange={(e) =>
            handleFilterChange("paymentMethodId", e.target.value)
          }
          options={[
            { value: "", label: "Tất Cả" },
            ...paymentMethods.map((pm) => ({
              value: pm.id,
              label: pm.name,
            })),
          ]}
        />
        <Input
          type="number"
          label="Số Tiền Tối Thiểu"
          value={localFilters.minAmount || ""}
          onChange={(e) =>
            handleFilterChange(
              "minAmount",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
        <Input
          type="number"
          label="Số Tiền Tối Đa"
          value={localFilters.maxAmount || ""}
          onChange={(e) =>
            handleFilterChange(
              "maxAmount",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
        <Input
          type="text"
          label="Tìm Kiếm"
          placeholder="Tìm kiếm theo mô tả..."
          value={localFilters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <div className="flex items-end">
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Xóa Bộ Lọc
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
