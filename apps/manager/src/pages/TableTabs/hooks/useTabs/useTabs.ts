import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'
import type { TabStatus } from '@shared/types/tab/tab-status'

export const useTabs = (
  unitId: string | null,
  statuses: readonly TabStatus[]
) => {
  const query = useQuery({
    queryKey: queryKeys.tabs.list(unitId ?? '', statuses),
    queryFn: () => TabService.listTabs(unitId as string, [...statuses]),
    enabled: !!unitId,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
  })

  return {
    tabs: query.data?.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
  }
}
