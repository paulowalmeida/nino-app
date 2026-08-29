import { useParams } from 'react-router'

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
    ['COMPLETED', 'CANCELLED'],
    'COUNTER',
    undefined
  )
  const detailQuery = useOrders(
    tenantId,
    tabId,
    ['PENDING', 'COMPLETED', 'CANCELLED'],
    'COUNTER',
    undefined
  )

  return {
    openOrders: openQuery.orders,
    closedOrders: closedQuery.orders,
    order: detailQuery.orders[0],
    isPending: tabId ? detailQuery.isPending : openQuery.isPending,
    isError: tabId ? detailQuery.isError : openQuery.isError,
  }
}
