import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { CashService } from '@shared/services/cash/cash.service'

export const useCashSession = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.cash.current(tenantId ?? ''),
    queryFn: () => CashService.getCurrentSession(tenantId as string),
    enabled: !!tenantId,
  })

  return {
    session: query.data ?? null,
    isLoadingSession: query.isPending,
    isSessionError: query.isError,
  }
}
