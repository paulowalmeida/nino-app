import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OpeningHoursService } from '@shared/services/opening-hours/opening-hours.service'
import type { OpeningHours } from '@shared/types/settings/opening-hours'

/** Stable identity so consumers can compare snapshots by reference. */
const NONE: OpeningHours[] = []

export const hoursKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'opening-hours',
]

export const useOpeningHours = (unitId: string | null) => {
  const query = useQuery({
    queryKey: hoursKey(unitId ?? ''),
    queryFn: () => OpeningHoursService.listOpeningHours(unitId as string),
    enabled: !!unitId,
  })

  const hours: OpeningHours[] = query.data?.data ?? NONE

  return { ...query, hours }
}
