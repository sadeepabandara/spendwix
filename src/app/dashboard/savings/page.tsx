'use client'

import { useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel, pct } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import BudgetTable from '@/components/BudgetTable'
import clsx from 'clsx'

export default function SavingsPage() {
  useMonthData()
  const { savings, setSavings, currentMonth, getCurrency, totalSavingsBudget, totalSavingsActual, profile } = useStore()
  const currency = getCurrency()

  const reload = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('savings').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at')
    if (data) setSavings(data)
  }, [currentMonth])

  const budget = totalSavingsBudget()
  const actual = totalSavingsActual()

  return (
    <div>
      <PageHeader title="Savings" subtitle={`${getMonthLabel(currentMonth)} savings goals`}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Goal this month" value={formatCurrency(budget, currency)}/>
        <StatCard label="Saved so far" value={formatCurrency(actual, currency)} color="green"/>
        <StatCard label="Still to save" value={formatCurrency(Math.max(0, budget - actual), currency)}
          color={actual >= budget ? 'green' : 'amber'}
          sub={actual >= budget ? 'Goal reached!' : 'remaining'}/>
      </div>

      {/* Goal cards */}
      {savings.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-3">
          {savings.map(s => {
            const p = pct(s.actual, s.budget)
            const done = p >= 100
            return (
              <div key={s.id} className="p-5 card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(s.actual, currency)} of {formatCurrency(s.budget, currency)}</p>
                  </div>
                  {done && (
                    <span className="text-xs bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">Done</span>
                  )}
                </div>
                <div className="progress-bar">
                  <div className={clsx('progress-fill', done ? 'bg-brand-400' : 'bg-amber-400')} style={{ width: `${p}%` }}/>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{p}% saved</p>
              </div>
            )
          })}
        </div>
      )}

      <BudgetTable
        title="Savings goals"
        table="savings"
        rows={savings}
        reload={reload}
        isPro={profile?.plan === 'pro'}
      />
    </div>
  )
}
