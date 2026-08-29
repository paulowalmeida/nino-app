import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { orderService } from '@shared/services/order/order.service'

const TERMINAL = new Set(['DELIVERED', 'COMPLETED', 'CANCELLED'])

/**
 * Reconsulta o status a cada 10s até o pedido chegar a um estado final.
 *
 * Duas portas para o mesmo dado: com token de acompanhamento (o link que
 * chegou no WhatsApp) ou pela sessão do cliente logado, que abre o próprio
 * pedido a partir do histórico — lá não existe token nenhum para carregar.
 */
export const useGuestOrderStatus = (
  orderId: string | undefined,
  token: string | undefined,
  hasSession = false
) =>
  useQuery<GuestOrderStatus>({
    queryKey: queryKeys.guestOrder.byId(orderId ?? ''),
    queryFn: () =>
      token
        ? orderService.getGuestStatus(orderId as string, token)
        : orderService.getMyStatus(orderId as string),
    enabled: !!orderId && (!!token || hasSession),
    refetchInterval: (query) =>
      query.state.data && TERMINAL.has(query.state.data.status) ? false : 10000,
  })
