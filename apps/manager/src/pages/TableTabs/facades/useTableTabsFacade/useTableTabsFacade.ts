import { useParams } from 'react-router'

import { useTableTabItemCancellation } from '@pages/TableTabDetail/hooks/useTableTabItemCancellation/useTableTabItemCancellation'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useTableTabsFacade = () => {
  const { tabId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const openQuery = useOrders(
    tenantId,
    undefined,
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'],
    'COUNTER',
    undefined
  )
  const closedQuery = useOrders(
    tenantId,
    undefined,
    ['DELIVERED', 'COMPLETED', 'CANCELLED'],
    'COUNTER',
    undefined
  )
  const detailQuery = useOrders(
    tenantId,
    tabId,
    [
      'PENDING',
      'ACCEPTED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED',
    ],
    'COUNTER',
    undefined
  )
  const order = detailQuery.orders[0]
  const itemCancellation = useTableTabItemCancellation(tenantId)

  return {
    openOrders: openQuery.orders,
    closedOrders: closedQuery.orders,
    order,
    cancelItem: itemCancellation.cancelItem,
    isCancellingItem: itemCancellation.isCancelling,
    isPending: tabId ? detailQuery.isPending : openQuery.isPending,
    isError: tabId ? detailQuery.isError : openQuery.isError,
  }
}
