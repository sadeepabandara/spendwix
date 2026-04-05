'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store'
import { formatCurrency, formatDiff, pct } from '@/lib/utils'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

interface Row { id: string; name: string; budget: number; actual: number; due_day?: string | null }
interface Props {
  title: string
  table: 'bills' | 'expenses' | 'savings' | 'debt'
  rows: Row[]
  reload: () => void
  extraCol?: string
  isPro?: boolean
}

export default function BudgetTable({ title, table, rows, reload, extraCol, isPro }: Props) {
  const { currentMonth, getCurrency } = useStore()
  const currency = getCurrency()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', budget: '', actual: '', due_day: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', budget: '', actual: '', due_day: '' })
  const [saving, setSaving] = useState(false)
  const PRO_LIMIT = 5

  const getUser = async () => { const { data: { user } } = await supabase.auth.getUser(); return user }

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const user = await getUser()
    if (!user) { setSaving(false); return }
    await supabase.from(table).insert({
      user_id: user.id, month: currentMonth, name: form.name.trim(),
      budget: parseFloat(form.budget) || 0, actual: parseFloat(form.actual) || 0,
      ...(table === 'bills' ? { due_day: form.due_day } : {}),
    })
    setForm({ name: '', budget: '', actual: '', due_day: '' })
    setAdding(false)
    setSaving(false)
    reload()
  }

  const handleEdit = async (id: string) => {
    setSaving(true)
    await supabase.from(table).update({
      name: editForm.name.trim(), budget: parseFloat(editForm.budget) || 0,
      actual: parseFloat(editForm.actual) || 0,
      ...(table === 'bills' ? { due_day: editForm.due_day } : {}),
    }).eq('id', id)
    setEditId(null)
    setSaving(false)
    reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from(table).delete().eq('id', id)
    reload()
  }

  const startEdit = (row: Row) => {
    setEditId(row.id)
    setEditForm({ name: row.name, budget: String(row.budget), actual: String(row.actual), due_day: row.due_day || '' })
  }

  const totalBudget = rows.reduce((s, r) => s + r.budget, 0)
  const totalActual = rows.reduce((s, r) => s + r.actual, 0)
  const atLimit = !isPro && rows.length >= PRO_LIMIT

  return (
    <div className="card p-4 sm:p-6 bg-white/95 dark:bg-[#13182a] border border-gray-100 dark:border-[#252c46]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="section-title mb-0">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatCurrency(totalActual, currency)} of {formatCurrency(totalBudget, currency)} budgeted
          </p>
        </div>
        <button onClick={() => !atLimit && setAdding(true)}
          className={clsx('flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap self-start sm:self-auto',
            atLimit ? 'bg-amber-50 text-amber-600 border border-amber-200 cursor-not-allowed' : 'btn-primary')}>
          {atLimit
            ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Pro limit</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add</>
          }
        </button>
      </div>

      {/* Mobile card view (xs-sm) */}
      <div className="sm:hidden space-y-3">
        <AnimatePresence>
          {rows.map((row, i) => {
            const p = pct(row.actual, row.budget)
            const over = row.actual > row.budget
            return (
              <motion.div key={row.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="rounded-xl p-3 border border-brand-100 dark:border-[#252c46] bg-brand-50/30 dark:bg-[#101425]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{row.name}</p>
                    {extraCol && row.due_day && <p className="text-xs text-gray-400">Due: {row.due_day}</p>}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(row)} className="text-xs px-2 py-1 btn-secondary">Edit</button>
                    <button onClick={() => handleDelete(row.id)} className="btn-danger">Del</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div><span className="text-gray-400 block">Budget</span><span className="font-medium">{formatCurrency(row.budget, currency)}</span></div>
                  <div><span className="text-gray-400 block">Actual</span><span className="font-medium">{formatCurrency(row.actual, currency)}</span></div>
                  <div><span className="text-gray-400 block">Diff</span>
                    <span className={clsx('font-medium', over ? 'text-red-500' : 'text-brand-600 dark:text-brand-400')}>
                      {formatDiff(row.budget - row.actual, currency)}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={clsx('progress-fill', over ? 'bg-red-400' : 'bg-brand-500')} style={{ width: `${p}%` }}/>
                </div>
                <span className="text-xs text-gray-400">{p}%</span>

                {/* Edit form in mobile */}
                {editId === row.id && (
                  <div className="mt-3 pt-3 border-t border-brand-100 dark:border-[#252c46] space-y-2">
                    <input className="input py-1.5 text-xs" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name"/>
                    {extraCol && <input className="input py-1.5 text-xs" value={editForm.due_day} onChange={e => setEditForm(f => ({ ...f, due_day: e.target.value }))} placeholder="Due day"/>}
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input py-1.5 text-xs" type="number" value={editForm.budget} onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))} placeholder="Budget"/>
                      <input className="input py-1.5 text-xs" type="number" value={editForm.actual} onChange={e => setEditForm(f => ({ ...f, actual: e.target.value }))} placeholder="Actual"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(row.id)} disabled={saving} className="btn-primary text-xs px-3 py-1.5">Save</button>
                      <button onClick={() => setEditId(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Mobile add form */}
        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="rounded-xl p-3 border border-brand-200 dark:border-[#2c3553] space-y-2"
                style={{ background: 'linear-gradient(135deg,rgba(107,92,230,0.05),rgba(234,92,132,0.04))' }}>
                <input autoFocus className="input py-2 text-xs" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
                {extraCol && <input className="input py-2 text-xs" placeholder="Due day (e.g. 15th)" value={form.due_day} onChange={e => setForm(f => ({ ...f, due_day: e.target.value }))}/>}
                <div className="grid grid-cols-2 gap-2">
                  <input className="input py-2 text-xs" type="number" placeholder="Budget" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}/>
                  <input className="input py-2 text-xs" type="number" placeholder="Actual" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAdd} disabled={saving} className="btn-primary text-xs px-3 py-1.5">Add</button>
                  <button onClick={() => setAdding(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {rows.length === 0 && !adding && (
          <p className="text-center py-8 text-sm text-gray-400">No entries yet — tap Add to get started</p>
        )}
      </div>

      {/* Desktop table view (sm+) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-100 dark:border-[#252c46]">
              <th className="table-header text-left py-2 pb-3 pr-2">Name</th>
              {extraCol && <th className="table-header text-left py-2 pb-3 pr-2 hidden md:table-cell">{extraCol}</th>}
              <th className="table-header text-right py-2 pb-3 pr-2">Budget</th>
              <th className="table-header text-right py-2 pb-3 pr-2">Actual</th>
              <th className="table-header text-right py-2 pb-3 pr-2 hidden md:table-cell">Diff</th>
              <th className="table-header text-left py-2 pb-3 pl-4 hidden xl:table-cell">Progress</th>
              <th className="w-20"/>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((row, i) => (
                <motion.tr key={row.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-brand-50 dark:border-[#20263d] hover:bg-brand-50/30 dark:hover:bg-white/5 group">
                  {editId === row.id ? (
                    <>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}/></td>
                      {extraCol && <td className="py-2 pr-2 hidden md:table-cell"><input className="input py-1.5 text-xs w-20" value={editForm.due_day} onChange={e => setEditForm(f => ({ ...f, due_day: e.target.value }))}/></td>}
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" value={editForm.budget} onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))}/></td>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" value={editForm.actual} onChange={e => setEditForm(f => ({ ...f, actual: e.target.value }))}/></td>
                      <td className="hidden md:table-cell"/><td className="hidden xl:table-cell"/>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(row.id)} disabled={saving} className="btn-primary text-xs px-2 py-1">Save</button>
                          <button onClick={() => setEditId(null)} className="btn-secondary text-xs px-2 py-1">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-2 text-sm font-medium text-gray-800 dark:text-gray-200">{row.name}</td>
                      {extraCol && <td className="py-3 pr-2 text-xs text-gray-400 hidden md:table-cell">{row.due_day || '—'}</td>}
                      <td className="py-3 pr-2 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.budget, currency)}</td>
                      <td className="py-3 pr-2 text-sm font-medium text-right">{formatCurrency(row.actual, currency)}</td>
                      <td className={clsx('py-3 pr-2 text-sm text-right font-medium hidden md:table-cell', row.budget - row.actual >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
                        {formatDiff(row.budget - row.actual, currency)}
                      </td>
                      <td className="py-3 pl-4 hidden xl:table-cell">
                        <div className="w-20 progress-bar">
                          <div className={clsx('progress-fill', row.actual > row.budget ? 'bg-red-400' : 'bg-brand-500')} style={{ width: `${pct(row.actual, row.budget)}%` }}/>
                        </div>
                        <span className="text-xs text-gray-400 mt-0.5 block">{pct(row.actual, row.budget)}%</span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(row)} className="btn-secondary text-xs px-2 py-1">Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="btn-danger">Del</button>
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {adding && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="border-b border-brand-100 dark:border-[#252c46] bg-brand-50/30 dark:bg-[#101425]">
                  <td className="py-2 pr-2"><input autoFocus className="input py-1.5 text-xs" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></td>
                  {extraCol && <td className="py-2 pr-2 hidden md:table-cell"><input className="input py-1.5 text-xs w-20" placeholder="15th" value={form.due_day} onChange={e => setForm(f => ({ ...f, due_day: e.target.value }))}/></td>}
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" placeholder="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}/></td>
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" placeholder="0" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))}/></td>
                  <td className="hidden md:table-cell"/><td className="hidden xl:table-cell"/>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <button onClick={handleAdd} disabled={saving} className="btn-primary text-xs px-2 py-1">Add</button>
                      <button onClick={() => setAdding(false)} className="btn-secondary text-xs px-2 py-1">Cancel</button>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>

            {rows.length === 0 && !adding && (
              <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-400">No entries yet — click Add to get started</td></tr>
            )}
          </tbody>

          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t border-brand-100 dark:border-[#252c46]">
                <td className="pt-3 pr-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</td>
                {extraCol && <td className="hidden md:table-cell"/>}
                <td className="pt-3 pr-2 text-sm font-medium text-right text-gray-700 dark:text-gray-300">{formatCurrency(totalBudget, currency)}</td>
                <td className="pt-3 pr-2 text-sm font-medium text-right text-gray-700 dark:text-gray-300">{formatCurrency(totalActual, currency)}</td>
                <td className={clsx('pt-3 pr-2 text-sm text-right font-medium hidden md:table-cell', totalBudget - totalActual >= 0 ? 'text-brand-600' : 'text-red-500')}>
                  {formatDiff(totalBudget - totalActual, currency)}
                </td>
                <td className="hidden xl:table-cell"/><td/>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
