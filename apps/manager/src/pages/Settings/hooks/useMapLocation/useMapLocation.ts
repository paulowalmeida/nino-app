import { useQuery } from '@tanstack/react-query'

import { TenantService } from '@shared/services/tenant/tenant.service'
import { queryKeys } from '@shared/lib/query-keys'

export const mapLocationKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'map-location',
]

export const useMapLocation = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: mapLocationKey(tenantId ?? ''),
    queryFn: () => TenantService.getMapLocation(tenantId as string),
    enabled: !!tenantId,
  })

  const coordinates = query.data ?? null

  return {
    ...query,
    coordinates,
    isResolved: !!tenantId && !query.isPending,
    hasLocation: !!coordinates,
  }
}
