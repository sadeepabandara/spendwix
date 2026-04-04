import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store'

export function useMonthData() {
  const {
    currentMonth, setIncome, setBills, setExpenses,
    setSavings, setDebt, setTransactions, setProfile, setLoading
  } = useStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [prof, inc, bil, exp, sav, dbt, txn] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('income').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
          supabase.from('bills').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
          supabase.from('expenses').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
          supabase.from('savings').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
          supabase.from('debt').select('*').eq('user_id', user.id).eq('month', currentMonth).order('created_at'),
          supabase.from('transactions').select('*').eq('user_id', user.id).eq('month', currentMonth).order('date'),
        ])

        if (prof.data) setProfile(prof.data)
        if (inc.data) setIncome(inc.data)
        if (bil.data) setBills(bil.data)
        if (exp.data) setExpenses(exp.data)
        if (sav.data) setSavings(sav.data)
        if (dbt.data) setDebt(dbt.data)
        if (txn.data) setTransactions(txn.data)
      } catch (error) {
        console.error('Error loading month data:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentMonth, setProfile, setIncome, setBills, setExpenses, setSavings, setDebt, setTransactions, setLoading])
}
