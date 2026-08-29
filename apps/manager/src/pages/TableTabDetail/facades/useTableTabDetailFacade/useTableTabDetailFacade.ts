import { useParams } from 'react-router'

import { useTableTabItemCancellation } from '@pages/TableTabDetail/hooks/useTableTabItemCancellation/useTableTabItemCancellation'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useTableTabDetailFacade = () => {
  const { tabId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
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
    'TABLE_TAB',
    undefined
  )
  const itemCancellation = useTableTabItemCancellation(tenantId)

  return {
    order: detailQuery.orders[0],
    cancelItem: itemCancellation.cancelItem,
    isCancellingItem: itemCancellation.isCancelling,
    isPending: detailQuery.isPending,
    isError: detailQuery.isError,
  }
}
