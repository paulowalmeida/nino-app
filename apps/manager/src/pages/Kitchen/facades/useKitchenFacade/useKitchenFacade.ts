import { useKitchenCommands } from '@pages/Kitchen/hooks/useKitchenCommands/useKitchenCommands'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useKitchenFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const ordersQuery = useOrders(tenantId)
  const statusMutation = useOrderStatus(tenantId)
  const commands = useKitchenCommands(statusMutation.mutate)

  return {
    orders: ordersQuery.orders,
    isPending: ordersQuery.isPending,
    advanceOrder: commands.advanceOrder,
    isAdvancing: statusMutation.isPending,
    advancingOrderId: statusMutation.variables?.orderId,
  }
}
