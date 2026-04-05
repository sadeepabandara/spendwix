'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function TransactionsPage() {
  useMonthData()
  const {
    transactions, setTransactions, bills, setBills,
    expenses, setExpenses, savings, setSavings,
    debt, setDebt, currentMonth, getCurrency
  } = useStore()
  const currency = getCurrency()

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ date: currentMonth + '-01', amount: '', category: '', description: '' })
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const userCategories = [
    ...bills.map(b => ({ name: b.name, table: 'bills' as const, id: b.id, actual: b.actual })),
    ...expenses.map(e => ({ name: e.name, table: 'expenses' as const, id: e.id, actual: e.actual })),
    ...savings.map(s => ({ name: s.name, table: 'savings' as const, id: s.id, actual: s.actual })),
    ...debt.map(d => ({ name: d.name, table: 'debt' as const, id: d.id, actual: d.actual })),
  ]

  const reload = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [txnRes, billRes, expRes, savRes, debtRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id).eq('month', currentMonth).order('date', { ascending: false }),
      supabase.from('bills').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
      supabase.from('expenses').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
      supabase.from('savings').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
      supabase.from('debt').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
    ])
    if (txnRes.data) setTransactions(txnRes.data)
    if (billRes.data) setBills(billRes.data)
    if (expRes.data) setExpenses(expRes.data)
    if (savRes.data) setSavings(savRes.data)
    if (debtRes.data) setDebt(debtRes.data)
  }, [currentMonth])

  const handleAdd = async () => {
    if (!form.amount || !form.category) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const amount = parseFloat(form.amount)
    await supabase.from('transactions').insert({
      user_id: user.id, month: currentMonth,
      date: form.date, amount, category: form.category,
      description: form.description || null,
    })
    const match = userCategories.find(c => c.name === form.category)
    if (match) await supabase.from(match.table).update({ actual: match.actual + amount }).eq('id', match.id)
    setForm({ date: currentMonth + '-01', amount: '', category: '', description: '' })
    setAdding(false)
    setSaving(false)
    reload()
  }

  const handleDelete = async (txn: { id: string; category: string; amount: number }) => {
    await supabase.from('transactions').delete().eq('id', txn.id)
    const match = userCategories.find(c => c.name === txn.category)
    if (match) await supabase.from(match.table).update({ actual: Math.max(0, match.actual - txn.amount) }).eq('id', match.id)
    reload()
  }

  const filtered = transactions.filter(t =>
    !filter || t.category.toLowerCase().includes(filter.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(filter.toLowerCase())
  )

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0)
  const txnCount = transactions.length

  return (
    <div>
      <PageHeader title="Transactions" subtitle={`${getMonthLabel(currentMonth)} transaction log`}/>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total" value={String(txnCount)}/>
        <StatCard label="Spent" value={formatCurrency(totalSpent, currency)}/>
        <StatCard label="Average" value={txnCount ? formatCurrency(totalSpent / txnCount, currency) : formatCurrency(0, currency)}/>
      </div>

      <div className="card p-4 sm:p-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="section-title mb-0">All transactions</h2>
          <div className="flex gap-2">
            <input className="input py-2 text-xs flex-1 sm:w-44 sm:flex-none"
              placeholder="Filter..." value={filter} onChange={e => setFilter(e.target.value)}/>
            <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-1.5 text-xs whitespace-nowrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add
            </button>
          </div>
        </div>

        {/* No categories notice */}
        {userCategories.length === 0 && (
          <div className="mb-4 p-4 rounded-xl border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-900/20">
            <p className="text-sm text-brand-700 dark:text-brand-300 font-medium mb-0.5">Set up budget categories first</p>
            <p className="text-xs text-brand-600/70 dark:text-brand-400/70">Add entries to Bills, Expenses, Savings or Debt — categories come from those tables.</p>
          </div>
        )}

        {/* Add form */}
        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
              <div className="p-4 mb-5 rounded-xl border border-brand-200 dark:border-brand-800/40"
                style={{ background: 'linear-gradient(135deg,rgba(107,92,230,0.04),rgba(234,92,132,0.03))' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#6b5ce6' }}>New transaction</p>
                {/* Responsive form grid: 1 col mobile, 2 col tablet, 4 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="label">Date</label>
                    <input className="input text-xs py-2" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}/>
                  </div>
                  <div>
                    <label className="label">Amount</label>
                    <input className="input text-xs py-2" type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}/>
                  </div>
                  <div>
                    <label className="label">Budget name</label>
                    <select className="input text-xs py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">Select category...</option>
                      {bills.length > 0 && <optgroup label="Bills">{bills.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</optgroup>}
                      {expenses.length > 0 && <optgroup label="Expenses">{expenses.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}</optgroup>}
                      {savings.length > 0 && <optgroup label="Savings">{savings.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</optgroup>}
                      {debt.length > 0 && <optgroup label="Debt">{debt.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</optgroup>}
                    </select>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <input className="input text-xs py-2" placeholder="e.g. Woolworths" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
                  </div>
                </div>
                {form.category && form.amount && (
                  <p className="text-xs mt-2" style={{ color: '#ea5c84' }}>
                    Adds {formatCurrency(parseFloat(form.amount)||0, currency)} to <strong>{form.category}</strong> actual
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={handleAdd} disabled={saving || !form.category || !form.amount} className="btn-primary text-xs disabled:opacity-50">
                    {saving ? 'Saving...' : 'Add transaction'}
                  </button>
                  <button onClick={() => setAdding(false)} className="btn-secondary text-xs">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table — scrollable on small screens */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-brand-100 dark:border-brand-900/30">
                <th className="table-header text-left py-2 pb-3 pl-4 sm:pl-0 pr-3">Date</th>
                <th className="table-header text-right py-2 pb-3 pr-3">Amount</th>
                <th className="table-header text-left py-2 pb-3 pr-3">Category</th>
                <th className="table-header text-left py-2 pb-3 pr-3 hidden sm:table-cell">Description</th>
                <th className="w-16 pr-4 sm:pr-0"/>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((txn, i) => (
                  <motion.tr key={txn.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.025 }}
                    className="border-b border-brand-50 dark:border-brand-900/20 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 group">
                    <td className="py-3 pr-3 text-xs sm:text-sm text-gray-500 pl-4 sm:pl-0 whitespace-nowrap">{txn.date}</td>
                    <td className="py-3 pr-3 text-xs sm:text-sm font-semibold text-right whitespace-nowrap" style={{ color: '#ea5c84' }}>
                      -{formatCurrency(txn.amount, currency)}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap"
                        style={{ background: 'rgba(107,92,230,0.1)', color: '#6b5ce6' }}>
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{txn.description || '—'}</td>
                    <td className="py-3 pr-4 sm:pr-0">
                      <button onClick={() => handleDelete({ id: txn.id, category: txn.category, amount: txn.amount })}
                        className="btn-danger opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        Del
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-sm text-gray-400 pl-4 sm:pl-0">
                  {userCategories.length > 0 ? 'No transactions found' : 'Add budget categories first'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
