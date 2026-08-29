import { useKitchenAssignee } from '@pages/Kitchen/hooks/useKitchenAssignee/useKitchenAssignee'
import { useKitchenCommands } from '@pages/Kitchen/hooks/useKitchenCommands/useKitchenCommands'
import { useKitchenOrders } from '@pages/Kitchen/hooks/useKitchenOrders/useKitchenOrders'
import { useKitchenWall } from '@pages/Kitchen/hooks/useKitchenWall/useKitchenWall'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useSalesFormats } from '@shared/hooks/settings/useSalesFormats/useSalesFormats'
import { useStaff } from '@shared/hooks/team/useStaff/useStaff'

export const useKitchenFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const kitchenOrders = useKitchenOrders(tenantId)
  const statusMutation = useOrderStatus(tenantId)
  const commands = useKitchenCommands(statusMutation.mutate)
  const kitchenAssignee = useKitchenAssignee(tenantId)
  const salesFormats = useSalesFormats(tenantId)
  const staff = useStaff(tenantId)
  const wall = useKitchenWall(
    kitchenOrders.ordersByStage,
    commands.advanceOrder
  )

  return {
    orders: kitchenOrders.orders,
    finishedOrders: kitchenOrders.finishedOrders,
    salesFormats: salesFormats.formats,
    staff: staff.data?.data ?? [],
    preparationMinutes: salesFormats.preparationMinutes,
    isPending: kitchenOrders.isPending,
    isError: kitchenOrders.isError,
    advanceOrder: commands.advanceOrder,
    changeKitchenAssignee: kitchenAssignee.mutate,
    isChangingKitchenAssignee: kitchenAssignee.isPending,
    changingKitchenOrderId: kitchenAssignee.variables?.orderId,
    isAdvancing: statusMutation.isPending,
    advancingOrderId: statusMutation.variables?.orderId,
    ordersByStage: kitchenOrders.ordersByStage,
    draggingOrder: wall.draggingOrder,
    arrangement: wall.arrangement,
    liftOrder: wall.liftOrder,
    dropOrder: wall.dropOrder,
  }
}
