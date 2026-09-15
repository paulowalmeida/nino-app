import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CashService } from '@shared/services/cash/cash.service'

export const useCashSession = (
  unitId: string | null,
  isToday: boolean,
  dateKey: string
) => {
  const current = useQuery({
    queryKey: queryKeys.cash.current(unitId ?? ''),
    queryFn: () => CashService.getCurrentSession(unitId as string),
    enabled: !!unitId,
  })

  const byDate = useQuery({
    queryKey: queryKeys.cash.byDate(unitId ?? '', dateKey),
    queryFn: () => CashService.getSessionByDate(unitId as string, dateKey),
    enabled: !!unitId && !isToday,
  })

  const active = isToday ? current : byDate

  return {
    session: active.data ?? null,
    isLoadingSession: active.isPending,
    isSessionError: active.isError,
    currentSession: current.data ?? null,
  }
}
