import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'
import type { UnitPause } from '@shared/types/store/unit-pause'

export const pauseKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'pause',
]

export const usePause = (unitId: string | null) =>
  useQuery<UnitPause>({
    queryKey: pauseKey(unitId ?? ''),
    queryFn: () => UnitService.getPause(unitId as string),
    enabled: !!unitId,
    refetchInterval: 60_000,
  })
