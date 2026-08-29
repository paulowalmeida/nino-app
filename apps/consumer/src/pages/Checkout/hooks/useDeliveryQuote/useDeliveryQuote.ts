import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

export const useDeliveryQuote = (
  tenantId: string | undefined,
  zipCode: string | undefined
) => {
  const normalizedZipCode = zipCode?.replace(/\D/g, '') ?? ''
  const query = useQuery({
    queryKey: queryKeys.deliveryQuote.byTenantAndZip(
      tenantId ?? '',
      normalizedZipCode
    ),
    queryFn: () =>
      deliveryZoneService.getQuote(tenantId as string, normalizedZipCode),
    enabled: !!tenantId && normalizedZipCode.length === 8,
  })

  return { ...query, quote: query.data ?? undefined }
}
