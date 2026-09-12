import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { isTerminal } from '@utils/order-journey'

/**
 * Sem token e sem sessão não há como provar de quem é o pedido: a consulta
 * nem sai, então esperar por ela seria um esqueleto eterno — daí `canAsk`
 * separado de `isPending`.
 */
export const useOrderTrackingStatus = (
  orderId: string | undefined,
  token: string | undefined
) => {
  const { consumer, isPending: isSessionPending } = useConsumerSession()
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(orderId, token, !!consumer)

  return {
    order,
    isPending,
    isSessionPending,
    isError,
    canAsk: !!token || !!consumer,
    done: order ? isTerminal(order.status) : false,
  }
}
