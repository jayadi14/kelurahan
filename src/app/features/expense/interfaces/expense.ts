import { ChartOfAccount } from '@features/chart-of-account/interfaces/chart-of-account';

export interface Expense {
  id: string;
  no: string;
  date: Date;
  coa_id: string;
  coa: ChartOfAccount;
  note: string;
  grand_total: number;
  expense_details: ExpenseDetail[];
}
export interface ExpenseDetail {
  id: string;
  expense_id: string;
  name: string;
  amount: number;
}
export interface RecurringExpense {
  id: string;
  expense_id: string;
  next_occurence: Date;
  end_date: Date;
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_day_of_week: number;
  recurrence_day_of_month: number;
}

export enum RecurrenceType {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
}
