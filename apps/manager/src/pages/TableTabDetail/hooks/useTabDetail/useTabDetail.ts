import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'

export const useTabDetail = (unitId: string | null, tabId: string) => {
  const query = useQuery({
    queryKey: queryKeys.tabs.detail(unitId ?? '', tabId),
    queryFn: () => TabService.getById(unitId as string, tabId),
    enabled: !!unitId && !!tabId,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
  })

  return {
    tab: query.data,
    isPending: query.isPending,
    isError: query.isError,
  }
}
