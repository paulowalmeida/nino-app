import { useParams } from 'react-router'

import { useOrder } from '@pages/OrderDetail/hooks/useOrder/useOrder'
import { useOrderActionPolicy } from '@pages/OrderDetail/hooks/useOrderActionPolicy/useOrderActionPolicy'
import { useOrderCancellation } from '@pages/OrderDetail/hooks/useOrderCancellation/useOrderCancellation'
import { useOrderPayment } from '@pages/OrderDetail/hooks/useOrderPayment/useOrderPayment'
import { useOrderReceipt } from '@pages/OrderDetail/hooks/useOrderReceipt/useOrderReceipt'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useOrderDetailFacade = () => {
  const { orderId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const orderQuery = useOrder(unitId, orderId ?? '')
  const statusMutation = useOrderStatus(unitId)
  const paymentMutation = useOrderPayment(unitId)
  const policy = useOrderActionPolicy(orderQuery.data)
  const cancellation = useOrderCancellation(unitId, orderId ?? '')
  const receipt = useOrderReceipt(unitId)

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
    downloadReceipt: receipt.downloadReceipt,
    isDownloadingReceipt: receipt.isDownloadingReceipt,
  }
}
