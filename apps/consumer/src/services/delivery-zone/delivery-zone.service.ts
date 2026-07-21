import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import { get } from '@services/api/api.service'

export const getPublicDeliveryZones = (
  tenantId: string
): Promise<PublicDeliveryZone[]> =>
  get<PublicDeliveryZone[]>(`tenants/${tenantId}/delivery-zones/public`)
