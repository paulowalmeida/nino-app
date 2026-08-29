import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { openingHoursService } from '@shared/services/opening-hours/opening-hours.service'

export const useOpeningHours = (tenantId: string | undefined) => {
  const query = useQuery<PublicOpeningHours[]>({
    queryKey: queryKeys.openingHours.byTenant(tenantId ?? ''),
    queryFn: () => openingHoursService.getPublic(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, hours: query.data ?? [] }
}
