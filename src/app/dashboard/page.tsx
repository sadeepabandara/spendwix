'use client'

import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { formatCurrency, formatDiff, getMonthLabel, pct } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '@/components/StatCard'
import PageHeader from '@/components/PageHeader'
import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'

const PIE_COLORS = ['#6b5ce6','#ea5c84','#a991fb','#f59e0b','#5DCAA5','#06b6d4','#84cc16','#ef4444']

function BudgetChartCursor({ x = 0, y = 0, width = 0, height = 0 }: { x?: number; y?: number; width?: number; height?: number }) {
  return <rect x={x} y={y + 1} width={width} height={height} fill="rgba(107,92,230,0.08)" />
}

export default function DashboardPage() {
  useMonthData()

  const {
    currentMonth, getCurrency, loading,
    income, bills, expenses, savings, debt, transactions,
    totalIncome, totalSpent, leftToSpend, leftToBudget,
    totalBillsBudget, totalBillsActual,
    totalExpensesBudget, totalExpensesActual,
    totalSavingsBudget, totalSavingsActual,
    totalDebtBudget, totalDebtActual,
  } = useStore()

  const currency = getCurrency()

  const budgetVsActual = [
    { name: 'Bills', budget: totalBillsBudget(), actual: totalBillsActual() },
    { name: 'Expenses', budget: totalExpensesBudget(), actual: totalExpensesActual() },
    { name: 'Savings', budget: totalSavingsBudget(), actual: totalSavingsActual() },
    { name: 'Debt', budget: totalDebtBudget(), actual: totalDebtActual() },
  ]

  const allItems = [
    ...bills.map(b => ({ name: b.name, value: b.actual })),
    ...expenses.map(e => ({ name: e.name, value: e.actual })),
    ...savings.map(s => ({ name: s.name, value: s.actual })),
    ...debt.map(d => ({ name: d.name, value: d.actual })),
  ].filter(x => x.value > 0).sort((a, b) => b.value - a.value)

  const totalSpentVal = totalSpent()
  const spendingPie = allItems.slice(0, 6).map(x => ({ ...x, pct: totalSpentVal ? Math.round(x.value / totalSpentVal * 100) : 0 }))
  const recentTxns = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  const leftSpend = leftToSpend()
  const leftBudget = leftToBudget()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6b5ce6" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/></svg>
          Loading...
        </div>
      </div>
    )
  }

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
  const cardAnim: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0,0,0.2,1] } } }

  return (
    <div>
      <PageHeader title={`${getMonthLabel(currentMonth)} overview`} subtitle="Your monthly financial snapshot"/>

      {/* Stats — 2 cols on mobile, 4 on desktop */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4">
        <motion.div variants={cardAnim}><StatCard label="Total income" value={formatCurrency(totalIncome(), currency)} sub="earned this month"/></motion.div>
        <motion.div variants={cardAnim}><StatCard label="Total spent" value={formatCurrency(totalSpentVal, currency)} sub="this month"/></motion.div>
        <motion.div variants={cardAnim}><StatCard label="Left to spend" value={formatCurrency(Math.abs(leftSpend), currency)} sub={leftSpend >= 0 ? 'available' : 'over budget'} color={leftSpend >= 0 ? 'green' : 'red'}/></motion.div>
        <motion.div variants={cardAnim}><StatCard label="Left to budget" value={formatDiff(leftBudget, currency)} sub={leftBudget >= 0 ? 'under budget' : 'over budget'} color={leftBudget >= 0 ? 'green' : 'red'}/></motion.div>
      </motion.div>

      {/* Charts — stacked on mobile, side by side on lg */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
        className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-2">

        {/* Bar chart */}
        <div className="card p-4 sm:p-5 bg-white/95 dark:bg-[#13182a] border border-gray-100 dark:border-[#252c46]">
          <h3 className="text-xs section-title sm:text-sm">Budget vs actual</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetVsActual} barSize={18} barGap={3}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--tooltip-text)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: 'var(--tooltip-text)' }} axisLine={false} tickLine={false} width={48}
                tickFormatter={v => formatCurrency(v, currency).replace(/\.00$/, '')}/>
              <Tooltip
                cursor={<BudgetChartCursor />}
                contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 11 }}
                labelStyle={{ color: 'var(--tooltip-text)' }}
                itemStyle={{ color: 'var(--tooltip-text)' }}
                formatter={(v: number) => formatCurrency(v, currency)}
              />
              <Bar dataKey="budget" fill="#6b5ce6" radius={[4,4,0,0]} name="Budget"/>
              <Bar dataKey="actual" fill="#ea5c84" radius={[4,4,0,0]} name="Actual"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[['Budget','#6b5ce6'],['Actual','#ea5c84']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }}/>{l}
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="card p-4 sm:p-5 bg-white/95 dark:bg-[#13182a] border border-gray-100 dark:border-[#252c46]">
          <h3 className="text-xs section-title sm:text-sm">Where money goes</h3>
          {spendingPie.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <PieChart width={130} height={130}>
                  <Pie data={spendingPie} dataKey="value" cx={65} cy={65} innerRadius={35} outerRadius={60} paddingAngle={2}>
                    {spendingPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v, currency)}
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', fontSize: 11, borderRadius: 12 }}
                    labelStyle={{ color: 'var(--tooltip-text)' }}
                    itemStyle={{ color: 'var(--tooltip-text)' }}
                  />
                </PieChart>
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                {spendingPie.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}/>
                      <span className="text-xs text-gray-600 truncate dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="flex-shrink-0 text-xs font-medium text-gray-700 dark:text-gray-300">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-sm text-gray-400 h-36">No spending data yet</div>
          )}
        </div>
      </motion.div>

      {/* Budget overview bars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.36 }}
        className="card p-4 sm:p-5 mb-5 bg-white/95 dark:bg-[#13182a] border border-gray-100 dark:border-[#252c46]">
        <h3 className="section-title">Budget overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {budgetVsActual.map(item => {
            const p = pct(item.actual, item.budget)
            const over = item.actual > item.budget
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="hidden text-xs text-gray-400 sm:inline">{formatCurrency(item.actual, currency)} / {formatCurrency(item.budget, currency)}</span>
                    <span className={clsx('text-xs font-semibold', over ? 'text-red-500' : 'text-brand-600 dark:text-brand-400')}>{p}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={clsx('progress-fill', over ? 'bg-red-400' : 'bg-brand-500')} style={{ width: `${p}%` }}/>
                </div>
                <span className="block mt-1 text-xs text-gray-400 sm:hidden">{formatCurrency(item.actual, currency)} / {formatCurrency(item.budget, currency)}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.44 }}
        className="card p-4 sm:p-5 bg-white/95 dark:bg-[#13182a] border border-gray-100 dark:border-[#252c46]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="mb-0 section-title">Recent transactions</h3>
          <a href="/dashboard/transactions" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all</a>
        </div>
        {recentTxns.length > 0 ? (
          <div className="space-y-0">
            {recentTxns.map(txn => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#252c46] last:border-0">
                <div className="flex items-center min-w-0 gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' }}>
                    <span className="text-[10px] font-bold text-white">{txn.category.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate dark:text-gray-200">{txn.description || txn.category}</p>
                    <p className="text-xs text-gray-400 truncate">{txn.category} · {txn.date}</p>
                  </div>
                </div>
                <span className="flex-shrink-0 ml-2 text-sm font-semibold" style={{ color: '#ea5c84' }}>
                  -{formatCurrency(txn.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-sm text-center text-gray-400">No transactions yet this month</div>
        )}
      </motion.div>
    </div>
  )
}
