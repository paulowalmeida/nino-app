import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import { api } from '@shared/services/http/http.service'

export const deliveryZoneService = {
  listPublic: (unitId: string): Promise<PublicDeliveryZone[]> =>
    api.get<PublicDeliveryZone[]>(`units/${unitId}/delivery-zones/public`),
  getQuote: (
    unitId: string,
    zipCode: string
  ): Promise<PublicDeliveryZone | null> =>
    api.get<PublicDeliveryZone | null>(
      'orders/guest/quote?' +
        `unitId=${encodeURIComponent(unitId)}&` +
        `zipCode=${encodeURIComponent(zipCode)}`
    ),
}
