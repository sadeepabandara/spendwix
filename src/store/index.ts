import { create } from 'zustand'
import { Currency, Profile, IncomeEntry, BillEntry, ExpenseEntry, SavingEntry, DebtEntry, Transaction } from '@/types'
import { getCurrentMonth } from '@/lib/utils'

interface AppState {
  profile: Profile | null
  currentMonth: string
  income: IncomeEntry[]
  bills: BillEntry[]
  expenses: ExpenseEntry[]
  savings: SavingEntry[]
  debt: DebtEntry[]
  transactions: Transaction[]
  loading: boolean
  sidebarOpen: boolean

  setProfile: (p: Profile | null) => void
  setCurrentMonth: (m: string) => void
  setIncome: (d: IncomeEntry[]) => void
  setBills: (d: BillEntry[]) => void
  setExpenses: (d: ExpenseEntry[]) => void
  setSavings: (d: SavingEntry[]) => void
  setDebt: (d: DebtEntry[]) => void
  setTransactions: (d: Transaction[]) => void
  setLoading: (v: boolean) => void
  setSidebarOpen: (v: boolean) => void
  getCurrency: () => Currency

  totalIncome: () => number
  totalBillsBudget: () => number
  totalBillsActual: () => number
  totalExpensesBudget: () => number
  totalExpensesActual: () => number
  totalSavingsBudget: () => number
  totalSavingsActual: () => number
  totalDebtBudget: () => number
  totalDebtActual: () => number
  totalSpent: () => number
  leftToSpend: () => number
  leftToBudget: () => number
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  currentMonth: getCurrentMonth(),
  income: [],
  bills: [],
  expenses: [],
  savings: [],
  debt: [],
  transactions: [],
  loading: false,
  sidebarOpen: true,

  setProfile: (p) => set({ profile: p }),
  setCurrentMonth: (m) => set({ currentMonth: m }),
  setIncome: (d) => set({ income: d }),
  setBills: (d) => set({ bills: d }),
  setExpenses: (d) => set({ expenses: d }),
  setSavings: (d) => set({ savings: d }),
  setDebt: (d) => set({ debt: d }),
  setTransactions: (d) => set({ transactions: d }),
  setLoading: (v) => set({ loading: v }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  getCurrency: () => get().profile?.currency ?? 'USD',

  totalIncome: () => get().income.reduce((s, r) => s + r.actual, 0),
  totalBillsBudget: () => get().bills.reduce((s, r) => s + r.budget, 0),
  totalBillsActual: () => get().bills.reduce((s, r) => s + r.actual, 0),
  totalExpensesBudget: () => get().expenses.reduce((s, r) => s + r.budget, 0),
  totalExpensesActual: () => get().expenses.reduce((s, r) => s + r.actual, 0),
  totalSavingsBudget: () => get().savings.reduce((s, r) => s + r.budget, 0),
  totalSavingsActual: () => get().savings.reduce((s, r) => s + r.actual, 0),
  totalDebtBudget: () => get().debt.reduce((s, r) => s + r.budget, 0),
  totalDebtActual: () => get().debt.reduce((s, r) => s + r.actual, 0),
  totalSpent: () => {
    const s = get()
    return s.totalBillsActual() + s.totalExpensesActual() + s.totalSavingsActual() + s.totalDebtActual()
  },
  leftToSpend: () => get().totalIncome() - get().totalSpent(),
  leftToBudget: () => {
    const s = get()
    const budget = s.totalBillsBudget() + s.totalExpensesBudget() + s.totalSavingsBudget() + s.totalDebtBudget()
    return budget - s.totalSpent()
  },
}))
