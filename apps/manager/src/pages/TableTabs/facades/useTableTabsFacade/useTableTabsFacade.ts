import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useTableTabsFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const query = useOrders(tenantId, undefined, undefined, 'COUNTER', 'PENDING')

  return {
    orders: query.orders,
    isPending: query.isPending,
    isError: query.isError,
  }
}
