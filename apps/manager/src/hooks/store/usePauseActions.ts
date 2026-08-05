import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PauseRequest } from '@custom_types/store/pause-request'
import type { TenantPause } from '@custom_types/store/tenant-pause'
import { TenantService } from '@services/tenant.service'

import { pauseKey } from './usePause'

export const usePauseActions = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  const write = (pause: TenantPause) =>
    queryClient.setQueryData(pauseKey(tenantId ?? ''), pause)

  const pause = useMutation({
    meta: {
      success: 'Loja fechada',
      errorTitle: 'A loja continua aberta',
    },
    mutationFn: (data: PauseRequest) =>
      TenantService.pauseStore(tenantId as string, data),
    onSuccess: write,
  })

  const resume = useMutation({
    meta: {
      success: 'Loja reaberta',
      errorTitle: 'A loja continua fechada',
    },
    mutationFn: () => TenantService.resumeStore(tenantId as string),
    onSuccess: write,
  })

  return { pause, resume }
}
