import { useSearchParams } from 'react-router'

import { dateToKey, parseKey, todayKey } from '@pages/Cash/utils/cash-date/cash-date'

export const useCashDate = () => {
  const [params, setParams] = useSearchParams()
  const today = todayKey()
  const requested = params.get('data')
  const dateKey = requested && requested <= today ? requested : today
  const isToday = dateKey === today

  const setDate = (next: Date | undefined) =>
    setParams(
      (previous) => {
        const params = new URLSearchParams(previous)
        const key = next ? dateToKey(next) : today
        if (key >= today) params.delete('data')
        else params.set('data', key)
        return params
      },
      { replace: true }
    )

  return {
    date: parseKey(dateKey),
    dateKey,
    isToday,
    setDate,
  }
}
