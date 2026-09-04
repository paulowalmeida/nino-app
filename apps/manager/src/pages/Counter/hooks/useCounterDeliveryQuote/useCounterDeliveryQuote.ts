import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'

export const useCounterDeliveryQuote = (
  tenantId: string | null,
  zipCode: string
) => {
  const normalizedZipCode = zipCode.replace(/\D/g, '')
  const query = useQuery({
    queryKey: ['counter', 'delivery-quote', tenantId, normalizedZipCode],
    queryFn: () =>
      OrderService.getDeliveryQuote(tenantId as string, normalizedZipCode),
    enabled: !!tenantId && normalizedZipCode.length === 8,
  })

  return { quote: query.data ?? undefined, isQuoting: query.isFetching }
}
