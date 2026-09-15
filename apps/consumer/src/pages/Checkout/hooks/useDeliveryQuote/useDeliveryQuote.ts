import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

export const useDeliveryQuote = (
  unitId: string | undefined,
  zipCode: string | undefined
) => {
  const normalizedZipCode = zipCode?.replace(/\D/g, '') ?? ''
  const query = useQuery({
    queryKey: queryKeys.deliveryQuote.byUnitAndZip(
      unitId ?? '',
      normalizedZipCode
    ),
    queryFn: () =>
      deliveryZoneService.getQuote(unitId as string, normalizedZipCode),
    enabled: !!unitId && normalizedZipCode.length === 8,
  })

  return { ...query, quote: query.data ?? undefined }
}
