import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'
import type { Recipient } from '@shared/types/order/recipient'

export const useCounterDeliveryQuote = (
  unitId: string | null,
  address: Partial<
    Pick<
      Recipient,
      | 'providerId'
      | 'zipCode'
      | 'street'
      | 'number'
      | 'complement'
      | 'neighborhood'
      | 'city'
      | 'state'
      | 'latitude'
      | 'longitude'
    >
  >
) => {
  const normalizedZipCode = address.zipCode?.replace(/\D/g, '') ?? ''
  const hasCoordinates =
    address.latitude !== undefined && address.longitude !== undefined
  const query = useQuery({
    queryKey: [
      'counter',
      'delivery-quote',
      unitId,
      normalizedZipCode,
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
      OrderService.getDeliveryQuote(unitId as string, normalizedZipCode, {
        latitude: address.latitude,
        longitude: address.longitude,
      }),
    enabled: !!unitId && (normalizedZipCode.length === 8 || hasCoordinates),
  })

  return { quote: query.data ?? undefined, isQuoting: query.isFetching }
}
