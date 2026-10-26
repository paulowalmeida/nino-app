import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { TabService } from '@shared/services/tab/tab.service/tab.service'
import type { CreateTabRequest } from '@shared/types/tab/create-tab-request.type'
import type { Tab } from '@shared/types/tab/tab.type'

export const useOpenTab = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<Tab, Error, CreateTabRequest>({
    mutationFn: (request) => TabService.openTab(unitId as string, request),
    onSuccess: () => {
      toast.success('Comanda aberta')
      queryClient.invalidateQueries({
        queryKey: queryKeys.tabs.all(unitId ?? ''),
      })
    },
  })

  return {
    submitOpen: mutation.mutate,
    isOpening: mutation.isPending,
  }
}
