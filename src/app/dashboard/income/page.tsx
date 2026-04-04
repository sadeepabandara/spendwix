'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import clsx from 'clsx'

export default function IncomePage() {
  useMonthData()
  const { income, setIncome, currentMonth, getCurrency } = useStore()
  const currency = getCurrency()

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', payday: '', expected: '', actual: '', start_day: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', payday: '', expected: '', actual: '', start_day: '' })
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase.from('income').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at')
      if (error) {
        console.error('Error loading income:', error)
        return
      }
      if (data) setIncome(data)
    } catch (err) {
      console.error('Failed to reload income:', err)
    }
  }, [currentMonth, setIncome])

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('income').insert({
        user_id: user.id, month: currentMonth,
        name: form.name.trim(), payday: form.payday || null,
        expected: parseFloat(form.expected) || 0,
        actual: parseFloat(form.actual) || 0,
        start_day: form.start_day || null,
      })
      if (error) {
        console.error('Error adding income:', error)
        return
      }
      setForm({ name: '', payday: '', expected: '', actual: '', start_day: '' })
      setAdding(false)
      reload()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (id: string) => {
    setSaving(true)
    try {
      const { error } = await supabase.from('income').update({
        name: editForm.name.trim(), payday: editForm.payday || null,
        expected: parseFloat(editForm.expected) || 0,
        actual: parseFloat(editForm.actual) || 0,
        start_day: editForm.start_day || null,
      }).eq('id', id)
      if (error) {
        console.error('Error updating income:', error)
        return
      }
      setEditId(null)
      reload()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('income').delete().eq('id', id)
      if (error) {
        console.error('Error deleting income:', error)
        return
      }
      reload()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const totalExpected = income.reduce((s, r) => s + r.expected, 0)
  const totalActual = income.reduce((s, r) => s + r.actual, 0)
  const diff = totalActual - totalExpected

  return (
    <div>
      <PageHeader title="Income" subtitle={`${getMonthLabel(currentMonth)} income sources`}/>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Expected" value={formatCurrency(totalExpected, currency)}/>
        <StatCard label="Actual received" value={formatCurrency(totalActual, currency)} color="green"/>
        <StatCard label="Difference" value={formatCurrency(Math.abs(diff), currency)}
          sub={diff >= 0 ? 'ahead of plan' : 'behind plan'}
          color={diff >= 0 ? 'green' : 'red'}/>
      </div>

      <div className="p-6 card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="mb-0 section-title">Income sources</h2>
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-1.5 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add income
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 sm:rounded-xl">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Name','Payday','Start day','Expected','Actual','Diff',''].map(h => (
                  <th key={h} className={clsx('table-header py-2 pb-3', h === '' ? 'w-20' : h === 'Expected' || h === 'Actual' || h === 'Diff' ? 'text-right' : 'text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {income.map(row => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  {editId === row.id ? (
                    <>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}/></td>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs" type="date" value={editForm.payday} onChange={e => setEditForm(f => ({ ...f, payday: e.target.value }))}/></td>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs" type="date" value={editForm.start_day} onChange={e => setEditForm(f => ({ ...f, start_day: e.target.value }))}/></td>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" value={editForm.expected} onChange={e => setEditForm(f => ({ ...f, expected: e.target.value }))}/></td>
                      <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" value={editForm.actual} onChange={e => setEditForm(f => ({ ...f, actual: e.target.value }))}/></td>
                      <td/>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(row.id)} disabled={saving} className="px-2 py-1 text-xs btn-primary">Save</button>
                          <button onClick={() => setEditId(null)} className="px-2 py-1 text-xs btn-secondary">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-2 text-sm font-medium text-gray-800 dark:text-gray-200">{row.name}</td>
                      <td className="py-3 pr-2 text-sm text-gray-500">{row.payday || '—'}</td>
                      <td className="py-3 pr-2 text-sm text-gray-500">{row.start_day || '—'}</td>
                      <td className="py-3 pr-2 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.expected, currency)}</td>
                      <td className="py-3 pr-2 text-sm font-medium text-right text-gray-800 dark:text-gray-200">{formatCurrency(row.actual, currency)}</td>
                      <td className={clsx('py-3 pr-2 text-sm text-right font-medium', row.actual - row.expected >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
                        {row.actual - row.expected >= 0 ? '+' : ''}{formatCurrency(row.actual - row.expected, currency)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                          <button onClick={() => { setEditId(row.id); setEditForm({ name: row.name, payday: row.payday || '', expected: String(row.expected), actual: String(row.actual), start_day: row.start_day || '' }) }} className="px-2 py-1 text-xs btn-secondary">Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="btn-danger">Del</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {adding && (
                <tr className="border-b border-brand-100 dark:border-brand-900 bg-brand-50/30 dark:bg-brand-950/20">
                  <td className="py-2 pr-2"><input autoFocus className="input py-1.5 text-xs" placeholder="Paycheck" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></td>
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs" type="date" value={form.payday} onChange={e => setForm(f => ({ ...f, payday: e.target.value }))}/></td>
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs" type="date" value={form.start_day} onChange={e => setForm(f => ({ ...f, start_day: e.target.value }))}/></td>
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" placeholder="0" value={form.expected} onChange={e => setForm(f => ({ ...f, expected: e.target.value }))}/></td>
                  <td className="py-2 pr-2"><input className="input py-1.5 text-xs text-right" type="number" placeholder="0" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))}/></td>
                  <td/>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <button onClick={handleAdd} disabled={saving} className="px-2 py-1 text-xs btn-primary">Add</button>
                      <button onClick={() => setAdding(false)} className="px-2 py-1 text-xs btn-secondary">Cancel</button>
                    </div>
                  </td>
                </tr>
              )}

              {income.length === 0 && !adding && (
                <tr><td colSpan={7} className="py-10 text-sm text-center text-gray-400">No income entries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
