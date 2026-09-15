import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'
import type { UnitDetail } from '@shared/types/store/unit-detail'

export const detailKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'detail',
]

export const useUnitDetail = (unitId: string | null) =>
  useQuery<UnitDetail>({
    queryKey: detailKey(unitId ?? ''),
    queryFn: () => UnitService.getById(unitId as string),
    enabled: !!unitId,
  })
