import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

type DeliveryQuoteAddress = {
  providerId?: string
  zipCode?: string
  street?: string
  number?: string
  complement?: string | null
  neighborhood?: string
  city?: string
  state?: string
  latitude?: number
  longitude?: number
}

export const useDeliveryQuote = (
  unitId: string | undefined,
  address: DeliveryQuoteAddress
) => {
  const normalizedZipCode = address.zipCode?.replace(/\D/g, '') ?? ''
  const hasCoordinates =
    address.latitude !== undefined && address.longitude !== undefined
  const query = useQuery({
    queryKey: [
      ...queryKeys.deliveryQuote.byUnitAndZip(unitId ?? '', normalizedZipCode),
      address.providerId,
      address.street,
      address.number,
      address.complement,
      address.neighborhood,
      address.city,
      address.state,
      address.latitude,
      address.longitude,
    ],
    queryFn: () =>
      deliveryZoneService.getQuote(unitId as string, normalizedZipCode, {
        latitude: address.latitude,
        longitude: address.longitude,
      }),
    enabled: !!unitId && (normalizedZipCode.length === 8 || hasCoordinates),
  })

  return { ...query, quote: query.data ?? undefined }
}
