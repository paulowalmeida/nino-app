import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'
import type { DeliveryQuoteDestination } from '@shared/types/order/delivery-quote-destination.type'
import type { Recipient } from '@shared/types/order/recipient'

type CounterQuoteAddress = Partial<
  Pick<
    Recipient,
    | 'zipCode'
    | 'street'
    | 'number'
    | 'neighborhood'
    | 'city'
    | 'state'
    | 'latitude'
    | 'longitude'
  >
>

const toDestination = (
  address: CounterQuoteAddress
): DeliveryQuoteDestination | undefined => {
  const { latitude, longitude, street, number, city, state } = address
  if (latitude !== undefined && longitude !== undefined) {
    return { latitude, longitude }
  }
  if (!street || !number || !city || !state) return undefined
  return {
    zipCode: address.zipCode ?? '',
    street,
    number,
    neighborhood: address.neighborhood ?? '',
    city,
    state,
  }
}

export const useCounterDeliveryQuote = (
  unitId: string | null,
  address: CounterQuoteAddress
) => {
  const destination = toDestination(address)
  const query = useQuery({
    queryKey: ['counter', 'delivery-quote', unitId, destination],
    queryFn: () =>
      OrderService.getDeliveryQuote(
        unitId as string,
        destination as DeliveryQuoteDestination
      ),
    enabled: !!unitId && !!destination,
  })

  return { quote: query.data ?? undefined, isQuoting: query.isFetching }
}
