import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useTableTabsFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const openQuery = useOrders(
    tenantId,
    undefined,
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'],
    'TABLE_TAB',
    undefined
  )
  const closedQuery = useOrders(
    tenantId,
    undefined,
    ['DELIVERED', 'COMPLETED', 'CANCELLED'],
    'TABLE_TAB',
    undefined
  )
  return {
    openOrders: openQuery.orders,
    closedOrders: closedQuery.orders,
    isPending: openQuery.isPending || closedQuery.isPending,
    isError: openQuery.isError || closedQuery.isError,
  }
}
