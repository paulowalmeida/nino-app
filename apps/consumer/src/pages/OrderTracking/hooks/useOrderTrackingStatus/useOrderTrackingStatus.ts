import {
  useCustomerSession,
} from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
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
  const { customer, isPending: isSessionPending } = useCustomerSession()
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(orderId, token, !!customer)

  return {
    order,
    isPending,
    isSessionPending,
    isError,
    canAsk: !!token || !!customer,
    done: order ? isTerminal(order.status) : false,
  }
}
