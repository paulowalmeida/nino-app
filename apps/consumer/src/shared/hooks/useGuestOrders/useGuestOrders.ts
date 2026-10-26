import { useEffect, useState } from 'react'

import type { GuestOrderReference } from '@shared/lib/last-order/last-order'
import {
  readGuestOrders,
  subscribeGuestOrders,
} from '@shared/lib/last-order/last-order'

export const useGuestOrders = (slug?: string): GuestOrderReference[] => {
  const [orders, setOrders] = useState(() => readGuestOrders(slug))
  const [ordersSlug, setOrdersSlug] = useState(slug)

  if (ordersSlug !== slug) {
    setOrdersSlug(slug)
    setOrders(readGuestOrders(slug))
  }

  useEffect(
    () => subscribeGuestOrders(() => setOrders(readGuestOrders(slug))),
    [slug]
  )

  return orders
}
