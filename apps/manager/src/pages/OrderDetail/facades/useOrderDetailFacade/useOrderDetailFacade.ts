import { useParams } from 'react-router'

import { useOrder } from '@pages/OrderDetail/hooks/useOrder/useOrder'
import { useOrderActionPolicy } from '@pages/OrderDetail/hooks/useOrderActionPolicy/useOrderActionPolicy'
import { useOrderCancellation } from '@pages/OrderDetail/hooks/useOrderCancellation/useOrderCancellation'
import { useOrderPayment } from '@pages/OrderDetail/hooks/useOrderPayment/useOrderPayment'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useOrderDetailFacade = () => {
  const { orderId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const orderQuery = useOrder(tenantId, orderId ?? '')
  const statusMutation = useOrderStatus(tenantId)
  const paymentMutation = useOrderPayment(tenantId)
  const policy = useOrderActionPolicy(orderQuery.data)
  const cancellation = useOrderCancellation(tenantId, orderId ?? '')

  return {
    order: orderQuery.data,
    isPending: orderQuery.isPending,
    isError: orderQuery.isError,
    nextStep: policy.nextStep,
    canAdvance: policy.canAdvance,
    canMarkPaid: policy.canMarkPaid,
    canCancelOrder: policy.canCancelOrder,
    advanceOrder: statusMutation.mutate,
    isAdvancing: statusMutation.isPending,
    markOrderPaid: paymentMutation.mutate,
    isPaying: paymentMutation.isPending,
    cancelOrder: cancellation.cancelOrder,
    isCancelling: cancellation.isCancelling,
  }
}
