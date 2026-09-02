import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import type { OrderCreatedResponse } from '@custom_types/order/order-created-response'
import { readLastOrder } from '@utils/last-order'

export const useCheckoutResume = (
  pathSlug: string | null,
  created: OrderCreatedResponse | undefined,
  cartItemCount: number
) => {
  const navigate = useNavigate()
  const [lastOrder] = useState(readLastOrder)

  useEffect(() => {
    if (created || cartItemCount > 0 || !lastOrder) return

    void navigate(
      `${pathSlug ? `/${pathSlug}` : ''}/pedido/` +
        `${lastOrder.orderId}?token=${lastOrder.token}`,
      { replace: true }
    )
  }, [created, cartItemCount, lastOrder, navigate, pathSlug])

  return lastOrder
}
