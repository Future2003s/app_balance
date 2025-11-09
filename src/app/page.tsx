'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TopCategories } from '@/components/dashboard/TopCategories';
import { useIsClient } from '@/hooks/useIsClient';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardStats } from '@/lib/types';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const isClient = useIsClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (isClient) {
      const loadStats = async () => {
        const data = await dashboardService.getStats();
        setStats(data);
      };
      loadStats();
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

        {/* Top Categories */}
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
      </div>
    </DashboardLayout>
  );
}
