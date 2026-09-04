import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import { brl } from '@shared/utils/money/money'

export const useCounterAvailability = (
  tenantId: string | null,
  zoneId: string
) => {
  const query = useQuery({
    queryKey: [...queryKeys.orders.all(tenantId ?? ''), 'availability'],
    queryFn: () => OrderService.getAvailability(tenantId as string),
    enabled: !!tenantId,
  })

  return {
    zones: (query.data?.deliveryZones ?? []).map(({ id, name, fee }) => ({
      value: id,
      label: `${name} · ${brl(fee)}`,
    })),
    fee: query.data?.deliveryZones.find(({ id }) => id === zoneId)?.fee ?? 0,
    storeAddress: query.data?.storeAddress ?? { city: '', state: '' },
    deliveryCities: query.data?.deliveryCities ?? [],
  }
}
