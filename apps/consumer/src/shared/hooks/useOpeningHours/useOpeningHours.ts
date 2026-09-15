import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { openingHoursService } from '@shared/services/opening-hours/opening-hours.service'

export const useOpeningHours = (unitId: string | undefined) => {
  const query = useQuery<PublicOpeningHours[]>({
    queryKey: queryKeys.openingHours.byUnit(unitId ?? ''),
    queryFn: () => openingHoursService.getPublic(unitId as string),
    enabled: !!unitId,
  })

  return { ...query, hours: query.data ?? [] }
}
