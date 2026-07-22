import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { getGuestOrderStatus } from '@services/order/order.service'

const TERMINAL = new Set(['DELIVERED', 'COMPLETED', 'CANCELLED'])

/** Reconsulta o status a cada 10s até o pedido chegar a um estado final. */
export const useGuestOrderStatus = (
  orderId: string | undefined,
  token: string | undefined
) =>
  useQuery<GuestOrderStatus>({
    queryKey: queryKeys.guestOrder.byId(orderId ?? ''),
    queryFn: () => getGuestOrderStatus(orderId as string, token as string),
    enabled: !!orderId && !!token,
    refetchInterval: (query) =>
      query.state.data && TERMINAL.has(query.state.data.status)
        ? false
        : 10000,
  })
