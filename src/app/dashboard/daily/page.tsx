'use client'

import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { formatCurrency, getMonthLabel, getDaysInMonth } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'

export default function DailyPage() {
  useMonthData()
  const { currentMonth, transactions, income, getCurrency } = useStore()
  const currency = getCurrency()

  const days = getDaysInMonth(currentMonth)

  const dailySpent: Record<string, number> = {}
  const dailyIncome: Record<string, number> = {}

  transactions.forEach(t => { dailySpent[t.date] = (dailySpent[t.date] || 0) + t.amount })
  income.forEach(inc => {
    if (inc.payday) dailyIncome[inc.payday] = (dailyIncome[inc.payday] || 0) + inc.actual
  })

  let runningBalance = 0
  const rows = days.map(date => {
    const spent = dailySpent[date] || 0
    const inc = dailyIncome[date] || 0
    runningBalance += inc - spent
    return { date, spent, income: inc, balance: runningBalance, hasActivity: spent > 0 || inc > 0 }
  })

  const activeRows = rows.filter(r => r.hasActivity)
  const chartData = activeRows.map(r => ({
    day: r.date.slice(8),
    spent: r.spent,
    income: r.income,
  }))

  const totalSpent = rows.reduce((s, r) => s + r.spent, 0)
  const totalIncomePaid = rows.reduce((s, r) => s + r.income, 0)

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const cardAnim: Variants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } } }

  return (
    <div>
      <PageHeader title="Daily spendings" subtitle={`Day-by-day breakdown for ${getMonthLabel(currentMonth)}`}/>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <motion.div variants={cardAnim}>
          <div className="metric-card">
            <div className="metric-label">Total spent</div>
            <div className="metric-value text-gray-900 dark:text-white">{formatCurrency(totalSpent, currency)}</div>
          </div>
        </motion.div>
        <motion.div variants={cardAnim}>
          <div className="metric-card">
            <div className="metric-label">Income received</div>
            <div className="metric-value text-brand-600 dark:text-brand-400">{formatCurrency(totalIncomePaid, currency)}</div>
          </div>
        </motion.div>
        <motion.div variants={cardAnim}>
          <div className="metric-card">
            <div className="metric-label">Net balance</div>
            <div className={clsx('metric-value', totalIncomePaid - totalSpent >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
              {formatCurrency(Math.abs(totalIncomePaid - totalSpent), currency)}
            </div>
            <div className="text-xs text-gray-400 mt-1">{totalIncomePaid - totalSpent >= 0 ? 'surplus' : 'deficit'}</div>
          </div>
        </motion.div>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="card p-6 mb-6">
          <h3 className="section-title">Daily activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={14} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => formatCurrency(v, currency)}/>
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 10, fontSize: 12 }}
                formatter={(v: number) => formatCurrency(v, currency)}/>
              <Bar dataKey="income" fill="#6b5ce6" radius={[3,3,0,0]} name="Income"/>
              <Bar dataKey="spent" fill="#ea5c84" radius={[3,3,0,0]} name="Spent"/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="card p-6">
        <h3 className="section-title">Day-by-day log</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[360px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Date','Spent','Income','Balance'].map(h => (
                  <th key={h} className={clsx('table-header py-2 pb-3', h === 'Date' ? 'text-left' : 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.filter(r => r.hasActivity).map(row => (
                <tr key={row.date} className="border-b border-gray-50 dark:border-gray-800/50">
                  <td className="py-2.5 text-sm text-gray-600 dark:text-gray-400">{row.date}</td>
                  <td className="py-2.5 text-sm text-right" style={{ color: row.spent ? '#ea5c84' : '' }}>{row.spent ? `-${formatCurrency(row.spent, currency)}` : '—'}</td>
                  <td className="py-2.5 text-sm text-right text-brand-600 dark:text-brand-400">{row.income ? `+${formatCurrency(row.income, currency)}` : '—'}</td>
                  <td className={clsx('py-2.5 text-sm text-right font-medium', row.balance >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-red-500')}>
                    {formatCurrency(row.balance, currency)}
                  </td>
                </tr>
              ))}
              {activeRows.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-sm text-gray-400">No activity logged this month</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
