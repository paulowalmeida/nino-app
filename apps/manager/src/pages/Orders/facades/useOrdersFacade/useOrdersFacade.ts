import { useOrdersFilters } from '@pages/Orders/hooks/useOrdersFilters/useOrdersFilters'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useOrdersFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
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
  const ordersQuery = useOrders(tenantId, search, statuses, channel)
  const statusMutation = useOrderStatus(tenantId)
  const queueSummary = useQueueSummary(tenantId)

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
