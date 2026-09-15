import { useOrdersFilters } from '@pages/Orders/hooks/useOrdersFilters/useOrdersFilters'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useOrdersFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const {
    isSearching,
    search,
    stage,
    statuses,
    channel,
    term,
    setStage,
    setTerm,
  } = useOrdersFilters()
  const ordersQuery = useOrders(unitId, search, statuses, channel)
  const statusMutation = useOrderStatus(unitId)
  const queueSummary = useQueueSummary(unitId)

  return {
    orders: ordersQuery.orders,
    isPending: ordersQuery.isPending,
    isError: ordersQuery.isError,
    hasNextPage: ordersQuery.hasNextPage,
    isFetchingNextPage: ordersQuery.isFetchingNextPage,
    fetchNextPage: ordersQuery.fetchNextPage,
    summary: queueSummary.data,
    advanceOrder: statusMutation.mutate,
    isAdvancing: statusMutation.isPending,
    advancingOrderId: statusMutation.variables?.orderId,
    isSearching,
    search,
    stage,
    term,
    setStage,
    setTerm,
  }
}
