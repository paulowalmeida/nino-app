import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import type { DeliveryQuoteDestination } from '@pages/checkout/types/delivery-quote/DeliveryQuoteDestination.type'
import { api } from '@shared/services/http/http.service'

const quoteParams = (
  unitId: string,
  destination: DeliveryQuoteDestination
): URLSearchParams =>
  'id' in destination
    ? new URLSearchParams({
        unitId,
        street: destination.street,
        number: destination.number,
        neighborhood: destination.neighborhood,
        city: destination.city,
        state: destination.state,
        zipCode: destination.zipCode,
      })
    : new URLSearchParams({
        unitId,
        latitude: String(destination.latitude),
        longitude: String(destination.longitude),
      })

export const deliveryZoneService = {
  listPublic: (unitId: string): Promise<PublicDeliveryZone[]> =>
    api.get<PublicDeliveryZone[]>(`units/${unitId}/delivery-zones/public`),
  getQuote: (
    unitId: string,
    destination: DeliveryQuoteDestination
  ): Promise<PublicDeliveryZone | null> =>
    api.get<PublicDeliveryZone | null>(
      `orders/guest/quote?${quoteParams(unitId, destination).toString()}`
    ),
}
