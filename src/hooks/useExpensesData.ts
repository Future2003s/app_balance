"use client";

import { useState, useCallback, useEffect } from "react";
import { Expense, ExpenseFilters } from "@/lib/types";
import { expenseService } from "@/services/expense.service";

interface UseExpensesDataOptions {
  filters: ExpenseFilters;
}

interface UseExpensesDataReturn {
  expenses: Expense[];
  isLoading: boolean;
  isRefreshing: boolean;
  pendingExpenseIds: string[];
  refresh: () => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  toggleExpenseCompletion: (id: string, isCompleted: boolean) => Promise<void>;
}

const addPending = (list: string[], id: string) =>
  list.includes(id) ? list : [...list, id];

const removePending = (list: string[], id: string) =>
  list.filter((pendingId) => pendingId !== id);

export function useExpensesData({
  filters,
}: UseExpensesDataOptions): UseExpensesDataReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingExpenseIds, setPendingExpenseIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const filtered = await expenseService.filter(filters);
      setExpenses(filtered);
    } catch (error) {
      console.error("Failed to refresh expenses:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteExpense = useCallback(
    async (id: string) => {
      setPendingExpenseIds((prev) => addPending(prev, id));
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));

      try {
        const success = await expenseService.delete(id);
        if (!success) {
          throw new Error("Delete request failed");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        await refresh();
      } finally {
        setPendingExpenseIds((prev) => removePending(prev, id));
      }
    },
    [refresh]
  );

  const toggleExpenseCompletion = useCallback(
    async (id: string, isCompleted: boolean) => {
      setPendingExpenseIds((prev) => addPending(prev, id));

      setExpenses((prev) => {
        if (
          filters.isCompleted !== undefined &&
          filters.isCompleted !== isCompleted
        ) {
          return prev.filter((expense) => expense.id !== id);
        }

        return prev.map((expense) =>
          expense.id === id ? { ...expense, isCompleted } : expense
        );
      });

      try {
        await expenseService.update(id, { isCompleted });
      } catch (error) {
        console.error("Error toggling completion:", error);
        await refresh();
      } finally {
        setPendingExpenseIds((prev) => removePending(prev, id));
      }
    },
    [filters.isCompleted, refresh]
  );

  return {
    expenses,
    isLoading,
    isRefreshing,
    pendingExpenseIds,
    refresh,
    deleteExpense,
    toggleExpenseCompletion,
  };
}

