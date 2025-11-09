// Tipos principales de la aplicación

export interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  paymentMethodId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface DashboardStats {
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  averageDaily: number;
  expensesByCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    percentage: number;
    color: string;
  }[];
  topCategories: {
    categoryId: string;
    categoryName: string;
    total: number;
    color: string;
  }[];
}

export interface MonthlyExpense {
  month: string;
  total: number;
  count: number;
}

