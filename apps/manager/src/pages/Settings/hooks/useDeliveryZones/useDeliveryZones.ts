import { useQuery } from '@tanstack/react-query'

import { DeliveryZoneService } from '@pages/Settings/services/delivery-zone/delivery-zone.service'
import { queryKeys } from '@shared/lib/query-keys'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

export const zonesKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'delivery-zones',
]

export const useDeliveryZones = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: zonesKey(tenantId ?? ''),
    queryFn: () => DeliveryZoneService.listDeliveryZones(tenantId as string),
    enabled: !!tenantId,
  })

  const zones: DeliveryZone[] = query.data?.data ?? []

  return { ...query, zones }
}
