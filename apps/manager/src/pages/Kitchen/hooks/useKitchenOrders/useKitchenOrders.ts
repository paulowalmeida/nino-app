import {
  KITCHEN_FINISHED_STATUSES,
  KITCHEN_FINISHED_WINDOW_MINUTES,
  KITCHEN_STATUSES,
} from '@pages/Kitchen/constants/kitchen.constants'
import { recentlyFinished } from '@pages/Kitchen/utils/recently-finished/recently-finished'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'

export const useKitchenOrders = (unitId: string | null) => {
  const ordersQuery = useOrders(
    unitId,
    undefined,
    KITCHEN_STATUSES,
    undefined,
    undefined,
    true
  )
  const finishedQuery = useOrders(
    unitId,
    undefined,
    KITCHEN_FINISHED_STATUSES,
    undefined,
    undefined,
    true
  )
  const finishedOrders = recentlyFinished(
    finishedQuery.orders,
    KITCHEN_FINISHED_WINDOW_MINUTES
  )

  return {
    orders: ordersQuery.orders,
    finishedOrders,
    ordersByStage: {
      waiting: ordersQuery.orders.filter(({ status }) => status === 'ACCEPTED'),
      preparing: ordersQuery.orders.filter(
        ({ status }) => status === 'PREPARING'
      ),
      finished: finishedOrders,
    },
    // The finished column is part of the same wall. Do not expose its empty
    // state while its own request is still in flight.
    isPending: ordersQuery.isPending || finishedQuery.isPending,
    isError: ordersQuery.isError || finishedQuery.isError,
  }
}
