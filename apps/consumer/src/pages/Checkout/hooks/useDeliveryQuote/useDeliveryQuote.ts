import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'
import type { DeliveryQuoteDestination } from '@pages/checkout/types/delivery-quote/DeliveryQuoteDestination.type'

/**
 * WHY: a chave é só o destino que vai para o backend (o ponto ou o id do
 * endereço salvo). Rua/complemento digitados não entram, senão cada tecla
 * dispararia uma nova cotação e faria a taxa piscar.
 */
const destinationKey = (destination: DeliveryQuoteDestination): string =>
  'id' in destination
    ? destination.id
    : `${destination.latitude},${destination.longitude}`

export const useDeliveryQuote = (
  unitId: string | undefined,
  destination: DeliveryQuoteDestination | undefined
) => {
  const query = useQuery({
    queryKey: queryKeys.deliveryQuote.byUnitAndDestination(
      unitId ?? '',
      destination ? destinationKey(destination) : ''
    ),
    queryFn: () =>
      deliveryZoneService.getQuote(
        unitId as string,
        destination as DeliveryQuoteDestination
      ),
    enabled: !!unitId && !!destination,
  })

  return { ...query, quote: query.data ?? undefined }
}
