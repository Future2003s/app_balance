import { DashboardStats, MonthlyExpense, DailyExpense } from "@/lib/types";
import { expenseService } from "./expense.service";
import { categoryService } from "./category.service";

// Servicio para estadísticas del dashboard
export const dashboardService = {
  // Obtener estadísticas del dashboard (optimizado con Promise.all)
  async getStats(): Promise<DashboardStats> {
    // Ejecutar todas las consultas en paralelo
    const [currentMonthExpenses, previousMonthExpenses, categories] =
      await Promise.all([
        expenseService.getCurrentMonthExpenses(),
        expenseService.getPreviousMonthExpenses(),
        categoryService.getAll(),
      ]);

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

  // Obtener gastos mensuales de los últimos 6 meses (optimizado con Promise.all)
  async getMonthlyExpenses(months: number = 6): Promise<MonthlyExpense[]> {
    const now = new Date();
    const monthPromises: Promise<MonthlyExpense>[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPromise = expenseService
        .filter({
          startDate: startOfMonth.toISOString().split("T")[0],
          endDate: endOfMonth.toISOString().split("T")[0],
        })
        .then((monthExpenses) => {
          const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const monthName = new Intl.DateTimeFormat("vi-VN", {
            month: "short",
            year: "numeric",
          }).format(date);

          return {
            month: monthName,
            total,
            count: monthExpenses.length,
          };
        });

      monthPromises.push(monthPromise);
    }

    // Ejecutar todas las consultas en paralelo
    return Promise.all(monthPromises);
  },

  // Obtener resumen diario de los últimos N días
  async getDailyExpenses(days: number = 30): Promise<DailyExpense[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // Obtener todos los gastos del período
    const expenses = await expenseService.filter({
      startDate: startDate.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    });

    // Agrupar por día
    const dailyMap = new Map<string, { total: number; count: number }>();

    expenses.forEach((expense) => {
      const date = new Date(expense.date).toISOString().split("T")[0];
      const existing = dailyMap.get(date) || { total: 0, count: 0 };
      dailyMap.set(date, {
        total: existing.total + expense.amount,
        count: existing.count + 1,
      });
    });

    // Convertir a array y ordenar por fecha
    const dailyExpenses: DailyExpense[] = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dailyExpenses;
  },

  // Obtener resumen mensual de los últimos N meses
  async getMonthlySummary(months: number = 12): Promise<MonthlyExpense[]> {
    return this.getMonthlyExpenses(months);
  },
};
