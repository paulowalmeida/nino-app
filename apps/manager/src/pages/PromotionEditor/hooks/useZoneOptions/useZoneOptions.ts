import { toZoneOptions } from '@pages/PromotionEditor/adapters/zoneOptions.adapter/zoneOptions.adapter'
import { useDeliveryZones } from '@shared/hooks/delivery-zone/useDeliveryZones/useDeliveryZones'

export const useZoneOptions = (unitId: string | null) => {
  const { zones, isPending } = useDeliveryZones(unitId)
  return { zoneOptions: toZoneOptions(zones), isPending }
}
