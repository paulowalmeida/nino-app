import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PositionsService } from '@shared/services/positions/positions.service/positions.service'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const useUnitPositions = (unitId: string | null, enabled = true) =>
  useQuery<UnitPosition[]>({
    queryKey: queryKeys.positions.list(unitId ?? ''),
    queryFn: () => PositionsService.list(unitId as string),
    enabled: !!unitId && enabled,
  })
