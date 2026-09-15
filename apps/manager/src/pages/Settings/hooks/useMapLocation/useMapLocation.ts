import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'

export const mapLocationKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'map-location',
]

export const useMapLocation = (unitId: string | null) => {
  const query = useQuery({
    queryKey: mapLocationKey(unitId ?? ''),
    queryFn: () => UnitService.getMapLocation(unitId as string),
    enabled: !!unitId,
  })

  const coordinates = query.data ?? null

  return {
    ...query,
    coordinates,
    isResolved: !!unitId && !query.isPending,
    hasLocation: !!coordinates,
  }
}
