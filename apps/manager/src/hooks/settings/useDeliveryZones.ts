import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { DeliveryZone } from '@custom_types/settings/delivery-zone'
import { DeliveryZoneService } from '@services/delivery-zone.service'

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
