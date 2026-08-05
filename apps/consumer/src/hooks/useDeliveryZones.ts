import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import { getPublicDeliveryZones } from '@services/delivery-zone.service'

export const useDeliveryZones = (tenantId: string | undefined) => {
  const query = useQuery<PublicDeliveryZone[]>({
    queryKey: queryKeys.deliveryZones.byTenant(tenantId ?? ''),
    queryFn: () => getPublicDeliveryZones(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, zones: query.data ?? [] }
}
