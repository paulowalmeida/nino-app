import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PauseRequest, TenantPause } from '@custom_types/store'
import { getPause, pauseStore, resumeStore } from '@services/store/store.service'

const pauseKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'pause',
]

export const usePause = (tenantId: string | null) =>
  useQuery<TenantPause>({
    queryKey: pauseKey(tenantId ?? ''),
    queryFn: () => getPause(tenantId as string),
    enabled: !!tenantId,
    refetchInterval: 60_000,
  })

export const usePauseActions = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  const write = (pause: TenantPause) =>
    queryClient.setQueryData(pauseKey(tenantId ?? ''), pause)

  const pause = useMutation({
    mutationFn: (data: PauseRequest) => pauseStore(tenantId as string, data),
    onSuccess: write,
  })

  const resume = useMutation({
    mutationFn: () => resumeStore(tenantId as string),
    onSuccess: write,
  })

  return { pause, resume }
}
