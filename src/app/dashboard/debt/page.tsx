'use client'

import { useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import BudgetTable from '@/components/BudgetTable'

export default function DebtPage() {
  useMonthData()
  const { debt, setDebt, currentMonth, getCurrency, totalDebtBudget, totalDebtActual, profile } = useStore()
  const currency = getCurrency()

  const reload = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('debt').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at')
    if (data) setDebt(data)
  }, [currentMonth])

  const budget = totalDebtBudget()
  const actual = totalDebtActual()

  return (
    <div>
      <PageHeader title="Debt" subtitle={`${getMonthLabel(currentMonth)} debt payments`}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Planned payments" value={formatCurrency(budget, currency)}/>
        <StatCard label="Paid this month" value={formatCurrency(actual, currency)} color="green"/>
        <StatCard label="Still to pay" value={formatCurrency(Math.max(0, budget - actual), currency)}
          sub={actual >= budget ? 'All paid!' : 'remaining'}
          color={actual >= budget ? 'green' : 'amber'}/>
      </div>
      <BudgetTable
        title="Debt payments"
        table="debt"
        rows={debt}
        reload={reload}
        isPro={profile?.plan === 'pro'}
      />
    </div>
  )
}
