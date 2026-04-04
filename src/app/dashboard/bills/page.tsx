'use client'

import { useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import BudgetTable from '@/components/BudgetTable'

export default function BillsPage() {
  useMonthData()
  const { bills, setBills, currentMonth, getCurrency, totalBillsBudget, totalBillsActual, profile } = useStore()
  const currency = getCurrency()

  const reload = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase.from('bills').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at')
      if (error) {
        console.error('Error loading bills:', error)
        return
      }
      if (data) setBills(data)
    } catch (err) {
      console.error('Failed to reload bills:', err)
    }
  }, [currentMonth, setBills])

  const budget = totalBillsBudget()
  const actual = totalBillsActual()

  return (
    <div>
      <PageHeader title="Bills" subtitle={`${getMonthLabel(currentMonth)} recurring bills`}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Budgeted" value={formatCurrency(budget, currency)}/>
        <StatCard label="Paid" value={formatCurrency(actual, currency)} color={actual > budget ? 'red' : 'default'}/>
        <StatCard label="Remaining" value={formatCurrency(Math.abs(budget - actual), currency)}
          sub={budget - actual >= 0 ? 'left to pay' : 'over budget'}
          color={budget - actual >= 0 ? 'green' : 'red'}/>
      </div>
      <BudgetTable
        title="Bills"
        table="bills"
        rows={bills}
        reload={reload}
        extraCol="Due day"
        isPro={profile?.plan === 'pro'}
      />
    </div>
  )
}
