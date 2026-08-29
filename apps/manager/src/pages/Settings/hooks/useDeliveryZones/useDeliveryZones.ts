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

  const zones: DeliveryZone[] = [...(query.data?.data ?? [])]
    .map((zone) => ({
      ...zone,
      maxRadiusKm: Number(zone.maxRadiusKm),
      fee: Number(zone.fee),
    }))
    .sort((left, right) => left.maxRadiusKm - right.maxRadiusKm)
    .map((zone, index, sortedZones) => ({
      ...zone,
      minRadiusKm: index === 0 ? 0 : sortedZones[index - 1].maxRadiusKm,
    }))

  return { ...query, zones }
}
