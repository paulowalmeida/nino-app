import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { getPublicOpeningHours } from '@services/opening-hours/opening-hours.service'

export const useOpeningHours = (tenantId: string | undefined) => {
  const query = useQuery<PublicOpeningHours[]>({
    queryKey: queryKeys.openingHours.byTenant(tenantId ?? ''),
    queryFn: () => getPublicOpeningHours(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, hours: query.data ?? [] }
}
