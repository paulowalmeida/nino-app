import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { isTerminal } from '@utils/order-journey'

/**
 * Há pedido em andamento nesta loja? Convidado conta pelos pedidos guardados
 * neste dispositivo; quem tem sessão, pelos pedidos da conta que ainda não
 * terminaram. É o sinal que acende o acompanhamento no topo e na barra.
 */
export const useHasActiveOrder = (slug: string | undefined): boolean => {
  const { consumer } = useConsumerSession()
  const guestOrders = useGuestOrders(slug)
  const { data: myOrders } = useMyOrders(!!consumer)

  return (
    guestOrders.length > 0 ||
    (myOrders ?? []).some((order) => !isTerminal(order.status))
  )
}
