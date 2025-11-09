"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useIsClient } from "@/hooks/useIsClient";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStats, DailyExpense, MonthlyExpense } from "@/lib/types";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import { StatsCardSkeleton, CardSkeleton } from "@/components/ui/Skeleton";

// Lazy loading de componentes pesados
const StatsCard = lazy(() =>
  import("@/components/dashboard/StatsCard").then((m) => ({
    default: m.StatsCard,
  }))
);
const TopCategories = lazy(() =>
  import("@/components/dashboard/TopCategories").then((m) => ({
    default: m.TopCategories,
  }))
);
const DailySummary = lazy(() =>
  import("@/components/dashboard/DailySummary").then((m) => ({
    default: m.DailySummary,
  }))
);
const MonthlySummary = lazy(() =>
  import("@/components/dashboard/MonthlySummary").then((m) => ({
    default: m.MonthlySummary,
  }))
);

export function DashboardPageClient() {
  const isClient = useIsClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);

  useEffect(() => {
    if (isClient) {
      const loadData = async () => {
        const [statsData, dailyData, monthlyData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getDailyExpenses(30),
          dashboardService.getMonthlySummary(6), // Solo últimos 6 meses
        ]);
        setStats(statsData);
        setDailyExpenses(dailyData);
        setMonthlyExpenses(monthlyData);
      };
      loadData();
    }
  }, [isClient]);

  if (!isClient || !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  const percentageChange = stats.totalPreviousMonth > 0
    ? ((stats.totalCurrentMonth - stats.totalPreviousMonth) / stats.totalPreviousMonth) * 100
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trang Chủ</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Tổng quan chi tiêu và thống kê của bạn
            </p>
          </div>
          <Link href="/expenses/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Thêm Chi Tiêu</span>
              <span className="sm:hidden">Thêm</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard
              title="Chi Tiêu Tháng Này"
              value={stats.totalCurrentMonth}
              icon={<DollarSign className="w-6 h-6" />}
              trend={percentageChange}
              trendLabel="so với tháng trước"
            />
            <StatsCard
              title="Tháng Trước"
              value={stats.totalPreviousMonth}
              icon={<DollarSign className="w-6 h-6" />}
            />
            <StatsCard
              title="Trung Bình Mỗi Ngày"
              value={stats.averageDaily}
              icon={<DollarSign className="w-6 h-6" />}
            />
            <StatsCard
              title="Tổng Danh Mục"
              value={stats.expensesByCategory.length}
              icon={<DollarSign className="w-6 h-6" />}
            />
          </div>
        </Suspense>

        {/* Top Categories */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <TopCategories categories={stats.topCategories} />
          <Card title="Tóm Tắt Nhanh">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600">Tổng tháng hiện tại</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(stats.totalCurrentMonth)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600">Thay đổi so với tháng trước</span>
                <div className="flex items-center">
                  {percentageChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1" />
                  )}
                  <span
                    className={`text-sm sm:text-base font-semibold ${
                      percentageChange >= 0 ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
          </div>
        </Suspense>

        {/* Resúmenes Diarios y Mensuales */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <DailySummary dailyExpenses={dailyExpenses} />
            <MonthlySummary monthlyExpenses={monthlyExpenses} />
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

