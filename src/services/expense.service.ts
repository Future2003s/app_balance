import { Expense, ExpenseFormData, ExpenseFilters } from "@/lib/types";

// Servicio para gestión de gastos usando MongoDB API
export const expenseService = {
  // Obtener todos los gastos
  async getAll(): Promise<Expense[]> {
    try {
      const response = await fetch("/api/expenses", {
        credentials: "include", // Incluir cookies para autenticación
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return [];
        }
        throw new Error("Failed to fetch expenses");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  },

  // Obtener un gasto por ID
  async getById(id: string): Promise<Expense | null> {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to fetch expense");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching expense:", error);
      return null;
    }
  },

  // Crear un nuevo gasto
  async create(data: ExpenseFormData): Promise<Expense | null> {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to create expense");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating expense:", error);
      return null;
    }
  },

  // Actualizar un gasto
  async update(
    id: string,
    data: Partial<ExpenseFormData>
  ): Promise<Expense | null> {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to update expense");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating expense:", error);
      return null;
    }
  },

  // Eliminar un gasto
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) return false;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return false;
        }
        throw new Error("Failed to delete expense");
      }
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      return false;
    }
  },

  // Filtrar gastos
  async filter(filters: ExpenseFilters): Promise<Expense[]> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.paymentMethodId)
        params.append("paymentMethodId", filters.paymentMethodId);
      if (filters.minAmount !== undefined)
        params.append("minAmount", filters.minAmount.toString());
      if (filters.maxAmount !== undefined)
        params.append("maxAmount", filters.maxAmount.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.isCompleted !== undefined)
        params.append("isCompleted", filters.isCompleted.toString());

      const response = await fetch(`/api/expenses?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return [];
        }
        throw new Error("Failed to filter expenses");
      }
      return await response.json();
    } catch (error) {
      console.error("Error filtering expenses:", error);
      return [];
    }
  },

  // Obtener gastos del mes actual
  async getCurrentMonthExpenses(): Promise<Expense[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.filter({
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    });
  },

  // Obtener gastos del mes anterior
  async getPreviousMonthExpenses(): Promise<Expense[]> {
    const now = new Date();
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return this.filter({
      startDate: startOfPreviousMonth.toISOString().split("T")[0],
      endDate: endOfPreviousMonth.toISOString().split("T")[0],
    });
  },
};
