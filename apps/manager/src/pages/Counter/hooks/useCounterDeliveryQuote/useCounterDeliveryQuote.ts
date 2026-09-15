import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'

export const useCounterDeliveryQuote = (
  unitId: string | null,
  zipCode: string
) => {
  const normalizedZipCode = zipCode.replace(/\D/g, '')
  const query = useQuery({
    queryKey: ['counter', 'delivery-quote', unitId, normalizedZipCode],
    queryFn: () =>
      OrderService.getDeliveryQuote(unitId as string, normalizedZipCode),
    enabled: !!unitId && normalizedZipCode.length === 8,
  })

  return { quote: query.data ?? undefined, isQuoting: query.isFetching }
}
