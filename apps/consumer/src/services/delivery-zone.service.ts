import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import { api } from '@services/http.service'

export const getPublicDeliveryZones = (
  tenantId: string
): Promise<PublicDeliveryZone[]> =>
  api.get<PublicDeliveryZone[]>(`tenants/${tenantId}/delivery-zones/public`)

export const getDeliveryQuote = (
  tenantId: string,
  zipCode: string
): Promise<PublicDeliveryZone | null> =>
  api.get<PublicDeliveryZone | null>(
    `orders/guest/quote?tenantId=${encodeURIComponent(tenantId)}&zipCode=${encodeURIComponent(zipCode)}`
  )
