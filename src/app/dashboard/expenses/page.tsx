'use client'

import { useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import BudgetTable from '@/components/BudgetTable'

export default function ExpensesPage() {
  useMonthData()
  const { expenses, setExpenses, currentMonth, getCurrency, totalExpensesBudget, totalExpensesActual, profile } = useStore()
  const currency = getCurrency()

  const reload = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at')
    if (data) setExpenses(data)
  }, [currentMonth])

  const budget = totalExpensesBudget()
  const actual = totalExpensesActual()

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`${getMonthLabel(currentMonth)} expense categories`}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Budgeted" value={formatCurrency(budget, currency)}/>
        <StatCard label="Spent" value={formatCurrency(actual, currency)} color={actual > budget ? 'red' : 'default'}/>
        <StatCard label="Remaining" value={formatCurrency(Math.abs(budget - actual), currency)}
          sub={budget - actual >= 0 ? 'left to spend' : 'over budget'}
          color={budget - actual >= 0 ? 'green' : 'red'}/>
      </div>
      <BudgetTable
        title="Expenses"
        table="expenses"
        rows={expenses}
        reload={reload}
        isPro={profile?.plan === 'pro'}
      />
    </div>
  )
}
