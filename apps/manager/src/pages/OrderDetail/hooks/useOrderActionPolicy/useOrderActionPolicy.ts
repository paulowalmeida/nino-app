import type { OrderActionPolicy } from '@pages/OrderDetail/types/OrderActionPolicy.type'
import { canCancel } from '@pages/OrderDetail/utils/order-action-policy'
import type { Order } from '@shared/types/order/order'
import { nextStep } from '@shared/utils/order-action-policy/order-action-policy'

/* WHY: um pedido cancelado ainda mostra pagamento pendente na resposta da
 * API — sem esta porta a tela ofereceria "recebi o pagamento" de uma venda
 * que não existe mais.
 */
export const useOrderActionPolicy = (
  order: Order | undefined
): OrderActionPolicy => {
  if (!order) {
    return {
      nextStep: null,
      canAdvance: false,
      canMarkPaid: false,
      canCancelOrder: false,
    }
  }

  const step = nextStep(order)
  const isCancelled = order.status === 'CANCELLED'

  return {
    nextStep: step,
    canAdvance: step !== null,
    canMarkPaid: order.paymentStatus === 'PENDING' && !isCancelled,
    canCancelOrder: canCancel(order.status),
  }
}
