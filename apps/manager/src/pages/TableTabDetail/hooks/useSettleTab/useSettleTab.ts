import { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import type { Tab } from '@shared/types/tab/tab'

export const useSettleTab = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return (tab: Tab) => {
    queryClient.setQueryData(queryKeys.tabs.detail(unitId ?? '', tab.id), tab)
    queryClient.invalidateQueries({
      queryKey: queryKeys.tabs.lists(unitId ?? ''),
    })
  }
}
