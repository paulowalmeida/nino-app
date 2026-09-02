import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import { api } from '@shared/services/http/http.service'

export const deliveryZoneService = {
  listPublic: (tenantId: string): Promise<PublicDeliveryZone[]> =>
    api.get<PublicDeliveryZone[]>(`tenants/${tenantId}/delivery-zones/public`),
  getQuote: (
    tenantId: string,
    zipCode: string
  ): Promise<PublicDeliveryZone | null> =>
    api.get<PublicDeliveryZone | null>(
      'orders/guest/quote?' +
        `tenantId=${encodeURIComponent(tenantId)}&` +
        `zipCode=${encodeURIComponent(zipCode)}`
    ),
}
