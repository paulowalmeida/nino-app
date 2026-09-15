import { useMutation, useQueryClient } from '@tanstack/react-query'

import { UnitService } from '@shared/services/unit/unit.service'
import type { PauseRequest } from '@shared/types/store/pause-request'
import type { UnitPause } from '@shared/types/store/unit-pause'

import { pauseKey } from '../usePause/usePause'

export const usePauseActions = (unitId: string | null) => {
  const queryClient = useQueryClient()

  const write = (pause: UnitPause) =>
    queryClient.setQueryData(pauseKey(unitId ?? ''), pause)

  const pause = useMutation({
    meta: {
      success: 'Loja fechada',
      errorTitle: 'A loja continua aberta',
    },
    mutationFn: (data: PauseRequest) =>
      UnitService.pauseStore(unitId as string, data),
    onSuccess: write,
  })

  const resume = useMutation({
    meta: {
      success: 'Loja reaberta',
      errorTitle: 'A loja continua fechada',
    },
    mutationFn: () => UnitService.resumeStore(unitId as string),
    onSuccess: write,
  })

  return { pause, resume }
}
