import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { OpeningHours } from '@custom_types/settings'
import { OpeningHoursService } from '@services/opening-hours.service'

/** Stable identity so consumers can compare snapshots by reference. */
const NONE: OpeningHours[] = []

export const hoursKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'opening-hours',
]

export const useOpeningHours = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: hoursKey(tenantId ?? ''),
    queryFn: () => OpeningHoursService.listOpeningHours(tenantId as string),
    enabled: !!tenantId,
  })

  const hours: OpeningHours[] = query.data?.data ?? NONE

  return { ...query, hours }
}
