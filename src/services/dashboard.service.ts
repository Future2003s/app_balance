import { DashboardStats, MonthlyExpense } from "@/lib/types";
import { expenseService } from "./expense.service";
import { categoryService } from "./category.service";

// Servicio para estadísticas del dashboard
export const dashboardService = {
  // Obtener estadísticas del dashboard
  async getStats(): Promise<DashboardStats> {
    const currentMonthExpenses = await expenseService.getCurrentMonthExpenses();
    const previousMonthExpenses =
      await expenseService.getPreviousMonthExpenses();
    const categories = await categoryService.getAll();

    // Calcular totales
    const totalCurrentMonth = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const totalPreviousMonth = previousMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Calcular promedio diario
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();
    const averageDaily = totalCurrentMonth / daysInMonth;

    // Calcular gastos por categoría
    const expensesByCategory = categories
      .map((category) => {
        const categoryExpenses = currentMonthExpenses.filter(
          (exp) => exp.categoryId === category.id
        );
        const total = categoryExpenses.reduce(
          (sum, exp) => sum + exp.amount,
          0
        );
        const percentage =
          totalCurrentMonth > 0 ? (total / totalCurrentMonth) * 100 : 0;

        return {
          categoryId: category.id,
          categoryName: category.name,
          total,
          percentage,
          color: category.color,
        };
      })
      .filter((item) => item.total > 0);

    // Top 5 categorías
    const topCategories = [...expensesByCategory]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      totalCurrentMonth,
      totalPreviousMonth,
      averageDaily,
      expensesByCategory,
      topCategories,
    };
  },

  // Obtener gastos mensuales de los últimos 6 meses
  async getMonthlyExpenses(months: number = 6): Promise<MonthlyExpense[]> {
    const now = new Date();
    const monthlyExpenses: MonthlyExpense[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthExpenses = await expenseService.filter({
        startDate: startOfMonth.toISOString().split("T")[0],
        endDate: endOfMonth.toISOString().split("T")[0],
      });

      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const monthName = new Intl.DateTimeFormat("vi-VN", {
        month: "short",
        year: "numeric",
      }).format(date);

      monthlyExpenses.push({
        month: monthName,
        total,
        count: monthExpenses.length,
      });
    }

    return monthlyExpenses;
  },
};
