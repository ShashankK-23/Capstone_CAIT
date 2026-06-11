export interface Expense {
  id?: number;
  amount: number;
  description: string;
  expenseDate: string;
  categoryId: number;
  sourceId: number | null;
  userId?: number;
  category?: Category;
  source?: ExpenseSource;
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
  userId?: number;
  isDefault?: boolean;
}

export interface ExpenseSource {
  id?: number;
  name: string;
  userId?: number;
  isDefault?: boolean;
}

export interface DashboardSummary {
  totalThisMonth: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  color: string;
  icon: string;
  total: number;
}

export interface MonthlyBreakdown {
  month: number;
  total: number;
}
