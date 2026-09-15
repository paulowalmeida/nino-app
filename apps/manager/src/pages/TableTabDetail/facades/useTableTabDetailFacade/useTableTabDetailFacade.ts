import { useParams } from 'react-router'

import { useTableTabItemCancellation } from '@pages/TableTabDetail/hooks/useTableTabItemCancellation/useTableTabItemCancellation'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useTableTabDetailFacade = () => {
  const { tabId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const detailQuery = useOrders(
    unitId,
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
  const itemCancellation = useTableTabItemCancellation(unitId)

  return {
    order: detailQuery.orders[0],
    cancelItem: itemCancellation.cancelItem,
    isCancellingItem: itemCancellation.isCancelling,
    isPending: detailQuery.isPending,
    isError: detailQuery.isError,
  }
}
