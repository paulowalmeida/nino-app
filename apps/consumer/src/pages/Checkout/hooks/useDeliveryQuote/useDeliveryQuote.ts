import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

type DeliveryQuoteAddress = {
  providerId?: string
  zipCode?: string
  latitude?: number
  longitude?: number
}

/**
 * WHY: a cotação só depende do CEP e das coordenadas — é só isso que
 * `getQuote` manda pro backend. Incluir rua/número/complemento/bairro na
 * chave da query fazia qualquer tecla nesses campos (mesmo sem mudar CEP ou
 * coordenada) disparar uma nova cotação, piscando o spinner e a taxa.
 */
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
