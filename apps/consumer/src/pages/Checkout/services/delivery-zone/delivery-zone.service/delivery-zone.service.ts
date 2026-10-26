import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import { api } from '@shared/services/http/http.service'

export const deliveryZoneService = {
  listPublic: (unitId: string): Promise<PublicDeliveryZone[]> =>
    api.get<PublicDeliveryZone[]>(`units/${unitId}/delivery-zones/public`),
  getQuote: (
    unitId: string,
    zipCode: string,
    coordinates: { latitude?: number; longitude?: number } = {}
  ): Promise<PublicDeliveryZone | null> =>
    api.get<PublicDeliveryZone | null>(
      (() => {
        const params = new URLSearchParams({ unitId })
        if (zipCode) params.set('zipCode', zipCode)
        if (
          coordinates.latitude !== undefined &&
          coordinates.longitude !== undefined
        ) {
          params.set('latitude', String(coordinates.latitude))
          params.set('longitude', String(coordinates.longitude))
        }
        return `orders/guest/quote?${params.toString()}`
      })()
    ),
}
