import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

export const useDeliveryZones = (unitId: string | undefined) => {
  const query = useQuery<PublicDeliveryZone[]>({
    queryKey: queryKeys.deliveryZones.byUnit(unitId ?? ''),
    queryFn: () => deliveryZoneService.listPublic(unitId as string),
    enabled: !!unitId,
  })

  return { ...query, zones: query.data ?? [] }
}
