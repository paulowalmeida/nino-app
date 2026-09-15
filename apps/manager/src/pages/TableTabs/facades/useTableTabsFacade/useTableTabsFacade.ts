import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useTableTabsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const openQuery = useOrders(
    unitId,
    undefined,
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'],
    'TABLE_TAB',
    undefined
  )
  const closedQuery = useOrders(
    unitId,
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
