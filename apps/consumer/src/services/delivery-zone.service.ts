import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import { api } from '@services/http.service'

export const getPublicDeliveryZones = (
  tenantId: string
): Promise<PublicDeliveryZone[]> =>
  api.get<PublicDeliveryZone[]>(`tenants/${tenantId}/delivery-zones/public`)
