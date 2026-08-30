import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { CashService } from '@shared/services/cash/cash.service'

export const useCashSession = (
  tenantId: string | null,
  isToday: boolean,
  dateKey: string
) => {
  const current = useQuery({
    queryKey: queryKeys.cash.current(tenantId ?? ''),
    queryFn: () => CashService.getCurrentSession(tenantId as string),
    enabled: !!tenantId,
  })

  const byDate = useQuery({
    queryKey: queryKeys.cash.byDate(tenantId ?? '', dateKey),
    queryFn: () => CashService.getSessionByDate(tenantId as string, dateKey),
    enabled: !!tenantId && !isToday,
  })

  const active = isToday ? current : byDate

  return {
    session: active.data ?? null,
    isLoadingSession: active.isPending,
    isSessionError: active.isError,
    currentSession: current.data ?? null,
  }
}
